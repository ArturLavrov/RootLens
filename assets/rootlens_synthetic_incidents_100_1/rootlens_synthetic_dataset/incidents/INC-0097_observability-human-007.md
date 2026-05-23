# INC-0097: platform-observability delayed payouts due to alert routed to wrong team

## Metadata

- Date: 2025-10-25
- Severity: SEV3
- Region: EU-West
- Failure family: Observability / Human Failures
- Primary service: platform-observability
- Primary technology: runbooks
- Ground truth pattern: process gap

## Summary

A production incident affected the `platform-observability` flow and caused delayed payouts. The immediate technical trigger was **alert routed to wrong team**, but the broader failure pattern was **process gap**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the EU-West region. The incident lasted approximately 71 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- alert fired late
- pod restarts
- connection pool pressure
- partial customer impact
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed manual mitigation required and alert fired late in platform-observability.
- 09:27 — Triage linked the issue to runbooks behavior and suspected process gap.
- 09:48 — Mitigation started: enable circuit breaker and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 71 minutes total duration.

## Root Cause

The root cause was **alert routed to wrong team** affecting `platform-observability` through `runbooks`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- process gap
- manual rollback process
- missing circuit breaker
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `platform-observability`, `runbooks`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- route traffic away from degraded dependency
- restart affected pods

## Preventive Actions

- document runbook
- add SLO alerting
- add load test scenario
- enforce config validation

## Lessons Learned

This incident shows that **process gap** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: process gap
- Useful query terms: platform-observability, runbooks, process gap, alert routed to wrong team
