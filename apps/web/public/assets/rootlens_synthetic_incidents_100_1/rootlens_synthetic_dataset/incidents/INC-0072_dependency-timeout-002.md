# INC-0072: gateway-adapter partial payment failures due to internal rest dependency slow responses

## Metadata

- Date: 2025-08-10
- Severity: SEV3
- Region: US
- Failure family: Dependency Timeouts
- Primary service: gateway-adapter
- Primary technology: third-party provider API
- Ground truth pattern: request timeout

## Summary

A production incident affected the `gateway-adapter` flow and caused partial payment failures. The immediate technical trigger was **internal REST dependency slow responses**, but the broader failure pattern was **request timeout**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the US region. The incident lasted approximately 95 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- manual mitigation required
- delayed async processing
- CPU saturation
- provider timeout increase
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed intermittent 5xx errors and manual mitigation required in gateway-adapter.
- 09:27 — Triage linked the issue to third-party provider API behavior and suspected request timeout.
- 09:48 — Mitigation started: clear stale cache entries and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 95 minutes total duration.

## Root Cause

The root cause was **internal REST dependency slow responses** affecting `gateway-adapter` through `third-party provider API`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- request timeout
- insufficient backpressure
- missing circuit breaker
- synchronized traffic bursts

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `gateway-adapter`, `third-party provider API`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- scale consumers
- enable circuit breaker

## Preventive Actions

- add bulkhead isolation
- improve idempotency handling
- add cache invalidation test
- enforce config validation

## Lessons Learned

This incident shows that **request timeout** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: request timeout
- Useful query terms: gateway-adapter, third-party provider API, request timeout, internal REST dependency slow responses
