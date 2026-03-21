from uuid import UUID

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.user import User
from app.schemas.common import MessageResponse
from app.schemas.product import (
    ProductCreateRequest,
    ProductResponse,
    ProductUpdateRequest,
)
from app.services.product import ProductService
from app.services.storage import get_storage_service, StorageService
from app.utils.pagination import paginate

router = APIRouter(prefix="/products", tags=["Admin - Products"])


@router.get("/", response_model=dict)
async def list_all_products(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    search: str | None = Query(None),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    skip = (page - 1) * per_page
    products = await service.get_products(
        skip=skip, limit=per_page, search=search, is_active=False  # Show all
    )
    total = await service.count_products(is_active=False, search=search)
    serialized = [ProductResponse.model_validate(p).model_dump() for p in products]
    return {**paginate(total, page, per_page), "items": serialized}


@router.post("/", response_model=ProductResponse, status_code=201)
async def create_product(
    data: ProductCreateRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    return await service.create(data)


@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    data: ProductUpdateRequest,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    return await service.update(product_id, data)


@router.delete("/{product_id}", response_model=MessageResponse)
async def delete_product(
    product_id: UUID,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    await service.delete(product_id)
    return MessageResponse(message="Product deactivated")


@router.post("/{product_id}/images", status_code=201)
async def upload_product_image(
    product_id: UUID,
    file: UploadFile = File(...),
    is_primary: bool = Query(False),
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    storage: StorageService = get_storage_service()
    contents = await file.read()
    url = storage.upload_file(
        file_content=contents,
        filename=file.filename or "image.jpg",
        content_type=file.content_type or "image/jpeg",
        folder="products",
    )

    service = ProductService(db)
    image = await service.add_image(
        product_id=product_id,
        url=url,
        alt_text=file.filename,
        is_primary=is_primary,
    )
    return {"id": str(image.id), "url": url}


@router.delete("/images/{image_id}", response_model=MessageResponse)
async def delete_product_image(
    image_id: UUID,
    admin: User = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    service = ProductService(db)
    await service.delete_image(image_id)
    return MessageResponse(message="Image deleted")
