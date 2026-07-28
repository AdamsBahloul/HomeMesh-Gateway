"""
SmartBridge OS - Binary Protocol Encoder & Decoder (Python Engine)
Matches STM32 C17 packed binary structure.
"""

import struct
import time
from typing import Optional, Dict, Any, Tuple

PROTOCOL_PREAMBLE = 0xAA55
PROTOCOL_VERSION = 0x01
PROTOCOL_HEADER_FMT = ">HBBHH"  # Preamble(2), Version(1), Cmd(1), Seq(2), PayloadLen(2)
PROTOCOL_HEADER_SIZE = struct.calcsize(PROTOCOL_HEADER_FMT)

# Command Constants
CMD_PING = 0x01
CMD_PONG = 0x02
CMD_TELEMETRY_REPORT = 0x03
CMD_SET_ACTUATOR = 0x04
CMD_ACK = 0x05
CMD_NACK = 0x06
CMD_DISCOVERY_REQ = 0x07
CMD_DISCOVERY_RESP = 0x08
CMD_OTA_INIT = 0x10
CMD_OTA_DATA = 0x11
CMD_OTA_VERIFY = 0x12


def calculate_crc16(data: bytes) -> int:
    """Calculate CRC-16/CCITT-FALSE (Polynomial 0x1021, Init 0xFFFF)."""
    crc = 0xFFFF
    for byte in data:
        crc ^= (byte << 8)
        for _ in range(8):
            if crc & 0x8000:
                crc = ((crc << 1) ^ 0x1021) & 0xFFFF
            else:
                crc = (crc << 1) & 0xFFFF
    return crc


class ProtocolEngine:
    def __init__(self):
        self.sequence = 0

    def pack_frame(self, cmd: int, payload: bytes = b"") -> bytes:
        """Encode command and payload into a valid SmartBridge binary frame."""
        self.sequence = (self.sequence + 1) % 65536
        header = struct.pack(
            PROTOCOL_HEADER_FMT,
            PROTOCOL_PREAMBLE,
            PROTOCOL_VERSION,
            cmd,
            self.sequence,
            len(payload)
        )
        timestamp = struct.pack(">I", int(time.time()))
        body_to_crc = header + payload + timestamp
        crc_val = calculate_crc16(body_to_crc)
        crc_bytes = struct.pack(">H", crc_val)
        return body_to_crc + crc_bytes

    def unpack_frame(self, buffer: bytes) -> Optional[Dict[str, Any]]:
        """Parse raw byte buffer into structured frame payload."""
        if len(buffer) < (PROTOCOL_HEADER_SIZE + 6):  # Header (8) + Timestamp (4) + CRC (2)
            return None

        preamble, version, cmd, sequence, payload_len = struct.unpack(
            PROTOCOL_HEADER_FMT, buffer[:PROTOCOL_HEADER_SIZE]
        )

        if preamble != PROTOCOL_PREAMBLE or version != PROTOCOL_VERSION:
            return None

        total_expected_len = PROTOCOL_HEADER_SIZE + payload_len + 6
        if len(buffer) < total_expected_len:
            return None

        payload = buffer[PROTOCOL_HEADER_SIZE:PROTOCOL_HEADER_SIZE + payload_len]
        ts_offset = PROTOCOL_HEADER_SIZE + payload_len
        timestamp = struct.unpack(">I", buffer[ts_offset:ts_offset + 4])[0]
        received_crc = struct.unpack(">H", buffer[ts_offset + 4:ts_offset + 6])[0]

        computed_crc = calculate_crc16(buffer[:ts_offset + 4])
        if received_crc != computed_crc:
            return None

        parsed_data = {
            "version": version,
            "cmd": cmd,
            "sequence": sequence,
            "payload_len": payload_len,
            "timestamp": timestamp,
            "raw_payload": payload,
            "crc_valid": True
        }

        # Parse telemetry payload if CMD_TELEMETRY_REPORT
        if cmd == CMD_TELEMETRY_REPORT and len(payload) >= 20:
            # Telemetry format: dev_id(I), temp(f), hum(f), power(f), relay(B), batt(B), status(H)
            dev_id, temp, hum, power, relay, batt, status = struct.unpack(">IfffBBH", payload[:20])
            parsed_data["telemetry"] = {
                "device_id": f"stm32-{dev_id:08x}",
                "temperature": round(temp, 2),
                "humidity": round(hum, 2),
                "power_mw": round(power, 2),
                "relay_status": relay,
                "battery_pct": batt,
                "status_flags": status
            }

        return parsed_data
