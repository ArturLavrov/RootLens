# INC-0012: checkout-api inconsistent payment method availability due to missing exponential backoff

## Metadata

- Date: 2025-02-11
- Severity: SEV3
- Region: APAC
- Failure family: Retry Storms
- Primary service: checkout-api
- Primary technology: Redis
- Ground truth pattern: partial degradation amplified by retries

## Summary

A production incident affected the `checkout-api` flow and caused inconsistent payment method availability. The immediate technical trigger was **missing exponential backoff**, but the broader failure pattern was **partial degradation amplified by retries**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the APAC region. The incident lasted approximately 138 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- retry attempts exceeded normal baseline
- manual mitigation required
- connection pool pressure
- inconsistent state observed by customers
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed delayed async processing and retry attempts exceeded normal baseline in checkout-api.
- 09:27 — Triage linked the issue to Redis behavior and suspected partial degradation amplified by retries.
- 09:48 — Mitigation started: scale consumers and rollback recent change.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 138 minutes total duration.

## Root Cause

The root cause was **missing exponential backoff** affecting `checkout-api` through `Redis`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial degradation amplified by retries
- weak alerting
- unclear ownership
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `Redis`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- rollback recent change
- disable feature flag

## Preventive Actions

- add SLO alerting
- add canary validation
- add cache invalidation test
- add bulkhead isolation

## Lessons Learned

This incident shows that **partial degradation amplified by retries** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: partial degradation amplified by retries
- Useful query terms: checkout-api, Redis, partial degradation amplified by retries, missing exponential backoff
