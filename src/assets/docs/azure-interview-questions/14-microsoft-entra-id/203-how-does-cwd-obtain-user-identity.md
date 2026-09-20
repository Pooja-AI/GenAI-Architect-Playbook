# How does CWD obtain user identity?

## Short answer
CWD reads the user's identity from validated token claims and carries it in workflow context, not in the prompt.

## Key points
- Claims: oid, tid, username, roles and groups (or a Graph lookup on group overage).
- The Coordinator keeps identity in graph state.
- Use the on-behalf-of flow to call downstream APIs as the user.

## CWD context
The LLM never sees or decides identity.
