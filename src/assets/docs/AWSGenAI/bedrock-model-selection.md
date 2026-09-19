# Bedrock Model Selection

## Overview
Bedrock offers foundation models from multiple providers, each with different strengths in reasoning, speed, cost, context length, and modality support. Choosing the right model — and often multiple models for different tasks within one application — is a key architecture decision.

## Key Selection Dimensions

### Task Complexity
- Simple classification, extraction, or short-form generation tasks can often use smaller, faster, cheaper models
- Complex multi-step reasoning, nuanced writing, or agentic tool-use benefits from larger, more capable models

### Latency Requirements
Real-time, user-facing interactive applications (chat) need models with fast time-to-first-token and high throughput; batch/offline processing (e.g., nightly summarization jobs) can tolerate slower, potentially more capable models.

### Cost Sensitivity
Cost scales with both model size/capability and token volume. High-volume, low-complexity workloads should default to smaller models; reserve premium models for the subset of requests that actually need their capability (see model routing patterns in multi-agent and agentic docs).

### Context Window
Tasks involving long documents, large RAG contexts, or extended conversation history need models supporting sufficient context length without excessive truncation or summarization overhead.

### Modality
Some tasks require multimodal input (images, documents with embedded visuals) — not all models support this equally.

### Fine-tuning / Customization Needs
If you need to adapt model behavior with proprietary training data, verify which models on Bedrock support fine-tuning or continued pre-training.

## A Practical Evaluation Process
1. Define representative test cases covering your actual production task distribution
2. Run the same test set across 2–3 candidate models
3. Score outputs using both automated metrics (accuracy, groundedness) and human review for nuanced quality dimensions
4. Compare cost and latency at expected production volume, not just per-call cost
5. Pilot the top candidate with a subset of real traffic before full rollout

## Model Tiering Strategy
Many production systems use a tiered approach:
- **Tier 1 (fast/cheap)**: routing, classification, simple extraction, first-pass filtering
- **Tier 2 (balanced)**: general-purpose chat and RAG generation
- **Tier 3 (most capable)**: complex reasoning, agentic planning, high-stakes or ambiguous queries

A lightweight classifier or the tier-1 model itself can route each request to the appropriate tier.

## Avoiding Common Mistakes
- Defaulting to the largest/most expensive model for every task "to be safe" — this is often unnecessary and costly at scale
- Never re-evaluating model choice as new model versions are released (newer smaller models sometimes outperform older larger ones)
- Ignoring the interaction between model choice and prompt design — a well-engineered prompt can sometimes close much of the capability gap between models

## Staying Current
Foundation model landscape evolves quickly. Re-benchmark your task-specific evaluation suite whenever a new model becomes available on Bedrock, rather than assuming your original model choice remains optimal indefinitely.

## Summary
Model selection on Bedrock should be driven by empirical evaluation against your actual task distribution, weighing capability, latency, and cost together — and revisited periodically rather than treated as a one-time decision.
