from sqlalchemy import Column, Integer, String, Float, Boolean
from app.core.db import Base

class AutomationRule(Base):
    __tablename__ = "automation_rules"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    trigger_device_id = Column(String, nullable=False)
    trigger_sensor = Column(String, nullable=False) # temperature, humidity, power_mw
    operator = Column(String, nullable=False) # GT (>), LT (<), EQ (==)
    threshold_value = Column(Float, nullable=False)
    target_device_id = Column(String, nullable=False)
    actuator_command = Column(String, nullable=False) # RELAY1_ON, RELAY1_OFF
    enabled = Column(Boolean, default=True)
