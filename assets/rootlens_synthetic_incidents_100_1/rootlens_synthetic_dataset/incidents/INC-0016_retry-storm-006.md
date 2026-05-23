# INC-0016: gateway-adapter partial payment failures due to retry-on-all-errors policy

## Metadata

- Date: 2025-02-22
- Severity: SEV2
- Region: APAC
- Failure family: Retry Storms
- Primary service: gateway-adapter
- Primary technology: HTTP client
- Ground truth pattern: partial degradation amplified by retries

## Summary

A production incident affected the `gateway-adapter` flow and caused partial payment failures. The immediate technical trigger was **retry-on-all-errors policy**, but the broader failure pattern was **partial degradation amplified by retries**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the APAC region. The incident lasted approximately 22 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- intermittent 5xx errors
- retry spikes
- delayed async processing
- CPU saturation
- connection pool pressure

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed inconsistent state observed by customers and intermittent 5xx errors in gateway-adapter.
- 09:27 — Triage linked the issue to HTTP client behavior and suspected partial degradation amplified by retries.
- 09:48 — Mitigation started: reduce retry rate and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 22 minutes total duration.

## Root Cause

The root cause was **retry-on-all-errors policy** affecting `gateway-adapter` through `HTTP client`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial degradation amplified by retries
- manual rollback process
- insufficient load testing
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `gateway-adapter`, `HTTP client`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- manually replay failed messages
- enable circuit breaker

## Preventive Actions

- add bulkhead isolation
- add SLO alerting
- add canary validation
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **partial degradation amplified by retries** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: partial degradation amplified by retries
- Useful query terms: gateway-adapter, HTTP client, partial degradation amplified by retries, retry-on-all-errors policy
