from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CategoryCreateRequest(BaseModel):
    name: str
    slug: str
    description: str | None = None
    image_url: str | None = None
    is_active: bool = True


class CategoryUpdateRequest(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    image_url: str | None = None
    is_active: bool | None = None
