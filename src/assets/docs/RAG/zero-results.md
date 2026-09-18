# Handling Zero-Result Retrievals

A zero-result (or low-relevance) retrieval happens when no chunks in the knowledge base are sufficiently relevant to the user's query — a common and important edge case to handle explicitly.

## Why It Matters
Without explicit handling, an LLM may still attempt to answer using its own (unrelated) parametric knowledge, producing an answer that looks grounded but isn't actually supported by the knowledge base — a subtle but serious hallucination risk.

## Detection Strategies
- **Similarity score thresholding** — if the top retrieved chunk's similarity score falls below a set threshold, treat it as a zero-result case.
- **Relevance grading** — use an LLM or classifier to explicitly judge whether retrieved chunks are actually relevant to the query, rather than relying purely on similarity scores.

## Handling Strategies
- Respond with a clear "I couldn't find relevant information about this in the knowledge base" message rather than guessing.
- Offer to broaden the search, ask a clarifying question, or suggest related topics that *were* found.
- Log zero-result queries for review — they often reveal gaps in the knowledge base that should be filled.

## Trade-off
Setting the relevance threshold too high causes excessive "I don't know" responses (poor user experience); too low risks letting weakly relevant or irrelevant context through, increasing hallucination risk.
