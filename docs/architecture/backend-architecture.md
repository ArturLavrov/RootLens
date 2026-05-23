# RootLence Backend Architecture

## Purpose

RootLence is a cloud-native SaaS platform for incident intelligence, investigations, postmortems, and AI-assisted root cause analysis.

The backend is designed to start as a simple, maintainable modular application and evolve into a more distributed architecture only when product and operational needs require it.

The main architectural principle is:

```text
Logical separation first.
Physical separation later.
```

---

## High-Level Backend Architecture

Initial backend architecture:

```text
Frontend SPA
  ↓
AWS ALB / API Gateway
  ↓
FastAPI Backend
  ↓
PostgreSQL / S3 / SQS / Bedrock
```

Runtime components:

```text
apps/api      - synchronous HTTP API
```

Both services are initially deployed into the same AWS ECS Fargate cluster.

---

## Technology Stack

```text
Language:        Python
Web Framework:   FastAPI
Validation:      Pydantic
Database:        PostgreSQL
ORM:             SQLAlchemy
Migrations:      Alembic
Async Messaging: AWS SQS
Object Storage:  AWS S3
AI/RAG:          Amazon Bedrock
Runtime:         AWS ECS Fargate
Observability:   AWS CloudWatch, AWS X-Ray
Infrastructure:  Terraform
```

---

## Architectural Style

RootLence starts as a **modular monolith**.

This means the backend is one deployable API application, but internally divided into clear business modules.

Example modules:

```text
incidents
investigations
postmortems
users
releases

```

Each module should own its:

```text
tests
models
restapi.py(in case if module expose some public api)
module.py(core module logic)
api.py(modules internal api that can be used by other modules indise the system)
```

Direct cross-module dependencies should be avoided where possible and will be verified by arch-tests

---

## Repository Structure

Recommended backend structure:

```text
apps/
  api/
    src/
      main.py
      modules/
        incidents/
        investigations/
        postmortems/
      shared/
        errors.py
        pagination.py
        dependencies.py
      tests/
```

---

## API Layer

The API layer is implemented with FastAPI.

Responsibilities:

```text
HTTP routing
request validation
authentication and authorization checks
calling application services
returning API responses
```

API handlers should stay thin.

They should not contain complex business logic or direct database manipulation.

Preferred flow:

```text
Route → Application Service → Repository/Domain Logic → Database
```

---

## Object Storage

S3 is used for large or unstructured data.

Examples:

```text
incident attachments
exported reports
raw imported postmortems
integration payload snapshots
AI-generated artifacts
knowledge base source documents
```

PostgreSQL stores metadata.

S3 stores the actual object.

---

## Events

RootLence should use internal application events for decoupling.

Example events:

```text
IncidentCreated
InvestigationStarted
InvestigationCompleted
PostmortemGenerated
KnowledgeDocumentIndexed
RcaAnalysisCompleted
```

Initial implementation can be simple:

```text
database state change
SQS message
worker processing
```

Do not introduce Kafka at the beginning.

SQS is sufficient for the MVP.

---

## Observability

Initial observability is AWS-native.

Use:

```text
CloudWatch Logs
CloudWatch Metrics
AWS X-Ray
ECS Container Insights
ALB access logs
RDS Performance Insights
```

The backend should emit structured logs with:

```text
correlation_id
tenant_id
user_id
request_id
operation_name
duration_ms
error_code
```

RootLence should eventually dogfood its own incident intelligence capabilities.

---

## Security

Core security requirements:

```text
Authentication for every protected endpoint
Tenant isolation on every query
RBAC for sensitive operations
No secrets in code
Secrets stored in AWS Secrets Manager or SSM Parameter Store
S3 access via IAM roles
Least-privilege IAM policies
```

Initial auth provider may be:

```text
AWS Cognito
Auth0
Clerk
```

The exact provider can be decided separately.

---

## Deployment

Initial deployment target:

```text
AWS ECS Fargate
```

Services:

```text
api service
worker service
```

Supporting infrastructure:

```text
ALB or API Gateway
RDS PostgreSQL
SQS
S3
CloudWatch
X-Ray
Secrets Manager
```

Infrastructure is provisioned with Terraform.

---

## Evolution Strategy

### Phase 1: MVP

```text
Single FastAPI backend
Single worker service
Single PostgreSQL database
Basic tenant_id isolation
SQS for async jobs
S3 for files
Bedrock for AI
AWS-native observability
```

### Phase 2: Operational Separation

```text
Dedicated integration worker
Dedicated AI worker
Separate queues per workload type
Dead-letter queues
More advanced retry policies
```

### Phase 3: Enterprise Scale

```text
Stronger tenant isolation
Optional dedicated customer infrastructure
Advanced audit logs
Advanced observability
Custom retention policies
Enterprise integrations
```

---

## Explicit Non-Goals for MVP

The MVP should avoid:

```text
microservices
Kubernetes / EKS
Kafka
database-per-tenant
complex event sourcing
custom observability platform
premature GraphQL
over-engineered DDD
```

The goal is to build a simple, reliable, AI-friendly backend that can evolve gradually.

---

## Architecture Decision Summary

Current decisions:

```text
Use Python + FastAPI for backend.
Use modular monolith as the initial architecture.
Use PostgreSQL as the primary database.
Use tenant_id-based multi-tenancy in the MVP.
Use SQS for asynchronous processing.
Use S3 for object storage.
Use Amazon Bedrock for AI/RAG capabilities.
Use AWS-native observability initially.
Deploy on ECS Fargate.
Manage infrastructure with Terraform.
```
