## How would you optimize S3 costs?

Main idea: **store the right data in the right storage class and delete unnecessary data.**

```text
S3 Data
   ↓
Classify by Access Frequency
   ↓
Hot → Standard
Warm → Intelligent-Tiering
Old → Glacier
Expired → Delete
```

### Practical techniques

1. **Lifecycle policies** → automatically transition old objects to cheaper storage classes.
2. **Intelligent-Tiering** → useful when access patterns are unpredictable.
3. **Delete obsolete data** → remove temporary files, old artifacts, and unnecessary versions.
4. **Manage versioning** → clean up old versions with lifecycle rules.
5. **Compress large files** → reduce storage and transfer costs where appropriate.
6. **Avoid unnecessary data transfer** → use VPC endpoints for appropriate AWS-service access.
7. **Monitor storage usage** → identify large or unused objects.

### In CWD

Keep **original documents, images, and RAG source files in S3**, while storing searchable chunks/embeddings in OpenSearch.

### Interview answer

> “I optimize S3 costs using lifecycle policies, Intelligent-Tiering for unpredictable access, compression where appropriate, and automatic cleanup of obsolete objects and old versions. In CWD, I keep durable source documents in S3 and avoid duplicating large data unnecessarily. I also monitor storage and data-transfer costs.”

**Memory:**
**Right Class → Lifecycle → Delete → Compress → Reduce Transfer**
