from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import BadRequestException, NotFoundException
from app.models.cart import CartItem
from app.repositories.cart import CartRepository
from app.repositories.product import ProductRepository
from app.schemas.cart import AddToCartRequest, UpdateCartItemRequest


class CartService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)

    async def get_cart(self, user_id: UUID) -> dict:
        items = await self.cart_repo.get_user_cart(user_id)
        subtotal = 0.0
        for item in items:
            if item.product:
                subtotal += float(item.product.price) * item.quantity
        return {
            "items": items,
            "total_items": sum(i.quantity for i in items),
            "subtotal": round(subtotal, 2),
        }

    async def add_item(self, user_id: UUID, data: AddToCartRequest) -> CartItem:
        # Check product exists and has stock
        product = await self.product_repo.get_by_id(data.product_id)
        if not product or not product.is_active:
            raise NotFoundException("Product not found or inactive")
        if product.stock_quantity < data.quantity:
            raise BadRequestException(
                f"Insufficient stock. Available: {product.stock_quantity}"
            )

        # Check if already in cart → update quantity
        existing = await self.cart_repo.get_cart_item(user_id, data.product_id)
        if existing:
            new_qty = existing.quantity + data.quantity
            if new_qty > product.stock_quantity:
                raise BadRequestException(
                    f"Cannot add more. Stock available: {product.stock_quantity}"
                )
            return await self.cart_repo.update(existing, {"quantity": new_qty})

        # Create new cart item
        return await self.cart_repo.create(
            {
                "user_id": user_id,
                "product_id": data.product_id,
                "quantity": data.quantity,
            }
        )

    async def update_item(
        self, user_id: UUID, item_id: UUID, data: UpdateCartItemRequest
    ) -> CartItem:
        item = await self.cart_repo.get_by_id(item_id)
        if not item or item.user_id != user_id:
            raise NotFoundException("Cart item not found")

        product = await self.product_repo.get_by_id(item.product_id)
        if product and data.quantity > product.stock_quantity:
            raise BadRequestException(
                f"Insufficient stock. Available: {product.stock_quantity}"
            )

        return await self.cart_repo.update(item, {"quantity": data.quantity})

    async def remove_item(self, user_id: UUID, item_id: UUID) -> None:
        item = await self.cart_repo.get_by_id(item_id)
        if not item or item.user_id != user_id:
            raise NotFoundException("Cart item not found")
        await self.cart_repo.delete(item)

    async def clear_cart(self, user_id: UUID) -> int:
        return await self.cart_repo.clear_user_cart(user_id)
