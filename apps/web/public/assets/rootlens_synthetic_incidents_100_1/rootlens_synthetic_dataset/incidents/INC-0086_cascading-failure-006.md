# INC-0086: risk-platform inconsistent payment method availability due to partial outage amplified by synchronous dependency chain

## Metadata

- Date: 2025-09-22
- Severity: SEV3
- Region: US
- Failure family: Cascading Failures
- Primary service: risk-platform
- Primary technology: RabbitMQ
- Ground truth pattern: lack of isolation

## Summary

A production incident affected the `risk-platform` flow and caused inconsistent payment method availability. The immediate technical trigger was **partial outage amplified by synchronous dependency chain**, but the broader failure pattern was **lack of isolation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US region. The incident lasted approximately 105 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- queue growth
- manual mitigation required
- retry spikes
- CPU saturation
- connection pool pressure

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed inconsistent state observed by customers and queue growth in risk-platform.
- 09:27 — Triage linked the issue to RabbitMQ behavior and suspected lack of isolation.
- 09:48 — Mitigation started: route traffic away from degraded dependency and rollback recent change.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 105 minutes total duration.

## Root Cause

The root cause was **partial outage amplified by synchronous dependency chain** affecting `risk-platform` through `RabbitMQ`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- lack of isolation
- limited runbook coverage
- synchronized traffic bursts
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-platform`, `RabbitMQ`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- rollback recent change
- reduce retry rate

## Preventive Actions

- enforce config validation
- add bulkhead isolation
- add synthetic transaction check
- document runbook

## Lessons Learned

This incident shows that **lack of isolation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: lack of isolation
- Useful query terms: risk-platform, RabbitMQ, lack of isolation, partial outage amplified by synchronous dependency chain
