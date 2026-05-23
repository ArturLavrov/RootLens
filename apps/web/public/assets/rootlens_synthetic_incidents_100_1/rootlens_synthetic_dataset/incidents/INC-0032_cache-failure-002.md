# INC-0032: payment-methods-api delayed payment status updates due to cache stampede on hot key

## Metadata

- Date: 2025-04-12
- Severity: SEV2
- Region: US
- Failure family: Cache Failures
- Primary service: payment-methods-api
- Primary technology: in-memory cache
- Ground truth pattern: cache miss amplification

## Summary

A production incident affected the `payment-methods-api` flow and caused delayed payment status updates. The immediate technical trigger was **cache stampede on hot key**, but the broader failure pattern was **cache miss amplification**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the US region. The incident lasted approximately 170 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- pod restarts
- database traffic spike
- connection pool pressure
- partial customer impact
- cache hit ratio drop

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed delayed async processing and pod restarts in payment-methods-api.
- 09:27 — Triage linked the issue to in-memory cache behavior and suspected cache miss amplification.
- 09:48 — Mitigation started: clear stale cache entries and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 170 minutes total duration.

## Root Cause

The root cause was **cache stampede on hot key** affecting `payment-methods-api` through `in-memory cache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- cache miss amplification
- limited runbook coverage
- high-cardinality metrics
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-methods-api`, `in-memory cache`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- scale consumers
- reduce retry rate

## Preventive Actions

- document runbook
- add canary validation
- add dependency saturation dashboard
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **cache miss amplification** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: cache miss amplification
- Useful query terms: payment-methods-api, in-memory cache, cache miss amplification, cache stampede on hot key
