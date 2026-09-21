## How do you validate LLM output?

In CWD, I use **multiple layers of validation**. I don't assume that an LLM response is correct just because it is valid JSON.

```text id="5g7m2k"
LLM Output
    ↓
Schema Validation
    ↓
Business Validation
    ↓
Grounding Validation
    ↓
Security Validation
    ↓
Quality / Policy Checks
    ↓
Valid?
 ↙       ↘
YES       NO
 ↓         ↓
Continue  Retry / Repair / Fallback
```

### 1. Schema validation

First, verify the response structure.

For example:

```python id="8p2k6r"
class CustomerResult(BaseModel):
    customer_id: str
    customer_name: str
    status: str
    open_incidents: int
```

Then:

```python id="m5x9q2"
result = CustomerResult.model_validate(llm_response)
```

This catches:

* Missing fields
* Wrong data types
* Invalid formats
* Unexpected fields

---

### 2. Business-rule validation

Valid JSON doesn't mean valid business data.

For example:

```text id="6c4n8v"
open_incidents = -5
```

The JSON is valid, but the business value is not.

So we apply rules such as:

```text
customer_id → valid format
open_incidents → >= 0
status → allowed values
revenue → valid numeric range
```

---

### 3. Grounding validation

For RAG responses, I check whether important claims are supported by retrieved enterprise data.

```text id="2j8r5x"
LLM Answer
    ↓
Compare claims
    ↓
Retrieved Context
    ↓
Supported?
```

For example, if the retrieved evidence says:

```text
Root cause = Cooling fan failure
```

but the LLM says:

```text
Root cause = Power supply failure
```

the answer should be flagged.

Metrics such as **faithfulness, context precision, context recall, and answer relevancy** can be used during evaluation.

---

### 4. Tool/MCP validation

For tool calls:

```text id="9f3k7d"
LLM
 ↓
Tool arguments
 ↓
Schema validation
 ↓
Authorization
 ↓
Business policy
 ↓
MCP Server
 ↓
Enterprise system
```

For example:

```json id="q8x4v1"
{
  "customer_id": "C123"
}
```

We validate the format first, then independently check whether the user is authorized to access `C123`.

**Valid input does not mean authorized input.**

---

### 5. Security validation

I also check for:

* Unauthorized data
* Sensitive information leakage
* Prompt-injection influence
* Unsafe tool actions
* Policy violations

The LLM is **not trusted to make security decisions**.

---

### 6. Retry or fallback

If validation fails:

```text id="r6w2p9"
LLM Output
    ↓
Validation failed
    ↓
Bounded retry / repair
    ↓
Validate again
```

If repeated failures occur for a critical task, I can route to a fallback model or return a controlled error.

---

### 7. Monitor validation failures

I track:

* Schema validation failure rate
* Business-rule failures
* Grounding failures
* Tool-call validation failures
* Retry rate
* Fallback rate
* Unsafe-output rate

This helps identify prompt, model, or retrieval regressions.

---

### 🎯 Strong interview answer

> **“I validate LLM output at multiple levels. First, I validate the structure using JSON Schema or Pydantic. Then I apply business-rule validation, such as valid IDs, ranges, and allowed statuses. For RAG responses, I validate grounding against retrieved enterprise evidence and monitor metrics such as faithfulness and answer relevancy. For MCP tool calls, we validate the arguments and then separately perform authorization and policy checks before execution. If validation fails, we use bounded retry or fallback, and we monitor validation failures as part of production observability.”**

### Easy memory trick

**Schema → Business → Grounding → Security → Retry → Monitor**

Key interview line:

> **“Valid JSON only proves the output is well-formed; it does not prove that the answer is correct, grounded, or authorized.”**
