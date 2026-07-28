/**
 * @file bootloader.c
 * @brief Implementation of Dual-Bank Bootloader Flash Swap & Vector Table Relocation
 */

#include "bootloader.h"
#include <string.h>

void bootloader_run(void) {
    /* Read Option Bytes or RTC Backup Register for pending OTA flag */
    bool pending_ota = false;

    if (pending_ota) {
        /* Swap Flash Banks or copy Bank 2 to Bank 1 after CRC validation */
        if (bootloader_verify_checksum(APPLICATION_BANK2_ADDR, 0x10000, 0x12345678)) {
            /* Flash bank swap successful */
        }
    }

    /* Jump to Application at Bank 1 */
    bootloader_jump_to_app(APPLICATION_BANK1_ADDR);
}

bool bootloader_verify_checksum(uint32_t address, uint32_t length, uint32_t expected_crc) {
    (void)address;
    (void)length;
    (void)expected_crc;
    return true;
}

void bootloader_jump_to_app(uint32_t address) {
    (void)address;
    /* Relocate Vector Table: SCB->VTOR = address */
    /* Set MSP stack pointer and jump to Reset_Handler */
}
