# ShadowProtocol - Deployment & Infrastructure Architecture

⚠️ **IMPORTANT**: This project is **Zoho-sponsored** and deployment via **Catalyst is MANDATORY**. 
See [DEPLOYMENT_INFRASTRUCTURE_CATALYST.md](DEPLOYMENT_INFRASTRUCTURE_CATALYST.md) for required Catalyst deployment strategy.

---

## Executive Summary (LEGACY - Azure Reference Only)

This document provides a **reference architecture** for deploying on Azure with Kubernetes. 

**⚠️ FOR PRODUCTION SUBMISSION**: Use **Catalyst by Zoho** (mandatory) - see [DEPLOYMENT_INFRASTRUCTURE_CATALYST.md](DEPLOYMENT_INFRASTRUCTURE_CATALYST.md)

This legacy guide documents Docker, Kubernetes (AKS), CI/CD pipelines, Prometheus + Grafana, and Infrastructure as Code for reference only.

---

## 1. DEPLOYMENT ARCHITECTURE OVERVIEW

```
                           ┌─────────────────────────────────────────┐
                           │     User (Browser/Mobile)                │
                           └────────────────┬────────────────────────┘
                                            │
                           ┌────────────────▼────────────────────────┐
                           │  CDN (CloudFlare/Azure CDN)             │
                           └────────────────┬────────────────────────┘
                                            │
                           ┌────────────────▼────────────────────────┐
                           │  Application Gateway / Load Balancer    │
                           │  (TLS/SSL, DDoS Protection)              │
                           └────────────────┬────────────────────────┘
                                            │
             ┌──────────────────────────────┼──────────────────────────────┐
             │                              │                              │
        ┌────▼────┐                    ┌────▼────┐                    ┌────▼────┐
        │ Frontend │                    │ Backend  │                    │ AI       │
        │ Service  │                    │ Service  │                    │ Services │
        │ (AKS)    │                    │ (AKS)    │                    │ (AKS)    │
        └────┬─────┘                    └────┬─────┘                    └────┬─────┘
             │                              │                              │
             └──────────────────────────────┼──────────────────────────────┘
                                            │
             ┌──────────────────────────────┼──────────────────────────────┐
             │                              │                              │
        ┌────▼────┐                    ┌────▼────┐                    ┌────▼────┐
        │PostgreSQL│                    │ Redis   │                    │ Storage │
        │ (Managed)│                    │ (Cache) │                    │ (Blob)   │
        └──────────┘                    └─────────┘                    └──────────┘

        ┌──────────────────────────────────────────────────────────────────┐
        │ Monitoring, Logging & Observability                              │
        │ Prometheus | Grafana | Loki | Application Insights              │
        └──────────────────────────────────────────────────────────────────┘

        ┌──────────────────────────────────────────────────────────────────┐
        │ CI/CD Pipeline (GitHub Actions / Azure DevOps)                  │
        │ Code → Build → Test → Registry → Deploy → Verify                │
        └──────────────────────────────────────────────────────────────────┘
```

---

## 2. CONTAINERIZATION

### Multi-Stage Frontend Dockerfile

```dockerfile
# Frontend Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

# Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "server.js"]
```

### Multi-Stage Backend Dockerfile

```dockerfile
# Backend Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Runtime
FROM base AS runner
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package.json ./

USER app

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

CMD ["node", "dist/main.js"]
```

### Multi-Stage Python AI Services Dockerfile

```dockerfile
# AI Services Dockerfile
FROM python:3.11-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Dependencies
FROM base AS deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Runtime
FROM base AS runner
COPY --from=deps /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY src ./src

RUN useradd -m -u 1001 app
USER app

EXPOSE 3002

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

CMD ["python", "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "3002", "--workers", "4"]
```

