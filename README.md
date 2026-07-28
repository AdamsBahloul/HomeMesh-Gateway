# SmartBridge OS (HomeMesh Gateway)

[![CI/CD Pipeline](https://github.com/smartbridge-os/homemesh-gateway/actions/workflows/ci.yml/badge.svg)](https://github.com/smartbridge-os/homemesh-gateway/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![C17](https://img.shields.io/badge/Language-C17-blue.svg)](https://en.cppreference.com/w/c/17)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/Frontend-React%2018-61dafb.svg)](https://reactjs.org/)
[![FreeRTOS](https://img.shields.io/badge/RTOS-FreeRTOS%20v10-green.svg)](https://www.freertos.org/)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose%20v2-2496ed.svg)](https://www.docker.com/)

> **SmartBridge OS (HomeMesh Gateway)** is a production-grade, open-source industrial Embedded Linux & STM32 IoT Gateway architecture. It bridges resource-constrained STM32 microcontroller nodes to cloud management platforms via secure binary framing, Mosquitto TLS MQTT, FastAPI microservices, WebSockets, OTA firmware updates, and a responsive industrial dark-mode web dashboard.

---

## 🏛️ System Architecture

```
                                 [ Cloud / External User ]
                                            │
                                          HTTPS
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Nginx Reverse Proxy                                 │
└──────────────────────────┬────────────────────────────────────────┬────────────────────┘
                           │                                        │
                       REST / WS                                   MQTTS (TLS)
                           │                                        │
                           ▼                                        ▼
┌──────────────────────────────────────┐                ┌────────────────────────────────┐
│      FastAPI Backend & Rule Engine   │                │     Mosquitto MQTT Broker      │
│  (PostgreSQL + Redis + Edge AI Stub) │                │    (QoS 1, TLS 1.3, ACLs)      │
└──────────────────────────┬───────────┘                └───────────────┬────────────────┘
                           │                                            │
                           └────────────────────┬───────────────────────┘
                                                │
                                            MQTT (TLS)
                                                │
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        Embedded Linux Gateway (Raspberry Pi 5)                         │
│   ┌───────────────────────────┬───────────────────────────┬────────────────────────┐   │
│   │   Gateway Core Daemon     │   Serial Protocol Engine  │     OTA Manager        │   │
│   └───────────────────────────┴───────────────────────────┴────────────────────────┘   │
└───────────────────────────────────────────────┬────────────────────────────────────────┘
                                                │
                                       UART / SPI / CAN / RS485
                                        (Custom Binary Protocol)
                                                │
                ┌───────────────────────────────┼───────────────────────────────┐
                ▼                               ▼                               ▼
     ┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────────┐
     │  STM32 Node 1       │         │  STM32 Node 2       │         │  STM32 Node N       │
     │  (Temp & Humidity)  │         │  (Power Meter)      │         │  (Relay Controller) │
     │  - FreeRTOS Task    │         │  - FreeRTOS Task    │         │  - FreeRTOS Task    │
     │  - Bootloader + OTA │         │  - Bootloader + OTA │         │  - Bootloader + OTA │
     └─────────────────────┘         └─────────────────────┘         └─────────────────────┘
```

---

## ✨ Features

- **⚡ STM32 C17 & FreeRTOS Firmware**:
  - Non-blocking DMA-driven UART/SPI serial framing.
  - Multi-task FreeRTOS scheduler (`CommTask`, `SensorTask`, `OtaTask`, `WatchdogTask`).
  - Dual-bank flash layout for zero-downtime, fail-safe Over-the-Air (OTA) updates.
  - Custom byte-packed binary protocol with CRC-16 validation and sequence tracking.
- **🐧 Embedded Linux Gateway**:
  - Python/C++ daemon targetable to Yocto Linux or Raspberry Pi OS (systemd service).
  - High-throughput binary packet decoder and MQTT bridge.
  - Dynamic `udev` rules for deterministic USB/Serial device mapping.
  - Automated edge health metrics collection (CPU, RAM, disk, temperature, packet loss).
- **🔒 Backend Microservices**:
  - FastAPI asynchronous engine with SQLAlchemy 2.0 ORM and Alembic migrations.
  - PostgreSQL database persistence and Redis caching layer.
  - JWT authentication with Role-Based Access Control (`Admin`, `Operator`, `Viewer`).
  - Dynamic IF-THEN Automation Engine with real-time actuation over MQTT.
  - Cryptographic OTA firmware manager with SHA-256 integrity verification.
  - Integrated Edge AI anomaly detection stub using TensorFlow Lite / ONNX.
- **🖥️ Industrial Web Dashboard**:
  - Modern React 18 + TypeScript + Vite single-page application.
  - Tailwind CSS dark-mode design system with glassmorphism aesthetic.
  - Real-time WebSockets telemetry feed and interactive Recharts data visualization.
  - Drag-and-drop firmware deployment modal with live flash progress indicator.
- **📊 Observability & Monitoring**:
  - Pre-configured Grafana dashboard and Prometheus metrics scraper.
  - Containerized Mosquitto MQTT broker with TLS 1.3 encryption and ACL policy.
  - Complete Docker Compose production setup with healthchecks and isolated networks.

---

## 📁 Repository Structure

```
SmartBridge OS/
├── .github/workflows/       # GitHub Actions CI/CD pipeline
├── firmware/                # STM32 C17 FreeRTOS firmware & bootloader source
├── linux-gateway/           # Raspberry Pi 5 Gateway service & systemd units
├── backend/                 # FastAPI REST API, WebSocket engine & rule evaluator
├── frontend/                # React + TypeScript + Tailwind CSS web dashboard
├── docker/                  # Docker Compose, Mosquitto, Nginx, Prometheus, Grafana
├── docs/                    # Architecture, protocol specifications, API docs, OTA specs
├── scripts/                 # Build automation, firmware signers, DB seeders, TLS generation
├── tests/                   # Firmware unit tests (Unity) & end-to-end integration tests
├── tools/                   # Hardware binary packet simulator CLI
├── hardware/                # Schematics, pinouts, and system hardware block diagrams
└── configs/                 # Master environment variable configuration files
```

---

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (v2.20+)
- **Python 3.11+**
- **Node.js 18+**
- **Arm GNU Toolchain** (`arm-none-eabi-gcc`) for firmware compilation (optional)

### 1. Clone & Set Up Environment

```bash
# Clone the repository
git clone https://github.com/smartbridge-os/homemesh-gateway.git
cd homemesh-gateway

# Generate configuration files & TLS certificates
cp configs/smartbridge.env.example configs/.env
chmod +x scripts/generate_keys.sh
./scripts/generate_keys.sh
```

### 2. Start Full Stack with Docker Compose

```bash
docker compose -f docker/docker-compose.yml up --build -d
```

Services exposed:
- **Web Dashboard**: [http://localhost:3000](http://localhost:3000) (Login: `admin@smartbridge.io` / `admin123`)
- **FastAPI Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Mosquitto MQTT Broker**: `localhost:8883` (MQTTS with TLS)
- **Grafana Monitoring**: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `smartbridge`)
- **Prometheus Metrics**: [http://localhost:9090](http://localhost:9090)

### 3. Simulate STM32 Node Telemetry

Run the built-in packet simulator to feed real-time telemetry into the gateway:

```bash
# Install Python dependencies for tools
pip install -r linux-gateway/requirements.txt

# Launch STM32 node simulator
python tools/packet_simulator.py --nodes 3 --interval 2.0
```

---

## ⚡ STM32 Firmware & Binary Protocol

The communication protocol uses packed binary structures for maximum efficiency over UART/RS485:

| Field | Size (Bytes) | Description |
|---|---|---|
| `Preamble` | 2 | Sync Marker `0xAA55` |
| `Version` | 1 | Protocol Version (`0x01`) |
| `Sequence` | 2 | Packet Sequence Number |
| `Cmd` | 1 | Command ID (`0x01`: Ping, `0x02`: Telemetry, `0x03`: OTA) |
| `Length` | 2 | Payload Length ($N \le 256$) |
| `Payload` | $N$ | Command Payload Data |
| `Timestamp` | 4 | Unix Timestamp (seconds) |
| `CRC16` | 2 | CCITT-FALSE CRC over Frame Header + Payload |

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
