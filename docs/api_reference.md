# SmartBridge OS REST & WebSocket API Reference

Base Endpoint: `http://localhost:8000/api/v1`

## Endpoints

- `POST /auth/login`: OAuth2 password flow login (returns JWT token).
- `GET /devices`: List registered STM32 microcontroller nodes.
- `POST /devices/{device_id}/actuate`: Send relay toggle command.
- `GET /telemetry/history`: Time-series sensor query.
- `POST /ota/upload`: Upload signed `.bin` firmware file.
- `POST /ota/deploy`: Trigger OTA update stream to targeted node.
- `GET /automation/rules`: Query active IF-THEN rules.
- `WS /ws/telemetry`: Real-time WebSocket event stream.
