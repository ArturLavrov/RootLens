# INC-0088: merchant-platform merchant portal degradation due to shared thread pool saturation

## Metadata

- Date: 2025-09-28
- Severity: SEV1
- Region: EU-West
- Failure family: Cascading Failures
- Primary service: merchant-platform
- Primary technology: Envoy
- Ground truth pattern: shared dependency saturation

## Summary

A production incident affected the `merchant-platform` flow and caused merchant portal degradation. The immediate technical trigger was **shared thread pool saturation**, but the broader failure pattern was **shared dependency saturation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced merchant portal degradation in the EU-West region. The incident lasted approximately 162 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- retry spikes
- increased timeout rate
- pod restarts
- partial customer impact
- delayed async processing

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed queue growth and retry spikes in merchant-platform.
- 09:27 — Triage linked the issue to Envoy behavior and suspected shared dependency saturation.
- 09:48 — Mitigation started: scale consumers and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 162 minutes total duration.

## Root Cause

The root cause was **shared thread pool saturation** affecting `merchant-platform` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- shared dependency saturation
- insufficient load testing
- lack of bulkhead isolation
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `merchant-platform`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- add temporary rate limit
- disable feature flag

## Preventive Actions

- enforce config validation
- add bulkhead isolation
- add SLO alerting
- improve idempotency handling

## Lessons Learned

This incident shows that **shared dependency saturation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cascading Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cascading Failures
- Expected causal pattern: shared dependency saturation
- Useful query terms: merchant-platform, Envoy, shared dependency saturation, shared thread pool saturation
