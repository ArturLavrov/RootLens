# INC-0067: merchant-api increased error rate due to secret rotation not applied to all pods

## Metadata

- Date: 2025-07-26
- Severity: SEV1
- Region: EU
- Failure family: Deployment / Config Drift
- Primary service: merchant-api
- Primary technology: CI/CD pipeline
- Ground truth pattern: configuration drift

## Summary

A production incident affected the `merchant-api` flow and caused increased error rate. The immediate technical trigger was **secret rotation not applied to all pods**, but the broader failure pattern was **configuration drift**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU region. The incident lasted approximately 120 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- partial customer impact
- increased timeout rate
- slow dependency calls
- inconsistent state observed by customers
- retry spikes

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed intermittent 5xx errors and partial customer impact in merchant-api.
- 09:27 — Triage linked the issue to CI/CD pipeline behavior and suspected configuration drift.
- 09:48 — Mitigation started: enable circuit breaker and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 120 minutes total duration.

## Root Cause

The root cause was **secret rotation not applied to all pods** affecting `merchant-api` through `CI/CD pipeline`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- configuration drift
- lack of bulkhead isolation
- high-cardinality metrics
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `merchant-api`, `CI/CD pipeline`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- add temporary rate limit
- reduce retry rate

## Preventive Actions

- add load test scenario
- add bulkhead isolation
- enforce config validation
- add canary validation

## Lessons Learned

This incident shows that **configuration drift** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: configuration drift
- Useful query terms: merchant-api, CI/CD pipeline, configuration drift, secret rotation not applied to all pods
