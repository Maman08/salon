from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import NotFoundException
from app.models.category import Category
from app.repositories.category import CategoryRepository
from app.schemas.category import CategoryCreateRequest, CategoryUpdateRequest


class CategoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.category_repo = CategoryRepository(db)

    async def get_active_categories(self) -> list[Category]:
        return await self.category_repo.get_active()

    async def get_by_slug(self, slug: str) -> Category:
        cat = await self.category_repo.get_by_slug(slug)
        if not cat:
            raise NotFoundException(f"Category '{slug}' not found")
        return cat

    # ── Admin Methods ──────────────────────────────────────────────────────

    async def get_all(self, skip: int = 0, limit: int = 50) -> list[Category]:
        return await self.category_repo.get_all(skip=skip, limit=limit)

    async def count(self) -> int:
        return await self.category_repo.count()

    async def create(self, data: CategoryCreateRequest) -> Category:
        return await self.category_repo.create(data.model_dump())

    async def update(self, category_id: UUID, data: CategoryUpdateRequest) -> Category:
        cat = await self.category_repo.get_by_id(category_id)
        if not cat:
            raise NotFoundException("Category not found")
        update_data = data.model_dump(exclude_unset=True)
        return await self.category_repo.update(cat, update_data)

    async def delete(self, category_id: UUID) -> None:
        cat = await self.category_repo.get_by_id(category_id)
        if not cat:
            raise NotFoundException("Category not found")
        await self.category_repo.delete(cat)
