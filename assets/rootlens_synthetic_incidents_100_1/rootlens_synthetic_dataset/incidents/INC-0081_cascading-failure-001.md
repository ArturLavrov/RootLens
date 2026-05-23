# INC-0081: risk-platform elevated checkout latency due to local dependency degradation propagated through fan-out calls

## Metadata

- Date: 2025-09-06
- Severity: SEV3
- Region: US
- Failure family: Cascading Failures
- Primary service: risk-platform
- Primary technology: Redis
- Ground truth pattern: failure propagation

## Summary

A production incident affected the `risk-platform` flow and caused elevated checkout latency. The immediate technical trigger was **local dependency degradation propagated through fan-out calls**, but the broader failure pattern was **failure propagation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US region. The incident lasted approximately 148 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- CPU saturation
- manual mitigation required
- connection pool pressure
- retry spikes
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed delayed async processing and CPU saturation in risk-platform.
- 09:27 — Triage linked the issue to Redis behavior and suspected failure propagation.
- 09:48 — Mitigation started: increase connection pool limit and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 148 minutes total duration.

## Root Cause

The root cause was **local dependency degradation propagated through fan-out calls** affecting `risk-platform` through `Redis`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- failure propagation
- missing circuit breaker
- synchronized traffic bursts
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-platform`, `Redis`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- route traffic away from degraded dependency
- disable feature flag

## Preventive Actions

- enforce config validation
- add cache invalidation test
- add dependency saturation dashboard
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **failure propagation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: failure propagation
- Useful query terms: risk-platform, Redis, failure propagation, local dependency degradation propagated through fan-out calls
