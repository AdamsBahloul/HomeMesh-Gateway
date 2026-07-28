import unittest
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from app.services.rule_engine import RuleEngine

class TestDevices(unittest.TestCase):
    def test_rule_engine_evaluation(self):
        engine = RuleEngine()
        engine.load_rules([
            {
                "id": 1,
                "name": "High Temp Fan",
                "trigger_device_id": "node-01",
                "trigger_sensor": "temperature",
                "operator": ">",
                "threshold_value": 30.0,
                "target_device_id": "fan-01",
                "actuator_command": "FAN_ON",
                "enabled": True
            }
        ])

        triggered = engine.evaluate_telemetry("node-01", {"temperature": 34.5})
        self.assertEqual(len(triggered), 1)
        self.assertEqual(triggered[0]["actuator_command"], "FAN_ON")

if __name__ == "__main__":
    unittest.main()
