from fastapi import APIRouter

from app.api.v1 import (
    auth,
    users,
    products,
    categories,
    cart,
    orders,
    payments,
    reviews,
    wishlist,
    addresses,
)
from app.api.v1.admin import (
    products as admin_products,
    orders as admin_orders,
    categories as admin_categories,
    users as admin_users,
    dashboard as admin_dashboard,
)

api_router = APIRouter(prefix="/api/v1")

# Public / Authenticated routes
api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(products.router)
api_router.include_router(categories.router)
api_router.include_router(cart.router)
api_router.include_router(orders.router)
api_router.include_router(payments.router)
api_router.include_router(reviews.router)
api_router.include_router(wishlist.router)
api_router.include_router(addresses.router)

# Admin routes
admin_router = APIRouter(prefix="/api/v1/admin")
admin_router.include_router(admin_dashboard.router)
admin_router.include_router(admin_products.router)
admin_router.include_router(admin_orders.router)
admin_router.include_router(admin_categories.router)
admin_router.include_router(admin_users.router)
