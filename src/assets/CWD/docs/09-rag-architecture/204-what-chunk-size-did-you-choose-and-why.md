## What chunk size did you choose and why?

For CWD, a good interview answer is:

> **“We started with around 500–700 tokens per chunk with about 10–15% overlap, then tuned it based on retrieval evaluation. We preferred structure-aware chunking, so headings and logical sections could override the fixed size when necessary.”**

### Why 500–700 tokens?

It gives a reasonable balance:

```text
Too small
   ↓
Not enough context
   ↓
Too large
   ↓
Irrelevant information + more LLM tokens
```

Around **500–700 tokens** usually gives enough context for technical or enterprise content while keeping retrieval reasonably focused.

### Example

```text
Document
   ↓
Section: Failure Analysis
   ↓
~600 tokens
   ↓
Chunk 1
   ↓
~600 tokens
   ↓
Chunk 2
```

With overlap:

```text
Chunk 1: [A B C D E]
                 ↓
Chunk 2:       [D E F G H]
```

The overlap helps preserve context between chunks.

### But don't say "500–700 is always optimal"

This is important in an interview.

Chunk size depends on:

* document type
* content structure
* query complexity
* embedding model
* retrieval performance
* LLM context window

So we **evaluate and tune**, rather than choosing a number blindly.

### 🎯 Strong interview answer

> **“We initially used roughly 500–700 tokens per chunk with around 10–15% overlap. The goal was to balance context and retrieval precision. We also used structure-aware boundaries so we wouldn't split important sections unnecessarily. We then tuned the chunk size using retrieval metrics such as relevance, recall, and downstream answer quality rather than assuming one chunk size works for every document.”**

### Easy memory trick

**500–700 tokens → enough context**
**10–15% overlap → preserve context**
**Evaluate → tune**
