#!/usr/bin/env bash
set -e

echo "Generating TLS Certificates for Mosquitto & OTA Signing Keys..."
KEY_DIR="$(dirname "$0")/../certs"
mkdir -p "$KEY_DIR"

# Generate self-signed CA key and cert
openssl req -new -x509 -days 3650 -nodes -out "$KEY_DIR/ca.crt" -keyout "$KEY_DIR/ca.key" \
  -subj "/C=US/ST=Tech/L=Gateway/O=SmartBridgeOS/CN=SmartBridgeCA"

echo "Certificates generated in $KEY_DIR"
