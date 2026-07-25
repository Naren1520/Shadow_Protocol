from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config.settings import settings
from .routes import chat_routes, analytics_routes, prediction_routes, network_routes
from .middleware.error_handler import setup_error_handlers
from .middleware.logging import setup_logging


@asynccontextmanager
def lifespan(app: FastAPI):
    print("Starting ShadowProtocol AI services...")
    yield
    print("Shutting down ShadowProtocol AI services...")


app = FastAPI(
    title="ShadowProtocol AI Services",
    description="AI/ML services for ShadowProtocol Crime Intelligence Platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_error_handlers(app)
setup_logging(app)

app.include_router(chat_routes.router, prefix="/api/v1", tags=["Chat"])
app.include_router(analytics_routes.router, prefix="/api/v1", tags=["Analytics"])
app.include_router(prediction_routes.router, prefix="/api/v1", tags=["Predictions"])
app.include_router(network_routes.router, prefix="/api/v1", tags=["Network"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ShadowProtocol AI Services", "version": "0.1.0"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "src.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.DEBUG,
    )
