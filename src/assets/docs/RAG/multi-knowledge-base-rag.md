# Multi-Knowledge-Base RAG

Multi-knowledge-base RAG systems query across multiple distinct knowledge sources (e.g., separate indexes for product docs, HR policies, legal contracts, and support tickets) rather than a single unified index.

## Why Use Multiple Knowledge Bases?
- **Access control** — different sources have different permission requirements.
- **Data freshness** — different sources update at different rates.
- **Domain specificity** — separate indexes can use different chunking/embedding strategies tuned to their content type.
- **Organizational structure** — different teams may own and maintain different knowledge bases.

## Routing Strategies
- **LLM-based routing** — an LLM classifies the query and decides which knowledge base(s) to search.
- **Rule-based routing** — keyword or metadata-based rules direct queries to specific sources.
- **Parallel search + fusion** — query all knowledge bases simultaneously and merge/rerank results across sources.

## Challenges
- Combining and ranking results fairly across sources with different scoring scales.
- Increased system complexity and latency when querying multiple backends.
- Ensuring consistent access control is enforced across every knowledge base.
