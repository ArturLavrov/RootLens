# INC-0014: checkout-api delayed payment status updates due to synchronized retry bursts

## Metadata

- Date: 2025-02-16
- Severity: SEV1
- Region: US-East
- Failure family: Retry Storms
- Primary service: checkout-api
- Primary technology: Kafka
- Ground truth pattern: cascading latency

## Summary

A production incident affected the `checkout-api` flow and caused delayed payment status updates. The immediate technical trigger was **synchronized retry bursts**, but the broader failure pattern was **cascading latency**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced delayed payment status updates in the US-East region. The incident lasted approximately 139 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- elevated p95 latency
- CPU saturation
- slow dependency calls
- manual mitigation required
- increased timeout rate
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by SLO burn-rate alert.
- 09:14 — On-call observed elevated p95 latency and CPU saturation in checkout-api.
- 09:27 — Triage linked the issue to Kafka behavior and suspected cascading latency.
- 09:48 — Mitigation started: enable circuit breaker and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 139 minutes total duration.

## Root Cause

The root cause was **synchronized retry bursts** affecting `checkout-api` through `Kafka`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- cascading latency
- insufficient load testing
- unclear ownership
- high-cardinality metrics

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `checkout-api`, `Kafka`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- restart affected pods
- reduce retry rate

## Preventive Actions

- document runbook
- add canary validation
- add load test scenario
- introduce jittered exponential backoff

## Lessons Learned

This incident shows that **cascading latency** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: cascading latency
- Useful query terms: checkout-api, Kafka, cascading latency, synchronized retry bursts
