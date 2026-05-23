# INC-0040: pricing-service delayed payment status updates due to stale customer state cache

## Metadata

- Date: 2025-05-06
- Severity: SEV3
- Region: US
- Failure family: Cache Failures
- Primary service: pricing-service
- Primary technology: CDN cache
- Ground truth pattern: DB load spike

## Summary

A production incident affected the `pricing-service` flow and caused delayed payment status updates. The immediate technical trigger was **stale customer state cache**, but the broader failure pattern was **DB load spike**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the US region. The incident lasted approximately 162 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- stale cached values
- database traffic spike
- delayed async processing
- CPU saturation
- increased timeout rate
- elevated p95 latency

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed stale cached values and database traffic spike in pricing-service.
- 09:27 — Triage linked the issue to CDN cache behavior and suspected DB load spike.
- 09:48 — Mitigation started: clear stale cache entries and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 162 minutes total duration.

## Root Cause

The root cause was **stale customer state cache** affecting `pricing-service` through `CDN cache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- DB load spike
- synchronized traffic bursts
- unclear ownership
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `pricing-service`, `CDN cache`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- disable feature flag
- rollback recent change

## Preventive Actions

- add bulkhead isolation
- enforce config validation
- add dependency saturation dashboard
- document runbook

## Lessons Learned

This incident shows that **DB load spike** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: DB load spike
- Useful query terms: pricing-service, CDN cache, DB load spike, stale customer state cache
