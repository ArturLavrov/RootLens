# INC-0069: merchant-api elevated checkout latency due to wrong connection string after deployment

## Metadata

- Date: 2025-08-02
- Severity: SEV2
- Region: US
- Failure family: Deployment / Config Drift
- Primary service: merchant-api
- Primary technology: Feature flags
- Ground truth pattern: partial environment impact

## Summary

A production incident affected the `merchant-api` flow and caused elevated checkout latency. The immediate technical trigger was **wrong connection string after deployment**, but the broader failure pattern was **partial environment impact**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US region. The incident lasted approximately 68 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- delayed async processing
- CPU saturation
- elevated p95 latency
- pod restarts
- rollback improved health

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed partial customer impact and delayed async processing in merchant-api.
- 09:27 — Triage linked the issue to Feature flags behavior and suspected partial environment impact.
- 09:48 — Mitigation started: route traffic away from degraded dependency and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 68 minutes total duration.

## Root Cause

The root cause was **wrong connection string after deployment** affecting `merchant-api` through `Feature flags`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial environment impact
- unclear ownership
- limited runbook coverage
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `merchant-api`, `Feature flags`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- scale consumers
- disable feature flag

## Preventive Actions

- document runbook
- add load test scenario
- add synthetic transaction check
- add cache invalidation test

## Lessons Learned

This incident shows that **partial environment impact** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: partial environment impact
- Useful query terms: merchant-api, Feature flags, partial environment impact, wrong connection string after deployment
