from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class RuleSchema(BaseModel):
    id: int
    name: str
    trigger_device_id: str
    trigger_sensor: str
    operator: str
    threshold_value: float
    target_device_id: str
    actuator_command: str
    enabled: bool

MOCK_RULES = [
    {
        "id": 1,
        "name": "High Temperature Protection",
        "trigger_device_id": "stm32-32f401a8",
        "trigger_sensor": "temperature",
        "operator": ">",
        "threshold_value": 30.0,
        "target_device_id": "stm32-32f403c0",
        "actuator_command": "RELAY1_ON",
        "enabled": True
    }
]

@router.get("/rules", response_model=List[RuleSchema])
async def get_rules():
    return MOCK_RULES

@router.post("/rules", response_model=RuleSchema)
async def create_rule(rule: RuleSchema):
    rule.id = len(MOCK_RULES) + 1
    MOCK_RULES.append(rule.dict())
    return rule
