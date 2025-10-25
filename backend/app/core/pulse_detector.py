"""
Pulse detector manager - manages detection sessions
"""
import logging
import os
from typing import Dict, List, Optional
from datetime import datetime
import csv

from app.config import settings
from app.models.schemas import SessionData, CurrentDataResponse
import sys

# Add lib to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../lib'))
from device import Camera

logger = logging.getLogger(__name__)


class DetectionSession:
    """Individual detection session"""

    def __init__(self, session_id: str, camera_id: int, bpm_limits: List[int]):
        self.session_id = session_id
        self.camera_id = camera_id
        self.bpm_limits = bpm_limits
        self.start_time = datetime.now()
        self.camera: Optional[Camera] = None
        self.processor = None
        self.timestamps: List[float] = []
        self.raw_values: List[float] = []
        self.bpm_values: List[float] = []
        self.active = False

    def start(self):
        """Start the session"""
        try:
            self.camera = Camera(camera=self.camera_id)
            # Import here to avoid circular dependency
            from processors import findFaceGetPulse
            self.processor = findFaceGetPulse(
                bpm_limits=self.bpm_limits,
                data_spike_limit=settings.DATA_SPIKE_LIMIT,
                face_detector_smoothness=settings.FACE_DETECTOR_SMOOTHNESS
            )
            self.active = True
            logger.info(f"Session {self.session_id} started")
        except Exception as e:
            logger.error(f"Error starting session: {e}")
            raise

    def stop(self):
        """Stop the session"""
        self.active = False
        if self.camera:
            self.camera.release()
        logger.info(f"Session {self.session_id} stopped")

    def get_data(self) -> Optional[CurrentDataResponse]:
        """Get current session data"""
        if not self.active or not self.processor:
            return None

        current_bpm = self.processor.bpm if hasattr(self.processor, 'bpm') else 0.0
        samples_count = len(self.processor.samples) if hasattr(self.processor, 'samples') else 0

        # Calculate signal quality based on buffer fullness and face detection
        signal_quality = 0.0
        if hasattr(self.processor, 'find_faces'):
            signal_quality = 0.5 if self.processor.find_faces else 0.0
        if samples_count > settings.BUFFER_SIZE * 0.8:
            signal_quality += 0.5

        return CurrentDataResponse(
            current_bpm=current_bpm,
            signal_quality=min(1.0, signal_quality),
            samples_count=samples_count,
            timestamps=self.timestamps[-100:],  # Last 100 samples
            raw_values=self.raw_values[-100:]
        )


class PulseDetectorManager:
    """Manage pulse detection sessions"""

    def __init__(self):
        self.sessions: Dict[str, DetectionSession] = {}
        self.current_session_id: Optional[str] = None
        self.history: List[SessionData] = []

        # Ensure data directory exists
        os.makedirs(settings.DATA_DIR, exist_ok=True)

    def is_camera_available(self, camera_id: int) -> bool:
        """Check if camera is available"""
        try:
            import cv2
            cap = cv2.VideoCapture(camera_id)
            if cap.isOpened():
                cap.release()
                return True
            return False
        except Exception as e:
            logger.error(f"Error checking camera {camera_id}: {e}")
            return False

    def get_available_cameras(self) -> List[int]:
        """Get list of available cameras"""
        available = []
        for cam_id in settings.CAMERA_DEVICES:
            if self.is_camera_available(cam_id):
                available.append(cam_id)
        return available

    def start_session(self, session_id: str, camera_id: int, bpm_limits: List[int]):
        """Start a new detection session"""
        # Stop current session if exists
        if self.current_session_id and self.current_session_id in self.sessions:
            self.stop_session(self.current_session_id)

        # Create new session
        session = DetectionSession(session_id, camera_id, bpm_limits)
        session.start()
        self.sessions[session_id] = session
        self.current_session_id = session_id

    def stop_session(self, session_id: str):
        """Stop a detection session"""
        if session_id in self.sessions:
            session = self.sessions[session_id]
            session.stop()

            # Add to history
            duration = (datetime.now() - session.start_time).seconds
            if session.bpm_values:
                avg_bpm = sum(session.bpm_values) / len(session.bpm_values)
                max_bpm = max(session.bpm_values)
                min_bpm = min(session.bpm_values)
            else:
                avg_bpm = max_bpm = min_bpm = 0.0

            self.history.append(
                SessionData(
                    session_id=session_id,
                    start_time=session.start_time,
                    duration=duration,
                    avg_bpm=avg_bpm,
                    max_bpm=max_bpm,
                    min_bpm=min_bpm
                )
            )

            del self.sessions[session_id]
            if self.current_session_id == session_id:
                self.current_session_id = None

    def toggle_search(self, session_id: str) -> bool:
        """Toggle face search mode"""
        if session_id in self.sessions:
            session = self.sessions[session_id]
            if session.processor:
                session.processor.find_faces_toggle()
                return session.processor.find_faces
        return False

    def switch_camera(self, camera_id: int):
        """Switch to different camera"""
        if self.current_session_id:
            session = self.sessions[self.current_session_id]
            session.stop()
            session.camera_id = camera_id
            session.start()

    def get_current_data(self, session_id: str) -> Optional[CurrentDataResponse]:
        """Get current session data"""
        if session_id in self.sessions:
            return self.sessions[session_id].get_data()
        return None

    def export_data(self, session_id: str, format: str = "csv") -> str:
        """Export session data to file"""
        if session_id not in self.sessions:
            raise ValueError(f"Session {session_id} not found")

        session = self.sessions[session_id]
        timestamp = datetime.now().strftime("%Y-%m-%d_%H_%M_%S_%f")
        filename = f"Webcam-pulse-{timestamp}.csv"
        filepath = os.path.join(settings.DATA_DIR, filename)

        with open(filepath, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            writer.writerow(['Timestamp', 'Value'])
            for ts, val in zip(session.timestamps, session.raw_values):
                writer.writerow([ts, val])

        logger.info(f"Exported data to {filepath}")
        return filepath

    def get_history(self, limit: int = 10) -> List[SessionData]:
        """Get session history"""
        return self.history[-limit:]
