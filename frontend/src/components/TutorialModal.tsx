import React from 'react';
import { Modal, Button, Steps, Typography, Space, Divider } from 'antd';
import { 
  PlayCircleOutlined, 
  SearchOutlined, 
  CameraOutlined, 
  BarChartOutlined,
  CloseOutlined 
} from '@ant-design/icons';
import './TutorialModal.scss';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;

interface TutorialModalProps {
  visible: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      title="使用教程"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button 
          key="close" 
          type="primary" 
          onClick={onClose}
          icon={<CloseOutlined />}
        >
          开始使用
        </Button>
      ]}
      width={700}
      centered
      className="tutorial-modal"
    >
      <div className="tutorial-content">
        <Paragraph>
          欢迎使用实时心率检测系统！本教程将引导您快速上手使用。
        </Paragraph>
        
        <Divider />
        
        <Steps direction="vertical" current={-1}>
          <Step
            title="重要提示"
            description="本项目仅用于演示，不构成医疗建议"
            icon={<CloseOutlined />}
            status="wait"
          />

          <Step
            title="第一步：准备工作"
            description={
              <Space direction="vertical" size="small">
                <Text>• 确保摄像头正常工作</Text>
                <Text>• 选择光线充足的环境</Text>
                <Text>• 保持面部正对摄像头</Text>
              </Space>
            }
            icon={<CameraOutlined />}
          />
          
          <Step
            title="第二步：开始检测"
            description={
              <Space direction="vertical" size="small">
                <Text>• 点击 <Text strong>"开始检测"</Text> 按钮</Text>
                <Text>• 允许浏览器访问摄像头权限</Text>
                <Text>• 调整好合适的姿势，确保面部正对摄像头，且周围环境光线充足</Text>
                <Text>• 点击 <Text strong>"固定人脸位置"</Text> 按钮</Text>
              </Space>
            }
            icon={<PlayCircleOutlined />}
          />
          
          <Step
            title="第三步：优化检测"
            description={
              <Space direction="vertical" size="small">
                <Text>• 保持头部静止约20-30 秒，以视频窗口计时指引为准</Text>
                <Text>• 避免说话或大幅移动</Text>
              </Space>
            }
            icon={<SearchOutlined />}
          />
          
          <Step
            title="第四步：查看结果"
            description={
              <Space direction="vertical" size="small">
                <Text>• 观察右侧实时心率图表</Text>
                <Text>• 查看信号质量指示器</Text>
                <Text>• 等待数据稳定后，即信号质量达到100%后，读取准确心率</Text>
              </Space>
            }
            icon={<BarChartOutlined />}
          />
        </Steps>
        
        <Divider />
        
        <div className="tips-section">
          <Title level={5}>💡 使用小贴士</Title>
          <Space direction="vertical" size="small">
            <Text type="secondary">• 最佳检测距离：30-50厘米</Text>
            <Text type="secondary">• 自然光线下效果最佳</Text>
            <Text type="secondary">• 避免强光直射或背光</Text>
            <Text type="secondary">• 保持放松，正常呼吸</Text>
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default TutorialModal;