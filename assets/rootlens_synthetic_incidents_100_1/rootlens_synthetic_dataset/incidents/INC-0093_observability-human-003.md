# INC-0093: incident-response delayed payouts due to unclear service ownership

## Metadata

- Date: 2025-10-12
- Severity: SEV2
- Region: EU-West
- Failure family: Observability / Human Failures
- Primary service: incident-response
- Primary technology: runbooks
- Ground truth pattern: process gap

## Summary

A production incident affected the `incident-response` flow and caused delayed payouts. The immediate technical trigger was **unclear service ownership**, but the broader failure pattern was **process gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the EU-West region. The incident lasted approximately 161 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- manual mitigation required
- dashboard lacked key metric
- retry spikes
- intermittent 5xx errors
- elevated p95 latency

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed delayed async processing and manual mitigation required in incident-response.
- 09:27 — Triage linked the issue to runbooks behavior and suspected process gap.
- 09:48 — Mitigation started: route traffic away from degraded dependency and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 161 minutes total duration.

## Root Cause

The root cause was **unclear service ownership** affecting `incident-response` through `runbooks`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- process gap
- high-cardinality metrics
- missing circuit breaker
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `incident-response`, `runbooks`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- clear stale cache entries
- manually replay failed messages

## Preventive Actions

- document runbook
- add cache invalidation test
- add bulkhead isolation
- add load test scenario

## Lessons Learned

This incident shows that **process gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: process gap
- Useful query terms: incident-response, runbooks, process gap, unclear service ownership
