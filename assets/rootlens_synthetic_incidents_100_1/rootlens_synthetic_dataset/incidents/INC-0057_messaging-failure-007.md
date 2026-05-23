# INC-0057: fraud-event-consumer delayed payment status updates due to outbox processor stuck on locked rows

## Metadata

- Date: 2025-06-27
- Severity: SEV2
- Region: Global
- Failure family: Queue / Messaging Failures
- Primary service: fraud-event-consumer
- Primary technology: RabbitMQ
- Ground truth pattern: eventual consistency gap

## Summary

A production incident affected the `fraud-event-consumer` flow and caused delayed payment status updates. The immediate technical trigger was **outbox processor stuck on locked rows**, but the broader failure pattern was **eventual consistency gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the Global region. The incident lasted approximately 130 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- increased timeout rate
- intermittent 5xx errors
- slow dependency calls
- dead-letter growth
- partial customer impact
- message redelivery spike

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed increased timeout rate and intermittent 5xx errors in fraud-event-consumer.
- 09:27 — Triage linked the issue to RabbitMQ behavior and suspected eventual consistency gap.
- 09:48 — Mitigation started: enable circuit breaker and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 130 minutes total duration.

## Root Cause

The root cause was **outbox processor stuck on locked rows** affecting `fraud-event-consumer` through `RabbitMQ`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- eventual consistency gap
- synchronized traffic bursts
- insufficient load testing
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `fraud-event-consumer`, `RabbitMQ`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- route traffic away from degraded dependency
- scale consumers

## Preventive Actions

- add dependency saturation dashboard
- add canary validation
- add bulkhead isolation
- improve idempotency handling

## Lessons Learned

This incident shows that **eventual consistency gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: eventual consistency gap
- Useful query terms: fraud-event-consumer, RabbitMQ, eventual consistency gap, outbox processor stuck on locked rows
