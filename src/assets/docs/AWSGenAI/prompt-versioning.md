# Prompt Versioning

## Overview
Prompt versioning treats prompts — system instructions, few-shot examples, prompt templates — as first-class, version-controlled artifacts subject to the same change management discipline as application code, rather than as informal, untracked text that gets edited ad hoc in production.

## Why Prompt Versioning Matters
Prompts are a primary determinant of an LLM application's behavior — a seemingly small prompt wording change can significantly shift output quality, safety, or format compliance. Without versioning:
- It's impossible to know exactly what prompt produced a given historical output, hampering debugging and evaluation
- Rolling back a problematic prompt change requires reconstructing what the prior version was, rather than a simple, reliable revert
- A/B testing different prompt variants becomes difficult to manage and track consistently

## What to Version
- **System prompts/instructions**: the core behavioral instructions given to the model
- **Prompt templates**: parameterized structures combining system instructions, retrieved context, and user input into the final prompt sent to the model
- **Few-shot examples**: example input/output pairs included in prompts to guide model behavior
- **Tool/function definitions**: the schemas and descriptions provided to enable function calling (see structured-tool-inputs.md), since these are as behaviorally significant as the prompt text itself

## Versioning Approaches

### Git-Based Versioning
Store prompts as text/YAML/JSON files in the same version control system as application code, benefiting from familiar diffing, history, and branching workflows — appropriate for teams where prompt changes are primarily made by engineers comfortable with git-based workflows.

### Dedicated Prompt Management Systems
Specialized tools (whether custom-built or third-party) provide a more accessible interface for non-engineering stakeholders (product managers, domain experts) to propose and review prompt changes, while still maintaining version history, diffing, and rollback capability — often paired with built-in A/B testing and evaluation integration.

### Bedrock Prompt Management
Amazon Bedrock provides native prompt management capabilities for storing, versioning, and deploying prompt templates directly within the AWS ecosystem, integrating with IAM for access control and supporting variant testing.

## Linking Prompt Versions to Evaluation and Deployment
Every prompt version should be traceable to:
- The evaluation results (see llm-regression-testing.md) that validated it before deployment
- The specific deployment/rollout it was part of (see genai-ci-cd.md)
- Production performance data attributable specifically to that version, enabling meaningful before/after comparison when a version change is suspected of causing a quality shift

## Rollback Capability
A core benefit of prompt versioning is the ability to quickly and reliably roll back to a known-good prior version if a new prompt version causes unexpected production issues — this requires not just storing prior versions but having a fast, low-friction deployment mechanism to actually revert (see genai-rollback.md).

## Governance and Review
For higher-risk applications, apply a review/approval process to prompt changes analogous to code review — particularly important given that prompt changes can have significant behavioral and safety implications despite often being much shorter and seemingly "simpler" than typical code changes, which can lead teams to underestimate the review rigor they warrant.

## Summary
Prompt versioning brings software engineering change-management discipline — history tracking, diffing, rollback, and review — to prompts, system instructions, and tool definitions, recognizing these as behaviorally significant artifacts deserving the same rigor as application code, not informal text edited without a trace.
