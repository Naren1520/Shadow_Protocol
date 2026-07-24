# ShadowProtocol - AI/ML Services Architecture & LLM Integration

## Executive Summary

Enterprise-grade AI services for Crime Intelligence Platform using **Python 3.11+**, **FastAPI**, **LangChain**, **FAISS**, and **Machine Learning models**. Complete guide for implementing conversational AI, predictive analytics, and criminal network analysis.

---

## 1. AI/ML TECH STACK

### Core Runtime & Framework
```
Python 3.11+          # ML runtime
FastAPI 0.104+        # High-performance API
Pydantic 2.x          # Data validation
```

### Natural Language Processing
```
LangChain 0.1.x+      # LLM orchestration
Sentence Transformers # Dense embeddings
NLTK                  # Text processing
SpaCy                 # NER, POS tagging
```

### Vector Search & Embeddings
```
FAISS                 # Vector similarity search
Pinecone (Optional)   # Managed vector DB
Weaviate (Optional)   # GraphQL vector search
ChromaDB (Optional)   # Lightweight vector DB
```

### Machine Learning
```
Scikit-Learn 1.3+     # ML algorithms
XGBoost               # Gradient boosting
LightGBM              # Fast GBDT
TensorFlow 2.x        # Deep learning
PyTorch               # Deep learning
```

### Data Processing
```
Pandas 2.x            # Data manipulation
NumPy                 # Numerical computing
Polars (Alternative)  # Fast data processing
```

### Async & Concurrency
```
asyncio               # Async runtime
Celery OR Apache Airflow # Task scheduling
```

### Monitoring & Logging
```
Prometheus            # Metrics
Structured Logging    # JSON logs
```

---

## 2. AI/ML SERVICES FOLDER STRUCTURE

```
shadowprotocol-ai-services/
│
├── src/
│   ├── main.py                           # FastAPI app entry
│   ├── config/
│   │   ├── settings.py                   # Configuration
│   │   ├── llm_config.py                 # LLM settings
│   │   └── vector_db_config.py           # Vector DB settings
│   │
│   ├── models/
│   │   ├── llm_models/
│   │   │   ├── openai.py                 # OpenAI integration
│   │   │   ├── llama.py                  # Local LLM (Llama2)
│   │   │   ├── huggingface.py            # HF models
│   │   │   └── azure_openai.py           # Azure OpenAI
│   │   │
│   │   ├── embeddings/
│   │   │   ├── sentence_transformer.py   # Dense embeddings
│   │   │   └── openai_embeddings.py      # OpenAI embeddings
│   │   │
│   │   ├── ml_models/
│   │   │   ├── crime_classifier.pkl      # Crime classification
│   │   │   ├── risk_predictor.pkl        # Risk prediction
│   │   │   ├── repeat_offender_model.pkl # Repeat offender detection
│   │   │   └── anomaly_detector.pkl      # Anomaly detection
│   │   │
│   │   └── __init__.py
│   │
│   ├── services/
│   │   ├── llm_service.py                # LLM orchestration
│   │   ├── embedding_service.py          # Embedding generation
│   │   ├── vector_search_service.py      # Vector similarity search
│   │   ├── crime_prediction_service.py   # Crime prediction
│   │   ├── network_analysis_service.py   # Network analysis
│   │   ├── chat_service.py               # Conversational AI
│   │   ├── rag_service.py                # RAG pipeline
│   │   ├── explainability_service.py     # Explainable AI
│   │   └── __init__.py
│   │
│   ├── controllers/
│   │   ├── chat_controller.py            # Chat endpoints
│   │   ├── analytics_controller.py       # Analytics endpoints
│   │   ├── prediction_controller.py      # Prediction endpoints
│   │   ├── network_controller.py         # Network analysis endpoints
│   │   └── __init__.py
│   │
│   ├── routes/
│   │   ├── chat_routes.py
│   │   ├── analytics_routes.py
│   │   ├── prediction_routes.py
│   │   ├── network_routes.py
│   │   └── health_routes.py
│   │
│   ├── database/
│   │   ├── vector_db.py                  # Vector DB client
│   │   ├── cache.py                      # Caching layer
│   │   └── __init__.py
│   │
│   ├── schemas/
│   │   ├── chat_schema.py                # Chat request/response
│   │   ├── prediction_schema.py          # Prediction schemas
│   │   ├── analytics_schema.py           # Analytics schemas
│   │   └── __init__.py
│   │
│   ├── middleware/
│   │   ├── error_handler.py              # Error handling
│   │   ├── logging.py                    # Request logging
│   │   ├── rate_limiter.py               # Rate limiting
│   │   └── __init__.py
│   │
│   ├── utils/
│   │   ├── text_processing.py            # Text cleaning
│   │   ├── prompt_templates.py           # LLM prompts
│   │   ├── validators.py                 # Input validation
│   │   ├── constants.py                  # Constants
│   │   ├── logger.py                     # Logging setup
│   │   └── __init__.py
│   │
│   └── __init__.py
│
├── notebooks/
│   ├── model_training.ipynb              # Model training
│   ├── embeddings_exploration.ipynb      # Embedding exploration
│   ├── crime_analysis.ipynb              # Crime analysis
│   └── network_analysis.ipynb            # Network analysis
│
├── data/
│   ├── training/
│   │   ├── crimes_labeled.csv            # Training data
│   │   └── criminal_network.json         # Network data
│   ├── models/
│   │   └── [trained models]
│   └── processed/
│       └── [processed data]
│
├── tests/
│   ├── unit/
│   │   ├── test_llm_service.py
│   │   ├── test_embedding_service.py
│   │   └── test_prediction_service.py
│   ├── integration/
│   │   └── test_chat_flow.py
│   └── e2e/
│       └── test_full_pipeline.py
│
├── docker/
│   ├── Dockerfile
│   └── requirements.txt
│
├── scripts/
│   ├── train_models.py                   # Model training script
│   ├── prepare_embeddings.py             # Embedding generation
│   ├── load_vector_db.py                 # Vector DB population
│   └── evaluate_models.py                # Model evaluation
│
├── .env.local
├── .env.example
├── .env.production
├── pyproject.toml
├── poetry.lock
├── requirements.txt
├── Makefile
└── README.md
```

