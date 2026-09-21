## How do you handle tables?

In CWD, we **don't treat tables like normal paragraphs** because row/column relationships can be lost during normal chunking.

### Simple pipeline

```text
PDF / Word / Excel
       ↓
Table Detection
       ↓
Extract rows + columns
       ↓
Convert to structured text
       ↓
Add metadata
       ↓
Chunk / Embed
       ↓
Azure AI Search
```

### Example

Original table:

| Product | Failure     | Root Cause          |
| ------- | ----------- | ------------------- |
| A100    | Overheating | Cooling failure     |
| B200    | Power issue | Voltage fluctuation |

Instead of flattening it into meaningless text, we can represent each row as:

```text
Product: A100
Failure: Overheating
Root Cause: Cooling failure
```

This preserves the relationship between the columns.

### Python libraries

Depending on the document type:

* **PyMuPDF (`fitz`)** → PDF extraction/table detection
* **pdfplumber** → PDF tables
* **Camelot** → structured PDF tables
* **python-docx** → Word tables
* **openpyxl / pandas** → Excel tables

Example with `pdfplumber`:

```python id="u8zj4s"
import pdfplumber

with pdfplumber.open("report.pdf") as pdf:
    for page in pdf.pages:
        tables = page.extract_tables()

        for table in tables:
            for row in table:
                print(row)
```

Then convert the table into structured text before embedding:

```python id="i4n8q0"
def row_to_text(headers, row):
    return "\n".join(
        f"{h}: {v}"
        for h, v in zip(headers, row)
        if v
    )
```

### Important for RAG

For **small tables**, converting rows into structured text works well.

For **large or highly relational tables**, I would avoid embedding the entire table blindly. Instead, store the structured data in a database and use **SQL/API/MCP retrieval** when exact calculations or filtering are required.

For example:

```text
"What was the failure rate for A100?"
             ↓
       SQL / MCP query
             ↓
        Exact result
```

rather than relying only on vector similarity.

### 🎯 Strong interview answer

> **“We handle tables separately because normal text chunking can destroy row-column relationships. We extract the table using libraries such as PyMuPDF, pdfplumber, or Camelot, convert small tables into structured text with headers and row values, and then index them with metadata. For large or transactional tables where exact filtering or calculations are required, we keep the data structured and use SQL or MCP/API retrieval instead of relying only on embeddings.”**

**Memory trick:**
**Small table → Structure → Embed**
**Large/exact table → Database → Query**
