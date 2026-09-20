# How do you implement document-level ACL filtering?

## Short answer
Implement ACL filtering by storing permitted principals on every chunk and filtering on the caller's identity at query time.

## Key points
- Chunks carry user and group IDs in a collection field.
- Resolve the caller's Entra groups (from the token or Graph, cached) and pass a filter using search.in.
- Add a tenant filter as well.
- Keep ACLs in sync with the source, because a permission change may happen without a content change.
- Newer built-in document-level access controls exist in preview for some sources; check current docs.

## CWD context
The filter is built by server code from a validated identity, never by the LLM.
