"""
Video stream manager for WebSocket streaming
"""
import logging
import asyncio
import base64
import time
import cv2
import numpy as np
from typing import Optional, Dict, Any
import sys
import os

# Add lib to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../lib'))
from device import Camera
from processors import findFaceGetPulse

from app.config import settings

logger = logging.getLogger(__name__)


class VideoStreamManager:
    """Manage video streaming for WebSocket"""

    def __init__(self):
        self.camera: Optional[Camera] = None
        self.processor: Optional[findFaceGetPulse] = None
        self.active = False
        self.camera_id = settings.DEFAULT_CAMERA
        self.lock = asyncio.Lock()

    async def start_stream(self, camera_id: int = 0):
        """Start video stream"""
        async with self.lock:
            if self.active:
                await self.stop_stream()

            try:
                self.camera_id = camera_id
                self.camera = Camera(camera=camera_id)
                self.processor = findFaceGetPulse(
                    bpm_limits=[settings.BPM_MIN, settings.BPM_MAX],
                    data_spike_limit=settings.DATA_SPIKE_LIMIT,
                    face_detector_smoothness=settings.FACE_DETECTOR_SMOOTHNESS
                )
                self.active = True
                logger.info(f"Video stream started with camera {camera_id}")
            except Exception as e:
                logger.error(f"Error starting video stream: {e}")
                raise

    async def stop_stream(self):
        """Stop video stream"""
        async with self.lock:
            self.active = False
            if self.camera:
                self.camera.release()
                self.camera = None
            self.processor = None
            logger.info("Video stream stopped")

    async def toggle_face_search(self):
        """Toggle face search mode"""
        if self.processor:
            self.processor.find_faces_toggle()
            logger.info(f"Face search toggled: {self.processor.find_faces}")

    async def get_frame(self) -> Optional[Dict[str, Any]]:
        """Get processed frame data"""
        if not self.active or not self.camera or not self.processor:
            return None

        try:
            # Get frame from camera
            frame = self.camera.get_frame()
            if frame is None or isinstance(frame, str):
                return None

            # Process frame
            self.processor.frame_in = frame
            self.processor.run(self.camera_id)
            output_frame = self.processor.frame_out

            # Resize if needed
            if output_frame.shape[1] != settings.FRAME_WIDTH or output_frame.shape[0] != settings.FRAME_HEIGHT:
                output_frame = cv2.resize(output_frame, (settings.FRAME_WIDTH, settings.FRAME_HEIGHT))

            # Encode to JPEG
            _, buffer = cv2.imencode(
                '.jpg',
                output_frame,
                [cv2.IMWRITE_JPEG_QUALITY, settings.JPEG_QUALITY]
            )

            # Convert to base64
            image_base64 = base64.b64encode(buffer).decode('utf-8')

            # Get BPM data
            current_bpm = None
            if hasattr(self.processor, 'bpm') and self.processor.bpm > 0:
                current_bpm = round(float(self.processor.bpm), 1)

            # Get FFT data if available
            fft_data = None
            if hasattr(self.processor, 'freqs') and hasattr(self.processor, 'fft'):
                if self.processor.freqs is not None and self.processor.fft is not None:
                    # Limit data points for transmission
                    step = max(1, len(self.processor.freqs) // 100)
                    fft_data = {
                        "freqs": [float(f) for f in self.processor.freqs[::step]],
                        "power": [float(p) for p in self.processor.fft[::step]]
                    }

            # Get raw signal data
            raw_signal = None
            if hasattr(self.processor, 'samples') and len(self.processor.samples) > 0:
                # Last 100 samples
                raw_signal = [float(s) for s in self.processor.samples[-100:]]

            # Calculate signal quality
            signal_quality = 0.0
            
            # Base quality based on face detection
            if hasattr(self.processor, 'face_present') and self.processor.face_present:
                signal_quality += 0.4
            
            # Quality based on data buffer fill level
            if hasattr(self.processor, 'samples') and hasattr(self.processor, 'buffer_size') and len(self.processor.samples) > 0:
                fill_ratio = min(1.0, len(self.processor.samples) / self.processor.buffer_size)
                signal_quality += 0.3 * fill_ratio
            
            # Quality based on BPM stability (if available)
            if current_bpm is not None and current_bpm > 0:
                signal_quality += 0.3

            # Create response
            # Determine face detection status based on processor's current face presence
            face_state = False
            if hasattr(self.processor, 'face_present'):
                face_state = bool(self.processor.face_present)
            # Also check last detection timestamp as fallback
            elif hasattr(self.processor, 'last_face_ts') and isinstance(self.processor.last_face_ts, (int, float)):
                face_state = (time.time() - float(self.processor.last_face_ts)) < 1.0

            frame_data = {
                "type": "frame",
                "image": image_base64,
                "bpm": current_bpm,
                "fft_data": fft_data,
                "raw_signal": raw_signal,
                "timestamp": time.time(),
                "face_detected": face_state,
                "signal_quality": min(1.0, signal_quality)
            }

            return frame_data

        except Exception as e:
            logger.error(f"Error processing frame: {e}")
            return None
