# INC-0013: notification-dispatcher partial payment failures due to retry loop after downstream timeout

## Metadata

- Date: 2025-02-15
- Severity: SEV1
- Region: EU-West
- Failure family: Retry Storms
- Primary service: notification-dispatcher
- Primary technology: Redis
- Ground truth pattern: dependency saturation

## Summary

A production incident affected the `notification-dispatcher` flow and caused partial payment failures. The immediate technical trigger was **retry loop after downstream timeout**, but the broader failure pattern was **dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the EU-West region. The incident lasted approximately 69 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- increased timeout rate
- inconsistent state observed by customers
- queue growth
- pod restarts
- retry attempts exceeded normal baseline
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed increased timeout rate and inconsistent state observed by customers in notification-dispatcher.
- 09:27 — Triage linked the issue to Redis behavior and suspected dependency saturation.
- 09:48 — Mitigation started: increase connection pool limit and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 69 minutes total duration.

## Root Cause

The root cause was **retry loop after downstream timeout** affecting `notification-dispatcher` through `Redis`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency saturation
- unclear ownership
- insufficient backpressure
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `notification-dispatcher`, `Redis`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- add temporary rate limit
- disable feature flag

## Preventive Actions

- add canary validation
- add load test scenario
- document runbook
- add cache invalidation test

## Lessons Learned

This incident shows that **dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: dependency saturation
- Useful query terms: notification-dispatcher, Redis, dependency saturation, retry loop after downstream timeout
