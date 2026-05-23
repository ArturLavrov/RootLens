# INC-0094: incident-response delayed payouts due to runbook outdated

## Metadata

- Date: 2025-10-14
- Severity: SEV1
- Region: EU-West
- Failure family: Observability / Human Failures
- Primary service: incident-response
- Primary technology: runbooks
- Ground truth pattern: process gap

## Summary

A production incident affected the `incident-response` flow and caused delayed payouts. The immediate technical trigger was **runbook outdated**, but the broader failure pattern was **process gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the EU-West region. The incident lasted approximately 172 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- increased timeout rate
- inconsistent state observed by customers
- connection pool pressure
- queue growth
- dashboard lacked key metric
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed increased timeout rate and inconsistent state observed by customers in incident-response.
- 09:27 — Triage linked the issue to runbooks behavior and suspected process gap.
- 09:48 — Mitigation started: restart affected pods and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 172 minutes total duration.

## Root Cause

The root cause was **runbook outdated** affecting `incident-response` through `runbooks`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- process gap
- insufficient backpressure
- missing circuit breaker
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `incident-response`, `runbooks`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- route traffic away from degraded dependency
- reduce retry rate

## Preventive Actions

- add cache invalidation test
- introduce jittered exponential backoff
- add SLO alerting
- improve idempotency handling

## Lessons Learned

This incident shows that **process gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: process gap
- Useful query terms: incident-response, runbooks, process gap, runbook outdated
