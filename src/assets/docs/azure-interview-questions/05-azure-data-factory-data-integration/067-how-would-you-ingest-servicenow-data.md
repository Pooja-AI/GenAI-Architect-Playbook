# How would you ingest ServiceNow data?

## Short answer
Ingest ServiceNow data through the ServiceNow connector or Table API into ADLS.

## Key points
- Filter on sys_updated_on for incremental loads and paginate.
- OAuth credentials in Key Vault; watch API rate limits.
- Handle deletions using the audit-delete table or reconciliation.
- Carry ticket permissions or assignment groups as ACL metadata.

## CWD context
Keep raw and curated layers separate for reprocessing.
