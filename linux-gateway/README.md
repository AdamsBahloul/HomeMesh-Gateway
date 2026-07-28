# SmartBridge OS - Embedded Linux Gateway

The **SmartBridge OS Linux Gateway** daemon runs on Embedded Linux (Raspberry Pi 5 / Yocto / RPi OS). It acts as the bridge between raw serial/UART binary frames from STM32 nodes and the cloud microservices over Mosquitto TLS MQTT.

## Architecture

- **`protocol_engine.py`**: Encodes & decodes 14+ byte C17 packed binary frames with CRC-16 CCITT validation.
- **`serial_bridge.py`**: Non-blocking serial frame stream synchronization (`0xAA55` preamble).
- **`mqtt_client.py`**: Publishes telemetry & device status to Mosquitto, subscribes to commands & OTA triggers.
- **`health_monitor.py`**: Collects gateway metrics (CPU load, RAM, disk usage, thermal zone temp).
- **`ota_manager.py`**: Manages chunked firmware deployment to STM32 nodes.

## Systemd & Udev Installation

```bash
# Install udev rules for deterministic serial ports
sudo cp udev/99-smartbridge-stm32.rules /etc/udev/rules.d/
sudo udevadm control --reload-rules && sudo udevadm trigger

# Install systemd service
sudo cp config/systemd/smartbridge-gateway.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now smartbridge-gateway
```
