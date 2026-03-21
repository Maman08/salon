import math


def paginate(total: int, page: int, per_page: int) -> dict:
    """Build pagination metadata."""
    return {
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": math.ceil(total / per_page) if per_page > 0 else 0,
    }
