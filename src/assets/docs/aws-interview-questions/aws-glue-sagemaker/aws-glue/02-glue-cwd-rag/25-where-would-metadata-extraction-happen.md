## Where would metadata extraction happen?

It depends on the type of metadata, but in CWD I would mainly handle it during the **document ingestion/preprocessing pipeline**.

```text id="8bpm5a"
Document
   ↓
S3
   ↓
Document Extraction
   ↓
Glue ETL
   ├── Content metadata
   ├── Business metadata
   └── ACL metadata
   ↓
OpenSearch
```

### Examples

**Document metadata**

* filename
* document ID
* page number
* created/modified date
* document type

**Business metadata**

* customer ID
* department
* product
* region

**Security metadata**

* owner
* allowed groups
* ACL/entitlements

### Important distinction

```text
PDF / Image
   ↓
Textract / document parser
   ↓
Extract text + structural information
   ↓
Glue ETL
   ↓
Normalize + enrich metadata
   ↓
OpenSearch
```

So, **document content/structure extraction** can happen with a document parser/Textract, while **metadata normalization, enrichment, and mapping** can happen in Glue.

### Interview answer

> “I would extract document-level and structural metadata during document ingestion, using a parser or Textract for complex documents, and then use Glue to normalize and enrich the metadata. The final metadata, including business and ACL attributes, would be stored with each chunk in OpenSearch.”

**Memory:**
**Extract → Normalize → Enrich → Attach to Chunk → Index**
