# What Is RAG (Retrieval-Augmented Generation)?

## Overview
Retrieval-Augmented Generation (RAG) is an architectural pattern that combines a large language model (LLM) with an external knowledge retrieval system. Instead of relying solely on the knowledge baked into a model's weights during training, RAG dynamically fetches relevant information from a document store — typically a vector database — and injects it into the model's context window at inference time. This lets the LLM answer questions using up-to-date, proprietary, or domain-specific information it was never trained on.

## Why RAG Exists
LLMs have three structural limitations that RAG addresses:

1. **Knowledge cutoff** — models only know what existed in their training data up to a certain date.
2. **No access to private data** — a model can't know your company's internal wiki, contracts, or support tickets unless you show it.
3. **Hallucination risk** — when a model doesn't know something, it may generate a plausible-sounding but false answer.

RAG mitigates all three by grounding generation in retrieved, verifiable source documents.

## Core Architecture
A typical RAG pipeline has two phases:

**Indexing (offline):**
1. Ingest raw documents (PDFs, HTML, Word docs, database rows, etc.)
2. Split them into chunks (see chunking strategy)
3. Generate vector embeddings for each chunk using an embedding model
4. Store embeddings + metadata in a vector database (e.g., Pinecone, OpenSearch, pgvector, Amazon Bedrock Knowledge Bases)

**Retrieval + Generation (online, per query):**
1. Embed the user's query using the same embedding model
2. Perform a similarity search (often cosine similarity or approximate nearest neighbor) against the vector store
3. Retrieve the top-k most relevant chunks
4. Construct a prompt that combines the user's question with the retrieved context
5. Send the augmented prompt to the LLM
6. Return the generated, grounded answer — often with citations back to source chunks

## Simple Example Flow
```
User: "What's our refund policy for enterprise customers?"
  → embed query
  → search vector DB for similar chunks
  → retrieve: "Enterprise Refund Policy v3.docx, section 4.2..."
  → prompt = system_instructions + retrieved_chunks + user_question
  → LLM generates answer citing the policy
```

## Benefits Over Fine-Tuning
- **Freshness**: update the knowledge base without retraining the model
- **Transparency**: retrieved chunks can be shown as citations, improving trust and auditability
- **Cost**: far cheaper than fine-tuning for knowledge injection
- **Access control**: retrieval can be scoped per-user (see RAG security trimming)

Fine-tuning is still useful for changing model *behavior* (tone, format, task-specific skills), but RAG is the standard approach for injecting *knowledge*.

## Common Failure Modes
- **Irrelevant retrieval** — poor chunking or embedding choices cause the wrong context to be pulled
- **Context overflow** — too many or too-large chunks blow past the context window
- **Stale index** — the vector store isn't updated when source documents change
- **Missing security trimming** — retrieval returns documents the user isn't authorized to see

## When to Use RAG
RAG is the right pattern when:
- Answers depend on frequently changing or large proprietary corpora
- You need citations/traceability for compliance or trust
- The knowledge base is too large to fit in a single prompt

RAG is *not* ideal when the task is purely reasoning-based with no external knowledge requirement, or when ultra-low latency is critical and retrieval overhead is unacceptable (see latency optimization for mitigations).

## Enterprise Considerations
In production AWS environments, RAG is commonly built with Amazon Bedrock Knowledge Bases, OpenSearch Serverless as the vector store, and S3 as the raw document source, orchestrated via Lambda or Step Functions. This gives a fully managed retrieval layer while keeping the LLM choice (Claude, Titan, Llama, etc.) flexible through Bedrock's unified API.

## Summary
RAG turns a static LLM into a dynamic, knowledge-grounded system by pairing generation with retrieval. It is the foundational pattern underlying most enterprise generative AI applications today, and nearly every other document in this knowledge base — chunking, embeddings, vector databases, hybrid search — exists to make RAG retrieval more accurate, secure, and scalable.
