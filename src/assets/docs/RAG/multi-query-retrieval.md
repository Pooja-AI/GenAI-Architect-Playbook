# Multi-Query Retrieval

Multi-query retrieval generates several variations of the user's original query — often using an LLM — and runs retrieval for each variant, then merges and deduplicates the results.

## How It Works
1. Given a user query, an LLM generates N alternate phrasings (e.g., 3–5 variations) capturing different angles or wording of the same underlying question.
2. Each variant is embedded and used to retrieve candidate chunks independently.
3. Results across all queries are merged (often deduplicated and reranked) into a single candidate set.

## Why It Helps
A single embedding of one phrasing might miss relevant chunks that use different vocabulary. By searching with multiple phrasings, the system casts a wider net and improves recall — particularly useful for ambiguous or broad questions.

## Trade-offs
- Increases latency and cost (multiple embedding + search calls, plus the LLM call to generate variants).
- Most beneficial when queries are short, ambiguous, or when the corpus vocabulary differs significantly from how users phrase questions.
