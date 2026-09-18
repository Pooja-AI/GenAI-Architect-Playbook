# Multi-Agent RAG

Multi-agent RAG systems use multiple specialized LLM agents that collaborate to answer a query, each potentially responsible for a different knowledge domain, retrieval strategy, or reasoning step.

## Example Architecture
- A **coordinator/orchestrator agent** receives the user query and decomposes it into sub-tasks.
- **Specialist retrieval agents** (e.g., a "legal agent," a "finance agent") each query their own knowledge base and return relevant findings.
- A **synthesis agent** combines the specialists' outputs into a coherent final answer.

## Benefits
- Scales well to broad domains with many distinct knowledge sources.
- Specialist agents can use tuned retrieval/reranking strategies specific to their domain.
- Enables parallel retrieval across sources, reducing overall latency compared to sequential multi-hop retrieval.

## Trade-offs
- Higher system complexity — more moving parts to build, monitor, and debug.
- Coordination overhead — the orchestrator must correctly decompose questions and synthesize disparate agent outputs.
- Cost scales with the number of agent/LLM calls involved.

Multi-agent RAG is most valuable for large, complex organizations with genuinely siloed knowledge domains, rather than as a default architecture for simpler use cases.
