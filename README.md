# ShadowProtocol

ShadowProtocol is an enterprise-grade crime intelligence platform designed for the Karnataka Police CID. The system combines a modern web frontend, a scalable backend API, and a separate AI/ML service to support investigation workflows, analytics, and predictive capabilities.

## Repository Overview

This repository contains three primary modules and supporting documentation:

- `frontend/` — Next.js 15 application for the user interface
- `backend/` — Fastify + TypeScript backend API and domain logic
- `ai-services/` — Python FastAPI service for AI and ML workflows
- `docs/` — architecture, deployment, and implementation guides
- `docker-compose.yml` — local orchestration definition
- `README.md` — project overview and setup guide

## Module Descriptions

### frontend/
The frontend module contains the Next.js application and UI implementation.

Key files and directories:
- `package.json` — frontend dependencies and scripts
- `tsconfig.json` — TypeScript compiler options
- `next.config.js` — Next.js configuration
- `Dockerfile` — container image definition
- `.env.local` — local environment variables (not tracked)
- `src/app/` — application entrypoint and page routes
- `src/app/auth/login/` — login page implementation
- `src/app/dashboard/page.tsx` — dashboard landing page
- `src/app/analytics/page.tsx` — analytics page
- `src/app/cases/page.tsx` — cases page
- `src/app/crimes/page.tsx` — crimes page
- `src/app/network-analysis/page.tsx` — network analysis page
- `src/modules/` — feature modules for auth, cases, crimes, dashboard
- `src/shared/components/` — shared UI components and layout
- `src/shared/services/api-client.ts` — API client logic
- `src/shared/stores/auth-store.ts` — client-side auth state
- `src/shared/types/` — shared TypeScript definitions
- `public/` — static assets

### backend/
The backend module contains the API server, data layer, and domain modules.

Key files and directories:
- `.env.example` — backend environment template
- `package.json` — backend dependencies and scripts
- `tsconfig.json` / `tsconfig.seed.json` — TypeScript config files
- `docker/Dockerfile` — backend container image definition
- `prisma/schema.prisma` — database schema definition
- `prisma/migrations/` — database migration history
- `prisma/seed.ts` — initial data seeding script
- `src/main.ts` — application bootstrap and server start
- `src/app.ts` — Fastify application instance
- `src/bootstrap/registerRoutes.ts` — route registration
- `src/config/environment.ts` — runtime environment validation
- `src/config/database.ts` — database connection configuration
- `src/modules/auth/` — authentication domain logic
- `src/modules/crimes/` — crime management domain
- `src/modules/cases/` — case management domain
- `src/modules/analytics/` — analytics endpoints and services
- `src/modules/audit/` — audit logging implementation
- `src/modules/accused/` — accused person management
- `src/shared/middleware/` — auth middleware and error handling
- `src/shared/types/` — shared backend types and interfaces
- `src/shared/utils/pagination.ts` — pagination utility

### ai-services/
The AI services module is a standalone Python service for conversational AI, retrieval, and prediction.

Key files and directories:
- `.env.example` — AI service environment template
- `requirements.txt` — Python dependencies
- `pyproject.toml` — project metadata and dependency specification
- `docker/Dockerfile` — AI service container image definition
- `README.md` — AI service module documentation
- `src/main.py` — FastAPI application entrypoint
- `src/config/settings.py` — application settings and environment configuration
- `src/routes/` — API routes for chat, analytics, prediction, and network analysis
- `src/controllers/` — route controllers and handlers
- `src/services/` — business logic, LLM, RAG, and vector search services
- `src/schemas/` — request and response data models
- `src/middleware/` — error handling and request logging
- `src/utils/` — helper utilities
- `src/database/` — vector database and persistence utilities
- `src/models/` — model definitions and metadata

### docs/
The documentation folder contains architectural guidance, deployment instructions, and implementation planning.

