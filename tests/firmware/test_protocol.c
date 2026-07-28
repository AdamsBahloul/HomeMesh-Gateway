/**
 * @file test_protocol.c
 * @brief Unit tests for C17 protocol serialization & CRC calculation
 */

#include "protocol.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>

void test_crc16_calculation(void) {
    uint8_t data[] = "123456789";
    uint16_t crc = protocol_crc16(data, 9);
    assert(crc == 0x29B1);
    printf("[PASS] CRC16 test passed.\n");
}

void test_frame_serialization(void) {
    protocol_frame_t tx_frame;
    memset(&tx_frame, 0, sizeof(tx_frame));
    tx_frame.header.preamble = PROTOCOL_PREAMBLE;
    tx_frame.header.version = PROTOCOL_VERSION;
    tx_frame.header.cmd = CMD_PING;
    tx_frame.header.sequence = 42;
    tx_frame.header.payload_len = 0;
    tx_frame.timestamp = 1753747200;

    uint8_t buffer[64];
    uint32_t len = 0;
    assert(protocol_serialize(&tx_frame, buffer, &len) == true);

    protocol_frame_t rx_frame;
    assert(protocol_deserialize(buffer, len, &rx_frame) == true);
    assert(rx_frame.header.sequence == 42);
    printf("[PASS] Serialization / Deserialization test passed.\n");
}

int main(void) {
    test_crc16_calculation();
    test_frame_serialization();
    printf("All firmware unit tests passed successfully!\n");
    return 0;
}
