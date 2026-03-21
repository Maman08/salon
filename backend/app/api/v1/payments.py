from uuid import UUID

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.payment import PaymentService

router = APIRouter(prefix="/payments", tags=["Payments"])


class CreatePaymentRequest(BaseModel):
    order_id: UUID


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/create")
async def create_payment(
    data: CreatePaymentRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.create_razorpay_order(data.order_id, current_user.id)


@router.post("/verify")
async def verify_payment(
    data: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
):
    service = PaymentService(db)
    return await service.verify_payment(
        razorpay_order_id=data.razorpay_order_id,
        razorpay_payment_id=data.razorpay_payment_id,
        razorpay_signature=data.razorpay_signature,
    )