---

## 3. FASTAPI APP SETUP

```python
# src/main.py
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from config.settings import settings
from routes import chat_routes, analytics_routes, prediction_routes, network_routes
from middleware.error_handler import setup_error_handlers
from middleware.logging import setup_logging
from utils.logger import logger

# Lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting AI services...")
    # Initialize embeddings, vector DB, models
    yield
    # Shutdown
    logger.info("Shutting down AI services...")
    # Cleanup resources

app = FastAPI(
    title="ShadowProtocol Services",
    description="Crime Intelligence Platform AI Services",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup error handlers
setup_error_handlers(app)

# Setup logging
setup_logging(app)

# Include routes
app.include_router(chat_routes.router, prefix="/api/v1", tags=["Chat"])
app.include_router(analytics_routes.router, prefix="/api/v1", tags=["Analytics"])
app.include_router(prediction_routes.router, prefix="/api/v1", tags=["Predictions"])
app.include_router(network_routes.router, prefix="/api/v1", tags=["Network"])

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ShadowProtocol Services",
        "version": "1.0.0",
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3002,
        reload=settings.DEBUG,
        workers=4 if not settings.DEBUG else 1,
    )
```

---

## 4. CONVERSATIONAL AI - CHAT SERVICE

```python
# src/services/chat_service.py
from typing import Optional, List
from pydantic import BaseModel
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from langchain.callbacks import StreamingStdOutCallbackHandler
import logging

logger = logging.getLogger(__name__)

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    query: str
    conversation_id: str
    language: str = "en"  # "en" or "kn"
    include_evidence: bool = True

class ChatResponse(BaseModel):
    response: str
    confidence: float
    evidence: Optional[List[str]] = None
    followup_suggestions: Optional[List[str]] = None

class ChatService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name="gpt-4",
            temperature=0.3,  # Lower for factual responses
            streaming=True,
            callbacks=[StreamingStdOutCallbackHandler()],
        )
        self.memory = ConversationBufferMemory(
            human_prefix="Officer",
            ai_prefix="AI Assistant",
        )

    async def generate_response(
        self,
        request: ChatRequest,
        crime_context: Optional[List[dict]] = None,
    ) -> ChatResponse:
        """
        Generate response using RAG + LLM
        """
        try:
            # Augment with retrieved context
            context = self._retrieve_context(request.query, crime_context)

            # Build system prompt
            system_prompt = self._build_system_prompt(request.language, context)

            # Generate response
            response = await self._query_llm(system_prompt, request.query)

            # Extract evidence from context
            evidence = self._extract_evidence(context)

            # Generate follow-up suggestions
            followups = await self._generate_followups(request.query, response)

            return ChatResponse(
                response=response,
                confidence=self._calculate_confidence(context),
                evidence=evidence,
                followup_suggestions=followups,
            )

        except Exception as e:
            logger.error(f"Chat generation failed: {e}")
            raise

    def _retrieve_context(
        self,
        query: str,
        crime_context: Optional[List[dict]],
    ) -> List[dict]:
        """
        Retrieve relevant context from vector DB
        """
        # Use FAISS to find similar crimes
        from services.vector_search_service import vector_search_service
        
        similar_crimes = vector_search_service.search(
            query,
            top_k=5,
            filters={"status": "CLOSED"}  # Only closed cases
        )
        
        return similar_crimes

    def _build_system_prompt(self, language: str, context: List[dict]) -> str:
        """
        Build system prompt with context
        """
        from utils.prompt_templates import SYSTEM_PROMPTS

        template = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS["en"])

        context_str = "\n".join([
            f"- {crime['title']}: {crime['summary']}"
            for crime in context
        ])

        return template.format(context=context_str)

    async def _query_llm(self, system_prompt: str, user_query: str) -> str:
        """
        Query LLM with system prompt and user input
        """
        from langchain.schema import SystemMessage, HumanMessage

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_query),
        ]

        response = await self.llm.apredict_messages(messages)
        return response.content

    def _extract_evidence(self, context: List[dict]) -> List[str]:
        """
        Extract evidence records that support the response
        """
        evidence = []
        for item in context:
            evidence.append(f"Case {item['case_number']}: {item['title']}")
        return evidence

    async def _generate_followups(
        self,
        query: str,
        response: str,
    ) -> List[str]:
        """
        Generate follow-up questions
        """
        followup_prompt = f"""
        Based on this query: "{query}"
        And this response: "{response}"
        Generate 3 relevant follow-up questions an investigator might ask.
        Return only the questions, one per line.
        """

        followups = await self._query_llm(
            "You are a helpful assistant for crime investigators.",
            followup_prompt
        )

        return [q.strip() for q in followups.split("\n") if q.strip()]

    def _calculate_confidence(self, context: List[dict]) -> float:
        """
        Calculate confidence score based on context
        """
        if not context:
            return 0.3  # Low confidence if no context

        # Average similarity scores
        scores = [item.get("similarity_score", 0) for item in context]
        return min(sum(scores) / len(scores), 1.0)
```

