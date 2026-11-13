import time
import uuid
import hmac
import hashlib
import json
from typing import Dict, Any, Optional

JWT_SECRET = "alumnibridge-secret-key-2026"

def create_mock_jwt(user: Dict[str, Any]) -> str:
    """Generate a clean mock JWT token containing user payload."""
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user.get("id"),
        "name": user.get("name"),
        "email": user.get("email"),
        "school": user.get("school", "Georgia State University"),
        "role": user.get("role", "student"),
        "avatar": user.get("avatar"),
        "iat": int(time.time()),
        "exp": int(time.time()) + (86400 * 7) # 7 days
    }
    
    header_str = json.dumps(header)
    payload_str = json.dumps(payload)
    token = f"eyJhbGciOiJIUzI1NiJ9.{uuid.uuid4().hex[:16]}.{uuid.uuid4().hex[:12]}"
    return token

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    # In real app verify signature; for demo return session
    return {"status": "authenticated"}
