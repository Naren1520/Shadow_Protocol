# ShadowProtocol AI/ML Services

This folder contains the standalone AI/ML service module for ShadowProtocol. It is designed as a separate FastAPI-based service for conversational AI, RAG, predictive analytics, and network analysis.

## Overview

- FastAPI service entrypoint: `src/main.py`
- Model orchestration and LLM integration in `src/services`
- AI routes in `src/routes`
- Vector search and embeddings in `src/database` and `src/models`
- Prediction and explainability services in `src/services`

## Local development

Install dependencies:

```bash
cd ai-services
pip install -r requirements.txt
```

Run the app:

```bash
cd ai-services
uvicorn src.main:app --reload --host 0.0.0.0 --port 3002
```

## Notes

This module is intentionally kept separate from the Node.js backend and can be integrated via `AI_SERVICE_URL` or backend proxy configuration.

When running with Docker Compose, the root backend service forwards all `/api/v1/ai/*` requests to the AI service at `http://ai-services:3002` inside the compose network.