### Docker Compose for Local Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    container_name: shadowprotocol_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: shadowprotocol
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - shadowprotocol_network

  # Cache
  redis:
    image: redis:7-alpine
    container_name: shadowprotocol_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - shadowprotocol_network

  # Backend
  backend:
    build:
      context: ./backend
      dockerfile: docker/Dockerfile
    container_name: shadowprotocol_backend
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/shadowprotocol
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      API_PORT: 3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend/src:/app/src
    networks:
      - shadowprotocol_network

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: shadowprotocol_frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src
    networks:
      - shadowprotocol_network

  # AI Services
  ai_services:
    build:
      context: ./ai-services
      dockerfile: docker/Dockerfile
    container_name: shadowprotocol_ai
    environment:
      OPENAI_API_KEY: ${OPENAI_API_KEY}
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/shadowprotocol
      REDIS_URL: redis://redis:6379
    ports:
      - "3002:3002"
    depends_on:
      - postgres
      - redis
    networks:
      - shadowprotocol_network

  # Prometheus (Monitoring)
  prometheus:
    image: prom/prometheus:latest
    container_name: shadowprotocol_prometheus
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"
    networks:
      - shadowprotocol_network

  # Grafana (Visualization)
  grafana:
    image: grafana/grafana:latest
    container_name: shadowprotocol_grafana
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./monitoring/grafana/provisioning:/etc/grafana/provisioning
    ports:
      - "3003:3000"
    depends_on:
      - prometheus
    networks:
      - shadowprotocol_network

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  shadowprotocol_network:
    driver: bridge
```

---

## 3. KUBERNETES (AKS) DEPLOYMENT

### Namespace Setup

```yaml
# k8s/namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: shadowprotocol-prod
  labels:
    name: shadowprotocol-prod

---
apiVersion: v1
kind: Namespace
metadata:
  name: shadowprotocol-staging
  labels:
    name: shadowprotocol-staging
```

### PostgreSQL StatefulSet

```yaml
# k8s/postgres-statefulset.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: postgres-config
  namespace: shadowprotocol-prod
data:
  POSTGRES_DB: shadowprotocol
  POSTGRES_USER: postgres

---
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
  namespace: shadowprotocol-prod
type: Opaque
stringData:
  POSTGRES_PASSWORD: ${DB_PASSWORD}

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: shadowprotocol-prod
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: azure-managed-premium

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: shadowprotocol-prod
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
        envFrom:
        - configMapRef:
            name: postgres-config
        - secretRef:
            name: postgres-secret
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        livenessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - pg_isready -U postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - pg_isready -U postgres
          initialDelaySeconds: 5
          periodSeconds: 10
      volumes:
      - name: postgres-storage
        persistentVolumeClaim:
          claimName: postgres-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: shadowprotocol-prod
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### Redis Deployment

```yaml
# k8s/redis-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: shadowprotocol-prod
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        volumeMounts:
        - name: redis-storage
          mountPath: /data
        livenessProbe:
          exec:
            command:
            - redis-cli
            - ping
          initialDelaySeconds: 30
          periodSeconds: 10
      volumes:
      - name: redis-storage
        emptyDir: {}

---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: shadowprotocol-prod
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
```

### Backend Deployment

```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: shadowprotocol-prod
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - backend
              topologyKey: kubernetes.io/hostname
      containers:
      - name: backend
        image: ${ACR_URL}/shadowprotocol-backend:${BUILD_TAG}
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3001
          name: http
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: DATABASE_URL
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: REDIS_URL
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: JWT_SECRET
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2

---
apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: shadowprotocol-prod
spec:
  selector:
    app: backend
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3001
    protocol: TCP
    name: http

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: shadowprotocol-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Frontend Deployment

```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: shadowprotocol-prod
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ${ACR_URL}/shadowprotocol-frontend:${BUILD_TAG}
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: API_URL
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "250m"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: shadowprotocol-prod
spec:
  selector:
    app: frontend
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
  namespace: shadowprotocol-prod
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Ingress Configuration

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shadowprotocol-ingress
  namespace: shadowprotocol-prod
  annotations:
    kubernetes.io/ingress.class: azure/application-gateway
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  tls:
  - hosts:
    - shadowprotocol.police.gov.in
    secretName: shadowprotocol-tls
  rules:
  - host: shadowprotocol.police.gov.in
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend
            port:
              number: 80
      - path: /api/
        pathType: Prefix
        backend:
          service:
            name: backend
            port:
              number: 80
      - path: /ai/
        pathType: Prefix
        backend:
          service:
            name: ai-services
            port:
              number: 80
