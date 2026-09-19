# Groundedness Evaluation

## Overview
Groundedness (also called faithfulness) evaluation measures the degree to which a generated response's claims are actually supported by the provided source context, rather than introduced from the model's own parametric knowledge or fabricated outright. It's the primary quality metric for RAG systems, closely related to but distinct from hallucination evaluation's broader scope.

## Groundedness vs. Correctness
An important distinction: a response can be *grounded* (fully supported by the provided context) but still *incorrect* if the context itself contains wrong information, and a response can be *ungrounded* but happen to be factually *correct* if the model drew on accurate outside knowledge not present in the given context. For most RAG applications, groundedness is the more directly actionable metric to optimize, since it measures whether the system is behaving as designed (answering from the provided knowledge base) — correctness of the knowledge base itself is a separate, upstream data-quality concern.

## Measurement Approaches

### Claim-Level Entailment Checking
Decompose the generated response into individual factual claims, and for each claim, assess whether it's entailed by (logically supported by), contradicted by, or unrelated to the retrieved context — providing granular, claim-by-claim groundedness scoring rather than a single holistic judgment.

### LLM-as-Judge Groundedness Scoring
Prompt a strong LLM with the retrieved context and the generated response, asking it to assess (often on a numeric or categorical scale) how well the response's claims are supported by the given context — the most common practical approach given its scalability, validated periodically against human judgment.

### Natural Language Inference (NLI) Models
Purpose-built NLI models (trained specifically to classify entailment/contradiction/neutral relationships between a premise and hypothesis) can be applied at the claim level as a lighter-weight, more specialized alternative to full LLM-as-judge scoring for this specific sub-task.

### Bedrock Guardrails Contextual Grounding Checks
For Bedrock-based RAG applications, Guardrails' built-in contextual grounding check (see bedrock-guardrails.md) provides an integrated, real-time groundedness check as part of the standard invocation flow, useful both for evaluation and as a live production safeguard.

## Interpreting Groundedness Scores
A low groundedness score doesn't automatically mean the response is unhelpful or wrong — it flags that the response's claims aren't traceable to the provided context, which may indicate:
- The model drew on its own parametric knowledge appropriately (e.g., correctly interpreting the meaning of a term not explicitly defined in the context) — sometimes acceptable, sometimes not depending on the application's requirements
- The model hallucinated content not actually supported anywhere (the concerning case)
- The retrieved context was insufficient, and the model should have declined to answer rather than extrapolating

Distinguishing between these requires reviewing flagged low-groundedness cases rather than treating the raw score as a fully automated verdict.

## Using Groundedness in Production
Beyond offline evaluation, groundedness scoring can run as a real-time or near-real-time check on live production responses, enabling automated interventions (flagging for human review, triggering a fallback "I don't have enough information" response) when a response's groundedness falls below an acceptable threshold — directly implementing part of the hallucination prevention strategy described in preventing-rag-hallucination.md.

## Summary
Groundedness evaluation measures whether a RAG system's generated claims are actually traceable to the retrieved context — a distinct, more directly actionable metric than general correctness — implemented via claim-level entailment checking, LLM-as-judge scoring, or NLI models, and usable both as an offline evaluation metric and a live production safeguard.
