# How would you implement document-level security?

## Short answer
OpenSearch Serverless access policies work at collection or index level, so document-level security is implemented as query filters.

## Key points
- Store allowed users or groups on each chunk and filter with a terms query built from the validated identity.
- Managed OpenSearch Service offers engine-enforced document-level security through fine-grained access control if required.
- Test negative cases.

## CWD context
Trusted server code builds the filter; the LLM never does.
