# INC-0003: payout-service partial payment failures due to route53 propagation delay

## Metadata

- Date: 2025-01-14
- Severity: SEV2
- Region: APAC
- Failure family: DNS Failures
- Primary service: payout-service
- Primary technology: CoreDNS
- Ground truth pattern: dependency discovery failure

## Summary

A production incident affected the `payout-service` flow and caused partial payment failures. The immediate technical trigger was **Route53 propagation delay**, but the broader failure pattern was **dependency discovery failure**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the APAC region. The incident lasted approximately 81 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- intermittent 5xx errors
- CPU saturation
- inconsistent state observed by customers
- partial customer impact
- retry spikes

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed manual mitigation required and intermittent 5xx errors in payout-service.
- 09:27 — Triage linked the issue to CoreDNS behavior and suspected dependency discovery failure.
- 09:48 — Mitigation started: manually replay failed messages and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 81 minutes total duration.

## Root Cause

The root cause was **Route53 propagation delay** affecting `payout-service` through `CoreDNS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency discovery failure
- lack of bulkhead isolation
- synchronized traffic bursts
- unclear ownership

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payout-service`, `CoreDNS`, and downstream impact was not immediately visible.

## Resolution

- manually replay failed messages
- clear stale cache entries
- reduce retry rate

## Preventive Actions

- improve idempotency handling
- introduce jittered exponential backoff
- add bulkhead isolation
- document runbook

## Lessons Learned

This incident shows that **dependency discovery failure** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: dependency discovery failure
- Useful query terms: payout-service, CoreDNS, dependency discovery failure, Route53 propagation delay
