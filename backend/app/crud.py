# app/crud.py
from .db import supabase_client
import uuid
from typing import List

def upsert_user(email: str, display_name: str = None, role: str = "student"):
    # Align with DB schema variations: try 'User' then 'users'. Normalize returned row.
    payload = {"email": email, "displayName": display_name or email.split('@')[0], "role": role}

    # try preferred table names in order
    for table_name in ("User", "users", "users_table"):
        try:
            res = supabase_client.table(table_name).upsert(payload, on_conflict="email").execute()
        except Exception:
            res = None
        if res and getattr(res, 'data', None):
            row = res.data[0]
            return _normalize_user_row(row)

    return None

def get_user_by_email(email: str):
    # Try multiple table names and normalize the result
    for table_name in ("User", "users", "users_table"):
        try:
            res = supabase_client.table(table_name).select("*").eq("email", email).execute()
        except Exception:
            res = None
        if res and getattr(res, 'data', None):
            return _normalize_user_row(res.data[0])
    return None

def list_certifications(active_only=True):
    q = supabase_client.table("certifications").select("*")
    if active_only:
        q = q.eq("active", True)
    return q.execute().data

def get_cert(cert_id: str):
    return supabase_client.table("certifications").select("*").eq("id", cert_id).execute().data

def create_cert(data: dict):
    return supabase_client.table("certifications").insert([data]).execute().data

def update_cert(cert_id: str, updates: dict):
    return supabase_client.table("certifications").update(updates).eq("id", cert_id).execute().data

def delete_cert(cert_id: str):
    return supabase_client.table("certifications").delete().eq("id", cert_id).execute().data

def create_purchase_row(user_id: str, cert_id: str, amount: float, currency: str, razorpay_order_id: str, purchase_id: str):
    payload = {
        "id": purchase_id,
        "user_id": user_id,
        "certification_id": cert_id,
        "amount": amount,
        "currency": currency,
        "razorpay_order_id": razorpay_order_id,
        "status": "created"
    }
    return supabase_client.table("purchases").insert([payload]).execute().data

def get_purchase(purchase_id: str):
    return supabase_client.table("purchases").select("*").eq("id", purchase_id).execute().data

def update_purchase(purchase_id: str, updates: dict):
    return supabase_client.table("purchases").update(updates).eq("id", purchase_id).execute().data

def create_attempt(user_id: str, cert_id: str, metadata: dict = None):
    attempt_id = str(uuid.uuid4())
    payload = {
        "id": attempt_id,
        "user_id": user_id,
        "certification_id": cert_id,
        "started_at": "now()",
        "status": "started",
        "metadata": metadata or {}
    }
    try:
        supabase_client.table("attempts").insert([payload]).execute()
    except Exception as e:
        # tolerate schemas that don't include `certification_id` by retrying without it
        try:
            msg = str(e)
            if "certification_id" in msg:
                payload_copy = dict(payload)
                payload_copy.pop("certification_id", None)
                supabase_client.table("attempts").insert([payload_copy]).execute()
            else:
                # Log and continue; return attempt_id even if DB insert fails so caller can proceed
                print(f"create_attempt: non-fatal DB insert failure: {e}")
        except Exception as inner:
            print(f"create_attempt: retry insert failed: {inner}")
    # Return the generated attempt id even if DB insert failed, to allow flow to continue
    return attempt_id

def get_attempt(attempt_id: str):
    return supabase_client.table("attempts").select("*").eq("id", attempt_id).execute().data

def update_attempt(attempt_id: str, updates: dict):
    try:
        return supabase_client.table("attempts").update(updates).eq("id", attempt_id).execute().data
    except Exception as e:
        # Non-fatal in contexts where attempts table may differ; log and return None
        print(f"update_attempt: DB update failed (non-fatal): {e}")
        return None


def _normalize_user_row(row: dict):
    """Normalize various user row shapes from different DB schemas into a consistent dict.
    Ensures keys: id (uuid or User_id), email, displayName, role, name
    """
    if not row or not isinstance(row, dict):
        return row
    out = dict(row)
    # normalize id/User_id/id
    if 'User_id' in out and not out.get('id'):
        out['id'] = out.get('User_id')
    if 'user_id' in out and not out.get('id'):
        out['id'] = out.get('user_id')
    if 'id' in out and not out.get('User_id'):
        out['User_id'] = out.get('id')
    # normalize display name / name
    if 'displayName' not in out and 'name' in out:
        out['displayName'] = out.get('name')
    if 'name' not in out and 'displayName' in out:
        out['name'] = out.get('displayName')
    # normalize role values: some schemas use 'user' instead of 'student'
    role = out.get('role')
    if role in ('user', None):
        out['role'] = 'student'
    return out

def add_proctor_event(attempt_id: str, event_type: str, metadata: dict = None):
    payload = {"attempt_id": attempt_id, "event_type": event_type, "metadata": metadata or {}}
    return supabase_client.table("proctor_events").insert([payload]).execute().data

def get_proctor_events_for_attempt(attempt_id: str):
    return supabase_client.table("proctor_events").select("*").eq("attempt_id", attempt_id).execute().data

def list_attempts(filters: dict = None):
    q = supabase_client.table("attempts").select("*")
    if filters:
        for k,v in filters.items():
            q = q.eq(k, v)
    return q.execute().data

def create_transaction(mailid: str, price: int = 1, course_title: str = None):
    """Insert a transaction row into the `transactions` table.
    The DB schema expected: columns `mailid` (text), `price` (int), and optionally `course_title` (text).
    """
    payload = {
        "mailid": mailid,
        "price": int(price)
    }
    if course_title:
        payload["course_title"] = course_title
    return supabase_client.table("transactions").insert([payload]).execute().data


def create_exam_record(title: str, nameofuser: str, passing_score: int = 0, pass_status: bool = False):
    """Insert a row into `exams` table. Returns inserted row data.

    This will tolerate older DB schemas that do not include the `pass_status` column
    by retrying the insert without that key if the initial insert fails.
    """
    payload = {
        "title": title,
        "passing_score": int(passing_score),
        "nameofuser": nameofuser,
        "pass_status": bool(pass_status)
    }
    try:
        res = supabase_client.table("exams").insert([payload]).execute().data
        return res
    except Exception as e:
        # If schema doesn't have pass_status, retry without it
        msg = str(e)
        if "pass_status" in msg:
            try:
                payload.pop("pass_status", None)
                res = supabase_client.table("exams").insert([payload]).execute().data
                return res
            except Exception:
                raise
        raise


def update_exam_record(exma_id: int, updates: dict):
    """Update exam record; tolerate missing columns by retrying without them if necessary."""
    try:
        return supabase_client.table("exams").update(updates).eq("exma_id", exma_id).execute().data
    except Exception as e:
        msg = str(e)
        # If pass_status missing, remove and retry
        if "pass_status" in msg and isinstance(updates, dict) and "pass_status" in updates:
            updates_copy = dict(updates)
            updates_copy.pop("pass_status", None)
            return supabase_client.table("exams").update(updates_copy).eq("exma_id", exma_id).execute().data
        raise
