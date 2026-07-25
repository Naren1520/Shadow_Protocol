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

### Clone the repository

```bash
git clone https://github.com/Naren1520/Shadow_Protocol.git
cd ShadowProtocol
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs by default on `http://localhost:3000`.

### Backend

```bash
cd ../backend
pnpm install
cp .env.example .env
# update the .env file with your database, Redis, and JWT values
pnpm dev
```

The backend runs on the configured port, typically `http://localhost:3001`.

### AI Service

```bash
cd ../ai-services
pip install -r requirements.txt
cp .env.example .env
# set OPENAI_API_KEY if using LLM integration
uvicorn src.main:app --reload --host 0.0.0.0 --port 3002
```

The AI service runs on `http://localhost:3002`.

### Docker Compose

```bash
docker compose up -d
```

This command starts the local integration stack. Verify the service ports and container status after startup.

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


