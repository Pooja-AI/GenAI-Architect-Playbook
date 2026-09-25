## Full Load vs Incremental Load

|                 | **Full Load**           | **Incremental Load**            |
| --------------- | ----------------------- | ------------------------------- |
| What?           | Load all data           | Load only new/changed data      |
| First ingestion | ✅ Common                | Usually not                     |
| Runtime         | Higher                  | Lower                           |
| Cost            | Higher                  | Lower                           |
| Data volume     | Large                   | Small                           |
| Example         | All Salesforce Accounts | Accounts changed since last run |

### CWD example

**Full load:**

```text
Salesforce
    ↓
ALL Accounts/Cases
    ↓
Glue → S3 → OpenSearch
```

**Incremental:**

```text
Salesforce
    ↓
LastModifiedDate > LastCheckpoint
    ↓
Changed Records
    ↓
Glue → S3 → OpenSearch
```

### When would I use each?

**Full load:**

* Initial ingestion
* Major schema changes
* Data recovery/rebuild
* Periodic complete reconciliation

**Incremental load:**

* Daily/hourly ingestion
* Large datasets
* Production pipelines
* Reduce processing time and cost

### Interview answer

> “I use full load for initial ingestion or when I need a complete rebuild. For regular production ingestion, I prefer incremental loading using a watermark such as LastModifiedDate or Glue job bookmarks, because it processes only new or changed records and reduces cost and processing time.”

**Memory:**
**Full = Everything | Incremental = Changes only**
