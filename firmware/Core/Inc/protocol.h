/**
 * @file protocol.h
 * @brief SmartBridge OS Custom Binary Communication Protocol Definition
 * @details Implements a packed, high-performance binary frame format for
 *          UART/SPI/CAN communications between STM32 nodes and Linux Gateway.
 */

#ifndef SMARTBRIDGE_PROTOCOL_H
#define SMARTBRIDGE_PROTOCOL_H

#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

#define PROTOCOL_PREAMBLE           0xAA55
#define PROTOCOL_VERSION            0x01
#define PROTOCOL_MAX_PAYLOAD_SIZE   256
#define PROTOCOL_HEADER_SIZE        8
#define PROTOCOL_FOOTER_SIZE        6   /* 4 bytes timestamp + 2 bytes CRC */

/**
 * @brief Command IDs for Binary Protocol
 */
typedef enum {
    CMD_PING                = 0x01,
    CMD_PONG                = 0x02,
    CMD_TELEMETRY_REPORT    = 0x03,
    CMD_SET_ACTUATOR        = 0x04,
    CMD_ACK                 = 0x05,
    CMD_NACK                = 0x06,
    CMD_DISCOVERY_REQ       = 0x07,
    CMD_DISCOVERY_RESP      = 0x08,
    CMD_OTA_INIT            = 0x10,
    CMD_OTA_DATA            = 0x11,
    CMD_OTA_VERIFY          = 0x12,
    CMD_OTA_STATUS          = 0x13,
    CMD_CONFIG_GET          = 0x20,
    CMD_CONFIG_SET          = 0x21
} protocol_cmd_t;

/**
 * @brief Error Codes returned in NACK or System Status
 */
typedef enum {
    ERR_NONE                = 0x00,
    ERR_BAD_CRC             = 0x01,
    ERR_INVALID_CMD         = 0x02,
    ERR_PAYLOAD_TOO_LARGE   = 0x03,
    ERR_TIMEOUT             = 0x04,
    ERR_FLASH_WRITE_FAIL    = 0x05,
    ERR_SIGNATURE_MISMATCH  = 0x06,
    ERR_UNAUTHORIZED        = 0x07
} protocol_err_t;

#pragma pack(push, 1)

/**
 * @brief Packed Protocol Frame Header (8 bytes)
 */
typedef struct {
    uint16_t preamble;      /**< Sync word: 0xAA55 */
    uint8_t  version;       /**< Protocol version: 0x01 */
    uint8_t  cmd;           /**< Command ID (protocol_cmd_t) */
    uint16_t sequence;      /**< Sequence number for packet tracking */
    uint16_t payload_len;   /**< Length of payload data */
} protocol_header_t;

/**
 * @brief Telemetry Payload Struct (Packed 20 bytes)
 */
typedef struct {
    uint32_t device_id;     /**< STM32 Unique Hardware Device ID */
    float    temperature;   /**< Sensor reading: Temperature (°C) */
    float    humidity;      /**< Sensor reading: Relative Humidity (%) */
    float    power_mw;      /**< Sensor reading: Active Power (mW) */
    uint8_t  relay_status;  /**< Actuator state bitfield */
    uint8_t  battery_pct;   /**< Battery percentage (0-100%) */
    uint16_t status_flags;  /**< System health flags */
} telemetry_payload_t;

/**
 * @brief OTA Data Chunk Payload (Packed)
 */
typedef struct {
    uint32_t chunk_index;   /**< Zero-based chunk index */
    uint32_t total_chunks;  /**< Total number of chunks in update */
    uint16_t chunk_size;    /**< Bytes in current chunk payload */
    uint8_t  data[PROTOCOL_MAX_PAYLOAD_SIZE - 10];
} ota_data_payload_t;

/**
 * @brief Complete Binary Protocol Frame Container
 */
typedef struct {
    protocol_header_t header;
    uint8_t           payload[PROTOCOL_MAX_PAYLOAD_SIZE];
    uint32_t          timestamp;    /**< Epoch timestamp (seconds) */
    uint16_t          crc16;        /**< CRC-16/CCITT-FALSE calculation */
} protocol_frame_t;

#pragma pack(pop)

/**
 * @brief Calculate CRC-16 CCITT-FALSE over a buffer
 */
uint16_t protocol_crc16(const uint8_t *buffer, uint32_t length);

/**
 * @brief Build a binary packet frame
 */
bool protocol_serialize(const protocol_frame_t *frame, uint8_t *out_buffer, uint32_t *out_length);

/**
 * @brief Parse a raw byte stream into a protocol frame struct
 */
bool protocol_deserialize(const uint8_t *in_buffer, uint32_t in_length, protocol_frame_t *out_frame);

#ifdef __cplusplus
}
#endif

#endif /* SMARTBRIDGE_PROTOCOL_H */
