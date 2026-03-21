# Grenix Backend — Architecture Document

> **Stack**: FastAPI · SQLAlchemy 2.0 (async) · PostgreSQL · MinIO (local) / S3 (prod) · Razorpay · Docker Compose  
> **No caching layer** — all reads hit the database directly.

---

## 1. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | FastAPI 0.115+ |
| ORM | SQLAlchemy 2.0 async (asyncpg) |
| Migrations | Alembic (async) |
| Validation | Pydantic v2 |
| Auth | JWT (access + refresh tokens), passlib[bcrypt] |
| Payments | Razorpay Python SDK |
| Object Storage | MinIO (local) / AWS S3 (production) — via `boto3` |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| Testing | pytest + pytest-asyncio + httpx |

---

## 2. Project Structure

```
backend/
├── alembic/                    # DB migrations
│   ├── versions/
│   ├── env.py
│   └── alembic.ini
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app factory
│   ├── config.py               # Pydantic Settings (env vars)
│   ├── database.py             # Async engine, sessionmaker, get_db dependency
│   ├── exceptions.py           # Custom exception classes
│   ├── dependencies.py         # Shared dependencies (get_current_user, etc.)
│   │
│   ├── models/                 # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── base.py             # DeclarativeBase + mixins (id, timestamps)
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── review.py
│   │   ├── wishlist.py
│   │   └── address.py
│   │
│   ├── schemas/                # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── review.py
│   │   ├── wishlist.py
│   │   ├── address.py
│   │   └── common.py           # Pagination, health, etc.
│   │
│   ├── repositories/           # Data access layer (DB queries)
│   │   ├── __init__.py
│   │   ├── base.py             # GenericRepository[T]
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── review.py
│   │   ├── wishlist.py
│   │   └── address.py
│   │
│   ├── services/               # Business logic layer
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── category.py
│   │   ├── cart.py
│   │   ├── order.py
│   │   ├── payment.py
│   │   ├── review.py
│   │   ├── wishlist.py
│   │   ├── address.py
│   │   └── storage.py          # S3/MinIO file upload service
│   │
│   ├── api/                    # API route layer
│   │   ├── __init__.py
│   │   ├── router.py           # Master router (includes all sub-routers)
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── products.py
│   │   │   ├── categories.py
│   │   │   ├── cart.py
│   │   │   ├── orders.py
│   │   │   ├── payments.py
│   │   │   ├── reviews.py
│   │   │   ├── wishlist.py
│   │   │   ├── addresses.py
│   │   │   └── admin/
│   │   │       ├── __init__.py
│   │   │       ├── products.py
│   │   │       ├── orders.py
│   │   │       ├── categories.py
│   │   │       └── users.py
│   │   └── deps.py             # Route-level dependencies
│   │
│   └── utils/
│       ├── __init__.py
│       ├── security.py         # JWT encode/decode, password hashing
│       └── pagination.py       # Pagination helper
│
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_products.py
│   └── ...
│
├── docker-compose.yml          # PostgreSQL + MinIO + Backend
├── Dockerfile
├── requirements.txt
├── .env.example
└── ARCHITECTURE.md             # This file
```

---

## 3. Design Patterns

### 3-Layer Architecture
```
HTTP Request
    ↓
┌─────────────┐
│  API Routes  │  ← Thin controllers: validate input, call service, return response
└──────┬──────┘
       ↓
┌─────────────┐
│  Services    │  ← Business logic, orchestration, transaction boundaries
└──────┬──────┘
       ↓
┌──────────────┐
│ Repositories │  ← Pure data access, SQL queries, no business logic
└──────┬───────┘
       ↓
   PostgreSQL
```

### Generic Repository Pattern
```python
class BaseRepository(Generic[ModelType]):
    def __init__(self, model: type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def get_by_id(self, id: UUID) -> ModelType | None
    async def get_all(self, skip: int, limit: int) -> list[ModelType]
    async def create(self, obj_in: dict) -> ModelType
    async def update(self, id: UUID, obj_in: dict) -> ModelType | None
    async def delete(self, id: UUID) -> bool
```

### Dependency Injection Flow
```python
# database.py → provides AsyncSession via get_db()
# dependencies.py → provides get_current_user(token, db)
# Route handler receives both via Depends()
```

---

## 4. Database Schema (ERD)

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid4 |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| hashed_password | VARCHAR(255) | NOT NULL |
| full_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | NULLABLE |
| role | ENUM(customer, admin) | DEFAULT customer |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | DEFAULT now() |
| updated_at | TIMESTAMP | ON UPDATE now() |

### categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| description | TEXT | NULLABLE |
| image_url | VARCHAR(500) | NULLABLE |
| is_active | BOOLEAN | DEFAULT true |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### products
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(255) | NOT NULL |
| slug | VARCHAR(255) | UNIQUE, NOT NULL |
| description | TEXT | |
| short_description | VARCHAR(500) | |
| price | DECIMAL(10,2) | NOT NULL |
| compare_at_price | DECIMAL(10,2) | NULLABLE (strikethrough price) |
| sku | VARCHAR(50) | UNIQUE |
| stock_quantity | INTEGER | DEFAULT 0 |
| category_id | UUID | FK → categories.id |
| is_active | BOOLEAN | DEFAULT true |
| is_featured | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### product_images
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| product_id | UUID | FK → products.id (CASCADE) |
| url | VARCHAR(500) | NOT NULL |
| alt_text | VARCHAR(255) | |
| is_primary | BOOLEAN | DEFAULT false |
| sort_order | INTEGER | DEFAULT 0 |

### addresses
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| full_name | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(20) | NOT NULL |
| address_line1 | VARCHAR(255) | NOT NULL |
| address_line2 | VARCHAR(255) | |
| city | VARCHAR(100) | NOT NULL |
| state | VARCHAR(100) | NOT NULL |
| pincode | VARCHAR(10) | NOT NULL |
| is_default | BOOLEAN | DEFAULT false |

### cart_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| quantity | INTEGER | NOT NULL, CHECK > 0 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| | | UNIQUE(user_id, product_id) |

### orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_number | VARCHAR(20) | UNIQUE, auto-generated |
| user_id | UUID | FK → users.id |
| status | ENUM | pending / confirmed / processing / shipped / delivered / cancelled |
| payment_status | ENUM | pending / paid / failed / refunded |
| subtotal | DECIMAL(10,2) | |
| shipping_fee | DECIMAL(10,2) | DEFAULT 0 |
| total | DECIMAL(10,2) | |
| shipping_address | JSONB | Snapshot of address at order time |
| razorpay_order_id | VARCHAR(100) | |
| razorpay_payment_id | VARCHAR(100) | |
| notes | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### order_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| order_id | UUID | FK → orders.id (CASCADE) |
| product_id | UUID | FK → products.id |
| product_name | VARCHAR(255) | Snapshot |
| product_image | VARCHAR(500) | Snapshot |
| quantity | INTEGER | |
| unit_price | DECIMAL(10,2) | |
| total_price | DECIMAL(10,2) | |

### reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| rating | INTEGER | CHECK 1–5 |
| title | VARCHAR(255) | |
| comment | TEXT | |
| is_verified | BOOLEAN | DEFAULT false (bought product?) |
| created_at | TIMESTAMP | |
| | | UNIQUE(user_id, product_id) |

### wishlists
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| product_id | UUID | FK → products.id |
| created_at | TIMESTAMP | |
| | | UNIQUE(user_id, product_id) |

---

## 5. API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login → access + refresh tokens |
| POST | `/refresh` | Refresh access token |
| POST | `/logout` | Invalidate refresh token |

### Users (`/api/v1/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/me` | Get current user profile |
| PUT | `/me` | Update profile |
| PUT | `/me/password` | Change password |

### Products (`/api/v1/products`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List products (paginated, filterable) |
| GET | `/{slug}` | Get product by slug |
| GET | `/featured` | Get featured products |
| GET | `/category/{slug}` | Get products by category |

### Categories (`/api/v1/categories`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all active categories |
| GET | `/{slug}` | Get category detail |

### Cart (`/api/v1/cart`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's cart |
| POST | `/items` | Add item to cart |
| PUT | `/items/{id}` | Update cart item quantity |
| DELETE | `/items/{id}` | Remove item from cart |
| DELETE | `/` | Clear entire cart |

### Orders (`/api/v1/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create order (from cart) |
| GET | `/` | List user's orders |
| GET | `/{id}` | Get order detail |
| PUT | `/{id}/cancel` | Cancel order (if pending) |

### Payments (`/api/v1/payments`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create` | Create Razorpay order |
| POST | `/verify` | Verify Razorpay payment signature |

### Reviews (`/api/v1/reviews`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/product/{product_id}` | Get reviews for a product |
| POST | `/` | Create review |
| PUT | `/{id}` | Update own review |
| DELETE | `/{id}` | Delete own review |

