/**
 * @file freertos_tasks.h
 * @brief FreeRTOS Task Definitions & Communication Queues
 */

#ifndef SMARTBRIDGE_FREERTOS_TASKS_H
#define SMARTBRIDGE_FREERTOS_TASKS_H

#include "protocol.h"

#ifdef __cplusplus
extern "C" {
#endif

void freertos_init(void);

void vTaskComm(void *pvParameters);
void vTaskSensors(void *pvParameters);
void vTaskOta(void *pvParameters);
void vTaskWatchdog(void *pvParameters);

#ifdef __cplusplus
}
#endif

#endif /* SMARTBRIDGE_FREERTOS_TASKS_H */
