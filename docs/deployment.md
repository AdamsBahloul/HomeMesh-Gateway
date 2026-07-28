# SmartBridge OS Production Deployment Guide

## Raspberry Pi 5 Yocto / Raspberry Pi OS Setup

### 1. OS Preparation & Systemd Installation

```bash
# Clone Repository onto Gateway
git clone https://github.com/smartbridge-os/homemesh-gateway.git /opt/smartbridge

# Install Python System Dependencies
cd /opt/smartbridge/linux-gateway
pip3 install -r requirements.txt

# Enable systemd Service
sudo cp config/systemd/smartbridge-gateway.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now smartbridge-gateway
```

### 2. Docker Compose Infrastructure Deployment

```bash
cd /opt/smartbridge/docker
docker compose up -d
```
