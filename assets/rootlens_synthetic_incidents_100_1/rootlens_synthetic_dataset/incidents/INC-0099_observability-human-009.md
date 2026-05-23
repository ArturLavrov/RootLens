# INC-0099: payment-options increased error rate due to incident commander handoff failed

## Metadata

- Date: 2025-10-31
- Severity: SEV1
- Region: US-East
- Failure family: Observability / Human Failures
- Primary service: payment-options
- Primary technology: Grafana
- Ground truth pattern: long MTTR

## Summary

A production incident affected the `payment-options` flow and caused increased error rate. The immediate technical trigger was **incident commander handoff failed**, but the broader failure pattern was **long MTTR**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the US-East region. The incident lasted approximately 117 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- unclear ownership during triage
- manual mitigation required
- connection pool pressure
- dashboard lacked key metric
- inconsistent state observed by customers
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed unclear ownership during triage and manual mitigation required in payment-options.
- 09:27 — Triage linked the issue to Grafana behavior and suspected long MTTR.
- 09:48 — Mitigation started: disable feature flag and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 117 minutes total duration.

## Root Cause

The root cause was **incident commander handoff failed** affecting `payment-options` through `Grafana`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- long MTTR
- unclear ownership
- missing circuit breaker
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-options`, `Grafana`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- restart affected pods
- reduce retry rate

## Preventive Actions

- improve idempotency handling
- add dependency saturation dashboard
- add SLO alerting
- document runbook

## Lessons Learned

This incident shows that **long MTTR** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: long MTTR
- Useful query terms: payment-options, Grafana, long MTTR, incident commander handoff failed
