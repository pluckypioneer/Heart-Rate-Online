import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, message, Tag, Empty } from 'antd';
import { ReloadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import apiService from '@/services/api';
import type { SessionData } from '@/types';
import { formatTimestamp, formatDuration } from '@/utils/helpers';
import './HistoryTable.scss';

const HistoryTable: React.FC = () => {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  // 加载历史会话数据
  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await apiService.getHistory(20);
      setSessions(response.sessions);
    } catch (error) {
      message.error('加载历史数据失败');
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  // 导出会话数据
  const handleExport = async (sessionId: string) => {
    try {
      const blob = await apiService.exportData(sessionId);
      const filename = `pulse-session-${sessionId}.csv`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('数据导出成功');
    } catch (error) {
      message.error('导出数据失败');
      console.error('Export failed:', error);
    }
  };

  // 查看会话详情
  const handleViewDetails = (sessionId: string) => {
    setSelectedSession(selectedSession === sessionId ? null : sessionId);
  };

  // 组件挂载时加载数据
  useEffect(() => {
    loadHistory();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: '会话ID',
      dataIndex: 'session_id',
      key: 'session_id',
      width: 120,
      render: (id: string) => (
        <span className="session-id">{id.slice(0, 8)}...</span>
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'start_time',
      key: 'start_time',
      width: 160,
      render: (time: string) => formatTimestamp(time),
    },
    {
      title: '持续时间',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number) => formatDuration(duration),
    },
    {
      title: '平均心率',
      dataIndex: 'avg_bpm',
      key: 'avg_bpm',
      width: 100,
      render: (bpm: number) => (
        <span className="bpm-value">{bpm.toFixed(1)} BPM</span>
      ),
    },
    {
      title: '心率范围',
      key: 'bpm_range',
      width: 120,
      render: (record: SessionData) => (
        <span className="bpm-range">
          {record.min_bpm.toFixed(0)}-{record.max_bpm.toFixed(0)}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (record: SessionData) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewDetails(record.session_id)}
            title="查看详情"
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            size="small"
            onClick={() => handleExport(record.session_id)}
            title="导出数据"
          />
        </Space>
      ),
    },
  ];

  // 扩展行渲染
  const expandedRowRender = (record: SessionData) => (
    <div className="session-details">
      <div className="detail-item">
        <span className="label">完整会话ID:</span>
        <span className="value">{record.session_id}</span>
      </div>
      <div className="detail-item">
        <span className="label">开始时间:</span>
        <span className="value">{formatTimestamp(record.start_time)}</span>
      </div>
      <div className="detail-item">
        <span className="label">持续时间:</span>
        <span className="value">{formatDuration(record.duration)}</span>
      </div>
      <div className="detail-item">
        <span className="label">平均心率:</span>
        <Tag color="blue">{record.avg_bpm.toFixed(1)} BPM</Tag>
      </div>
      <div className="detail-item">
        <span className="label">心率范围:</span>
        <Tag color="green">{record.min_bpm.toFixed(0)}</Tag>
        <span className="separator">-</span>
        <Tag color="red">{record.max_bpm.toFixed(0)}</Tag>
      </div>
    </div>
  );

  return (
    <Card 
      title="历史会话记录" 
      className="history-table-card"
      extra={
        <Button
          icon={<ReloadOutlined />}
          size="small"
          onClick={loadHistory}
          loading={loading}
        >
          刷新
        </Button>
      }
    >
      {sessions.length === 0 && !loading ? (
        <Empty description="暂无历史会话记录" />
      ) : (
        <Table
          columns={columns}
          dataSource={sessions}
          loading={loading}
          size="small"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          expandable={{
            expandedRowRender,
            expandedRowKeys: selectedSession ? [selectedSession] : [],
            onExpand: (expanded, record) => {
              setSelectedSession(expanded ? record.session_id : null);
            },
          }}
          scroll={{ x: 800 }}
        />
      )}
    </Card>
  );
};

export default HistoryTable;