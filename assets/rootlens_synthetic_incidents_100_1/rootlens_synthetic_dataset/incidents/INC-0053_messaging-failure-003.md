# INC-0053: fraud-event-consumer inconsistent payment method availability due to poison message blocking consumer

## Metadata

- Date: 2025-06-14
- Severity: SEV2
- Region: US
- Failure family: Queue / Messaging Failures
- Primary service: fraud-event-consumer
- Primary technology: Kafka
- Ground truth pattern: delayed processing

## Summary

A production incident affected the `fraud-event-consumer` flow and caused inconsistent payment method availability. The immediate technical trigger was **poison message blocking consumer**, but the broader failure pattern was **delayed processing**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US region. The incident lasted approximately 174 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- retry spikes
- connection pool pressure
- message redelivery spike
- dead-letter growth
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed intermittent 5xx errors and retry spikes in fraud-event-consumer.
- 09:27 — Triage linked the issue to Kafka behavior and suspected delayed processing.
- 09:48 — Mitigation started: restart affected pods and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 174 minutes total duration.

## Root Cause

The root cause was **poison message blocking consumer** affecting `fraud-event-consumer` through `Kafka`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- delayed processing
- insufficient backpressure
- weak alerting
- synchronized traffic bursts

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `fraud-event-consumer`, `Kafka`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- scale consumers
- manually replay failed messages

## Preventive Actions

- add SLO alerting
- introduce jittered exponential backoff
- add load test scenario
- add cache invalidation test

## Lessons Learned

This incident shows that **delayed processing** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: delayed processing
- Useful query terms: fraud-event-consumer, Kafka, delayed processing, poison message blocking consumer
