# INC-0054: outbox-worker partial payment failures due to dead-letter queue flood

## Metadata

- Date: 2025-06-17
- Severity: SEV2
- Region: US-East
- Failure family: Queue / Messaging Failures
- Primary service: outbox-worker
- Primary technology: consumer group
- Ground truth pattern: message duplication

## Summary

A production incident affected the `outbox-worker` flow and caused partial payment failures. The immediate technical trigger was **dead-letter queue flood**, but the broader failure pattern was **message duplication**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the US-East region. The incident lasted approximately 143 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- CPU saturation
- connection pool pressure
- message redelivery spike
- slow dependency calls
- elevated p95 latency

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed queue growth and CPU saturation in outbox-worker.
- 09:27 — Triage linked the issue to consumer group behavior and suspected message duplication.
- 09:48 — Mitigation started: manually replay failed messages and rollback recent change.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 143 minutes total duration.

## Root Cause

The root cause was **dead-letter queue flood** affecting `outbox-worker` through `consumer group`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- message duplication
- insufficient load testing
- high-cardinality metrics
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `outbox-worker`, `consumer group`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- rollback recent change
- add temporary rate limit

## Preventive Actions

- add synthetic transaction check
- enforce config validation
- improve idempotency handling
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **message duplication** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: message duplication
- Useful query terms: outbox-worker, consumer group, message duplication, dead-letter queue flood
