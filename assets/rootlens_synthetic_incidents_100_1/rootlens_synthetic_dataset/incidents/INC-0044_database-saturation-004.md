# INC-0044: payment-api merchant portal degradation due to replication lag

## Metadata

- Date: 2025-05-18
- Severity: SEV2
- Region: US-East
- Failure family: Database Saturation
- Primary service: payment-api
- Primary technology: read replica
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `payment-api` flow and caused merchant portal degradation. The immediate technical trigger was **replication lag**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the US-East region. The incident lasted approximately 188 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- partial customer impact
- inconsistent state observed by customers
- delayed async processing
- CPU saturation
- connection pool pressure

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed manual mitigation required and partial customer impact in payment-api.
- 09:27 — Triage linked the issue to read replica behavior and suspected queue buildup.
- 09:48 — Mitigation started: manually replay failed messages and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 188 minutes total duration.

## Root Cause

The root cause was **replication lag** affecting `payment-api` through `read replica`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- insufficient backpressure
- missing circuit breaker
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-api`, `read replica`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- clear stale cache entries
- scale consumers

## Preventive Actions

- add dependency saturation dashboard
- enforce config validation
- add cache invalidation test
- add bulkhead isolation

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: payment-api, read replica, queue buildup, replication lag
