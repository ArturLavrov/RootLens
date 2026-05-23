# INC-0048: backoffice-api partial payment failures due to read replica overload

## Metadata

- Date: 2025-05-31
- Severity: SEV2
- Region: Global
- Failure family: Database Saturation
- Primary service: backoffice-api
- Primary technology: SQL Server
- Ground truth pattern: dependency saturation

## Summary

A production incident affected the `backoffice-api` flow and caused partial payment failures. The immediate technical trigger was **read replica overload**, but the broader failure pattern was **dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the Global region. The incident lasted approximately 170 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- increased timeout rate
- blocked sessions
- partial customer impact
- delayed async processing
- pod restarts

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed intermittent 5xx errors and increased timeout rate in backoffice-api.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected dependency saturation.
- 09:48 — Mitigation started: disable feature flag and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 170 minutes total duration.

## Root Cause

The root cause was **read replica overload** affecting `backoffice-api` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency saturation
- weak alerting
- unclear ownership
- synchronized traffic bursts

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `backoffice-api`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- restart affected pods
- manually replay failed messages

## Preventive Actions

- add bulkhead isolation
- add load test scenario
- introduce jittered exponential backoff
- improve idempotency handling

## Lessons Learned

This incident shows that **dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: dependency saturation
- Useful query terms: backoffice-api, SQL Server, dependency saturation, read replica overload
