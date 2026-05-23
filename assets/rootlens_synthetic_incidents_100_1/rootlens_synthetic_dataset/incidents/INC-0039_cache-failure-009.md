# INC-0039: customer-profile-service delayed payouts due to partial redis cluster failover

## Metadata

- Date: 2025-05-04
- Severity: SEV2
- Region: APAC
- Failure family: Cache Failures
- Primary service: customer-profile-service
- Primary technology: in-memory cache
- Ground truth pattern: DB load spike

## Summary

A production incident affected the `customer-profile-service` flow and caused delayed payouts. The immediate technical trigger was **partial Redis cluster failover**, but the broader failure pattern was **DB load spike**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the APAC region. The incident lasted approximately 124 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- increased timeout rate
- CPU saturation
- database traffic spike
- partial customer impact
- intermittent 5xx errors
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed increased timeout rate and CPU saturation in customer-profile-service.
- 09:27 — Triage linked the issue to in-memory cache behavior and suspected DB load spike.
- 09:48 — Mitigation started: manually replay failed messages and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 124 minutes total duration.

## Root Cause

The root cause was **partial Redis cluster failover** affecting `customer-profile-service` through `in-memory cache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- DB load spike
- missing circuit breaker
- manual rollback process
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `customer-profile-service`, `in-memory cache`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- disable feature flag
- route traffic away from degraded dependency

## Preventive Actions

- enforce config validation
- add SLO alerting
- document runbook
- add canary validation

## Lessons Learned

This incident shows that **DB load spike** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: DB load spike
- Useful query terms: customer-profile-service, in-memory cache, DB load spike, partial Redis cluster failover
