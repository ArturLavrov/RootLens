# INC-0051: fraud-event-consumer delayed payouts due to rabbitmq queue growth after consumer crash loop

## Metadata

- Date: 2025-06-09
- Severity: SEV2
- Region: US-East
- Failure family: Queue / Messaging Failures
- Primary service: fraud-event-consumer
- Primary technology: Kafka
- Ground truth pattern: message duplication

## Summary

A production incident affected the `fraud-event-consumer` flow and caused delayed payouts. The immediate technical trigger was **RabbitMQ queue growth after consumer crash loop**, but the broader failure pattern was **message duplication**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the US-East region. The incident lasted approximately 160 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- dead-letter growth
- pod restarts
- inconsistent state observed by customers
- increased timeout rate
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed intermittent 5xx errors and dead-letter growth in fraud-event-consumer.
- 09:27 — Triage linked the issue to Kafka behavior and suspected message duplication.
- 09:48 — Mitigation started: rollback recent change and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 160 minutes total duration.

## Root Cause

The root cause was **RabbitMQ queue growth after consumer crash loop** affecting `fraud-event-consumer` through `Kafka`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- message duplication
- synchronized traffic bursts
- manual rollback process
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `fraud-event-consumer`, `Kafka`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- restart affected pods
- scale consumers

## Preventive Actions

- add synthetic transaction check
- add cache invalidation test
- document runbook
- add canary validation

## Lessons Learned

This incident shows that **message duplication** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: message duplication
- Useful query terms: fraud-event-consumer, Kafka, message duplication, RabbitMQ queue growth after consumer crash loop
