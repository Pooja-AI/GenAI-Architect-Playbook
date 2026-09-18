# RAG with MCP (Model Context Protocol)

MCP (Model Context Protocol) is an open standard that lets LLM applications connect to external data sources and tools through a unified interface, using MCP servers that expose resources, tools, and prompts.

## How MCP Relates to RAG
- An MCP server can expose a **retrieval tool** that wraps a vector database or search index, letting any MCP-compatible LLM client perform retrieval without custom integration code for each knowledge source.
- MCP standardizes how the LLM discovers and calls retrieval tools, making it easier to plug new knowledge bases into an agent without rewriting application logic.
- Retrieval can be combined with other MCP-exposed tools (e.g., databases, APIs, file systems) in the same agentic session, enabling RAG alongside broader tool use within one protocol.

## Benefits
- **Interoperability** — the same MCP retrieval server can be used across multiple LLM clients/applications.
- **Separation of concerns** — knowledge base owners maintain the MCP server; application developers just connect to it.
- **Composability** — RAG becomes one tool among many an agent can invoke dynamically, fitting naturally into agentic RAG architectures.

## Practical Note
MCP doesn't replace the underlying RAG components (chunking, embedding, vector search) — it standardizes how an LLM *accesses* a RAG system as a callable tool.
