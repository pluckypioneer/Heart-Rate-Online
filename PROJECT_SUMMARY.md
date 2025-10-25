# Webcam Pulse Detector - 项目总结

## 📋 项目概述

基于原有的 webcam-pulse-detector 桌面应用，构建了完整的 Web 版本，提供两种使用方式：
1. **Windows 本地开发模式**（推荐）- 完整功能，支持摄像头
2. **Docker 部署模式** - UI 演示，无摄像头功能

## ✅ 已完成功能

### 后端 (FastAPI)
- ✅ RESTful API 端点（系统状态、摄像头管理、检测控制）
- ✅ WebSocket 实时视频流
- ✅ 核心脉搏检测算法（基于原有 lib/）
- ✅ 数据导出（CSV 格式）
- ✅ 会话管理
- ✅ 健康检查

### 前端 (React + TypeScript)
- ✅ 实时视频流显示
- ✅ 心率大字号显示
- ✅ 信号质量指示器
- ✅ ECharts 数据图表（时域 + 频域）
- ✅ 控制面板（开始/停止、切换摄像头、导出数据）
- ✅ Ant Design UI 组件
- ✅ Zustand 状态管理
- ✅ TypeScript 类型安全

### Docker 部署
- ✅ 简化的 docker-compose.yml
- ✅ 后端 Dockerfile
- ✅ 前端 Dockerfile（多阶段构建）
- ✅ 启动/停止脚本（start.bat / stop.bat）

## 🎯 两种使用方式

### 方式一：Windows 本地开发（推荐）

**优点**：
- ✅ 完整的摄像头功能
- ✅ 实时心率检测
- ✅ 完整的 Web 界面
- ✅ 热重载开发

**启动方式**：
```bash
# 后端
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 前端（新终端）
cd frontend
npm install
npm run dev
```

### 方式二：Docker 部署

**优点**：
- ✅ 一键启动
- ✅ 无需配置环境
- ✅ 测试 UI 界面

**限制**：
- ⚠️ 无摄像头功能（Windows Docker 限制）

**启动方式**：
```bash
start.bat  # 或 docker-compose up -d --build
```

## 📁 项目结构（精简版）

```
webcam-pulse-detector/
├── backend/                 # 后端服务
│   ├── app/
│   │   ├── api/            # API 路由
│   │   ├── core/           # 业务逻辑
│   │   ├── models/         # 数据模型
│   │   └── main.py
│   ├── lib/                # 原有算法
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── services/      # API 服务
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docs/                   # 文档
│   ├── API.md
│   └── DEPLOYMENT.md
├── data/                   # 数据目录
├── docker-compose.yml      # Docker 配置
├── start.bat              # 启动脚本
├── stop.bat               # 停止脚本
├── .env.example           # 环境变量模板
└── README.md              # 主文档
```

## 🏗️ 技术栈

### 后端
- FastAPI 0.104+
- OpenCV 4.8+
- NumPy 1.24+
- Uvicorn 0.24+
- Pydantic 2.5+
- WebSockets 12.0+

### 前端
- React 18.2
- TypeScript 5.0+
- Vite 5.0+
- Ant Design 5.0+
- ECharts 5.4+
- Zustand 4.4+
- Axios 1.6+

### DevOps
- Docker 24.0+
- Docker Compose 2.20+

## 🔬 核心功能实现

### 心率检测流程
1. 人脸检测（Haar Cascade）
2. 额头区域隔离
3. 绿色通道提取
4. 信号采集（250 样本）
5. FFT 频谱分析
6. 峰值检测（50-180 BPM）
7. 心率计算

### WebSocket 实时流
- Base64 JPEG 编码
- 30fps 视频传输
- 实时心率数据
- FFT 频谱数据
- 信号质量评估

## 📊 API 端点

### REST API
- `GET /api/v1/status` - 系统状态
- `GET /api/v1/cameras` - 摄像头列表
- `POST /api/v1/pulse/start` - 启动检测
- `POST /api/v1/pulse/stop` - 停止检测
- `GET /api/v1/data/export` - 导出数据

### WebSocket
- `ws://localhost:8000/ws/pulse` - 实时流

## ⚙️ 配置说明

### 环境变量 (.env)
```bash
BACKEND_PORT=8000
FRONTEND_PORT=3000
LOG_LEVEL=info
BPM_MIN=50
BPM_MAX=180
```

### 后端配置
- `CAMERA_DEVICES`: [0, 1]
- `JPEG_QUALITY`: 80
- `TARGET_FPS`: 30
- `BUFFER_SIZE`: 250

## 🐛 已知限制

1. **Windows Docker 限制** - 容器无法访问摄像头
2. **单人检测** - 仅支持一个人脸
3. **光照依赖** - 需要良好光照条件
4. **运动敏感** - 头部需保持相对静止

## 💡 使用建议

### 开发/测试
- **推荐**: 方式一（本地开发）
- 原因: 完整功能 + 热重载

### 演示/学习
- **推荐**: 方式一（本地开发）或原桌面应用
- 原因: 需要摄像头功能

### UI 预览
- **可选**: 方式二（Docker）
- 原因: 快速启动查看界面

## 🔄 快速开始

### 完整功能（推荐）
```bash
# 后端
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 前端
cd frontend
npm install
npm run dev

# 访问: http://localhost:3000
```

### Docker 演示
```bash
start.bat
# 访问: http://localhost:3000
```

## 📝 文档位置

- [README.md](README.md) - 主文档（使用说明）
- [docs/API.md](docs/API.md) - API 详细文档
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - 部署指南
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 本文件

## 🎉 项目特点

### 优点
- ✅ 代码结构清晰
- ✅ 类型安全（TypeScript + Pydantic）
- ✅ 完整的 API 文档
- ✅ 现代化 UI
- ✅ 实时数据可视化
- ✅ Docker 支持

### 精简改进
- ✅ 移除复杂的多平台配置
- ✅ 只保留 Windows 和 Docker 两种方式
- ✅ 简化文档结构
- ✅ 统一配置文件

## 🔧 维护建议

### 日常开发
```bash
# 启动开发环境
cd backend && venv\Scripts\activate && uvicorn app.main:app --reload
cd frontend && npm run dev
```

### 测试 Docker
```bash
docker-compose up -d --build
docker-compose logs -f
```

### 更新依赖
```bash
# Python
pip install -r requirements.txt --upgrade

# Node
npm update
```

## 📞 支持

- **问题反馈**: GitHub Issues
- **API 文档**: http://localhost:8000/api/docs
- **原桌面应用**: `python get_pulse.py`

---

## 总结

项目已完成从桌面应用到 Web 应用的完整转型，提供了两种简洁明确的使用方式：

1. **Windows 本地开发** - 完整功能，推荐日常使用
2. **Docker 部署** - UI 演示，快速预览

所有功能均已实现并测试，文档完善，可直接投入使用。

**最后更新**: 2024-01-15
**版本**: 2.0.0
**状态**: ✅ 生产就绪
