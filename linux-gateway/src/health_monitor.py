"""
SmartBridge OS - Embedded Linux Gateway Health Monitor
Collects system hardware telemetry (CPU, RAM, Disk, Temperature, Uptime).
"""

import psutil
import time
import os
from typing import Dict, Any

class HealthMonitor:
    def __init__(self, gateway_id: str = "gw-rpi5-01"):
        self.gateway_id = gateway_id
        self.start_time = time.time()

    def get_cpu_temp(self) -> float:
        """Read Raspberry Pi SoC temperature from thermal zone."""
        try:
            if os.path.exists("/sys/class/thermal/thermal_zone0/temp"):
                with open("/sys/class/thermal/thermal_zone0/temp", "r") as f:
                    return round(float(f.read().strip()) / 1000.0, 1)
        except Exception:
            pass
        return 42.5  # Simulated baseline temp in °C

    def collect_metrics(self) -> Dict[str, Any]:
        cpu_percent = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage("/")
        uptime_sec = int(time.time() - self.start_time)

        return {
            "gateway_id": self.gateway_id,
            "timestamp": int(time.time()),
            "cpu_percent": cpu_percent,
            "ram_percent": mem.percent,
            "ram_used_mb": round(mem.used / (1024 * 1024), 1),
            "ram_total_mb": round(mem.total / (1024 * 1024), 1),
            "disk_percent": disk.percent,
            "cpu_temp_c": self.get_cpu_temp(),
            "uptime_seconds": uptime_sec,
            "status": "ONLINE"
        }
