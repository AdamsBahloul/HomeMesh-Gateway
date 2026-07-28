"""
SmartBridge OS - Automation Rule Evaluator Engine
Evaluates real-time sensor streams against active IF-THEN conditions.
"""

import logging
from typing import Dict, Any, List

logger = logging.getLogger("SmartBridge.RuleEngine")

class RuleEngine:
    def __init__(self):
        self.rules = []

    def load_rules(self, rules: List[Dict[str, Any]]):
        self.rules = rules

    def evaluate_telemetry(self, device_id: str, telemetry: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluate incoming telemetry against active rules and return triggered actions."""
        actions_triggered = []

        for rule in self.rules:
            if not rule.get("enabled", True):
                continue

            if rule.get("trigger_device_id") != device_id:
                continue

            sensor_key = rule.get("trigger_sensor")
            if sensor_key not in telemetry:
                continue

            value = telemetry[sensor_key]
            op = rule.get("operator")
            threshold = rule.get("threshold_value")

            triggered = False
            if op == ">" and value > threshold:
                triggered = True
            elif op == "<" and value < threshold:
                triggered = True
            elif op == "==" and value == threshold:
                triggered = True

            if triggered:
                action = {
                    "rule_id": rule.get("id"),
                    "rule_name": rule.get("name"),
                    "target_device_id": rule.get("target_device_id"),
                    "actuator_command": rule.get("actuator_command"),
                    "reason": f"{sensor_key} ({value}) {op} {threshold}"
                }
                logger.info(f"Rule Triggered! [{rule.get('name')}]: {action['reason']}")
                actions_triggered.append(action)

        return actions_triggered
