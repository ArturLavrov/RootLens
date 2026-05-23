# INC-0052: message-dispatcher delayed payment status updates due to kafka partition imbalance

## Metadata

- Date: 2025-06-11
- Severity: SEV2
- Region: US-East
- Failure family: Queue / Messaging Failures
- Primary service: message-dispatcher
- Primary technology: consumer group
- Ground truth pattern: eventual consistency gap

## Summary

A production incident affected the `message-dispatcher` flow and caused delayed payment status updates. The immediate technical trigger was **Kafka partition imbalance**, but the broader failure pattern was **eventual consistency gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the US-East region. The incident lasted approximately 37 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- pod restarts
- increased timeout rate
- consumer lag
- CPU saturation
- dead-letter growth
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed pod restarts and increased timeout rate in message-dispatcher.
- 09:27 — Triage linked the issue to consumer group behavior and suspected eventual consistency gap.
- 09:48 — Mitigation started: restart affected pods and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 37 minutes total duration.

## Root Cause

The root cause was **Kafka partition imbalance** affecting `message-dispatcher` through `consumer group`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- eventual consistency gap
- unclear ownership
- insufficient backpressure
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `message-dispatcher`, `consumer group`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- scale consumers
- enable circuit breaker

## Preventive Actions

- improve idempotency handling
- document runbook
- add dependency saturation dashboard
- add cache invalidation test

## Lessons Learned

This incident shows that **eventual consistency gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: eventual consistency gap
- Useful query terms: message-dispatcher, consumer group, eventual consistency gap, Kafka partition imbalance
