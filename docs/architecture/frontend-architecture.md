# RootLence Frontend Architecture

## Purpose

RootLence frontend is a cloud-hosted single-page application for incident intelligence, investigations, postmortems, and AI-assisted root cause analysis.

The frontend should be simple, strongly typed, easy for AI coding agents to modify, and optimized for static hosting on AWS.

The main architectural principle is:

```text
Simple static frontend.
Clear feature boundaries.
Strong API contracts.
```

---

## High-Level Frontend Architecture

Initial frontend architecture:

```text
User
  ↓
Route 53
  ↓
CloudFront CDN
  ↓
S3 Static Website Assets
  ↓
Browser SPA
  ↓
RootLence Backend API
```

The frontend is built as static files and deployed to S3 behind CloudFront.

No frontend load balancer is required.

---

## Technology Stack

```text
Framework:       React
Language:        TypeScript
Build Tool:      Vite
Routing:         TanStack Router
Server State:    TanStack Query
Styling:         Tailwind CSS
UI Components:   shadcn/ui
Forms:           React Hook Form
Validation:      Zod
Testing:         Vitest, React Testing Library, Playwright
Deployment:      S3 + CloudFront
```

---

## Architectural Style

The frontend uses feature-based architecture.

Main structure:

```text
apps/
  web/
    src/
      app/
      pages/
      features/
      shared/
```

The goal is to keep product features isolated and understandable for both humans and AI agents.

---

## Repository Structure

Recommended frontend structure:

```text
apps/
  web/
    public/
    src/
      app/
        router.tsx
        providers.tsx
        query-client.ts
        config.ts
      pages/
        dashboard/
        incidents/
        investigations/
        postmortems/
        settings/
      features/
        incidents/
          api/
          components/
          hooks/
          models/
          pages/
        investigations/
          api/
          components/
          hooks/
          models/
          pages/
        postmortems/
          api/
          components/
          hooks/
          models/
          pages/
      shared/
        api/
        components/
          ui/
          layout/
          forms/
          feedback/
        hooks/
        lib/
        types/
        utils/
        auth/
      main.tsx
    package.json
    vite.config.ts
    tsconfig.json
```

---

## Application Layer

The `src/app` folder contains global application setup.

Responsibilities:

```text
router setup
global providers
query client setup
configuration
error boundaries
authentication bootstrap
```

No business feature logic should live in `app`.

---

## Pages Layer

The `src/pages` folder contains route-level page composition.

Pages should compose feature components, but avoid deep business logic.

Preferred flow:

```text
Page → Feature components → Hooks/API client → Backend
```

---

## Features Layer

The `src/features` folder contains product feature modules.

Initial feature modules:

```text
incidents
investigations
postmortems
```

Each feature owns:

```text
feature-specific components
feature-specific hooks
feature-specific API wrappers
feature-specific models
feature-specific pages or page sections
```

Features should not directly depend on each other unless explicitly needed.

Shared logic should move to `shared`.

---

## Shared Layer

The `src/shared` folder contains reusable cross-feature building blocks.

Examples:

```text
shared/api
shared/components
shared/hooks
shared/lib
shared/types
shared/utils
shared/auth
```

Rules:

```text
shared must not import from features
shared must be generic and reusable
shared should not contain product-specific workflows
```

---

## API Communication

The frontend communicates with the backend through generated API clients.

Preferred approach:

```text
OpenAPI contract → generated TypeScript client → feature hooks
```

Benefits:

```text
strong typing
fewer duplicated DTOs
less AI-generated contract drift
safer refactoring
```

Manual API DTO duplication should be avoided.

---

## Server State Management

TanStack Query is used for all server state.

Use it for:

```text
fetching incidents
fetching investigations
fetching postmortems
running mutations
polling AI job status
cache invalidation
loading and error states
```

Avoid storing server data in global client state.

---

## Client State Management

Keep client state local by default.

Use local React state for:

```text
dialogs
filters
selected tabs
local form state
temporary UI state
```

Introduce global client state only when really needed.

Do not introduce Redux for the MVP.

---

## Routing

TanStack Router is used for routing.

Initial route groups:

```text
/
 /dashboard
 /incidents
 /incidents/:incidentId
 /investigations
 /investigations/:investigationId
 /postmortems
 /postmortems/:postmortemId
 /rca-assistant
 /settings
```

Routes should be typed and organized around product workflows.

---

## UI Components

Use `shadcn/ui` and Tailwind CSS.

Component categories:

```text
shared/components/ui        - shadcn base components
shared/components/layout    - app shell, sidebar, header
shared/components/forms     - reusable form components
shared/components/feedback  - loading, empty states, errors
features/*/components       - feature-specific UI
```

