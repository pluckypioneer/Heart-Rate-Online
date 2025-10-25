import { Card, Progress, Statistic, Row, Col } from 'antd';
import { HeartOutlined, SignalFilled } from '@ant-design/icons';
import { usePulseStore } from '@/stores/pulseStore';
import { formatBpm, getSignalQualityColor, getSignalQualityText } from '@/utils/helpers';
import './BPMDisplay.scss';

const BPMDisplay = () => {
  const { currentBpm, signalQuality, faceDetected } = usePulseStore();

  const qualityPercent = Math.round(signalQuality * 100);
  const qualityColor = getSignalQualityColor(signalQuality);
  const qualityText = getSignalQualityText(signalQuality);

  return (
    <Card className="bpm-display-card">
      <Row gutter={24}>
        <Col xs={24} sm={12}>
          <div className="bpm-main">
            <HeartOutlined className="bpm-icon" style={{ color: currentBpm ? '#ff4d4f' : '#ccc' }} />
            <Statistic
              title="当前心率"
              value={faceDetected ? formatBpm(currentBpm) : '--'}
              suffix="BPM"
              valueStyle={{
                fontSize: '48px',
                fontWeight: 'bold',
                color: faceDetected && currentBpm ? '#ff4d4f' : '#999',
              }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12}>
          <div className="signal-quality">
            <div className="quality-header">
              <SignalFilled style={{ color: qualityColor, marginRight: '8px' }} />
              <span>信号质量: {qualityText}</span>
            </div>
            <Progress
              percent={qualityPercent}
              strokeColor={qualityColor}
              showInfo={true}
              format={(percent) => `${percent}%`}
            />
            <div className="status-info">
              <span className={faceDetected ? 'status-active' : 'status-inactive'}>
                {faceDetected ? '● 人脸锁定' : '○ 搜索中...'}
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default BPMDisplay;