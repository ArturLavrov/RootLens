# INC-0019: transaction-worker delayed payment status updates due to consumer retry amplification

## Metadata

- Date: 2025-03-04
- Severity: SEV3
- Region: EU
- Failure family: Retry Storms
- Primary service: transaction-worker
- Primary technology: SQL Server
- Ground truth pattern: queue growth

## Summary

A production incident affected the `transaction-worker` flow and caused delayed payment status updates. The immediate technical trigger was **consumer retry amplification**, but the broader failure pattern was **queue growth**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the EU region. The incident lasted approximately 67 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- increased timeout rate
- slow dependency calls
- pod restarts
- partial customer impact
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed elevated p95 latency and increased timeout rate in transaction-worker.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected queue growth.
- 09:48 — Mitigation started: increase connection pool limit and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 67 minutes total duration.

## Root Cause

The root cause was **consumer retry amplification** affecting `transaction-worker` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue growth
- manual rollback process
- insufficient load testing
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `transaction-worker`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- add temporary rate limit
- scale consumers

## Preventive Actions

- add load test scenario
- add SLO alerting
- enforce config validation
- improve idempotency handling

## Lessons Learned

This incident shows that **queue growth** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: queue growth
- Useful query terms: transaction-worker, SQL Server, queue growth, consumer retry amplification
