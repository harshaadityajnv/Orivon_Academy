from fastapi import APIRouter, Depends, HTTPException
import logging
from ..auth import get_current_user, require_admin
from ..crud import create_attempt, update_attempt
from ..db import supabase_client
from fastapi import Depends
from ..models import ExamCreateSchema, ExamCompleteSchema

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/exams", tags=["exams"])


@router.get("/ping")
def ping():
    return {"ok": True, "message": "exams router alive"}


@router.post("", status_code=201)
def create_exam(payload: ExamCreateSchema, user=Depends(get_current_user)):
    try:
        name = user.get('name') or user.get('displayName') or user.get('email')
        logger.info('create_exam called for user=%s title=%s', name, payload.title)
        # Create an attempt row (attempts table exists in schema). If frontend provided
        # a certification_id we store it on the attempt so we can link the pass to a purchase.
        cert_id = getattr(payload, 'certification_id', None) or payload.title
        # create_attempt expects user_id and cert_id
        attempt_id = create_attempt(user_id=user.get('User_id') or user.get('id') or user.get('UserId'), cert_id=cert_id)
        return {"ok": True, "exma_id": attempt_id}
    except Exception as e:
        logger.exception('create_exam failed: %s', e)
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/{exma_id}")
def complete_exam(exma_id: str, payload: dict, user=Depends(get_current_user)):
    try:
        logger.info('complete_exam called exma_id=%s user=%s payload=%s', exma_id, getattr(user, 'get', lambda k: None)('email'), payload)
        # Update the attempt record with score and mark completed
        passing_score = int(payload.get('passing_score', 0))
        updates = {"score": passing_score, "status": 'completed'}
        res = update_attempt(exma_id, updates)

        # Insert a minimal row into `exams` table using the fields requested by the client.
        # The `exams` table in your DB expects: exma_id, title, passing_score, questions, nameofuser
        try:
            exam_row = {}
            # include exma_id only if it's an integer (DB exma_id is int8)
            try:
                exma_id_int = int(exma_id) if exma_id is not None else None
            except Exception:
                exma_id_int = None
            if exma_id_int is not None:
                exam_row['exma_id'] = exma_id_int

            exam_row['title'] = payload.get('title')
            # passing_score should be a small int
            exam_row['passing_score'] = passing_score
            # questions column is json in your schema; store the provided questions payload (number or structure)
            exam_row['questions'] = payload.get('questions') if payload.get('questions') is not None else None
            exam_row['nameofuser'] = payload.get('nameofuser')

            # attempt to insert; if table doesn't exist or insert fails, log and continue
            try:
                supabase_client.table('exams').insert([exam_row]).execute()
            except Exception as e:
                logger.warning('Failed to insert into exams table (non-fatal): %s', e)
        except Exception as e:
            logger.warning('Failed to prepare exams row: %s', e)

        # If passed, attempt to mark purchase as 'issued' so certificate availability is tracked in DB
        passed = bool(payload.get('pass_status'))
        if passed:
            try:
                # attempt record contains certification_id; fetch it
                attempt_row = supabase_client.table('attempts').select('*').eq('id', exma_id).execute().data
                cert_id = None
                if attempt_row and len(attempt_row) > 0:
                    cert_id = attempt_row[0].get('certification_id')
                user_id = user.get('User_id') or user.get('id') or user.get('UserId')
                if cert_id and user_id:
                    # mark any paid purchase for this user+cert as 'issued'
                    supabase_client.table('purchases').update({'status': 'issued'}).eq('user_id', user_id).eq('certification_id', cert_id).execute()
            except Exception as e:
                logger.warning('Failed to mark purchase issued: %s', e)

        return {"ok": True, "updated": res}
    except Exception as e:
        logger.exception('complete_exam failed: %s', e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/certification/{cert_id}/availability', dependencies=[Depends(get_current_user)])
def certificate_availability(cert_id: str, user=Depends(get_current_user)):
    """Return whether a certificate is available for the current user for the given certification.

    Availability rule: the attempts table must contain a completed attempt for this user and
    certification where the recorded score equals 75 (as requested).
    """
    try:
        user_id = user.get('User_id') or user.get('id') or user.get('UserId')
        if not user_id:
            raise HTTPException(status_code=401, detail='User id not found')
        # First, check the persistent `exams` table for a recorded passing exam for this user.
        try:
            # prefer display name or email as nameofuser column
            name_candidates = [user.get('display_name') or user.get('displayName'), user.get('name'), user.get('email')]
            name_candidates = [str(n) for n in name_candidates if n]
            if name_candidates:
                # Try a direct query using the first candidate
                try:
                    rows_ex = supabase_client.table('exams').select('*').eq('nameofuser', name_candidates[0]).execute().data
                except Exception:
                    # fallback to retrieving all exams and filter locally
                    rows_all = supabase_client.table('exams').select('*').execute().data or []
                    rows_ex = [r for r in rows_all if (r.get('nameofuser') or r.get('name') or r.get('Name')) in name_candidates]
            else:
                rows_ex = []
        except Exception:
            rows_ex = []

        if rows_ex:
            for r in rows_ex:
                try:
                    sc = None
                    if r.get('passing_score') is not None:
                        sc = int(float(r.get('passing_score')))
                    elif r.get('score') is not None:
                        sc = int(float(r.get('score')))
                    if sc is not None and sc >= 75:
                        return {"available": True}
                except Exception:
                    continue

        # Query attempts for this user+certification. Be tolerant to schema differences
        try:
            # Preferred, efficient query (may fail if column names differ)
            rows = supabase_client.table('attempts').select('*').eq('user_id', user_id).eq('certification_id', cert_id).eq('status', 'completed').execute().data
        except Exception:
            # Fallback: fetch attempts and filter in Python to handle column name variations
            try:
                all_rows = supabase_client.table('attempts').select('*').execute().data or []
            except Exception as e:
                logger.warning('Failed to query attempts table for availability fallback: %s', e)
                raise
            rows = []
            for r in all_rows:
                # match user id using possible column names
                row_user = r.get('user_id') or r.get('User_id') or r.get('UserId')
                if not row_user or str(row_user) != str(user_id):
                    continue
                # match certification id with possible column names
                row_cert = r.get('certification_id') or r.get('certificationId') or r.get('certification') or r.get('cert_id') or r.get('title')
                if not row_cert or str(row_cert) != str(cert_id):
                    continue
                # match status
                status = (r.get('status') or r.get('state') or '').lower()
                if status != 'completed':
                    continue
                rows.append(r)

        if not rows:
            return {"available": False}
        for r in rows:
            try:
                score = r.get('score') or r.get('passing_score') or r.get('points')
                # score may be numeric or string; coerce to int when possible
                if score is None:
                    continue
                try:
                    sc = int(float(score))
                except Exception:
                    continue
                if sc >= 75:
                    return {"available": True}
            except Exception:
                continue
        return {"available": False}
    except HTTPException:
        raise
    except Exception as e:
        logger.exception('certificate_availability failed: %s', e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get('/admin/list', dependencies=[Depends(require_admin)])
def admin_list_exams():
    """Return rows from the `exams` table for admin viewing.

    Returns a list of objects containing at least: exma_id, title, passing_score, nameofuser, questions, created_at
    """
    try:
        rows = supabase_client.table('exams').select('*').order('exma_id', desc=True).execute().data or []
        # Normalize fields for frontend consumption
        out = []
        for r in rows:
            out.append({
                'exma_id': r.get('exma_id') or r.get('id') or None,
                'title': r.get('title') or r.get('name') or '',
                'passing_score': r.get('passing_score') or r.get('score') or 0,
                'nameofuser': r.get('nameofuser') or r.get('name') or r.get('user') or '',
                'questions': r.get('questions') or None,
                'created_at': r.get('created_at') or r.get('inserted_at') or None
            })
        return out
    except Exception as e:
        logger.exception('admin_list_exams failed: %s', e)
        raise HTTPException(status_code=500, detail='Failed to fetch exams')
