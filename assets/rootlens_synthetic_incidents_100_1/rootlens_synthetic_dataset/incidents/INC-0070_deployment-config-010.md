# INC-0070: provider-adapter inconsistent payment method availability due to region-specific config drift

## Metadata

- Date: 2025-08-05
- Severity: SEV2
- Region: APAC
- Failure family: Deployment / Config Drift
- Primary service: provider-adapter
- Primary technology: CI/CD pipeline
- Ground truth pattern: rollback mitigation

## Summary

A production incident affected the `provider-adapter` flow and caused inconsistent payment method availability. The immediate technical trigger was **region-specific config drift**, but the broader failure pattern was **rollback mitigation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the APAC region. The incident lasted approximately 119 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- started after deployment
- retry spikes
- rollback improved health
- queue growth
- slow dependency calls
- one environment affected

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed started after deployment and retry spikes in provider-adapter.
- 09:27 — Triage linked the issue to CI/CD pipeline behavior and suspected rollback mitigation.
- 09:48 — Mitigation started: restart affected pods and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 119 minutes total duration.

## Root Cause

The root cause was **region-specific config drift** affecting `provider-adapter` through `CI/CD pipeline`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- rollback mitigation
- high-cardinality metrics
- insufficient backpressure
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `provider-adapter`, `CI/CD pipeline`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- disable feature flag
- reduce retry rate

## Preventive Actions

- add bulkhead isolation
- add dependency saturation dashboard
- add load test scenario
- improve idempotency handling

## Lessons Learned

This incident shows that **rollback mitigation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: rollback mitigation
- Useful query terms: provider-adapter, CI/CD pipeline, rollback mitigation, region-specific config drift
