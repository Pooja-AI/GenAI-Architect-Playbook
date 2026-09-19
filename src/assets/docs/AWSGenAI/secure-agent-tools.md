# Secure Agent Tools

## Overview
Tools that an AI agent can invoke represent a direct bridge between model-driven reasoning (which is probabilistic and can be manipulated) and real-world effects (data access, external actions). Designing tools securely is essential to limiting the potential harm from model errors, hallucination, or successful prompt injection.

## Core Security Principles for Tool Design

### Least Privilege Per Tool
Each tool should expose the narrowest possible capability needed for its intended purpose — a tool for "look up order status" should not also permit modifying the order, even if the underlying API technically supports both, unless modification is a genuinely intended capability for that specific tool.

### Strict Input Validation
Validate every tool argument against its schema (see structured-tool-inputs.md) and apply additional semantic validation appropriate to the specific action — e.g., a "send email" tool should validate the recipient against an allowed domain list if the use case warrants that restriction, not merely check that the argument is a syntactically valid email address.

### Parameterization Over Free-Form Execution
Never design a tool that accepts raw, unconstrained code or query strings for execution (e.g., a tool that takes an arbitrary SQL string and executes it directly) — use parameterized, constrained interfaces (e.g., a tool exposing specific, safe query patterns with validated parameters) that structurally prevent injection-style attacks, mirroring parameterized query best practices from traditional application security.

### Output Sanitization
Sanitize and validate what a tool returns before it's incorporated into the agent's context, both to prevent malformed data from confusing the agent's reasoning and to reduce the risk of indirect prompt injection via tool output (see prompt-injection.md).

### Idempotency for Retryable Actions
Design action-taking tools to be idempotent where possible (e.g., using idempotency keys for a "create transaction" tool) so that retries — whether from network issues or agent reasoning errors — don't cause duplicate, unintended side effects.

## Risk-Tiering Tools
Classify tools by risk level and apply proportionate controls:
- **Read-only, low-sensitivity**: minimal additional controls beyond standard input validation
- **Read-only, high-sensitivity**: additional authorization checks (see agent-authorization.md) scoped to the specific data being accessed
- **Write/action-taking, reversible**: logging, rate limiting, and potentially confirmation steps
- **Write/action-taking, irreversible or high-impact**: mandatory human-in-the-loop approval (see human-in-the-loop.md) regardless of the agent's own confidence

## Tool Sandboxing
For tools involving code execution or interaction with potentially untrusted external systems, run them in appropriately sandboxed environments (isolated compute, restricted network access, resource limits) so that even a maximally adversarial tool invocation can't escalate beyond the sandbox's boundaries to affect other systems.

## Monitoring Tool Usage
Log every tool invocation — including arguments, results, and the reasoning context that led to the call — both for the observability benefits described in agent-tracing.md and specifically to detect anomalous usage patterns that might indicate a successful prompt injection or a misbehaving agent (e.g., an unusual spike in invocations of a sensitive tool, or arguments that don't match expected patterns for the current task type).

## Summary
Secure agent tool design applies least-privilege scoping, strict input validation with parameterized (never free-form) interfaces, output sanitization, and risk-proportionate controls (from basic logging to mandatory human approval) — recognizing that tools are the actual mechanism through which model-level errors or successful attacks translate into real-world impact, making tool-level security a critical complement to prompt-level and guardrail-level defenses.
