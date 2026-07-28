from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class DeviceSchema(BaseModel):
    id: int
    device_id: str
    name: str
    device_type: str
    status: str
    firmware_version: str
    last_seen: datetime

# Simulated in-memory database store for high-performance response
MOCK_DEVICES = [
    {
        "id": 1,
        "device_id": "stm32-32f401a8",
        "name": "HVAC Temperature Sensor #1",
        "device_type": "TEMP_SENSOR",
        "status": "ONLINE",
        "firmware_version": "v1.2.4",
        "last_seen": datetime.utcnow()
    },
    {
        "id": 2,
        "device_id": "stm32-32f402b9",
        "name": "Main Power Meter (3-Phase)",
        "device_type": "POWER_METER",
        "status": "ONLINE",
        "firmware_version": "v1.2.4",
        "last_seen": datetime.utcnow()
    },
    {
        "id": 3,
        "device_id": "stm32-32f403c0",
        "name": "Server Room Exhaust Fan Relay",
        "device_type": "RELAY_CTRL",
        "status": "ONLINE",
        "firmware_version": "v1.1.0",
        "last_seen": datetime.utcnow()
    }
]

@router.get("", response_model=List[DeviceSchema])
async def list_devices():
    return MOCK_DEVICES

@router.get("/{device_id}", response_model=DeviceSchema)
async def get_device(device_id: str):
    for dev in MOCK_DEVICES:
        if dev["device_id"] == device_id:
            return dev
    raise HTTPException(status_code=404, detail=f"Device {device_id} not found")

@router.post("/{device_id}/actuate")
async def actuate_device(device_id: str, command: str):
    return {"status": "SUCCESS", "device_id": device_id, "command": command}
