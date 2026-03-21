from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.category import Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, db: AsyncSession):
        super().__init__(Category, db)

    async def get_by_slug(self, slug: str) -> Category | None:
        stmt = select(Category).where(Category.slug == slug)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_active(self) -> list[Category]:
        stmt = select(Category).where(Category.is_active == True)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
