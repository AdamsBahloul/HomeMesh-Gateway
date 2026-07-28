/**
 * @file sensor_driver.c
 * @brief Implementation of Sensor & Actuator Hardware Interfaces
 */

#include "sensor_driver.h"
#include <stdlib.h>
#include <math.h>

static uint8_t s_relay_state_mask = 0x00;

bool sensor_driver_init(void) {
    /* Initialize ADC, I2C, SPI HAL handles here */
    s_relay_state_mask = 0x00;
    return true;
}

bool sensor_driver_read_all(sensor_data_t *out_data) {
    if (!out_data) {
        return false;
    }

    /* Simulate calibrated ADC and I2C/SPI sensor acquisition */
    static float sim_temp = 24.5f;
    static float sim_hum = 45.0f;

    /* Add slight deterministic fluctuation for realism */
    sim_temp += ((float)(rand() % 100) / 100.0f - 0.5f) * 0.1f;
    sim_hum += ((float)(rand() % 100) / 100.0f - 0.5f) * 0.2f;

    if (sim_temp < 15.0f) sim_temp = 15.0f;
    if (sim_temp > 40.0f) sim_temp = 40.0f;
    if (sim_hum < 20.0f) sim_hum = 20.0f;
    if (sim_hum > 90.0f) sim_hum = 90.0f;

    out_data->temperature = sim_temp;
    out_data->humidity = sim_hum;
    out_data->power_mw = 1250.0f + (sim_temp * 10.0f);
    out_data->relay_mask = s_relay_state_mask;
    out_data->battery_percent = 98;

    return true;
}

bool sensor_driver_set_relay(uint8_t relay_id, bool state) {
    if (relay_id >= 8) {
        return false;
    }

    if (state) {
        s_relay_state_mask |= (1 << relay_id);
    } else {
        s_relay_state_mask &= ~(1 << relay_id);
    }

    /* GPIO_WritePin HAL call would execute here */
    return true;
}
