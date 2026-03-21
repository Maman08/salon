from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.schemas.user import AdminUserResponse, UserRoleUpdateRequest
from app.services.user import UserService
from app.utils.pagination import paginate

router = APIRouter(prefix="/users", tags=["Admin - Users"])


@router.get("/", response_model=dict)
async def list_users(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = UserService(db)
    skip = (page - 1) * per_page
    users = await service.list_users(skip=skip, limit=per_page)
    total = await service.count_users()
    serialized = [AdminUserResponse.model_validate(u).model_dump() for u in users]
    return {**paginate(total, page, per_page), "items": serialized}


@router.put("/{user_id}/role", response_model=AdminUserResponse)
async def update_user_role(
    user_id: UUID,
    data: UserRoleUpdateRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = UserService(db)
    return await service.update_user_role(user_id, data.role)
