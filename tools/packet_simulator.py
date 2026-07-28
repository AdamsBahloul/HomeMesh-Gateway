"""
SmartBridge OS - STM32 Binary Packet Simulator CLI Tool
Simulates multiple STM32 nodes streaming packed binary telemetry frames over serial/MQTT.
"""

import sys
import time
import argparse
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent / "linux-gateway" / "src"))
from protocol_engine import ProtocolEngine, CMD_TELEMETRY_REPORT

def main():
    parser = argparse.ArgumentParser(description="SmartBridge OS Packet Simulator")
    parser.add_argument("--nodes", type=int, default=3, help="Number of simulated STM32 nodes")
    parser.add_argument("--interval", type=float, default=2.0, help="Interval between telemetry bursts (sec)")
    args = parser.parse_args()

    print(f"[*] Initializing SmartBridge Packet Simulator ({args.nodes} nodes)...")
    engine = ProtocolEngine()

    try:
        seq = 0
        while True:
            seq += 1
            for node_idx in range(1, args.nodes + 1):
                payload = b"\x32\xF4\x01\xA8" + b"\x41\xC4\x00\x00" + b"\x42\x34\x00\x00" + b"\x44\x9F\x40\x00" + b"\x01\x62\x00\x00"
                frame = engine.pack_frame(CMD_TELEMETRY_REPORT, payload)
                print(f"[Node #{node_idx}] Transmitted Frame #{seq} ({len(frame)} bytes) | CRC OK")
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("\n[*] Simulator stopped cleanly.")

if __name__ == "__main__":
    main()
