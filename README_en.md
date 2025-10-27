# Heart Rate Online (Webcam Pulse Detector - Web Version)

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-Apache%202.0-green.svg)

Real-time heart rate detection web application that detects heart rate (50-180 BPM) through a regular webcam.

This project is based on [webcam-pulse-detector](https://github.com/thearn/webcam-pulse-detector), with a frontend interface built and some backend bugs optimized.

## ✨ Features

- 🎥 **Real-time Heart Rate Detection** - Pulse detection through camera
- 🌐 **Web Interface** - Modern React frontend
- 📊 **Data Visualization** - FFT spectrum and time-domain signal charts
- 📷 **Multi-camera Support** - Switch between different cameras
- 🔌 **RESTful API** - Complete API interface
- 📈 **Real-time Charts** - ECharts data visualization

---

## 🚀 Quick Start

### 📋 Requirements

#### Method 1 (Local Development)

- Windows 10/11
- Python 3.8+
- Node.js 18+
- npm or yarn
- Camera

#### Method 2 (Docker)

- Windows 10/11
- Docker Desktop
- WSL 2 (Recommended)

---

**Recommended Method**: Windows local development (Method 1) for full functionality!

### First-time Usage Recommendations

1. **Install Python and Node.js**

   - Python: https://www.python.org/downloads/
   - Node.js: https://nodejs.org/

2. **Clone the Project**
   
   ```bash
   git clone <repository-url>
   cd webcam-pulse-detector
   ```

3. **Choose Usage Method**
   1. Want full functionality → Use Method 1 (Local Development)
   - Step 1: Start backend service

   ```bash
   cd backend
   py -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   - Step 2: Start frontend service (new terminal)

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

    2. Only want to test UI → Use Method 2 (Docker)

---

## 🎯 Two Usage Methods

### Method 1: Windows Local Development (Recommended, Full Functionality)

✅ **Advantages**: Full camera functionality + Web interface

#### Backend Startup

```bash
# 1. Enter backend directory
cd backend

# 2. Create virtual environment (first time)
py -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Startup (New Terminal)

```bash
# 1. Enter frontend directory
cd frontend

# 2. Install dependencies (first time)
npm install

# 3. Start frontend
npm run dev
```

#### Access Application

- **Web Interface (Development)**: http://localhost:3000
- **API Documentation**: http://localhost:8000/api/docs
- **Unified Port (Backend provides UI)**: http://127.0.0.1:8000/ui/

> Before using unified port, run `npm run build` in `frontend`; backend has mounted `frontend/dist` to `/ui`, no need for `npm run dev`.

---

### Method 2: Docker Deployment (UI Demo Only)

⚠️ **Note**: Docker containers cannot access Windows camera, only for UI testing

#### Start with Script

```bash
# Start
start.bat

# Stop
stop.bat
```

#### Or Manual Startup

```bash
# Start all services
docker-compose up -d --build

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Access Application

- **Web Interface**: http://localhost:3000
- **API Documentation**: http://localhost:8000/api/docs

---


## 📖 Usage Instructions

### Web Interface Operation

1. Open http://localhost:3000
2. Click **"Start Detection"** button
3. Allow browser camera access
4. Position face in the center of the frame
5. Wait 15-20 seconds for system to stabilize data collection
6. View real-time heart rate and data charts
7. View real-time heart rate and data charts

### Control Functions

- **Start/Stop Detection** - Control detection process
- **Switch Camera** - Switch between multiple cameras
- **Toggle Face Search** - Toggle face search mode


---

## 🏗️ Technical Architecture

### Backend
- **FastAPI** - High-performance asynchronous web framework
- **OpenCV** - Computer vision and image processing
- **NumPy** - FFT analysis and numerical computation
- **WebSocket** - Real-time bidirectional communication

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Ant Design** - UI component library
- **ECharts** - Data visualization
- **Vite** - Build tool

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 📁 Project Structure

```
webcam-pulse-detector/
├── backend/              # Backend service
│   ├── app/             # FastAPI application
│   ├── lib/             # Core algorithms
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/            # Frontend application
│   ├── src/             # React source code
│   ├── Dockerfile
│   └── package.json
├── data/                # Data directory
├── docker-compose.yml   # Docker configuration
├── start.bat           # Startup script
├── stop.bat            # Stop script
└── README.md           # This file
```

---

## 📚 API Documentation

### Main Endpoints

```bash
# Get system status
GET http://localhost:8000/api/v1/status

# Get available cameras
GET http://localhost:8000/api/v1/cameras

# Start detection
POST http://localhost:8000/api/v1/pulse/start

# Stop detection
POST http://localhost:8000/api/v1/pulse/stop


```

### WebSocket

```javascript
// Connect
ws://localhost:8000/ws/pulse

// Send message
{ "type": "start", "camera_id": 0 }

// Receive data
{
  "type": "frame",
  "image": "base64...",
  "bpm": 72.3,
  "face_detected": true,
  "signal_quality": 0.85
}
```

Detailed documentation: http://localhost:8000/api/docs

---

## 🔬 How It Works

This application uses OpenCV (Open Source Computer Vision Library) to locate the user's face position, then isolates the forehead area. The system collects data from this area over time to estimate the user's heart rate.

The specific implementation method is: using only the green channel of the sub-image, measure the average light intensity of the forehead area (there might be a better color mixing ratio, but the blue channel usually has more noise).

Thanks to the light absorption characteristics of (oxygenated) hemoglobin, we can estimate physiological data this way (reference: http://www.opticsinfobase.org/oe/abstract.cfm?uri=oe-16-26-21434).

Under good lighting conditions and with minimal motion noise, heartbeat signals can be stably captured within about 15 seconds. Other physiological waveforms (such as Mayer waves) should also be observable in the raw data stream.

After estimating the user's heart rate, the system also calculates real-time phase changes related to this frequency. This process can amplify heartbeat signals in later frame rendering, making the highlighted forehead area "pulse" synchronously with the user's own heartbeat.

Currently, the system supports detecting multiple people simultaneously from a single camera's image stream, but currently only extracts information from one face for analysis.

The overall data flow / execution sequence of real-time signal processing is as follows:

![Alt text](http://i.imgur.com/xS7O8U3.png "Signal processing")

---

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# Backend port
BACKEND_PORT=8000

# Frontend port
FRONTEND_PORT=3000

# Log level
LOG_LEVEL=info

# Heart rate range
BPM_MIN=50
BPM_MAX=180
```

### Backend Configuration (backend/app/config.py)

```python
CAMERA_DEVICES = [0, 1]        # Camera list
JPEG_QUALITY = 80              # JPEG compression quality
TARGET_FPS = 30                # Target frame rate
BUFFER_SIZE = 250              # Signal buffer size
BPM_MIN = 50                   # Minimum heart rate
BPM_MAX = 180                  # Maximum heart rate
```

---

## 📝 Original Desktop Application

The original desktop application is still available:

```bash
# Install dependencies
pip install -r requirements.txt

# Run
python get_pulse.py
```

**Shortcuts**:
- `S` - Lock/unlock face detection
- `D` - Show/hide data charts
- `C` - Switch camera

- `Esc` - Exit

---
## 🔧 Frequently Asked Questions

### Q1: Backend startup failed?

```bash
# Ensure correct Python version
python --version  # Should be 3.8+

# Upgrade pip
python -m pip install --upgrade pip

# Reinstall dependencies
pip install -r requirements.txt --no-cache-dir
```

### Q2: Frontend startup failed?

```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
npm install
```

- If build reports `Property 'env' does not exist on type 'ImportMeta'`, create `vite-env.d.ts` in `src` directory with content: `/// <reference types="vite/client" />`.
- Frontend can configure backend address through environment variables:
  - `VITE_API_URL` (default: `http://localhost:8000`)
  - `VITE_WS_URL` (default: `ws://localhost:8000`)

### Q3: Port occupied?

```bash
# Find occupying process
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# End process
taskkill /PID <process ID> /F
```

### Q4: Camera cannot open?

1. Close other programs using camera (Teams, Zoom, etc.)
2. Check camera permissions in Windows privacy settings
3. Try different camera IDs (0, 1, 2)

### Q5: Docker startup failed?

1. Ensure Docker Desktop is running
2. Restart Docker Desktop
3. Check if WSL 2 is enabled

### Q6: Blank page or `net::ERR_ABORTED`?

- Please confirm you are accessing frontend port `http://localhost:3000/` (development) or unified port `http://127.0.0.1:8000/ui/` (production/demo).
- If you access frontend development resources through backend port, you will see `/@vite/client` 404, which is expected behavior (this resource only exists in frontend dev server).
- In browser Network panel, confirm `index.html`, `/@vite/client`, `/src/main.tsx` all return 200 (only dev mode needs `@vite/client`).
- If still abnormal, restart frontend dev (press `r` Enter in terminal or re-run `npm run dev`), and try disabling browser plugins (ad/privacy blockers, etc.).

---

## 🐛 Troubleshooting

### Unstable Heart Rate

- Improve lighting conditions (natural light is best)
- Keep head still
- Avoid talking
- Wait 15-20 seconds for stable collection

### Video Stream Lag

- Reduce JPEG quality (backend/app/config.py)
- Reduce resolution
- Close other bandwidth-consuming applications

### Docker Related

```bash
# Rebuild
docker-compose build --no-cache
```

---

## 📄 License

Apache License 2.0 - See [LICENSE.txt](LICENSE.txt) for details

---

## 🙏 Acknowledgments

- Working principle paper: `http://www.opticsinfobase.org/oe/abstract.cfm?uri=oe-16-26-21434）`
- Original algorithm source: [webcam-pulse-detector](https://github.com/thearn/webcam-pulse-detector)
- OpenCV community
- FastAPI
- React community

---

## ⚠️ Disclaimer

**This application is for educational and research purposes only, not for medical diagnosis or treatment. For medical advice, please consult professional medical personnel.**

---

## 📞 Support

- **Issue Reporting**: GitHub Issues
- **API Documentation**: http://localhost:8000/api/docs
- **Project Documentation**: [docs/](docs/)

## ⭐Star History

[![Star History Chart](https://api.star-history.com/svg?repos=pluckypioneer/Heart-Rate-Online&type=date&legend=top-left)](https://www.star-history.com/#pluckypioneer/Heart-Rate-Online&type=date&legend=top-left)