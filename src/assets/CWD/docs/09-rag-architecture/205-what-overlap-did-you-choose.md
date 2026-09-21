## What overlap did you choose?

For CWD, you can explain:

> **“We initially used around 10–15% overlap between chunks, and then tuned it based on retrieval evaluation.”**

### Example

If a chunk is **600 tokens**:

```text
Chunk 1: 500 tokens
Chunk 2:       100-token overlap + 500 new tokens
```

So the end of Chunk 1 is repeated at the beginning of Chunk 2.

```text
Chunk 1
[A B C D E F]
        ↓
Chunk 2
      [E F G H I J]
       ↑
    overlap
```

### Why use overlap?

Without overlap, important context can be split:

```text
Chunk 1 → "The failure occurred because..."
Chunk 2 → "...the cooling module overheated."
```

With overlap, the relationship is more likely to remain available during retrieval.

### Why not use too much overlap?

Too much overlap causes:

* duplicate information
* larger index size
* more embedding/storage cost
* redundant retrieved context
* more LLM tokens

### 🎯 Strong interview answer

> **“We initially used about 10–15% overlap. For a 600-token chunk, that is roughly 60–90 tokens of overlap. The purpose is to preserve context across chunk boundaries. We avoided excessive overlap because it increases duplicate content, storage, retrieval noise, and token usage. We ultimately tune the overlap based on retrieval evaluation.”**

**Memory trick:**
**Overlap = preserve context, but don't duplicate too much.**

Yes. For the interview, mention the **Python library** you used for chunking.

## What overlap did you choose?

> **“We initially used around 10–15% overlap. For a 600-token chunk, that's roughly 60–90 tokens. We implemented chunking using libraries such as LangChain's text splitters, with structure-aware splitting where possible.”**

### Python example — LangChain

```python
from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=600,
    chunk_overlap=90,   # 15%
    separators=["\n\n", "\n", ". ", " ", ""]
)

chunks = splitter.split_text(document_text)
```

### Why `RecursiveCharacterTextSplitter`?

It tries to split at the **largest meaningful boundary first**:

```text
Paragraph
   ↓
Sentence
   ↓
Word
   ↓
Character
```

So it avoids unnecessarily breaking content at arbitrary positions.

### For enterprise documents

I would describe the CWD approach as:

```text
Document
   ↓
PyMuPDF / python-docx
   ↓
Text + Metadata
   ↓
LangChain RecursiveCharacterTextSplitter
   ↓
600-token-ish chunks
   ↓
10–15% overlap
   ↓
Embeddings
   ↓
Azure AI Search
```

For PDFs, for example:

```python
import fitz  # PyMuPDF

doc = fitz.open("manual.pdf")

text = "\n".join(page.get_text() for page in doc)
```

Then:

```python
chunks = splitter.split_text(text)
```

### 🎯 Interview answer

> **“We used LangChain's `RecursiveCharacterTextSplitter` for chunking. We started around 500–700 tokens with roughly 10–15% overlap. The splitter prioritizes paragraph and sentence boundaries before smaller boundaries, which helps preserve semantic context. We then tuned chunk size and overlap using retrieval and answer-quality evaluation.”**

**Libraries to remember:**

* **LangChain** → `RecursiveCharacterTextSplitter`
* **PyMuPDF (`fitz`)** → PDF text extraction
* **python-docx** → Word document extraction
* **Azure AI Search** → indexing and retrieval
