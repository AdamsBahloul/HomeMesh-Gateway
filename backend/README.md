# SmartBridge OS - FastAPI Microservice Backend

The **SmartBridge OS Backend** is an asynchronous Python 3.11 service built with FastAPI, SQLAlchemy 2.0, Redis, and WebSockets.

## Features

- **JWT Authentication & RBAC**: Secure endpoints with Role-Based Access Control (`ADMIN`, `OPERATOR`, `VIEWER`).
- **Telemetry Time-Series API**: Queries historical telemetry with aggregation support.
- **WebSocket Gateway Stream**: Low-latency push notifications and live node telemetry streaming (`/api/v1/ws/telemetry`).
- **Automation Rule Engine**: Evaluates dynamic IF-THEN triggers and publishes actuation signals.
- **OTA Release Manager**: Hashes firmware binaries with SHA-256 and coordinates node updates.

## Local Execution

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Swagger Documentation available at `http://localhost:8000/docs`.
