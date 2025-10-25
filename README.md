# Webcam Pulse Detector - Web Version

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)

实时心率检测 Web 应用，通过普通网络摄像头检测心率（50-180 BPM）。

![Alt text](http://i.imgur.com/2ngZopS.jpg "Screenshot")

## ✨ 功能特性

- 🎥 **实时心率检测** - 通过摄像头检测脉搏
- 🌐 **Web 界面** - 现代化的 React 前端
- 📊 **数据可视化** - FFT 频谱图和时域信号图
- 📷 **多摄像头支持** - 可切换不同摄像头
- 💾 **数据导出** - 导出 CSV 格式数据
- 🔌 **RESTful API** - 完整的 API 接口
- 📈 **实时图表** - ECharts 数据可视化

## 🎯 两种使用方式

### 方式一：Windows 本地开发（推荐，完整功能）

✅ **优点**：完整的摄像头功能 + Web 界面

#### 后端启动

```bash
# 1. 进入后端目录
cd backend

# 2. 创建虚拟环境（首次）
python -m venv venv

# 3. 激活虚拟环境
venv\Scripts\activate

# 4. 安装依赖
pip install -r requirements.txt

# 5. 启动后端
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 前端启动（新终端）

```bash
# 1. 进入前端目录
cd frontend

# 2. 安装依赖（首次）
npm install

# 3. 启动前端
npm run dev
```

#### 访问应用

- **Web 界面（开发）**: http://localhost:3000
- **API 文档**: http://localhost:8000/api/docs
- **统一端口（后端提供 UI）**: http://127.0.0.1:8000/ui/

> 使用统一端口前，请在 `frontend` 运行 `npm run build`；后端已挂载 `frontend/dist` 到 `/ui`，无需 `npm run dev`。

---

### 方式二：Docker 部署（仅 UI 演示）

⚠️ **注意**：Docker 容器无法访问 Windows 摄像头，仅用于 UI 测试

#### 使用脚本启动

```bash
# 启动
start.bat

# 停止
stop.bat
```

#### 或手动启动

```bash
# 启动所有服务
docker-compose up -d --build

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

#### 访问应用

- **Web 界面**: http://localhost:3000
- **API 文档**: http://localhost:8000/api/docs

---

## 📋 环境要求

### 方式一（本地开发）
- Windows 10/11
- Python 3.8+
- Node.js 18+
- npm 或 yarn
- 摄像头

### 方式二（Docker）
- Windows 10/11
- Docker Desktop
- WSL 2（推荐）

---

## 🚀 快速开始

### 首次使用建议

1. **安装 Python 和 Node.js**
   - Python: https://www.python.org/downloads/
   - Node.js: https://nodejs.org/

2. **克隆项目**
   ```bash
   git clone <repository-url>
   cd webcam-pulse-detector
   ```

3. **选择使用方式**
   - 想要完整功能 → 使用方式一（本地开发）
      - 步骤1：启动后端服务

```
cd backend
py -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

      - 步骤2：启动前端服务（新终端）

```
cd frontend
npm install
npm run dev
```

   - 仅想测试 UI → 使用方式二（Docker）

---

## 📖 使用说明

### Web 界面操作

1. 打开 http://localhost:3000
2. 点击 **"Start Detection"** 按钮
3. 允许浏览器访问摄像头
4. 将脸部置于画面中心
5. 等待 15-20 秒让系统稳定采集数据
6. 查看实时心率和数据图表
7. 点击 **"Export Data (CSV)"** 导出数据

### 控制功能

- **开始/停止检测** - 控制检测过程
- **切换摄像头** - 在多个摄像头间切换
- **Toggle Face Search** - 切换人脸搜索模式
- **导出数据** - 保存采集的数据为 CSV

---

## 🏗️ 技术架构

### 后端
- **FastAPI** - 高性能异步 Web 框架
- **OpenCV** - 计算机视觉和图像处理
- **NumPy** - FFT 分析和数值计算
- **WebSocket** - 实时双向通信

### 前端
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Ant Design** - UI 组件库
- **ECharts** - 数据可视化
- **Vite** - 构建工具

### DevOps
- **Docker** - 容器化
- **Docker Compose** - 多容器编排

---

## 📁 项目结构

```
webcam-pulse-detector/
├── backend/              # 后端服务
│   ├── app/             # FastAPI 应用
│   ├── lib/             # 核心算法
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # 前端应用
│   ├── src/             # React 源码
│   ├── Dockerfile
│   └── package.json
├── data/                # 数据目录
├── docker-compose.yml   # Docker 配置
├── start.bat           # 启动脚本
├── stop.bat            # 停止脚本
└── README.md           # 本文件
```

---

## 🔧 常见问题

### Q1: 后端启动失败？

```bash
# 确保 Python 版本正确
python --version  # 应为 3.8+

# 升级 pip
python -m pip install --upgrade pip

# 重新安装依赖
pip install -r requirements.txt --no-cache-dir
```

### Q2: 前端启动失败？

```bash
# 清理缓存
npm cache clean --force

# 删除 node_modules 重新安装
rmdir /s /q node_modules
npm install
```

- 若构建时报 `Property 'env' does not exist on type 'ImportMeta'`，请在 `src` 目录创建 `vite-env.d.ts`，内容：`/// <reference types="vite/client" />`。
- 前端可通过环境变量配置后端地址：
  - `VITE_API_URL`（默认：`http://localhost:8000`）
  - `VITE_WS_URL`（默认：`ws://localhost:8000`）

### Q3: 端口被占用？

```bash
# 查找占用进程
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# 结束进程
taskkill /PID <进程ID> /F
```

### Q4: 摄像头无法打开？

1. 关闭其他使用摄像头的程序（Teams, Zoom 等）
2. 检查 Windows 隐私设置中的摄像头权限
3. 尝试不同的摄像头 ID（0, 1, 2）

### Q5: Docker 启动失败？

1. 确保 Docker Desktop 正在运行
2. 重启 Docker Desktop
3. 检查是否启用了 WSL 2

### Q6: 页面空白或 `net::ERR_ABORTED`？

- 请确认访问的是前端端口 `http://localhost:3000/`（开发）或统一端口 `http://127.0.0.1:8000/ui/`（生产/演示）。
- 如果你在后端端口访问前端开发资源，会看到 `/@vite/client` 404，这是预期行为（该资源仅存在于前端 dev 服务器）。
- 在浏览器 Network 面板确认 `index.html`、`/@vite/client`、`/src/main.tsx` 都返回 200（仅 dev 模式需要 `@vite/client`）。
- 如仍异常，重启前端 dev（在终端按 `r` 回车或重新 `npm run dev`），并尝试禁用浏览器插件（广告/隐私拦截等）。

---

## 📚 API 文档

### 主要端点

```bash
# 获取系统状态
GET http://localhost:8000/api/v1/status

# 获取可用摄像头
GET http://localhost:8000/api/v1/cameras

# 启动检测
POST http://localhost:8000/api/v1/pulse/start

# 停止检测
POST http://localhost:8000/api/v1/pulse/stop

# 导出数据
GET http://localhost:8000/api/v1/data/export
```

### WebSocket

```javascript
// 连接
ws://localhost:8000/ws/pulse

// 发送消息
{ "type": "start", "camera_id": 0 }

// 接收数据
{
  "type": "frame",
  "image": "base64...",
  "bpm": 72.3,
  "face_detected": true,
  "signal_quality": 0.85
}
```

详细文档: http://localhost:8000/api/docs

---

## 🔬 工作原理

### 算法流程

1. **人脸检测** - Haar Cascade 分类器检测人脸
2. **额头隔离** - 提取额头区域（最可靠的脉搏信号）
3. **绿色通道** - 提取绿色通道光强度（血氧吸收特性最佳）
4. **信号采集** - 收集 250 个样本（约 8 秒 @ 30fps）
5. **FFT 分析** - 快速傅里叶变换到频域
6. **峰值检测** - 找到 50-180 BPM 范围内的主频率
7. **心率计算** - 频率转换为每分钟心跳数

### 生理学原理

利用血红蛋白的光吸收特性，通过检测皮肤表面反射光的周期性变化来估算心率。

参考: http://www.opticsinfobase.org/oe/abstract.cfm?uri=oe-16-26-21434

---

## ⚙️ 配置

### 环境变量 (.env)

```bash
# 后端端口
BACKEND_PORT=8000

# 前端端口
FRONTEND_PORT=3000

# 日志级别
LOG_LEVEL=info

# 心率范围
BPM_MIN=50
BPM_MAX=180
```

### 后端配置 (backend/app/config.py)

```python
CAMERA_DEVICES = [0, 1]        # 摄像头列表
JPEG_QUALITY = 80              # JPEG 压缩质量
TARGET_FPS = 30                # 目标帧率
BUFFER_SIZE = 250              # 信号缓冲大小
BPM_MIN = 50                   # 最小心率
BPM_MAX = 180                  # 最大心率
```

---

## 📝 原桌面应用

原有的桌面应用仍然可用：

```bash
# 安装依赖
pip install -r requirements.txt

# 运行
python get_pulse.py
```

**快捷键**：
- `S` - 锁定/解锁人脸检测
- `D` - 显示/隐藏数据图表
- `C` - 切换摄像头
- `F` - 导出数据为 CSV
- `Esc` - 退出

---

## 🐛 故障排除

### 心率不稳定

- 改善光照条件（自然光最佳）
- 保持头部静止
- 避免说话
- 等待 15-20 秒稳定采集

### 视频流卡顿

- 降低 JPEG 质量（backend/app/config.py）
- 降低分辨率
- 关闭其他占用带宽的应用

### Docker 相关

```bash
# 重新构建
docker-compose build --no-cache
```

---

## 📄 许可证

Apache License 2.0 - 详见 [LICENSE.txt](LICENSE.txt)

---

## 🙏 致谢

- 原始算法来源
- OpenCV 社区
- FastAPI 和 React 社区

---

## ⚠️ 免责声明

**本应用仅供教育和研究用途，不得用于医疗诊断或治疗。如需医疗建议，请咨询专业医疗人员。**

---

## 📞 支持

- **问题反馈**: GitHub Issues
- **API 文档**: http://localhost:8000/api/docs
- **项目文档**: [docs/](docs/)

---

**推荐使用方式**: Windows 本地开发（方式一）以获得完整功能！
