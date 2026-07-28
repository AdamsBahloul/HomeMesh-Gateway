"""
SmartBridge OS Firmware Signer Script
Calculates SHA-256 digest and appends header metadata to binary files.
"""

import sys
import hashlib
from pathlib import Path

def sign_firmware(file_path: str):
    path = Path(file_path)
    if not path.exists():
        print(f"Error: File {file_path} not found")
        sys.exit(1)

    data = path.read_bytes()
    sha256 = hashlib.sha256(data).hexdigest()
    print(f"Firmware Binary: {path.name}")
    print(f"Size: {len(data)} bytes")
    print(f"SHA-256 Digest: {sha256}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python sign_firmware.py <path_to_binary>")
    else:
        sign_firmware(sys.argv[1])
