from fastapi import APIRouter, HTTPException

from ..schemas.chat_schema import ChatRequest, ChatResponse
from ..services.chat_service import ChatService
from ..services.rag_service import RAGService

router = APIRouter()
chat_service = ChatService()
rag_service = RAGService()


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        crime_context = await rag_service.retrieve_context(request.query)
        response = await chat_service.generate_response(request, crime_context)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    conversation = await rag_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.post("/conversations")
async def create_conversation():
    conversation = await rag_service.create_conversation()
    return {"conversation_id": conversation["id"]}
