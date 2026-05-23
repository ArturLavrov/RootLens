# INC-0091: monitoring-stack partial payment failures due to missing alert for queue age

## Metadata

- Date: 2025-10-06
- Severity: SEV2
- Region: US-East
- Failure family: Observability / Human Failures
- Primary service: monitoring-stack
- Primary technology: Grafana
- Ground truth pattern: delayed detection

## Summary

A production incident affected the `monitoring-stack` flow and caused partial payment failures. The immediate technical trigger was **missing alert for queue age**, but the broader failure pattern was **delayed detection**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the US-East region. The incident lasted approximately 70 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- pod restarts
- retry spikes
- dashboard lacked key metric
- delayed async processing
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed inconsistent state observed by customers and pod restarts in monitoring-stack.
- 09:27 — Triage linked the issue to Grafana behavior and suspected delayed detection.
- 09:48 — Mitigation started: rollback recent change and enable circuit breaker.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 70 minutes total duration.

## Root Cause

The root cause was **missing alert for queue age** affecting `monitoring-stack` through `Grafana`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- delayed detection
- manual rollback process
- insufficient load testing
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `monitoring-stack`, `Grafana`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- enable circuit breaker
- disable feature flag

## Preventive Actions

- document runbook
- add bulkhead isolation
- add canary validation
- add synthetic transaction check

## Lessons Learned

This incident shows that **delayed detection** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Observability / Human Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Observability / Human Failures
- Expected causal pattern: delayed detection
- Useful query terms: monitoring-stack, Grafana, delayed detection, missing alert for queue age
