from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.address import Address
from app.repositories.base import BaseRepository


class AddressRepository(BaseRepository[Address]):
    def __init__(self, db: AsyncSession):
        super().__init__(Address, db)

    async def get_user_addresses(self, user_id) -> list[Address]:
        stmt = (
            select(Address)
            .where(Address.user_id == user_id)
            .order_by(Address.is_default.desc(), Address.created_at.desc())
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_default_address(self, user_id) -> Address | None:
        stmt = select(Address).where(
            Address.user_id == user_id,
            Address.is_default == True,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def clear_default(self, user_id) -> None:
        """Unset is_default for all addresses of a user."""
        addresses = await self.get_user_addresses(user_id)
        for addr in addresses:
            if addr.is_default:
                addr.is_default = False
        await self.db.flush()
