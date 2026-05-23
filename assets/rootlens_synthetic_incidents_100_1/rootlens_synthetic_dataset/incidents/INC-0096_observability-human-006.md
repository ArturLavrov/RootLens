# INC-0096: monitoring-stack increased error rate due to manual mitigation delayed by approval process

## Metadata

- Date: 2025-10-21
- Severity: SEV1
- Region: EU-West
- Failure family: Observability / Human Failures
- Primary service: monitoring-stack
- Primary technology: OpenTelemetry
- Ground truth pattern: delayed detection

## Summary

A production incident affected the `monitoring-stack` flow and caused increased error rate. The immediate technical trigger was **manual mitigation delayed by approval process**, but the broader failure pattern was **delayed detection**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU-West region. The incident lasted approximately 49 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- dashboard lacked key metric
- inconsistent state observed by customers
- connection pool pressure
- alert fired late
- CPU saturation
- retry spikes

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed dashboard lacked key metric and inconsistent state observed by customers in monitoring-stack.
- 09:27 — Triage linked the issue to OpenTelemetry behavior and suspected delayed detection.
- 09:48 — Mitigation started: scale consumers and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 49 minutes total duration.

## Root Cause

The root cause was **manual mitigation delayed by approval process** affecting `monitoring-stack` through `OpenTelemetry`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- delayed detection
- insufficient load testing
- limited runbook coverage
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `monitoring-stack`, `OpenTelemetry`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- reduce retry rate
- restart affected pods

## Preventive Actions

- introduce jittered exponential backoff
- add synthetic transaction check
- add load test scenario
- add cache invalidation test

## Lessons Learned

This incident shows that **delayed detection** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: delayed detection
- Useful query terms: monitoring-stack, OpenTelemetry, delayed detection, manual mitigation delayed by approval process
