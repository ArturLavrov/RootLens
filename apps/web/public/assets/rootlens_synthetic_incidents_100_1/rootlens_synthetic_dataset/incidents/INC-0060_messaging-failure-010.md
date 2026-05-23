# INC-0060: settlement-consumer delayed payment status updates due to schema incompatibility in event consumer

## Metadata

- Date: 2025-07-06
- Severity: SEV2
- Region: Global
- Failure family: Queue / Messaging Failures
- Primary service: settlement-consumer
- Primary technology: SQS
- Ground truth pattern: message duplication

## Summary

A production incident affected the `settlement-consumer` flow and caused delayed payment status updates. The immediate technical trigger was **schema incompatibility in event consumer**, but the broader failure pattern was **message duplication**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the Global region. The incident lasted approximately 77 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- partial customer impact
- pod restarts
- increased timeout rate
- intermittent 5xx errors
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed queue growth and partial customer impact in settlement-consumer.
- 09:27 — Triage linked the issue to SQS behavior and suspected message duplication.
- 09:48 — Mitigation started: rollback recent change and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 77 minutes total duration.

## Root Cause

The root cause was **schema incompatibility in event consumer** affecting `settlement-consumer` through `SQS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- message duplication
- synchronized traffic bursts
- limited runbook coverage
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-consumer`, `SQS`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- scale consumers
- increase connection pool limit

## Preventive Actions

- improve idempotency handling
- add SLO alerting
- add cache invalidation test
- document runbook

## Lessons Learned

This incident shows that **message duplication** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: message duplication
- Useful query terms: settlement-consumer, SQS, message duplication, schema incompatibility in event consumer
