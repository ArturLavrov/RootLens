# INC-0037: checkout-api partial payment failures due to cache warmup failure

## Metadata

- Date: 2025-04-27
- Severity: SEV3
- Region: EU
- Failure family: Cache Failures
- Primary service: checkout-api
- Primary technology: ElastiCache
- Ground truth pattern: inconsistent reads

## Summary

A production incident affected the `checkout-api` flow and caused partial payment failures. The immediate technical trigger was **cache warmup failure**, but the broader failure pattern was **inconsistent reads**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced partial payment failures in the EU region. The incident lasted approximately 64 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- slow dependency calls
- CPU saturation
- increased timeout rate
- stale cached values
- delayed async processing
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by queue-depth alert.
- 09:14 — On-call observed slow dependency calls and CPU saturation in checkout-api.
- 09:27 — Triage linked the issue to ElastiCache behavior and suspected inconsistent reads.
- 09:48 — Mitigation started: route traffic away from degraded dependency and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 64 minutes total duration.

## Root Cause

The root cause was **cache warmup failure** affecting `checkout-api` through `ElastiCache`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- inconsistent reads
- manual rollback process
- high-cardinality metrics
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `ElastiCache`, and downstream impact was not immediately visible.

## Resolution

- route traffic away from degraded dependency
- reduce retry rate
- rollback recent change

## Preventive Actions

- enforce config validation
- add canary validation
- add load test scenario
- add SLO alerting

## Lessons Learned

This incident shows that **inconsistent reads** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Cache Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Cache Failures
- Expected causal pattern: inconsistent reads
- Useful query terms: checkout-api, ElastiCache, inconsistent reads, cache warmup failure
