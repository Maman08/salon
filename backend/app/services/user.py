from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import BadRequestException, NotFoundException
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.user import UserUpdateRequest, PasswordChangeRequest
from app.utils.security import hash_password, verify_password


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def get_profile(self, user_id: UUID) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        return user

    async def update_profile(self, user_id: UUID, data: UserUpdateRequest) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")

        update_data = data.model_dump(exclude_unset=True)
        if not update_data:
            raise BadRequestException("No fields to update")

        return await self.user_repo.update(user, update_data)

    async def change_password(
        self, user_id: UUID, data: PasswordChangeRequest
    ) -> None:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")

        if not verify_password(data.current_password, user.hashed_password):
            raise BadRequestException("Current password is incorrect")

        await self.user_repo.update(
            user, {"hashed_password": hash_password(data.new_password)}
        )

    # ── Admin Methods ──────────────────────────────────────────────────────

    async def list_users(self, skip: int = 0, limit: int = 20) -> list[User]:
        return await self.user_repo.get_all(skip=skip, limit=limit)

    async def count_users(self) -> int:
        return await self.user_repo.count()

    async def update_user_role(self, user_id: UUID, role: str) -> User:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        return await self.user_repo.update(user, {"role": role})
