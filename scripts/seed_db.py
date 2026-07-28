"""
SmartBridge OS Database Seeder Script
Populates default administrator user and initial STM32 node registry.
"""

import asyncio
from app.core.db import AsyncSessionLocal, engine, Base
from app.core.security import hash_password
from app.models.user import User
from app.models.device import Device

async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Seed Admin User
        admin = User(
            email="admin@smartbridge.io",
            hashed_password=hash_password("admin123"),
            full_name="Industrial System Administrator",
            role="ADMIN",
            is_active=True
        )
        session.add(admin)

        # Seed Node
        dev1 = Device(
            device_id="stm32-32f401a8",
            name="HVAC Temperature Sensor #1",
            device_type="TEMP_SENSOR",
            status="ONLINE",
            firmware_version="v1.2.4"
        )
        session.add(dev1)

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
