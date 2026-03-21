from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator


class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    rating: int
    title: str | None = None
    comment: str | None = None
    is_verified: bool
    created_at: datetime
    user_name: str | None = None  # populated in service

    model_config = ConfigDict(from_attributes=True)


class ReviewCreateRequest(BaseModel):
    product_id: UUID
    rating: int
    title: str | None = None
    comment: str | None = None

    @field_validator("rating")
    @classmethod
    def rating_must_be_valid(cls, v: int) -> int:
        if v < 1 or v > 5:
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewUpdateRequest(BaseModel):
    rating: int | None = None
    title: str | None = None
    comment: str | None = None

    @field_validator("rating")
    @classmethod
    def rating_must_be_valid(cls, v: int | None) -> int | None:
        if v is not None and (v < 1 or v > 5):
            raise ValueError("Rating must be between 1 and 5")
        return v


class ProductReviewSummary(BaseModel):
    average_rating: float | None = None
    total_reviews: int = 0
    reviews: list[ReviewResponse] = []
