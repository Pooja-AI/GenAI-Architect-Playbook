# Which components are synchronous?

## Short answer
Synchronous components are those the user is actively waiting on and that finish in seconds.

## Key points
- APIM → API → Coordinator intent classification and routing.
- Retrieval from AI Search and LLM answer generation.
- Short read-only MCP calls (for example fetching a customer record).
- Response validation and guardrails.

## CWD context
Rule of thumb: synchronous only if it is fast, read-only and the user needs the result now.
