# INC-0038: payment-methods-api inconsistent payment method availability due to inconsistent cache key generation

## Metadata

- Date: 2025-04-29
- Severity: SEV3
- Region: US-East
- Failure family: Cache Failures
- Primary service: payment-methods-api
- Primary technology: ElastiCache
- Ground truth pattern: stale data

## Summary

A production incident affected the `payment-methods-api` flow and caused inconsistent payment method availability. The immediate technical trigger was **inconsistent cache key generation**, but the broader failure pattern was **stale data**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US-East region. The incident lasted approximately 90 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- CPU saturation
- connection pool pressure
- inconsistent state observed by customers
- stale cached values
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed partial customer impact and CPU saturation in payment-methods-api.
- 09:27 — Triage linked the issue to ElastiCache behavior and suspected stale data.
- 09:48 — Mitigation started: reduce retry rate and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 90 minutes total duration.

## Root Cause

The root cause was **inconsistent cache key generation** affecting `payment-methods-api` through `ElastiCache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- stale data
- weak alerting
- manual rollback process
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-methods-api`, `ElastiCache`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- route traffic away from degraded dependency
- restart affected pods

## Preventive Actions

- enforce config validation
- add canary validation
- improve idempotency handling
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **stale data** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: stale data
- Useful query terms: payment-methods-api, ElastiCache, stale data, inconsistent cache key generation
