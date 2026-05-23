# INC-0047: merchant-config-service partial payment failures due to tempdb saturation

## Metadata

- Date: 2025-05-27
- Severity: SEV3
- Region: APAC
- Failure family: Database Saturation
- Primary service: merchant-config-service
- Primary technology: MySQL
- Ground truth pattern: queue buildup

## Summary

A production incident affected the `merchant-config-service` flow and caused partial payment failures. The immediate technical trigger was **tempdb saturation**, but the broader failure pattern was **queue buildup**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the APAC region. The incident lasted approximately 190 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- slow dependency calls
- slow queries
- inconsistent state observed by customers
- delayed async processing
- blocked sessions

## Timeline

- 09:05 — Initial symptoms detected by Grafana dashboard.
- 09:14 — On-call observed elevated p95 latency and slow dependency calls in merchant-config-service.
- 09:27 — Triage linked the issue to MySQL behavior and suspected queue buildup.
- 09:48 — Mitigation started: scale consumers and add temporary rate limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 190 minutes total duration.

## Root Cause

The root cause was **tempdb saturation** affecting `merchant-config-service` through `MySQL`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- queue buildup
- synchronized traffic bursts
- limited runbook coverage
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `merchant-config-service`, `MySQL`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- add temporary rate limit
- restart affected pods

## Preventive Actions

- document runbook
- add cache invalidation test
- add load test scenario
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **queue buildup** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Database Saturation` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Database Saturation
- Expected causal pattern: queue buildup
- Useful query terms: merchant-config-service, MySQL, queue buildup, tempdb saturation
