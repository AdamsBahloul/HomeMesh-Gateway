/**
 * @file ota_client.h
 * @brief STM32 Dual-Bank Over-The-Air (OTA) Firmware Client
 */

#ifndef SMARTBRIDGE_OTA_CLIENT_H
#define SMARTBRIDGE_OTA_CLIENT_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define FLASH_BANK1_START_ADDR      0x08000000  /* Active Application Bank */
#define FLASH_BANK2_START_ADDR      0x08040000  /* Update Application Bank */
#define FLASH_SECTOR_SIZE           0x00010000  /* 64 KB */
#define OTA_SHA256_LEN              32

typedef enum {
    OTA_STATE_IDLE,
    OTA_STATE_RECEIVING,
    OTA_STATE_VERIFYING,
    OTA_STATE_READY_TO_INSTALL,
    OTA_STATE_ERROR
} ota_state_t;

typedef struct {
    uint32_t total_size_bytes;
    uint32_t chunks_received;
    uint32_t expected_chunks;
    uint8_t  sha256_digest[OTA_SHA256_LEN];
    ota_state_t state;
} ota_context_t;

void ota_client_init(void);
bool ota_client_start(uint32_t total_size, uint32_t expected_chunks, const uint8_t *expected_sha256);
bool ota_client_write_chunk(uint32_t chunk_idx, const uint8_t *data, uint16_t length);
bool ota_client_verify_and_commit(void);
ota_state_t ota_client_get_state(void);

#ifdef __cplusplus
}
#endif

#endif /* SMARTBRIDGE_OTA_CLIENT_H */
