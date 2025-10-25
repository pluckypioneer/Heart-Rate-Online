import cv2
import time
import numpy as np
from typing import Tuple, Optional, Any, Union

# TODO: fix ipcam
# In Python 3, urllib2 is replaced by urllib.request
# import urllib.request
# import base64


class ipCamera:
    """
    Class for handling IP camera connections.
    Currently commented out as it needs to be updated for Python 3.
    """

    def __init__(self, url: str, user: Optional[str] = None, password: Optional[str] = None):
        self.url = url
        # In Python 3, string formatting should use f-strings
        # and encodestring is replaced by encodebytes
        # auth_encoded = base64.encodebytes(f'{user}:{password}'.encode()).decode().strip()

        # self.req = urllib.request.Request(self.url)
        # self.req.add_header('Authorization', f'Basic {auth_encoded}')

    def get_frame(self) -> np.ndarray:
        """
        Get a frame from the IP camera.
        
        Returns:
            np.ndarray: The captured frame
        """
        # response = urllib.request.urlopen(self.req)
        # img_array = np.asarray(bytearray(response.read()), dtype=np.uint8)
        # frame = cv2.imdecode(img_array, 1)
        # return frame
        
        # Placeholder until implementation is fixed
        return np.zeros((480, 640, 3), dtype=np.uint8)


class Camera:
    """
    Class for handling webcam connections.
    """

    def __init__(self, camera: int = 0):
        """
        Initialize the camera.
        
        Args:
            camera: Camera index (default: 0 for the first camera)
        """
        self.cam = cv2.VideoCapture(camera)
        self.valid = False
        try:
            resp = self.cam.read()
            self.shape = resp[1].shape
            self.valid = True
        except Exception as e:  # Specify exception type when possible
            self.shape = None

    def get_frame(self) -> np.ndarray:
        """
        Get a frame from the camera.
        
        Returns:
            np.ndarray: The captured frame or an error message frame if camera is not accessible
        """
        if self.valid:
            _, frame = self.cam.read()
        else:
            frame = np.ones((480, 640, 3), dtype=np.uint8)
            col = (0, 255, 255)  # Fixed value from 256 to 255 (valid RGB range is 0-255)
            cv2.putText(frame, "(Error: Camera not accessible)",
                       (65, 220), cv2.FONT_HERSHEY_PLAIN, 2, col)
        return frame

    def release(self) -> None:
        """
        Release the camera resources.
        """
        self.cam.release()
