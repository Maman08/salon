from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.order import CreateOrderRequest, OrderListResponse, OrderResponse
from app.services.order import OrderService
from app.utils.pagination import paginate

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=201)
async def create_order(
    data: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.create_order(current_user.id, data)


@router.get("/", response_model=dict)
async def list_orders(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    skip = (page - 1) * per_page
    orders = await service.get_user_orders(current_user.id, skip=skip, limit=per_page)
    total = await service.count_user_orders(current_user.id)

    items = []
    for o in orders:
        items.append(
            OrderListResponse(
                id=o.id,
                order_number=o.order_number,
                status=o.status.value,
                payment_status=o.payment_status.value,
                total=float(o.total),
                items_count=len(o.items),
                created_at=o.created_at,
            )
        )

    return {**paginate(total, page, per_page), "items": items}


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.get_order_detail(current_user.id, order_id)


@router.put("/{order_id}/cancel", response_model=OrderResponse)
async def cancel_order(
    order_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = OrderService(db)
    return await service.cancel_order(current_user.id, order_id)
