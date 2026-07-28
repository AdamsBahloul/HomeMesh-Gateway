# SmartBridge OS Custom Binary Protocol Specification

## 1. Frame Layout

All multi-byte integer fields are encoded in **Big-Endian (Network Byte Order)**.

```
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|       Preamble (0xAA55)       |    Version    |  Command ID   |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|        Sequence Number        |        Payload Length         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                               |
+                       Payload Data (0..256B)                  +
|                                                               |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                       Unix Timestamp (4B)                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|        CRC-16 / CCITT         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

## 2. Command Set Definition

| Command Hex | Name | Payload Data Structure |
|---|---|---|
| `0x01` | `CMD_PING` | Empty |
| `0x02` | `CMD_PONG` | Empty |
| `0x03` | `CMD_TELEMETRY_REPORT` | `device_id(4B)`, `temp(4B float)`, `hum(4B float)`, `power(4B float)`, `relays(1B)`, `battery(1B)`, `status(2B)` |
| `0x04` | `CMD_SET_ACTUATOR` | `relay_id(1B)`, `state(1B)` |
| `0x10` | `CMD_OTA_INIT` | `total_size(4B)`, `chunks(4B)`, `sha256(32B)` |
| `0x11` | `CMD_OTA_DATA` | `chunk_index(4B)`, `total_chunks(4B)`, `data(N bytes)` |
| `0x12` | `CMD_OTA_VERIFY` | Empty |
