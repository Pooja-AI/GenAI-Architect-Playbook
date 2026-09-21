## What is Faithfulness?

**Faithfulness measures whether the LLM's answer is supported by the context/evidence that was provided to it.**

In simple terms:

> **“Did the LLM stay faithful to the evidence, or did it invent something?”**

### CWD example

Suppose the Worker retrieves this from ServiceNow:

```text
INC1001
Status: Open
Priority: High
Description: Network connectivity issue
```

The LLM responds:

> **“INC1001 is an open, high-priority network connectivity incident.”**

✅ **Faithful** — every factual claim is supported by the evidence.

But if it responds:

> **“INC1001 is a critical database failure caused by a hardware problem.”**

❌ **Not faithful** — the evidence doesn't contain those facts.

---

## How do I measure it?

I break the answer into factual claims and compare each claim against the retrieved evidence.

```text id="qf7m2k"
LLM Answer
    ↓
Extract factual claims
    ↓
Compare claims with evidence
    ↓
Supported?
 ├── Yes → Faithful
 └── No  → Unsupported
```

For example:

```text id="4m9k1a"
5 factual claims
4 supported by evidence

Faithfulness ≈ 4 / 5 = 80%
```

In practice, I can use automated evaluators/LLM-as-judge methods, plus deterministic validation for critical fields.

---

## Faithfulness vs Context Precision vs Context Recall

These three are easy to confuse:

| Metric                | Question                                            |
| --------------------- | --------------------------------------------------- |
| **Context Precision** | Is the retrieved context mostly relevant?           |
| **Context Recall**    | Did we retrieve enough of the relevant information? |
| **Faithfulness**      | Did the LLM answer based on that evidence?          |

Example:

```text
User
 ↓
RAG retrieves relevant evidence
 ↓
Context Precision / Recall
 ↓
LLM generates answer
 ↓
Faithfulness check
```

### Important example

Suppose RAG retrieves the correct ServiceNow incident:

```text
Status = Open
Priority = High
```

But the LLM says:

> “The incident is resolved.”

Then:

* Retrieval relevance → ✅
* Context recall → potentially ✅
* **Faithfulness → ❌**

The problem occurred during **generation**, not retrieval.

---

## Faithfulness ≠ factual accuracy

This is an important interview distinction.

Suppose the retrieved document incorrectly says:

```text
INC1001 → Status: Resolved
```

The LLM says:

> “INC1001 is resolved.”

The answer is **faithful to the retrieved context**, even if the underlying document is wrong.

Therefore:

> **Faithfulness checks whether the answer is supported by the provided evidence. Factual accuracy checks whether the evidence itself is correct according to the source of truth.**

For critical CWD data, I validate against authoritative systems such as **ServiceNow or Salesforce**.

---

## How I improve faithfulness in CWD

```text id="b6h3zq"
Trusted Sources
      ↓
RAG / MCP
      ↓
Relevant Evidence
      ↓
Grounded Prompt
      ↓
Structured Output
      ↓
Claim/Evidence Validation
      ↓
Final Answer
```

I also instruct the model:

> “Answer only using the provided evidence. If evidence is insufficient, do not guess.”

And if the validation detects an unsupported claim:

```text id="p0x7dy"
Unsupported claim
      ↓
Regenerate with evidence
      ↓
If still unsupported
      ↓
Abstain
```

### Interview-ready answer

> **“Faithfulness measures whether the claims in the LLM response are supported by the retrieved evidence. In CWD, I compare generated claims against RAG or MCP evidence and flag unsupported claims. For example, if ServiceNow says an incident is Open and High priority, the response should not claim it is Resolved or caused by a database failure. I use structured outputs, evidence or citation mapping, grounding evaluation, and deterministic validation for critical fields. Faithfulness tells me whether the model stayed true to the evidence; factual accuracy additionally requires checking that evidence against the system of record.”**

### Easy memory

**Faithfulness = Evidence → Answer → Are the claims supported?**
