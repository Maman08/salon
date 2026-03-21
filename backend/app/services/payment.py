import hmac
import hashlib
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.exceptions import BadRequestException, NotFoundException
from app.models.order import PaymentStatus
from app.repositories.order import OrderRepository

settings = get_settings()


def _get_razorpay_client():
    """Lazy-load razorpay client to avoid import-time crashes."""
    import razorpay

    return razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )


class PaymentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self._client = None

    @property
    def client(self):
        if self._client is None:
            self._client = _get_razorpay_client()
        return self._client

    async def create_razorpay_order(self, order_id: UUID, user_id: UUID) -> dict:
        """Create a Razorpay order for an existing order."""
        order = await self.order_repo.get_by_id(order_id)
        if not order or order.user_id != user_id:
            raise NotFoundException("Order not found")

        if order.payment_status == PaymentStatus.PAID:
            raise BadRequestException("Order is already paid")

        # Amount in paise (smallest currency unit)
        amount_in_paise = int(float(order.total) * 100)

        razorpay_order = self.client.order.create(
            {
                "amount": amount_in_paise,
                "currency": "INR",
                "receipt": order.order_number,
            }
        )

        # Store razorpay_order_id
        await self.order_repo.update(
            order, {"razorpay_order_id": razorpay_order["id"]}
        )

        return {
            "razorpay_order_id": razorpay_order["id"],
            "amount": amount_in_paise,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,
        }

    async def verify_payment(
        self,
        razorpay_order_id: str,
        razorpay_payment_id: str,
        razorpay_signature: str,
    ) -> dict:
        """Verify Razorpay payment signature and update order."""
        # Verify signature
        message = f"{razorpay_order_id}|{razorpay_payment_id}"
        expected_signature = hmac.new(
            settings.RAZORPAY_KEY_SECRET.encode(),
            message.encode(),
            hashlib.sha256,
        ).hexdigest()

        if not hmac.compare_digest(expected_signature, razorpay_signature):
            raise BadRequestException("Invalid payment signature")

        # Find and update order
        order = await self.order_repo.get_by_razorpay_order_id(razorpay_order_id)
        if not order:
            raise NotFoundException("Order not found for this payment")

        await self.order_repo.update(
            order,
            {
                "razorpay_payment_id": razorpay_payment_id,
                "payment_status": PaymentStatus.PAID,
            },
        )

        return {"status": "success", "order_number": order.order_number}
