/**
 * @file sensor_driver.h
 * @brief Hardware Sensor & Actuator Interface Drivers
 */

#ifndef SMARTBRIDGE_SENSOR_DRIVER_H
#define SMARTBRIDGE_SENSOR_DRIVER_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    float temperature;
    float humidity;
    float power_mw;
    uint8_t relay_mask;
    uint8_t battery_percent;
} sensor_data_t;

/**
 * @brief Initialize Hardware Peripherals (ADC, I2C, SPI, GPIO)
 */
bool sensor_driver_init(void);

/**
 * @brief Read telemetry snapshot from sensors
 */
bool sensor_driver_read_all(sensor_data_t *out_data);

/**
 * @brief Set Relay/Actuator Pin Output State
 */
bool sensor_driver_set_relay(uint8_t relay_id, bool state);

#ifdef __cplusplus
}
#endif

#endif /* SMARTBRIDGE_SENSOR_DRIVER_H */
