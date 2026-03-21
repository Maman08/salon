from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.cart import CartItem
from app.repositories.base import BaseRepository


class CartRepository(BaseRepository[CartItem]):
    def __init__(self, db: AsyncSession):
        super().__init__(CartItem, db)

    async def get_user_cart(self, user_id) -> list[CartItem]:
        stmt = (
            select(CartItem)
            .where(CartItem.user_id == user_id)
            .order_by(CartItem.created_at)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_cart_item(self, user_id, product_id) -> CartItem | None:
        stmt = select(CartItem).where(
            CartItem.user_id == user_id,
            CartItem.product_id == product_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def clear_user_cart(self, user_id) -> int:
        return await self.delete_by_filters(
            [CartItem.user_id == user_id]
        )
