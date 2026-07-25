from typing import List, Dict, Optional

from .vector_search_service import VectorSearchService
from .llm_service import LLMService


class RAGService:
    def __init__(self):
        self.vector_search = VectorSearchService()
        self.llm_service = LLMService()

    async def retrieve_context(self, query: str) -> List[dict]:
        crimes = await self.vector_search.search(query, top_k=5)
        reranked = await self._rerank_results(query, crimes)
        return reranked

    async def _rerank_results(self, query: str, crimes: List[dict]) -> List[dict]:
        ranked_crimes = []
        for crime in crimes:
            relevance_score = await self._score_relevance(query, crime)
            ranked_crimes.append({
                **crime,
                "relevance_score": relevance_score,
            })
        return sorted(ranked_crimes, key=lambda x: x["relevance_score"], reverse=True)

    async def _score_relevance(self, query: str, crime: dict) -> float:
        prompt = f"Query: {query}\nCrime: {crime.get('title', 'N/A')}\n"
        score_str = await self.llm_service.generate_text(prompt)
        try:
            return float(score_str.strip())
        except ValueError:
            return 0.5

    async def get_conversation(self, conversation_id: str) -> Optional[dict]:
        return {"id": conversation_id, "messages": []}

    async def create_conversation(self) -> dict:
        return {"id": "conv_123"}
