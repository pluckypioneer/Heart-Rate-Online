import { Card, Empty, Row, Col, Statistic, Progress, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { usePulseStore } from '@/stores/pulseStore';
import { formatBpm, getSignalQualityColor, getSignalQualityText } from '@/utils/helpers';
import './DataChart.scss';

const DataChart = () => {
  const { frameData } = usePulseStore();

  // Raw signal chart options
  const rawSignalOption = {
    title: {
      text: '原始信号 (时域)',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
    },
    xAxis: {
      type: 'category',
      name: '样本',
      data: frameData?.raw_signal?.map((_, i) => i) || [],
    },
    yAxis: {
      type: 'value',
      name: '强度',
    },
    series: [
      {
        data: frameData?.raw_signal || [],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1890ff',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  };

  // FFT chart options
  const fftOption = {
    title: {
      text: '功率谱 (频域)',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '15%',
    },
    xAxis: {
      type: 'category',
      name: '频率 (Hz)',
      data:
        frameData?.fft_data?.freqs.map((f) => f.toFixed(2)) || [],
    },
    yAxis: {
      type: 'value',
      name: '功率',
    },
    series: [
      {
        data: frameData?.fft_data?.power || [],
        type: 'bar',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#52c41a' },
              { offset: 1, color: '#95de64' },
            ],
          },
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const param = params[0];
        const freq = parseFloat(param.name);
        const bpm = (freq * 60).toFixed(1);
        return `频率: ${param.name} Hz<br/>心率: ${bpm} BPM<br/>功率: ${param.value.toFixed(2)}`;
      },
    },
    markPoint: {
      data: [
        {
          type: 'max',
          name: '峰值',
        },
      ],
    },
  };

  const hasData = frameData?.raw_signal || frameData?.fft_data;

  // 计算统计数据
  const stats = {
    signalLength: frameData?.raw_signal?.length || 0,
    maxPower: frameData?.fft_data ? Math.max(...frameData.fft_data.power) : 0,
    dominantFreq: frameData?.fft_data ? 
      frameData.fft_data.freqs[frameData.fft_data.power.indexOf(Math.max(...frameData.fft_data.power))] : 0,
    dominantBpm: frameData?.fft_data ? 
      frameData.fft_data.freqs[frameData.fft_data.power.indexOf(Math.max(...frameData.fft_data.power))] * 60 : 0,
  };

  return (
    <Card title="数据可视化" className="data-chart-card">
      {!hasData ? (
        <Empty description="暂无数据。开始检测以查看图表。" />
      ) : (
        <>
          {/* 统计信息卡片 */}
          <div className="stats-container">
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="当前心率"
                  value={formatBpm(frameData.bpm)}
                  suffix="BPM"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="信号质量"
                  value={frameData.signal_quality * 100}
                  precision={1}
                  suffix="%"
                  valueStyle={{ 
                    color: getSignalQualityColor(frameData.signal_quality)
                  }}
                />
                <div style={{ marginTop: 4 }}>
                  <Tag color={getSignalQualityColor(frameData.signal_quality)}>
                    {getSignalQualityText(frameData.signal_quality)}
                  </Tag>
                </div>
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="信号长度"
                  value={stats.signalLength}
                  suffix="样本"
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="主频心率"
                  value={stats.dominantBpm.toFixed(1)}
                  suffix="BPM"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
            
            {/* 信号质量进度条 */}
            <div className="quality-progress">
              <div className="progress-label">信号质量</div>
              <Progress
                percent={frameData.signal_quality * 100}
                strokeColor={getSignalQualityColor(frameData.signal_quality)}
                showInfo={true}
                format={(percent) => `${percent?.toFixed(1)}%`}
              />
            </div>
          </div>

          {/* 图表容器 */}
          <div className="charts-container">
            <div className="chart-wrapper">
              <ReactECharts option={rawSignalOption} style={{ height: '250px' }} />
            </div>
            <div className="chart-wrapper">
              <ReactECharts option={fftOption} style={{ height: '250px' }} />
            </div>
          </div>

          {/* 数据摘要 */}
          <div className="data-summary">
            <Row gutter={[16, 8]}>
              <Col span={24}>
                <div className="summary-title">数据摘要</div>
              </Col>
              <Col xs={12} md={8}>
                <div className="summary-item">
                  <span className="label">峰值功率:</span>
                  <span className="value">{stats.maxPower.toFixed(2)}</span>
                </div>
              </Col>
              <Col xs={12} md={8}>
                <div className="summary-item">
                  <span className="label">主频率:</span>
                  <span className="value">{stats.dominantFreq.toFixed(2)} Hz</span>
                </div>
              </Col>
              <Col xs={12} md={8}>
                <div className="summary-item">
                  <span className="label">人脸检测:</span>
                  <Tag color={frameData.face_detected ? 'green' : 'red'}>
                    {frameData.face_detected ? '检测到' : '未检测到'}
                  </Tag>
                </div>
              </Col>
            </Row>
          </div>
        </>
      )}
    </Card>
  );
};

export default DataChart;