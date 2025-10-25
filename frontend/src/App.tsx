import { Layout, Row, Col } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import VideoStream from './components/VideoStream';
import BPMDisplay from './components/BPMDisplay';
import DataChart from './components/DataChart';
import ControlPanel from './components/ControlPanel';
import HistoryTable from './components/HistoryTable';
import './styles/global.scss';

const { Header, Content, Footer } = Layout;

function App() {
  return (
    <Layout className="app-container">
      <Header className="app-header">
        <h1>摄像头心率检测器</h1>
        <SettingOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
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
              
              {/* Historical data section */}
              <Col xs={24}>
                <HistoryTable />
              </Col>
            </Row>
          </Col>
        </Row>
      </Content>

      <Footer className="app-footer">
        摄像头心率检测器 © 2025 | 通过摄像头实时检测心率
      </Footer>
    </Layout>
  );
}

export default App;
