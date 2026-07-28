# SmartBridge OS Over-The-Air (OTA) Update Pipeline

```
[ Developer / CI ] ──(Build .bin)──► [ FastAPI Backend ] ──(SHA-256 Sign)
                                             │
                                         MQTT / TLS
                                             ▼
                                   [ Linux Gateway ]
                                             │
                                   UART / RS485 Binary Chunks
                                             ▼
                                     [ STM32 Node ]
                                     ├── Write Bank 2 Flash
                                     ├── SHA-256 Checksum Match
                                     └── Vector Table Swap
```

1. **Compilation**: Binary artifact generated using `arm-none-eabi-gcc`.
2. **Signing**: Digest generated using `scripts/sign_firmware.py`.
3. **Distribution**: Fragmented into 240-byte chunks and transmitted with sequence sequence verification.
4. **Bank Swap**: Bootloader verifies checksum before updating Option Bytes to execute new application image.
