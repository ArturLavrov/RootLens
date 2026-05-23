# INC-0098: payment-options increased error rate due to no synthetic checks for critical flow

## Metadata

- Date: 2025-10-27
- Severity: SEV3
- Region: APAC
- Failure family: Observability / Human Failures
- Primary service: payment-options
- Primary technology: PagerDuty
- Ground truth pattern: process gap

## Summary

A production incident affected the `payment-options` flow and caused increased error rate. The immediate technical trigger was **no synthetic checks for critical flow**, but the broader failure pattern was **process gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the APAC region. The incident lasted approximately 168 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- unclear ownership during triage
- queue growth
- elevated p95 latency
- inconsistent state observed by customers
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed delayed async processing and unclear ownership during triage in payment-options.
- 09:27 — Triage linked the issue to PagerDuty behavior and suspected process gap.
- 09:48 — Mitigation started: increase connection pool limit and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 168 minutes total duration.

## Root Cause

The root cause was **no synthetic checks for critical flow** affecting `payment-options` through `PagerDuty`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- process gap
- limited runbook coverage
- high-cardinality metrics
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-options`, `PagerDuty`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- disable feature flag
- clear stale cache entries

## Preventive Actions

- add dependency saturation dashboard
- add load test scenario
- add canary validation
- document runbook

## Lessons Learned

This incident shows that **process gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: process gap
- Useful query terms: payment-options, PagerDuty, process gap, no synthetic checks for critical flow
