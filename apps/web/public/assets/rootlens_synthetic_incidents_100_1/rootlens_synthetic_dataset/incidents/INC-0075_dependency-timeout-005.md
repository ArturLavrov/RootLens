# INC-0075: payment-orchestrator elevated checkout latency due to downstream circuit breaker missing

## Metadata

- Date: 2025-08-19
- Severity: SEV2
- Region: US-East
- Failure family: Dependency Timeouts
- Primary service: payment-orchestrator
- Primary technology: HTTP
- Ground truth pattern: request timeout

## Summary

A production incident affected the `payment-orchestrator` flow and caused elevated checkout latency. The immediate technical trigger was **downstream circuit breaker missing**, but the broader failure pattern was **request timeout**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US-East region. The incident lasted approximately 140 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- manual mitigation required
- retry spikes
- increased timeout rate
- delayed async processing
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed partial customer impact and manual mitigation required in payment-orchestrator.
- 09:27 — Triage linked the issue to HTTP behavior and suspected request timeout.
- 09:48 — Mitigation started: rollback recent change and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 140 minutes total duration.

## Root Cause

The root cause was **downstream circuit breaker missing** affecting `payment-orchestrator` through `HTTP`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- request timeout
- insufficient backpressure
- high-cardinality metrics
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-orchestrator`, `HTTP`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- scale consumers
- manually replay failed messages

## Preventive Actions

- add canary validation
- add load test scenario
- add bulkhead isolation
- enforce config validation

## Lessons Learned

This incident shows that **request timeout** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: request timeout
- Useful query terms: payment-orchestrator, HTTP, request timeout, downstream circuit breaker missing
