# How would Databricks process enterprise data?

## Short answer
Process enterprise data with a medallion pipeline: land raw, clean and standardise, then curate.

## Key points
- Auto Loader ingests files from ADLS into Delta bronze tables.
- Silver: deduplicate, standardise, join and attach ACL metadata.
- Gold: chunked, embedded and ready to publish to AI Search.
- Unity Catalog controls access and records lineage.

## CWD context
Keep raw data immutable so any layer can be rebuilt.
