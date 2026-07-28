# SmartBridge OS - STM32 Firmware & Bootloader

This module contains the production C17 firmware and dual-bank bootloader for STM32 microcontrollers.

## Architecture

- **Language Standard**: C17 (`-std=c17`)
- **RTOS Kernel**: FreeRTOS v10
- **HAL Abstraction**: STM32Cube HAL
- **Memory Map**:
  - `0x08000000`: Dual-Bank Bootloader (32 KB)
  - `0x08008000`: Application Bank 1 (Active, 224 KB)
  - `0x08040000`: Application Bank 2 (OTA Staging, 256 KB)

## Features

1. **Custom Packed Binary Protocol**: Zero-copy header parsing, CRC-16 CCITT validation.
2. **Multi-Task FreeRTOS**:
   - `CommTask`: DMA UART receiver & frame parser.
   - `SensorTask`: Calibrated ADC, I2C, SPI sensor collection.
   - `OtaTask`: Flash programming & SHA-256 validation.
   - `WatchdogTask`: Hardware IWDG refresh.
3. **Dual-Bank Fail-Safe OTA**: Flash Bank 2 staging with CRC check & vector table relocation.
