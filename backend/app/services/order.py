from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import (
    BadRequestException,
    InsufficientStockException,
    NotFoundException,
)
from app.models.order import Order, OrderStatus, PaymentStatus
from app.repositories.cart import CartRepository
from app.repositories.order import OrderRepository, OrderItemRepository
from app.repositories.product import ProductRepository
from app.repositories.address import AddressRepository
from app.schemas.order import CreateOrderRequest, OrderStatusUpdateRequest


class OrderService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.order_repo = OrderRepository(db)
        self.order_item_repo = OrderItemRepository(db)
        self.cart_repo = CartRepository(db)
        self.product_repo = ProductRepository(db)
        self.address_repo = AddressRepository(db)

    async def create_order(self, user_id: UUID, data: CreateOrderRequest) -> Order:
        """
        Create an order from the user's cart.
        Uses SELECT ... FOR UPDATE to prevent race conditions on stock.
        """
        # 1. Get the shipping address
        address = await self.address_repo.get_by_id(data.address_id)
        if not address or address.user_id != user_id:
            raise NotFoundException("Address not found")

        # 2. Get cart items
        cart_items = await self.cart_repo.get_user_cart(user_id)
        if not cart_items:
            raise BadRequestException("Cart is empty")

        # 3. Lock products and validate stock (prevents race conditions)
        order_items_data = []
        subtotal = 0.0

        for cart_item in cart_items:
            # Lock the product row for the duration of this transaction
            product = await self.product_repo.lock_for_update(cart_item.product_id)
            if not product or not product.is_active:
                raise BadRequestException(
                    f"Product is no longer available"
                )
            if product.stock_quantity < cart_item.quantity:
                raise InsufficientStockException(
                    product_name=product.name,
                    available=product.stock_quantity,
                )

            # Deduct stock
            await self.product_repo.update(
                product,
                {"stock_quantity": product.stock_quantity - cart_item.quantity},
            )

            item_total = float(product.price) * cart_item.quantity
            subtotal += item_total

            # Get primary image
            primary_image = None
            if product.images:
                primary = next((img for img in product.images if img.is_primary), None)
                primary_image = primary.url if primary else product.images[0].url

            order_items_data.append(
                {
                    "product_id": product.id,
                    "product_name": product.name,
                    "product_image": primary_image,
                    "quantity": cart_item.quantity,
                    "unit_price": float(product.price),
                    "total_price": item_total,
                }
            )

        # 4. Calculate totals
        shipping_fee = 0.0 if subtotal >= 500 else 50.0  # Free shipping over ₹500
        total = subtotal + shipping_fee

        # 5. Snapshot address
        address_snapshot = {
            "full_name": address.full_name,
            "phone": address.phone,
            "address_line1": address.address_line1,
            "address_line2": address.address_line2,
            "city": address.city,
            "state": address.state,
            "pincode": address.pincode,
        }

        # 6. Generate order number
        order_number = await self.order_repo.generate_order_number()

        # 7. Create order
        order = await self.order_repo.create(
            {
                "order_number": order_number,
                "user_id": user_id,
                "status": OrderStatus.PENDING,
                "payment_status": PaymentStatus.PENDING,
                "subtotal": subtotal,
                "shipping_fee": shipping_fee,
                "total": total,
                "shipping_address": address_snapshot,
                "notes": data.notes,
            }
        )

        # 8. Create order items
        for item_data in order_items_data:
            item_data["order_id"] = order.id
            await self.order_item_repo.create(item_data)

        # 9. Clear cart
        await self.cart_repo.clear_user_cart(user_id)

        # 10. Refresh order to load items
        await self.db.refresh(order)
        return order

    async def get_user_orders(
        self, user_id: UUID, skip: int = 0, limit: int = 20
    ) -> list[Order]:
        return await self.order_repo.get_user_orders(user_id, skip=skip, limit=limit)

    async def count_user_orders(self, user_id: UUID) -> int:
        return await self.order_repo.count(
            filters=[Order.user_id == user_id]
        )

    async def get_order_detail(self, user_id: UUID, order_id: UUID) -> Order:
        order = await self.order_repo.get_by_id(order_id)
        if not order or order.user_id != user_id:
            raise NotFoundException("Order not found")
        return order

    async def cancel_order(self, user_id: UUID, order_id: UUID) -> Order:
        order = await self.order_repo.get_by_id(order_id)
        if not order or order.user_id != user_id:
            raise NotFoundException("Order not found")

        if order.status != OrderStatus.PENDING:
            raise BadRequestException("Only pending orders can be cancelled")

        # Restore stock
        for item in order.items:
            product = await self.product_repo.lock_for_update(item.product_id)
            if product:
                await self.product_repo.update(
                    product,
                    {"stock_quantity": product.stock_quantity + item.quantity},
                )

        return await self.order_repo.update(
            order,
            {
                "status": OrderStatus.CANCELLED,
                "payment_status": PaymentStatus.REFUNDED
                if order.payment_status == PaymentStatus.PAID
                else PaymentStatus.FAILED,
            },
        )

    # ── Admin Methods ──────────────────────────────────────────────────────

    async def get_all_orders(self, skip: int = 0, limit: int = 20) -> list[Order]:
        return await self.order_repo.get_all(
            skip=skip, limit=limit, order_by=Order.created_at.desc()
        )

    async def count_all_orders(self) -> int:
        return await self.order_repo.count()

    async def update_status(
        self, order_id: UUID, data: OrderStatusUpdateRequest
    ) -> Order:
        order = await self.order_repo.get_by_id(order_id)
        if not order:
            raise NotFoundException("Order not found")

        try:
            new_status = OrderStatus(data.status)
        except ValueError:
            raise BadRequestException(f"Invalid status: {data.status}")

        return await self.order_repo.update(order, {"status": new_status})

    async def get_order_by_razorpay_id(self, razorpay_order_id: str) -> Order | None:
        return await self.order_repo.get_by_razorpay_order_id(razorpay_order_id)