Rules:

```text
Prefer composition over complex abstractions.
Keep components small.
Use clear names.
Avoid over-generic components too early.
```

---

## Forms and Validation

Use:

```text
React Hook Form
Zod
```

Validation should be close to the form.

Examples:

```text
CreateIncidentForm
StartInvestigationForm
PostmortemReviewForm
```

---

## Authentication and Authorization

Authentication is handled through an external identity provider.

Possible providers:

```text
AWS Cognito
Auth0
Clerk
```

The frontend should handle:

```text
login
logout
token storage
authenticated routes
user profile context
tenant context
role/permission-aware UI
```

Authorization must still be enforced by the backend.

Frontend authorization is only for user experience.

---

## Multi-Tenancy

The frontend is tenant-aware.

Tenant context is resolved after authentication.

The UI should support:

```text
current tenant context
tenant-specific data
tenant switcher later
role-based access control later
```

Every API request should include authentication credentials that allow the backend to resolve `tenant_id`.

The frontend should not manually construct tenant isolation rules.

Tenant security belongs to the backend.

---

## AI / RCA Assistant UI

AI features should be treated as asynchronous workflows.

Examples:

```text
run RCA analysis
generate postmortem draft
summarize incident timeline
find similar incidents
generate monthly report
```

Preferred UI pattern:

```text
start AI job
show progress
poll job status
display result
allow user review/edit
save final output
```

AI output should not be blindly trusted.

The UI should clearly distinguish:

```text
AI-generated draft
human-reviewed final version
```

---

## Error Handling

Frontend should handle errors consistently.

Required patterns:

```text
global error boundary
API error normalization
toast notifications
inline form errors
empty states
retry actions where appropriate
```

API errors should be mapped into user-friendly messages.

---

## Observability

Frontend observability should initially use simple browser-side telemetry.

Recommended signals:

```text
page load errors
API request failures
AI job failures
frontend exceptions
slow page interactions
```

Possible tools:

```text
CloudWatch RUM
Sentry
OpenTelemetry browser SDK later
```

For MVP, keep frontend observability simple.

---

## Testing Strategy

Use different test levels:

```text
Unit tests:
- pure utility functions
- small components
- hooks where valuable

Integration tests:
- feature components with mocked API
- form validation
- routing behavior

E2E tests:
- core user workflows
```

Recommended tools:

```text
Vitest
React Testing Library
Playwright
MSW for API mocks
```

Initial critical E2E workflows:

```text
create incident
open incident details
start investigation
generate postmortem draft
run RCA assistant
```

---

## Deployment

The frontend is deployed as static assets.

Build output:

```text
apps/web/dist
```

Deployment target:

```text
S3 bucket
CloudFront distribution
Route 53 custom domain
ACM TLS certificate
```

Deployment flow:

```text
install dependencies
run typecheck
run tests
build Vite app
upload dist to S3
invalidate CloudFront cache
```

---

## Configuration

Runtime configuration should be explicit.

Examples:

```text
API base URL
auth provider config
environment name
feature flags
observability config
```

Avoid hardcoding environment-specific values in source code.

Recommended environments:

```text
local
dev
staging
prod
```

---

## Agent-Driven Development Rules

This frontend is expected to be frequently modified by AI coding agents.

Rules for agents:

```text
Follow the existing folder structure.
Prefer feature-local code.
Do not introduce new global state libraries without approval.
Do not duplicate API DTOs manually.
Use generated API clients.
Use TanStack Query for server state.
Use React Hook Form + Zod for forms.
Use shadcn/ui for UI primitives.
Keep components small and readable.
Add tests for non-trivial logic.
Do not create over-generic abstractions too early.
```

---

## Explicit Non-Goals for MVP

Avoid in the MVP:

```text
Next.js SSR
complex micro-frontends
Redux
GraphQL
custom design system from scratch
heavy animation framework
premature multi-app frontend split
complex plugin architecture
```

The goal is to build a simple, static, maintainable SaaS frontend that AI agents can safely extend.

---

## Architecture Decision Summary

Current decisions:

```text
Use React + TypeScript.
Use Vite for build tooling.
Use TanStack Router for routing.
Use TanStack Query for server state.
Use Tailwind CSS and shadcn/ui for UI.
Use React Hook Form and Zod for forms.
Use OpenAPI-generated TypeScript clients.
Deploy as static assets to S3 + CloudFront.
Keep feature boundaries explicit.
Avoid SSR and frontend load balancers in the MVP.
```
