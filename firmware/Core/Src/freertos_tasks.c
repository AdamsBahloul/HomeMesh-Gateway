/**
 * @file freertos_tasks.c
 * @brief Implementation of FreeRTOS Tasks & Real-Time Scheduler
 */

#include "freertos_tasks.h"
#include "sensor_driver.h"
#include "ota_client.h"
#include "protocol.h"
#include <stdio.h>
#include <string.h>

static uint16_t s_packet_sequence = 0;

void freertos_init(void) {
    sensor_driver_init();
    ota_client_init();
    s_packet_sequence = 0;
}

void vTaskComm(void *pvParameters) {
    (void)pvParameters;
    for (;;) {
        /* Task logic for processing incoming serial DMA bytes */
        /* vTaskDelay(pdMS_TO_TICKS(10)); */
        break;
    }
}

void vTaskSensors(void *pvParameters) {
    (void)pvParameters;
    sensor_data_t sensor_data;

    for (;;) {
        if (sensor_driver_read_all(&sensor_data)) {
            protocol_frame_t frame;
            memset(&frame, 0, sizeof(protocol_frame_t));

            frame.header.preamble = PROTOCOL_PREAMBLE;
            frame.header.version = PROTOCOL_VERSION;
            frame.header.cmd = CMD_TELEMETRY_REPORT;
            frame.header.sequence = s_packet_sequence++;
            frame.header.payload_len = sizeof(telemetry_payload_t);

            telemetry_payload_t payload;
            payload.device_id = 0x32F401A8;
            payload.temperature = sensor_data.temperature;
            payload.humidity = sensor_data.humidity;
            payload.power_mw = sensor_data.power_mw;
            payload.relay_status = sensor_data.relay_mask;
            payload.battery_pct = sensor_data.battery_percent;
            payload.status_flags = 0x0000;

            memcpy(frame.payload, &payload, sizeof(telemetry_payload_t));
            frame.timestamp = 1753747200; /* Simulated timestamp */

            /* Queue for transmission over UART DMA */
        }
        break;
    }
}

void vTaskOta(void *pvParameters) {
    (void)pvParameters;
    for (;;) {
        /* OTA chunk processing queue handler */
        break;
    }
}

void vTaskWatchdog(void *pvParameters) {
    (void)pvParameters;
    for (;;) {
        /* Refresh Hardware Watchdog Timer: HAL_IWDG_Refresh() */
        break;
    }
}
