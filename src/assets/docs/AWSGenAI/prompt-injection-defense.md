# Prompt Injection Defense

## Overview
Because prompt injection can't be fully eliminated through any single technique, defending against it requires a layered, defense-in-depth strategy spanning input handling, prompt design, output validation, and architectural constraints on what an LLM-driven system can actually do even if manipulated.

## Defense Layers

### Clear Instruction Hierarchy and Framing
Structure prompts to clearly delineate system instructions from user input and external content (e.g., using explicit delimiters or structured formatting), and explicitly instruct the model to treat content within designated "data" sections as content to reason about, not as instructions to follow — this reduces but does not eliminate susceptibility to injection.

### Guardrails as an Independent Layer
Apply content and behavior guardrails (see bedrock-guardrails.md) that don't rely on the model correctly following instructions — an independent classifier or rule-based check that catches prohibited output regardless of whether the underlying model was successfully manipulated into attempting to produce it.

### Least-Privilege Architecture
Design the system so that even a fully successful prompt injection has limited blast radius — an agent with narrowly scoped tool permissions (see agent-guardrails.md and secure-agent-tools.md) can't be manipulated into taking actions outside that scope, regardless of what instructions are injected into its context.

### Human-in-the-Loop for High-Stakes Actions
Require human approval for actions with significant impact (see human-in-the-loop.md) — this provides a check that operates independently of the model's susceptibility to injection, since a human reviewer evaluating a proposed action can catch an inappropriate action even if the model's reasoning was manipulated.

### Input Sanitization and Anomaly Detection
Scan incoming content (user input, retrieved documents, tool outputs) for known injection patterns or anomalies (unusual formatting, hidden text, suspicious instruction-like phrasing embedded in what should be plain content) before it reaches the model's context — not a complete solution given the flexibility of natural language, but a useful additional detection layer.

### Output Validation Against Expected Behavior
Validate the model's output/actions against expectations for the specific task context — e.g., if a summarization task's output suddenly contains an unrelated action request or unusual content, flag it as a potential indicator of successful injection rather than passing it through unexamined.

### Segregating Trust Levels for Different Content Sources
Where architecturally feasible, process untrusted external content (e.g., web-fetched pages, third-party documents) with more restrictive model configurations or in a more isolated reasoning step than trusted, developer-provided instructions — reducing the chance that injected instructions in low-trust content directly influence high-trust decision-making.

## Testing for Prompt Injection Vulnerability
Proactively red-team your system with known and creative injection techniques — including indirect injection via documents/tool outputs an agent might process — before adversaries do, and treat any successful bypass as a finding requiring a fix across one or more of the defense layers above, not just a prompt tweak.

## Realistic Expectations
No combination of defenses provides an absolute guarantee against all possible prompt injection attempts, given the fundamental structural challenge described in prompt-injection.md. The goal of a layered defense is to substantially raise the difficulty and reduce the blast radius of successful attacks, combined with monitoring to detect and respond to attempts that do get through, rather than assuming complete prevention is achievable.

## Summary
Robust prompt injection defense combines instruction-hierarchy prompt design, independent guardrails, least-privilege architecture limiting the impact of a successful attack, human oversight for high-stakes actions, and proactive red-teaming — recognizing that no single technique is sufficient and that reducing blast radius through architectural constraints is as important as trying to prevent injection from succeeding in the first place.
