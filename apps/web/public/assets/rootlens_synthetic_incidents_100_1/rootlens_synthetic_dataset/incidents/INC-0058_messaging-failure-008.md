# INC-0058: message-dispatcher inconsistent payment method availability due to missing backpressure in event pipeline

## Metadata

- Date: 2025-06-30
- Severity: SEV3
- Region: EU-West
- Failure family: Queue / Messaging Failures
- Primary service: message-dispatcher
- Primary technology: SQL outbox
- Ground truth pattern: delayed processing

## Summary

A production incident affected the `message-dispatcher` flow and caused inconsistent payment method availability. The immediate technical trigger was **missing backpressure in event pipeline**, but the broader failure pattern was **delayed processing**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU-West region. The incident lasted approximately 181 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- slow dependency calls
- inconsistent state observed by customers
- delayed async processing
- intermittent 5xx errors
- message redelivery spike

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed elevated p95 latency and slow dependency calls in message-dispatcher.
- 09:27 — Triage linked the issue to SQL outbox behavior and suspected delayed processing.
- 09:48 — Mitigation started: restart affected pods and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 181 minutes total duration.

## Root Cause

The root cause was **missing backpressure in event pipeline** affecting `message-dispatcher` through `SQL outbox`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- delayed processing
- weak alerting
- high-cardinality metrics
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `message-dispatcher`, `SQL outbox`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- manually replay failed messages
- rollback recent change

## Preventive Actions

- introduce jittered exponential backoff
- add cache invalidation test
- enforce config validation
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **delayed processing** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: delayed processing
- Useful query terms: message-dispatcher, SQL outbox, delayed processing, missing backpressure in event pipeline
