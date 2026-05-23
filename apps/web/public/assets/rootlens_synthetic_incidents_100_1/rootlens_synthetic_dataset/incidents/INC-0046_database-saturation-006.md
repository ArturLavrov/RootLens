# INC-0046: ledger-service partial payment failures due to long-running transaction

## Metadata

- Date: 2025-05-25
- Severity: SEV2
- Region: US-East
- Failure family: Database Saturation
- Primary service: ledger-service
- Primary technology: read replica
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `ledger-service` flow and caused partial payment failures. The immediate technical trigger was **long-running transaction**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the US-East region. The incident lasted approximately 141 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- increased timeout rate
- CPU saturation
- blocked sessions
- slow dependency calls
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed partial customer impact and increased timeout rate in ledger-service.
- 09:27 — Triage linked the issue to read replica behavior and suspected queue buildup.
- 09:48 — Mitigation started: clear stale cache entries and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 141 minutes total duration.

## Root Cause

The root cause was **long-running transaction** affecting `ledger-service` through `read replica`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- manual rollback process
- high-cardinality metrics
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `ledger-service`, `read replica`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- scale consumers
- increase connection pool limit

## Preventive Actions

- add synthetic transaction check
- add dependency saturation dashboard
- document runbook
- enforce config validation

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: ledger-service, read replica, queue buildup, long-running transaction
