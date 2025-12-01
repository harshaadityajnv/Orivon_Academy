# app/models.py
from pydantic import BaseModel
from typing import List, Optional, Any

class GoogleToken(BaseModel):
    id_token: str

class UserOut(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    role: str

class CertificationCreate(BaseModel):
    title: str
    description: Optional[str] = None
    duration_minutes: Optional[int] = 0
    price_numeric: float = 0.0
    active: bool = True
    metadata: Optional[dict] = None

class CertificationOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    duration_minutes: Optional[int]
    price_numeric: float
    active: bool

class PurchaseCreate(BaseModel):
    certification_id: str

class VerifyPaymentSchema(BaseModel):
    purchase_id: str
    razorpay_payment_id: str
    razorpay_signature: str

class AttemptStartSchema(BaseModel):
    certification_id: str
    consent: Optional[bool] = True
    metadata: Optional[dict] = None

class AttemptSubmitAnswer(BaseModel):
    question_id: str
    selected_option: str

class AttemptSubmitSchema(BaseModel):
    answers: List[AttemptSubmitAnswer]
    ended_at: Optional[str] = None

class EventSchema(BaseModel):
    event_type: str
    metadata: Optional[dict] = None


class ExamCreateSchema(BaseModel):
    title: str
    certification_id: Optional[str] = None


class ExamCompleteSchema(BaseModel):
    passing_score: int
    pass_status: bool
