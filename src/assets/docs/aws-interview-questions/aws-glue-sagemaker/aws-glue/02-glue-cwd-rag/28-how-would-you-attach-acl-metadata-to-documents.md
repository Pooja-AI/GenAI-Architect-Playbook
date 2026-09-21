# How would you attach ACL metadata to documents?

## Short answer
Capture source permissions and store them as normalised principals on every chunk.

## Key points
- Read permissions from SharePoint, Salesforce sharing and ServiceNow roles; map to identity-provider user and group IDs.
- Store as allowed principals on each chunk; refresh on a schedule and on events, since permissions change independently of content.
- Fail closed: no valid ACL means no indexing.

## CWD context
Query-time filtering then trusts this metadata.
