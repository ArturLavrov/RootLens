# INC-0062: provider-adapter delayed payouts due to feature flag enabled for wrong tenant group

## Metadata

- Date: 2025-07-10
- Severity: SEV2
- Region: US-East
- Failure family: Deployment / Config Drift
- Primary service: provider-adapter
- Primary technology: Secret
- Ground truth pattern: rollback mitigation

## Summary

A production incident affected the `provider-adapter` flow and caused delayed payouts. The immediate technical trigger was **feature flag enabled for wrong tenant group**, but the broader failure pattern was **rollback mitigation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the US-East region. The incident lasted approximately 128 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- elevated p95 latency
- partial customer impact
- retry spikes
- slow dependency calls
- CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed manual mitigation required and elevated p95 latency in provider-adapter.
- 09:27 — Triage linked the issue to Secret behavior and suspected rollback mitigation.
- 09:48 — Mitigation started: reduce retry rate and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 128 minutes total duration.

## Root Cause

The root cause was **feature flag enabled for wrong tenant group** affecting `provider-adapter` through `Secret`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- rollback mitigation
- lack of bulkhead isolation
- missing circuit breaker
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `provider-adapter`, `Secret`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- scale consumers
- increase connection pool limit

## Preventive Actions

- improve idempotency handling
- enforce config validation
- add bulkhead isolation
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **rollback mitigation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: rollback mitigation
- Useful query terms: provider-adapter, Secret, rollback mitigation, feature flag enabled for wrong tenant group
