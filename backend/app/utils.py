# app/utils.py
import hmac, hashlib
from .config import RAZORPAY_KEY_SECRET

def verify_razorpay_signature(order_id: str, payment_id: str, signature: str) -> bool:
    msg = f"{order_id}|{payment_id}"
    gen = hmac.new(
        key=bytes(RAZORPAY_KEY_SECRET, "utf-8"),
        msg=bytes(msg, "utf-8"),
        digestmod=hashlib.sha256
    ).hexdigest()
    return gen == signature
