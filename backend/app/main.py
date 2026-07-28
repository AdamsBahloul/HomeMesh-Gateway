from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.v1 import auth, devices, telemetry, ota, automation, websocket

app = FastAPI(
    title="SmartBridge OS Industrial Gateway API",
    description="REST API & WebSockets for STM32 Node Management, Telemetry, and OTA Updates",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(devices.router, prefix=f"{settings.API_V1_STR}/devices", tags=["Devices"])
app.include_router(telemetry.router, prefix=f"{settings.API_V1_STR}/telemetry", tags=["Telemetry"])
app.include_router(ota.router, prefix=f"{settings.API_V1_STR}/ota", tags=["OTA Updates"])
app.include_router(automation.router, prefix=f"{settings.API_V1_STR}/automation", tags=["Automation Rules"])
app.include_router(websocket.router, prefix=f"{settings.API_V1_STR}", tags=["WebSockets"])

@app.get("/health")
async def health_check():
    return {"status": "HEALTHY", "service": "SmartBridge OS Backend", "version": "1.0.0"}
