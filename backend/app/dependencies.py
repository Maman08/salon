from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.exceptions import ForbiddenException, UnauthorizedException
from app.models.user import User, UserRole
from app.repositories.user import UserRepository
from app.utils.security import decode_token

security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    """Extract and validate user from JWT bearer token."""
    if not credentials:
        raise UnauthorizedException("Not authenticated")
    token = credentials.credentials
    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise UnauthorizedException("Invalid or expired access token")

    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")

    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(UUID(user_id))

    if not user:
        raise UnauthorizedException("User not found")
    if not user.is_active:
        raise UnauthorizedException("Account is deactivated")

    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require admin role."""
    if current_user.role != UserRole.ADMIN:
        raise ForbiddenException("Admin access required")
    return current_user
