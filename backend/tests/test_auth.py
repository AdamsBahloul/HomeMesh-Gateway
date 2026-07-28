import unittest
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent.parent))

class TestAuth(unittest.TestCase):
    def test_password_hashing(self):
        try:
            from app.core.security import hash_password, verify_password
            pw = "secret_password"
            hashed = hash_password(pw)
            self.assertTrue(verify_password(pw, hashed))
            self.assertFalse(verify_password("wrong_pw", hashed))
        except ModuleNotFoundError as e:
            self.skipTest(f"Skipping test due to missing dependency: {e}")

    def test_jwt_token_flow(self):
        try:
            from app.core.security import create_access_token, decode_access_token
            token = create_access_token("user@example.com", role="ADMIN")
            decoded = decode_access_token(token)
            self.assertEqual(decoded["sub"], "user@example.com")
            self.assertEqual(decoded["role"], "ADMIN")
        except ModuleNotFoundError as e:
            self.skipTest(f"Skipping test due to missing dependency: {e}")

if __name__ == "__main__":
    unittest.main()
