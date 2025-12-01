from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import jwt as pyjwt
from ..models import GoogleToken
from ..auth import verify_google_token, create_jwt
from ..crud import upsert_user, get_user_by_email
from ..config import ADMIN_EMAILS
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/google")
def auth_google(body: GoogleToken):
    try:
        idinfo = verify_google_token(body.id_token)
        if not idinfo:
            raise HTTPException(status_code=401, detail="Invalid Google token")

        email = idinfo.get("email")
        name = idinfo.get("name")

        user = get_user_by_email(email)

        if user:
            role = user.get("role", "student")
            user_id = user.get("User_id")
        else:
            role = "admin" if email.lower() in ADMIN_EMAILS else "student"
            new_user = upsert_user(email=email, display_name=name, role=role)
            user = new_user
            user_id = new_user.get("User_id")

        token = create_jwt({"user_id": user_id, "email": email, "role": role})

        return {"access_token": token, "user": user}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {e}")


class TokenBody(BaseModel):
    id_token: str


@router.post("/debug-decode")
def debug_decode(body: TokenBody):
    payload = pyjwt.decode(body.id_token, options={"verify_signature": False})
    return {"payload": payload}