### Chat Routes
```python
# src/routes/chat_routes.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List
import logging

from services.chat_service import ChatService, ChatRequest, ChatResponse
from services.rag_service import RAGService
from schemas.chat_schema import ConversationSchema

logger = logging.getLogger(__name__)

router = APIRouter()
chat_service = ChatService()
rag_service = RAGService()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Conversational query endpoint
    """
    try:
        # Retrieve crime context
        crime_context = await rag_service.retrieve_context(request.query)

        # Generate response
        response = await chat_service.generate_response(request, crime_context)

        return response

    except Exception as e:
        logger.error(f"Chat endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/conversations/{conversation_id}")
async def get_conversation(conversation_id: str):
    """
    Get conversation history
    """
    try:
        # Retrieve from DB
        conversation = await rag_service.get_conversation(conversation_id)
        return conversation
    except Exception as e:
        raise HTTPException(status_code=404, detail="Conversation not found")

@router.post("/conversations")
async def create_conversation():
    """
    Create new conversation
    """
    conversation = await rag_service.create_conversation()
    return {"conversation_id": conversation.id}
```

---

## 5. VECTOR SEARCH & RAG

```python
# src/services/vector_search_service.py
import faiss
import numpy as np
from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class VectorSearchService:
    def __init__(self, embedding_service, vector_db_path: str):
        self.embedding_service = embedding_service
        self.index = faiss.read_index(vector_db_path)
        self.crime_metadata = {}  # Map index to crime records

    async def search(
        self,
        query: str,
        top_k: int = 5,
        filters: Optional[dict] = None,
    ) -> List[dict]:
        """
        Vector similarity search for crimes
        """
        try:
            # Generate query embedding
            query_embedding = await self.embedding_service.embed_text(query)
            query_vector = np.array([query_embedding]).astype('float32')

            # Search FAISS index
            distances, indices = self.index.search(query_vector, top_k * 2)

            # Retrieve metadata and apply filters
            results = []
            for idx, distance in zip(indices[0], distances[0]):
                crime = self.crime_metadata.get(idx)
                if crime and self._passes_filters(crime, filters):
                    results.append({
                        **crime,
                        "similarity_score": 1 / (1 + distance),
                    })
                    if len(results) >= top_k:
                        break

            logger.info(f"Found {len(results)} similar crimes for query")
            return results

        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            return []

    def _passes_filters(self, crime: dict, filters: Optional[dict]) -> bool:
        """
        Check if crime passes filter criteria
        """
        if not filters:
            return True

        for key, value in filters.items():
            if crime.get(key) != value:
                return False
        return True

# src/services/rag_service.py
from typing import List
import logging

logger = logging.getLogger(__name__)

class RAGService:
    """
    Retrieval Augmented Generation (RAG) service
    """
    def __init__(self, vector_search_service, llm_service):
        self.vector_search = vector_search_service
        self.llm = llm_service

    async def retrieve_context(self, query: str) -> List[dict]:
        """
        Retrieve relevant context for query
        """
        # Vector search for similar crimes
        crimes = await self.vector_search.search(query, top_k=5)

        # Rerank using LLM
        reranked = await self._rerank_results(query, crimes)

        return reranked

    async def _rerank_results(
        self,
        query: str,
        crimes: List[dict],
    ) -> List[dict]:
        """
        Rerank results using LLM relevance scoring
        """
        ranked_crimes = []
        for crime in crimes:
            relevance_score = await self._score_relevance(query, crime)
            ranked_crimes.append({
                **crime,
                "relevance_score": relevance_score,
            })

        # Sort by relevance score
        return sorted(ranked_crimes, key=lambda x: x["relevance_score"], reverse=True)

    async def _score_relevance(self, query: str, crime: dict) -> float:
        """
        Score relevance of crime to query
        """
        # Use LLM to score
        prompt = f"""
        Query: {query}
        Crime: {crime['title']} - {crime['description']}
        
        Rate relevance on scale 0-1. Return only the number.
        """

        score_str = await self.llm.generate_text(prompt)
        try:
            return float(score_str.strip())
        except:
            return 0.5
```

