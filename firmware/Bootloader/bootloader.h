/**
 * @file bootloader.h
 * @brief SmartBridge OS Dual-Bank STM32 Bootloader Specification
 */

#ifndef SMARTBRIDGE_BOOTLOADER_H
#define SMARTBRIDGE_BOOTLOADER_H

#include <stdint.h>
#include <stdbool.h>

#define BOOTLOADER_MAGIC_KEY        0xDEADBEEFU
#define APPLICATION_BANK1_ADDR      0x08008000U /* Main Application Start */
#define APPLICATION_BANK2_ADDR      0x08040000U /* OTA Flash Storage Bank */

typedef struct {
    uint32_t magic;
    uint32_t fw_size;
    uint32_t crc32;
    uint8_t  sha256[32];
    uint8_t  version_major;
    uint8_t  version_minor;
    uint8_t  version_patch;
    uint8_t  reserved;
} boot_header_t;

void bootloader_run(void);
bool bootloader_verify_checksum(uint32_t address, uint32_t length, uint32_t expected_crc);
void bootloader_jump_to_app(uint32_t address);

#endif /* SMARTBRIDGE_BOOTLOADER_H */
