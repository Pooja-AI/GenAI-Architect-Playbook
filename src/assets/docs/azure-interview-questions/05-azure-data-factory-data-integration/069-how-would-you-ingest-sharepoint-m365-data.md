# How would you ingest SharePoint/M365 data?

## Short answer
Ingest SharePoint / M365 content through Microsoft Graph or supported connectors, keeping permissions.

## Key points
- Graph delta queries give incremental changes and deletions.
- Sites.Selected permission for least privilege.
- Extract files, text and permission metadata for ACL filtering; respect sensitivity labels.
- Alternatives: SharePoint indexer options in AI Search, or a Function-based crawler.

## CWD context
Permissions are as important as content for security trimming.
