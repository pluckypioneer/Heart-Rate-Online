"""
REST API endpoints
"""
import logging
import uuid
from datetime import datetime
from typing import Dict, Any
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse, JSONResponse
import os

from app.config import settings
from app.models.schemas import (
    SystemStatus,
    CameraListResponse,
    CameraInfo,
    StartDetectionRequest,
    StartDetectionResponse,
    StopDetectionRequest,
    StopDetectionResponse,
    ToggleSearchRequest,
    ToggleSearchResponse,
    SwitchCameraRequest,
    SwitchCameraResponse,
    HistoryResponse,
    CurrentDataResponse,
    HealthResponse,
)
from app.core.pulse_detector import PulseDetectorManager

logger = logging.getLogger(__name__)
router = APIRouter()

# Global pulse detector manager
detector_manager = PulseDetectorManager()


@router.get("/status", response_model=SystemStatus)
async def get_status():
    """Get system status"""
    try:
        active_cameras = detector_manager.get_available_cameras()
        return SystemStatus(
            status="running",
            camera_available=len(active_cameras) > 0,
            active_cameras=active_cameras,
            version=settings.APP_VERSION
        )
    except Exception as e:
        logger.error(f"Error getting status: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/cameras", response_model=CameraListResponse)
async def get_cameras():
    """Get available cameras"""
    try:
        cameras = []
        for cam_id in settings.CAMERA_DEVICES:
            available = detector_manager.is_camera_available(cam_id)
            cameras.append(
                CameraInfo(
                    id=cam_id,
                    name=f"Camera {cam_id}",
                    available=available
                )
            )
        return CameraListResponse(cameras=cameras)
    except Exception as e:
        logger.error(f"Error getting cameras: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pulse/start", response_model=StartDetectionResponse)
async def start_detection(request: StartDetectionRequest):
    """Start pulse detection"""
    try:
        session_id = str(uuid.uuid4())
        detector_manager.start_session(
            session_id=session_id,
            camera_id=request.camera_id,
            bpm_limits=request.bpm_limits
        )
        logger.info(f"Started detection session: {session_id}")
        return StartDetectionResponse(
            session_id=session_id,
            status="started"
        )
    except Exception as e:
        logger.error(f"Error starting detection: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pulse/stop", response_model=StopDetectionResponse)
async def stop_detection(request: StopDetectionRequest):
    """Stop pulse detection"""
    try:
        detector_manager.stop_session(request.session_id)
        logger.info(f"Stopped detection session: {request.session_id}")
        return StopDetectionResponse(status="stopped")
    except Exception as e:
        logger.error(f"Error stopping detection: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pulse/toggle-search", response_model=ToggleSearchResponse)
async def toggle_search(request: ToggleSearchRequest):
    """Toggle face search mode"""
    try:
        search_mode = detector_manager.toggle_search(request.session_id)
        return ToggleSearchResponse(search_mode=search_mode)
    except Exception as e:
        logger.error(f"Error toggling search: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/pulse/switch-camera", response_model=SwitchCameraResponse)
async def switch_camera(request: SwitchCameraRequest):
    """Switch to different camera"""
    try:
        detector_manager.switch_camera(request.camera_id)
        return SwitchCameraResponse(current_camera=request.camera_id)
    except Exception as e:
        logger.error(f"Error switching camera: {e}")
        raise HTTPException(status_code=500, detail=str(e))





@router.get("/data/history", response_model=HistoryResponse)
async def get_history(limit: int = Query(10, description="Number of sessions to return")):
    """Get session history"""
    try:
        sessions = detector_manager.get_history(limit)
        return HistoryResponse(sessions=sessions)
    except Exception as e:
        logger.error(f"Error getting history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/data/current", response_model=CurrentDataResponse)
async def get_current_data(session_id: str = Query(..., description="Session ID")):
    """Get current session data"""
    try:
        data = detector_manager.get_current_data(session_id)
        if data is None:
            raise HTTPException(status_code=404, detail="Session not found")
        return data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting current data: {e}")
        raise HTTPException(status_code=500, detail=str(e))