Key documents:
- `docs/POLICE_DEPARTMENT_SCHEMA_MAPPING.md` — police data schema mapping
- `docs/FRONTEND_ARCHITECTURE.md` — frontend architecture and patterns
- `docs/BACKEND_ARCHITECTURE.md` — backend architecture and service design
- `docs/AI_ML_ARCHITECTURE.md` — AI/ML architecture and integration guidance
- `docs/CATALYST_MANDATORY_DEPLOYMENT.md` — mandatory Zoho Catalyst deployment guide
- `docs/DEPLOYMENT_INFRASTRUCTURE_CATALYST.md` — full Catalyst deployment infrastructure guide
- `docs/DEPLOYMENT_INFRASTRUCTURE.md` — deployment infrastructure reference
- `docs/IMPLEMENTATION_ROADMAP.md` — phased implementation timeline
- `docs/Police_FIR_ER_Diagram.txt` / `.pdf` — ER diagram reference

## Supported Operating Environment

- Node.js 20 or later
- pnpm or npm for JavaScript package management
- Python 3.11 or later
- PostgreSQL 15 or compatible
- Redis 7 or compatible
- Docker and Docker Compose for local development and containerization

## Setup and Local Development

The local development workflow in this repository is currently set up as three separate services:
- Frontend: Next.js app
- Backend: Fastify + TypeScript API
- AI service: FastAPI + Python service

### Prerequisites

- Node.js 20 or later
- Python 3.11 or later
- Docker Desktop
- PowerShell (Windows) or your preferred shell

### 1) Clone the repository

```powershell
git clone https://github.com/Naren1520/Shadow_Protocol.git
cd ShadowProtocol
```

### 2) Install dependencies

```powershell
cd frontend
npm install

cd ../backend
npm install
Copy-Item .env.example .env -Force

cd ../ai-services
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-minimal.txt
Copy-Item .env.example .env -Force
```

### 3) Start the infrastructure services

```powershell
cd ..
docker compose up -d postgres redis
```

This starts PostgreSQL and Redis locally.

### 4) Start the services

Open three separate terminals.

#### Terminal 1 — Backend

```powershell
cd backend
$env:PORT = "3101"
npm run dev
```

Backend URL:
- `http://localhost:3101`
- Health check: `http://localhost:3101/health`

#### Terminal 2 — AI service

```powershell
cd ai-services
.\.venv\Scripts\Activate.ps1
$env:GEMINI_API_KEY = "your-gemini-key"
$env:PYTHONPATH = "."
python -m uvicorn src.main:app --host 0.0.0.0 --port 3012
```

AI service URL:
- `http://localhost:3012`
- Health check: `http://localhost:3012/health`

#### Terminal 3 — Frontend

```powershell
cd frontend
npm run dev -- --port 3000
```

Frontend URL:
- `http://localhost:3000`

> If port 3000 is already in use, Next.js will choose the next available port and print the new URL.

### 5) Stop everything

```powershell
docker compose down
```

Stop the frontend, backend, and AI service terminals with `Ctrl+C` when you are done.

### Zoho Catalyst Deployment

This repository includes a single root Catalyst deployment manifest in `catalyst.yml`.
The full Catalyst service mapping is also embedded here for easy reference.

```bash
npm install -g catalyst-cli
catalyst-cli login
catalyst-cli deploy
```

The manifest maps these modules to Catalyst services:
- `frontend/` → `catalyst-slate`
- `backend/` → `catalyst-appsail`
- `ai-services/` → `catalyst-appsail`
- `quickml` → `catalyst-quickml`
- `database` → `catalyst-datastore`
- `cache` → `catalyst-cache`
- `storage` → `catalyst-stratus`
- `auth` → `catalyst-authentication`
- `gateway` → `catalyst-api-gateway`
- `events` → `catalyst-signals`
- `workflows` → `catalyst-circuits`
- `cron` → `catalyst-cron`
- `mail` → `catalyst-mail`
- `pipeline` → `catalyst-pipelines`

