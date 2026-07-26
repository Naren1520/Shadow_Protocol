ShadowProtocol
<p align="center">
  <h1 align="center">ShadowProtocol</h1>
  <p align="center"><strong>Enterprise AI-Powered Crime Intelligence & Conversational Investigation Platform</strong></p>
</p>
<p align="center">
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)
![Fastify](https://img.shields.io/badge/Fastify-5-000000?style=for-the-badge&logo=fastify)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=for-the-badge&logo=postgresql)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker)
![Zoho Catalyst](https://img.shields.io/badge/Zoho-Catalyst-E42527?style=for-the-badge)
</p>
---
Overview
ShadowProtocol is an enterprise-grade Crime Intelligence & Conversational AI Platform designed for modern law enforcement agencies. It unifies FIRs, investigations, evidence, criminal profiles, analytics, and AI-driven decision support into a single secure ecosystem. The platform enables investigators, analysts, and policymakers to uncover hidden criminal relationships, identify repeat offenders, forecast crime hotspots, and accelerate investigations through conversational AI and advanced analytics.
---
Key Features
AI Conversational Assistant (English & Kannada)
Crime Intelligence Dashboard
Criminal Network Analysis
Predictive Crime Analytics
Crime Hotspot Visualization
Behavioral Profiling
Repeat Offender Detection
Similar Case Recommendation
Evidence & Case Management
Explainable AI
Audit Logging
Role-Based Access Control
Cloud-Native Deployment
---
System Architecture
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
Tech Stack
Layer	Technologies
Frontend	Next.js 15, React 19, TypeScript, Tailwind CSS, Shadcn UI
Backend	Node.js, Fastify, Prisma
AI	FastAPI, LangChain, Gemini, FAISS
Database	PostgreSQL, Redis
Infrastructure	Docker, Docker Compose, Zoho Catalyst
Technologies
<p align="center">
<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,nodejs,fastapi,python,postgres,redis,docker,kubernetes,git,github,vscode,linux" />
</p>
---
Repository Structure
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
Quick Start
```bash
git clone https://github.com/Naren1520/Shadow_Protocol.git
cd Shadow_Protocol
```
Frontend
```bash
cd frontend
npm install
npm run dev
```
Backend
```bash
cd backend
npm install
npm run dev
```
AI Services
```bash
cd ai-services
python -m venv .venv
pip install -r requirements.txt
uvicorn src.main:app --reload
```
---
Docker
```bash
docker compose up -d
```
---
Security
JWT Authentication
Role-Based Access Control (RBAC)
Audit Trails
Secure APIs
Input Validation
Encryption Ready
---
AI Capabilities
Conversational AI
Crime Pattern Discovery
Criminal Network Graphs
Similar Case Search
Crime Forecasting
Explainable AI
Behavioral Analysis
Risk Scoring
---
Roadmap
CCTNS Integration
ICJS Integration
Voice Assistant
Facial Recognition
Financial Crime Intelligence
GIS Intelligence
Mobile Application
---
Documentation
See the `docs/` directory for architecture, deployment, backend, frontend, AI, and infrastructure guides.
---
License
MIT License
---
<p align="center">
Built for enterprise-scale law enforcement systems.
</p>