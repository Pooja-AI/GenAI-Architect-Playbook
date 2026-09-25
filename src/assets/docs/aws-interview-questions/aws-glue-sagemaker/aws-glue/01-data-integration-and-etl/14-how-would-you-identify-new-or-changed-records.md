## How would you identify new or changed records?

I would use a **watermark/change-tracking field**, typically a timestamp such as `LastModifiedDate`.

```text
Salesforce
    ↓
Last checkpoint = 2026-09-24 10:00
    ↓
WHERE LastModifiedDate > checkpoint
    ↓
New / Changed records
```

### Common methods

1. **Timestamp**

   ```text
   LastModifiedDate > last_checkpoint
   ```

   Most common for Salesforce-style ingestion.

2. **Incrementing ID / sequence**

   ```text
   ID > last_processed_ID
   ```

   Useful when records are strictly sequential.

3. **CDC (Change Data Capture)**
   Capture inserts, updates, and deletes as events.

4. **Glue Job Bookmarks**
   Glue can track previously processed data for supported sources.

### Important: Deletes

A simple `LastModifiedDate` query may **not detect deleted records**. For deletes, use **CDC**, deletion flags, or periodic reconciliation/full load depending on the source.

### Interview answer

> “I normally identify new and changed records using a watermark such as Salesforce LastModifiedDate. I store the last successful checkpoint and extract records after that timestamp. For deletes or more precise change tracking, I would use CDC when supported, or perform periodic reconciliation.”

**Memory:**
**Timestamp → Checkpoint → Changed Records | CDC → Inserts + Updates + Deletes**
