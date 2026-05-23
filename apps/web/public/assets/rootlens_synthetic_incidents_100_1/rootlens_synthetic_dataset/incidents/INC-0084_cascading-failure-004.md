# INC-0084: risk-platform increased error rate due to shared database pool exhausted across services

## Metadata

- Date: 2025-09-15
- Severity: SEV2
- Region: US-East
- Failure family: Cascading Failures
- Primary service: risk-platform
- Primary technology: RabbitMQ
- Ground truth pattern: failure propagation

## Summary

A production incident affected the `risk-platform` flow and caused increased error rate. The immediate technical trigger was **shared database pool exhausted across services**, but the broader failure pattern was **failure propagation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the US-East region. The incident lasted approximately 96 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- traffic shifted to unhealthy path
- queue growth
- manual mitigation required
- multiple services degraded
- inconsistent state observed by customers
- pod restarts

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed traffic shifted to unhealthy path and queue growth in risk-platform.
- 09:27 — Triage linked the issue to RabbitMQ behavior and suspected failure propagation.
- 09:48 — Mitigation started: rollback recent change and enable circuit breaker.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 96 minutes total duration.

## Root Cause

The root cause was **shared database pool exhausted across services** affecting `risk-platform` through `RabbitMQ`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- failure propagation
- high-cardinality metrics
- limited runbook coverage
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-platform`, `RabbitMQ`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- enable circuit breaker
- route traffic away from degraded dependency

## Preventive Actions

- enforce config validation
- add synthetic transaction check
- improve idempotency handling
- document runbook

## Lessons Learned

This incident shows that **failure propagation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: failure propagation
- Useful query terms: risk-platform, RabbitMQ, failure propagation, shared database pool exhausted across services
