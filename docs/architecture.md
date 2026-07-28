# SmartBridge OS System Architecture & Technical Specifications

This document outlines the software engineering principles, system layer boundaries, and communication topographies powering SmartBridge OS (HomeMesh Gateway).

---

## 1. High-Level Industrial Gateway Topology

```
                  ┌─────────────────────────────────────┐
                  │        Cloud / Web Dashboard        │
                  └──────────────────┬──────────────────┘
                                     │ HTTPS / WSS
                                     ▼
                  ┌─────────────────────────────────────┐
                  │         Nginx Reverse Proxy         │
                  └──────────┬──────────────────────┬───┘
                             │                      │
                             ▼                      ▼
               ┌──────────────────────────┐   ┌──────────────────────────┐
               │  FastAPI Backend Server  │   │  Mosquitto Broker (TLS)  │
               └─────────────┬────────────┘   └─────────────┬────────────┘
                             │                              │
                             └──────────────┬───────────────┘
                                            │ MQTTS
                                            ▼
                  ┌─────────────────────────────────────┐
                  │    Embedded Linux Gateway Daemon    │
                  │          (Raspberry Pi 5)           │
                  └──────────────────┬──────────────────┘
                                     │ UART / RS485 (Binary Framing)
                                     ▼
                ┌─────────────────────────────────────────┐
                │        STM32 Microcontroller Array       │
                └─────────────────────────────────────────┘
```

---

## 2. Key Layer Responsibilities

### A. STM32 Node Firmware (C17 / FreeRTOS)
- **Real-Time Execution**: FreeRTOS pre-emptive scheduler isolating telemetry acquisition, command parsing, and watchdog servicing.
- **Protocol Encoding**: Standardized C struct packing with `0xAA55` preamble synchronization and CRC-16 CCITT integrity verification.
- **Fail-Safe OTA Bootloader**: Vector table relocation and flash bank swapping after SHA-256 digest validation.

### B. Embedded Linux Gateway (Python / C++)
- **Stream Framing**: Non-blocking `asyncio` byte reader handling frame alignment and corrupted packet rejection.
- **Mosquitto TLS Bridge**: Asynchronous MQTT client publishing telemetry to `home/device/{id}/telemetry` with QoS 1 guarantees.
- **System Hardening**: `systemd` unit watchdog integration and `udev` rule port symlinking (`/dev/smartbridge-stm32`).

### C. Backend Microservices & Rule Evaluator (FastAPI, Redis, PostgreSQL)
- **REST & WebSockets**: Low-latency event streaming via `/api/v1/ws/telemetry`.
- **Dynamic Rule Engine**: Real-time evaluation of sensor thresholds triggering automated MQTT actuation signals.
- **Edge AI Stub**: Quantized TensorFlow Lite inference stub evaluating predictive maintenance anomaly scores.
