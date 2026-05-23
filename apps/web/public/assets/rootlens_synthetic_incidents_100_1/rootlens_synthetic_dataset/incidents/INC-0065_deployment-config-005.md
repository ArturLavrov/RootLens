# INC-0065: provider-adapter inconsistent payment method availability due to incompatible config between services

## Metadata

- Date: 2025-07-21
- Severity: SEV1
- Region: APAC
- Failure family: Deployment / Config Drift
- Primary service: provider-adapter
- Primary technology: ConfigMap
- Ground truth pattern: rollback mitigation

## Summary

A production incident affected the `provider-adapter` flow and caused inconsistent payment method availability. The immediate technical trigger was **incompatible config between services**, but the broader failure pattern was **rollback mitigation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the APAC region. The incident lasted approximately 95 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- retry spikes
- slow dependency calls
- one environment affected
- connection pool pressure
- pod restarts
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed retry spikes and slow dependency calls in provider-adapter.
- 09:27 — Triage linked the issue to ConfigMap behavior and suspected rollback mitigation.
- 09:48 — Mitigation started: route traffic away from degraded dependency and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 95 minutes total duration.

## Root Cause

The root cause was **incompatible config between services** affecting `provider-adapter` through `ConfigMap`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- rollback mitigation
- synchronized traffic bursts
- insufficient load testing
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `provider-adapter`, `ConfigMap`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- add temporary rate limit
- scale consumers

## Preventive Actions

- add canary validation
- improve idempotency handling
- add synthetic transaction check
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **rollback mitigation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: rollback mitigation
- Useful query terms: provider-adapter, ConfigMap, rollback mitigation, incompatible config between services
