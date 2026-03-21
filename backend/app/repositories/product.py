from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.product import Product, ProductImage
from app.repositories.base import BaseRepository


class ProductRepository(BaseRepository[Product]):
    def __init__(self, db: AsyncSession):
        super().__init__(Product, db)

    async def get_by_slug(self, slug: str) -> Product | None:
        stmt = select(Product).where(Product.slug == slug)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_featured(self, limit: int = 10) -> list[Product]:
        stmt = (
            select(Product)
            .where(Product.is_featured == True, Product.is_active == True)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_category(
        self, category_id, skip: int = 0, limit: int = 20
    ) -> list[Product]:
        stmt = (
            select(Product)
            .where(Product.category_id == category_id, Product.is_active == True)
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def lock_for_update(self, product_id) -> Product | None:
        """Lock a product row for stock update (prevents race conditions)."""
        stmt = (
            select(Product)
            .where(Product.id == product_id)
            .with_for_update()
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()


class ProductImageRepository(BaseRepository[ProductImage]):
    def __init__(self, db: AsyncSession):
        super().__init__(ProductImage, db)

    async def get_by_product(self, product_id) -> list[ProductImage]:
        stmt = (
            select(ProductImage)
            .where(ProductImage.product_id == product_id)
            .order_by(ProductImage.sort_order)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
