import { Layout, Row, Col } from 'antd';
import { HeartOutlined } from '@ant-design/icons';
import VideoStream from './components/VideoStream';
import BPMDisplay from './components/BPMDisplay';
import DataChart from './components/DataChart';
import ControlPanel from './components/ControlPanel';
import './styles/global.scss';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="app-container">
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
        摄像头心率检测器 © 2025 
      </Footer>
    </Layout>
  );
}

export default App;
