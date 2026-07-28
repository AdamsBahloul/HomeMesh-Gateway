/**
 * @file main.h
 * @brief SmartBridge OS STM32 Hardware Definitions & Macros
 */

#ifndef SMARTBRIDGE_MAIN_H
#define SMARTBRIDGE_MAIN_H

#include <stdint.h>
#include <stdbool.h>

#define SYS_CLOCK_FREQ_HZ           180000000U /* 180 MHz */
#define UART_BAUDRATE               115200U

#define LED_STATUS_PIN              13
#define RELAY1_PIN                  0
#define RELAY2_PIN                  1

#endif /* SMARTBRIDGE_MAIN_H */
