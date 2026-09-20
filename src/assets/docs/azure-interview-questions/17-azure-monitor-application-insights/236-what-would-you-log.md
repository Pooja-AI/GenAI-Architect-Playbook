# What would you log?

## Short answer
Log structured, correlatable events and avoid sensitive content.

## Key points
- Timestamp, trace and correlation ID, tenant, hashed user ID, agent and Worker, node, tool, status, duration.
- Model and prompt version, token counts, retrieval document IDs and scores, routing decisions, policy and approval events, errors.
- Not raw PII, secrets or full prompts by default.

## CWD context
Log identifiers of retrieved documents, not their content.
