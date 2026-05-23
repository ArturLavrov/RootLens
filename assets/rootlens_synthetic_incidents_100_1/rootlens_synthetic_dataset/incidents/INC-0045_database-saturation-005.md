# INC-0045: settlement-worker delayed payment status updates due to slow query plan regression

## Metadata

- Date: 2025-05-21
- Severity: SEV3
- Region: EU
- Failure family: Database Saturation
- Primary service: settlement-worker
- Primary technology: PostgreSQL
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `settlement-worker` flow and caused delayed payment status updates. The immediate technical trigger was **slow query plan regression**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the EU region. The incident lasted approximately 36 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- delayed async processing
- pod restarts
- retry spikes
- queue growth
- connection pool pressure
- DB CPU saturation

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed delayed async processing and pod restarts in settlement-worker.
- 09:27 — Triage linked the issue to PostgreSQL behavior and suspected queue buildup.
- 09:48 — Mitigation started: enable circuit breaker and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 36 minutes total duration.

## Root Cause

The root cause was **slow query plan regression** affecting `settlement-worker` through `PostgreSQL`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- synchronized traffic bursts
- weak alerting
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `settlement-worker`, `PostgreSQL`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- reduce retry rate
- increase connection pool limit

## Preventive Actions

- improve idempotency handling
- document runbook
- add synthetic transaction check
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: settlement-worker, PostgreSQL, queue buildup, slow query plan regression
