# app/db.py
from supabase import create_client
from .config import SUPABASE_URL, SUPABASE_KEY

if not SUPABASE_URL or not SUPABASE_KEY:
    raise EnvironmentError("SUPABASE_URL and SUPABASE_KEY must be set in environment")

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
