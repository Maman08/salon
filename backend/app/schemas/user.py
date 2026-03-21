from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr


class UserResponse(BaseModel):
    id: UUID
    email: str
    full_name: str
    phone: str | None = None
    role: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserUpdateRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str


class AdminUserResponse(UserResponse):
    """Extended user info for admin views."""
    updated_at: datetime


class UserRoleUpdateRequest(BaseModel):
    role: str
