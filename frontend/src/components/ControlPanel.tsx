import { useState, useEffect } from 'react';
import { Card, Button, Radio, Slider, Space, message, Divider } from 'antd';
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  CameraOutlined,
  SearchOutlined,
  BarChartOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { usePulseStore } from '@/stores/pulseStore';
import wsService from '@/services/websocket';
import apiService from '@/services/api';
import { downloadBlob } from '@/utils/helpers';
import type { CameraInfo } from '@/types';
import './ControlPanel.scss';

const ControlPanel = () => {
  const {
    isConnected,
    isStreaming,
    sessionId,
    setConnected,
    setStreaming,
    setFrameData,
    setBpm,
    setSignalQuality,
    setFaceDetected,
    setError,
    reset,
  } = usePulseStore();

  const [cameras, setCameras] = useState<CameraInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [bpmRange, setBpmRange] = useState<[number, number]>([50, 180]);
  const [loading, setLoading] = useState(false);

  // Load cameras on mount
  useEffect(() => {
    loadCameras();
  }, []);

  // Setup WebSocket handlers
  useEffect(() => {
    const unsubscribeMessage = wsService.onMessage((data) => {
      setFrameData(data);
      if (data.bpm !== null) {
        setBpm(data.bpm);
      }
      setSignalQuality(data.signal_quality);
      setFaceDetected(data.face_detected);
    });

    const unsubscribeError = wsService.onError((error) => {
      message.error(error);
      setError(error);
    });

    const unsubscribeStatus = wsService.onStatus((status) => {
      setConnected(status === 'connected');
    });

    return () => {
      unsubscribeMessage();
      unsubscribeError();
      unsubscribeStatus();
    };
  }, []);

  const loadCameras = async () => {
    try {
      const response = await apiService.getCameras();
      setCameras(response.cameras);
    } catch (error) {
      message.error('Failed to load cameras');
      console.error(error);
    }
  };

  const handleStartStop = async () => {
    setLoading(true);
    try {
      if (!isStreaming) {
        // Connect WebSocket if not connected
        if (!isConnected) {
          await wsService.connect();
          setConnected(true);
        }

        // Start streaming
        wsService.startStream(selectedCamera);
        setStreaming(true);
        message.success('检测已开始');
      } else {
        // Stop streaming
        wsService.stopStream();
        setStreaming(false);
        reset();
        message.info('检测已停止');
      }
    } catch (error) {
      message.error('启动/停止检测失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSearch = () => {
    if (isStreaming) {
      wsService.toggleSearch();
      message.info('人脸搜索已切换');
    }
  };

  const handleExportData = async () => {
    if (!sessionId) {
      message.warning('没有活跃会话可导出');
      return;
    }

    try {
      const blob = await apiService.exportData(sessionId);
      const filename = `pulse-data-${Date.now()}.csv`;
      downloadBlob(blob, filename);
      message.success('数据导出成功');
    } catch (error) {
      message.error('导出数据失败');
      console.error(error);
    }
  };

  return (
    <Card title="控制面板" className="control-panel-card">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Start/Stop Button */}
        <Button
          type="primary"
          size="large"
          block
          icon={isStreaming ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
          onClick={handleStartStop}
          loading={loading}
          danger={isStreaming}
        >
          {isStreaming ? '停止检测' : '开始检测'}
        </Button>

        <Divider />

        {/* Camera Selection */}
        <div className="control-section">
          <label className="control-label">
            <CameraOutlined /> 摄像头选择
          </label>
          <Radio.Group
            value={selectedCamera}
            onChange={(e) => setSelectedCamera(e.target.value)}
            disabled={isStreaming}
          >
            <Space direction="vertical">
              {cameras.map((camera) => (
                <Radio key={camera.id} value={camera.id} disabled={!camera.available}>
                  {camera.name} {!camera.available && '(不可用)'}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>

        <Divider />

        {/* BPM Range */}
        <div className="control-section">
          <label className="control-label">
            <BarChartOutlined /> 心率范围: {bpmRange[0]} - {bpmRange[1]}
          </label>
          <Slider
            range
            min={30}
            max={220}
            value={bpmRange}
            onChange={(value) => setBpmRange(value as [number, number])}
            disabled={isStreaming}
            marks={{
              30: '30',
              50: '50',
              100: '100',
              150: '150',
              180: '180',
              220: '220',
            }}
          />
        </div>

        <Divider />

        {/* Action Buttons */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            icon={<SearchOutlined />}
            onClick={handleToggleSearch}
            disabled={!isStreaming}
            block
          >
            切换人脸搜索
          </Button>

          <Button
            icon={<DownloadOutlined />}
            onClick={handleExportData}
            disabled={!sessionId}
            block
          >
            导出数据 (CSV)
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default ControlPanel;