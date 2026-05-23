# INC-0015: fraud-checker increased error rate due to unbounded sdk retries

## Metadata

- Date: 2025-02-21
- Severity: SEV2
- Region: US-East
- Failure family: Retry Storms
- Primary service: fraud-checker
- Primary technology: SQL Server
- Ground truth pattern: queue growth

## Summary

A production incident affected the `fraud-checker` flow and caused increased error rate. The immediate technical trigger was **unbounded SDK retries**, but the broader failure pattern was **queue growth**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the US-East region. The incident lasted approximately 24 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- inconsistent state observed by customers
- increased timeout rate
- retry spikes
- retry attempts exceeded normal baseline
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed intermittent 5xx errors and inconsistent state observed by customers in fraud-checker.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected queue growth.
- 09:48 — Mitigation started: clear stale cache entries and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 24 minutes total duration.

## Root Cause

The root cause was **unbounded SDK retries** affecting `fraud-checker` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue growth
- missing circuit breaker
- insufficient load testing
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `fraud-checker`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- manually replay failed messages
- scale consumers

## Preventive Actions

- add canary validation
- document runbook
- add load test scenario
- add synthetic transaction check

## Lessons Learned

This incident shows that **queue growth** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: queue growth
- Useful query terms: fraud-checker, SQL Server, queue growth, unbounded SDK retries
