# INC-0085: merchant-platform delayed payment status updates due to traffic failover overloaded secondary region

## Metadata

- Date: 2025-09-17
- Severity: SEV2
- Region: US-East
- Failure family: Cascading Failures
- Primary service: merchant-platform
- Primary technology: Envoy
- Ground truth pattern: lack of isolation

## Summary

A production incident affected the `merchant-platform` flow and caused delayed payment status updates. The immediate technical trigger was **traffic failover overloaded secondary region**, but the broader failure pattern was **lack of isolation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the US-East region. The incident lasted approximately 110 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- connection pool pressure
- shared dependency saturated
- increased timeout rate
- partial customer impact
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed delayed async processing and connection pool pressure in merchant-platform.
- 09:27 — Triage linked the issue to Envoy behavior and suspected lack of isolation.
- 09:48 — Mitigation started: route traffic away from degraded dependency and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 110 minutes total duration.

## Root Cause

The root cause was **traffic failover overloaded secondary region** affecting `merchant-platform` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- lack of isolation
- limited runbook coverage
- missing circuit breaker
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `merchant-platform`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- scale consumers
- enable circuit breaker

## Preventive Actions

- add dependency saturation dashboard
- add SLO alerting
- add load test scenario
- enforce config validation

## Lessons Learned

This incident shows that **lack of isolation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: lack of isolation
- Useful query terms: merchant-platform, Envoy, lack of isolation, traffic failover overloaded secondary region
