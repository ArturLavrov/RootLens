# INC-0083: checkout-platform delayed payment status updates due to retry storm saturated shared redis

## Metadata

- Date: 2025-09-12
- Severity: SEV2
- Region: EU-West
- Failure family: Cascading Failures
- Primary service: checkout-platform
- Primary technology: SQL Server
- Ground truth pattern: lack of isolation

## Summary

A production incident affected the `checkout-platform` flow and caused delayed payment status updates. The immediate technical trigger was **retry storm saturated shared Redis**, but the broader failure pattern was **lack of isolation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the EU-West region. The incident lasted approximately 54 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- retry spikes
- connection pool pressure
- inconsistent state observed by customers
- traffic shifted to unhealthy path
- slow dependency calls
- delayed async processing

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed retry spikes and connection pool pressure in checkout-platform.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected lack of isolation.
- 09:48 — Mitigation started: add temporary rate limit and rollback recent change.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 54 minutes total duration.

## Root Cause

The root cause was **retry storm saturated shared Redis** affecting `checkout-platform` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- lack of isolation
- weak alerting
- synchronized traffic bursts
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-platform`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- add temporary rate limit
- rollback recent change
- manually replay failed messages

## Preventive Actions

- add dependency saturation dashboard
- add SLO alerting
- add load test scenario
- document runbook

## Lessons Learned

This incident shows that **lack of isolation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: lack of isolation
- Useful query terms: checkout-platform, SQL Server, lack of isolation, retry storm saturated shared Redis
