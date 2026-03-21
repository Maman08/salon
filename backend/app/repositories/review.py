from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.review import Review
from app.repositories.base import BaseRepository


class ReviewRepository(BaseRepository[Review]):
    def __init__(self, db: AsyncSession):
        super().__init__(Review, db)

    async def get_product_reviews(
        self, product_id, skip: int = 0, limit: int = 20
    ) -> list[Review]:
        stmt = (
            select(Review)
            .where(Review.product_id == product_id)
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_user_product_review(self, user_id, product_id) -> Review | None:
        stmt = select(Review).where(
            Review.user_id == user_id,
            Review.product_id == product_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_average_rating(self, product_id) -> float | None:
        stmt = select(func.avg(Review.rating)).where(
            Review.product_id == product_id
        )
        result = await self.db.execute(stmt)
        avg = result.scalar_one_or_none()
        return float(avg) if avg else None

    async def get_review_count(self, product_id) -> int:
        stmt = select(func.count()).select_from(Review).where(
            Review.product_id == product_id
        )
        result = await self.db.execute(stmt)
        return result.scalar_one()
