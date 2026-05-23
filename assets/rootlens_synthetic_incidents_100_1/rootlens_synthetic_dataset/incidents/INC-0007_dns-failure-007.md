# INC-0007: wallet-service increased error rate due to split-horizon dns mismatch

## Metadata

- Date: 2025-01-27
- Severity: SEV3
- Region: EU-West
- Failure family: DNS Failures
- Primary service: wallet-service
- Primary technology: CoreDNS
- Ground truth pattern: retry amplification

## Summary

A production incident affected the `wallet-service` flow and caused increased error rate. The immediate technical trigger was **split-horizon DNS mismatch**, but the broader failure pattern was **retry amplification**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced increased error rate in the EU-West region. The incident lasted approximately 72 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- partial customer impact
- connection pool pressure
- manual mitigation required
- DNS lookup latency
- elevated p95 latency
- slow dependency calls

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed partial customer impact and connection pool pressure in wallet-service.
- 09:27 — Triage linked the issue to CoreDNS behavior and suspected retry amplification.
- 09:48 — Mitigation started: reduce retry rate and restart affected pods.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 72 minutes total duration.

## Root Cause

The root cause was **split-horizon DNS mismatch** affecting `wallet-service` through `CoreDNS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- retry amplification
- lack of bulkhead isolation
- limited runbook coverage
- insufficient backpressure

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `wallet-service`, `CoreDNS`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- restart affected pods
- clear stale cache entries

## Preventive Actions

- document runbook
- add SLO alerting
- add cache invalidation test
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **retry amplification** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: retry amplification
- Useful query terms: wallet-service, CoreDNS, retry amplification, split-horizon DNS mismatch
