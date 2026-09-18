# ACL Filtering

Access Control List (ACL) filtering restricts retrieval results to only the chunks/documents that the requesting user is authorized to access, based on permissions captured during ingestion.

## How It Works
1. During ingestion, capture each document's access permissions (e.g., allowed users, groups, or roles) from the source system.
2. Attach this permission metadata to every chunk derived from that document.
3. At query time, determine the requesting user's identity and group memberships.
4. Apply a metadata filter during vector search that only returns chunks the user is permitted to access.

## Design Considerations
- **Filter before ranking** where possible, so restricted chunks don't consume a "slot" in the top-k results before being filtered out.
- **Keep permissions in sync** with the source system — stale ACL metadata can either over-restrict (bad user experience) or under-restrict (security risk).
- **Group-based permissions** scale better than per-user permissions for large organizations.
- **Test for leakage** — verify with automated tests that users genuinely cannot retrieve content outside their permitted scope, including edge cases like nested groups or recently revoked access.

ACL filtering is the primary mechanism underlying `security-trimming.md` and `rag-authorization.md`.
