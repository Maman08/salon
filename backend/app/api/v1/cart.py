from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.cart import (
    AddToCartRequest,
    CartItemResponse,
    CartResponse,
    UpdateCartItemRequest,
)
from app.schemas.common import MessageResponse
from app.services.cart import CartService

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/", response_model=CartResponse)
async def get_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = CartService(db)
    return await service.get_cart(current_user.id)


@router.post("/items", response_model=CartItemResponse, status_code=201)
async def add_to_cart(
    data: AddToCartRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = CartService(db)
    return await service.add_item(current_user.id, data)


@router.put("/items/{item_id}", response_model=CartItemResponse)
async def update_cart_item(
    item_id: UUID,
    data: UpdateCartItemRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = CartService(db)
    return await service.update_item(current_user.id, item_id, data)


@router.delete("/items/{item_id}", response_model=MessageResponse)
async def remove_cart_item(
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = CartService(db)
    await service.remove_item(current_user.id, item_id)
    return MessageResponse(message="Item removed from cart")


@router.delete("/", response_model=MessageResponse)
async def clear_cart(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = CartService(db)
    await service.clear_cart(current_user.id)
    return MessageResponse(message="Cart cleared")
