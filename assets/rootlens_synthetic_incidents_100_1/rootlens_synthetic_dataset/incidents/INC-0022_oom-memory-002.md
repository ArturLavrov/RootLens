# INC-0022: notification-service delayed payouts due to high-cardinality opentelemetry metrics

## Metadata

- Date: 2025-03-12
- Severity: SEV1
- Region: US
- Failure family: OOM / Memory Leaks
- Primary service: notification-service
- Primary technology: ASP.NET Core
- Ground truth pattern: GC pauses

## Summary

A production incident affected the `notification-service` flow and caused delayed payouts. The immediate technical trigger was **high-cardinality OpenTelemetry metrics**, but the broader failure pattern was **GC pauses**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the US region. The incident lasted approximately 101 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- elevated p95 latency
- OOMKilled pods
- queue growth
- CPU saturation
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed intermittent 5xx errors and elevated p95 latency in notification-service.
- 09:27 — Triage linked the issue to ASP.NET Core behavior and suspected GC pauses.
- 09:48 — Mitigation started: manually replay failed messages and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 101 minutes total duration.

## Root Cause

The root cause was **high-cardinality OpenTelemetry metrics** affecting `notification-service` through `ASP.NET Core`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- GC pauses
- missing circuit breaker
- limited runbook coverage
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `notification-service`, `ASP.NET Core`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- add temporary rate limit
- scale consumers

## Preventive Actions

- enforce config validation
- add synthetic transaction check
- add cache invalidation test
- document runbook

## Lessons Learned

This incident shows that **GC pauses** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: GC pauses
- Useful query terms: notification-service, ASP.NET Core, GC pauses, high-cardinality OpenTelemetry metrics
