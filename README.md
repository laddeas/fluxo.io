# DataFusion AI — Enterprise Integration Platform

<div align="center">

**AI-Powered Integration Platform as a Service (iPaaS)**

*Connect any source. Transform intelligently. Orchestrate seamlessly. Monitor in real-time.*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)

</div>

---

## Overview

DataFusion AI is a next-generation, enterprise-grade, AI-powered Integration Platform as a Service (iPaaS) that enables organizations to seamlessly connect, transform, orchestrate, and monitor data flows across their entire technology ecosystem.

### Key Features

- 🔌 **Multi-Source Connectivity** — REST APIs, databases, cloud storage, enterprise apps (SAP, Salesforce, ServiceNow)
- 🤖 **AI-First Architecture** — Intelligent schema discovery, auto-mapping, data quality scoring, troubleshooting
- 🔄 **Workflow Orchestration** — Drag-and-drop flow builder with scheduling, retry policies, and event-based triggers
- 📊 **Real-Time Monitoring** — Centralized logging, distributed tracing, health checks, and alerting
- 🔒 **Enterprise Security** — OAuth2, SAML, MFA, RBAC/ABAC, encryption at rest & in transit
- 🏢 **Multi-Tenant SaaS** — Full tenant isolation with PostgreSQL Row-Level Security
- 🔧 **Plugin Architecture** — Add connectors without changing core code via the Connector SDK

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React SPA (Material UI)                      │
├─────────────────────────────────────────────────────────────────┤
│                   API Gateway (Kong/NGINX)                      │
├──────────────────────┬──────────────────────────────────────────┤
│  Core Services       │  AI Services (Python FastAPI)            │
│  (NestJS/TypeScript)  │  • AI Assistant    • AI Mapping          │
│  • Auth Service      │  • AI Transform    • AI Monitoring       │
│  • User Service      │  • AI Troubleshoot • AI Documentation    │
│  • Interface Service │                                          │
│  • Connector Service ├──────────────────────────────────────────┤
│  • Job Service       │  Message Broker (RabbitMQ)               │
│  • Workflow Service  │                                          │
├──────────────────────┴──────────────────────────────────────────┤
│  PostgreSQL (+ pgVector)  │  Redis  │  Object Storage (S3/Blob) │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Material UI, Redux Toolkit |
| Core Backend | NestJS, TypeScript |
| AI Services | Python, FastAPI |
| Database | PostgreSQL + pgVector |
| Cache | Redis |
| Message Broker | RabbitMQ |
| API Gateway | Kong / NGINX |
| Auth | Keycloak (OAuth2, OIDC, SAML) |
| Containerization | Docker, Kubernetes |
| Monitoring | Prometheus, Grafana, OpenTelemetry |

---

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### 1. Start Infrastructure

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, and RabbitMQ with pre-configured credentials.

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Frontend

```bash
cd apps/web && npm run dev
```

### 4. Access the Platform

Open [http://localhost:5180](http://localhost:5180)

**Default Admin Credentials:**
- Email: `admin@datafusion.io`
- Password: `Admin@123456`

---

## Project Structure

```
datafusion-ai/
├── apps/web/                    # React Frontend
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── pages/               # Page components
│       ├── store/               # Redux state management
│       └── theme/               # Material UI theme
├── packages/
│   ├── shared-types/            # Domain types, DTOs, events
│   └── connector-sdk/           # Connector plugin interface
├── infrastructure/
│   └── docker/                  # Docker configs & DB init
├── docker-compose.yml           # Local dev infrastructure
└── package.json                 # Monorepo root
```

---

## Modules

| Module | Description | Status |
|--------|------------|--------|
| Home | Executive dashboard with KPI widgets | ✅ Phase 1 |
| Interfaces | Input/Output data interface management | ✅ Phase 1 |
| Users | User CRUD, roles, permissions (RBAC) | ✅ Phase 1 |
| Job History | Job execution tracking with filters | ✅ Phase 1 |
| Connectors | Connector registry & management | ✅ Phase 1 |
| Settings | Multi-section configuration | ✅ Phase 1 |
| Monitoring | Service health & metrics | ✅ Phase 1 |
| AI Assistant | Embedded chatbot (stub) | ✅ Phase 1 |
| AI Services | Mapping, transform, troubleshoot | 🔜 Phase 2 |
| Workflow Builder | Drag-and-drop flow editor | 🔜 Phase 2 |

---

## License

Proprietary — All rights reserved.
