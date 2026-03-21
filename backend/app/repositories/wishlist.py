from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.wishlist import Wishlist
from app.repositories.base import BaseRepository


class WishlistRepository(BaseRepository[Wishlist]):
    def __init__(self, db: AsyncSession):
        super().__init__(Wishlist, db)

    async def get_user_wishlist(self, user_id) -> list[Wishlist]:
        stmt = (
            select(Wishlist)
            .where(Wishlist.user_id == user_id)
            .order_by(Wishlist.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_wishlist_item(self, user_id, product_id) -> Wishlist | None:
        stmt = select(Wishlist).where(
            Wishlist.user_id == user_id,
            Wishlist.product_id == product_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()
