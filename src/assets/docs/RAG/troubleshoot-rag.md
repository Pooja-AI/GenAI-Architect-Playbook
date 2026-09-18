# Troubleshooting RAG Systems

A general framework for diagnosing RAG quality issues by isolating whether the problem is in retrieval or generation.

## Step 1: Check Retrieval
- Manually inspect: were the actually relevant chunks retrieved for this query?
- If **no** → retrieval problem. Check chunking (`poor-retrieval.md`), embedding model fit, or search configuration.
- If **yes** → move to Step 2.

## Step 2: Check Generation
- Given the retrieved chunks were relevant, did the model use them correctly?
- If the model ignored good context or hallucinated → generation/prompting problem (see `prevent-hallucination.md`, `grounded-generation.md`).
- If the model handled it well → the issue may be elsewhere (e.g., ambiguous user query, missing knowledge base content).

## Common Symptom → Likely Cause Map
| Symptom | Likely Cause |
|---|---|
| Answer is irrelevant or off-topic | Poor retrieval — see `poor-retrieval.md` |
| Answer contradicts the retrieved source | Generation ignoring context — check prompt grounding instructions |
| "I don't know" for questions that should be answerable | Knowledge base gap, or overly strict relevance threshold |
| Slow responses | Latency bottleneck — see `high-latency-rag.md` |
| High spend | See `high-cost-rag.md` |

Systematic tracing (`rag-tracing.md`) and a golden evaluation dataset (`golden-dataset.md`) make this diagnostic process far faster than ad hoc debugging.
