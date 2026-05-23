# INC-0064: payment-options-api inconsistent payment method availability due to environment variable mismatch

## Metadata

- Date: 2025-07-18
- Severity: SEV2
- Region: EU-West
- Failure family: Deployment / Config Drift
- Primary service: payment-options-api
- Primary technology: CI/CD pipeline
- Ground truth pattern: rollback mitigation

## Summary

A production incident affected the `payment-options-api` flow and caused inconsistent payment method availability. The immediate technical trigger was **environment variable mismatch**, but the broader failure pattern was **rollback mitigation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU-West region. The incident lasted approximately 170 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- started after deployment
- rollback improved health
- partial customer impact
- retry spikes
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed inconsistent state observed by customers and started after deployment in payment-options-api.
- 09:27 — Triage linked the issue to CI/CD pipeline behavior and suspected rollback mitigation.
- 09:48 — Mitigation started: manually replay failed messages and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 170 minutes total duration.

## Root Cause

The root cause was **environment variable mismatch** affecting `payment-options-api` through `CI/CD pipeline`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- rollback mitigation
- missing circuit breaker
- limited runbook coverage
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-options-api`, `CI/CD pipeline`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- clear stale cache entries
- add temporary rate limit

## Preventive Actions

- improve idempotency handling
- add SLO alerting
- add canary validation
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **rollback mitigation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: rollback mitigation
- Useful query terms: payment-options-api, CI/CD pipeline, rollback mitigation, environment variable mismatch
