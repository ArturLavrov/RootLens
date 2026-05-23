# INC-0059: outbox-worker elevated checkout latency due to topic retention misconfiguration

## Metadata

- Date: 2025-07-02
- Severity: SEV1
- Region: EU-West
- Failure family: Queue / Messaging Failures
- Primary service: outbox-worker
- Primary technology: consumer group
- Ground truth pattern: async backlog

## Summary

A production incident affected the `outbox-worker` flow and caused elevated checkout latency. The immediate technical trigger was **topic retention misconfiguration**, but the broader failure pattern was **async backlog**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the EU-West region. The incident lasted approximately 118 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- retry spikes
- partial customer impact
- intermittent 5xx errors
- delayed async processing
- consumer lag

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed inconsistent state observed by customers and retry spikes in outbox-worker.
- 09:27 — Triage linked the issue to consumer group behavior and suspected async backlog.
- 09:48 — Mitigation started: enable circuit breaker and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 118 minutes total duration.

## Root Cause

The root cause was **topic retention misconfiguration** affecting `outbox-worker` through `consumer group`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- async backlog
- synchronized traffic bursts
- missing circuit breaker
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `outbox-worker`, `consumer group`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- manually replay failed messages
- rollback recent change

## Preventive Actions

- add cache invalidation test
- add dependency saturation dashboard
- add load test scenario
- add synthetic transaction check

## Lessons Learned

This incident shows that **async backlog** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: async backlog
- Useful query terms: outbox-worker, consumer group, async backlog, topic retention misconfiguration
