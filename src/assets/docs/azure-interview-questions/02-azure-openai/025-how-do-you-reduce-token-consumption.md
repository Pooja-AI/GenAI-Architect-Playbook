# How do you reduce token consumption?

## Short answer
Reduce token consumption by trimming every part of the prompt and returning only what the model needs.

## Key points
- Concise, reviewed system prompts stored in the Prompt Registry.
- Top-k retrieval with reranking and a score threshold; deduplicate chunks.
- Rolling summary of conversation history.
- Tool results projected to needed fields only; short structured-output schemas.
- Place static content first to benefit from prompt caching.

## CWD context
Track prompt tokens per stage so you know where the tokens actually go.
