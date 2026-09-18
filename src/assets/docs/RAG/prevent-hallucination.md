# Preventing Hallucination in RAG

Even with retrieved context, LLMs can still hallucinate — generating confident but incorrect or unsupported statements. RAG reduces but doesn't eliminate this risk.

## Techniques to Reduce Hallucination
- **Strong grounding instructions** — explicitly instruct the model to answer only using the provided context, and to say "I don't know" or "not found in the provided documents" when the context is insufficient.
- **Citation requirements** — require the model to cite which retrieved chunk supports each claim, making unsupported statements easier to spot.
- **Improve retrieval quality** — many hallucinations stem from poor retrieval (irrelevant or missing context), not just generation failures — see `improving-retrieval.md`.
- **Reduce context noise** — too many irrelevant chunks can lead the model to blend retrieved facts incorrectly; reranking helps keep only the most relevant context.
- **Post-generation verification** — use a second LLM pass (or classifier) to check whether the generated answer is actually supported by the retrieved context (faithfulness checking, see `faithfulness.md`).
- **Handle zero-result cases explicitly** — when no relevant documents are found, the system should say so rather than letting the model fabricate an answer (see `zero-results.md`).

## Key Insight
Hallucination in RAG is often a retrieval problem in disguise — improving what gets retrieved is usually more effective than only tweaking the generation prompt.
