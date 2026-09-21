## How do you handle images?

In CWD, we don't treat images as plain text. We use **multimodal processing** to extract useful information from images and make it available to the RAG/agent workflow.

### Simple flow

```text
PDF / Document / Image
        ↓
   Image Detection
        ↓
 OCR / Vision Model
        ↓
 Text + Image Description
        ↓
 Metadata
        ↓
 Chunk / Embed
        ↓
 Azure AI Search
        ↓
 RAG / Multimodal LLM
```

### 1. OCR for text inside images

For example:

```text
Image
  ↓
OCR
  ↓
"Error Code: E102"
"Temperature: 95°C"
```

We can use:

* **Azure AI Document Intelligence**
* **Azure Computer Vision**
* **Tesseract** for simpler OCR scenarios

### 2. Vision model for image understanding

If the image contains a diagram, equipment image, or failure image, OCR alone isn't enough.

We can use a vision model such as **GPT-4o / Azure OpenAI vision** to generate structured information:

```text
Image
 ↓
Vision Model
 ↓
Description:
"Cooling module shows visible damage near the connector."
```

### 3. Store image metadata

We preserve:

```text
document_id
page_number
image_id
source
caption
ACL
```

The original image can remain in Blob Storage/document storage while the searchable description and metadata go into Azure AI Search.

### 4. For multimodal CWD use cases

For example, in **Intelligent Failure Analysis**:

```text
Failure Image
     ↓
Vision Model
     ↓
Visual Findings
     +
Historical Failure Data
     ↓
RAG
     ↓
Agent/Worker
     ↓
Root Cause Analysis
```

So the agent can combine **visual evidence + enterprise knowledge**.

### 🎯 Strong interview answer

> **“For images, we use a combination of OCR and vision models depending on the content. OCR extracts text from images, while a vision model understands visual information such as diagrams or equipment defects. We convert the useful information into structured text and metadata, preserve the original image reference, and make the extracted information searchable for RAG. For multimodal use cases like failure analysis, the Worker can combine image findings with enterprise knowledge to generate a grounded analysis.”**

### Easy memory trick

**Image → OCR for text + Vision for meaning → Metadata → RAG**

**OCR = What does the image say?**
**Vision = What does the image show?**
