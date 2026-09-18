# The RAG Pipeline

A typical RAG system has two main phases: **indexing** (offline) and **retrieval + generation** (online).

## Indexing Phase
1. **Ingest** documents (PDFs, HTML, Word docs, etc.)
2. **Chunk** documents into smaller passages.
3. **Embed** each chunk into a vector using an embedding model.
4. **Store** vectors and metadata in a vector database.

## Query Phase
1. **Embed the query** using the same embedding model.
2. **Retrieve** top-k similar chunks via vector search (often combined with keyword/hybrid search).
3. **Rerank** (optional) to refine the ordering of retrieved chunks by relevance.
4. **Construct prompt** by inserting retrieved chunks into a template with the user's question.
5. **Generate** the final answer with the LLM.
6. **Return** the answer, often alongside citations to source chunks.

## Key Components
- Document loaders and parsers
- Chunking strategy
- Embedding model
- Vector database / index
- Retriever (and optional reranker)
- Prompt template
- LLM
