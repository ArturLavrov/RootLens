# INC-0078: fraud-service merchant portal degradation due to object storage latency

## Metadata

- Date: 2025-08-29
- Severity: SEV1
- Region: US-East
- Failure family: Dependency Timeouts
- Primary service: fraud-service
- Primary technology: third-party provider API
- Ground truth pattern: slow dependency

## Summary

A production incident affected the `fraud-service` flow and caused merchant portal degradation. The immediate technical trigger was **object storage latency**, but the broader failure pattern was **slow dependency**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the US-East region. The incident lasted approximately 115 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- elevated p95 latency
- retry spikes
- slow dependency calls
- inconsistent state observed by customers
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed partial customer impact and elevated p95 latency in fraud-service.
- 09:27 — Triage linked the issue to third-party provider API behavior and suspected slow dependency.
- 09:48 — Mitigation started: scale consumers and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 115 minutes total duration.

## Root Cause

The root cause was **object storage latency** affecting `fraud-service` through `third-party provider API`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- slow dependency
- insufficient backpressure
- weak alerting
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `fraud-service`, `third-party provider API`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- restart affected pods
- add temporary rate limit

## Preventive Actions

- enforce config validation
- improve idempotency handling
- add SLO alerting
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **slow dependency** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: slow dependency
- Useful query terms: fraud-service, third-party provider API, slow dependency, object storage latency
