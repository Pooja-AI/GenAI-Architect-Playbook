# RAG with LangGraph

LangGraph is a framework for building stateful, graph-based LLM applications, well suited to implementing agentic RAG workflows that go beyond a simple linear retrieve-then-generate chain.

## Why LangGraph for RAG?
- Models a RAG workflow as a **graph of nodes** (retrieve, grade documents, rewrite query, generate, etc.) with explicit edges controlling flow, including loops and conditional branches.
- Supports **cyclic workflows** — e.g., retrieve → check relevance → if insufficient, rewrite the query and retrieve again → generate.
- Maintains explicit **state** across steps, making it easier to track retrieved documents, intermediate reasoning, and conversation history.

## Common RAG Graph Pattern
1. **Retrieve node** — fetch candidate chunks for the query.
2. **Grade node** — an LLM (or classifier) evaluates whether retrieved chunks are relevant.
3. **Conditional edge** — if relevant, proceed to generation; if not, route to a query-rewriting node and retry retrieval.
4. **Generate node** — produce the final answer grounded in the retrieved context.

## Benefits
LangGraph's explicit control flow makes complex, self-correcting RAG pipelines (like corrective RAG or adaptive RAG) easier to build, visualize, and debug compared to purely prompt-driven agent loops.
