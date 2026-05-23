# INC-0042: reporting-api delayed payouts due to connection pool exhaustion

## Metadata

- Date: 2025-05-13
- Severity: SEV3
- Region: APAC
- Failure family: Database Saturation
- Primary service: reporting-api
- Primary technology: Entity Framework
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `reporting-api` flow and caused delayed payouts. The immediate technical trigger was **connection pool exhaustion**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payouts in the APAC region. The incident lasted approximately 98 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- blocked sessions
- slow queries
- retry spikes
- CPU saturation
- connection pool pressure
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed blocked sessions and slow queries in reporting-api.
- 09:27 — Triage linked the issue to Entity Framework behavior and suspected queue buildup.
- 09:48 — Mitigation started: route traffic away from degraded dependency and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 98 minutes total duration.

## Root Cause

The root cause was **connection pool exhaustion** affecting `reporting-api` through `Entity Framework`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- lack of bulkhead isolation
- synchronized traffic bursts
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `reporting-api`, `Entity Framework`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- restart affected pods
- scale consumers

## Preventive Actions

- document runbook
- improve idempotency handling
- enforce config validation
- add cache invalidation test

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: reporting-api, Entity Framework, queue buildup, connection pool exhaustion
