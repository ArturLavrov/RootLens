# INC-0061: provider-adapter delayed payment status updates due to wrong timeout configuration deployed

## Metadata

- Date: 2025-07-08
- Severity: SEV3
- Region: APAC
- Failure family: Deployment / Config Drift
- Primary service: provider-adapter
- Primary technology: Helm
- Ground truth pattern: partial environment impact

## Summary

A production incident affected the `provider-adapter` flow and caused delayed payment status updates. The immediate technical trigger was **wrong timeout configuration deployed**, but the broader failure pattern was **partial environment impact**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the APAC region. The incident lasted approximately 52 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- started after deployment
- retry spikes
- one environment affected
- pod restarts
- connection pool pressure
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed started after deployment and retry spikes in provider-adapter.
- 09:27 — Triage linked the issue to Helm behavior and suspected partial environment impact.
- 09:48 — Mitigation started: reduce retry rate and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 52 minutes total duration.

## Root Cause

The root cause was **wrong timeout configuration deployed** affecting `provider-adapter` through `Helm`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial environment impact
- insufficient load testing
- synchronized traffic bursts
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `provider-adapter`, `Helm`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- increase connection pool limit
- rollback recent change

## Preventive Actions

- enforce config validation
- add SLO alerting
- add synthetic transaction check
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **partial environment impact** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: partial environment impact
- Useful query terms: provider-adapter, Helm, partial environment impact, wrong timeout configuration deployed
