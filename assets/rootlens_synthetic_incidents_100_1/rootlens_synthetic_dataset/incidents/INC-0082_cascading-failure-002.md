# INC-0082: merchant-platform increased error rate due to queue backlog exhausted downstream consumers

## Metadata

- Date: 2025-09-10
- Severity: SEV2
- Region: US-East
- Failure family: Cascading Failures
- Primary service: merchant-platform
- Primary technology: Kubernetes HPA
- Ground truth pattern: failure propagation

## Summary

A production incident affected the `merchant-platform` flow and caused increased error rate. The immediate technical trigger was **queue backlog exhausted downstream consumers**, but the broader failure pattern was **failure propagation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the US-East region. The incident lasted approximately 110 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- manual mitigation required
- retry spikes
- pod restarts
- connection pool pressure
- elevated p95 latency

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed partial customer impact and manual mitigation required in merchant-platform.
- 09:27 — Triage linked the issue to Kubernetes HPA behavior and suspected failure propagation.
- 09:48 — Mitigation started: clear stale cache entries and enable circuit breaker.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 110 minutes total duration.

## Root Cause

The root cause was **queue backlog exhausted downstream consumers** affecting `merchant-platform` through `Kubernetes HPA`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- failure propagation
- missing circuit breaker
- insufficient load testing
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `merchant-platform`, `Kubernetes HPA`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- enable circuit breaker
- add temporary rate limit

## Preventive Actions

- add canary validation
- document runbook
- add cache invalidation test
- add load test scenario

## Lessons Learned

This incident shows that **failure propagation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: failure propagation
- Useful query terms: merchant-platform, Kubernetes HPA, failure propagation, queue backlog exhausted downstream consumers
