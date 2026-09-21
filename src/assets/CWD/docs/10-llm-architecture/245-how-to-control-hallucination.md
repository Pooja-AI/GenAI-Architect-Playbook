## How do you control hallucination?

In CWD, I don't rely on the LLM prompt alone. I use **multiple layers of grounding, validation, and access control**.

### CWD hallucination-control flow

```text id="q8v3kp"
User Request
     ↓
Intent + Entity Extraction
     ↓
RAG / MCP
     ↓
Authorized Enterprise Data
     ↓
Relevant Context
     ↓
LLM
     ↓
Grounding / Validation
     ↓
Response
```

### 1. Ground the LLM with RAG

For enterprise knowledge, I retrieve information from trusted sources:

* SharePoint
* Enterprise knowledge bases
* ServiceNow knowledge
* Product documentation
* Other approved enterprise sources

```text id="w2r6mf"
Question
   ↓
Azure AI Search
   ↓
Relevant chunks
   ↓
LLM
```

The LLM should answer from retrieved evidence instead of inventing information.

---

### 2. Use MCP for real-time data

For information that changes frequently, I don't rely on old indexed documents.

For example:

```text id="a4n7cs"
"How many open incidents does C123 have?"
              ↓
        ServiceNow MCP
              ↓
        Current data
```

This is important because:

> **RAG is for enterprise knowledge; MCP/API is for current transactional truth.**

---

### 3. Use hybrid retrieval + reranking

I improve the quality of context using:

```text id="z8c2pw"
BM25 + Vector Search
        ↓
Semantic Ranking
        ↓
Relevant chunks
        ↓
LLM
```

This reduces the chance that irrelevant information becomes the basis for an answer.

---

### 4. Enforce ACL filtering

I make sure the LLM only receives information the user is authorized to see.

```text id="e3j7ms"
Entra Identity
      ↓
ACL / Metadata Filter
      ↓
Azure AI Search
      ↓
Authorized Context
      ↓
LLM
```

The LLM **does not decide authorization**.

---

### 5. Use prompts that require grounding

For example, the Worker can be instructed:

```text id="7qv4rm"
Answer using only the supplied enterprise context.

If the required information is not present,
say that the information is unavailable.

Do not invent facts, IDs, dates, or metrics.
```

This helps, but prompt instructions alone are not enough.

---

### 6. Validate the response

After generation, I can validate:

* Does the answer contain unsupported claims?
* Are citations/source references present?
* Does it contradict retrieved evidence?
* Are required fields present?
* Is the answer relevant to the question?

For important RAG workflows, I use evaluation metrics such as:

* **Faithfulness**
* **Answer relevancy**
* **Context precision**
* **Context recall**

RAGAS can be used for this evaluation.

---

### 7. Validate Worker/tool results

Suppose Salesforce returns:

```json
{
  "customer_id": "C123",
  "revenue": 2400000
}
```

The Coordinator shouldn't allow the LLM to arbitrarily change that to `$4M`.

We can validate structured Worker results before aggregation.

```text id="6j3qzt"
Worker
 ↓
Schema Validation
 ↓
Business Validation
 ↓
Coordinator
 ↓
LLM
```

---

### 8. Handle insufficient evidence

This is one of the most important controls.

If retrieval doesn't provide enough evidence:

```text id="j7p4cx"
Question
  ↓
Retrieval
  ↓
No reliable evidence
  ↓
Don't guess
  ↓
"I don't have enough information
to answer reliably."
```

That's much safer than generating a confident but unsupported answer.

---

### 🎯 Strong interview answer

> **“I control hallucination through defense in depth rather than relying only on prompting. For enterprise knowledge, we use RAG with hybrid search, semantic reranking, and ACL filtering. For real-time transactional information such as Salesforce or ServiceNow data, Workers use MCP rather than relying on potentially stale RAG data. We validate Worker outputs and use grounded prompts that require the model to answer from available evidence. We also evaluate faithfulness, context precision, context recall, and answer relevance. If sufficient evidence isn't available, the system should say it doesn't have enough information rather than guess.”**

### Easy memory trick

**Ground → Retrieve → Authorize → Validate → Evaluate → Don't Guess**

Key interview line:

> **“The best hallucination strategy is not asking the LLM to be more careful; it's controlling what evidence it is allowed to reason over.”**
