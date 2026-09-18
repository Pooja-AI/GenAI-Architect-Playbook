# Choosing an Embedding Model

## Key Factors
- **Domain fit** — general-purpose models work well for broad content; domain-specific models (legal, medical, code) can outperform on specialized text.
- **Dimensionality** — higher dimensions can capture more nuance but cost more storage and compute.
- **Context length** — how much text can be embedded in a single pass.
- **Multilingual support** — required if your corpus spans multiple languages.
- **Latency & cost** — hosted API models vs. self-hosted open-source models.
- **Benchmark performance** — check leaderboards like MTEB (Massive Text Embedding Benchmark) for retrieval-task performance.

## Common Choices
- Hosted API embedding models (e.g., OpenAI, Cohere, Voyage AI, Google).
- Open-source models (e.g., BGE, E5, GTE, Nomic) that can be self-hosted for cost control and data privacy.

## Practical Tip
Always evaluate candidate embedding models against your own labeled retrieval dataset — benchmark rankings don't always predict performance on your specific domain.
