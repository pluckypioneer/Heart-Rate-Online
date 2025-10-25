@echo off
REM Webcam Pulse Detector - Quick Start Script for Windows

echo ================================
echo Webcam Pulse Detector v2.0
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo X Docker is not installed. Please install Docker Desktop first.
    echo   Visit: https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo X Docker Compose is not installed.
    pause
    exit /b 1
)

echo √ Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo √ .env file created
    echo   You can edit .env to customize settings
    echo.
)

REM Create data directory
if not exist data mkdir data

echo Starting Webcam Pulse Detector...
echo.

REM Check if Docker Desktop is running
docker info >nul 2>&1
if errorlevel 1 (
    echo X Docker Desktop is not running!
    echo   Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo √ Docker Desktop is running
echo.

REM Start services
docker-compose up -d --build

echo.
echo ================================
echo √ Services Started Successfully!
echo ================================
echo.
echo Access the application:
echo   Web Interface:      http://localhost:3000
echo   API Documentation:  http://localhost:8000/api/docs
echo   Backend API:        http://localhost:8000
echo.
echo Check status:
echo   docker-compose ps
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo Stop services:
echo   docker-compose down
echo   OR use: stop.bat
echo.
echo ================================
pause
