# INC-0004: payment-api delayed payouts due to bad internal dns rollout

## Metadata

- Date: 2025-01-19
- Severity: SEV2
- Region: US-East
- Failure family: DNS Failures
- Primary service: payment-api
- Primary technology: Envoy
- Ground truth pattern: partial regional degradation

## Summary

A production incident affected the `payment-api` flow and caused delayed payouts. The immediate technical trigger was **bad internal DNS rollout**, but the broader failure pattern was **partial regional degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the US-East region. The incident lasted approximately 164 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- NXDOMAIN spikes
- manual mitigation required
- DNS lookup latency
- elevated p95 latency
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed inconsistent state observed by customers and NXDOMAIN spikes in payment-api.
- 09:27 — Triage linked the issue to Envoy behavior and suspected partial regional degradation.
- 09:48 — Mitigation started: clear stale cache entries and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 164 minutes total duration.

## Root Cause

The root cause was **bad internal DNS rollout** affecting `payment-api` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial regional degradation
- insufficient backpressure
- lack of bulkhead isolation
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-api`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- reduce retry rate
- scale consumers

## Preventive Actions

- improve idempotency handling
- add canary validation
- document runbook
- add synthetic transaction check

## Lessons Learned

This incident shows that **partial regional degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: partial regional degradation
- Useful query terms: payment-api, Envoy, partial regional degradation, bad internal DNS rollout
