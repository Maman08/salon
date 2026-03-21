from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router, admin_router
from app.config import get_settings
from app.database import engine
from app.exceptions import AppException, app_exception_handler

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup — nothing needed (engine is lazy)
    yield
    # Shutdown — dispose connection pool
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title="Grenix API",
        description="Backend API for Grenix — Premium Beauty E-commerce",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    app.add_exception_handler(AppException, app_exception_handler)

    # Routes
    app.include_router(api_router)
    app.include_router(admin_router)

    # Health check
    @app.get("/health")
    async def health():
        return {"status": "ok", "version": "1.0.0"}

    return app


app = create_app()
