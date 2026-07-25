from fastapi import APIRouter
from ..controllers.network_controller import router as network_controller_router

router = APIRouter()
router.include_router(network_controller_router, prefix="/network")
