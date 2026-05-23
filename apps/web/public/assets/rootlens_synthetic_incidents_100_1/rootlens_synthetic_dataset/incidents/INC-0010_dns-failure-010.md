# INC-0010: payout-service inconsistent payment method availability due to dns negative caching issue

## Metadata

- Date: 2025-02-04
- Severity: SEV2
- Region: Global
- Failure family: DNS Failures
- Primary service: payout-service
- Primary technology: Nginx
- Ground truth pattern: partial regional degradation

## Summary

A production incident affected the `payout-service` flow and caused inconsistent payment method availability. The immediate technical trigger was **DNS negative caching issue**, but the broader failure pattern was **partial regional degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the Global region. The incident lasted approximately 126 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- queue growth
- inconsistent state observed by customers
- pod restarts
- partial customer impact
- NXDOMAIN spikes
- delayed async processing

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed queue growth and inconsistent state observed by customers in payout-service.
- 09:27 — Triage linked the issue to Nginx behavior and suspected partial regional degradation.
- 09:48 — Mitigation started: rollback recent change and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 126 minutes total duration.

## Root Cause

The root cause was **DNS negative caching issue** affecting `payout-service` through `Nginx`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial regional degradation
- limited runbook coverage
- insufficient backpressure
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payout-service`, `Nginx`, and downstream impact was not immediately visible.

## Resolution

- rollback recent change
- increase connection pool limit
- restart affected pods

## Preventive Actions

- add dependency saturation dashboard
- document runbook
- improve idempotency handling
- add bulkhead isolation

## Lessons Learned

This incident shows that **partial regional degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: partial regional degradation
- Useful query terms: payout-service, Nginx, partial regional degradation, DNS negative caching issue
