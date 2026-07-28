from sqlalchemy import Column, Integer, String, Boolean, DateTime
from datetime import datetime
from app.core.db import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, unique=True, index=True, nullable=False) # e.g. stm32-32f401a8
    name = Column(String, nullable=False)
    device_type = Column(String, nullable=False) # TEMP_SENSOR, POWER_METER, RELAY_CTRL
    status = Column(String, default="ONLINE") # ONLINE, OFFLINE, OTA_UPDATING
    firmware_version = Column(String, default="v1.0.0")
    ip_address = Column(String, nullable=True)
    last_seen = Column(DateTime, default=datetime.utcnow)