#### Embedded Catalyst manifest

```yaml
project: shadowprotocol
version: 1.0.0

services:
  frontend:
    type: catalyst-slate
    source: ./frontend
    buildCommand: "npm install && npm run build"
    runtime: node:20
    environment:
      NEXT_PUBLIC_API_BASE_URL: https://api.shadowprotocol.police.gov.in/api/v1
      NEXT_PUBLIC_AI_BASE_URL: https://ai.shadowprotocol.police.gov.in/api/v1
    domains:
      - name: shadowprotocol.police.gov.in
        ssl: true
        cdn: true
    healthCheck:
      path: /health
      interval: 30s
    autoscaling:
      minInstances: 2
      maxInstances: 8
      targetCPU: 70

  backend:
    type: catalyst-appsail
    source: ./backend
    runtime: node:20
    buildCommand: "npm install && npm run build"
    startCommand: "npm run start"
    port: 3001
    environment:
      NODE_ENV: production
      DATABASE_URL: catalyst-datastore://default
      REDIS_URL: catalyst-cache://default
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      ALLOWED_ORIGINS: https://shadowprotocol.police.gov.in
      AI_SERVICE_URL: https://ai.shadowprotocol.police.gov.in
      LOG_LEVEL: info
      STRATUS_BUCKET: evidence-bucket
    scale:
      minInstances: 2
      maxInstances: 10
      targetCPU: 70

  ai-services:
    type: catalyst-appsail
    source: ./ai-services
    runtime: python:3.11
    buildCommand: "pip install -r requirements.txt"
    startCommand: "uvicorn src.main:app --host 0.0.0.0 --port 3002 --workers 4"
    port: 3002
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      DATABASE_URL: catalyst-datastore://default
      CACHE_URL: catalyst-cache://default
      STRATUS_BUCKET: evidence-bucket
    scale:
      minInstances: 1
      maxInstances: 4
      targetCPU: 70

  quickml:
    type: catalyst-quickml
    models:
      - name: crime-llm
        type: llm
        modelName: gpt-4
        config:
          temperature: 0.7
          maxTokens: 500

      - name: crime-rag
        type: rag
        embeddingModel: text-embedding-3-small
        vectorStore: catalyst-datastore
        documents: crime_data

  database:
    type: catalyst-datastore
    tables:
      - users
      - crimes
      - cases
      - accusations
      - evidence
      - analytics

  cache:
    type: catalyst-cache
    memory: 1024MB

  storage:
    type: catalyst-stratus
    buckets:
      - name: evidence-bucket
        public: false

  auth:
    type: catalyst-authentication
    providers:
      - type: email

  gateway:
    type: catalyst-api-gateway
    routes:
      - path: /api/v1/*
        service: backend
      - path: /api/v1/ai/*
        service: backend
      - path: /ai/*
        service: ai-services

  events:
    type: catalyst-signals

  workflows:
    type: catalyst-circuits

  cron:
    type: catalyst-cron

  mail:
    type: catalyst-mail

  pipeline:
    type: catalyst-pipelines
    trigger:
      onPush: true
```

For deployment details, see `docs/DEPLOYMENT_INFRASTRUCTURE_CATALYST.md`.

## Folder Structure

