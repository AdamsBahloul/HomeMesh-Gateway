from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.db import Base

class TelemetryData(Base):
    __tablename__ = "telemetry_data"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True, nullable=False)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    power_mw = Column(Float, nullable=True)
    relay_status = Column(Integer, nullable=True)
    battery_pct = Column(Integer, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
