# INC-0030: settlement-service elevated checkout latency due to infinite accumulation of failed jobs

## Metadata

- Date: 2025-04-06
- Severity: SEV3
- Region: Global
- Failure family: OOM / Memory Leaks
- Primary service: settlement-service
- Primary technology: Redis cache client
- Ground truth pattern: capacity degradation

## Summary

A production incident affected the `settlement-service` flow and caused elevated checkout latency. The immediate technical trigger was **infinite accumulation of failed jobs**, but the broader failure pattern was **capacity degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the Global region. The incident lasted approximately 155 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- long GC pauses
- CPU saturation
- pod restarts
- delayed async processing
- slow dependency calls
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed long GC pauses and CPU saturation in settlement-service.
- 09:27 — Triage linked the issue to Redis cache client behavior and suspected capacity degradation.
- 09:48 — Mitigation started: clear stale cache entries and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 155 minutes total duration.

## Root Cause

The root cause was **infinite accumulation of failed jobs** affecting `settlement-service` through `Redis cache client`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- capacity degradation
- lack of bulkhead isolation
- unclear ownership
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-service`, `Redis cache client`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- route traffic away from degraded dependency
- scale consumers

## Preventive Actions

- add synthetic transaction check
- improve idempotency handling
- enforce config validation
- add canary validation

## Lessons Learned

This incident shows that **capacity degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: capacity degradation
- Useful query terms: settlement-service, Redis cache client, capacity degradation, infinite accumulation of failed jobs
