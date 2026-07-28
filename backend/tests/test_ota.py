import unittest
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))
from app.services.ota_service import OTAService

class TestOTA(unittest.TestCase):
    def test_ota_sha256_verification(self):
        sample_fw = b"\xAA\x55\x01\x02SampleBinaryFirmwareContent"
        res = OTAService.process_firmware_upload(sample_fw, "fw.bin")
        self.assertEqual(res["size_bytes"], len(sample_fw))
        self.assertEqual(len(res["sha256_hash"]), 64)

if __name__ == "__main__":
    unittest.main()
