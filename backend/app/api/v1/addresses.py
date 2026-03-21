from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.address import (
    AddressCreateRequest,
    AddressResponse,
    AddressUpdateRequest,
)
from app.schemas.common import MessageResponse
from app.services.address import AddressService

router = APIRouter(prefix="/addresses", tags=["Addresses"])


@router.get("/", response_model=list[AddressResponse])
async def list_addresses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AddressService(db)
    return await service.get_user_addresses(current_user.id)


@router.post("/", response_model=AddressResponse, status_code=201)
async def create_address(
    data: AddressCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AddressService(db)
    return await service.create_address(current_user.id, data)


@router.put("/{address_id}", response_model=AddressResponse)
async def update_address(
    address_id: UUID,
    data: AddressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AddressService(db)
    return await service.update_address(current_user.id, address_id, data)


@router.delete("/{address_id}", response_model=MessageResponse)
async def delete_address(
    address_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AddressService(db)
    await service.delete_address(current_user.id, address_id)
    return MessageResponse(message="Address deleted")


@router.put("/{address_id}/default", response_model=AddressResponse)
async def set_default_address(
    address_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = AddressService(db)
    return await service.set_default(current_user.id, address_id)
