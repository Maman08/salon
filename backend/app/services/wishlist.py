from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import ConflictException, NotFoundException
from app.repositories.wishlist import WishlistRepository
from app.repositories.product import ProductRepository


class WishlistService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.wishlist_repo = WishlistRepository(db)
        self.product_repo = ProductRepository(db)

    async def get_wishlist(self, user_id: UUID) -> dict:
        items = await self.wishlist_repo.get_user_wishlist(user_id)
        return {
            "items": items,
            "total": len(items),
        }

    async def add_to_wishlist(self, user_id: UUID, product_id: UUID):
        # Check product exists
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product not found")

        # Check if already in wishlist
        existing = await self.wishlist_repo.get_wishlist_item(user_id, product_id)
        if existing:
            raise ConflictException("Product already in wishlist")

        return await self.wishlist_repo.create(
            {"user_id": user_id, "product_id": product_id}
        )

    async def remove_from_wishlist(self, user_id: UUID, product_id: UUID) -> None:
        item = await self.wishlist_repo.get_wishlist_item(user_id, product_id)
        if not item:
            raise NotFoundException("Product not in wishlist")
        await self.wishlist_repo.delete(item)
