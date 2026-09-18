# Top-K Retrieval

Top-k retrieval refers to returning the k most relevant chunks from the index for a given query, where k is a configurable number (e.g., top 5, top 10).

## Choosing K
- **Too small a k** — risks missing relevant context, especially if the answer requires information from multiple chunks.
- **Too large a k** — dilutes the prompt with irrelevant content, increases token cost and latency, and can confuse the LLM (the "lost in the middle" effect, where models pay less attention to content buried in a long context).

## Typical Starting Points
Many systems start with k = 3–10 chunks, then tune based on evaluation results and the model's effective context window behavior.

## Two-Stage Retrieval
A common pattern is to retrieve a larger candidate set first (e.g., top 50 via fast vector/keyword search), then apply a more precise reranker to narrow down to the final top-k (e.g., top 5) that actually get passed into the prompt — balancing recall and precision.
