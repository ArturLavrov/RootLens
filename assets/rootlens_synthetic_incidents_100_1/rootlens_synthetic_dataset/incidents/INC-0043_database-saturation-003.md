# INC-0043: settlement-worker inconsistent payment method availability due to lock contention during batch update

## Metadata

- Date: 2025-05-16
- Severity: SEV3
- Region: US-East
- Failure family: Database Saturation
- Primary service: settlement-worker
- Primary technology: SQL Server
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `settlement-worker` flow and caused inconsistent payment method availability. The immediate technical trigger was **lock contention during batch update**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US-East region. The incident lasted approximately 119 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- CPU saturation
- elevated p95 latency
- retry spikes
- connection pool pressure
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed intermittent 5xx errors and CPU saturation in settlement-worker.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected queue buildup.
- 09:48 — Mitigation started: reduce retry rate and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 119 minutes total duration.

## Root Cause

The root cause was **lock contention during batch update** affecting `settlement-worker` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- lack of bulkhead isolation
- missing circuit breaker
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-worker`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- disable feature flag
- route traffic away from degraded dependency

## Preventive Actions

- add SLO alerting
- introduce jittered exponential backoff
- enforce config validation
- improve idempotency handling

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: settlement-worker, SQL Server, queue buildup, lock contention during batch update
