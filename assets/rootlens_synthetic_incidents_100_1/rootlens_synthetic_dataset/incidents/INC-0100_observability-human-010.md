# INC-0100: incident-response merchant portal degradation due to metric cardinality change broke dashboard query

## Metadata

- Date: 2025-11-01
- Severity: SEV1
- Region: EU-West
- Failure family: Observability / Human Failures
- Primary service: incident-response
- Primary technology: Loki
- Ground truth pattern: poor observability

## Summary

A production incident affected the `incident-response` flow and caused merchant portal degradation. The immediate technical trigger was **metric cardinality change broke dashboard query**, but the broader failure pattern was **poor observability**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the EU-West region. The incident lasted approximately 51 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- unclear ownership during triage
- increased timeout rate
- connection pool pressure
- CPU saturation
- elevated p95 latency
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed unclear ownership during triage and increased timeout rate in incident-response.
- 09:27 — Triage linked the issue to Loki behavior and suspected poor observability.
- 09:48 — Mitigation started: route traffic away from degraded dependency and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 51 minutes total duration.

## Root Cause

The root cause was **metric cardinality change broke dashboard query** affecting `incident-response` through `Loki`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- poor observability
- weak alerting
- insufficient load testing
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `incident-response`, `Loki`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- add temporary rate limit
- rollback recent change

## Preventive Actions

- add bulkhead isolation
- add synthetic transaction check
- add load test scenario
- add SLO alerting

## Lessons Learned

This incident shows that **poor observability** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: poor observability
- Useful query terms: incident-response, Loki, poor observability, metric cardinality change broke dashboard query
