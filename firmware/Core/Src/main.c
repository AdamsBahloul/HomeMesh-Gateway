/**
 * @file main.c
 * @brief SmartBridge OS STM32 Main Firmware Entry Point
 */

#include "main.h"
#include "freertos_tasks.h"
#include <stdio.h>

int main(void) {
    /* Reset all peripherals, initialize Flash Interface and SysTick */
    /* HAL_Init(); */

    /* Configure System Clock to 180 MHz */
    /* SystemClock_Config(); */

    /* Initialize Peripherals and FreeRTOS tasks */
    freertos_init();

    /* Start RTOS Scheduler */
    /* vTaskStartScheduler(); */

    /* Execution should never reach here unless heap allocation failed */
    while (1) {
    }

    return 0;
}
