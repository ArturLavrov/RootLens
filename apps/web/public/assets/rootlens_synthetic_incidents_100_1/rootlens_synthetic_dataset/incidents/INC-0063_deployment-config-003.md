# INC-0063: admin-panel partial payment failures due to autoscaling disabled in one namespace

## Metadata

- Date: 2025-07-13
- Severity: SEV2
- Region: US
- Failure family: Deployment / Config Drift
- Primary service: admin-panel
- Primary technology: Feature flags
- Ground truth pattern: configuration drift

## Summary

A production incident affected the `admin-panel` flow and caused partial payment failures. The immediate technical trigger was **autoscaling disabled in one namespace**, but the broader failure pattern was **configuration drift**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the US region. The incident lasted approximately 152 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- pod restarts
- one environment affected
- manual mitigation required
- partial customer impact
- started after deployment
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed pod restarts and one environment affected in admin-panel.
- 09:27 — Triage linked the issue to Feature flags behavior and suspected configuration drift.
- 09:48 — Mitigation started: enable circuit breaker and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 152 minutes total duration.

## Root Cause

The root cause was **autoscaling disabled in one namespace** affecting `admin-panel` through `Feature flags`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- configuration drift
- weak alerting
- unclear ownership
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `admin-panel`, `Feature flags`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- clear stale cache entries
- scale consumers

## Preventive Actions

- introduce jittered exponential backoff
- improve idempotency handling
- add cache invalidation test
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **configuration drift** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: configuration drift
- Useful query terms: admin-panel, Feature flags, configuration drift, autoscaling disabled in one namespace
