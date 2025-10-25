import { useEffect, useRef } from 'react';
import { Card, Spin, Alert } from 'antd';
import { usePulseStore } from '@/stores/pulseStore';
import './VideoStream.scss';

const VideoStream = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { frameData, isStreaming, isConnected, error } = usePulseStore();

  useEffect(() => {
    // Draw frame on canvas
    if (canvasRef.current && frameData?.image) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = `data:image/jpeg;base64,${frameData.image}`;
    }
  }, [frameData]);

  return (
    <Card
      title="实时视频流"
      className="video-stream-card"
      extra={
        <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? '● 已连接' : '○ 未连接'}
        </span>
      }
    >
      <div className="video-container">
        {error && (
          <Alert
            message="错误"
            description={error}
            type="error"
            showIcon
            closable
            style={{ marginBottom: '16px' }}
          />
        )}

        {!isStreaming && !error && (
          <div className="video-placeholder">
            <p>点击"开始检测"按钮开始</p>
          </div>
        )}

        {isStreaming && !frameData && (
          <div className="video-loading">
            <Spin size="large" tip="正在加载视频流..." />
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="video-canvas"
          style={{ display: frameData ? 'block' : 'none' }}
        />

        {frameData && (
          <div className="video-info">
            <span className={`face-status ${frameData.face_detected ? 'detected' : 'not-detected'}`}>
              {frameData.face_detected ? '✓ 检测到人脸' : '✗ 未检测到人脸'}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoStream;