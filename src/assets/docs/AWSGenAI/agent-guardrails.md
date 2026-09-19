# Agent Guardrails

## Overview
Agent guardrails are the constraints and safety mechanisms placed around an autonomous agent to prevent it from taking harmful, unintended, excessively costly, or out-of-scope actions. Because agents act with more autonomy than single-turn LLM calls, they require a broader set of guardrails than content filtering alone.

## Categories of Agent Guardrails

### Action Scope Restrictions
Explicitly limit which tools/actions an agent is permitted to invoke for a given task or user context — an agent handling customer inquiries shouldn't have access to a tool that modifies billing records unless that's specifically in scope, even if such a tool exists in the broader system.

### Approval Gates for High-Stakes Actions
Require human approval (see human-in-the-loop.md) before executing irreversible or high-impact actions — sending an external email, processing a refund above a threshold, deleting data — while allowing lower-risk actions (read-only lookups) to proceed autonomously.

### Rate and Cost Limits
Cap the number of tool calls, LLM invocations, or total token/cost spend per task or per time window to prevent runaway loops or unexpectedly expensive execution (see preventing-agent-loops.md).

### Content Guardrails (Bedrock Guardrails)
Apply the same content safety, PII, and topic-scope filtering used for single-turn generation to every agent turn — an agent's intermediate reasoning and tool arguments should also be subject to these checks, not just its final user-facing response.

### Input Validation and Sanitization
Validate all external data the agent ingests (search results, retrieved documents, API responses) before it's incorporated into the agent's reasoning context, to reduce prompt injection risk (see prompt-injection-defense.md and secure-agent-tools.md).

### Output Verification
Before an agent's action or final answer is delivered/executed, verify it against expected constraints — e.g., a generated SQL query is checked against an allowlist of permitted tables/operations before execution, rather than executed blindly.

## Designing a Guardrail Policy
1. Enumerate every action the agent can take and classify each by risk level (read-only, reversible write, irreversible/high-impact)
2. Define approval requirements per risk level (autonomous, logged-but-autonomous, human-approval-required)
3. Set hard limits on iteration count, cost, and time per task
4. Define explicit "stop and escalate" conditions (e.g., repeated tool failures, detected policy violations, out-of-scope requests)

## Guardrails vs. Prompting Alone
As with single-turn generation, relying only on system-prompt instructions to constrain agent behavior is fragile. Enforce hard technical constraints (tool access permissions via IAM/API-level restrictions, programmatic approval gates, hard iteration caps) that don't depend on the model correctly following instructions — this is defense-in-depth, not a replacement for good prompting.

## Monitoring and Auditing
Log every action an agent takes, the reasoning that led to it, and whether it passed or triggered a guardrail — this audit trail is essential both for debugging and for compliance in regulated environments where autonomous decision-making must be explainable and reviewable after the fact.

## Summary
Agent guardrails combine action-scope restrictions, approval gates, rate/cost limits, and content safety checks to keep autonomous systems safe, predictable, and auditable. Because agents can compound small errors into significant unintended actions across multiple steps, guardrails must be enforced at the infrastructure/permission level, not just through prompt instructions.
