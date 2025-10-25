"""
Helper utility functions
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def validate_camera_id(camera_id: int, max_cameras: int = 10) -> bool:
    """Validate camera ID is within acceptable range"""
    return 0 <= camera_id < max_cameras


def validate_bpm_range(bpm_min: int, bpm_max: int) -> bool:
    """Validate BPM range is reasonable"""
    return 30 <= bpm_min < bpm_max <= 220
