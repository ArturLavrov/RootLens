# INC-0028: admin-api delayed payouts due to image/document payload retained in memory

## Metadata

- Date: 2025-03-30
- Severity: SEV2
- Region: Global
- Failure family: OOM / Memory Leaks
- Primary service: admin-api
- Primary technology: .NET GC
- Ground truth pattern: pod restarts

## Summary

A production incident affected the `admin-api` flow and caused delayed payouts. The immediate technical trigger was **image/document payload retained in memory**, but the broader failure pattern was **pod restarts**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the Global region. The incident lasted approximately 51 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- OOMKilled pods
- delayed async processing
- intermittent 5xx errors
- manual mitigation required
- partial customer impact
- retry spikes

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed OOMKilled pods and delayed async processing in admin-api.
- 09:27 — Triage linked the issue to .NET GC behavior and suspected pod restarts.
- 09:48 — Mitigation started: clear stale cache entries and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 51 minutes total duration.

## Root Cause

The root cause was **image/document payload retained in memory** affecting `admin-api` through `.NET GC`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- pod restarts
- synchronized traffic bursts
- missing circuit breaker
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `admin-api`, `.NET GC`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- reduce retry rate
- rollback recent change

## Preventive Actions

- add load test scenario
- improve idempotency handling
- enforce config validation
- add bulkhead isolation

## Lessons Learned

This incident shows that **pod restarts** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: pod restarts
- Useful query terms: admin-api, .NET GC, pod restarts, image/document payload retained in memory
