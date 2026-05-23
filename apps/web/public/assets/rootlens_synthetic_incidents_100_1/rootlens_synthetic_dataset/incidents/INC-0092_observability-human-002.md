# INC-0092: incident-response increased error rate due to dashboard showed averages but hid p95 latency

## Metadata

- Date: 2025-10-09
- Severity: SEV3
- Region: Global
- Failure family: Observability / Human Failures
- Primary service: incident-response
- Primary technology: PagerDuty
- Ground truth pattern: process gap

## Summary

A production incident affected the `incident-response` flow and caused increased error rate. The immediate technical trigger was **dashboard showed averages but hid p95 latency**, but the broader failure pattern was **process gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the Global region. The incident lasted approximately 109 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- connection pool pressure
- slow dependency calls
- CPU saturation
- queue growth
- manual mitigation required
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed connection pool pressure and slow dependency calls in incident-response.
- 09:27 — Triage linked the issue to PagerDuty behavior and suspected process gap.
- 09:48 — Mitigation started: clear stale cache entries and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 109 minutes total duration.

## Root Cause

The root cause was **dashboard showed averages but hid p95 latency** affecting `incident-response` through `PagerDuty`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- process gap
- insufficient load testing
- high-cardinality metrics
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `incident-response`, `PagerDuty`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- manually replay failed messages
- scale consumers

## Preventive Actions

- add synthetic transaction check
- add canary validation
- add cache invalidation test
- improve idempotency handling

## Lessons Learned

This incident shows that **process gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: process gap
- Useful query terms: incident-response, PagerDuty, process gap, dashboard showed averages but hid p95 latency
