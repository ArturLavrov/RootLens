# INC-0001: payout-service elevated checkout latency due to coredns resolver saturation

## Metadata

- Date: 2025-01-08
- Severity: SEV3
- Region: US
- Failure family: DNS Failures
- Primary service: payout-service
- Primary technology: CoreDNS
- Ground truth pattern: dependency discovery failure

## Summary

A production incident affected the `payout-service` flow and caused elevated checkout latency. The immediate technical trigger was **CoreDNS resolver saturation**, but the broader failure pattern was **dependency discovery failure**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US region. The incident lasted approximately 57 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- retry spikes
- slow dependency calls
- pod restarts
- elevated p95 latency
- manual mitigation required
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by error-rate alert.
- 09:14 — On-call observed retry spikes and slow dependency calls in payout-service.
- 09:27 — Triage linked the issue to CoreDNS behavior and suspected dependency discovery failure.
- 09:48 — Mitigation started: disable feature flag and scale consumers.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 57 minutes total duration.

## Root Cause

The root cause was **CoreDNS resolver saturation** affecting `payout-service` through `CoreDNS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency discovery failure
- unclear ownership
- synchronized traffic bursts
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payout-service`, `CoreDNS`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- scale consumers
- manually replay failed messages

## Preventive Actions

- enforce config validation
- document runbook
- add synthetic transaction check
- add load test scenario

## Lessons Learned

This incident shows that **dependency discovery failure** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: dependency discovery failure
- Useful query terms: payout-service, CoreDNS, dependency discovery failure, CoreDNS resolver saturation
