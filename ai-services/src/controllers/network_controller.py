from fastapi import APIRouter

router = APIRouter()


@router.post("/analyze")
async def analyze_network():
    return {
        "communities": [["A", "B"], ["C"]],
        "key_players": [{"id": "A", "name": "Person A", "centrality_score": 0.75}],
        "network_density": 0.12,
    }
