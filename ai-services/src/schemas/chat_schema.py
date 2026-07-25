from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    query: str
    conversation_id: str
    language: str = "en"
    include_evidence: bool = True


class ChatResponse(BaseModel):
    response: str
    confidence: float
    evidence: Optional[List[str]] = None
    followup_suggestions: Optional[List[str]] = None
