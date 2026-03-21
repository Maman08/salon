from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

from app.schemas.product import ProductListResponse


class CartItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    quantity: int
    product: ProductListResponse | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    total_items: int
    subtotal: float


class AddToCartRequest(BaseModel):
    product_id: UUID
    quantity: int = 1

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        return v


class UpdateCartItemRequest(BaseModel):
    quantity: int

    @field_validator("quantity")
    @classmethod
    def quantity_must_be_positive(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("Quantity must be greater than 0")
        return v
