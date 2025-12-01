from fastapi import APIRouter, HTTPException
from ..db import supabase_client

router = APIRouter(prefix="/health", tags=["health"]) 


@router.get("/db")
def db_health():
    """Lightweight DB connectivity check: attempt to read 1 row from pg_catalog or a small table."""
    try:
        # Use a simple RPC via PostgREST to check schema; select from pg_catalog is restricted, so try a small existing table
        res = supabase_client.table("User").select("User_id").limit(1).execute()
        # If table doesn't exist, PostgREST will return an error
        if hasattr(res, 'status_code') and res.status_code >= 400:
            raise Exception(getattr(res, 'error', res))
        return {"ok": True, "rows": len(res.data or [])}
    except Exception as e:
        raise HTTPException(status_code=500, detail={"ok": False, "error": str(e)})
