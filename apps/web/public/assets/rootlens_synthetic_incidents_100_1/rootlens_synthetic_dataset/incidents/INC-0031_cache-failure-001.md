# INC-0031: payment-methods-api delayed payment status updates due to stale redis cache after provider config update

## Metadata

- Date: 2025-04-09
- Severity: SEV1
- Region: US
- Failure family: Cache Failures
- Primary service: payment-methods-api
- Primary technology: CDN cache
- Ground truth pattern: inconsistent reads

## Summary

A production incident affected the `payment-methods-api` flow and caused delayed payment status updates. The immediate technical trigger was **stale Redis cache after provider config update**, but the broader failure pattern was **inconsistent reads**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the US region. The incident lasted approximately 88 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- connection pool pressure
- database traffic spike
- elevated p95 latency
- stale cached values
- queue growth
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed connection pool pressure and database traffic spike in payment-methods-api.
- 09:27 — Triage linked the issue to CDN cache behavior and suspected inconsistent reads.
- 09:48 — Mitigation started: disable feature flag and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 88 minutes total duration.

## Root Cause

The root cause was **stale Redis cache after provider config update** affecting `payment-methods-api` through `CDN cache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- inconsistent reads
- unclear ownership
- manual rollback process
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-methods-api`, `CDN cache`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- scale consumers
- route traffic away from degraded dependency

## Preventive Actions

- add cache invalidation test
- add synthetic transaction check
- improve idempotency handling
- add SLO alerting

## Lessons Learned

This incident shows that **inconsistent reads** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: inconsistent reads
- Useful query terms: payment-methods-api, CDN cache, inconsistent reads, stale Redis cache after provider config update
