# INC-0090: checkout-platform increased error rate due to search/indexing outage blocked checkout path

## Metadata

- Date: 2025-10-04
- Severity: SEV2
- Region: Global
- Failure family: Cascading Failures
- Primary service: checkout-platform
- Primary technology: SQL Server
- Ground truth pattern: shared dependency saturation

## Summary

A production incident affected the `checkout-platform` flow and caused increased error rate. The immediate technical trigger was **search/indexing outage blocked checkout path**, but the broader failure pattern was **shared dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the Global region. The incident lasted approximately 100 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- slow dependency calls
- CPU saturation
- intermittent 5xx errors
- inconsistent state observed by customers
- shared dependency saturated

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed elevated p95 latency and slow dependency calls in checkout-platform.
- 09:27 — Triage linked the issue to SQL Server behavior and suspected shared dependency saturation.
- 09:48 — Mitigation started: add temporary rate limit and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 100 minutes total duration.

## Root Cause

The root cause was **search/indexing outage blocked checkout path** affecting `checkout-platform` through `SQL Server`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- shared dependency saturation
- synchronized traffic bursts
- unclear ownership
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-platform`, `SQL Server`, and downstream impact was not immediately visible.

## Resolution

- add temporary rate limit
- route traffic away from degraded dependency
- enable circuit breaker

## Preventive Actions

- add bulkhead isolation
- improve idempotency handling
- enforce config validation
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **shared dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: shared dependency saturation
- Useful query terms: checkout-platform, SQL Server, shared dependency saturation, search/indexing outage blocked checkout path
