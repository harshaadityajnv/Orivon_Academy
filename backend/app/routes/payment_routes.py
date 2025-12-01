# app/routes/payment_routes.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from ..auth import get_current_user
from ..auth import require_admin
from ..crud import get_cert, create_purchase_row, get_purchase, update_purchase
from ..config import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
import razorpay, uuid
from ..models import PurchaseCreate, VerifyPaymentSchema
from ..utils import verify_razorpay_signature

router = APIRouter(prefix="/payments", tags=["payments"])
razor = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

@router.post("/create_order")
def create_order(payload: PurchaseCreate, user=Depends(get_current_user)):
    certs = get_cert(payload.certification_id)
    if not certs:
        raise HTTPException(status_code=404, detail="Certification not found")
    cert = certs[0]
    price = float(cert.get("price_numeric", 0.0))
    if price <= 0:
        # Optionally allow free purchases: create purchase row and return
        purchase_id = str(uuid.uuid4())
        create_purchase_row(user_id=user["id"], cert_id=payload.certification_id, amount=price, currency="INR", razorpay_order_id="", purchase_id=purchase_id)
        return {"order_id": "", "amount": int(price * 100), "currency": "INR", "purchase_id": purchase_id}
    amount_paise = int(price * 100)
    purchase_id = str(uuid.uuid4())
    order = razor.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": purchase_id,
        "payment_capture": 1
    })
    create_purchase_row(user_id=user["id"], cert_id=payload.certification_id, amount=price, currency="INR", razorpay_order_id=order["id"], purchase_id=purchase_id)
    return {"order_id": order["id"], "amount": amount_paise, "currency": "INR", "purchase_id": purchase_id}

@router.post("/verify")
def verify_payment(body: VerifyPaymentSchema, user=Depends(get_current_user)):
    purchase = get_purchase(body.purchase_id)
    if not purchase:
        raise HTTPException(status_code=404, detail="Purchase not found")
    purchase = purchase[0]
    order_id = purchase.get("razorpay_order_id")
    if not order_id:
        raise HTTPException(status_code=400, detail="No order id on purchase")
    ok = verify_razorpay_signature(order_id, body.razorpay_payment_id, body.razorpay_signature)
    if not ok:
        raise HTTPException(status_code=400, detail="Invalid signature")
    update_purchase(body.purchase_id, {"status":"paid", "razorpay_payment_id": body.razorpay_payment_id, "razorpay_signature": body.razorpay_signature})
    # Insert a transaction record with mailid and price (default 1 rupee)
    try:
        from ..crud import create_transaction, get_cert
        # Attempt to include certificate title if purchase links to a certification
        cert_title = None
        cert_id = purchase.get("certification_id") or purchase.get("cert_id")
        if cert_id:
            certs = get_cert(cert_id)
            if certs:
                cert_title = certs[0].get("title") or certs[0].get("name")
        txn = create_transaction(mailid=user.get("email"), price=1, course_title=cert_title)
    except Exception as e:
        # Log but don't fail the whole flow
        print("Failed to create transaction row:", e)
        txn = None

    # Generate a transaction id to return for client-side reference
    txn_id = str(uuid.uuid4())

    # Return payment confirmation including mail id and transaction id
    return {"status": "paid", "transaction_id": txn_id, "mailid": user.get("email"), "price": 1}


@router.post("/record_transaction")
def record_transaction(payload: dict, user=Depends(get_current_user)):
    """Record a transaction row with the logged-in user's email and provided price.
    Expects payload: { price: number, payment_id?: string }
    """
    price = int(payload.get("price", 1))
    course_title = payload.get("course_title")
    try:
        from ..crud import create_transaction
        res = create_transaction(mailid=user.get("email"), price=price, course_title=course_title)
    except Exception as e:
        print("Failed to insert transaction:", e)
        raise HTTPException(status_code=500, detail="Failed to record transaction")
    return {"ok": True, "mailid": user.get("email"), "price": price, "inserted": res}


@router.get('/certificates/template')
def certificate_template():
    """Serve the certificate template image stored in the backend folder as 'certificate.png'."""
    import os
    base = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    # base points to backend/ folder
    path = os.path.join(base, 'certificate.png')
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail='Template not found')
    return FileResponse(path, media_type='image/png')


@router.post('/admin_record_transaction')
def admin_record_transaction(payload: dict, admin=Depends(require_admin)):
    """Admin-only: record a transaction on behalf of a user.

    Expects JSON: { mailid: string, price: number, course_title?: string }
    """
    mailid = payload.get('mailid')
    try:
        price = int(payload.get('price', 1))
    except Exception:
        raise HTTPException(status_code=400, detail='Invalid price')
    course_title = payload.get('course_title')
    if not mailid:
        raise HTTPException(status_code=400, detail='mailid is required')
    try:
        from ..crud import create_transaction
        res = create_transaction(mailid=mailid, price=price, course_title=course_title)
    except Exception as e:
        print('admin_record_transaction failed:', e)
        raise HTTPException(status_code=500, detail='Failed to create transaction')
    return { 'ok': True, 'mailid': mailid, 'price': price, 'inserted': res }


@router.get("/my_transactions")
def my_transactions(user=Depends(get_current_user)):
    """Return transactions for the currently authenticated user (by email)."""
    try:
        from ..db import supabase_client
        txs = supabase_client.table("transactions").select("*").eq("mailid", user.get("email")).order("id", desc=True).execute().data
        out = []
        for t in txs:
            out.append({
                "id": t.get("id"),
                "course_title": t.get("course_title") or t.get("course") or None,
                "price": t.get("price") or 0,
                "created_at": t.get("created_at") or t.get("inserted_at") or None
            })
        return out
    except Exception as e:
        print("Failed to fetch my_transactions:", e)
        raise HTTPException(status_code=500, detail="Failed to fetch transactions")
