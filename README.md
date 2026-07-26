# ShadowProtocol

<p align="center">
  <strong>Enterprise AI-Powered Crime Intelligence & Conversational Investigation Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Fastify-5-000000?style=for-the-badge&logo=fastify" alt="Fastify" />
  <img src="https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python" alt="Python" />
  <img src="https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis" alt="Redis" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/Zoho-Catalyst-E42527?style=for-the-badge" alt="Zoho Catalyst" />
</p>

---

## Overview

ShadowProtocol is an enterprise-grade crime intelligence and conversational AI platform designed for modern law enforcement agencies. It brings together FIRs, investigations, evidence, criminal profiles, analytics, and AI-assisted decision support into a single secure ecosystem. The platform helps investigators, analysts, and decision-makers uncover hidden relationships, identify repeat offenders, forecast crime hotspots, and accelerate investigations through conversational AI and advanced analytics.

---

## Key Features

- AI conversational assistant in English and Kannada
- Crime intelligence dashboard
- Criminal network analysis
- Predictive crime analytics
- Crime hotspot visualization
- Behavioral profiling
- Repeat offender detection
- Similar case recommendation
- Evidence and case management
- Explainable AI
- Audit logging
- Role-based access control
- Cloud-native deployment readiness

---

## System Architecture

```text
Next.js Frontend
        │
   API Gateway
        │
 Fastify Backend
        │
 AI Services (FastAPI)
        │
 PostgreSQL • Redis
        │
 Zoho Catalyst Cloud
```

---

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Backend | Node.js, Fastify, Prisma |
| AI | FastAPI, LangChain, Gemini, FAISS |
| Database | PostgreSQL, Redis |
| Infrastructure | Docker, Docker Compose, Zoho Catalyst |

---

## Repository Structure

```text
ShadowProtocol/
├── frontend/
├── backend/
├── ai-services/
├── docs/
├── docker-compose.yml
└── README.md
```

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/Naren1520/Shadow_Protocol.git
cd Shadow_Protocol
```

### 2. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 4. Start the AI services

```bash
cd ai-services
python -m venv .venv
pip install -r requirements.txt
uvicorn src.main:app --reload
```

### 5. Run with Docker

```bash
docker compose up -d
```

---

## Security

- JWT authentication
- Role-based access control (RBAC)
- Audit trails
- Secure APIs
- Input validation
- Encryption-ready architecture

---

## AI Capabilities

- Conversational AI
- Crime pattern discovery
- Criminal network graphs
- Similar case search
- Crime forecasting
- Explainable AI
- Behavioral analysis
- Risk scoring

---

## Roadmap

- CCTNS integration
- ICJS integration
- Voice assistant
- Facial recognition
- Financial crime intelligence
- GIS intelligence
- Mobile application

---

## Documentation

See the [docs](docs) directory for architecture, deployment, backend, frontend, AI, and infrastructure guides.

---

## License

MIT License

---

<p align="center">
  <strong>Built for enterprise-scale law enforcement systems.</strong>
</p>