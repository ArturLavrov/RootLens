# INC-0002: checkout-api elevated checkout latency due to stale dns records after failover

## Metadata

- Date: 2025-01-11
- Severity: SEV2
- Region: US
- Failure family: DNS Failures
- Primary service: checkout-api
- Primary technology: Route53
- Ground truth pattern: partial regional degradation

## Summary

A production incident affected the `checkout-api` flow and caused elevated checkout latency. The immediate technical trigger was **stale DNS records after failover**, but the broader failure pattern was **partial regional degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US region. The incident lasted approximately 108 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- manual mitigation required
- increased timeout rate
- partial customer impact
- NXDOMAIN spikes
- slow dependency calls
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed manual mitigation required and increased timeout rate in checkout-api.
- 09:27 — Triage linked the issue to Route53 behavior and suspected partial regional degradation.
- 09:48 — Mitigation started: increase connection pool limit and reduce retry rate.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 108 minutes total duration.

## Root Cause

The root cause was **stale DNS records after failover** affecting `checkout-api` through `Route53`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial regional degradation
- insufficient backpressure
- limited runbook coverage
- missing circuit breaker

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `Route53`, and downstream impact was not immediately visible.

## Resolution

- increase connection pool limit
- reduce retry rate
- disable feature flag

## Preventive Actions

- add load test scenario
- improve idempotency handling
- add canary validation
- document runbook

## Lessons Learned

This incident shows that **partial regional degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: partial regional degradation
- Useful query terms: checkout-api, Route53, partial regional degradation, stale DNS records after failover
