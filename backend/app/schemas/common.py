from pydantic import BaseModel, ConfigDict


class PaginationParams(BaseModel):
    page: int = 1
    per_page: int = 20

    @property
    def skip(self) -> int:
        return (self.page - 1) * self.per_page

    @property
    def limit(self) -> int:
        return self.per_page


class PaginatedResponse(BaseModel):
    total: int
    page: int
    per_page: int
    total_pages: int
    items: list

    model_config = ConfigDict(from_attributes=True)


class HealthResponse(BaseModel):
    status: str = "ok"
    version: str = "1.0.0"


class MessageResponse(BaseModel):
    message: str
