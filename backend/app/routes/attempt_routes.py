from fastapi import APIRouter, Depends, HTTPException
from ..auth import get_current_user
from ..db import supabase_client
from ..models import AttemptStartSchema, EventSchema, AttemptSubmitSchema
from ..crud import create_attempt, get_attempt, add_proctor_event, update_attempt

router = APIRouter(prefix="/attempts", tags=["attempts"])


@router.post("/start")
def start_attempt(payload: AttemptStartSchema, user=Depends(get_current_user)):
    purchases = supabase_client.table("enrollments").select("*").eq("User Mail ID", user["email"]).execute().data

    metadata = payload.metadata or {}
    attempt_id = create_attempt(user_id=user["id"], cert_id=payload.certification_id, metadata=metadata)

    questions = supabase_client.table("questions").select("question_id, text, options, marks").eq("exma_id", payload.certification_id).execute().data

    return {"attempt_id": attempt_id, "questions": questions}


@router.post("/{attempt_id}/events")
def add_event(attempt_id: int, body: EventSchema, user=Depends(get_current_user)):
    att = get_attempt(attempt_id)
    if not att:
        raise HTTPException(404, "Attempt not found")

    add_proctor_event(attempt_id, body.event_type, body.metadata or {})
    return {"ok": True}


@router.post("/{attempt_id}/submit")
def submit_attempt(attempt_id: int, payload: AttemptSubmitSchema, user=Depends(get_current_user)):
    att = get_attempt(attempt_id)
    if not att:
        raise HTTPException(404, "Attempt not found")

    cert_id = att[0]["exma_id"]
    questions = supabase_client.table("questions").select("*").eq("exma_id", cert_id).execute().data

    answers_map = {q["question_id"]: q for q in questions}
    total_score = 0

    for a in payload.answers:
        q = answers_map.get(a.question_id)
        if q and a.selected_option == q.get("correct_index"):
            total_score += int(q.get("marks", 1))

    update_attempt(attempt_id, {"status": "under_review", "score": total_score})

    return {"status": "under_review", "score": total_score}
