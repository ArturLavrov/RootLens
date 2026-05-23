# INC-0011: notification-dispatcher merchant portal degradation due to aggressive client retry policy

## Metadata

- Date: 2025-02-07
- Severity: SEV2
- Region: APAC
- Failure family: Retry Storms
- Primary service: notification-dispatcher
- Primary technology: Redis
- Ground truth pattern: dependency saturation

## Summary

A production incident affected the `notification-dispatcher` flow and caused merchant portal degradation. The immediate technical trigger was **aggressive client retry policy**, but the broader failure pattern was **dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the APAC region. The incident lasted approximately 85 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- CPU saturation
- manual mitigation required
- connection pool pressure
- increased timeout rate
- elevated p95 latency
- burst traffic to downstream dependency

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed CPU saturation and manual mitigation required in notification-dispatcher.
- 09:27 — Triage linked the issue to Redis behavior and suspected dependency saturation.
- 09:48 — Mitigation started: enable circuit breaker and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 85 minutes total duration.

## Root Cause

The root cause was **aggressive client retry policy** affecting `notification-dispatcher` through `Redis`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency saturation
- insufficient backpressure
- missing circuit breaker
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `notification-dispatcher`, `Redis`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- increase connection pool limit
- route traffic away from degraded dependency

## Preventive Actions

- add synthetic transaction check
- document runbook
- enforce config validation
- add SLO alerting

## Lessons Learned

This incident shows that **dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: dependency saturation
- Useful query terms: notification-dispatcher, Redis, dependency saturation, aggressive client retry policy
