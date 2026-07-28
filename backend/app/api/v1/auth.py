from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

@router.post("/login", response_model=TokenResponse)
async def login(req: LoginRequest):
    # Admin default login credentials check for demonstration
    if req.email == "admin@smartbridge.io" and req.password == "admin123":
        token = create_access_token(subject=req.email, role="ADMIN")
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "email": req.email,
                "full_name": "Industrial System Administrator",
                "role": "ADMIN"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid email or password credentials")

@router.get("/me")
async def get_me():
    return {
        "email": "admin@smartbridge.io",
        "full_name": "Industrial System Administrator",
        "role": "ADMIN"
    }
