from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    product_image: str | None = None
    quantity: int
    unit_price: float
    total_price: float

    model_config = ConfigDict(from_attributes=True)


class OrderResponse(BaseModel):
    id: UUID
    order_number: str
    status: str
    payment_status: str
    subtotal: float
    shipping_fee: float
    total: float
    shipping_address: dict
    razorpay_order_id: str | None = None
    notes: str | None = None
    items: list[OrderItemResponse] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderListResponse(BaseModel):
    """Lighter response for order listings."""
    id: UUID
    order_number: str
    status: str
    payment_status: str
    total: float
    items_count: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CreateOrderRequest(BaseModel):
    address_id: UUID
    notes: str | None = None


class OrderStatusUpdateRequest(BaseModel):
    status: str
