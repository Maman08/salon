from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.order import Order, OrderItem
from app.repositories.base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, db: AsyncSession):
        super().__init__(Order, db)

    async def get_user_orders(
        self, user_id, skip: int = 0, limit: int = 20
    ) -> list[Order]:
        stmt = (
            select(Order)
            .where(Order.user_id == user_id)
            .order_by(Order.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_order_number(self, order_number: str) -> Order | None:
        stmt = select(Order).where(Order.order_number == order_number)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_razorpay_order_id(self, razorpay_order_id: str) -> Order | None:
        stmt = select(Order).where(Order.razorpay_order_id == razorpay_order_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def generate_order_number(self) -> str:
        """Generate a unique order number like GRX-000001."""
        stmt = select(func.count()).select_from(Order)
        result = await self.db.execute(stmt)
        count = result.scalar_one()
        return f"GRX-{count + 1:06d}"


class OrderItemRepository(BaseRepository[OrderItem]):
    def __init__(self, db: AsyncSession):
        super().__init__(OrderItem, db)
