# INC-0020: notification-dispatcher delayed payouts due to retry storm during partial dependency degradation

## Metadata

- Date: 2025-03-07
- Severity: SEV2
- Region: EU
- Failure family: Retry Storms
- Primary service: notification-dispatcher
- Primary technology: SQL Server
- Ground truth pattern: dependency saturation

## Summary

A production incident affected the `notification-dispatcher` flow and caused delayed payouts. The immediate technical trigger was **retry storm during partial dependency degradation**, but the broader failure pattern was **dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the EU region. The incident lasted approximately 106 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- burst traffic to downstream dependency
- increased timeout rate
- delayed async processing
- intermittent 5xx errors
- connection pool pressure

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed inconsistent state observed by customers and burst traffic to downstream dependency in notification-dispatcher.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected dependency saturation.
- 09:48 — Mitigation started: increase connection pool limit and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 106 minutes total duration.

## Root Cause

The root cause was **retry storm during partial dependency degradation** affecting `notification-dispatcher` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency saturation
- high-cardinality metrics
- manual rollback process
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `notification-dispatcher`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- clear stale cache entries
- disable feature flag

## Preventive Actions

- introduce jittered exponential backoff
- document runbook
- enforce config validation
- add bulkhead isolation

## Lessons Learned

This incident shows that **dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: dependency saturation
- Useful query terms: notification-dispatcher, SQL Server, dependency saturation, retry storm during partial dependency degradation
