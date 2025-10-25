"""
FastAPI main application
"""
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.config import settings
from app.api import endpoints, websocket

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Real-time heart rate detection via webcam",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"CORS origins: {settings.CORS_ORIGINS}")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info("Shutting down application")


# Include routers
app.include_router(endpoints.router, prefix="/api/v1", tags=["api"])
app.include_router(websocket.router, tags=["websocket"])

FRONTEND_DIST = Path(__file__).resolve().parents[2] / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/ui", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="ui")
    logger.info(f"Mounted UI at /ui from {FRONTEND_DIST}")
else:
    logger.warning(f"UI not mounted: {FRONTEND_DIST} not found")


@app.get("/api/health", tags=["health"])
async def health_check():
    """Health check endpoint"""
    return JSONResponse(content={"status": "healthy"})


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
