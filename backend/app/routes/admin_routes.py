# app/routes/admin_routes.py
from fastapi import APIRouter, Depends, HTTPException
from ..auth import require_admin
from ..crud import list_attempts, get_proctor_events_for_attempt, update_attempt, get_purchase
from ..db import supabase_client
from ..config import SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_USE_TLS, SENDGRID_API_KEY, SENDGRID_FROM
import os
import io
from fastapi import Depends
from email.message import EmailMessage
import smtplib
import base64
try:
    from PIL import Image, ImageDraw, ImageFont
except Exception:
    Image = None

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/analytics", dependencies=[Depends(require_admin)])
def analytics():
    # Simple analytics aggregations; can be expanded
    try:
        users_count = supabase_client.table("User").select("User_id", count="exact").execute().count
    except Exception:
        users_count = 0
    try:
        certs = supabase_client.table("certifications").select("*").execute().data
        active_cert_count = len(certs)
    except Exception:
        # table might not exist in some environments
        active_cert_count = 0
    try:
        # Prefer transactions table (price column) for revenue, fall back to purchases.amount
        txs = supabase_client.table("transactions").select("price").execute().data
        if txs:
            revenue = sum([float(t.get("price", 0) or 0) for t in txs])
        else:
            purchases = supabase_client.table("purchases").select("*").eq("status","paid").execute().data
            revenue = sum([float(p.get("amount",0) or 0) for p in purchases])
    except Exception:
        revenue = 0
    try:
        attempts_under_review = supabase_client.table("attempts").select("*").eq("status","under_review").execute().data
        attempts_count = len(attempts_under_review)
    except Exception:
        attempts_count = 0
    return {
        "users_count": users_count,
        "active_certifications_count": active_cert_count,
        "attempts_under_review": attempts_count,
        "revenue": revenue
    }

# New endpoint: List all users with name and email
@router.get("/users", dependencies=[Depends(require_admin)])
def list_all_users():
    users = supabase_client.table("User").select("User_id,displayName,email").execute().data
    user_list = []
    for u in users:
        user_list.append({
            "id": u.get("User_id"),
            "name": u.get("displayName", ""),
            "email": u.get("email", "")
        })
    return user_list

@router.get("/attempts", dependencies=[Depends(require_admin)])
def list_all_attempts():
    return supabase_client.table("attempts").select("*").execute().data

@router.get("/attempts/{attempt_id}", dependencies=[Depends(require_admin)])
def attempt_details(attempt_id: str):
    att = supabase_client.table("attempts").select("*").eq("id", attempt_id).execute().data
    if not att:
        raise HTTPException(status_code=404, detail="Attempt not found")
    events = supabase_client.table("proctor_events").select("*").eq("attempt_id", attempt_id).execute().data
    return {"attempt": att[0], "events": events}


@router.get("/transactions", dependencies=[Depends(require_admin)])
def list_transactions():
    # Return recent transactions from the transactions table
    txs = supabase_client.table("transactions").select("*").order("id", desc=True).execute().data
    # Normalize fields for frontend
    out = []
    for t in txs:
        out.append({
            "id": t.get("id") or t.get("transaction_id") or str(t.get("id")),
            "mailid": t.get("mailid") or t.get("email") or "",
            "price": t.get("price") or t.get("amount") or 0,
            "course_title": t.get("course_title") or t.get("course") or t.get("certification") or None,
            "created_at": t.get("created_at") or t.get("inserted_at") or None,
        })
    return out

@router.put("/attempts/{attempt_id}/review", dependencies=[Depends(require_admin)])
def review_attempt(attempt_id: str, payload: dict):
    # payload should include status ('approved' or 'rejected'), score, review_notes
    updates = {}
    if "status" in payload:
        updates["status"] = payload["status"]
    if "score" in payload:
        updates["score"] = payload["score"]
    if "review_notes" in payload:
        updates["review_notes"] = payload["review_notes"]
    supabase_client.table("attempts").update(updates).eq("id", attempt_id).execute()
    return {"ok": True}


