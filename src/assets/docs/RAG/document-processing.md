# Document Processing for RAG

Before chunking and embedding, raw documents must be parsed and cleaned.

## Steps
1. **Ingestion** — load files from source (PDF, DOCX, HTML, Confluence, S3, etc.).
2. **Parsing/Extraction** — convert to plain text or structured text, extracting tables, headers, and images where relevant.
3. **Cleaning** — remove boilerplate (headers/footers, navigation menus), fix encoding issues, normalize whitespace.
4. **Structure preservation** — retain metadata like section headings, page numbers, and source URLs for citation and structure-aware chunking.
5. **Metadata extraction** — capture author, date, document type, access permissions for filtering and security trimming.
6. **Chunking** — split cleaned, structured text into retrieval-sized chunks.
7. **Embedding & indexing** — convert chunks to vectors and store them.

## Common Pitfalls
- OCR errors in scanned PDFs degrading text quality.
- Losing table structure when converting to plain text.
- Failing to capture source metadata needed for citations or access control.
- Not deduplicating near-identical documents, bloating the index.
