from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.schemas.order import OrderResponse, OrderStatusUpdateRequest
from app.services.order import OrderService
from app.utils.pagination import paginate

router = APIRouter(prefix="/orders", tags=["Admin - Orders"])


@router.get("/", response_model=dict)
async def list_all_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    skip = (page - 1) * per_page
    orders = await service.get_all_orders(skip=skip, limit=per_page)
    total = await service.count_all_orders()
    return {**paginate(total, page, per_page), "items": orders}


@router.put("/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: UUID,
    data: OrderStatusUpdateRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.update_status(order_id, data)
