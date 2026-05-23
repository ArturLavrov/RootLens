# INC-0008: checkout-api inconsistent payment method availability due to resolver connection exhaustion

## Metadata

- Date: 2025-01-31
- Severity: SEV3
- Region: EU-West
- Failure family: DNS Failures
- Primary service: checkout-api
- Primary technology: Consul DNS
- Ground truth pattern: partial regional degradation

## Summary

A production incident affected the `checkout-api` flow and caused inconsistent payment method availability. The immediate technical trigger was **resolver connection exhaustion**, but the broader failure pattern was **partial regional degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU-West region. The incident lasted approximately 54 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- intermittent service discovery failures
- connection pool pressure
- retry spikes
- intermittent 5xx errors
- DNS lookup latency
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed intermittent service discovery failures and connection pool pressure in checkout-api.
- 09:27 — Triage linked the issue to Consul DNS behavior and suspected partial regional degradation.
- 09:48 — Mitigation started: clear stale cache entries and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 54 minutes total duration.

## Root Cause

The root cause was **resolver connection exhaustion** affecting `checkout-api` through `Consul DNS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial regional degradation
- manual rollback process
- unclear ownership
- insufficient load testing

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `Consul DNS`, and downstream impact was not immediately visible.

## Resolution

- clear stale cache entries
- increase connection pool limit
- restart affected pods

## Preventive Actions

- add synthetic transaction check
- add bulkhead isolation
- add cache invalidation test
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **partial regional degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: partial regional degradation
- Useful query terms: checkout-api, Consul DNS, partial regional degradation, resolver connection exhaustion
