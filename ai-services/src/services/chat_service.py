import logging
from typing import Optional, List

from ..schemas.chat_schema import ChatRequest, ChatResponse
from .rag_service import RAGService

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(self):
        self.rag_service = RAGService()

    async def generate_response(
        self,
        request: ChatRequest,
        crime_context: Optional[List[dict]] = None,
    ) -> ChatResponse:
        if crime_context is None:
            crime_context = []

        logger.info("Generating chat response for query: %s", request.query)

        response_text = (
            f"Investigative assistant: '{request.query}'. "
            f"Found {len(crime_context)} related documents for your query."
        )
        evidence = [
            f"{item.get('title', 'Case')} - {item.get('summary', 'No summary available')}"
            for item in crime_context[:3]
        ]
        followups = [
            "What evidence supports the main hypothesis?",
            "Which suspects are most likely involved?",
            "What should investigators do next?",
        ]

        return ChatResponse(
            response=response_text,
            confidence=0.82,
            evidence=evidence,
            followup_suggestions=followups,
        )