---

## 6. CRIME PREDICTION SERVICE

```python
# src/services/crime_prediction_service.py
import pickle
import numpy as np
from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

class CrimePredictionService:
    def __init__(self):
        # Load pre-trained models
        with open("data/models/crime_classifier.pkl", "rb") as f:
            self.crime_classifier = pickle.load(f)

        with open("data/models/risk_predictor.pkl", "rb") as f:
            self.risk_predictor = pickle.load(f)

        with open("data/models/repeat_offender_model.pkl", "rb") as f:
            self.repeat_offender_model = pickle.load(f)

    async def predict_crime_risk(
        self,
        location: Dict[str, float],
        time_features: Dict,
        historical_crimes: List[Dict],
    ) -> Dict:
        """
        Predict crime risk for location and time
        """
        try:
            # Extract features
            features = self._extract_features(
                location,
                time_features,
                historical_crimes
            )

            # Predict risk
            risk_score = self.risk_predictor.predict_proba(features)[0][1]

            # Get prediction explanation
            explanation = self._explain_prediction(features, risk_score)

            return {
                "risk_score": float(risk_score),
                "risk_level": self._categorize_risk(risk_score),
                "explanation": explanation,
                "confidence": self._calculate_confidence(features),
            }

        except Exception as e:
            logger.error(f"Crime risk prediction failed: {e}")
            raise

    async def predict_repeat_offender(
        self,
        accused: Dict,
        arrest_history: List[Dict],
    ) -> Dict:
        """
        Predict if person is likely repeat offender
        """
        try:
            # Extract features
            features = self._extract_offender_features(accused, arrest_history)

            # Predict
            score = self.repeat_offender_model.predict_proba(features)[0][1]

            return {
                "repeat_offender_score": float(score),
                "likelihood": "HIGH" if score > 0.7 else "MEDIUM" if score > 0.4 else "LOW",
                "risk_factors": self._identify_risk_factors(accused, arrest_history),
            }

        except Exception as e:
            logger.error(f"Repeat offender prediction failed: {e}")
            raise

    def _extract_features(
        self,
        location: Dict,
        time_features: Dict,
        historical_crimes: List[Dict],
    ) -> np.ndarray:
        """
        Extract features for prediction
        """
        features = []

        # Location features
        features.append(location.get("latitude", 0))
        features.append(location.get("longitude", 0))

        # Time features
        features.append(time_features.get("hour", 0))
        features.append(time_features.get("day_of_week", 0))
        features.append(time_features.get("month", 0))

        # Historical features
        features.append(len(historical_crimes))
        features.append(self._calculate_crime_density(historical_crimes))

        return np.array([features])

    def _categorize_risk(self, score: float) -> str:
        if score > 0.7:
            return "HIGH"
        elif score > 0.4:
            return "MEDIUM"
        else:
            return "LOW"

    def _explain_prediction(self, features: np.ndarray, score: float) -> str:
        """
        Generate human-readable explanation
        """
        return f"Risk score of {score:.2%} based on location, time, and historical crime patterns."

    def _calculate_confidence(self, features: np.ndarray) -> float:
        # Model confidence
        return 0.85

    def _extract_offender_features(self, accused: Dict, arrest_history: List[Dict]) -> np.ndarray:
        features = [
            len(arrest_history),
            accused.get("age", 30),
            len([a for a in arrest_history if a.get("crime_type") == "VIOLENT"]),
        ]
        return np.array([features])

    def _identify_risk_factors(self, accused: Dict, arrest_history: List[Dict]) -> List[str]:
        factors = []
        if len(arrest_history) > 5:
            factors.append("Multiple previous arrests")
        if any(a.get("crime_type") == "VIOLENT" for a in arrest_history):
            factors.append("History of violent crimes")
        if accused.get("age", 30) < 25:
            factors.append("Young age")
        return factors

    def _calculate_crime_density(self, crimes: List[Dict]) -> float:
        # Calculate crime density in area
        if not crimes:
            return 0.0
        return len(crimes) / 100.0  # Simplified
```

