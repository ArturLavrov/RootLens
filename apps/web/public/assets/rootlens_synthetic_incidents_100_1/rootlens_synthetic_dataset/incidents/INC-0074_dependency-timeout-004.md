# INC-0074: checkout-api increased error rate due to provider api rate limiting

## Metadata

- Date: 2025-08-17
- Severity: SEV2
- Region: EU
- Failure family: Dependency Timeouts
- Primary service: checkout-api
- Primary technology: TLS
- Ground truth pattern: thread starvation

## Summary

A production incident affected the `checkout-api` flow and caused increased error rate. The immediate technical trigger was **provider API rate limiting**, but the broader failure pattern was **thread starvation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU region. The incident lasted approximately 114 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- pod restarts
- downstream latency spike
- CPU saturation
- thread pool starvation
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed elevated p95 latency and pod restarts in checkout-api.
- 09:27 — Triage linked the issue to TLS behavior and suspected thread starvation.
- 09:48 — Mitigation started: rollback recent change and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 114 minutes total duration.

## Root Cause

The root cause was **provider API rate limiting** affecting `checkout-api` through `TLS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- thread starvation
- manual rollback process
- lack of bulkhead isolation
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `TLS`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- restart affected pods
- reduce retry rate

## Preventive Actions

- add canary validation
- document runbook
- add dependency saturation dashboard
- add cache invalidation test

## Lessons Learned

This incident shows that **thread starvation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: thread starvation
- Useful query terms: checkout-api, TLS, thread starvation, provider API rate limiting
