# INC-0080: payment-orchestrator elevated checkout latency due to payment acquirer partial outage

## Metadata

- Date: 2025-09-02
- Severity: SEV2
- Region: Global
- Failure family: Dependency Timeouts
- Primary service: payment-orchestrator
- Primary technology: OAuth introspection
- Ground truth pattern: request timeout

## Summary

A production incident affected the `payment-orchestrator` flow and caused elevated checkout latency. The immediate technical trigger was **payment acquirer partial outage**, but the broader failure pattern was **request timeout**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the Global region. The incident lasted approximately 53 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- provider timeout increase
- retry spikes
- delayed async processing
- CPU saturation
- increased timeout rate
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed provider timeout increase and retry spikes in payment-orchestrator.
- 09:27 — Triage linked the issue to OAuth introspection behavior and suspected request timeout.
- 09:48 — Mitigation started: disable feature flag and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 53 minutes total duration.

## Root Cause

The root cause was **payment acquirer partial outage** affecting `payment-orchestrator` through `OAuth introspection`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- request timeout
- lack of bulkhead isolation
- synchronized traffic bursts
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-orchestrator`, `OAuth introspection`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- manually replay failed messages
- clear stale cache entries

## Preventive Actions

- add load test scenario
- introduce jittered exponential backoff
- improve idempotency handling
- add canary validation

## Lessons Learned

This incident shows that **request timeout** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: request timeout
- Useful query terms: payment-orchestrator, OAuth introspection, request timeout, payment acquirer partial outage
