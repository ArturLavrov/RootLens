# INC-0029: risk-engine elevated checkout latency due to connection objects not disposed

## Metadata

- Date: 2025-04-03
- Severity: SEV2
- Region: US-East
- Failure family: OOM / Memory Leaks
- Primary service: risk-engine
- Primary technology: OpenTelemetry
- Ground truth pattern: progressive resource exhaustion

## Summary

A production incident affected the `risk-engine` flow and caused elevated checkout latency. The immediate technical trigger was **connection objects not disposed**, but the broader failure pattern was **progressive resource exhaustion**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US-East region. The incident lasted approximately 48 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- manual mitigation required
- slow dependency calls
- OOMKilled pods
- elevated p95 latency
- partial customer impact

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed queue growth and manual mitigation required in risk-engine.
- 09:27 — Triage linked the issue to OpenTelemetry behavior and suspected progressive resource exhaustion.
- 09:48 — Mitigation started: reduce retry rate and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 48 minutes total duration.

## Root Cause

The root cause was **connection objects not disposed** affecting `risk-engine` through `OpenTelemetry`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- progressive resource exhaustion
- insufficient load testing
- manual rollback process
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-engine`, `OpenTelemetry`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- disable feature flag
- restart affected pods

## Preventive Actions

- add SLO alerting
- enforce config validation
- add synthetic transaction check
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **progressive resource exhaustion** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `OOM / Memory Leaks` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: OOM / Memory Leaks
- Expected causal pattern: progressive resource exhaustion
- Useful query terms: risk-engine, OpenTelemetry, progressive resource exhaustion, connection objects not disposed
