In **CWD**, I validate the final response **before returning it to the user**. The important principle is:

> **The LLM generates the response, but deterministic validation checks whether the response is supported, complete, authorized, and consistent with the Worker results.**

### 1. Validate Worker results first

Before generating the final answer, the **Coordinator** checks:

```text
Worker Results
     ↓
Result Validation
     ↓
Aggregation
     ↓
Final Response Generation
```

For example:

```text
CustomerProfileWorker → SUCCESS
SupportHistoryWorker  → SUCCESS
ContractWorker        → SUCCESS
```

The Coordinator verifies that the required results are actually present.

---

### 2. Validate against the execution plan

The Coordinator compares the results with what was originally requested.

For example:

```python
execution_plan = {
    "required_workers": [
        "CustomerProfileWorker",
        "ContractWorker"
    ]
}
```

Then:

```python
if not all_required_results_available(state):
    return "incomplete"
```

This prevents the final LLM from pretending that a missing Worker completed successfully.

---

### 3. Validate the response against source data

Suppose Salesforce returned:

```text
Customer: ABC Corp
Industry: Semiconductor
Revenue: $10M
```

The LLM generates:

> “ABC Corp is a semiconductor company with $10M revenue.”

We can validate important claims against the retrieved/aggregated source data.

For RAG-based responses, we check:

* Groundedness
* Faithfulness
* Retrieved-context relevance
* Citation/source availability
* Unsupported claims

Conceptually:

```text
Sources / Worker Results
          ↓
    Final LLM Response
          ↓
   Grounding Validation
          ↓
    Pass → return
    Fail → regenerate / remove unsupported claim / fail safely
```

---

### 4. Use structured output

I don't let the final LLM freely return arbitrary data when the application needs predictable structure.

For example:

```python
class CustomerBriefing(BaseModel):
    customer_name: str
    customer_summary: str
    support_summary: str | None
    contract_summary: str
    warnings: list[str]
    sources: list[str]
```

Then validate with a schema such as **Pydantic**.

If the LLM returns:

```json
{
    "customer_name": "ABC Corp",
    "contract_summary": "...",
    "warnings": []
}
```

but `support_summary` is required, schema validation catches the problem.

---

### 5. Validate mandatory vs optional information

Suppose:

```text
CustomerProfile → SUCCESS
Contract         → SUCCESS
SupportHistory   → FAILED
```

If SupportHistory is optional, the final response should say something like:

```text
Customer information: available
Contract information: available
Support history: unavailable due to ServiceNow timeout
```

It should **not hallucinate support information**.

This is why the Coordinator needs to know the Worker status.

---

### 6. Validate authorization and sensitive data

Before returning the final response, we also make sure the response doesn't expose information the user isn't authorized to see.

For example:

```text
User
 ↓
Entra ID / authorization
 ↓
Worker data
 ↓
Final response
 ↓
Sensitive-data / policy validation
 ↓
Return response
```

Depending on the enterprise policy, we can check for:

* PII
* Confidential information
* Restricted customer data
* HR data
* Secrets/API keys
* Unauthorized fields

The final LLM should **not be the only security control**.

---

### 7. Validate citations and traceability

For enterprise answers, we want to know:

```text
Final claim
   ↓
Which Worker?
   ↓
Which enterprise system?
   ↓
Which retrieved document/API response?
   ↓
Which request/run?
```

For example:

```text
Customer revenue
   ↓
CustomerProfileWorker
   ↓
Salesforce
   ↓
REQ-123 / run-456
```

This gives us auditability and makes troubleshooting much easier.

---

### 8. Use LLM evaluation metrics

For production monitoring, I would measure:

| Metric                          | What it checks                         |
| ------------------------------- | -------------------------------------- |
| **Groundedness / Faithfulness** | Is the answer supported by evidence?   |
| **Answer relevance**            | Does it answer the user's request?     |
| **Context relevance**           | Was useful information retrieved?      |
| **Completeness**                | Were required results included?        |
| **Citation correctness**        | Do citations support the claims?       |
| **Hallucination rate**          | How often unsupported claims occur     |
| **Task completion**             | Did CWD accomplish the requested task? |
| **Tool-call accuracy**          | Did the correct Workers/tools execute? |

For RAG specifically, we can also track **precision/recall, MRR, and NDCG** for retrieval quality.

---

## Where does this happen in your CWD graph?

Your Coordinator graph can look like:

```text
START
  ↓
Understand Request
  ↓
Select Delegator
  ↓
Create Plan
  ↓
Execute Workers
  ↓
Validate Worker Results
  ↓
Aggregate Results
  ↓
Generate Final Response
  ↓
Validate Final Response
  ├── PASS → END
  ├── REGENERATE → Generate Response
  └── FAIL → Safe/Partial Response
```

Notice the important distinction:

**Worker-result validation** checks whether the underlying data is valid and complete.

**Final-response validation** checks whether the generated answer accurately represents that data.

### Interview-ready answer

> **“In CWD, the Coordinator validates the final response before returning it. First, we validate that all mandatory Worker results are available and consistent with the execution plan. Then the LLM generates the response using only the validated Worker results and retrieved context. We validate the output schema, groundedness, factual consistency, citations, completeness, and authorization/sensitive-data policies. If validation fails, we can regenerate with corrected context or return a controlled partial response. The LLM generates the answer, but deterministic validation and policy controls decide whether it is safe to return.”**

### One line to memorize

> **“We validate the final response for schema, completeness, grounding, source consistency, authorization, and safety before returning it to the user.”**
