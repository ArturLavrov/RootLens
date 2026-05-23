# INC-0018: gateway-adapter inconsistent payment method availability due to duplicate retry layer in gateway and service

## Metadata

- Date: 2025-02-28
- Severity: SEV2
- Region: EU
- Failure family: Retry Storms
- Primary service: gateway-adapter
- Primary technology: RabbitMQ
- Ground truth pattern: partial degradation amplified by retries

## Summary

A production incident affected the `gateway-adapter` flow and caused inconsistent payment method availability. The immediate technical trigger was **duplicate retry layer in gateway and service**, but the broader failure pattern was **partial degradation amplified by retries**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced inconsistent payment method availability in the EU region. The incident lasted approximately 142 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- burst traffic to downstream dependency
- CPU saturation
- partial customer impact
- intermittent 5xx errors
- queue growth
- inconsistent state observed by customers

## Timeline

- 09:05 — Initial symptoms detected by synthetic check.
- 09:14 — On-call observed burst traffic to downstream dependency and CPU saturation in gateway-adapter.
- 09:27 — Triage linked the issue to RabbitMQ behavior and suspected partial degradation amplified by retries.
- 09:48 — Mitigation started: restart affected pods and clear stale cache entries.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 142 minutes total duration.

## Root Cause

The root cause was **duplicate retry layer in gateway and service** affecting `gateway-adapter` through `RabbitMQ`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial degradation amplified by retries
- insufficient backpressure
- unclear ownership
- manual rollback process

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `gateway-adapter`, `RabbitMQ`, and downstream impact was not immediately visible.

## Resolution

- restart affected pods
- clear stale cache entries
- reduce retry rate

## Preventive Actions

- add load test scenario
- add canary validation
- add bulkhead isolation
- enforce config validation

## Lessons Learned

This incident shows that **partial degradation amplified by retries** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `Retry Storms` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: Retry Storms
- Expected causal pattern: partial degradation amplified by retries
- Useful query terms: gateway-adapter, RabbitMQ, partial degradation amplified by retries, duplicate retry layer in gateway and service
