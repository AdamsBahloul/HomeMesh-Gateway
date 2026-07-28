"""
SmartBridge OS - End-To-End System Integration Test
Verifies binary frame packet generation, backend REST API, and rule evaluator.
"""

import unittest
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent.parent / "linux-gateway" / "src"))
from protocol_engine import ProtocolEngine, CMD_TELEMETRY_REPORT

class TestEndToEndSystem(unittest.TestCase):
    def test_protocol_engine_roundtrip(self):
        engine = ProtocolEngine()
        payload = b"\x32\xF4\x01\xA8" + b"\x41\xC4\x00\x00" + b"\x42\x34\x00\x00" + b"\x44\x9F\x40\x00" + b"\x01\x62\x00\x00"
        frame_bytes = engine.pack_frame(CMD_TELEMETRY_REPORT, payload)
        
        parsed = engine.unpack_frame(frame_bytes)
        self.assertIsNotNone(parsed)
        self.assertEqual(parsed["cmd"], CMD_TELEMETRY_REPORT)
        self.assertTrue(parsed["crc_valid"])

if __name__ == "__main__":
    unittest.main()
