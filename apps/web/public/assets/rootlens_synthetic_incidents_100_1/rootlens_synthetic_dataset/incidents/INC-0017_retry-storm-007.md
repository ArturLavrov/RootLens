# INC-0017: fraud-checker delayed payment status updates due to missing jitter

## Metadata

- Date: 2025-02-25
- Severity: SEV2
- Region: EU
- Failure family: Retry Storms
- Primary service: fraud-checker
- Primary technology: RabbitMQ
- Ground truth pattern: partial degradation amplified by retries

## Summary

A production incident affected the `fraud-checker` flow and caused delayed payment status updates. The immediate technical trigger was **missing jitter**, but the broader failure pattern was **partial degradation amplified by retries**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the EU region. The incident lasted approximately 75 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- increased timeout rate
- partial customer impact
- connection pool pressure
- pod restarts
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed inconsistent state observed by customers and increased timeout rate in fraud-checker.
- 09:27 — Triage linked the issue to RabbitMQ behavior and suspected partial degradation amplified by retries.
- 09:48 — Mitigation started: enable circuit breaker and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 75 minutes total duration.

## Root Cause

The root cause was **missing jitter** affecting `fraud-checker` through `RabbitMQ`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial degradation amplified by retries
- weak alerting
- unclear ownership
- synchronized traffic bursts

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `fraud-checker`, `RabbitMQ`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- increase connection pool limit
- rollback recent change

## Preventive Actions

- introduce jittered exponential backoff
- add canary validation
- enforce config validation
- document runbook

## Lessons Learned

This incident shows that **partial degradation amplified by retries** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: partial degradation amplified by retries
- Useful query terms: fraud-checker, RabbitMQ, partial degradation amplified by retries, missing jitter
