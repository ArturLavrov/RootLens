# INC-0050: payment-api increased error rate due to vacuum/statistics delay causing bad query plans

## Metadata

- Date: 2025-06-04
- Severity: SEV2
- Region: EU-West
- Failure family: Database Saturation
- Primary service: payment-api
- Primary technology: Dapper
- Ground truth pattern: transaction latency

## Summary

A production incident affected the `payment-api` flow and caused increased error rate. The immediate technical trigger was **vacuum/statistics delay causing bad query plans**, but the broader failure pattern was **transaction latency**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU-West region. The incident lasted approximately 105 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- retry spikes
- inconsistent state observed by customers
- slow queries
- CPU saturation
- delayed async processing
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed retry spikes and inconsistent state observed by customers in payment-api.
- 09:27 — Triage linked the issue to Dapper behavior and suspected transaction latency.
- 09:48 — Mitigation started: rollback recent change and manually replay failed messages.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 105 minutes total duration.

## Root Cause

The root cause was **vacuum/statistics delay causing bad query plans** affecting `payment-api` through `Dapper`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- transaction latency
- manual rollback process
- missing circuit breaker
- weak alerting

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-api`, `Dapper`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- manually replay failed messages
- clear stale cache entries

## Preventive Actions

- add synthetic transaction check
- add dependency saturation dashboard
- improve idempotency handling
- document runbook

## Lessons Learned

This incident shows that **transaction latency** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: transaction latency
- Useful query terms: payment-api, Dapper, transaction latency, vacuum/statistics delay causing bad query plans
