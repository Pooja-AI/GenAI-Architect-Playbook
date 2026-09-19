# GenAI Security

## Overview
Generative AI systems introduce security considerations beyond traditional application security — new attack surfaces (prompt injection), new data handling risks (training data and RAG content), and the challenge of securing systems whose behavior is probabilistic and context-dependent rather than fully deterministic. This document provides an overview tying together the more detailed security topics covered elsewhere in this knowledge base.

## Threat Categories Specific to GenAI

### Prompt Injection
Malicious instructions embedded in user input or in external content the model processes (retrieved documents, tool results, web content) attempt to override the system's intended behavior — see prompt-injection.md and prompt-injection-defense.md.

### Data Leakage
Sensitive information (PII, proprietary data, credentials) inadvertently exposed through model outputs, logs, or overly broad retrieval — see data-leakage-prevention.md and pii-prevention.md.

### Unauthorized Access via Retrieval
RAG systems retrieving and surfacing content a user isn't authorized to see — see rag-security-trimming.md.

### Excessive Agency
Agentic systems taking unintended, unauthorized, or harmful actions due to insufficient scope restrictions — see agent-guardrails.md and secure-agent-tools.md.

### Model/Supply Chain Risk
Risks introduced by third-party models, fine-tuning data, or integrated tools/MCP servers of uncertain provenance — see mcp-security.md.

## Foundational Security Practices

### Least Privilege
Every component — IAM roles, tool permissions, agent action scope, MCP server access — should be scoped to the minimum access genuinely required, following standard least-privilege principle applied specifically to AI-driven action-taking (see agent-authorization.md and rbac-abac.md).

### Defense in Depth
No single control (a well-crafted system prompt, a single guardrail check) should be relied upon exclusively — layer multiple independent defenses (input validation, output filtering, action-level authorization checks, monitoring) so a failure in one layer doesn't result in a full compromise.

### Treat External Content as Untrusted
Any content the model processes that didn't originate from a trusted, verified source — user input, retrieved documents, tool/API responses, other agents' outputs — should be treated as potentially adversarial and handled with the same skepticism applied to untrusted input in traditional application security.

### Encryption and Access Control for Data at Rest and in Transit
Standard cloud security practices (KMS encryption, VPC isolation, IAM-scoped access) apply fully to the data infrastructure underlying GenAI systems — vector stores, conversation logs, embedding pipelines — and shouldn't be treated as exempt simply because the data feeds an AI system rather than a traditional application.

## Security Testing for GenAI Systems
Beyond traditional security testing (penetration testing, dependency scanning), GenAI systems benefit from red-teaming specifically targeting prompt injection, jailbreak attempts, and unintended agentic actions — proactively probing for these AI-specific failure modes before they're discovered by real adversaries.

## Incident Response Considerations
GenAI-specific incidents (a successful prompt injection leading to data exposure, an agent taking an unauthorized action) require response playbooks that account for the probabilistic, context-dependent nature of the failure — understanding *why* a specific input triggered problematic behavior often requires reviewing the full reasoning trace (see agent-tracing.md), not just a simple log of the final action taken.

## Summary
GenAI security extends traditional application security practices (least privilege, defense in depth, encryption) with new considerations specific to LLM-driven systems — prompt injection, data leakage through generation, retrieval-based unauthorized access, and excessive agentic action — requiring both new technical controls and adapted incident response practices.
