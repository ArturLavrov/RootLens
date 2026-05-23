# INC-0095: sre-tooling inconsistent payment method availability due to logs missing correlation ids

## Metadata

- Date: 2025-10-18
- Severity: SEV2
- Region: US
- Failure family: Observability / Human Failures
- Primary service: sre-tooling
- Primary technology: runbooks
- Ground truth pattern: long MTTR

## Summary

A production incident affected the `sre-tooling` flow and caused inconsistent payment method availability. The immediate technical trigger was **logs missing correlation IDs**, but the broader failure pattern was **long MTTR**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US region. The incident lasted approximately 95 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- increased timeout rate
- dashboard lacked key metric
- manual mitigation required
- unclear ownership during triage
- inconsistent state observed by customers
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed increased timeout rate and dashboard lacked key metric in sre-tooling.
- 09:27 — Triage linked the issue to runbooks behavior and suspected long MTTR.
- 09:48 — Mitigation started: enable circuit breaker and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 95 minutes total duration.

## Root Cause

The root cause was **logs missing correlation IDs** affecting `sre-tooling` through `runbooks`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- long MTTR
- unclear ownership
- insufficient load testing
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `sre-tooling`, `runbooks`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- increase connection pool limit
- manually replay failed messages

## Preventive Actions

- add SLO alerting
- enforce config validation
- add synthetic transaction check
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **long MTTR** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: long MTTR
- Useful query terms: sre-tooling, runbooks, long MTTR, logs missing correlation IDs
