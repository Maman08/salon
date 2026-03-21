from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.exceptions import BadRequestException, NotFoundException
from app.models.product import Product
from app.repositories.product import ProductRepository, ProductImageRepository
from app.schemas.product import (
    ProductCreateRequest,
    ProductListResponse,
    ProductUpdateRequest,
)


class ProductService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.product_repo = ProductRepository(db)
        self.image_repo = ProductImageRepository(db)

    async def get_products(
        self,
        skip: int = 0,
        limit: int = 20,
        category_slug: str | None = None,
        search: str | None = None,
        is_active: bool = True,
    ) -> list[Product]:
        filters = []
        if is_active:
            filters.append(Product.is_active == True)
        if search:
            filters.append(Product.name.ilike(f"%{search}%"))
        return await self.product_repo.get_all(
            skip=skip,
            limit=limit,
            filters=filters if filters else None,
            order_by=Product.created_at.desc(),
        )

    async def count_products(
        self,
        is_active: bool = True,
        search: str | None = None,
    ) -> int:
        filters = []
        if is_active:
            filters.append(Product.is_active == True)
        if search:
            filters.append(Product.name.ilike(f"%{search}%"))
        return await self.product_repo.count(filters=filters if filters else None)

    async def get_by_slug(self, slug: str) -> Product:
        product = await self.product_repo.get_by_slug(slug)
        if not product:
            raise NotFoundException(f"Product '{slug}' not found")
        return product

    async def get_by_id(self, product_id: UUID) -> Product:
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product not found")
        return product

    async def get_featured(self, limit: int = 10) -> list[Product]:
        return await self.product_repo.get_featured(limit=limit)

    async def get_by_category(
        self, category_id: UUID, skip: int = 0, limit: int = 20
    ) -> list[Product]:
        return await self.product_repo.get_by_category(
            category_id=category_id, skip=skip, limit=limit
        )

    # ── Admin Methods ──────────────────────────────────────────────────────

    async def create(self, data: ProductCreateRequest) -> Product:
        return await self.product_repo.create(data.model_dump())

    async def update(
        self, product_id: UUID, data: ProductUpdateRequest
    ) -> Product:
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product not found")
        update_data = data.model_dump(exclude_unset=True)
        return await self.product_repo.update(product, update_data)

    async def delete(self, product_id: UUID) -> None:
        """Soft-delete a product by setting is_active = False."""
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product not found")
        await self.product_repo.update(product, {"is_active": False})

    async def add_image(
        self, product_id: UUID, url: str, alt_text: str | None = None, is_primary: bool = False
    ):
        product = await self.product_repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product not found")

        # If setting as primary, unset existing primaries
        if is_primary:
            existing_images = await self.image_repo.get_by_product(product_id)
            for img in existing_images:
                if img.is_primary:
                    await self.image_repo.update(img, {"is_primary": False})

        sort_order = len(await self.image_repo.get_by_product(product_id))
        return await self.image_repo.create(
            {
                "product_id": product_id,
                "url": url,
                "alt_text": alt_text,
                "is_primary": is_primary,
                "sort_order": sort_order,
            }
        )

    async def delete_image(self, image_id: UUID) -> None:
        image = await self.image_repo.get_by_id(image_id)
        if not image:
            raise NotFoundException("Image not found")
        await self.image_repo.delete(image)
