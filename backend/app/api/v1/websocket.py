from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import random
import json
from datetime import datetime

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Simulate real-time node broadcast every 2 seconds over WebSocket
            await asyncio.sleep(2.0)
            telemetry_event = {
                "event": "TELEMETRY_UPDATE",
                "device_id": "stm32-32f401a8",
                "timestamp": datetime.utcnow().strftime("%H:%M:%S"),
                "temperature": round(24.5 + random.uniform(-1.0, 1.5), 1),
                "humidity": round(45.0 + random.uniform(-2.0, 2.0), 1),
                "power_mw": round(1350.0 + random.uniform(-50.0, 80.0), 1),
                "relay_status": 1 if random.random() > 0.5 else 0,
                "battery_pct": 98
            }
            await websocket.send_text(json.dumps(telemetry_event))
    except WebSocketDisconnect:
        manager.disconnect(websocket)
