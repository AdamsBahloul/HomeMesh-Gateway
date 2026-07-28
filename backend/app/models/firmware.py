from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.core.db import Base

class FirmwareRelease(Base):
    __tablename__ = "firmware_releases"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, unique=True, nullable=False)
    target_device_type = Column(String, nullable=False)
    file_name = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    sha256_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
