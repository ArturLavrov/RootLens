# INC-0023: admin-api inconsistent payment method availability due to large object heap fragmentation

## Metadata

- Date: 2025-03-15
- Severity: SEV3
- Region: EU
- Failure family: OOM / Memory Leaks
- Primary service: admin-api
- Primary technology: ASP.NET Core
- Ground truth pattern: progressive resource exhaustion

## Summary

A production incident affected the `admin-api` flow and caused inconsistent payment method availability. The immediate technical trigger was **large object heap fragmentation**, but the broader failure pattern was **progressive resource exhaustion**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU region. The incident lasted approximately 130 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- OOMKilled pods
- elevated p95 latency
- connection pool pressure
- queue growth
- increased timeout rate
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed OOMKilled pods and elevated p95 latency in admin-api.
- 09:27 — Triage linked the issue to ASP.NET Core behavior and suspected progressive resource exhaustion.
- 09:48 — Mitigation started: route traffic away from degraded dependency and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 130 minutes total duration.

## Root Cause

The root cause was **large object heap fragmentation** affecting `admin-api` through `ASP.NET Core`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- progressive resource exhaustion
- weak alerting
- limited runbook coverage
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `admin-api`, `ASP.NET Core`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- add temporary rate limit
- disable feature flag

## Preventive Actions

- enforce config validation
- add bulkhead isolation
- add synthetic transaction check
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **progressive resource exhaustion** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: progressive resource exhaustion
- Useful query terms: admin-api, ASP.NET Core, progressive resource exhaustion, large object heap fragmentation
