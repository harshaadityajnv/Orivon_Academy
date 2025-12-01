# app/auth.py
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .config import GOOGLE_CLIENT_ID, JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRES_MINUTES
import jwt
import datetime
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .db import supabase_client
from .crud import get_user_by_email, _normalize_user_row

def verify_google_token(token: str):
    try:
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)
        # idinfo includes email, name, sub (google unique id), picture, ...
        return idinfo
    except Exception as e:
        print("Google verify failed:", e)
        return None

def create_jwt(payload: dict):
    now = datetime.datetime.utcnow()
    exp = now + datetime.timedelta(minutes=int(JWT_EXPIRES_MINUTES))
    body = payload.copy()
    body.update({"iat": now, "exp": exp})
    token = jwt.encode(body, JWT_SECRET, algorithm=JWT_ALGORITHM)
    if isinstance(token, bytes):
        token = token.decode()
    return token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = data.get("user_id")
    email = data.get("email")
    if not user_id and not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Try multiple table and column name variants to locate the user row.
    table_names = ("User", "users", "users_table")
    id_columns = ("User_id", "user_id", "id", "UserId")
    # If we have a user_id, try to find by id across tables/columns
    if user_id:
        for table in table_names:
            for col in id_columns:
                try:
                    res = supabase_client.table(table).select("*").eq(col, user_id).execute()
                except Exception:
                    res = None
                if res and getattr(res, 'data', None):
                    return _normalize_user_row(res.data[0])

    # Fallback: try by email using existing helper which itself checks multiple tables
    if email:
        try:
            user = get_user_by_email(email)
            if user:
                return user
        except Exception:
            # If lookup failed due to Supabase, surface as 503
            raise HTTPException(status_code=503, detail="User service unavailable")

    # Not found
    raise HTTPException(status_code=401, detail="User not found")

def require_admin(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return user