# Admin: generate certificate and email to user
@router.post("/grant_certificate")
def grant_certificate(payload: dict, user=Depends(require_admin)):
    """Generate a certificate image (server-side) and email it to the provided user email.

    Expected payload: { user_email: str, user_name: str, cert_name: str }
    Email will be sent From the admin's email (the logged-in user).
    """
    if Image is None:
        raise HTTPException(status_code=500, detail="Pillow is not installed on the server")

    user_email = payload.get("user_email")
    user_name = payload.get("user_name")
    cert_name = payload.get("cert_name")
    if not user_email or not user_name or not cert_name:
        raise HTTPException(status_code=400, detail="Missing user_email, user_name, or cert_name")

    # locate template
    base = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    template_path = os.path.join(base, 'certificate.png')
    if not os.path.exists(template_path):
        raise HTTPException(status_code=404, detail='Certificate template not found on server')

    print(f"[grant_certificate] Rendering certificate for '{user_name}' / cert '{cert_name}'")
    try:
        img = Image.open(template_path).convert('RGBA')
        draw = ImageDraw.Draw(img)
        width, height = img.size

        # Helper to pick a truetype font or fallback
        def load_font(preferred_size: int):
            candidates = [
                '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
                '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
                'arial.ttf'
            ]
            for c in candidates:
                try:
                    return ImageFont.truetype(c, preferred_size)
                except Exception:
                    continue
            return ImageFont.load_default()

        # Draw cert title (centered) similar to frontend positions
        max_width = width - 300
        title_size = 56
        title_font = None
        while title_size > 18:
            try:
                title_font = load_font(title_size)
                tw, th = draw.textsize(cert_name, font=title_font)
            except Exception:
                tw = th = 0
            if tw <= max_width:
                break
            title_size -= 2

        title_x = (width - tw) / 2
        title_y = 460 - (th / 2)
        # outline by drawing multiple slightly offset white strokes
        outline_color = (255, 255, 255, 230)
        text_color = (15, 23, 42, 255)
        for ox, oy in [(-2, -2), (-2, 2), (2, -2), (2, 2)]:
            draw.text((title_x + ox, title_y + oy), cert_name, font=title_font, fill=outline_color)
        draw.text((title_x, title_y), cert_name, font=title_font, fill=text_color)

        # Draw recipient name lower on the cert
        name_size = 40
        name_font = None
        while name_size > 12:
            try:
                name_font = load_font(name_size)
                nw, nh = draw.textsize(user_name, font=name_font)
            except Exception:
                nw = nh = 0
            if nw <= (width - 320):
                break
            name_size -= 1

        name_x = (width - nw) / 2
        name_y = 670 - (nh / 2)
        for ox, oy in [(-1, -1), (-1, 1), (1, -1), (1, 1)]:
            draw.text((name_x + ox, name_y + oy), user_name, font=name_font, fill=outline_color)
        draw.text((name_x, name_y), user_name, font=name_font, fill=text_color)

        # Export PNG bytes
        bio = io.BytesIO()
        img.convert('RGB').save(bio, format='PNG')
        bio.seek(0)
        img_bytes = bio.read()
    except Exception as e:
        print('Failed to render certificate:', e)
        raise HTTPException(status_code=500, detail='Failed to render certificate')

    # If caller asked for a preview, return the PNG as base64 in JSON (admin-only)
    if payload.get('preview'):
        try:
            b64 = base64.b64encode(img_bytes).decode()
            return {"ok": True, "preview_base64": b64}
        except Exception as e:
            print('Failed to prepare preview:', e)
            raise HTTPException(status_code=500, detail='Failed to prepare preview')

    # Email sending paths have been disabled to prevent automated emailing from this endpoint.
    # The endpoint still supports preview mode (above). If non-preview calls are made,
    # we intentionally do not send email and return a neutral response indicating the
    # action is disabled.
    return {"ok": True, "emailed_to": None, "sent_via": "disabled"}