```
ShadowProtocol/
├── ai-services/
│   ├── docker/
│   │   └── Dockerfile
│   ├── pyproject.toml
│   ├── README.md
│   ├── requirements.txt
│   ├── src/
│   │   ├── config/
│   │   │   └── settings.py
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
├── backend/
│   ├── docker/
│   │   └── Dockerfile
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.seed.json
│   ├── src/
│   │   ├── app.ts
│   │   ├── main.ts
│   │   ├── bootstrap/
│   │   ├── config/
│   │   ├── modules/
│   │   └── shared/
├── docs/
│   ├── AI_ML_ARCHITECTURE.md
│   ├── BACKEND_ARCHITECTURE.md
│   ├── CATALYST_MANDATORY_DEPLOYMENT.md
│   ├── DEPLOYMENT_INFRASTRUCTURE.md
│   ├── DEPLOYMENT_INFRASTRUCTURE_CATALYST.md
│   ├── FRONTEND_ARCHITECTURE.md
│   ├── IMPLEMENTATION_ROADMAP.md
│   └── POLICE_DEPARTMENT_SCHEMA_MAPPING.md
├── frontend/
│   ├── Dockerfile
│   ├── .env.local
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── public/
│   └── src/
│       ├── app/
│       ├── modules/
│       └── shared/
├── docker-compose.yml
└── README.md
```

## Technology Summary

| Layer | Primary Technologies |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js 20, Fastify, TypeScript, Prisma |
| AI/ML | Python 3.11, FastAPI, LangChain, FAISS |
| Database | PostgreSQL, Redis |
| Deployment | Docker, Docker Compose, Zoho Catalyst |

## Development Notes

- `.env` files and local secrets must remain excluded from source control.
- `ai-services/` is designed to be a separate deployable service.
- Backend and frontend modules can be developed independently and integrated through API contracts.
- Use the `docs/` folder for architecture and deployment decisions.

## Testing and Quality

Recommended practices:
- Backend unit and integration tests for API routes and database logic
- Frontend component and route tests for user flows
- AI service tests for request validation and response structure
- Static analysis with TypeScript and Python linters
- Environment validation before deployment

## Deployment

Production deployment should follow the Zoho Catalyst guidance in `docs/CATALYST_MANDATORY_DEPLOYMENT.md`.

For containerized local deployment use `docker compose up -d`.

## Additional Resources

- `docs/IMPLEMENTATION_ROADMAP.md` for project milestones
- `docs/FRONTEND_ARCHITECTURE.md` for UI design and conventions
- `docs/BACKEND_ARCHITECTURE.md` for backend architecture and security
- `docs/AI_ML_ARCHITECTURE.md` for AI/ML system design
- `docs/DEPLOYMENT_INFRASTRUCTURE_CATALYST.md` for Catalyst deployment details

### Team Contacts
- Technical Architect: [Architecture documentation](FRONTEND_ARCHITECTURE.md)
- Frontend Lead: See component patterns in FRONTEND_ARCHITECTURE.md
- Backend Lead: See patterns in BACKEND_ARCHITECTURE.md
- AI/ML Lead: See services in AI_ML_ARCHITECTURE.md

---

## 📈 Metrics & KPIs

### System Metrics
- Request rate & latency
- Error rate & types
- Database performance
- Cache effectiveness
- Infrastructure utilization

### Business Metrics
- Active users
- Feature adoption
- Case resolution time
- Investigation efficiency
- User satisfaction

---

## 🎯 Next Steps

1. **Read Architecture Docs**: Start with appropriate documentation based on your role
2. **Setup Development**: Follow "Getting Started" section above
3. **Review Roadmap**: Check IMPLEMENTATION_ROADMAP.md for project timeline
4. **Join Team**: Align with team on sprint planning

---

## 📄 License & Compliance

- **Government Project**: Compliant with Indian government standards
- **Security**: Follows enterprise security best practices
- **Data Privacy**: GDPR and Indian data protection compliant
- **Accessibility**: WCAG 2.1 Level AA compliance

---

## 🙏 Acknowledgments

Built with enterprise standards following:
- Domain-Driven Design (DDD)
- Clean Architecture
- SOLID Principles
- 12-Factor App
- Microservices patterns

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0 - Enterprise Edition  
**Last Updated**: 2026-07-24  
**Target Platform**: Azure Cloud (AKS)

---

**Start with the appropriate architecture documentation for your role and follow the 20-week implementation roadmap.**


