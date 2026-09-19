# Production Issue Resolution for GenAI Systems

## Overview
When a generative AI system exhibits a production issue — degraded quality, an unexpected agent action, a cost spike, or a security concern — resolving it effectively requires a structured approach that accounts for the specific debugging challenges of probabilistic, multi-component GenAI systems, distinct from traditional deterministic software incident response.

## Initial Triage

### Categorize the Issue Type
Quickly determine which broad category the issue falls into, since this shapes the appropriate investigation path:
- **Quality issue** (incorrect, ungrounded, or unhelpful responses) — see hallucination-evaluation.md and groundedness-evaluation.md for relevant diagnostic approaches
- **Safety/security issue** (guardrail bypass, potential prompt injection, unauthorized action) — see the Governance & Security section
- **Operational issue** (latency, errors, availability) — standard operational incident response practices, informed by genai-observability.md
- **Cost issue** (unexpected spend spike) — see llm-cost-monitoring.md and token-usage-monitoring.md

### Assess Severity and Scope
Determine how many users/requests are affected, whether the issue is ongoing or was a one-time occurrence, and whether immediate mitigating action (e.g., a rollback, see genai-rollback.md) is warranted before full root-cause investigation is complete.

## Investigation Approach

### Start with the Trace
For any issue involving a specific problematic interaction, start with the full request trace (see agent-tracing.md) — the constructed prompt, retrieved context, model output, and any tool calls/agent reasoning steps — rather than working from only the final user-visible symptom, since the trace usually contains the direct evidence needed to distinguish between the many possible root causes (retrieval issue, prompt issue, model behavior, tool error, guardrail misconfiguration).

### Reproduce if Possible
Attempt to reproduce the issue with the same or similar input, understanding that non-determinism (see non-deterministic-testing.md) means an exact single-run reproduction isn't always possible — running multiple attempts and looking at the pattern/rate of the issue occurring is often more informative than expecting perfect reproducibility.

### Check for Recent Changes
Correlate the issue's onset with recent deployments — a prompt change, model version update, retrieval configuration change, or guardrail policy update (see prompt-versioning.md and model-versioning.md) — since a recent change is a common and relatively easy-to-verify root cause hypothesis to check first, before pursuing more complex investigation paths.

### Distinguish Isolated vs. Systemic Issues
Determine whether the issue is isolated to a specific query pattern or input type, or represents a broader systemic quality/behavior shift — this distinction shapes both the urgency of response and the appropriate fix (a targeted fix for a specific edge case vs. a broader configuration or model rollback for a systemic regression).

## Resolution and Mitigation

### Immediate Mitigation
For urgent issues, apply the fastest available mitigation — rollback to a prior known-good configuration (see genai-rollback.md), a temporary guardrail tightening, or disabling a specific problematic capability — before pursuing a more thorough, potentially slower root-cause fix.

### Root Cause Fix
Once mitigated, pursue the underlying root cause fix — this might involve prompt refinement, retrieval configuration adjustment, an updated guardrail policy, or (for a tool/agent issue) a fix to tool implementation or agent guardrails.

### Validate the Fix
Before considering the issue resolved, validate the fix using the regression testing process (see llm-regression-testing.md) against both the specific failing case and the broader golden dataset, ensuring the fix doesn't introduce new regressions elsewhere.

## Post-Incident Practices

### Add to the Golden Dataset
Add the specific failing case (and ideally related variations) to the golden dataset (see golden-dataset.md) as a permanent regression test, ensuring future changes are automatically checked against this now-known failure mode.

### Conduct a Blameless Postmortem
For significant incidents, conduct a structured postmortem focused on systemic learning (what allowed this issue to occur, what would have caught it earlier, what process or tooling improvements would help) rather than individual blame — feeding findings back into team practice improvements (see engineering-mentorship.md's team-wide learning practices).

### Communicate Appropriately
Depending on the issue's severity and user impact, communicate appropriately with affected stakeholders and, where relevant, end users — following the honest, transparent communication practices described in stakeholder-communication.md.

## Summary
Resolving GenAI production issues effectively requires initial triage into the appropriate issue category, trace-based investigation as the primary diagnostic tool, correlation with recent changes as an efficient first hypothesis, immediate mitigation (often via rollback) before thorough root-causing, and post-incident practices — golden dataset expansion and blameless postmortems — that convert each incident into durable, systemic improvement rather than a one-off fix.
