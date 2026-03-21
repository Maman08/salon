from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.review import (
    ProductReviewSummary,
    ReviewCreateRequest,
    ReviewResponse,
    ReviewUpdateRequest,
)
from app.schemas.common import MessageResponse
from app.services.review import ReviewService

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/product/{product_id}", response_model=ProductReviewSummary)
async def get_product_reviews(
    product_id: UUID,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    skip = (page - 1) * per_page
    result = await service.get_product_reviews(product_id, skip=skip, limit=per_page)
    return result


@router.post("/", response_model=ReviewResponse, status_code=201)
async def create_review(
    data: ReviewCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    return await service.create_review(current_user.id, data)


@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: UUID,
    data: ReviewUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    return await service.update_review(current_user.id, review_id, data)


@router.delete("/{review_id}", response_model=MessageResponse)
async def delete_review(
    review_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = ReviewService(db)
    await service.delete_review(current_user.id, review_id)
    return MessageResponse(message="Review deleted")
