# INC-0036: customer-profile-service merchant portal degradation due to negative cache retained too long

## Metadata

- Date: 2025-04-24
- Severity: SEV1
- Region: Global
- Failure family: Cache Failures
- Primary service: customer-profile-service
- Primary technology: Lua script
- Ground truth pattern: stale data

## Summary

A production incident affected the `customer-profile-service` flow and caused merchant portal degradation. The immediate technical trigger was **negative cache retained too long**, but the broader failure pattern was **stale data**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the Global region. The incident lasted approximately 174 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- increased timeout rate
- queue growth
- intermittent 5xx errors
- delayed async processing
- cache hit ratio drop
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed increased timeout rate and queue growth in customer-profile-service.
- 09:27 — Triage linked the issue to Lua script behavior and suspected stale data.
- 09:48 — Mitigation started: manually replay failed messages and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 174 minutes total duration.

## Root Cause

The root cause was **negative cache retained too long** affecting `customer-profile-service` through `Lua script`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- stale data
- missing circuit breaker
- unclear ownership
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `customer-profile-service`, `Lua script`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- add temporary rate limit
- scale consumers

## Preventive Actions

- enforce config validation
- add dependency saturation dashboard
- add bulkhead isolation
- document runbook

## Lessons Learned

This incident shows that **stale data** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: stale data
- Useful query terms: customer-profile-service, Lua script, stale data, negative cache retained too long
