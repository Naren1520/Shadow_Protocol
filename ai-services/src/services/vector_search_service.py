from typing import List, Optional


class VectorSearchService:
    def __init__(self):
        self.crime_metadata = [
            {"title": "Mock FIR 1", "summary": "Sample data for crime 1", "similarity_score": 0.9},
            {"title": "Mock FIR 2", "summary": "Sample data for crime 2", "similarity_score": 0.8},
        ]

    async def search(self, query: str, top_k: int = 5, filters: Optional[dict] = None) -> List[dict]:
        return self.crime_metadata[:top_k]