---

## 7. NETWORK ANALYSIS SERVICE

```python
# src/services/network_analysis_service.py
import networkx as nx
from typing import List, Dict, Tuple
import logging

logger = logging.getLogger(__name__)

class NetworkAnalysisService:
    def __init__(self):
        self.graph = nx.MultiDiGraph()

    async def analyze_criminal_network(
        self,
        accused_list: List[Dict],
        connections: List[Tuple[str, str]],
    ) -> Dict:
        """
        Analyze criminal network
        """
        try:
            # Build graph
            self._build_graph(accused_list, connections)

            # Identify communities
            communities = self._identify_communities()

            # Calculate centrality
            centrality = nx.betweenness_centrality(self.graph)

            # Find key players
            key_players = self._identify_key_players(centrality)

            return {
                "communities": communities,
                "key_players": key_players,
                "network_density": nx.density(self.graph),
                "graph_metrics": self._calculate_metrics(),
            }

        except Exception as e:
            logger.error(f"Network analysis failed: {e}")
            raise

    def _build_graph(
        self,
        accused_list: List[Dict],
        connections: List[Tuple[str, str]],
    ):
        """
        Build network graph
        """
        for accused in accused_list:
            self.graph.add_node(
                accused["id"],
                name=accused["name"],
                age=accused.get("age"),
                crimes=accused.get("crime_count", 0),
            )

        for source, target in connections:
            self.graph.add_edge(source, target, relationship="criminal_associate")

    def _identify_communities(self) -> List[List[str]]:
        """
        Identify communities using modularity
        """
        from networkx.algorithms import community

        undirected = self.graph.to_undirected()
        communities = list(community.greedy_modularity_communities(undirected))
        return [list(c) for c in communities]

    def _identify_key_players(self, centrality: Dict) -> List[Dict]:
        """
        Identify key players in network
        """
        sorted_by_centrality = sorted(
            centrality.items(),
            key=lambda x: x[1],
            reverse=True
        )

        key_players = []
        for node_id, centrality_score in sorted_by_centrality[:10]:
            node_data = self.graph.nodes[node_id]
            key_players.append({
                "id": node_id,
                "name": node_data.get("name"),
                "centrality_score": centrality_score,
                "degree": self.graph.degree(node_id),
            })

        return key_players

    def _calculate_metrics(self) -> Dict:
        """
        Calculate network metrics
        """
        return {
            "nodes": self.graph.number_of_nodes(),
            "edges": self.graph.number_of_edges(),
            "average_clustering": nx.average_clustering(self.graph.to_undirected()),
        }
```

