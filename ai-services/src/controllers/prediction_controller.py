from fastapi import APIRouter

router = APIRouter()


@router.post("/crime-risk")
async def predict_crime_risk():
    return {"risk_score": 0.42, "risk_level": "MEDIUM", "confidence": 0.8}
