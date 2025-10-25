"""
Pydantic schemas for API request/response models
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class SystemStatus(BaseModel):
    """System status response"""
    status: str = Field(..., description="System status")
    camera_available: bool = Field(..., description="Camera availability")
    active_cameras: List[int] = Field(..., description="List of active camera IDs")
    version: str = Field(..., description="API version")


class CameraInfo(BaseModel):
    """Camera information"""
    id: int = Field(..., description="Camera ID")
    name: str = Field(..., description="Camera name")
    available: bool = Field(..., description="Camera availability")


class CameraListResponse(BaseModel):
    """Camera list response"""
    cameras: List[CameraInfo] = Field(..., description="List of available cameras")


class StartDetectionRequest(BaseModel):
    """Start pulse detection request"""
    camera_id: int = Field(0, description="Camera ID to use")
    bpm_limits: List[int] = Field([50, 180], description="BPM range limits")


class StartDetectionResponse(BaseModel):
    """Start pulse detection response"""
    session_id: str = Field(..., description="Session ID")
    status: str = Field(..., description="Detection status")


class StopDetectionRequest(BaseModel):
    """Stop pulse detection request"""
    session_id: str = Field(..., description="Session ID")


class StopDetectionResponse(BaseModel):
    """Stop pulse detection response"""
    status: str = Field(..., description="Detection status")


class ToggleSearchRequest(BaseModel):
    """Toggle face search request"""
    session_id: str = Field(..., description="Session ID")


class ToggleSearchResponse(BaseModel):
    """Toggle face search response"""
    search_mode: bool = Field(..., description="Face search mode status")


class SwitchCameraRequest(BaseModel):
    """Switch camera request"""
    camera_id: int = Field(..., description="Camera ID to switch to")


class SwitchCameraResponse(BaseModel):
    """Switch camera response"""
    current_camera: int = Field(..., description="Current camera ID")


class SessionData(BaseModel):
    """Session data for history"""
    session_id: str = Field(..., description="Session ID")
    start_time: datetime = Field(..., description="Session start time")
    duration: int = Field(..., description="Session duration in seconds")
    avg_bpm: float = Field(..., description="Average BPM")
    max_bpm: float = Field(..., description="Maximum BPM")
    min_bpm: float = Field(..., description="Minimum BPM")


class HistoryResponse(BaseModel):
    """History response"""
    sessions: List[SessionData] = Field(..., description="List of sessions")


class CurrentDataResponse(BaseModel):
    """Current session data response"""
    current_bpm: float = Field(..., description="Current BPM")
    signal_quality: float = Field(..., description="Signal quality (0-1)")
    samples_count: int = Field(..., description="Number of samples collected")
    timestamps: List[float] = Field(..., description="Sample timestamps")
    raw_values: List[float] = Field(..., description="Raw signal values")


class HealthResponse(BaseModel):
    """Health check response"""
    status: str = Field(..., description="Health status")


class FFTData(BaseModel):
    """FFT data"""
    freqs: List[float] = Field(..., description="Frequencies")
    power: List[float] = Field(..., description="Power spectrum")


class FrameData(BaseModel):
    """Frame data for WebSocket"""
    type: str = Field("frame", description="Message type")
    image: str = Field(..., description="Base64 encoded JPEG image")
    bpm: Optional[float] = Field(None, description="Current BPM")
    fft_data: Optional[FFTData] = Field(None, description="FFT data")
    raw_signal: Optional[List[float]] = Field(None, description="Raw signal data")
    timestamp: float = Field(..., description="Timestamp")
    face_detected: bool = Field(..., description="Face detection status")
    signal_quality: float = Field(0.0, description="Signal quality (0-1)")


class WebSocketMessage(BaseModel):
    """WebSocket message"""
    type: str = Field(..., description="Message type")
    data: Optional[Dict[str, Any]] = Field(None, description="Message data")


class ErrorResponse(BaseModel):
    """Error response"""
    type: str = Field("error", description="Message type")
    message: str = Field(..., description="Error message")
