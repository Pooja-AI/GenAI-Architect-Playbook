## How does RAG improve grounding?

**RAG improves grounding by giving the LLM relevant, trusted enterprise information as context before it generates the answer.**

Without RAG, the LLM may rely on its pretrained knowledge and potentially guess.
With RAG, the model is instructed to answer using **retrieved evidence**.

### CWD example

Suppose the user asks:

> **“What are the current open incidents for customer C12345?”**

```text id="9v0g7a"
User
  ↓
Coordinator
  ↓
IT Delegator
  ↓
Incident Worker
  ↓
RAG / MCP
  ↓
Azure AI Search / ServiceNow
  ↓
Relevant + authorized data
  ↓
LLM
  ↓
Grounded response
```

### How RAG helps

#### 1. Retrieves relevant information

Instead of giving the LLM thousands of enterprise documents, RAG retrieves only the relevant chunks.

```text
User Query
   ↓
Embedding + BM25
   ↓
Hybrid Search
   ↓
Semantic Reranking
   ↓
Top-K relevant chunks
```

For example:

```text
INC1001 → Database connectivity issue → Open
INC1002 → Network issue              → Resolved
```

The LLM receives this evidence.

#### 2. Provides evidence to the LLM

The prompt can contain:

```text
Context:
- INC1001 is currently Open.
- INC1002 is Resolved.

Question:
What are the current open incidents?
```

The expected answer is:

> “INC1001 is currently open.”

The model doesn't need to invent the incident status.

#### 3. Reduces hallucination

Suppose the model internally "knows" something different, but the retrieved enterprise data says:

```text
Priority = High
Status = Open
```

We instruct:

```text
Answer only from the retrieved context.
Do not make assumptions.
If information is missing, say so.
```

This makes the retrieved data the **source of truth** for that response.

#### 4. ACL filtering makes grounding secure

In CWD, I don't simply retrieve relevant documents.

I retrieve:

```text
Relevant
+
Authorized
```

For example:

```text
Query
 ↓
Azure AI Search
 ↓
Metadata filtering
 ↓
ACL filtering
 ↓
Authorized chunks
 ↓
LLM
```

This prevents the LLM from being grounded on information the user isn't allowed to see.

#### 5. RAG supports citations/evidence

I can retain metadata such as:

```json id="5kn0ll"
{
  "document_id": "DOC123",
  "chunk_id": "CH45",
  "source": "SharePoint",
  "content": "Customer contract expires in December..."
}
```

Then the answer can be traced back to the source.

---

### RAG vs MCP for grounding

In CWD, both help grounding, but they serve different data patterns:

| Mechanism | Best for                        | Example                       |
| --------- | ------------------------------- | ----------------------------- |
| **RAG**   | Documents / knowledge           | SharePoint, manuals, policies |
| **MCP**   | Live enterprise operations/data | Salesforce, ServiceNow        |
| **LLM**   | Reasoning/summarization         | Generate final briefing       |

So for a Customer Briefing:

```text id="9wz9vf"
Salesforce ──MCP──→ Customer Worker
                         ↓
SharePoint ──RAG──→ Document Worker
                         ↓
ServiceNow ──MCP──→ Incident Worker
                         ↓
                    Coordinator
                         ↓
                 Grounded Summary
```

### Interview-ready answer

> **“RAG improves grounding by retrieving relevant and authorized enterprise information and providing that evidence to the LLM as context. In CWD, for example, a Worker can use Azure AI Search with hybrid search, semantic ranking, and ACL filtering to retrieve relevant customer documents. The LLM is then instructed to answer only from that retrieved context and abstain when evidence is missing. We can also retain source metadata for traceability and evaluate retrieval relevance and answer faithfulness. So RAG doesn't eliminate hallucination, but it significantly reduces unsupported generation by grounding the model in enterprise evidence.”**

### Easy memory

**RAG = Retrieve the right evidence → Give it to the LLM → Generate from evidence → Verify the answer.**