```

---

## 4. CI/CD PIPELINES

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy shadowprotocol AI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ${{ secrets.ACR_LOGIN_SERVER }}
  IMAGE_PREFIX: shadowprotocol

jobs:
  build-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: cd frontend && pnpm install

      - name: Lint
        run: cd frontend && pnpm run lint

      - name: Type check
        run: cd frontend && pnpm run type-check

      - name: Build
        run: cd frontend && pnpm run build

      - name: Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and push Docker image
        run: |
          docker build -f frontend/Dockerfile -t ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-frontend:${{ github.sha }} -t ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-frontend:latest frontend/
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-frontend:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-frontend:latest

  build-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: cd backend && pnpm install

      - name: Lint
        run: cd backend && pnpm run lint

      - name: Type check
        run: cd backend && pnpm run type-check

      - name: Test
        run: cd backend && pnpm run test

      - name: Build
        run: cd backend && pnpm run build

      - name: Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and push Docker image
        run: |
          docker build -f backend/docker/Dockerfile -t ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-backend:${{ github.sha }} -t ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-backend:latest backend/
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-backend:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-backend:latest

  build-ai:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          cd ai-services
          pip install -r requirements.txt

      - name: Lint
        run: |
          cd ai-services
          flake8 src/
          mypy src/

      - name: Test
        run: |
          cd ai-services
          pytest tests/

      - name: Login to ACR
        uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}

      - name: Build and push Docker image
        run: |
          docker build -f ai-services/docker/Dockerfile -t ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-ai:${{ github.sha }} -t ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-ai:latest ai-services/
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-ai:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_PREFIX }}-ai:latest

  deploy:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    needs: [build-frontend, build-backend, build-ai]
    steps:
      - uses: actions/checkout@v3

      - name: Azure Login
        uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Set AKS context
        uses: azure/aks-set-context@v3
        with:
          resource-group: ${{ secrets.AZURE_RESOURCE_GROUP }}
          cluster-name: ${{ secrets.AKS_CLUSTER_NAME }}

      - name: Deploy with Helm
        run: |
          helm upgrade --install shadowprotocol-prod ./helm/shadowprotocol \
            --namespace shadowprotocol-prod \
            --set image.repository=${{ env.REGISTRY }} \
            --set image.tag=${{ github.sha }} \
            --set image.pullPolicy=Always \
            --values ./helm/values-prod.yaml
```

---

## 5. INFRASTRUCTURE AS CODE (Terraform)

### Terraform Main Configuration

```hcl
# terraform/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }

  backend "azurerm" {
    resource_group_name  = "shadowprotocol-state"
    storage_account_name = "shadowprotocolstate"
    container_name       = "tfstate"
    key                  = "prod.tfstate"
  }
}

provider "azurerm" {
  features {}
}

provider "kubernetes" {
  host                   = azurerm_kubernetes_cluster.aks.kube_config.0.host
  client_certificate     = base64decode(azurerm_kubernetes_cluster.aks.kube_config.0.client_certificate)
  client_key             = base64decode(azurerm_kubernetes_cluster.aks.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.aks.kube_config.0.cluster_ca_certificate)
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "shadowprotocol-rg"
  location = var.location
  tags     = var.common_tags
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "shadowprotocol-aks"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "shadowprotocol"

  default_node_pool {
    name            = "system"
    node_count      = 3
    vm_size         = "Standard_D4s_v3"
    os_disk_size_gb = 30

    vnet_subnet_id = azurerm_subnet.aks.id

    enable_auto_scaling = true
    min_count           = 3
    max_count           = 20
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }

  tags = var.common_tags

  depends_on = [azurerm_subnet.aks]
}

# Additional Node Pool for AI Services
resource "azurerm_kubernetes_cluster_node_pool" "ai" {
  name                  = "ai"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks.id
  node_count            = 2
  vm_size               = "Standard_D4s_v3"
  os_disk_size_gb       = 50

  enable_auto_scaling = true
  min_count           = 2
  max_count           = 10

  node_taints = [
    "workload=ai:NoSchedule"
  ]

  tags = var.common_tags
}

# PostgreSQL Server
resource "azurerm_postgresql_flexible_server" "main" {
  name                   = "shadowprotocol-db"
  resource_group_name    = azurerm_resource_group.main.name
  location               = azurerm_resource_group.main.location
  version                = "15"
  administrator_login    = "dbadmin"
  administrator_password = var.db_password

  storage_mb   = 262144  # 256GB
  sku_name     = "B_Standard_B2s"
  backup_retention_days = 35

  zone = 1

  tags = var.common_tags
}

# Azure Cache for Redis
resource "azurerm_redis_cache" "main" {
  name                = "shadowprotocol-redis"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  capacity            = 2
  family              = "C"
  sku_name            = "Standard"
  enable_non_ssl_port = false
  minimum_tls_version = "1.2"

  tags = var.common_tags
}

# Storage Account
resource "azurerm_storage_account" "main" {
  name                     = "shadowprotocolstorage"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "GRS"

  https_traffic_only_enabled       = true
  min_tls_version                  = "TLS1_2"
  shared_access_key_enabled        = true

  tags = var.common_tags
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "shadowprotocolacr"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Premium"
  admin_enabled       = true

  tags = var.common_tags
}

# Key Vault
resource "azurerm_key_vault" "main" {
  name                        = "shadowprotocol-kv"
  location                    = azurerm_resource_group.main.location
  resource_group_name         = azurerm_resource_group.main.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id
  sku_name                    = "premium"

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Create",
      "Delete",
      "Get",
      "List",
    ]

    secret_permissions = [
      "Set",
      "Get",
      "Delete",
      "List",
    ]
  }

  tags = var.common_tags
}
```

