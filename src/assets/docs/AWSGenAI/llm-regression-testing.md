# LLM Regression Testing

## Overview
LLM regression testing validates that a proposed change — a new prompt version, a different model, an updated retrieval configuration, a modified guardrail policy — doesn't degrade quality on previously working cases, applying the golden dataset (see golden-dataset.md) as the basis for automated, repeatable comparison before deploying changes to production.

## Why This Differs from Traditional Software Regression Testing
Traditional regression testing typically relies on deterministic pass/fail assertions. LLM outputs are non-deterministic and often require graded, nuanced evaluation rather than exact-match comparison — so LLM regression testing typically combines automated scoring (LLM-as-judge, groundedness checks, task-specific metrics) with statistical comparison across a full test set, rather than expecting bit-for-bit identical output to a prior "expected" answer.

## Regression Testing Workflow
1. Run the current (baseline) system configuration against the full golden dataset, recording scores across relevant quality dimensions
2. Apply the proposed change (new prompt, model, retrieval config, etc.) in an isolated test environment
3. Run the modified configuration against the same golden dataset
4. Compare aggregate and per-example scores between baseline and modified versions
5. Flag any statistically or practically significant degradation, especially on previously high-scoring examples, for review before allowing deployment

## What to Compare
- **Aggregate metric shifts**: overall accuracy, groundedness, or task-completion rate across the full dataset
- **Per-example regressions**: individual examples that scored well under the baseline but poorly under the modified version — often more actionable than aggregate shifts alone, since they pinpoint specific failure patterns introduced by the change
- **New failure categories**: whether the modified version introduces entirely new types of errors not present in the baseline, even if aggregate scores look similar
- **Latency and cost impact**: changes that improve quality but significantly increase latency or cost may still require a deliberate trade-off decision rather than being treated as an unambiguous improvement

## Automating Regression Testing in CI/CD
Integrate golden dataset evaluation into the deployment pipeline (see genai-ci-cd.md) so that prompt, model, or configuration changes automatically trigger a regression run, with results gating deployment (or at minimum, requiring explicit human review and sign-off) before changes reach production — treating prompt and configuration changes with the same rigor as code changes, since they have equally direct production behavior impact.

## Handling Acceptable Trade-offs
Not every regression is a reason to block a change — sometimes a new model or prompt improves overall quality while slightly regressing a small number of edge cases, and the net trade-off is worth accepting. The key is that this should be a *deliberate, visible decision* made by reviewing the regression report, not an unnoticed side effect of a change deployed without adequate testing.

## Statistical Considerations
Given the non-determinism of LLM outputs, run each configuration multiple times (or use a sufficiently large and diverse test set) to distinguish genuine quality shifts from noise inherent to sampling variability — a single-run comparison on a small dataset can produce misleading conclusions about whether a change actually helped or hurt.

## Maintaining Test Coverage Over Time
As new failure modes are discovered in production (see production-monitoring.md), add corresponding regression test cases to the golden dataset so future changes are automatically checked against previously identified issues — ensuring the regression suite's coverage compounds over time rather than remaining static.

## Summary
LLM regression testing applies the golden dataset systematically to compare a proposed change against the current baseline across relevant quality dimensions — combining aggregate metrics with per-example regression detection — and should be automated within CI/CD to ensure prompt, model, and configuration changes receive the same rigor as code changes before reaching production.
