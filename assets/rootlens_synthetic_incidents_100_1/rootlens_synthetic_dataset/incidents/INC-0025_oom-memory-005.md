# INC-0025: settlement-service merchant portal degradation due to unbounded request buffering

## Metadata

- Date: 2025-03-23
- Severity: SEV3
- Region: EU
- Failure family: OOM / Memory Leaks
- Primary service: settlement-service
- Primary technology: ASP.NET Core
- Ground truth pattern: pod restarts

## Summary

A production incident affected the `settlement-service` flow and caused merchant portal degradation. The immediate technical trigger was **unbounded request buffering**, but the broader failure pattern was **pod restarts**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the EU region. The incident lasted approximately 126 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- OOMKilled pods
- pod restarts
- elevated p95 latency
- queue growth
- long GC pauses
- delayed async processing

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed OOMKilled pods and pod restarts in settlement-service.
- 09:27 — Triage linked the issue to ASP.NET Core behavior and suspected pod restarts.
- 09:48 — Mitigation started: route traffic away from degraded dependency and rollback recent change.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 126 minutes total duration.

## Root Cause

The root cause was **unbounded request buffering** affecting `settlement-service` through `ASP.NET Core`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- pod restarts
- synchronized traffic bursts
- insufficient backpressure
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-service`, `ASP.NET Core`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- rollback recent change
- restart affected pods

## Preventive Actions

- add load test scenario
- enforce config validation
- improve idempotency handling
- document runbook

## Lessons Learned

This incident shows that **pod restarts** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: pod restarts
- Useful query terms: settlement-service, ASP.NET Core, pod restarts, unbounded request buffering