---

## 8. EXPLAINABILITY SERVICE

```python
# src/services/explainability_service.py
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)

class ExplainabilityService:
    """
    Generate explainable AI responses with evidence
    """

    async def explain_prediction(
        self,
        prediction: Dict,
        model_type: str,
        features: Dict,
    ) -> Dict:
        """
        Generate explanation for model prediction
        """
        if model_type == "risk_prediction":
            return await self._explain_risk_prediction(prediction, features)
        elif model_type == "crime_classification":
            return await self._explain_classification(prediction, features)
        else:
            return {"explanation": "No explanation available"}

    async def _explain_risk_prediction(
        self,
        prediction: Dict,
        features: Dict,
    ) -> Dict:
        """
        Explain risk prediction
        """
        explanation_text = []

        risk_score = prediction.get("risk_score", 0)

        # Location impact
        if features.get("high_crime_area"):
            explanation_text.append(
                "Location is in a high-crime area (30% impact on prediction)"
            )

        # Time impact
        if features.get("night_hours"):
            explanation_text.append(
                "Crime is being predicted for night hours (25% impact)"
            )

        # Historical impact
        if features.get("crime_density"):
            explanation_text.append(
                f"Crime density score: {features['crime_density']:.2f} (20% impact)"
            )

        return {
            "prediction": prediction,
            "explanation": " | ".join(explanation_text),
            "confidence": prediction.get("confidence", 0.75),
            "evidence": self._gather_evidence(features),
        }

    async def _explain_classification(
        self,
        prediction: Dict,
        features: Dict,
    ) -> Dict:
        """
        Explain crime classification
        """
        return {
            "predicted_category": prediction.get("category"),
            "confidence": prediction.get("confidence"),
            "key_indicators": features.get("indicators", []),
        }

    def _gather_evidence(self, features: Dict) -> List[Dict]:
        """
        Gather evidence supporting prediction
        """
        evidence = []

        for key, value in features.items():
            if value:
                evidence.append({
                    "feature": key,
                    "value": value,
                    "impact": "positive" if value > 0.5 else "negative",
                })

        return sorted(evidence, key=lambda x: abs(x["value"]), reverse=True)
```

---

## 9. EMBEDDING SERVICE

```python
# src/services/embedding_service.py
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    async def embed_text(self, text: str) -> np.ndarray:
        """
        Generate embedding for text
        """
        try:
            embedding = self.model.encode(text, convert_to_numpy=True)
            return embedding
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise

    async def embed_batch(self, texts: List[str]) -> List[np.ndarray]:
        """
        Generate embeddings for batch of texts
        """
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True)
            return [e for e in embeddings]
        except Exception as e:
            logger.error(f"Batch embedding failed: {e}")
            raise

    async def calculate_similarity(self, text1: str, text2: str) -> float:
        """
        Calculate semantic similarity between texts
        """
        try:
            embeddings = await self.embed_batch([text1, text2])
            similarity = np.dot(embeddings[0], embeddings[1])
            return float(similarity)
        except Exception as e:
            logger.error(f"Similarity calculation failed: {e}")
            raise
```

---

## 10. DOCKER & DEPLOYMENT

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY src ./src

# Expose port
EXPOSE 3002

# Run app
CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "3002", "--workers", "4"]
```

```yaml
# docker-compose.yml addition
services:
  ai-services:
    build:
      context: ./ai-services
      dockerfile: docker/Dockerfile
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      DATABASE_URL: ${DATABASE_URL}
      VECTOR_DB_PATH: /app/data/models/vector_db
    volumes:
      - ./ai-services/data:/app/data
    ports:
      - "3002:3002"
    depends_on:
      - backend
```

---

## 11. REQUIREMENTS.TXT

```txt
# Core
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.4.0
python-dotenv==1.0.0

# LLM & NLP
langchain==0.1.0
openai==1.3.0
sentence-transformers==2.2.2
nltk==3.8.1
spacy==3.7.2

# Vector Search
faiss-cpu==1.7.4
# OR faiss-gpu for GPU support

