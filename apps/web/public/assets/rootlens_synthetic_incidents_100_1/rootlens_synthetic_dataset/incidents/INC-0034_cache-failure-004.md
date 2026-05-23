# INC-0034: checkout-api increased error rate due to race in cache invalidation

## Metadata

- Date: 2025-04-18
- Severity: SEV1
- Region: EU
- Failure family: Cache Failures
- Primary service: checkout-api
- Primary technology: ElastiCache
- Ground truth pattern: DB load spike

## Summary

A production incident affected the `checkout-api` flow and caused increased error rate. The immediate technical trigger was **race in cache invalidation**, but the broader failure pattern was **DB load spike**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU region. The incident lasted approximately 94 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- stale cached values
- partial customer impact
- retry spikes
- elevated p95 latency
- intermittent 5xx errors
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed stale cached values and partial customer impact in checkout-api.
- 09:27 — Triage linked the issue to ElastiCache behavior and suspected DB load spike.
- 09:48 — Mitigation started: route traffic away from degraded dependency and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 94 minutes total duration.

## Root Cause

The root cause was **race in cache invalidation** affecting `checkout-api` through `ElastiCache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- DB load spike
- missing circuit breaker
- synchronized traffic bursts
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `ElastiCache`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- reduce retry rate
- rollback recent change

## Preventive Actions

- introduce jittered exponential backoff
- add cache invalidation test
- add load test scenario
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **DB load spike** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: DB load spike
- Useful query terms: checkout-api, ElastiCache, DB load spike, race in cache invalidation
