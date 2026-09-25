For an interview, keep it simple:

> **“For Oracle, I would use the AWS Glue JDBC connection to connect to Oracle, extract the required tables, transform the data, and write it to S3. For Snowflake, I would use the Glue Snowflake connector to read or write data. Credentials would be stored in AWS Secrets Manager.”**

### Simple flow

```text
Oracle ──JDBC──→ Glue ──→ S3
                         ↓
Snowflake ──Connector──→ Glue
                         ↓
                    Transform
                         ↓
                    S3 / Target
```

**Key point:** Oracle → **JDBC**, Snowflake → **Snowflake connector**, credentials → **Secrets Manager**.
