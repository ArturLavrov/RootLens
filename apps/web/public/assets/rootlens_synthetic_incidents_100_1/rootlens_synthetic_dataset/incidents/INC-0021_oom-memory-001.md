# INC-0021: risk-engine merchant portal degradation due to unbounded in-memory cache

## Metadata

- Date: 2025-03-09
- Severity: SEV2
- Region: APAC
- Failure family: OOM / Memory Leaks
- Primary service: risk-engine
- Primary technology: ASP.NET Core
- Ground truth pattern: pod restarts

## Summary

A production incident affected the `risk-engine` flow and caused merchant portal degradation. The immediate technical trigger was **unbounded in-memory cache**, but the broader failure pattern was **pod restarts**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the APAC region. The incident lasted approximately 162 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- slow dependency calls
- intermittent 5xx errors
- queue growth
- pod restarts
- long GC pauses
- delayed async processing

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed slow dependency calls and intermittent 5xx errors in risk-engine.
- 09:27 — Triage linked the issue to ASP.NET Core behavior and suspected pod restarts.
- 09:48 — Mitigation started: route traffic away from degraded dependency and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 162 minutes total duration.

## Root Cause

The root cause was **unbounded in-memory cache** affecting `risk-engine` through `ASP.NET Core`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- pod restarts
- lack of bulkhead isolation
- limited runbook coverage
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-engine`, `ASP.NET Core`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- scale consumers
- disable feature flag

## Preventive Actions

- add synthetic transaction check
- introduce jittered exponential backoff
- add dependency saturation dashboard
- add load test scenario

## Lessons Learned

This incident shows that **pod restarts** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: pod restarts
- Useful query terms: risk-engine, ASP.NET Core, pod restarts, unbounded in-memory cache
