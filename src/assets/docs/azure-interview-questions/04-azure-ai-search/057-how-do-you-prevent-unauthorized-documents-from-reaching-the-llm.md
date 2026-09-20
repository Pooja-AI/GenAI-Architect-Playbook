# How do you prevent unauthorized documents from reaching the LLM?

## Short answer
Prevent unauthorised documents from reaching the LLM by filtering inside the search query, before anything is returned.

## Key points
- Entitlement-first: security trimming happens in AI Search, not after the fact.
- Identity comes from the validated token (on-behalf-of flow).
- Re-check permissions at Workers and MCP servers.
- Negative tests, audit logs of retrieved document IDs and cache keys scoped by entitlement.

## CWD context
Never retrieve broadly and ask the LLM to hide restricted content.
