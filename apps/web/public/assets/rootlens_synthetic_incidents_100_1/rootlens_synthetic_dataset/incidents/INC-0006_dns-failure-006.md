# INC-0006: risk-service inconsistent payment method availability due to dns search path misconfiguration

## Metadata

- Date: 2025-01-25
- Severity: SEV2
- Region: EU-West
- Failure family: DNS Failures
- Primary service: risk-service
- Primary technology: Envoy
- Ground truth pattern: partial regional degradation

## Summary

A production incident affected the `risk-service` flow and caused inconsistent payment method availability. The immediate technical trigger was **DNS search path misconfiguration**, but the broader failure pattern was **partial regional degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU-West region. The incident lasted approximately 24 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- inconsistent state observed by customers
- connection pool pressure
- manual mitigation required
- intermittent 5xx errors
- DNS lookup latency

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed queue growth and inconsistent state observed by customers in risk-service.
- 09:27 — Triage linked the issue to Envoy behavior and suspected partial regional degradation.
- 09:48 — Mitigation started: increase connection pool limit and enable circuit breaker.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 24 minutes total duration.

## Root Cause

The root cause was **DNS search path misconfiguration** affecting `risk-service` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial regional degradation
- lack of bulkhead isolation
- missing circuit breaker
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-service`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- enable circuit breaker
- route traffic away from degraded dependency

## Preventive Actions

- add SLO alerting
- add load test scenario
- add bulkhead isolation
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **partial regional degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: partial regional degradation
- Useful query terms: risk-service, Envoy, partial regional degradation, DNS search path misconfiguration
