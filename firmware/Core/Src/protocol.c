/**
 * @file protocol.c
 * @brief Implementation of SmartBridge OS Custom Binary Protocol
 */

#include "protocol.h"
#include <string.h>

/**
 * @brief Calculate CRC-16/CCITT-FALSE (Polynomial 0x1021, Init 0xFFFF)
 */
uint16_t protocol_crc16(const uint8_t *buffer, uint32_t length) {
    uint16_t crc = 0xFFFF;
    for (uint32_t i = 0; i < length; i++) {
        crc ^= ((uint16_t)buffer[i]) << 8;
        for (uint8_t bit = 0; bit < 8; bit++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    return crc;
}

bool protocol_serialize(const protocol_frame_t *frame, uint8_t *out_buffer, uint32_t *out_length) {
    if (!frame || !out_buffer || !out_length) {
        return false;
    }

    if (frame->header.payload_len > PROTOCOL_MAX_PAYLOAD_SIZE) {
        return false;
    }

    uint32_t idx = 0;

    /* Pack Header */
    out_buffer[idx++] = (uint8_t)(PROTOCOL_PREAMBLE >> 8);
    out_buffer[idx++] = (uint8_t)(PROTOCOL_PREAMBLE & 0xFF);
    out_buffer[idx++] = frame->header.version;
    out_buffer[idx++] = frame->header.cmd;
    out_buffer[idx++] = (uint8_t)(frame->header.sequence >> 8);
    out_buffer[idx++] = (uint8_t)(frame->header.sequence & 0xFF);
    out_buffer[idx++] = (uint8_t)(frame->header.payload_len >> 8);
    out_buffer[idx++] = (uint8_t)(frame->header.payload_len & 0xFF);

    /* Pack Payload */
    if (frame->header.payload_len > 0) {
        memcpy(&out_buffer[idx], frame->payload, frame->header.payload_len);
        idx += frame->header.payload_len;
    }

    /* Pack Timestamp */
    out_buffer[idx++] = (uint8_t)(frame->timestamp >> 24);
    out_buffer[idx++] = (uint8_t)(frame->timestamp >> 16);
    out_buffer[idx++] = (uint8_t)(frame->timestamp >> 8);
    out_buffer[idx++] = (uint8_t)(frame->timestamp & 0xFF);

    /* Calculate and Pack CRC over (Header + Payload + Timestamp) */
    uint16_t calculated_crc = protocol_crc16(out_buffer, idx);
    out_buffer[idx++] = (uint8_t)(calculated_crc >> 8);
    out_buffer[idx++] = (uint8_t)(calculated_crc & 0xFF);

    *out_length = idx;
    return true;
}

bool protocol_deserialize(const uint8_t *in_buffer, uint32_t in_length, protocol_frame_t *out_frame) {
    if (!in_buffer || !out_frame || in_length < (PROTOCOL_HEADER_SIZE + PROTOCOL_FOOTER_SIZE)) {
        return false;
    }

    /* Verify Sync Marker */
    uint16_t preamble = ((uint16_t)in_buffer[0] << 8) | in_buffer[1];
    if (preamble != PROTOCOL_PREAMBLE) {
        return false;
    }

    out_frame->header.preamble = preamble;
    out_frame->header.version = in_buffer[2];
    out_frame->header.cmd = in_buffer[3];
    out_frame->header.sequence = ((uint16_t)in_buffer[4] << 8) | in_buffer[5];
    out_frame->header.payload_len = ((uint16_t)in_buffer[6] << 8) | in_buffer[7];

    if (out_frame->header.payload_len > PROTOCOL_MAX_PAYLOAD_SIZE) {
        return false;
    }

    uint32_t expected_total_len = PROTOCOL_HEADER_SIZE + out_frame->header.payload_len + PROTOCOL_FOOTER_SIZE;
    if (in_length < expected_total_len) {
        return false;
    }

    /* Extract Payload */
    if (out_frame->header.payload_len > 0) {
        memcpy(out_frame->payload, &in_buffer[PROTOCOL_HEADER_SIZE], out_frame->header.payload_len);
    }

    /* Extract Timestamp */
    uint32_t ts_idx = PROTOCOL_HEADER_SIZE + out_frame->header.payload_len;
    out_frame->timestamp = ((uint32_t)in_buffer[ts_idx] << 24) |
                           ((uint32_t)in_buffer[ts_idx + 1] << 16) |
                           ((uint32_t)in_buffer[ts_idx + 2] << 8) |
                           ((uint32_t)in_buffer[ts_idx + 3]);

    /* Extract and Validate CRC */
    uint32_t crc_idx = ts_idx + 4;
    uint16_t frame_crc = ((uint16_t)in_buffer[crc_idx] << 8) | in_buffer[crc_idx + 1];
    uint16_t calculated_crc = protocol_crc16(in_buffer, crc_idx);

    if (frame_crc != calculated_crc) {
        return false;
    }

    out_frame->crc16 = frame_crc;
    return true;
}
