# INC-0071: payment-orchestrator inconsistent payment method availability due to third-party payment gateway latency

## Metadata

- Date: 2025-08-06
- Severity: SEV3
- Region: US
- Failure family: Dependency Timeouts
- Primary service: payment-orchestrator
- Primary technology: Envoy
- Ground truth pattern: retry amplification

## Summary

A production incident affected the `payment-orchestrator` flow and caused inconsistent payment method availability. The immediate technical trigger was **third-party payment gateway latency**, but the broader failure pattern was **retry amplification**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the US region. The incident lasted approximately 133 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- provider timeout increase
- thread pool starvation
- partial customer impact
- elevated p95 latency
- pod restarts
- manual mitigation required

## Timeline

- 09:05 — Initial symptoms detected by customer complaints.
- 09:14 — On-call observed provider timeout increase and thread pool starvation in payment-orchestrator.
- 09:27 — Triage linked the issue to Envoy behavior and suspected retry amplification.
- 09:48 — Mitigation started: scale consumers and increase connection pool limit.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 133 minutes total duration.

## Root Cause

The root cause was **third-party payment gateway latency** affecting `payment-orchestrator` through `Envoy`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- retry amplification
- manual rollback process
- insufficient load testing
- lack of bulkhead isolation

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `payment-orchestrator`, `Envoy`, and downstream impact was not immediately visible.

## Resolution

- scale consumers
- increase connection pool limit
- reduce retry rate

## Preventive Actions

- add canary validation
- document runbook
- add SLO alerting
- add cache invalidation test

## Lessons Learned

This incident shows that **retry amplification** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: retry amplification
- Useful query terms: payment-orchestrator, Envoy, retry amplification, third-party payment gateway latency
