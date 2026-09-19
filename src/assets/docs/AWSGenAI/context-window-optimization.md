# Context Window Optimization

## Overview
LLMs have a finite context window (the maximum number of tokens they can process in a single request, spanning system instructions, retrieved context, conversation history, and the user's query). Context window optimization is about maximizing the *useful information density* within that budget rather than simply maximizing how much is stuffed in.

## Why More Context Isn't Always Better
- **Cost**: most LLM pricing scales with input tokens; larger context directly increases cost per request
- **Latency**: processing more input tokens increases time-to-first-token
- **"Lost in the middle" effect**: research and empirical testing show LLMs often attend less reliably to information placed in the middle of a long context compared to the beginning or end — cramming in more chunks can *reduce* answer quality even when the correct information is technically present

## Techniques

### Precise Retrieval Over Bulk Retrieval
Improving retrieval precision (via reranking, hybrid search, better chunking) so that fewer, more relevant chunks are needed is the highest-leverage optimization — it improves both cost and quality simultaneously.

### Context Ordering
Place the most important/relevant retrieved content near the beginning or end of the context, and put static, less critical system instructions where the "lost in the middle" effect matters least, based on empirical testing with your specific model.

### Compression / Summarization
For long conversation histories, summarize older turns into a condensed form instead of including the full verbatim transcript. For lengthy retrieved documents, use extractive or abstractive summarization to compress before insertion, keeping only the passages directly relevant to the query.

### Chunk Deduplication
Remove near-duplicate chunks (common when multiple document versions or overlapping chunks are retrieved) before constructing the prompt.

### Dynamic Context Budgeting
Allocate context budget dynamically: simple queries get fewer retrieved chunks, complex or ambiguous queries get a larger allocation, rather than a fixed top-k for every request.

### Sliding Window for Long Conversations
Maintain only the most recent N turns verbatim, with older turns rolled into a running summary — this bounds context growth in long-running chat sessions without losing all historical grounding.

### Structured Formatting
Use clear delimiters (e.g., XML-like tags or Markdown headers) to separate system instructions, retrieved context, and conversation history — this measurably helps models parse and correctly attribute information within a long context, reducing confusion between sources.

## Measuring the Trade-off
Track answer quality (via evaluation metrics) against context size across a range of configurations — most teams find a "knee in the curve" where adding more context yields diminishing or even negative returns on accuracy while cost keeps climbing linearly.

## Long-Context Models
Newer models supporting very large context windows (100K+ tokens) reduce the pressure to aggressively trim context, but do not eliminate the "lost in the middle" effect or the cost/latency penalty of large inputs — optimization is still valuable even with large-context models.

## Summary
Context window optimization is about curating the most relevant, well-organized information rather than maximizing volume. Precision-focused retrieval, deduplication, summarization, and thoughtful ordering all contribute to better answers at lower cost than simply expanding the context window.
