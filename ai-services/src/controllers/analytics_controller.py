from fastapi import APIRouter

router = APIRouter()


@router.post("/analyze")
async def analyze_network():
    return {
        "communities": [["A", "B"], ["C"]],
        "key_players": [
            {"id": "A", "name": "Person A", "centrality_score": 0.75},
            {"id": "B", "name": "Person B", "centrality_score": 0.63},
        ],
        "network_density": 0.12,
    }
