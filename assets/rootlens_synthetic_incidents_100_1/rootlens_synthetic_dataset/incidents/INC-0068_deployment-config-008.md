# INC-0068: payment-options-api increased error rate due to rate limit misconfigured

## Metadata

- Date: 2025-07-29
- Severity: SEV2
- Region: Global
- Failure family: Deployment / Config Drift
- Primary service: payment-options-api
- Primary technology: CI/CD pipeline
- Ground truth pattern: change-induced incident

## Summary

A production incident affected the `payment-options-api` flow and caused increased error rate. The immediate technical trigger was **rate limit misconfigured**, but the broader failure pattern was **change-induced incident**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the Global region. The incident lasted approximately 114 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- slow dependency calls
- retry spikes
- queue growth
- partial customer impact
- CPU saturation
- started after deployment

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed slow dependency calls and retry spikes in payment-options-api.
- 09:27 — Triage linked the issue to CI/CD pipeline behavior and suspected change-induced incident.
- 09:48 — Mitigation started: reduce retry rate and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 114 minutes total duration.

## Root Cause

The root cause was **rate limit misconfigured** affecting `payment-options-api` through `CI/CD pipeline`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- change-induced incident
- unclear ownership
- weak alerting
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-options-api`, `CI/CD pipeline`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- clear stale cache entries
- manually replay failed messages

## Preventive Actions

- add bulkhead isolation
- add cache invalidation test
- improve idempotency handling
- add SLO alerting

## Lessons Learned

This incident shows that **change-induced incident** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: change-induced incident
- Useful query terms: payment-options-api, CI/CD pipeline, change-induced incident, rate limit misconfigured
