## How do you validate factuality?

**Factuality validation means checking whether the LLM's claims are actually supported by trusted enterprise data.**

In CWD, I use **grounding checks + source validation + business-rule validation**, not just the LLM's confidence.

### CWD flow

```text id="6z3x8c"
RAG / MCP
    ↓
Trusted Evidence
    ↓
LLM generates answer
    ↓
Claim Extraction
    ↓
Evidence / Source Check
    ↓
Business Validation
    ↓
 ┌───────────────┐
 │ Facts supported? │
 └───────┬───────┘
      YES│       NO
         ↓        ↓
      Return    Reject /
                Regenerate /
                Abstain
```

### 1. Compare claims against evidence

Suppose ServiceNow returns:

```json id="g8k2m1"
{
  "incident_id": "INC1001",
  "status": "Open",
  "priority": "High"
}
```

LLM generates:

> "INC1001 is a high-priority open incident."

That's supported.

But if it generates:

> "INC1001 is a critical database outage."

The **database outage** claim isn't supported by the evidence, so I reject or regenerate the response.

---

### 2. Validate structured data directly

For factual fields, I prefer deterministic validation.

```python id="p5v7n2"
if answer.incident_id != source.incident_id:
    raise ValidationError("Unsupported incident")

if answer.status != source.status:
    raise ValidationError("Incorrect status")
```

For important enterprise facts, I don't ask the LLM to determine whether its own statement is true.

---

### 3. Check source authority

Different facts have different authoritative sources:

```text id="k4q8r1"
Current incident status → ServiceNow
Customer information    → Salesforce
Enterprise documents    → SharePoint / Search index
Financial/operational data → System of record
```

If a document says one thing but the live system of record says another, I use the defined source-of-truth/business rule.

---

### 4. Use RAG evaluation

For the RAG pipeline, I monitor metrics such as:

* **Context relevance** — Did we retrieve the right information?
* **Context recall** — Did we retrieve the necessary evidence?
* **Faithfulness / groundedness** — Is the answer supported by retrieved context?
* **Answer relevance** — Did the answer actually address the question?

Tools such as **RAGAS** can be used for automated evaluation, while curated golden datasets provide regression testing.

---

### 5. Use a golden test set

For CWD, I can maintain examples like:

```text id="y2f6m9"
Question:
"What are the open incidents for C12345?"

Expected:
INC1001, INC1002

Retrieved evidence:
ServiceNow records

Expected behavior:
Answer only using those records
```

Then run these tests whenever I change:

* prompts
* models
* retrieval configuration
* chunking
* embeddings
* reranking
* Worker logic

---

### 6. Handle unsupported claims

If factuality validation fails:

```text id="u9c3d7"
Unsupported claim
      ↓
Reject response
      ↓
Retry / regenerate with evidence
      ↓
Still unsupported?
      ↓
Abstain
```

For example:

> **“I couldn't verify that information from the available enterprise sources.”**

instead of inventing an answer.

---

## Interview-ready answer

> **“I validate factuality by checking the generated claims against authoritative enterprise evidence. In CWD, RAG provides document evidence and MCP provides live system-of-record data such as Salesforce or ServiceNow. After generation, I validate structured fields, compare important claims against the retrieved evidence, and apply business rules for source authority. At the evaluation level, I use metrics such as context relevance, recall, faithfulness or groundedness, and answer relevance, along with golden datasets and regression tests. If a claim isn't supported, I reject or regenerate the response, and if evidence is still insufficient, I make the system abstain.”**

### Easy memory

**Factuality = Source of truth → Retrieve evidence → Generate → Compare claims → Validate → Reject/Abstain.**

**Key interview line:**

> **“For critical facts, I validate against the source of truth rather than trusting the LLM's confidence.”**
