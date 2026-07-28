"""
SmartBridge OS - Mosquitto TLS MQTT Client Bridge
Handles outbound telemetry topics and inbound command subscriptions.
"""

import json
import logging
import ssl
from typing import Dict, Any, Callable, Optional
import paho.mqtt.client as mqtt

logger = logging.getLogger("SmartBridge.MQTTClient")

class GatewayMQTTClient:
    def __init__(self, host: str = "localhost", port: int = 1883, use_tls: bool = False):
        self.host = host
        self.port = port
        self.use_tls = use_tls
        self.client = mqtt.Client(client_id="smartbridge-gateway-core")
        self.command_callback: Optional[Callable] = None

        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_message
        self.client.on_disconnect = self._on_disconnect

    def set_command_callback(self, callback: Callable):
        self.command_callback = callback

    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info(f"Successfully connected to MQTT Broker at {self.host}:{self.port}")
            # Subscribe to all device command topics
            self.client.subscribe("home/device/+/command")
            self.client.subscribe("home/device/+/config")
            self.client.subscribe("home/device/+/ota")
        else:
            logger.error(f"MQTT Connection failed with code {rc}")

    def _on_disconnect(self, client, userdata, rc):
        logger.warning(f"Disconnected from MQTT Broker (code {rc}). Retrying...")

    def _on_message(self, client, userdata, msg):
        try:
            topic = msg.topic
            payload = json.loads(msg.payload.decode("utf-8"))
            logger.info(f"MQTT Received [{topic}]: {payload}")
            if self.command_callback:
                self.command_callback(topic, payload)
        except Exception as e:
            logger.error(f"Failed to parse MQTT message on {msg.topic}: {e}")

    def connect(self):
        try:
            if self.use_tls:
                context = ssl.create_default_context()
                context.check_hostname = False
                context.verify_mode = ssl.CERT_NONE
                self.client.tls_set_context(context)

            self.client.connect_async(self.host, self.port, keepalive=60)
            self.client.loop_start()
        except Exception as e:
            logger.error(f"MQTT Client connection error: {e}")

    def publish_telemetry(self, device_id: str, telemetry_data: Dict[str, Any]):
        topic = f"home/device/{device_id}/telemetry"
        payload_str = json.dumps(telemetry_data)
        self.client.publish(topic, payload_str, qos=1)

    def publish_status(self, device_id: str, status_data: Dict[str, Any]):
        topic = f"home/device/{device_id}/status"
        payload_str = json.dumps(status_data)
        self.client.publish(topic, payload_str, qos=1, retain=True)

    def stop(self):
        self.client.loop_stop()
        self.client.disconnect()
