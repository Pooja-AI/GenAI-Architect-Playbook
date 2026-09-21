## How do you ground responses?

**Grounding means making the LLM generate answers based on trusted enterprise data instead of its own assumptions or general knowledge.**

In **CWD**, I ground responses mainly using **RAG + MCP**.

### CWD flow

```text
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ├── RAG → Azure AI Search → trusted documents
  │
  └── MCP → Salesforce / ServiceNow → live enterprise data
                ↓
        Validate + Filter data
                ↓
          LLM generates answer
                ↓
        Grounding / validation
                ↓
          Final response
```

### 1. Retrieve trusted data

For example, user asks:

> "Give me a briefing for customer C12345."

The Workers retrieve actual data:

```text
Customer Worker → Salesforce
Incident Worker → ServiceNow
Document Worker → Azure AI Search
```

The LLM does **not** invent customer information.

### 2. Use RAG for document-based knowledge

For SharePoint/M365 or other enterprise documents:

```text
Query
 ↓
Hybrid Search
 ↓
BM25 + Vector Search
 ↓
Semantic Reranking
 ↓
ACL/Metadata Filtering
 ↓
Top relevant chunks
 ↓
LLM
```

I pass only the relevant, authorized chunks to the LLM.

### 3. Use MCP for authoritative live data

For transactional information, I prefer MCP tools.

Example:

```python
result = await mcp_client.call_tool(
    "get_incidents",
    {"customer_id": "C12345"}
)
```

The MCP server retrieves the actual ServiceNow data.

So if ServiceNow says:

```json
{
  "open_incidents": 2,
  "incidents": ["INC1001", "INC1002"]
}
```

the LLM should answer based on those values rather than guessing.

### 4. Validate before sending to the LLM

I validate:

* Required fields
* Data types/schema
* Customer ID
* Authorization/ACL
* Tool response status
* Business rules
* Data freshness where applicable

For example:

```text
ServiceNow response
       ↓
Schema validation
       ↓
Authorization check
       ↓
Business validation
       ↓
LLM context
```

### 5. Use grounded prompting

I explicitly instruct the model:

```text
Answer only using the provided enterprise context.

Do not invent facts.

If the required information is not available,
say that there is insufficient information.
```

### 6. Verify the generated answer

After generation, I can perform a grounding check:

```text
LLM Response
     ↓
Claim extraction
     ↓
Compare claims with retrieved evidence
     ↓
Supported? ── Yes → Return
     │
     No
     ↓
Regenerate / Abstain
```

For example, if the retrieved data says **2 open incidents**, but the LLM says **5**, the response should be rejected rather than returned.

### Interview-ready answer

> **“I ground responses by ensuring the LLM is working from authoritative enterprise data rather than relying on its internal knowledge. In CWD, Workers retrieve trusted information through RAG from Azure AI Search or through MCP tools such as Salesforce and ServiceNow. Before the data reaches the LLM, I apply authorization, ACL filtering, schema and business validation. I then use a grounded prompt that tells the model to answer only from the supplied evidence and abstain when evidence is missing. Finally, I validate the generated response for grounding and unsupported claims. This gives us defense-in-depth against hallucination.”**

### Easy memory

**Ground = Retrieve → Authorize → Validate → Generate → Verify**

And the key interview line:

> **“I don't ask the LLM to be the source of truth; I make enterprise systems and retrieved evidence the source of truth.”**
