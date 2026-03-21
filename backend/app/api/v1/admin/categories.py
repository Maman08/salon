from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.schemas.category import (
    CategoryCreateRequest,
    CategoryResponse,
    CategoryUpdateRequest,
)
from app.schemas.common import MessageResponse
from app.services.category import CategoryService

router = APIRouter(prefix="/categories", tags=["Admin - Categories"])


@router.get("/", response_model=list[CategoryResponse])
async def list_all_categories(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = CategoryService(db)
    return await service.get_all()


@router.post("/", response_model=CategoryResponse, status_code=201)
async def create_category(
    data: CategoryCreateRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = CategoryService(db)
    return await service.create(data)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    data: CategoryUpdateRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = CategoryService(db)
    return await service.update(category_id, data)


@router.delete("/{category_id}", response_model=MessageResponse)
async def delete_category(
    category_id: UUID,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = CategoryService(db)
    await service.delete(category_id)
    return MessageResponse(message="Category deleted")
