# How do you implement user-level authorization?

## Short answer
Enforce user-level authorisation in code by combining token roles, data ACLs and downstream identity.

## Key points
- Roles decide features; groups and ACLs decide documents (AI Search filters).
- OBO calls let enterprise systems apply the user's own permissions.
- Central policy check before each tool call.

## CWD context
Authorisation is never delegated to the LLM.
