# INC-0055: payment-status-consumer delayed payment status updates due to consumer lag after deployment

## Metadata

- Date: 2025-06-19
- Severity: SEV1
- Region: EU
- Failure family: Queue / Messaging Failures
- Primary service: payment-status-consumer
- Primary technology: consumer group
- Ground truth pattern: message duplication

## Summary

A production incident affected the `payment-status-consumer` flow and caused delayed payment status updates. The immediate technical trigger was **consumer lag after deployment**, but the broader failure pattern was **message duplication**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the EU region. The incident lasted approximately 177 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent 5xx errors
- message redelivery spike
- slow dependency calls
- inconsistent state observed by customers
- consumer lag
- connection pool pressure

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed intermittent 5xx errors and message redelivery spike in payment-status-consumer.
- 09:27 — Triage linked the issue to consumer group behavior and suspected message duplication.
- 09:48 — Mitigation started: route traffic away from degraded dependency and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 177 minutes total duration.

## Root Cause

The root cause was **consumer lag after deployment** affecting `payment-status-consumer` through `consumer group`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- message duplication
- lack of bulkhead isolation
- manual rollback process
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-status-consumer`, `consumer group`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- disable feature flag
- increase connection pool limit

## Preventive Actions

- add dependency saturation dashboard
- add cache invalidation test
- add bulkhead isolation
- document runbook

## Lessons Learned

This incident shows that **message duplication** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Queue / Messaging Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Queue / Messaging Failures
- Expected causal pattern: message duplication
- Useful query terms: payment-status-consumer, consumer group, message duplication, consumer lag after deployment
