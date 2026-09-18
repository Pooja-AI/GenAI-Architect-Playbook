# RAG Security

RAG systems introduce security considerations beyond typical LLM applications, since they connect models to potentially sensitive internal data.

## Key Risks
- **Unauthorized data access** — retrieving and exposing documents a user shouldn't see.
- **Prompt injection via retrieved content** — malicious instructions embedded in indexed documents that attempt to manipulate the LLM's behavior when retrieved into context.
- **Data leakage across tenants** — in multi-tenant systems, improper isolation could expose one customer's data to another.
- **Sensitive data exposure in logs/traces** — retrieved content and generated answers may contain sensitive information that ends up in monitoring or logging systems.

## Mitigations
- Enforce **access control (ACL) filtering** at retrieval time, not just at the final response (see `rag-authorization.md`, `acl-filtering.md`).
- Treat all retrieved content as **untrusted input** — apply the same caution to instructions embedded in documents as to untrusted user input.
- **Encrypt data at rest and in transit**, including vector stores.
- **Audit and log** retrieval and generation activity for security review, while being careful not to store sensitive content insecurely.
- Regularly **red-team** the system for prompt injection and data-leakage vulnerabilities.
