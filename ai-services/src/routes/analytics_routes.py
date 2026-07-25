from fastapi import APIRouter

router = APIRouter()


@router.get("/analytics/health")
async def analytics_health():
    return {"status": "analytics healthy"}
