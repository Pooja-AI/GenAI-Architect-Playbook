# How would Azure ML consume data from Azure Data Lake/S3-equivalent storage?

## Short answer
Consume ADLS Gen2 data through registered data assets and datastores using managed identity.

## Key points
- Data assets reference ADLS folders or tables (URI folder / MLTable) and are versioned.
- Grant Storage Blob Data Reader to the workspace or compute identity.
- Use private endpoints or managed VNet for network isolation.

## CWD context
Avoid embedding storage keys in training code.
