# Preventing RAG Hallucination

## Overview
RAG reduces hallucination compared to ungrounded generation, but does not eliminate it. Models can still fabricate details, misattribute information, blend retrieved facts incorrectly, or answer confidently even when retrieval returned nothing relevant. Preventing hallucination in RAG requires interventions at the retrieval, prompting, and post-generation stages.

## Root Causes in RAG Specifically
- **No relevant context retrieved**, but the model answers anyway from parametric memory or invents an answer
- **Partially relevant context** leads the model to extrapolate beyond what's actually stated
- **Conflicting information** across multiple retrieved chunks, which the model resolves incorrectly or blends into a fabricated synthesis
- **Over-long context** causing the model to lose track of exactly which chunk supports which claim

## Prompting Techniques
- **Explicit grounding instructions**: instruct the model to answer *only* using the provided context and to explicitly state when the context doesn't contain the answer, rather than guessing
- **Citation requirements**: require the model to cite the specific source chunk for each claim — this both improves faithfulness (models trained/prompted to cite tend to hallucinate less) and gives users a way to verify
- **Chain-of-verification**: after generating an answer, prompt the model (or a second model call) to check each claim against the retrieved context and flag unsupported statements

## Retrieval-Side Mitigations
- **Relevance thresholding**: if the top retrieved chunk's similarity score is below a confidence threshold, respond with "I don't have enough information" rather than forcing an answer from weak context
- **Higher-precision retrieval**: reranking and hybrid search reduce the chance of irrelevant context being present in the first place
- **Conflict detection**: flag when retrieved chunks contain contradictory information (e.g., different policy versions) so the system can surface the ambiguity rather than silently picking one

## Post-Generation Verification
- **Groundedness scoring**: use a separate model call or classifier to score whether each sentence in the generated answer is entailed by the retrieved context (see groundedness-evaluation.md)
- **Guardrails**: apply automated checks (Bedrock Guardrails or custom classifiers) to catch ungrounded claims before returning the response to the user
- **Human-in-the-loop review**: for high-stakes domains (medical, legal, financial), route low-confidence or high-risk answers to human review before delivery

## Structural Approaches
- **Force citations inline**: e.g., "[Source: Policy Doc v3, Section 4.2]" — a model asked to produce a citation for every factual claim naturally becomes more conservative when it can't find a valid citation
- **Refuse-to-answer fallback**: design the system prompt to explicitly permit and encourage "I don't know" as a valid, non-penalized answer

## Evaluation and Monitoring
Continuously sample production answers and score them against retrieved context for groundedness. Track hallucination rate as a first-class production metric, not just an offline eval — model behavior can drift as prompts, retrieval configurations, or underlying models change.

## Common Mistakes
- Assuming RAG alone solves hallucination without any grounding instructions or verification
- Retrieving too little context, forcing the model to fill gaps from parametric knowledge
- Retrieving too much irrelevant context, which paradoxically also increases hallucination by diluting signal
- Not testing behavior when retrieval legitimately returns nothing useful

## Summary
Hallucination prevention in RAG is a layered defense: precise retrieval reduces the raw material for error, grounding-focused prompting constrains generation, and post-generation verification catches what slips through. No single technique is sufficient alone.
