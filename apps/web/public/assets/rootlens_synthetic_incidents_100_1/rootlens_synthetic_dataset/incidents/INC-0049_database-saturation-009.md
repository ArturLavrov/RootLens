# INC-0049: settlement-worker partial payment failures due to deadlock loop

## Metadata

- Date: 2025-06-01
- Severity: SEV3
- Region: Global
- Failure family: Database Saturation
- Primary service: settlement-worker
- Primary technology: MySQL
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `settlement-worker` flow and caused partial payment failures. The immediate technical trigger was **deadlock loop**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the Global region. The incident lasted approximately 58 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- slow queries
- blocked sessions
- connection pool pressure
- partial customer impact
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed manual mitigation required and slow queries in settlement-worker.
- 09:27 — Triage linked the issue to MySQL behavior and suspected queue buildup.
- 09:48 — Mitigation started: disable feature flag and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 58 minutes total duration.

## Root Cause

The root cause was **deadlock loop** affecting `settlement-worker` through `MySQL`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- manual rollback process
- insufficient backpressure
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-worker`, `MySQL`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- reduce retry rate
- route traffic away from degraded dependency

## Preventive Actions

- add canary validation
- add load test scenario
- enforce config validation
- add cache invalidation test

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: settlement-worker, MySQL, queue buildup, deadlock loop
