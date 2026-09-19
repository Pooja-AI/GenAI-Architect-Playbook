# Model Versioning

## Overview
Model versioning tracks exactly which foundation model version (including provider-specific version identifiers) is used by an application at any point in time, and manages the transition process when moving to a new model version — whether an incremental update to the same model family or a switch to an entirely different model.

## Why Model Version Matters
Foundation model providers periodically release new model versions — sometimes with improved capabilities, sometimes with subtly different behavior even for ostensibly similar capability levels. An application's observed quality, safety behavior, and even prompt-following characteristics can shift meaningfully between model versions, making explicit version tracking and controlled transition essential for maintaining production reliability.

## Version Pinning vs. Automatic Updates
- **Pinned versions**: the application explicitly specifies an exact model version and only migrates when a deliberate decision is made to do so — provides stability and predictability, at the cost of not automatically benefiting from model improvements without manual action
- **Latest/floating versions**: the application automatically uses whatever the provider's current "latest" model is — can benefit from improvements automatically, but risks unexpected behavior shifts without warning, since a provider's "latest" version can change without the application team's explicit action or awareness

For production systems, explicit version pinning combined with a deliberate, tested migration process (rather than automatic floating updates) is generally the safer default, given the potential for meaningful behavior shifts described above.

## Model Migration Process
1. Identify the candidate new model version and understand what's changed (release notes, known behavior differences)
2. Run the full regression testing suite (see llm-regression-testing.md) comparing the new version against the current baseline using the golden dataset
3. Review any regressions or behavior shifts, and validate that overall quality meets or exceeds the current baseline before proceeding
4. Deploy the new version through a staged rollout (canary/gradual traffic shift, see genai-ci-cd.md) rather than an immediate full cutover
5. Monitor production metrics closely during and after the transition, with a rollback plan ready (see genai-rollback.md) if unexpected issues emerge

## Multi-Model Version Coexistence
During a migration period, it's often prudent to run both the old and new model versions in parallel (e.g., via a canary deployment or explicit A/B test) rather than an all-at-once switch, allowing direct comparison of real production behavior and metrics before fully committing to the new version.

## Tracking Version in Observability Data
Every logged request/trace should be tagged with the exact model version used, enabling post-hoc analysis to correlate any observed quality or behavior shifts with a specific model version transition — without this tagging, diagnosing whether an observed production issue coincides with a model version change becomes much harder.

## Deprecation Handling
Model providers eventually deprecate older model versions — maintain awareness of deprecation timelines for any pinned model version in production use, and treat planned migrations proactively (well before a forced deprecation deadline) rather than reactively, since a forced last-minute migration under deadline pressure reduces the opportunity for careful, staged testing and rollout.

## Summary
Model versioning requires explicit version pinning (rather than automatic floating updates) combined with a deliberate, tested migration process — regression testing, staged rollout, and close production monitoring — whenever transitioning between model versions, with comprehensive version tagging in observability data to support post-hoc analysis of any behavior shifts.
