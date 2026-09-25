For an interview, keep it simple:

> **“I would use AWS Glue to call the ServiceNow REST API and extract data such as incidents, requests, and changes. Glue processes the response and stores the data in Amazon S3. For incremental ingestion, I would use a field such as `sys_updated_on` to pull only records changed since the last successful run.”**

### Simple flow

```text
ServiceNow
    ↓
ServiceNow REST API
    ↓
AWS Glue
    ↓
Transform / Validate
    ↓
Amazon S3
    ↓
Glue Data Catalog
    ↓
Athena / Redshift / ML
```

**Security:** Store the ServiceNow API credentials in **AWS Secrets Manager**, not inside the Glue code.
