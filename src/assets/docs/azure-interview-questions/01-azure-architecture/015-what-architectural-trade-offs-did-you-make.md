# What architectural trade-offs did you make?

## Short answer
Every choice traded something; name the trade-off, not just the technology.

## Key points
- Multi-agent (Coordinator / Delegator / Worker) gives modularity and governance but adds latency, cost and complexity.
- Async execution gives resilience but adds state management and eventual consistency.
- Managed PaaS reduces operations but limits low-level control versus AKS.
- Hybrid search plus semantic ranking improves relevance but costs more and adds latency.
- Strict ACL filtering and guardrails add latency but are non-negotiable for security.

## CWD context
Interviewers reward "we chose X, accepted Y, and mitigated it with Z".
