# INC-0077: gateway-adapter inconsistent payment method availability due to slow identity provider token introspection

## Metadata

- Date: 2025-08-25
- Severity: SEV1
- Region: EU-West
- Failure family: Dependency Timeouts
- Primary service: gateway-adapter
- Primary technology: third-party provider API
- Ground truth pattern: retry amplification

## Summary

A production incident affected the `gateway-adapter` flow and caused inconsistent payment method availability. The immediate technical trigger was **slow identity provider token introspection**, but the broader failure pattern was **retry amplification**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU-West region. The incident lasted approximately 68 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- inconsistent state observed by customers
- increased timeout rate
- provider timeout increase
- partial customer impact
- thread pool starvation
- intermittent 5xx errors

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed inconsistent state observed by customers and increased timeout rate in gateway-adapter.
- 09:27 — Triage linked the issue to third-party provider API behavior and suspected retry amplification.
- 09:48 — Mitigation started: enable circuit breaker and route traffic away from degraded dependency.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 68 minutes total duration.

## Root Cause

The root cause was **slow identity provider token introspection** affecting `gateway-adapter` through `third-party provider API`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- retry amplification
- high-cardinality metrics
- limited runbook coverage
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `gateway-adapter`, `third-party provider API`, and downstream impact was not immediately visible.

## Resolution

- enable circuit breaker
- route traffic away from degraded dependency
- restart affected pods

## Preventive Actions

- add synthetic transaction check
- add SLO alerting
- add canary validation
- enforce config validation

## Lessons Learned

This incident shows that **retry amplification** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Dependency Timeouts` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Dependency Timeouts
- Expected causal pattern: retry amplification
- Useful query terms: gateway-adapter, third-party provider API, retry amplification, slow identity provider token introspection
