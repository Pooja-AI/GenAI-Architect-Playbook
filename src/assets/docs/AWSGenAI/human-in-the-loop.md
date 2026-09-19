# Human-in-the-Loop (HITL)

## Overview
Human-in-the-loop design inserts explicit human review or approval checkpoints into an otherwise autonomous AI workflow, for actions where full autonomy carries too much risk, ambiguity, or regulatory requirement. HITL is one of the most effective and widely applicable guardrails for agentic systems.

## When to Require Human Review
- **Irreversible actions**: deleting data, sending external communications, executing financial transactions
- **High financial or legal impact**: refunds above a threshold, contract approvals, compliance-sensitive decisions
- **Low model confidence**: the agent itself signals uncertainty, or a confidence/groundedness score falls below a threshold
- **Novel or out-of-distribution situations**: requests that don't match well-tested patterns in the agent's training or evaluation data
- **Regulatory requirement**: certain industries mandate human sign-off for specific decision categories regardless of AI confidence (e.g., certain lending or medical decisions)

## HITL Patterns

### Pre-Action Approval
The agent proposes an action and pauses execution until a human approves, rejects, or modifies it before it's carried out — appropriate for high-stakes, low-frequency actions where latency is acceptable.

### Post-Action Review (Audit Sampling)
The agent acts autonomously but a sample (or all) of its actions are logged for asynchronous human review, with a process to catch and remediate errors after the fact — appropriate for lower-risk, high-frequency actions where blocking on human approval would be impractical.

### Confidence-Based Routing
The agent handles high-confidence cases autonomously and routes low-confidence cases to a human queue — balances efficiency with safety by concentrating human attention where it adds the most value.

### Collaborative/Co-Pilot Mode
The agent drafts a proposed output (an email, a document, a plan) but a human always makes the final edit and send decision — common in content generation and communication-drafting use cases.

## Designing the Human Review Interface
Effective HITL requires giving reviewers sufficient context to make a fast, accurate decision — not just the proposed action in isolation but the reasoning trace, relevant retrieved context, and any confidence signals, presented in a scannable format. Poor review UX leads to reviewers rubber-stamping without genuine scrutiny, undermining the safety benefit.

## Balancing Autonomy and Oversight
Too much HITL friction defeats the purpose of automation (if every action needs approval, you haven't actually built an agent, you've built a suggestion engine); too little leaves genuine risk unmitigated. Calibrate HITL checkpoints based on empirically observed error rates and impact severity per action category, and revisit this calibration as the system's track record accumulates evidence of reliability.

## Feedback Loops
Human review decisions (approve/reject/modify) are valuable training and evaluation signal — feed them back into the golden dataset and evaluation pipeline to continuously improve the agent's autonomous accuracy over time, potentially allowing HITL requirements to be relaxed for action categories that demonstrate sustained high accuracy.

## Operational Considerations
- Define clear SLAs for human review turnaround so pending approvals don't create unacceptable delays
- Build escalation paths for when reviewers are unavailable or a decision is contested
- Track reviewer workload to avoid alert fatigue, which degrades review quality over time

## Summary
Human-in-the-loop is not a sign of an incomplete agentic system — it's a deliberate design choice for managing risk in proportion to action impact and model confidence, and a critical guardrail category alongside the technical constraints described in agent-guardrails.md.
