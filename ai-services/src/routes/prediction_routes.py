from fastapi import APIRouter
from ..controllers.prediction_controller import router as prediction_controller_router

router = APIRouter()
router.include_router(prediction_controller_router, prefix="/predictions")
