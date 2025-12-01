# Orivon Academy - Backend (FASTAPI + Supabase + Razorpay)

## What this project contains
- FASTAPI backend implementing:
  - Google ID token verification (`/auth/google`)
  - JWT issuance
  - Certifications CRUD (admin)
  - Purchase flow with Razorpay order creation & verification
  - Attempts & proctoring event logging
  - Admin endpoints for analytics/review

## Setup
1. Copy `.env.example` → `.env` and fill values (Supabase project URL + key, Google client id, Razorpay keys, JWT secret).
2. Run Supabase SQL (see `sql/supabase_schema.sql`) in your Supabase project's SQL editor.
3. Install Python deps:
   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
