@echo off
REM Webcam Pulse Detector - Stop Script for Windows

echo ================================
echo Stopping Webcam Pulse Detector
echo ================================
echo.

docker-compose down

echo.
echo ================================
echo √ Services Stopped Successfully!
echo ================================
pause
