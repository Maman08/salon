from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import BadRequestException, ConflictException, NotFoundException
from app.models.order import Order
from app.repositories.review import ReviewRepository
from app.repositories.order import OrderRepository
from app.schemas.review import ReviewCreateRequest, ReviewUpdateRequest


class ReviewService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.review_repo = ReviewRepository(db)
        self.order_repo = OrderRepository(db)

    async def get_product_reviews(
        self, product_id: UUID, skip: int = 0, limit: int = 20
    ) -> dict:
        reviews = await self.review_repo.get_product_reviews(
            product_id, skip=skip, limit=limit
        )
        avg_rating = await self.review_repo.get_average_rating(product_id)
        total = await self.review_repo.get_review_count(product_id)
        return {
            "reviews": reviews,
            "average_rating": round(avg_rating, 1) if avg_rating else None,
            "total_reviews": total,
        }

    async def create_review(
        self, user_id: UUID, data: ReviewCreateRequest
    ):
        # Check if user already reviewed this product
        existing = await self.review_repo.get_user_product_review(
            user_id, data.product_id
        )
        if existing:
            raise ConflictException("You have already reviewed this product")

        # Check if user has purchased the product (verified review)
        is_verified = await self._has_purchased(user_id, data.product_id)

        return await self.review_repo.create(
            {
                "user_id": user_id,
                "product_id": data.product_id,
                "rating": data.rating,
                "title": data.title,
                "comment": data.comment,
                "is_verified": is_verified,
            }
        )

    async def update_review(
        self, user_id: UUID, review_id: UUID, data: ReviewUpdateRequest
    ):
        review = await self.review_repo.get_by_id(review_id)
        if not review or review.user_id != user_id:
            raise NotFoundException("Review not found")

        update_data = data.model_dump(exclude_unset=True)
        return await self.review_repo.update(review, update_data)

    async def delete_review(self, user_id: UUID, review_id: UUID) -> None:
        review = await self.review_repo.get_by_id(review_id)
        if not review or review.user_id != user_id:
            raise NotFoundException("Review not found")
        await self.review_repo.delete(review)

    async def _has_purchased(self, user_id: UUID, product_id: UUID) -> bool:
        """Check if user has a delivered order containing this product."""
        from app.models.order import OrderStatus

        orders = await self.order_repo.get_user_orders(user_id, skip=0, limit=100)
        for order in orders:
            if order.status == OrderStatus.DELIVERED:
                for item in order.items:
                    if item.product_id == product_id:
                        return True
        return False
