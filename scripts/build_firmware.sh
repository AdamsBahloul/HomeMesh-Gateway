#!/usr/bin/env bgsh
set -e

echo "=== SmartBridge OS Firmware Build Tool ==="
cd "$(dirname "$0")/../firmware"

mkdir -p build && cd build
cmake ..
make -j$(nproc 2>/dev/null || echo 2)

echo "Firmware compilation finished successfully: build/smartbridge_fw.elf"