# ML
scikit-learn==1.3.2
xgboost==2.0.1
lightgbm==4.0.0
numpy==1.24.3
pandas==2.0.3

# Async
aiohttp==3.9.0
asyncpg==0.29.0

# Monitoring & Logging
prometheus-client==0.18.0
python-json-logger==2.0.7

# Testing
pytest==7.4.3
pytest-asyncio==0.21.1
pytest-cov==4.1.0

# Code Quality
black==23.11.0
flake8==6.1.0
mypy==1.7.0
```

---

## 12. TRAINING PIPELINE

```python
# scripts/train_models.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
import pickle
import logging

logger = logging.getLogger(__name__)

class ModelTrainer:
    def __init__(self, data_path: str):
        self.data = pd.read_csv(data_path)

    def train_crime_classifier(self):
        """
        Train crime classification model
        """
        logger.info("Training crime classifier...")

        X = self.data[[
            'location_latitude', 'location_longitude',
            'hour', 'day_of_week', 'month'
        ]]
        y = self.data['crime_category']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1,
        )

        model.fit(X_train, y_train)

        score = model.score(X_test, y_test)
        logger.info(f"Crime classifier accuracy: {score:.2%}")

        with open("data/models/crime_classifier.pkl", "wb") as f:
            pickle.dump(model, f)

    def train_risk_predictor(self):
        """
        Train risk prediction model
        """
        logger.info("Training risk predictor...")

        X = self.data[[
            'location_latitude', 'location_longitude',
            'hour', 'day_of_week', 'crime_density'
        ]]
        y = self.data['high_risk']

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
        )

        model.fit(X_train, y_train)

        score = model.score(X_test, y_test)
        logger.info(f"Risk predictor accuracy: {score:.2%}")

        with open("data/models/risk_predictor.pkl", "wb") as f:
            pickle.dump(model, f)

if __name__ == "__main__":
    trainer = ModelTrainer("data/training/crimes_labeled.csv")
    trainer.train_crime_classifier()
    trainer.train_risk_predictor()
```

---

## 13. INTEGRATION WITH BACKEND

```typescript
// backend/src/modules/crimes/infrastructure/services/AIIntegrationService.ts
import axios from 'axios';
import { injectable } from 'tsyringe';

@injectable()
export class AIIntegrationService {
  private aiServiceURL = process.env.AI_SERVICE_URL || 'http://localhost:3002';

  async predictCrimeRisk(
    location: { latitude: number; longitude: number },
    timeFeatures: Record<string, any>
  ): Promise<any> {
    const response = await axios.post(
      `${this.aiServiceURL}/api/v1/predictions/crime-risk`,
      {
        location,
        time_features: timeFeatures,
      }
    );
    return response.data;
  }

  async searchSimilarCrimes(query: string): Promise<any[]> {
    const response = await axios.post(
      `${this.aiServiceURL}/api/v1/search`,
      { query }
    );
    return response.data.results;
  }

  async analyzeNetwork(accusedList: any[]): Promise<any> {
    const response = await axios.post(
      `${this.aiServiceURL}/api/v1/network/analyze`,
      { accused_list: accusedList }
    );
    return response.data;
  }
}
```

---

## 14. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
- FastAPI setup
- Embedding service with Sentence Transformers
- Vector DB setup (FAISS)
- Basic RAG implementation

### Phase 2: Chat & LLM (Week 3-4)
- LangChain integration
- Prompt engineering
- Conversation memory
- Multi-language support

### Phase 3: Predictions (Week 5-6)
- Train ML models
- Risk prediction
- Repeat offender identification
- Anomaly detection

### Phase 4: Advanced Analytics (Week 7-8)
- Network analysis
- Criminal association discovery
- Behavioral profiling
- Crime hotspot prediction

### Phase 5: Explainability & Scale (Week 9-10)
- SHAP/LIME for explainability
- Model monitoring
- Performance optimization
- Scaling strategies

---

## CONCLUSION

This AI/ML architecture enables:
- **Conversational Intelligence**: LLM + RAG for explainable Q&A
- **Predictive Analytics**: Crime risk, repeat offenders, anomalies
- **Network Analysis**: Criminal associations, organized crime detection
- **Explainability**: Evidence-based responses, confidence scores
- **Scalability**: Async processing, batch operations, distributed computing

The platform delivers enterprise-grade AI capabilities for crime intelligence.
