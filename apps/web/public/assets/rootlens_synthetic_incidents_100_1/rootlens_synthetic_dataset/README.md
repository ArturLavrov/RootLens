# RootLens Synthetic Incident Dataset

This dataset contains 100 synthetic postmortems grouped into 10 failure families.
It is designed for MVP testing in NotebookLM, especially:

- similar incident detection
- RCA assistance
- recurring pattern discovery
- operational intelligence reports
- evaluation of semantic similarity across different technologies

## Failure families

1. DNS Failures
2. Retry Storms
3. OOM / Memory Leaks
4. Cache Failures
5. Database Saturation
6. Queue / Messaging Failures
7. Deployment / Config Drift
8. Dependency Timeouts
9. Cascading Failures
10. Observability / Human Failures

## How to use in NotebookLM

Upload the Markdown files from the `incidents/` folder.
Then ask investigation-style questions, not just summaries.

## Suggested MVP test prompts

### Similar incident detection

Current incident symptoms:
- elevated API latency
- Redis timeouts
- retry spikes
- queue growth
- partial payment failures

Question:
Find similar incidents in the dataset. Group them by recurring causal pattern and explain the shared contributing factors.

### RCA assistant

Based only on these symptoms, what are the most likely contributing factors?
Mention similar historical incidents and previous mitigations.

### Pattern discovery

What are the most common recurring failure patterns across all incidents?
Which problems appear under different technologies but share the same causal structure?

### Reliability report

Generate a monthly reliability intelligence report from this dataset.
Include top recurring root causes, fragile services, detection gaps, and recommended engineering investments.

### Blind test

I have a new incident with only these symptoms:
- queue growth
- retry spike
- downstream latency
- partial checkout failures
- increased timeout rate

Which failure family is most likely and what should engineers investigate first?
