from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.product import ProductListResponse


class WishlistItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product: ProductListResponse | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class WishlistResponse(BaseModel):
    items: list[WishlistItemResponse]
    total: int
