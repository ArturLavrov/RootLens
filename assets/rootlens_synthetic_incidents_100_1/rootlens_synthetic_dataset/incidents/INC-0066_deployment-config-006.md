# INC-0066: checkout-api delayed payouts due to bad canary rollout

## Metadata

- Date: 2025-07-24
- Severity: SEV3
- Region: APAC
- Failure family: Deployment / Config Drift
- Primary service: checkout-api
- Primary technology: ConfigMap
- Ground truth pattern: change-induced incident

## Summary

A production incident affected the `checkout-api` flow and caused delayed payouts. The immediate technical trigger was **bad canary rollout**, but the broader failure pattern was **change-induced incident**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the APAC region. The incident lasted approximately 43 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- elevated p95 latency
- queue growth
- delayed async processing
- CPU saturation
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed partial customer impact and elevated p95 latency in checkout-api.
- 09:27 — Triage linked the issue to ConfigMap behavior and suspected change-induced incident.
- 09:48 — Mitigation started: restart affected pods and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 43 minutes total duration.

## Root Cause

The root cause was **bad canary rollout** affecting `checkout-api` through `ConfigMap`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- change-induced incident
- insufficient load testing
- synchronized traffic bursts
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `ConfigMap`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- manually replay failed messages
- clear stale cache entries

## Preventive Actions

- enforce config validation
- add cache invalidation test
- add canary validation
- add SLO alerting

## Lessons Learned

This incident shows that **change-induced incident** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Deployment / Config Drift` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Deployment / Config Drift
- Expected causal pattern: change-induced incident
- Useful query terms: checkout-api, ConfigMap, change-induced incident, bad canary rollout
