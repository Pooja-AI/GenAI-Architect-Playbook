# RAG with Agentic AI

Agentic RAG combines retrieval-augmented generation with autonomous agent capabilities — letting an LLM decide *when*, *what*, and *how* to retrieve, rather than following a fixed retrieve-then-generate pipeline.

## Key Differences from Classic RAG
- **Classic RAG**: retrieval always happens once, before generation, in a fixed sequence.
- **Agentic RAG**: the LLM can reason about whether retrieval is needed, issue multiple retrieval calls, reformulate queries based on intermediate results, and combine retrieval with other tools (calculators, APIs, code execution).

## Common Patterns
- **Router agents** — decide which knowledge base or tool to query based on the question.
- **Iterative retrieval** — the agent retrieves, evaluates whether the result is sufficient, and retrieves again with a refined query if not.
- **Multi-step reasoning** — the agent breaks a complex question into sub-questions, retrieving and reasoning over each before synthesizing a final answer.

## Benefits
- Handles more complex, multi-hop questions than single-shot RAG.
- Can dynamically choose between multiple knowledge sources or tools.

## Trade-offs
More LLM calls mean higher latency and cost, and agent behavior can be harder to predict and debug than a fixed pipeline.
