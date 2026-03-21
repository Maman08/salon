from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.wishlist import WishlistResponse
from app.services.wishlist import WishlistService

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("/", response_model=WishlistResponse)
async def get_wishlist(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WishlistService(db)
    return await service.get_wishlist(current_user.id)


@router.post("/{product_id}", status_code=201)
async def add_to_wishlist(
    product_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WishlistService(db)
    await service.add_to_wishlist(current_user.id, product_id)
    return MessageResponse(message="Added to wishlist")


@router.delete("/{product_id}")
async def remove_from_wishlist(
    product_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = WishlistService(db)
    await service.remove_from_wishlist(current_user.id, product_id)
    return MessageResponse(message="Removed from wishlist")
