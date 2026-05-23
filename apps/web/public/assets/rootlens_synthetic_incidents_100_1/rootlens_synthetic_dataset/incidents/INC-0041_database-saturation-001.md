# INC-0041: payment-api merchant portal degradation due to missing index on high-traffic query

## Metadata

- Date: 2025-05-10
- Severity: SEV2
- Region: US
- Failure family: Database Saturation
- Primary service: payment-api
- Primary technology: read replica
- Ground truth pattern: dependency saturation

## Summary

A production incident affected the `payment-api` flow and caused merchant portal degradation. The immediate technical trigger was **missing index on high-traffic query**, but the broader failure pattern was **dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the US region. The incident lasted approximately 96 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- connection pool pressure
- pod restarts
- slow queries
- CPU saturation
- manual mitigation required
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed connection pool pressure and pod restarts in payment-api.
- 09:27 — Triage linked the issue to read replica behavior and suspected dependency saturation.
- 09:48 — Mitigation started: increase connection pool limit and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 96 minutes total duration.

## Root Cause

The root cause was **missing index on high-traffic query** affecting `payment-api` through `read replica`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency saturation
- limited runbook coverage
- insufficient load testing
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-api`, `read replica`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- scale consumers
- disable feature flag

## Preventive Actions

- introduce jittered exponential backoff
- add dependency saturation dashboard
- add load test scenario
- enforce config validation

## Lessons Learned

This incident shows that **dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: dependency saturation
- Useful query terms: payment-api, read replica, dependency saturation, missing index on high-traffic query
