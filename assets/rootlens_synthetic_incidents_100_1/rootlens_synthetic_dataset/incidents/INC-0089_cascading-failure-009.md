# INC-0089: checkout-platform merchant portal degradation due to central auth dependency degraded all apis

## Metadata

- Date: 2025-10-01
- Severity: SEV3
- Region: EU-West
- Failure family: Cascading Failures
- Primary service: checkout-platform
- Primary technology: Redis
- Ground truth pattern: shared dependency saturation

## Summary

A production incident affected the `checkout-platform` flow and caused merchant portal degradation. The immediate technical trigger was **central auth dependency degraded all APIs**, but the broader failure pattern was **shared dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the EU-West region. The incident lasted approximately 60 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- partial customer impact
- slow dependency calls
- shared dependency saturated
- retry spikes
- pod restarts

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed intermittent 5xx errors and partial customer impact in checkout-platform.
- 09:27 — Triage linked the issue to Redis behavior and suspected shared dependency saturation.
- 09:48 — Mitigation started: disable feature flag and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 60 minutes total duration.

## Root Cause

The root cause was **central auth dependency degraded all APIs** affecting `checkout-platform` through `Redis`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- shared dependency saturation
- synchronized traffic bursts
- high-cardinality metrics
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-platform`, `Redis`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- manually replay failed messages
- add temporary rate limit

## Preventive Actions

- add synthetic transaction check
- improve idempotency handling
- add load test scenario
- add cache invalidation test

## Lessons Learned

This incident shows that **shared dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: shared dependency saturation
- Useful query terms: checkout-platform, Redis, shared dependency saturation, central auth dependency degraded all APIs
