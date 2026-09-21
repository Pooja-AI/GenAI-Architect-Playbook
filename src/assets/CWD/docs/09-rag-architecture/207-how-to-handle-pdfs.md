## How do you handle PDFs?

In CWD, we handle PDFs through a **document extraction → cleaning → chunking → embedding → indexing** pipeline.

### Simple flow

```text
PDF
 ↓
PyMuPDF / pdfplumber
 ↓
Extract text + tables + metadata
 ↓
OCR if scanned
 ↓
Clean / normalize
 ↓
Chunk
 ↓
Embeddings
 ↓
Azure AI Search
 ↓
RAG
```

### Step-by-step

**1. Extract text**

For normal text-based PDFs, we can use **PyMuPDF (`fitz`)**.

```python
import fitz

doc = fitz.open("manual.pdf")

pages = []

for page_num, page in enumerate(doc):
    text = page.get_text()
    pages.append({
        "page": page_num + 1,
        "text": text
    })
```

**2. Handle scanned PDFs**

If the PDF doesn't contain selectable text, we use **OCR** to extract the text from images.

```text
Scanned PDF
    ↓
OCR
    ↓
Text
```

**3. Handle tables separately**

For tables, we can use:

* `pdfplumber`
* `Camelot`
* PyMuPDF table extraction

We preserve the row/column relationships instead of treating the table as normal paragraph text.

**4. Preserve metadata**

For each chunk, we keep information such as:

```text
document_id
file_name
page_number
section
source
ACL
```

This helps with **retrieval, citations, and security filtering**.

**5. Chunk and embed**

```python
chunks = splitter.split_text(page_text)
```

Then generate embeddings and store them in Azure AI Search.

### Important interview point

Don't say **“we just extract all PDF text and embed it.”**

Mention that PDFs can contain:

* normal text
* scanned images
* tables
* headers/footers
* multiple columns
* page-level metadata

So the extraction strategy depends on the PDF structure.

### 🎯 Strong interview answer

> **“For PDFs, we first determine whether the document is text-based or scanned. For text PDFs, we use PyMuPDF or pdfplumber to extract text and tables. For scanned PDFs, we apply OCR. We preserve page and document metadata, handle tables separately, clean the extracted content, then perform structure-aware chunking and generate embeddings. Finally, we index the chunks, vectors, and ACL metadata in Azure AI Search for secure RAG retrieval.”**

**Memory trick:**

**PDF → Extract → OCR if needed → Tables → Metadata → Chunk → Embed → Index**
