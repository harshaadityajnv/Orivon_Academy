# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import ALLOWED_ORIGINS
from .routes import auth_routes, cert_routes, payment_routes, attempt_routes, admin_routes, exam_routes, course_routes
from .routes import health_routes
from .config import SUPABASE_URL, SUPABASE_KEY
from .db import supabase_client
import logging

logger = logging.getLogger(__name__)
app = FastAPI(title="Orivon Academy - Backend (FASTAPI + Supabase)")


@app.on_event("startup")
def startup_check():
    # Quick check that the Supabase client can connect using provided env vars
    try:
        if not SUPABASE_URL or not SUPABASE_KEY:
            logger.warning('SUPABASE_URL or SUPABASE_KEY not set; DB checks will fail')
            return
        # Attempt a lightweight call to the REST endpoint (use actual PK column name)
        res = supabase_client.table('User').select('User_id').limit(1).execute()
        logger.info('Supabase connectivity check OK; rows=%s', len(res.data or []))
    except Exception as e:
        logger.exception('Supabase connectivity check failed: %s', e)
    
app.add_middleware(
    CORSMiddleware,
    # For local development, allow all origins to avoid CORS issues while debugging.
    # IMPORTANT: revert to a restrictive list (ALLOWED_ORIGINS) before deploying to production.
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(cert_routes.router)
app.include_router(payment_routes.router)
app.include_router(attempt_routes.router)
app.include_router(admin_routes.router)
app.include_router(exam_routes.router)
app.include_router(course_routes.router)
app.include_router(health_routes.router)

@app.get("/")
def root():
    return {"ok": True, "message": "Orivon Backend Running"}
