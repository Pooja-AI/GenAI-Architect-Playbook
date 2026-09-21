## How do you chunk documents?

In CWD, we **don't split documents randomly by character count**. We try to create chunks that contain a **complete, meaningful piece of information** so retrieval gives the LLM useful context.

### Simple flow

```text
Large Document
      ↓
Identify sections / paragraphs
      ↓
Create meaningful chunks
      ↓
Add small overlap
      ↓
Generate embeddings
      ↓
Azure AI Search
```

### How we chunk

**1. Prefer semantic boundaries**

We split at:

* headings
* sections
* paragraphs
* bullet groups
* tables where possible

For example:

```text
Customer Troubleshooting Guide
        ↓
Chunk 1 → Login Issues
Chunk 2 → Network Issues
Chunk 3 → Device Issues
Chunk 4 → Escalation Process
```

**2. Keep chunks reasonably sized**

We avoid very large chunks because they add unnecessary tokens and reduce retrieval precision.

**3. Use overlap**

For example:

```text
Chunk 1:  [A B C D E]
Chunk 2:        [D E F G H]
```

The overlap helps preserve context that might otherwise be lost at the boundary.

**4. Preserve metadata**

Every chunk carries metadata such as:

```text
document_id
section
source
title
page_number
ACL
```

This helps with filtering, citations, and security.

### Example

Suppose a SharePoint document contains:

```text
Section: Product Failure Analysis

Root Cause:
The failure was caused by overheating...

Corrective Action:
Replace the cooling module...
```

Instead of creating arbitrary chunks, we keep the **Root Cause** and **Corrective Action** information together when they form one meaningful context.

### 🎯 Strong interview answer

> **“We use semantic chunking rather than blindly splitting documents by characters. We prefer boundaries such as headings, sections, paragraphs, and logical content blocks. We keep chunks reasonably sized and use a small overlap to preserve context across boundaries. Each chunk also carries metadata and ACL information, which we use during retrieval for filtering, security, and traceability.”**

### Easy memory trick

**Meaningful → Small → Overlap → Metadata → Secure**

And an important interview point:

> **Good chunking improves retrieval quality; smaller chunks are not automatically better. The goal is to make each chunk independently useful to the retriever and LLM.**
