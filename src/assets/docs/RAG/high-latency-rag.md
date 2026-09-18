# Diagnosing High Latency in RAG

RAG latency problems typically originate in one of five stages: query processing, retrieval, reranking, prompt construction, or generation.

## Diagnostic Steps
1. **Instrument each stage separately** — measure time spent in query embedding, vector search, reranking, and LLM generation individually, not just end-to-end.
2. **Identify the dominant cost** — in most systems, LLM generation time dominates, followed by reranking (if used), then retrieval.

## Common Causes and Fixes
| Cause | Fix |
|---|---|
| Slow ANN search parameters | Lower `ef_search`/similar accuracy-speed knobs |
| Sequential retrieval + reranking + generation | Parallelize independent steps where possible |
| Large k or oversized context | Reduce k, trim prompt size |
| Slow/heavy reranker | Use a lighter reranker or skip for latency-critical paths |
| Long generated responses | Set max token limits, use streaming for perceived latency |
| Network overhead to external vector DB/API | Consider colocating services, connection pooling |
| Cold starts | Keep models/connections warm; use connection pooling |

See `low-latency-rag.md` for proactive design techniques to prevent latency issues before they occur in production.
