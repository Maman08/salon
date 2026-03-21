from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import (
    BadRequestException,
    ConflictException,
    UnauthorizedException,
)
from app.models.user import User
from app.repositories.user import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, RefreshTokenRequest
from app.utils.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)

    async def register(self, data: RegisterRequest) -> TokenResponse:
        # Check if email already exists
        existing = await self.user_repo.get_by_email(data.email)
        if existing:
            raise ConflictException("A user with this email already exists")

        # Create user
        user = await self.user_repo.create(
            {
                "email": data.email,
                "hashed_password": hash_password(data.password),
                "full_name": data.full_name,
                "phone": data.phone,
            }
        )

        # Generate tokens
        token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )

    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise UnauthorizedException("Account is deactivated")

        token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )

    async def refresh(self, data: RefreshTokenRequest) -> TokenResponse:
        payload = decode_token(data.refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid or expired refresh token")

        user_id = payload.get("sub")
        user = await self.user_repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or deactivated")

        token_data = {"sub": str(user.id), "email": user.email, "role": user.role.value}
        return TokenResponse(
            access_token=create_access_token(token_data),
            refresh_token=create_refresh_token(token_data),
        )
