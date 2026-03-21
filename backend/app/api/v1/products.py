from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.product import ProductListResponse, ProductResponse
from app.services.product import ProductService
from app.services.category import CategoryService
from app.utils.pagination import paginate

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=dict)
async def list_products(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    skip = (page - 1) * per_page
    products = await service.get_products(skip=skip, limit=per_page, search=search)
    total = await service.count_products(search=search)

    # Build lightweight response
    items = []
    for p in products:
        primary_image = None
        if p.images:
            primary = next((img for img in p.images if img.is_primary), None)
            primary_image = primary.url if primary else p.images[0].url
        items.append(
            ProductListResponse(
                id=p.id,
                name=p.name,
                slug=p.slug,
                short_description=p.short_description,
                price=float(p.price),
                compare_at_price=float(p.compare_at_price) if p.compare_at_price else None,
                stock_quantity=p.stock_quantity,
                is_featured=p.is_featured,
                primary_image=primary_image,
                category_id=p.category_id,
            )
        )

    return {**paginate(total, page, per_page), "items": items}


@router.get("/featured", response_model=list[ProductResponse])
async def get_featured_products(
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    return await service.get_featured(limit=limit)


@router.get("/category/{slug}", response_model=dict)
async def get_products_by_category(
    slug: str,
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    cat_service = CategoryService(db)
    category = await cat_service.get_by_slug(slug)

    product_service = ProductService(db)
    skip = (page - 1) * per_page
    products = await product_service.get_by_category(
        category_id=category.id, skip=skip, limit=per_page
    )
    total = await product_service.count_products()  # simplified

    items = []
    for p in products:
        primary_image = None
        if p.images:
            primary = next((img for img in p.images if img.is_primary), None)
            primary_image = primary.url if primary else p.images[0].url
        items.append(
            ProductListResponse(
                id=p.id,
                name=p.name,
                slug=p.slug,
                short_description=p.short_description,
                price=float(p.price),
                compare_at_price=float(p.compare_at_price) if p.compare_at_price else None,
                stock_quantity=p.stock_quantity,
                is_featured=p.is_featured,
                primary_image=primary_image,
                category_id=p.category_id,
            )
        )

    return {**paginate(total, page, per_page), "items": items}


@router.get("/{slug}", response_model=ProductResponse)
async def get_product_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    return await service.get_by_slug(slug)