---

## 6. MONITORING & OBSERVABILITY

### Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'shadowprotocol-prod'
    environment: 'production'

alerting:
  alertmanagers:
  - static_configs:
    - targets: ['alertmanager:9093']

rule_files:
  - 'alerts.yml'

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
          - shadowprotocol-prod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

  - job_name: 'backend'
    static_configs:
      - targets: ['backend:3001']
    metrics_path: '/metrics'

  - job_name: 'ai-services'
    static_configs:
      - targets: ['ai-services:3002']
    metrics_path: '/metrics'
```

### Grafana Dashboards

```json
{
  "dashboard": {
    "title": "shadowprotocol AI Platform",
    "uid": "shadowprotocol-main",
    "timezone": "UTC",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m])"
          }
        ]
      },
      {
        "title": "Response Time (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))"
          }
        ]
      },
      {
        "title": "Database Connections",
        "targets": [
          {
            "expr": "pg_stat_activity_count"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "targets": [
          {
            "expr": "redis_keyspace_hits_total / (redis_keyspace_hits_total + redis_keyspace_misses_total)"
          }
        ]
      }
    ]
  }
}
```

---

## 7. DEPLOYMENT CHECKLIST

- [ ] Container images built and pushed to ACR
- [ ] Kubernetes manifests validated
- [ ] Secrets configured in Key Vault
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Load balancer configured
- [ ] Monitoring & alerting enabled
- [ ] Logging aggregation configured
- [ ] Backup strategy verified
- [ ] Disaster recovery plan tested
- [ ] Security scanning completed
- [ ] Performance baseline established
- [ ] Documentation updated

---

## 8. SCALING CONSIDERATIONS

### Horizontal Scaling
- Kubernetes HPA configured with CPU/Memory thresholds
- Min 3 replicas, Max 10 per service
- Rolling updates with zero downtime

### Vertical Scaling
- Node pool scaling: min 3 nodes, max 20 nodes
- AI workloads on dedicated node pool

### Database Scaling
- Read replicas for analytics queries
- Connection pooling with PgBouncer
- Partitioning for large tables

### Caching Strategy
- Redis for session/query caching
- CDN for static assets
- Application-level caching

---

## 9. PRODUCTION RUNBOOK

### Deployment Process
```bash
# 1. Push code to main branch
git push origin main

# 2. GitHub Actions triggers CI/CD
# - Build & Test all services
# - Push to ACR
# - Deploy to AKS

# 3. Verify deployment
kubectl rollout status deployment/backend -n shadowprotocol-prod
kubectl rollout status deployment/frontend -n shadowprotocol-prod

# 4. Run smoke tests
./scripts/smoke-tests.sh

# 5. Monitor metrics
open grafana.shadowprotocol.police.gov.in
```

### Rollback Procedure
```bash
# Rollback to previous deployment
kubectl rollout undo deployment/backend -n shadowprotocol-prod
kubectl rollout undo deployment/frontend -n shadowprotocol-prod

# Verify rollback
kubectl get pods -n shadowprotocol-prod
kubectl logs deployment/backend -n shadowprotocol-prod
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Pod CrashLoopBackOff | Check logs, verify secrets, check resource limits |
| Database connection fails | Verify connection string, check firewall rules |
| High memory usage | Check for memory leaks, scale up HPA |
| Slow queries | Check indexes, optimize queries, add caching |

---

## CONCLUSION

This deployment architecture ensures:
- **High Availability**: Multi-zone, multi-replica deployments
- **Scalability**: Horizontal & vertical scaling mechanisms
- **Security**: Network policies, RBAC, secrets management
- **Observability**: Monitoring, logging, tracing
- **Maintainability**: Infrastructure as Code, automated deployments

The platform is production-ready for enterprise deployment on Azure.
