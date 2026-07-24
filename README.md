## Shadow Protocol
 - Datathon 2026 -- Karnataka Police 

# Folder structure 
ShadowProtocol/
│
├── apps/
│   │
│   ├── web/                                  # Next.js Frontend
│   │   ├── app/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── crime-map/
│   │   │   ├── network-analysis/
│   │   │   ├── chatbot/
│   │   │   ├── reports/
│   │   │   ├── notifications/
│   │   │   ├── settings/
│   │   │   └── profile/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── charts/
│   │   │   ├── maps/
│   │   │   ├── graphs/
│   │   │   ├── layout/
│   │   │   ├── forms/
│   │   │   └── common/
│   │   │
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── lib/
│   │   ├── store/
│   │   ├── types/
│   │   ├── styles/
│   │   ├── middleware.ts
│   │   └── next.config.ts
│   │
│   ├── api/                                  # API Gateway
│   │   ├── src/
│   │   │
│   │   ├── bootstrap/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── gateway/
│   │   ├── health/
│   │   ├── scheduler/
│   │   ├── events/
│   │   ├── queues/
│   │   ├── websocket/
│   │   ├── common/
│   │   ├── modules/
│   │   │
│   │   │   ├── auth/
│   │   │   │
│   │   │   ├── users/
│   │   │   │
│   │   │   ├── fir/
│   │   │   │
│   │   │   ├── cases/
│   │   │   │
│   │   │   ├── accused/
│   │   │   │
│   │   │   ├── victims/
│   │   │   │
│   │   │   ├── complainants/
│   │   │   │
│   │   │   ├── police/
│   │   │   │
│   │   │   ├── districts/
│   │   │   │
│   │   │   ├── courts/
│   │   │   │
│   │   │   ├── acts-sections/
│   │   │   │
│   │   │   ├── reports/
│   │   │   │
│   │   │   ├── search/
│   │   │   │
│   │   │   ├── audit/
│   │   │   │
│   │   │   └── notifications/
│   │   │
│   │   ├── tests/
│   │   └── main.ts
│   │
│   ├── ai-engine/
│   │   ├── chatbot/
│   │   ├── rag/
│   │   ├── embeddings/
│   │   ├── vector-store/
│   │   ├── prediction/
│   │   ├── anomaly-detection/
│   │   ├── repeat-offender/
│   │   ├── offender-profiling/
│   │   ├── similarity-search/
│   │   ├── explainable-ai/
│   │   ├── summarization/
│   │   ├── feature-engineering/
│   │   ├── pipelines/
│   │   ├── models/
│   │   ├── training/
│   │   ├── inference/
│   │   └── evaluation/
│   │
│   ├── analytics-engine/
│   │   ├── hotspot-analysis/
│   │   ├── temporal-analysis/
│   │   ├── crime-trends/
│   │   ├── district-analysis/
│   │   ├── demographic-analysis/
│   │   ├── behavioral-analysis/
│   │   ├── network-analysis/
│   │   ├── forecasting/
│   │   ├── kpi/
│   │   ├── reports/
│   │   └── dashboards/
│   │
│   ├── notification-service/
│   │   ├── email/
│   │   ├── sms/
│   │   ├── push/
│   │   ├── websocket/
│   │   └── templates/
│   │
│   └── worker/
│       ├── jobs/
│       ├── queues/
│       ├── cron/
│       ├── consumers/
│       └── producers/
│
├── packages/
│   ├── ui/
│   ├── auth/
│   ├── logger/
│   ├── config/
│   ├── constants/
│   ├── types/
│   ├── validation/
│   ├── database/
│   ├── cache/
│   ├── events/
│   ├── permissions/
│   ├── telemetry/
│   ├── encryption/
│   ├── storage/
│   └── utils/
│
├── infrastructure/
│   ├── docker/
│   ├── kubernetes/
│   │   ├── api/
│   │   ├── web/
│   │   ├── ai/
│   │   ├── analytics/
│   │   ├── workers/
│   │   ├── ingress/
│   │   ├── secrets/
│   │   └── monitoring/
│   │
│   ├── nginx/
│   ├── terraform/
│   ├── github-actions/
│   ├── monitoring/
│   │   ├── prometheus/
│   │   ├── grafana/
│   │   ├── loki/
│   │   └── jaeger/
│   │
│   └── scripts/
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── postgres/
│   ├── redis/
│   ├── elasticsearch/
│   ├── neo4j/
│   ├── backup/
│   └── restore/
│
├── docs/
│   ├── Architecture.md
│   ├── API.md
│   ├── Database.md
│   ├── Security.md
│   ├── AI.md
│   ├── Deployment.md
│   ├── Monitoring.md
│   ├── ADR/
│   └── diagrams/
│
├── datasets/
│   ├── raw/
│   ├── processed/
│   ├── embeddings/
│   └── models/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   ├── load/
│   └── security/
│
├── .github/
│   └── workflows/
│       ├── lint.yml
│       ├── test.yml
│       ├── build.yml
│       └── deploy.yml
│
├── docker-compose.yml
├── turbo.json
├── package.json
├── README.md
├── LICENSE
├── .env.example
└── .gitignore