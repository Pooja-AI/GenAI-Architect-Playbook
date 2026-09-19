# Hallucination Evaluation

## Overview
Hallucination evaluation specifically measures the rate and severity of a model generating content that is factually incorrect, unsupported by provided context, or entirely fabricated — a critical evaluation dimension distinct from general quality or helpfulness assessment.

## Defining Hallucination Precisely
Hallucination isn't a single phenomenon — useful evaluation distinguishes:
- **Intrinsic hallucination**: the output contradicts information present in the provided source/context
- **Extrinsic hallucination**: the output includes information that cannot be verified from the provided source/context, whether or not it happens to be factually true in the real world
- **Fabricated specifics**: invented citations, statistics, names, or details presented with unwarranted confidence
- **Reasoning hallucination**: a plausible-sounding but logically flawed chain of reasoning leading to an incorrect conclusion, even when individual factual claims are accurate

## Evaluation Approaches

### Reference-Based Fact Checking
For tasks with a verifiable ground truth, compare specific factual claims in the output against a reference answer or knowledge source, flagging discrepancies — effective for narrow, fact-based QA but harder to apply to open-ended generation.

### Context-Grounding Verification (for RAG)
Assess whether each claim in a RAG-generated response is actually entailed by the retrieved context provided to the model — this is the primary hallucination evaluation method for RAG systems and directly measures the "faithfulness" dimension described in groundedness-evaluation.md.

### LLM-as-Judge for Hallucination Detection
Use a separate LLM call to compare the generated output against the source context (or a reference answer) and score whether each claim is supported, unsupported, or contradicted — scalable but requires validation, since judge models themselves can occasionally miss subtle hallucinations or over-flag stylistically confident phrasing as unsupported.

### Human Annotation
For high-stakes applications or to validate automated methods, human annotators review outputs against source material and flag hallucinated content — the most reliable but least scalable method, typically reserved for building golden datasets or periodic quality audits.

## Building a Hallucination Test Set
Include:
- Queries where the correct answer is genuinely present in the available context (baseline: does the model get it right when it should?)
- Queries where the correct answer is *not* present in the available context (does the model correctly say "I don't know" rather than fabricating an answer?)
- Queries with subtly conflicting or ambiguous context (does the model handle the ambiguity appropriately rather than confidently picking one interpretation without acknowledgment?)
- Queries designed to tempt over-confident extrapolation beyond what the context actually supports

## Tracking Hallucination Rate Over Time
Hallucination rate should be tracked as an ongoing production metric (via continuous sampling and automated evaluation), not just a one-time pre-launch measurement — since changes to prompts, retrieval configuration, or the underlying model can all shift hallucination behavior, sometimes unexpectedly.

## Relationship to Prevention
Hallucination evaluation and hallucination prevention (see preventing-rag-hallucination.md) form a feedback loop — evaluation identifies the rate and patterns of hallucination, which informs which prevention techniques (grounding instructions, citation requirements, relevance thresholding) are most needed, and subsequent evaluation validates whether those interventions actually reduced the measured hallucination rate.

## Summary
Hallucination evaluation requires precisely defining what counts as hallucination for your specific application, using context-grounding verification (especially for RAG systems) combined with LLM-as-judge and periodic human validation, and tracking hallucination rate continuously in production as prompts, retrieval, and models evolve.
