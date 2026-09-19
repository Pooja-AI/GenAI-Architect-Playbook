# RAG Evaluation

## Overview
Evaluating a RAG system requires assessing two distinct components — retrieval quality and generation quality — plus the end-to-end answer quality that results from their combination. A system can retrieve perfectly relevant chunks and still generate a poor answer, or generate a fluent answer built on irrelevant retrieval.

## Retrieval Evaluation Metrics
- **Recall@k**: fraction of queries where at least one relevant chunk appears in the top k results
- **Precision@k**: fraction of the top k results that are actually relevant
- **MRR (Mean Reciprocal Rank)**: rewards relevant results appearing earlier in the ranking
- **nDCG (normalized Discounted Cumulative Gain)**: accounts for graded relevance levels, not just binary relevant/irrelevant

These require a labeled evaluation set: representative queries paired with the ground-truth relevant document(s)/chunk(s).

## Generation Evaluation Metrics
- **Faithfulness / Groundedness**: does the generated answer only make claims supported by the retrieved context?
- **Answer relevance**: does the answer actually address the user's question (independent of factual accuracy)?
- **Context relevance**: was the retrieved context itself relevant to the query (this overlaps with retrieval metrics but is measured from the generation side)
- **Fluency and coherence**: is the answer well-formed and readable?

## Evaluation Approaches

### Human Evaluation
Gold standard for accuracy but expensive and slow; typically used to build a labeled golden dataset and to periodically audit automated evaluation methods.

### LLM-as-Judge
Use a strong LLM to score answers against a rubric (faithfulness, relevance, completeness) by comparing the generated answer to the retrieved context and/or a reference answer. Fast and scalable, but requires validation against human judgment to confirm the judge model's scoring correlates well with human preference, and awareness of judge-model biases (e.g., favoring longer or more confident-sounding answers).

### Reference-Based Metrics
Compare generated answers to a reference "correct" answer using metrics like ROUGE or BLEU, or semantic similarity via embeddings. These are weaker signals for open-ended generation but useful for narrow, fact-based QA where answers are short and canonical.

### Component-Level vs. End-to-End
Evaluate retrieval and generation both independently (to isolate which component needs improvement) and end-to-end (to measure what users actually experience).

## Building a Golden Dataset
See golden-dataset.md for detail, but in brief: curate a representative, diverse set of real or realistic queries with verified correct answers and supporting source chunks, covering easy cases, edge cases, ambiguous queries, and queries with no good answer in the knowledge base.

## Continuous Evaluation in Production
- Sample a percentage of live traffic for automated LLM-as-judge scoring
- Track metric trends over time to catch regressions from prompt changes, model version updates, or knowledge base drift
- Correlate automated metrics with real user feedback signals (thumbs up/down, follow-up question rate, escalation rate)

## Common Pitfalls
- Evaluating only on "easy" queries that don't stress-test retrieval edge cases
- Using only end-to-end metrics, making it hard to diagnose whether retrieval or generation is the bottleneck when quality drops
- Never revisiting the golden dataset as the knowledge base and expected answers evolve

## Summary
Rigorous RAG evaluation requires separate visibility into retrieval and generation quality, a maintained golden dataset, and a mix of automated (LLM-as-judge) and human evaluation to catch what automated methods miss, run continuously rather than as a one-time pre-launch check.
