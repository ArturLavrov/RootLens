# INC-0009: payment-api increased error rate due to incorrect service discovery record

## Metadata

- Date: 2025-02-01
- Severity: SEV2
- Region: EU-West
- Failure family: DNS Failures
- Primary service: payment-api
- Primary technology: Route53
- Ground truth pattern: dependency discovery failure

## Summary

A production incident affected the `payment-api` flow and caused increased error rate. The immediate technical trigger was **incorrect service discovery record**, but the broader failure pattern was **dependency discovery failure**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU-West region. The incident lasted approximately 80 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- increased timeout rate
- delayed async processing
- inconsistent state observed by customers
- intermittent service discovery failures
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed elevated p95 latency and increased timeout rate in payment-api.
- 09:27 — Triage linked the issue to Route53 behavior and suspected dependency discovery failure.
- 09:48 — Mitigation started: reduce retry rate and disable feature flag.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 80 minutes total duration.

## Root Cause

The root cause was **incorrect service discovery record** affecting `payment-api` through `Route53`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- dependency discovery failure
- missing circuit breaker
- insufficient backpressure
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-api`, `Route53`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- disable feature flag
- scale consumers

## Preventive Actions

- add load test scenario
- add synthetic transaction check
- document runbook
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **dependency discovery failure** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: dependency discovery failure
- Useful query terms: payment-api, Route53, dependency discovery failure, incorrect service discovery record
