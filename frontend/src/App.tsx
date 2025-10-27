import { Layout, Row, Col } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import VideoStream from './components/VideoStream';
import BPMDisplay from './components/BPMDisplay';
import DataChart from './components/DataChart';
import ControlPanel from './components/ControlPanel';
import TutorialModal from './components/TutorialModal';
import './styles/global.scss';

const { Header, Content, Footer } = Layout;

function App() {
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // 检查是否已经显示过教程
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      // 延迟显示，让页面先加载完成
      const timer = setTimeout(() => {
        setShowTutorial(true);
        localStorage.setItem('hasSeenTutorial', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseTutorial = () => {
    setShowTutorial(false);
  };

  return (
    <Layout className="app-container">
      <TutorialModal 
        visible={showTutorial} 
        onClose={handleCloseTutorial} 
      />
      <Header className="app-header">
        <h1>摄像头心率检测器</h1>
        <HeartOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#ff4d4f' }} />
      </Header>

      <Content className="app-content">
        <Row gutter={[24, 24]}>
          {/* Left column - Video and Control */}
          <Col xs={24} lg={10}>
            <VideoStream />
            <div style={{ marginTop: '24px' }}>
              <ControlPanel />
            </div>
          </Col>

          {/* Right column - Data display */}
          <Col xs={24} lg={14}>
            <Row gutter={[0, 24]}>
              {/* Real-time data section */}
              <Col xs={24}>
                <BPMDisplay />
                <div style={{ marginTop: '24px' }}>
                  <DataChart />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      <Footer className="app-footer">
        摄像头心率检测器 © 2025 | Writer：John Zheng |{' '}
        <a
          href="https://github.com/pluckypioneer/Heart-Rate-Online"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github repo
        </a>
      </Footer>
    </Layout>
  );
}

export default App;
