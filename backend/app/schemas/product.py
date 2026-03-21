from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator, model_validator


class ProductImageResponse(BaseModel):
    id: UUID
    url: str
    alt_text: str | None = None
    is_primary: bool
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class ProductResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None = None
    short_description: str | None = None
    price: float
    compare_at_price: float | None = None
    sku: str | None = None
    stock_quantity: int
    category_id: UUID
    is_active: bool
    is_featured: bool
    images: list[ProductImageResponse] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProductListResponse(BaseModel):
    """Lighter response for product listings."""
    id: UUID
    name: str
    slug: str
    short_description: str | None = None
    price: float
    compare_at_price: float | None = None
    stock_quantity: int
    is_featured: bool
    primary_image: str | None = None
    category_id: UUID

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def extract_primary_image(cls, data):
        # When built from ORM object (has .images relationship), extract primary_image
        if hasattr(data, "images") and data.images and not getattr(data, "primary_image", None):
            images = data.images
            primary = next((img for img in images if img.is_primary), None)
            url = primary.url if primary else images[0].url
            # Pydantic v2: mutate via __dict__ before validation
            object.__setattr__(data, "primary_image", url) if hasattr(data, "__dict__") else None
        return data


class ProductCreateRequest(BaseModel):
    name: str
    slug: str
    description: str | None = None
    short_description: str | None = None
    price: float
    compare_at_price: float | None = None
    sku: str | None = None
    stock_quantity: int = 0
    category_id: UUID
    is_active: bool = True
    is_featured: bool = False

    @field_validator("price")
    @classmethod
    def price_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("Price must be greater than 0")
        return v

    @field_validator("stock_quantity")
    @classmethod
    def stock_must_be_non_negative(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Stock quantity cannot be negative")
        return v


class ProductUpdateRequest(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    short_description: str | None = None
    price: float | None = None
    compare_at_price: float | None = None
    sku: str | None = None
    stock_quantity: int | None = None
    category_id: UUID | None = None
    is_active: bool | None = None
    is_featured: bool | None = None
