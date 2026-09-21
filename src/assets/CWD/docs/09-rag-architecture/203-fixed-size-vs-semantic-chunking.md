## Fixed-size vs Semantic Chunking

The simple difference:

> **Fixed-size = split by size**
> **Semantic = split by meaning**

### 1. Fixed-size chunking

You split the document into a fixed number of tokens/characters.

```text
Document
   ↓
500 tokens → Chunk 1
500 tokens → Chunk 2
500 tokens → Chunk 3
```

**Advantages:**

* Simple
* Fast
* Predictable chunk size
* Easy to implement

**Problem:**

It can split important information in the middle of a sentence, paragraph, or section.

---

### 2. Semantic chunking

You split based on **logical meaning and document structure**.

```text
Document
   ↓
Heading
   ↓
Paragraphs
   ↓
Related content
   ↓
Meaningful Chunk
```

For example:

```text
Product Failure Analysis
    ├── Root Cause
    ├── Symptoms
    ├── Corrective Action
    └── Prevention
```

These related sections can be kept together when appropriate.

**Advantages:**

* Better context
* Better retrieval relevance
* Less chance of separating related information

**Problem:**

* More complex
* Chunk sizes can vary
* Requires document/semantic analysis

---

### Comparison

|                      | Fixed-size                  | Semantic                              |
| -------------------- | --------------------------- | ------------------------------------- |
| Split based on       | Size                        | Meaning                               |
| Implementation       | Simple                      | More complex                          |
| Chunk size           | Predictable                 | Variable                              |
| Context preservation | Moderate                    | Better                                |
| Retrieval quality    | Good for simple content     | Often better for structured documents |
| Best for             | Simple/consistent documents | Enterprise documents with sections    |

### In CWD

For enterprise documents such as **technical manuals, SOPs, troubleshooting guides, and policies**, I would prefer **structure-aware/semantic chunking** because headings and sections often represent meaningful business context.

Example:

```text
Technical Manual
      ↓
Section: Failure Symptoms
      ↓
Section: Root Cause
      ↓
Section: Corrective Action
      ↓
Meaningful chunks
      ↓
Embeddings
      ↓
Azure AI Search
```

### 🎯 Strong interview answer

> **“Fixed-size chunking splits content based on a predefined token or character size, so it's simple and predictable but can break semantic context. Semantic chunking uses document structure and meaning, such as headings, paragraphs, and logical sections, to create more meaningful chunks. For our CWD enterprise documents, I prefer semantic or structure-aware chunking because it generally improves retrieval relevance and preserves business context.”**

### Easy memory trick

**Fixed = Size** 📏
**Semantic = Meaning** 🧠
