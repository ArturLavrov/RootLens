# INC-0027: admin-api merchant portal degradation due to serializer buffer growth

## Metadata

- Date: 2025-03-28
- Severity: SEV2
- Region: US
- Failure family: OOM / Memory Leaks
- Primary service: admin-api
- Primary technology: .NET GC
- Ground truth pattern: GC pauses

## Summary

A production incident affected the `admin-api` flow and caused merchant portal degradation. The immediate technical trigger was **serializer buffer growth**, but the broader failure pattern was **GC pauses**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the US region. The incident lasted approximately 105 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- connection pool pressure
- manual mitigation required
- memory growth over several hours
- pod restarts
- intermittent 5xx errors
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed connection pool pressure and manual mitigation required in admin-api.
- 09:27 — Triage linked the issue to .NET GC behavior and suspected GC pauses.
- 09:48 — Mitigation started: restart affected pods and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 105 minutes total duration.

## Root Cause

The root cause was **serializer buffer growth** affecting `admin-api` through `.NET GC`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- GC pauses
- limited runbook coverage
- insufficient backpressure
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `admin-api`, `.NET GC`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- scale consumers
- reduce retry rate

## Preventive Actions

- add cache invalidation test
- add SLO alerting
- improve idempotency handling
- document runbook

## Lessons Learned

This incident shows that **GC pauses** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: GC pauses
- Useful query terms: admin-api, .NET GC, GC pauses, serializer buffer growth
