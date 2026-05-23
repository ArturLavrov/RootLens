# INC-0005: risk-service elevated checkout latency due to expired dns cache entry

## Metadata

- Date: 2025-01-21
- Severity: SEV1
- Region: US
- Failure family: DNS Failures
- Primary service: risk-service
- Primary technology: Consul DNS
- Ground truth pattern: partial regional degradation

## Summary

A production incident affected the `risk-service` flow and caused elevated checkout latency. The immediate technical trigger was **expired DNS cache entry**, but the broader failure pattern was **partial regional degradation**. The incident is intentionally synthetic and designed for RootLens MVP validation, especially similarity search, RCA assistance, and recurring pattern detection.

## Customer Impact

Customers experienced elevated checkout latency in the US region. The incident lasted approximately 165 minutes. Impact was intermittent rather than universal, which made early triage harder.

## Symptoms

- NXDOMAIN spikes
- DNS lookup latency
- slow dependency calls
- pod restarts
- partial customer impact
- queue growth

## Timeline

- 09:05 — Initial symptoms detected by support ticket spike.
- 09:14 — On-call observed NXDOMAIN spikes and DNS lookup latency in risk-service.
- 09:27 — Triage linked the issue to Consul DNS behavior and suspected partial regional degradation.
- 09:48 — Mitigation started: reduce retry rate and rollback recent change.
- 10:12 — Customer impact began to decrease.
- 10:36 — Incident resolved after 165 minutes total duration.

## Root Cause

The root cause was **expired DNS cache entry** affecting `risk-service` through `Consul DNS`. The issue created a failure mode where the system behaved correctly under normal load but degraded sharply when combined with production traffic and dependent service instability.

## Contributing Factors

- partial regional degradation
- weak alerting
- insufficient load testing
- limited runbook coverage

## Detection Gaps

- Existing dashboards emphasized averages and did not clearly show the customer-impacting tail latency.
- Alerts detected the incident after symptoms had already propagated.
- Correlation between `risk-service`, `Consul DNS`, and downstream impact was not immediately visible.

## Resolution

- reduce retry rate
- rollback recent change
- manually replay failed messages

## Preventive Actions

- introduce jittered exponential backoff
- add cache invalidation test
- enforce config validation
- add dependency saturation dashboard

## Lessons Learned

This incident shows that **partial regional degradation** can appear through different technologies and symptoms. Future investigations should compare this incident not only with other `DNS Failures` cases, but also with incidents involving retries, dependency saturation, weak observability, and delayed mitigation.

## Evaluation Notes for RootLens

- Expected similar family: DNS Failures
- Expected causal pattern: partial regional degradation
- Useful query terms: risk-service, Consul DNS, partial regional degradation, expired DNS cache entry
