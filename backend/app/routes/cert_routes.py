# app/routes/cert_routes.py
from fastapi import APIRouter, Depends, HTTPException
from ..crud import list_certifications, get_cert, create_cert, update_cert, delete_cert
from ..auth import get_current_user, require_admin
from ..models import CertificationCreate

router = APIRouter(prefix="/certifications", tags=["certifications"])

@router.get("")
def list_all():
    return list_certifications(active_only=True)

@router.get("/{cert_id}")
def get_one(cert_id: str):
    res = get_cert(cert_id)
    if not res:
        raise HTTPException(status_code=404, detail="Certification not found")
    return res[0]

@router.post("", dependencies=[Depends(require_admin)])
def create_certification(payload: CertificationCreate):
    data = payload.dict()
    res = create_cert(data)
    return res[0]

@router.put("/{cert_id}", dependencies=[Depends(require_admin)])
def update_certification(cert_id: str, payload: CertificationCreate):
    res = update_cert(cert_id, payload.dict())
    return res[0]

@router.delete("/{cert_id}", dependencies=[Depends(require_admin)])
def delete_certification(cert_id: str):
    res = delete_cert(cert_id)
    return {"deleted": True}
