# INC-0076: checkout-api elevated checkout latency due to external fraud api degradation

## Metadata

- Date: 2025-08-21
- Severity: SEV1
- Region: US-East
- Failure family: Dependency Timeouts
- Primary service: checkout-api
- Primary technology: TLS
- Ground truth pattern: request timeout

## Summary

A production incident affected the `checkout-api` flow and caused elevated checkout latency. The immediate technical trigger was **external fraud API degradation**, but the broader failure pattern was **request timeout**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US-East region. The incident lasted approximately 95 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- intermittent 5xx errors
- increased timeout rate
- manual mitigation required
- partial customer impact
- pod restarts

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed inconsistent state observed by customers and intermittent 5xx errors in checkout-api.
- 09:27 — Triage linked the issue to TLS behavior and suspected request timeout.
- 09:48 — Mitigation started: restart affected pods and enable circuit breaker.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 95 minutes total duration.

## Root Cause

The root cause was **external fraud API degradation** affecting `checkout-api` through `TLS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- request timeout
- manual rollback process
- limited runbook coverage
- synchronized traffic bursts

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `TLS`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- enable circuit breaker
- route traffic away from degraded dependency

## Preventive Actions

- add synthetic transaction check
- add canary validation
- add bulkhead isolation
- add load test scenario

## Lessons Learned

This incident shows that **request timeout** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: request timeout
- Useful query terms: checkout-api, TLS, request timeout, external fraud API degradation
