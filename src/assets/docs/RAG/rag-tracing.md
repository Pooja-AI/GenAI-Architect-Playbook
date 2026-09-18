# RAG Tracing

Tracing captures a detailed, step-by-step record of what happened during a single RAG request — which query was received, what chunks were retrieved, what prompt was constructed, and what the model generated — essential for debugging and auditing.

## What a Trace Typically Captures
- The original user query (and any rewritten/expanded versions).
- Retrieved chunks, their similarity/rerank scores, and source documents.
- The final assembled prompt sent to the LLM.
- The generated response, including any citations.
- Latency at each pipeline stage.
- Metadata like which embedding model, prompt template version, and retrieval parameters were used.

## Why It Matters
- **Debugging** — when an answer is wrong, tracing lets you pinpoint whether the failure was in retrieval (wrong/missing chunks) or generation (model ignored good context).
- **Auditing** — for compliance-sensitive applications, traces provide a record of exactly what information was shown to a user and when.
- **Evaluation feedback loop** — traces from production can be reviewed and added to the golden dataset to continuously improve evaluation coverage.

## Tooling
Dedicated LLM observability platforms (e.g., LangSmith, Arize Phoenix, Langfuse) provide structured tracing, visualization, and search over RAG pipeline executions, often integrating directly with popular RAG frameworks.
