# INC-0073: gateway-adapter elevated checkout latency due to tls handshake delays

## Metadata

- Date: 2025-08-14
- Severity: SEV2
- Region: EU
- Failure family: Dependency Timeouts
- Primary service: gateway-adapter
- Primary technology: Envoy
- Ground truth pattern: thread starvation

## Summary

A production incident affected the `gateway-adapter` flow and caused elevated checkout latency. The immediate technical trigger was **TLS handshake delays**, but the broader failure pattern was **thread starvation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the EU region. The incident lasted approximately 129 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- provider timeout increase
- increased timeout rate
- thread pool starvation
- CPU saturation
- slow dependency calls
- connection pool pressure

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed provider timeout increase and increased timeout rate in gateway-adapter.
- 09:27 — Triage linked the issue to Envoy behavior and suspected thread starvation.
- 09:48 — Mitigation started: enable circuit breaker and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 129 minutes total duration.

## Root Cause

The root cause was **TLS handshake delays** affecting `gateway-adapter` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- thread starvation
- insufficient backpressure
- insufficient load testing
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `gateway-adapter`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- clear stale cache entries
- increase connection pool limit

## Preventive Actions

- add SLO alerting
- improve idempotency handling
- add canary validation
- document runbook

## Lessons Learned

This incident shows that **thread starvation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: thread starvation
- Useful query terms: gateway-adapter, Envoy, thread starvation, TLS handshake delays
