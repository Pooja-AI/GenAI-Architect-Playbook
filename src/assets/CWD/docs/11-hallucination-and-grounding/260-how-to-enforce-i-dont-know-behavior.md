## How do you enforce “I don't know” behavior?

I **don't rely only on the prompt**. In a production CWD system, I enforce “I don't know” behavior using **evidence thresholds + structured output + validation + abstention logic**.

### CWD flow

```text id="0a7f9k"
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
RAG / MCP
 ↓
Evidence Validation
 ↓
Is evidence sufficient?
 ├── YES → LLM → Validate → Answer
 │
 └── NO  → Abstain → "I don't know"
```

### 1. Define an explicit abstention rule

The Worker provides the LLM only with trusted evidence and instructs:

```text id="r5q1t8"
Use only the provided evidence.

If the evidence does not support the answer,
do not infer or guess.

Return:
answerable = false
```

### 2. Use structured output

Instead of allowing free-form text:

```python id="z8k2m4"
class GroundedResponse(BaseModel):
    answer: str
    answerable: bool
    evidence_ids: list[str]
    reason: str | None
```

Example when evidence is missing:

```json id="v6m3q2"
{
  "answer": "I don't have enough information to confirm the root cause.",
  "answerable": false,
  "evidence_ids": [],
  "reason": "No authoritative RCA evidence was retrieved."
}
```

### 3. Apply an evidence/relevance threshold

For example:

```text id="2h7p4c"
Retrieved evidence
      ↓
Relevance / grounding check
      ↓
Above threshold?
 ├── Yes → Generate answer
 └── No  → Abstain
```

The exact threshold should be **validated through evaluation**, not arbitrarily chosen.

### 4. Validate the answer after generation

Suppose ServiceNow says:

```text
INC1001 → Network issue
```

but the LLM generates:

> "The outage was caused by a database failure."

A grounding validator detects that the claim isn't supported.

```text id="j3x9w1"
LLM answer
   ↓
Claim/evidence check
   ↓
Unsupported claim
   ↓
Reject / regenerate / abstain
```

### 5. Give the Coordinator an explicit decision

I can make the Coordinator handle the result:

```python id="q7c4n1"
if not result["answerable"]:
    return {
        "final_response":
        "I don't have sufficient evidence to answer this."
    }
```

This is important because **the LLM should not be the only component deciding whether it knows something**.

### 6. Use authoritative sources

For CWD, if RAG has insufficient evidence:

```text id="u4n8p2"
RAG → insufficient
       ↓
MCP → ServiceNow / Salesforce
       ↓
Evidence available?
       ↓
Yes → Answer
No  → Abstain
```

For current incident status, I would prefer ServiceNow's authoritative data over an old document.

---

## Interview-ready answer

> **“I enforce ‘I don't know’ behavior through multiple controls rather than relying only on prompting. First, I define an evidence requirement: the model can answer only when sufficient authorized evidence is available from RAG or MCP. I use structured output with an explicit `answerable` flag and evidence references. I then validate the generated answer against the retrieved evidence. If the evidence is missing, below the validated relevance threshold, or the answer contains unsupported claims, I reject or regenerate it. If we still cannot establish the answer from an authoritative source, the system abstains and returns a controlled ‘I don't have sufficient information’ response. This makes abstention an application-level behavior, not just an instruction in the prompt.”**

### Easy memory

**Prompt → Evidence → Structured output → Validate → Reject unsupported claims → Abstain.**

**Strong interview line:**

> **“I don't trust the LLM to decide when it doesn't know; I enforce abstention in the application workflow.”**
