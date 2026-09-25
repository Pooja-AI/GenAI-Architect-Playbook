# What is S3 Versioning?

**S3 Versioning keeps multiple versions of the same object instead of permanently replacing the previous version.**

### Simple example

Suppose CWD stores:

```text
customer_policy.pdf
```

First upload:

```text
customer_policy.pdf → Version 1
```

Later, someone updates it:

```text
customer_policy.pdf → Version 2
```

S3 keeps both versions:

```text
S3 Bucket
│
└── customer_policy.pdf
      ├── Version 1
      └── Version 2  ← Current
```

If Version 2 is accidentally deleted or overwritten, you can recover Version 1.

---

## Why use it in CWD?

For enterprise RAG documents:

```text
New document
     ↓
S3
     ↓
Version 1
     ↓
Document updated
     ↓
Version 2
     ↓
Ingestion pipeline
     ↓
OpenSearch updated
```

It helps with:

* **Accidental overwrite recovery**
* **Accidental deletion recovery**
* Document history
* Auditability
* RAG document rollback

---

## What happens when you delete?

With versioning enabled, deleting an object normally creates a **delete marker** rather than immediately removing the previous version.

```text
Version 1
Version 2
Delete
  ↓
Delete Marker
```

The older versions can still be recovered unless they are permanently deleted.

---

## Versioning + CWD RAG

I would store document metadata such as:

```text
document_id
version_id
file_name
updated_at
content_hash
```

Then the ingestion pipeline can determine which document version should be indexed.

```text
S3 Version
     ↓
Extract
     ↓
Chunk
     ↓
Embed
     ↓
OpenSearch
```

### Important distinction

**S3 Versioning ≠ backup.**

Versioning helps recover previous object versions, but I would still use appropriate **backup, retention, lifecycle, and replication strategies** for broader disaster recovery requirements.

### 🎯 Interview answer

> **“S3 Versioning allows us to keep multiple versions of the same object instead of permanently overwriting the previous version. In CWD, I would enable versioning for important enterprise documents so accidental updates or deletions can be recovered. I can also use the S3 version ID and document metadata to track which version was processed into OpenSearch for RAG.”**

**Memory trick:**
**Versioning = Keep the history of the object.**
