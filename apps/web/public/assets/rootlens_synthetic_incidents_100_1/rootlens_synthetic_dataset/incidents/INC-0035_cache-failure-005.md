# INC-0035: customer-profile-service elevated checkout latency due to hot key overload

## Metadata

- Date: 2025-04-21
- Severity: SEV2
- Region: EU-West
- Failure family: Cache Failures
- Primary service: customer-profile-service
- Primary technology: Redis
- Ground truth pattern: DB load spike

## Summary

A production incident affected the `customer-profile-service` flow and caused elevated checkout latency. The immediate technical trigger was **hot key overload**, but the broader failure pattern was **DB load spike**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the EU-West region. The incident lasted approximately 155 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- stale cached values
- intermittent 5xx errors
- cache hit ratio drop
- slow dependency calls
- pod restarts
- database traffic spike

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed stale cached values and intermittent 5xx errors in customer-profile-service.
- 09:27 — Triage linked the issue to Redis behavior and suspected DB load spike.
- 09:48 — Mitigation started: scale consumers and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 155 minutes total duration.

## Root Cause

The root cause was **hot key overload** affecting `customer-profile-service` through `Redis`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- DB load spike
- synchronized traffic bursts
- insufficient backpressure
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `customer-profile-service`, `Redis`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- manually replay failed messages
- clear stale cache entries

## Preventive Actions

- add cache invalidation test
- add dependency saturation dashboard
- introduce jittered exponential backoff
- document runbook

## Lessons Learned

This incident shows that **DB load spike** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: DB load spike
- Useful query terms: customer-profile-service, Redis, DB load spike, hot key overload
