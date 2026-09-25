For an interview, keep it simple:

> **“I would use AWS Glue with the Salesforce connector. Glue connects to Salesforce through the API, extracts objects such as Accounts, Contacts, or Cases, and writes the data into Amazon S3. I can run the Glue job incrementally using a timestamp or Salesforce change tracking, then catalog the data with Glue Data Catalog for downstream processing.”**

### Simple flow

```text
Salesforce
    ↓
Salesforce API
    ↓
AWS Glue Connector
    ↓
Glue ETL Job
    ↓
Amazon S3
    ↓
Glue Data Catalog
    ↓
Athena / Redshift / ML
```

**Security:** Store Salesforce credentials/API secrets in **AWS Secrets Manager**, not in the Glue script.
