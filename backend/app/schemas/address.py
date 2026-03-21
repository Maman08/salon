from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class AddressResponse(BaseModel):
    id: UUID
    full_name: str
    phone: str
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pincode: str
    is_default: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AddressCreateRequest(BaseModel):
    full_name: str
    phone: str
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pincode: str
    is_default: bool = False


class AddressUpdateRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    is_default: bool | None = None
