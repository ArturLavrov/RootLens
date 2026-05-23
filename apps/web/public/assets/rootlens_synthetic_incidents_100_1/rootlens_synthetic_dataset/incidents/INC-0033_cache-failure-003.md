# INC-0033: customer-profile-service inconsistent payment method availability due to missing ttl for eligibility cache

## Metadata

- Date: 2025-04-15
- Severity: SEV2
- Region: EU-West
- Failure family: Cache Failures
- Primary service: customer-profile-service
- Primary technology: ElastiCache
- Ground truth pattern: DB load spike

## Summary

A production incident affected the `customer-profile-service` flow and caused inconsistent payment method availability. The immediate technical trigger was **missing TTL for eligibility cache**, but the broader failure pattern was **DB load spike**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU-West region. The incident lasted approximately 156 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- cache hit ratio drop
- database traffic spike
- intermittent 5xx errors
- stale cached values
- partial customer impact

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed queue growth and cache hit ratio drop in customer-profile-service.
- 09:27 — Triage linked the issue to ElastiCache behavior and suspected DB load spike.
- 09:48 — Mitigation started: disable feature flag and enable circuit breaker.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 156 minutes total duration.

## Root Cause

The root cause was **missing TTL for eligibility cache** affecting `customer-profile-service` through `ElastiCache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- DB load spike
- weak alerting
- high-cardinality metrics
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `customer-profile-service`, `ElastiCache`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- enable circuit breaker
- clear stale cache entries

## Preventive Actions

- add SLO alerting
- add cache invalidation test
- add bulkhead isolation
- add load test scenario

## Lessons Learned

This incident shows that **DB load spike** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: DB load spike
- Useful query terms: customer-profile-service, ElastiCache, DB load spike, missing TTL for eligibility cache
