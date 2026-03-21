from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import BadRequestException, NotFoundException
from app.repositories.address import AddressRepository
from app.schemas.address import AddressCreateRequest, AddressUpdateRequest


class AddressService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.address_repo = AddressRepository(db)

    async def get_user_addresses(self, user_id: UUID):
        return await self.address_repo.get_user_addresses(user_id)

    async def create_address(self, user_id: UUID, data: AddressCreateRequest):
        create_data = data.model_dump()
        create_data["user_id"] = user_id

        # If this is set as default, clear other defaults
        if data.is_default:
            await self.address_repo.clear_default(user_id)

        return await self.address_repo.create(create_data)

    async def update_address(
        self, user_id: UUID, address_id: UUID, data: AddressUpdateRequest
    ):
        address = await self.address_repo.get_by_id(address_id)
        if not address or address.user_id != user_id:
            raise NotFoundException("Address not found")

        update_data = data.model_dump(exclude_unset=True)

        # If setting as default, clear other defaults
        if update_data.get("is_default"):
            await self.address_repo.clear_default(user_id)

        return await self.address_repo.update(address, update_data)

    async def delete_address(self, user_id: UUID, address_id: UUID) -> None:
        address = await self.address_repo.get_by_id(address_id)
        if not address or address.user_id != user_id:
            raise NotFoundException("Address not found")
        await self.address_repo.delete(address)

    async def set_default(self, user_id: UUID, address_id: UUID):
        address = await self.address_repo.get_by_id(address_id)
        if not address or address.user_id != user_id:
            raise NotFoundException("Address not found")

        await self.address_repo.clear_default(user_id)
        return await self.address_repo.update(address, {"is_default": True})
