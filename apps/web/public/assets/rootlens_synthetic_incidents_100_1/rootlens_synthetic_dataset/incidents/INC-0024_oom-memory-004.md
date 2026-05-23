# INC-0024: risk-engine inconsistent payment method availability due to memory leak in background worker

## Metadata

- Date: 2025-03-20
- Severity: SEV2
- Region: US
- Failure family: OOM / Memory Leaks
- Primary service: risk-engine
- Primary technology: JSON serializer
- Ground truth pattern: capacity degradation

## Summary

A production incident affected the `risk-engine` flow and caused inconsistent payment method availability. The immediate technical trigger was **memory leak in background worker**, but the broader failure pattern was **capacity degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US region. The incident lasted approximately 185 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- long GC pauses
- inconsistent state observed by customers
- queue growth
- intermittent 5xx errors
- CPU saturation
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed long GC pauses and inconsistent state observed by customers in risk-engine.
- 09:27 — Triage linked the issue to JSON serializer behavior and suspected capacity degradation.
- 09:48 — Mitigation started: restart affected pods and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 185 minutes total duration.

## Root Cause

The root cause was **memory leak in background worker** affecting `risk-engine` through `JSON serializer`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- capacity degradation
- high-cardinality metrics
- unclear ownership
- synchronized traffic bursts

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-engine`, `JSON serializer`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- manually replay failed messages
- disable feature flag

## Preventive Actions

- add dependency saturation dashboard
- introduce jittered exponential backoff
- improve idempotency handling
- document runbook

## Lessons Learned

This incident shows that **capacity degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: capacity degradation
- Useful query terms: risk-engine, JSON serializer, capacity degradation, memory leak in background worker
