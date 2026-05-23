# INC-0087: payments-domain merchant portal degradation due to missing bulkhead isolation

## Metadata

- Date: 2025-09-25
- Severity: SEV1
- Region: APAC
- Failure family: Cascading Failures
- Primary service: payments-domain
- Primary technology: Envoy
- Ground truth pattern: shared dependency saturation

## Summary

A production incident affected the `payments-domain` flow and caused merchant portal degradation. The immediate technical trigger was **missing bulkhead isolation**, but the broader failure pattern was **shared dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the APAC region. The incident lasted approximately 174 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- traffic shifted to unhealthy path
- intermittent 5xx errors
- connection pool pressure
- elevated p95 latency
- increased timeout rate
- pod restarts

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed traffic shifted to unhealthy path and intermittent 5xx errors in payments-domain.
- 09:27 — Triage linked the issue to Envoy behavior and suspected shared dependency saturation.
- 09:48 — Mitigation started: increase connection pool limit and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 174 minutes total duration.

## Root Cause

The root cause was **missing bulkhead isolation** affecting `payments-domain` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- shared dependency saturation
- weak alerting
- high-cardinality metrics
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payments-domain`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- restart affected pods
- rollback recent change

## Preventive Actions

- enforce config validation
- add SLO alerting
- add bulkhead isolation
- document runbook

## Lessons Learned

This incident shows that **shared dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: shared dependency saturation
- Useful query terms: payments-domain, Envoy, shared dependency saturation, missing bulkhead isolation
