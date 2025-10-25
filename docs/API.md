# API Documentation

Base URL: `http://localhost:8000/api/v1`

## Authentication

Currently no authentication required. Add JWT or API keys for production use.

## System Endpoints

### Get System Status

```http
GET /api/v1/status
```

**Response:**
```json
{
  "status": "running",
  "camera_available": true,
  "active_cameras": [0, 1],
  "version": "2.0.0"
}
```

### Get Available Cameras

```http
GET /api/v1/cameras
```

**Response:**
```json
{
  "cameras": [
    {
      "id": 0,
      "name": "Camera 0",
      "available": true
    },
    {
      "id": 1,
      "name": "Camera 1",
      "available": false
    }
  ]
}
```

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy"
}
```

## Pulse Detection Endpoints

### Start Detection

```http
POST /api/v1/pulse/start
Content-Type: application/json

{
  "camera_id": 0,
  "bpm_limits": [50, 180]
}
```

**Response:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "started"
}
```

### Stop Detection

```http
POST /api/v1/pulse/stop
Content-Type: application/json

{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "status": "stopped"
}
```

### Toggle Face Search

```http
POST /api/v1/pulse/toggle-search
Content-Type: application/json

{
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response:**
```json
{
  "search_mode": true
}
```

### Switch Camera

```http
POST /api/v1/pulse/switch-camera
Content-Type: application/json

{
  "camera_id": 1
}
```

**Response:**
```json
{
  "current_camera": 1
}
```

## Data Endpoints

### Export Data

```http
GET /api/v1/data/export?session_id=550e8400-e29b-41d4-a716-446655440000&format=csv
```

**Response:** CSV file download

### Get History

```http
GET /api/v1/data/history?limit=10
```

**Response:**
```json
{
  "sessions": [
    {
      "session_id": "550e8400-e29b-41d4-a716-446655440000",
      "start_time": "2024-01-15T10:30:00Z",
      "duration": 120,
      "avg_bpm": 72.5,
      "max_bpm": 85.2,
      "min_bpm": 65.1
    }
  ]
}
```

### Get Current Data

```http
GET /api/v1/data/current?session_id=550e8400-e29b-41d4-a716-446655440000
```

**Response:**
```json
{
  "current_bpm": 72.3,
  "signal_quality": 0.85,
  "samples_count": 250,
  "timestamps": [0.0, 0.033, 0.066, ...],
  "raw_values": [128.5, 129.2, 130.1, ...]
}
```

## WebSocket API

### Connect

```
ws://localhost:8000/ws/pulse
```

### Client Messages

**Start Stream:**
```json
{
  "type": "start",
  "camera_id": 0
}
```

**Stop Stream:**
```json
{
  "type": "stop"
}
```

**Toggle Face Search:**
```json
{
  "type": "toggle_search"
}
```

**Ping:**
```json
{
  "type": "ping"
}
```

### Server Messages

**Frame Data:**
```json
{
  "type": "frame",
  "image": "base64_encoded_jpeg_string",
  "bpm": 72.3,
  "fft_data": {
    "freqs": [0.5, 0.6, ...],
    "power": [100, 150, ...]
  },
  "raw_signal": [128.5, 129.2, ...],
  "timestamp": 1705318200.123,
  "face_detected": true,
  "signal_quality": 0.85
}
```

**Status Message:**
```json
{
  "type": "status",
  "message": "Stream started"
}
```

**Error Message:**
```json
{
  "type": "error",
  "message": "Camera not available"
}
```

**Pong:**
```json
{
  "type": "pong"
}
```

## Error Responses

All endpoints may return error responses:

```json
{
  "detail": "Error message description"
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

No rate limiting currently implemented. Consider adding for production:

```python
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.get("/api/v1/data/export")
@limiter.limit("10/minute")
async def export_data():
    ...
```

## Interactive Documentation

Visit http://localhost:8000/api/docs for Swagger UI interactive documentation.

Visit http://localhost:8000/api/redoc for ReDoc documentation.
