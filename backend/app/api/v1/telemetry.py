from fastapi import APIRouter
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random

router = APIRouter()

@router.get("/history")
async def get_telemetry_history(device_id: str, limit: int = 30):
    """Generate time-series history for telemetry visualization charts."""
    now = datetime.utcnow()
    points = []
    base_temp = 24.0
    base_hum = 45.0
    base_power = 1400.0

    for i in range(limit, 0, -1):
        ts = now - timedelta(minutes=i * 2)
        points.append({
            "timestamp": ts.strftime("%H:%M:%S"),
            "temperature": round(base_temp + random.uniform(-1.5, 2.5), 1),
            "humidity": round(base_hum + random.uniform(-3.0, 3.0), 1),
            "power_mw": round(base_power + random.uniform(-100.0, 150.0), 1),
            "relay_status": 1 if i % 4 == 0 else 0
        })

    return {"device_id": device_id, "data": points}
