from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.product import Product
from app.models.user import User

router = APIRouter(prefix="/dashboard", tags=["Admin - Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """Return high-level dashboard metrics."""

    # Total products (active)
    res = await db.execute(
        select(func.count()).select_from(Product).where(Product.is_active == True)
    )
    total_products = res.scalar_one()

    # Total orders
    res = await db.execute(select(func.count()).select_from(Order))
    total_orders = res.scalar_one()

    # Pending orders
    res = await db.execute(
        select(func.count())
        .select_from(Order)
        .where(Order.status == OrderStatus.PENDING)
    )
    pending_orders = res.scalar_one()

    # Total users
    res = await db.execute(select(func.count()).select_from(User))
    total_users = res.scalar_one()

    # Total revenue (paid orders)
    res = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(Order.payment_status == PaymentStatus.PAID)
    )
    total_revenue = float(res.scalar_one())

    # Low stock products (quantity < 10)
    res = await db.execute(
        select(func.count())
        .select_from(Product)
        .where(Product.is_active == True, Product.stock_quantity < 10)
    )
    low_stock_products = res.scalar_one()

    # Recent orders (last 5)
    res = await db.execute(
        select(Order).order_by(Order.created_at.desc()).limit(5)
    )
    recent_orders = res.scalars().all()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "total_users": total_users,
        "total_revenue": total_revenue,
        "low_stock_products": low_stock_products,
        "recent_orders": [
            {
                "id": str(o.id),
                "order_number": o.order_number,
                "status": o.status.value,
                "payment_status": o.payment_status.value,
                "total": float(o.total),
                "created_at": o.created_at.isoformat(),
            }
            for o in recent_orders
        ],
    }