### Wishlist (`/api/v1/wishlist`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's wishlist |
| POST | `/{product_id}` | Add to wishlist |
| DELETE | `/{product_id}` | Remove from wishlist |

### Addresses (`/api/v1/addresses`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user addresses |
| POST | `/` | Create address |
| PUT | `/{id}` | Update address |
| DELETE | `/{id}` | Delete address |
| PUT | `/{id}/default` | Set as default |

### Admin (`/api/v1/admin`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | List all products (inc. inactive) |
| POST | `/products` | Create product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Soft-delete product |
| POST | `/products/{id}/images` | Upload product image |
| DELETE | `/products/images/{id}` | Delete product image |
| GET | `/orders` | List all orders |
| PUT | `/orders/{id}/status` | Update order status |
| GET | `/categories` | List all categories |
| POST | `/categories` | Create category |
| PUT | `/categories/{id}` | Update category |
| DELETE | `/categories/{id}` | Delete category |
| GET | `/users` | List all users |
| PUT | `/users/{id}/role` | Change user role |

---

## 6. Race Condition Prevention

### Checkout Flow (stock deduction)
```sql
-- Inside a single transaction:
BEGIN;
SELECT stock_quantity FROM products WHERE id = $1 FOR UPDATE;
-- Python checks: if stock < requested → raise error
UPDATE products SET stock_quantity = stock_quantity - $qty WHERE id = $1;
INSERT INTO orders ...;
INSERT INTO order_items ...;
DELETE FROM cart_items WHERE user_id = $uid;
COMMIT;
```
- `FOR UPDATE` locks the row until COMMIT — no other transaction can read/modify it.
- Service layer wraps entire checkout in one `async with db.begin()` block.

---

## 7. Session Management

```python
# database.py
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```
- Session is **scoped to a single request** via FastAPI's `Depends(get_db)`.
- Auto-commit on success, auto-rollback on exception.
- No leaked sessions.

---

## 8. Error Handling

```python
# Custom exceptions
class AppException(Exception):
    def __init__(self, status_code: int, detail: str, error_code: str):
        self.status_code = status_code
        self.detail = detail
        self.error_code = error_code

class NotFoundException(AppException): ...
class BadRequestException(AppException): ...
class UnauthorizedException(AppException): ...
class ForbiddenException(AppException): ...
class ConflictException(AppException): ...

# Registered as exception handler in main.py
@app.exception_handler(AppException)
async def app_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.error_code, "detail": exc.detail}
    )
```

---

## 9. Object Storage (S3 / MinIO)

| Environment | Service | Endpoint |
|-------------|---------|----------|
| Local (Docker) | MinIO | `http://minio:9000` |
| Production | AWS S3 | `https://s3.amazonaws.com` |

Both use the same `boto3` client — only the endpoint URL and credentials change (via env vars).

```python
# storage.py uses:
S3_ENDPOINT_URL=http://minio:9000   # local
S3_ENDPOINT_URL=                     # prod (boto3 defaults to AWS)
S3_ACCESS_KEY=minioadmin             # local
S3_SECRET_KEY=minioadmin             # local
S3_BUCKET_NAME=grenix-media
```

---

## 10. Docker Compose Services

| Service | Image | Port |
|---------|-------|------|
| `db` | postgres:16-alpine | 5432 |
| `minio` | minio/minio:latest | 9000 (API), 9001 (Console) |
| `createbuckets` | minio/mc | — (init job) |
| `backend` | ./Dockerfile | 8000 |

---

## 11. Environment Variables

```env
# Database
DATABASE_URL=postgresql+asyncpg://grenix:grenix@db:5432/grenix

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# S3 / MinIO
S3_ENDPOINT_URL=http://minio:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET_NAME=grenix-media
S3_REGION=ap-south-1

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# App
APP_ENV=development
APP_DEBUG=true
CORS_ORIGINS=http://localhost:3000
```

---

## 12. Implementation Order

1. `docker-compose.yml` + `Dockerfile` + `.env.example`
2. `config.py` → `database.py` → `exceptions.py`
3. `models/` (all ORM models)
4. Alembic setup + initial migration
5. `repositories/base.py` → specific repos
6. `schemas/` (all Pydantic schemas)
7. `utils/security.py` → `utils/pagination.py`
8. `services/` (all business logic)
9. `api/v1/` (all route handlers)
10. `services/storage.py` (S3/MinIO uploads)
11. `main.py` (wire everything together)
