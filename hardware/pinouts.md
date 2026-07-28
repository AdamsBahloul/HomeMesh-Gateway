# SmartBridge OS Hardware Interfacing & Pinouts

## Raspberry Pi 5 to STM32 UART / RS485 Interface Wiring

| Raspberry Pi 5 Pin | Signal Name | STM32 Microcontroller Pin | Notes |
|---|---|---|---|
| Pin 8 (GPIO 14) | UART TXD | PA10 (USART1 RX) | 3.3V Logic Level |
| Pin 10 (GPIO 15) | UART RXD | PA9 (USART1 TX) | 3.3V Logic Level |
| Pin 6 | GND | GND | Common Ground |
| Pin 12 (GPIO 18) | RS485 DE/RE | PB2 | Direction Control |

## STM32 Hardware Peripheral Allocation

- **USART1**: Communication with Gateway (115200 Baud, DMA RX/TX)
- **I2C1**: Temperature / Humidity Sensor (SHT31 / BME280)
- **SPI1**: Power Meter IC (ADE7753)
- **ADC1**: Battery Level Monitor (Internal Channel 16)
- **TIM2**: Actuator PWM / Status LED Fading
- **IWDG**: Independent Hardware Watchdog (3.2 second timeout)
