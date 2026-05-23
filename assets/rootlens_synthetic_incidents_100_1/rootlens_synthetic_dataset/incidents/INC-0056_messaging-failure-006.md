# INC-0056: payment-status-consumer merchant portal degradation due to message duplication due to publish retry

## Metadata

- Date: 2025-06-22
- Severity: SEV2
- Region: Global
- Failure family: Queue / Messaging Failures
- Primary service: payment-status-consumer
- Primary technology: SQS
- Ground truth pattern: delayed processing

## Summary

A production incident affected the `payment-status-consumer` flow and caused merchant portal degradation. The immediate technical trigger was **message duplication due to publish retry**, but the broader failure pattern was **delayed processing**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the Global region. The incident lasted approximately 128 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- pod restarts
- partial customer impact
- message redelivery spike
- intermittent 5xx errors
- consumer lag

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed inconsistent state observed by customers and pod restarts in payment-status-consumer.
- 09:27 — Triage linked the issue to SQS behavior and suspected delayed processing.
- 09:48 — Mitigation started: reduce retry rate and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 128 minutes total duration.

## Root Cause

The root cause was **message duplication due to publish retry** affecting `payment-status-consumer` through `SQS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- delayed processing
- weak alerting
- limited runbook coverage
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-status-consumer`, `SQS`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- manually replay failed messages
- add temporary rate limit

## Preventive Actions

- enforce config validation
- add dependency saturation dashboard
- add canary validation
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **delayed processing** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: delayed processing
- Useful query terms: payment-status-consumer, SQS, delayed processing, message duplication due to publish retry
