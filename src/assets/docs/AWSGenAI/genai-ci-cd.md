# GenAI CI/CD

## Overview
CI/CD for generative AI applications extends traditional continuous integration/continuous deployment practices to cover prompt changes, model version updates, retrieval configuration changes, and guardrail policy updates — not just application code — recognizing that these non-code artifacts have equally significant, direct production behavior impact.

## What Triggers a GenAI CI/CD Pipeline
- Application code changes (traditional trigger)
- Prompt or system instruction changes (see prompt-versioning.md)
- Model version updates (see model-versioning.md)
- Retrieval configuration changes (chunking strategy, reranking parameters, knowledge base updates)
- Guardrail policy changes (see bedrock-guardrails.md)
- Tool/function definition changes (see structured-tool-inputs.md)

## Pipeline Stages

### Automated Evaluation (Regression Testing)
Every proposed change runs against the golden dataset (see golden-dataset.md and llm-regression-testing.md), with results compared against the current production baseline — a required gate before any change can proceed to deployment.

### Safety and Guardrail Validation
Run a dedicated test suite covering known prompt injection patterns, content policy edge cases, and guardrail bypass attempts against the proposed change, ensuring safety posture isn't inadvertently regressed alongside general quality validation.

### Staged Deployment
Rather than an immediate full-traffic cutover, deploy changes progressively:
- **Canary deployment**: route a small percentage of production traffic to the new version, closely monitoring quality and operational metrics before expanding
- **Blue/green deployment**: run the new version fully in parallel with the current production version, with the ability to instantly switch traffic (and instantly switch back) between them

### Production Monitoring During Rollout
Actively monitor the metrics described in genai-observability.md and production-monitoring.md during a staged rollout, with automated or manual gates that pause/halt the rollout if quality, safety, or operational metrics degrade beyond acceptable thresholds.

### Automated Rollback Triggers
Where feasible, configure automated rollback based on defined metric thresholds (e.g., error rate or hallucination rate exceeding a threshold during a canary phase automatically reverts traffic to the prior version) rather than relying solely on manual intervention, which introduces response-time risk during an active production issue (see genai-rollback.md).

## Environment Strategy
Maintain distinct environments (development, staging, production) for GenAI applications just as for traditional software, with staging environments used to validate prompt/configuration changes against realistic (but non-production) data and traffic patterns before any production exposure.

## Governance Integration
For higher-risk applications, integrate the enterprise AI governance review processes described in enterprise-ai-governance.md directly into the CI/CD pipeline — e.g., requiring explicit sign-off from a compliance or domain-expert reviewer for changes affecting particularly sensitive use cases, rather than treating governance review as a separate, disconnected process from the technical deployment pipeline.

## Common Pitfalls
- Treating prompt changes as "just text edits" not warranting the same rigor as code changes, leading to under-tested changes reaching production
- No staged rollout mechanism, forcing an all-or-nothing deployment that maximizes blast radius if something goes wrong
- Missing automated safety/guardrail regression testing, focusing evaluation exclusively on general quality metrics

## Summary
GenAI CI/CD extends traditional deployment pipeline discipline to cover prompts, model versions, retrieval configurations, and guardrail policies — with automated regression and safety evaluation as required gates, staged rollout with close production monitoring, and rollback mechanisms designed for rapid reversal given the potential for subtle, hard-to-predict-in-advance behavior shifts from any of these change types.
