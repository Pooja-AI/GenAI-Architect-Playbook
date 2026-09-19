# GenAI Rollback

## Overview
Rollback is the ability to quickly and reliably revert a generative AI application to a previously known-good state — a prior prompt version, model version, retrieval configuration, or guardrail policy — when a newly deployed change causes unexpected quality, safety, or operational issues in production.

## Why Fast Rollback Matters More for GenAI
Because GenAI application behavior is harder to fully validate through pre-deployment testing alone (given the non-deterministic, open-ended nature of the outputs, see non-deterministic-testing.md), production issues that only manifest under real, diverse user traffic are relatively more likely than in some traditional software contexts — making fast, reliable rollback capability a particularly important safety net rather than a rarely-needed contingency.

## What Needs to Be Rollback-Capable
- **Prompts and system instructions**: reverting to a prior version stored via prompt versioning (see prompt-versioning.md)
- **Model version**: reverting to a prior pinned model version (see model-versioning.md) if a new model version introduces unexpected behavior
- **Retrieval configuration**: reverting chunking, reranking, or knowledge base changes if they degrade retrieval quality
- **Guardrail policies**: reverting a guardrail configuration change that either introduces excessive false-positive refusals or fails to catch content it should

## Rollback Mechanisms

### Feature Flags / Configuration Toggles
Decouple deployment (the new version being available) from release (the new version actually serving traffic) using feature flags, enabling an instant traffic-routing revert without needing to redeploy any infrastructure — the fastest possible rollback mechanism.

### Versioned Configuration Store
Store prompts, model version pins, and other configuration in a versioned store (see prompt-versioning.md) with the ability to instantly point the application at a prior version's configuration, rather than requiring a full code deployment cycle to revert a configuration-only change.

### Blue/Green Deployment Reversal
If using blue/green deployment (see genai-ci-cd.md), rollback is simply re-routing traffic back to the still-running prior version's environment, which remains available and warm rather than needing to be redeployed from scratch.

## Automated Rollback Triggers
For the fastest possible response to a degrading metric during a staged rollout, configure automated rollback triggers based on defined thresholds (error rate, latency, safety/guardrail intervention rate, or sampled quality score) — reducing dependence on a human noticing and manually acting on a production issue during the critical early window after a change is deployed.

## Rollback Runbooks
Maintain clear, tested runbooks documenting exactly how to execute a rollback for each type of change (prompt, model version, retrieval config, guardrail policy) — a rollback procedure that's never been tested or practiced is a risk in itself, since teams may discover gaps or unexpected friction only during an actual incident when time pressure is high.

## Post-Rollback Process
After a rollback, conduct a review to understand what caused the issue, why it wasn't caught during pre-deployment evaluation (feeding back into golden dataset expansion, see golden-dataset.md), and whether the rollback itself executed as smoothly as expected — treating each rollback event as a learning opportunity to improve both the specific application and the broader LLMOps process.

## Rollback Limitations
Some issues aren't fully reversible by rollback alone — e.g., if a problematic change already caused incorrect actions to be taken (an agent executed an unintended action) or incorrect information to be surfaced to users, rollback prevents *further* occurrences but doesn't undo effects that already happened, reinforcing the importance of the guardrails and human-in-the-loop safeguards described elsewhere in this knowledge base as complementary defenses, not substitutes for fast rollback capability.

## Summary
GenAI rollback capability — covering prompts, model versions, retrieval configurations, and guardrail policies — should be fast, reliable, and ideally automatable based on defined metric thresholds, given the relatively higher likelihood of production-only-visible issues in generative AI systems compared to more fully pre-testable traditional software.
