# app/config.py
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")

JWT_SECRET = os.environ.get("JWT_SECRET", "secret")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_MINUTES = int(os.environ.get("JWT_EXPIRES_MINUTES", "43200"))

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET")

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:8000")
# By default allow common dev origins (Vite default 5173, CRA default 3000)
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Optional comma-separated list of admin emails that should be created as `admin` role on first sign-in
ADMIN_EMAILS = [e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "").split(",") if e.strip()]

# SMTP settings for sending emails (used by admin actions)
SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587")) if os.environ.get("SMTP_PORT") else None
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
SMTP_USE_TLS = os.environ.get("SMTP_USE_TLS", "true").lower() in ("1", "true", "yes")

# SendGrid API (preferred for production)
SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY")
# Optional 'from' address to use when sending via SendGrid. If not set, code will attempt to use SMTP_USER or admin email.
SENDGRID_FROM = os.environ.get("SENDGRID_FROM")
