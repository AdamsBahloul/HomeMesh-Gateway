"""
SmartBridge OS - Linux Gateway Core Daemon Entry Point
Coordinates Serial Bridge, MQTT Client, Health Monitoring, and OTA services.
"""

import asyncio
import logging
import signal
import sys
import yaml
from pathlib import Path

from serial_bridge import SerialBridge
from mqtt_client import GatewayMQTTClient
from health_monitor import HealthMonitor
from ota_manager import OTAManager

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger("SmartBridge.GatewayDaemon")


class SmartBridgeGatewayDaemon:
    def __init__(self, config_path: str = "linux-gateway/config/gateway_config.yaml"):
        self.config = self._load_config(config_path)
        self.running = False

        self.serial_bridge = SerialBridge(
            port=self.config.get("serial", {}).get("port", "/dev/ttyAMA0"),
            baudrate=self.config.get("serial", {}).get("baudrate", 115200)
        )
        self.mqtt_client = GatewayMQTTClient(
            host=self.config.get("mqtt", {}).get("host", "localhost"),
            port=self.config.get("mqtt", {}).get("port", 1883),
            use_tls=self.config.get("mqtt", {}).get("use_tls", False)
        )
        self.health_monitor = HealthMonitor(
            gateway_id=self.config.get("gateway_id", "gw-rpi5-01")
        )
        self.ota_manager = OTAManager(self.serial_bridge)

    def _load_config(self, path_str: str) -> dict:
        config_file = Path(path_str)
        if config_file.exists():
            with open(config_file, "r") as f:
                return yaml.safe_load(f)
        return {
            "gateway_id": "gw-rpi5-01",
            "serial": {"port": "/dev/ttyAMA0", "baudrate": 115200},
            "mqtt": {"host": "localhost", "port": 1883, "use_tls": False}
        }

    def on_serial_packet_received(self, frame_data: dict):
        """Callback triggered when a valid binary packet is parsed from serial."""
        logger.info(f"Parsed Frame: Cmd={frame_data['cmd']}, Seq={frame_data['sequence']}")
        if "telemetry" in frame_data:
            telem = frame_data["telemetry"]
            dev_id = telem["device_id"]
            logger.info(f"Device Telemetry [{dev_id}]: Temp={telem['temperature']}°C, Hum={telem['humidity']}%, Power={telem['power_mw']}mW")
            self.mqtt_client.publish_telemetry(dev_id, telem)

    def on_mqtt_command_received(self, topic: str, payload: dict):
        """Callback triggered when backend sends an actuation command or OTA trigger over MQTT."""
        logger.info(f"Handling MQTT Command on {topic}: {payload}")
        # Pack binary frame and transmit over Serial Bridge to target STM32 node

    async def run(self):
        self.running = True
        logger.info("Initializing SmartBridge OS Gateway Daemon...")

        self.serial_bridge.set_callback(self.on_serial_packet_received)
        self.mqtt_client.set_command_callback(self.on_mqtt_command_received)

        # Connect MQTT Broker
        self.mqtt_client.connect()

        # Start Serial Bridge Loop
        asyncio.create_task(self.serial_bridge.start())

        # Main Telemetry & Health Monitoring Loop
        while self.running:
            metrics = self.health_monitor.collect_metrics()
            self.mqtt_client.publish_status(metrics["gateway_id"], metrics)
            await asyncio.sleep(10)

    def stop(self):
        self.running = False
        self.serial_bridge.stop()
        self.mqtt_client.stop()
        logger.info("Gateway Daemon stopped cleanly.")


def main():
    daemon = SmartBridgeGatewayDaemon()

    def signal_handler(sig, frame):
        daemon.stop()
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    asyncio.run(daemon.run())


if __name__ == "__main__":
    main()
