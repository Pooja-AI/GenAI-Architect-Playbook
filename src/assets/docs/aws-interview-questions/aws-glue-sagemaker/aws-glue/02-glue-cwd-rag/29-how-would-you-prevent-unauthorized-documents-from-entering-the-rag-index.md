# How would you prevent unauthorized documents from entering the RAG index?

## Short answer
Prevent unauthorised documents from entering the index with allow-lists, classification and fail-closed checks.

## Key points
- Approved source and path allow-list; approval workflow for new sources.
- Classification and PII scans (Macie or Comprehend) with quarantine.
- Reject chunks with missing or invalid ACL metadata; separate indexes for restricted data.
- Data-quality rules; least-privilege write access; query-time ACL filtering as a second layer.

## CWD context
Two layers: control what goes in, and filter what comes out.
