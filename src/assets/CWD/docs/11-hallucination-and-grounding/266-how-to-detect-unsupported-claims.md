## How do you detect unsupported claims?

**I detect unsupported claims by comparing each factual claim in the LLM response against the trusted evidence retrieved through RAG or MCP.**

The key idea is:

> **Every important factual claim should have supporting evidence. If we cannot find evidence, we treat the claim as unsupported.**

### CWD flow

```text
RAG / MCP
   ↓
Trusted Evidence
   ↓
LLM Response
   ↓
Claim Extraction
   ↓
Claim ↔ Evidence Matching
   ↓
Supported?
 ├── YES → Keep claim
 └── NO  → Reject / Regenerate / Abstain
```

### Example

Suppose ServiceNow returns:

```text
INC1001
Status: Open
Priority: High
Description: Network connectivity issue
```

LLM generates:

> “INC1001 is a high-priority open incident caused by a database failure.”

Break the response into claims:

```text
Claim 1 → INC1001 exists
Claim 2 → Status = Open
Claim 3 → Priority = High
Claim 4 → Cause = Database failure
```

Then compare:

| Claim            | Evidence    | Result        |
| ---------------- | ----------- | ------------- |
| INC1001 exists   | ServiceNow  | ✅ Supported   |
| Status = Open    | ServiceNow  | ✅ Supported   |
| Priority = High  | ServiceNow  | ✅ Supported   |
| Database failure | No evidence | ❌ Unsupported |

The final claim should be removed/rejected or the answer regenerated.

### How I implement it

#### 1. Require evidence IDs

I can ask the model to return structured output:

```json
{
  "claims": [
    {
      "text": "INC1001 is open.",
      "evidence_ids": ["E1"]
    },
    {
      "text": "INC1001 is high priority.",
      "evidence_ids": ["E1"]
    }
  ]
}
```

If a claim has no evidence ID:

```text
evidence_ids = []
```

I flag it as unsupported.

#### 2. Evidence entailment check

For each claim:

```text
Claim
 ↓
Retrieved evidence
 ↓
Entailment / grounding evaluator
 ↓
SUPPORTED / UNSUPPORTED / UNCERTAIN
```

For example:

```text
Evidence:
"INC1001 is an open high-priority incident."

Claim:
"INC1001 is open."

→ SUPPORTED
```

But:

```text
Claim:
"INC1001 was caused by a database failure."

→ UNSUPPORTED
```

#### 3. Use deterministic validation for structured facts

For critical fields, I don't depend only on an LLM evaluator.

```python
if response.status != servicenow.status:
    raise ValidationError("Unsupported status")

if response.priority != servicenow.priority:
    raise ValidationError("Unsupported priority")
```

This is especially useful for:

* Customer ID
* Incident ID
* Status
* Priority
* Dates
* Amounts
* Counts
* Transaction IDs

#### 4. Validate citations

If the response says:

> “INC1001 is a database outage [E1]”

I verify that **E1 actually contains evidence for database outage**.

If it doesn't:

```text
Invalid citation
      ↓
Unsupported claim
      ↓
Reject / regenerate
```

### What happens after detection?

```text
Unsupported claim
       ↓
Can we retrieve better evidence?
       ↓
    YES → Retrieve again → Regenerate
       ↓
    NO
       ↓
Abstain / remove unsupported claim
```

The system should **never fill the gap with a guess**.

### Production metrics

I monitor:

* Unsupported claim rate
* Faithfulness/groundedness
* Citation correctness
* Factual accuracy
* Abstention rate
* Retrieval relevance
* Retrieval recall
* Regeneration rate

### Interview-ready answer

> **“I detect unsupported claims by breaking the generated response into factual claims and checking each claim against the evidence retrieved through RAG or MCP. I use structured outputs with evidence IDs, citation validation, and grounding or entailment evaluation. For critical structured fields such as incident status, priority, IDs, dates, and amounts, I use deterministic validation against the system of record. If a claim isn't supported, I reject or regenerate the response; if sufficient evidence still isn't available, I make the system abstain. This prevents the LLM from turning missing evidence into fabricated facts.”**

### Easy memory

**Claim → Evidence → Match → Supported? → Keep; otherwise Reject/Regenerate/Abstain.**
