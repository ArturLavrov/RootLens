# INC-0079: payout-service increased error rate due to service mesh timeout mismatch

## Metadata

- Date: 2025-08-31
- Severity: SEV2
- Region: EU
- Failure family: Dependency Timeouts
- Primary service: payout-service
- Primary technology: TLS
- Ground truth pattern: request timeout

## Summary

A production incident affected the `payout-service` flow and caused increased error rate. The immediate technical trigger was **service mesh timeout mismatch**, but the broader failure pattern was **request timeout**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU region. The incident lasted approximately 57 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- partial customer impact
- inconsistent state observed by customers
- intermittent 5xx errors
- queue growth
- increased timeout rate

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed manual mitigation required and partial customer impact in payout-service.
- 09:27 — Triage linked the issue to TLS behavior and suspected request timeout.
- 09:48 — Mitigation started: disable feature flag and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 57 minutes total duration.

## Root Cause

The root cause was **service mesh timeout mismatch** affecting `payout-service` through `TLS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- request timeout
- insufficient backpressure
- weak alerting
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payout-service`, `TLS`, and downstream impact was not immediately visible.

## Resolution

- disable feature flag
- increase connection pool limit
- manually replay failed messages

## Preventive Actions

- add dependency saturation dashboard
- add load test scenario
- improve idempotency handling
- add synthetic transaction check

## Lessons Learned

This incident shows that **request timeout** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: request timeout
- Useful query terms: payout-service, TLS, request timeout, service mesh timeout mismatch
