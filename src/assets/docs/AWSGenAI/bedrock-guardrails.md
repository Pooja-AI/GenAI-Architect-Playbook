# Bedrock Guardrails

## Overview
Bedrock Guardrails is a managed capability for enforcing content safety, privacy, and topic-scope policies consistently across any foundation model invoked through Bedrock — independent of which underlying model is used. Guardrails act as a policy layer wrapped around model input and output.

## What Guardrails Can Enforce

### Content Filters
Block or flag categories such as hate speech, violence, sexual content, insults, and misconduct, with configurable sensitivity thresholds per category, applied to both user input (prompt) and model output.

### Denied Topics
Define topics the application should refuse to engage with (e.g., a customer service bot refusing to give investment advice or medical diagnoses), described in natural language rather than requiring exhaustive keyword lists.

### Word and Phrase Filters
Block specific profanity, competitor names, or custom-defined terms.

### Sensitive Information Filters (PII)
Detect and redact or block PII (names, emails, SSNs, financial account numbers) in both input and output — critical for regulated industries and general data hygiene.

### Contextual Grounding Checks
For RAG applications specifically, Guardrails can check whether the model's response is actually grounded in the retrieved reference content, helping catch hallucination before it reaches the user.

## Where Guardrails Apply
Guardrails can be applied to:
- The user's input prompt (before it reaches the model)
- The model's generated output (before it reaches the user)
- Both, independently configurable

## Implementation Pattern
1. Define a Guardrail configuration in the Bedrock console or via API (content filters, denied topics, PII rules, grounding thresholds)
2. Reference the Guardrail ID/version when invoking a model via the Converse API
3. Bedrock evaluates input/output against the guardrail and returns either the model's response or a configured refusal message if a violation is detected
4. Log guardrail intervention events for monitoring and policy tuning

## Guardrails vs. Prompt-Based Instructions
Relying solely on system prompt instructions ("don't discuss X") is fragile — models can be prompted around such instructions (see prompt-injection.md). Guardrails provide an independent enforcement layer that doesn't depend on the model correctly following instructions, offering defense-in-depth.

## Versioning and Testing
Guardrail configurations should be version-controlled and tested against a suite of known-good and known-bad inputs before deployment, similar to how you'd test application code — a too-strict guardrail causes false-positive refusals that frustrate legitimate users, while a too-loose one fails to catch real violations.

## Performance Considerations
Guardrail evaluation adds a small amount of latency to each request; for latency-sensitive applications, benchmark this overhead and factor it into your latency budget.

## Common Use Cases
- Preventing a customer-facing chatbot from giving legal, medical, or financial advice outside its intended scope
- Redacting PII from logs and generated summaries automatically
- Enforcing brand-safe content generation for marketing use cases
- Catching hallucinated claims in RAG systems via contextual grounding checks

## Summary
Bedrock Guardrails provide a model-agnostic, independently enforced policy layer for content safety, privacy, and scope control — an essential production safeguard that should be configured and tested before any generative AI application reaches real users, not treated as an optional add-on.
