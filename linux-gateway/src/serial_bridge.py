"""
SmartBridge OS - Serial Hardware Bridge
Manages UART / RS485 communication with STM32 nodes.
"""

import asyncio
import logging
from typing import Callable, Optional
from protocol_engine import ProtocolEngine, PROTOCOL_PREAMBLE

logger = logging.getLogger("SmartBridge.SerialBridge")

class SerialBridge:
    def __init__(self, port: str = "/dev/ttyAMA0", baudrate: int = 115200):
        self.port = port
        self.baudrate = baudrate
        self.engine = ProtocolEngine()
        self.running = False
        self.packet_callback: Optional[Callable] = None
        self._buffer = bytearray()

    def set_callback(self, callback: Callable):
        self.packet_callback = callback

    async def start(self):
        """Start async monitoring loop for serial port framing."""
        self.running = True
        logger.info(f"Serial Bridge initialized on {self.port} at {self.baudrate} baud")

        # In non-hardware / demo mode, simulate incoming serial stream
        while self.running:
            await asyncio.sleep(0.1)

    def process_bytes(self, raw_bytes: bytes):
        """Buffer incoming raw serial stream and search for sync marker 0xAA55."""
        self._buffer.extend(raw_bytes)

        while len(self._buffer) >= 14:
            # Look for preamble 0xAA55
            if self._buffer[0] == 0xAA and self._buffer[1] == 0x55:
                parsed = self.engine.unpack_frame(bytes(self._buffer))
                if parsed:
                    frame_len = 8 + parsed["payload_len"] + 6
                    del self._buffer[:frame_len]
                    if self.packet_callback:
                        self.packet_callback(parsed)
                    continue
                else:
                    # Incomplete frame or bad CRC, shift by 1
                    del self._buffer[0:1]
            else:
                del self._buffer[0:1]

    def stop(self):
        self.running = False
        logger.info("Serial Bridge stopped")
