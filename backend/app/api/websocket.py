"""
WebSocket endpoint for real-time video streaming
"""
import logging
import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set

from app.core.video_stream import VideoStreamManager
from app.models.schemas import WebSocketMessage, ErrorResponse

logger = logging.getLogger(__name__)
router = APIRouter()

# Active WebSocket connections
active_connections: Set[WebSocket] = set()

# Video stream manager
stream_manager = VideoStreamManager()


class ConnectionManager:
    """Manage WebSocket connections"""

    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        """Accept new connection"""
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        """Remove connection"""
        self.active_connections.discard(websocket)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def send_json(self, websocket: WebSocket, data: dict):
        """Send JSON data to websocket"""
        try:
            await websocket.send_json(data)
        except Exception as e:
            logger.error(f"Error sending data: {e}")

    async def broadcast(self, data: dict):
        """Broadcast data to all connections"""
        disconnected = set()
        for connection in self.active_connections:
            try:
                await connection.send_json(data)
            except Exception as e:
                logger.error(f"Error broadcasting: {e}")
                disconnected.add(connection)

        # Remove disconnected clients
        for connection in disconnected:
            self.disconnect(connection)


manager = ConnectionManager()


@router.websocket("/ws/pulse")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time pulse detection"""
    await manager.connect(websocket)

    camera_id = 0
    session_active = False

    try:
        while True:
            # Receive message from client
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=0.1)
                message = json.loads(data)

                msg_type = message.get("type")

                if msg_type == "start":
                    camera_id = message.get("camera_id", 0)
                    logger.info(f"Starting video stream with camera {camera_id}")
                    await stream_manager.start_stream(camera_id)
                    session_active = True
                    await manager.send_json(
                        websocket,
                        {"type": "status", "message": "Stream started"}
                    )

                elif msg_type == "stop":
                    logger.info("Stopping video stream")
                    await stream_manager.stop_stream()
                    session_active = False
                    await manager.send_json(
                        websocket,
                        {"type": "status", "message": "Stream stopped"}
                    )

                elif msg_type == "toggle_search":
                    await stream_manager.toggle_face_search()
                    await manager.send_json(
                        websocket,
                        {"type": "status", "message": "Toggled face search"}
                    )

                elif msg_type == "ping":
                    await manager.send_json(websocket, {"type": "pong"})

            except asyncio.TimeoutError:
                # No message received, continue to send frames
                pass
            except json.JSONDecodeError as e:
                logger.error(f"Invalid JSON: {e}")
                await manager.send_json(
                    websocket,
                    {"type": "error", "message": "Invalid JSON format"}
                )
                continue

            # Send frame if session is active
            if session_active:
                try:
                    frame_data = await stream_manager.get_frame()
                    if frame_data:
                        await manager.send_json(websocket, frame_data)
                    else:
                        # Small delay if no frame available
                        await asyncio.sleep(0.01)
                except Exception as e:
                    logger.error(f"Error getting frame: {e}")
                    await manager.send_json(
                        websocket,
                        {"type": "error", "message": f"Error getting frame: {str(e)}"}
                    )
            else:
                # Small delay when inactive
                await asyncio.sleep(0.1)

    except WebSocketDisconnect:
        logger.info("Client disconnected")
        manager.disconnect(websocket)
        if session_active:
            await stream_manager.stop_stream()
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await manager.send_json(
                websocket,
                {"type": "error", "message": str(e)}
            )
        except:
            pass
        manager.disconnect(websocket)
        if session_active:
            await stream_manager.stop_stream()
