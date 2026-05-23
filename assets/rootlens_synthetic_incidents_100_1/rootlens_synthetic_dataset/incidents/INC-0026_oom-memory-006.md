# INC-0026: settlement-service merchant portal degradation due to thread-local data retained after requests

## Metadata

- Date: 2025-03-26
- Severity: SEV2
- Region: EU
- Failure family: OOM / Memory Leaks
- Primary service: settlement-service
- Primary technology: OpenTelemetry
- Ground truth pattern: GC pauses

## Summary

A production incident affected the `settlement-service` flow and caused merchant portal degradation. The immediate technical trigger was **thread-local data retained after requests**, but the broader failure pattern was **GC pauses**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the EU region. The incident lasted approximately 108 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- delayed async processing
- retry spikes
- CPU saturation
- memory growth over several hours
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed manual mitigation required and delayed async processing in settlement-service.
- 09:27 — Triage linked the issue to OpenTelemetry behavior and suspected GC pauses.
- 09:48 — Mitigation started: add temporary rate limit and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 108 minutes total duration.

## Root Cause

The root cause was **thread-local data retained after requests** affecting `settlement-service` through `OpenTelemetry`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- GC pauses
- insufficient load testing
- insufficient backpressure
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-service`, `OpenTelemetry`, and downstream impact was not immediately visible.

## Resolution

- add temporary rate limit
- manually replay failed messages
- rollback recent change

## Preventive Actions

- add dependency saturation dashboard
- enforce config validation
- introduce jittered exponential backoff
- add synthetic transaction check

## Lessons Learned

This incident shows that **GC pauses** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: GC pauses
- Useful query terms: settlement-service, OpenTelemetry, GC pauses, thread-local data retained after requests
