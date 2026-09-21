## What is Hallucination Rate?

**Hallucination rate measures how often CWD produces responses containing unsupported or factually incorrect claims.**

In simple terms:

> **“How often does the AI make up or state facts that aren't supported by trusted data?”**

### CWD example

User asks:

> **“What are the open incidents for C12345?”**

ServiceNow returns:

```text id="7m3kqp"
INC1001 → Open → High
INC1002 → Open → Medium
```

CWD responds:

> “C12345 has 3 open incidents, including a critical database failure.”

❌ This contains unsupported information.

There are only 2 open incidents, and there is no evidence of a database failure.

---

## How do I calculate it?

A simple response-level metric is:

```text id="v8n4kc"
Hallucination Rate =
Responses with unsupported/incorrect claims
──────────────────────────────────────────
Total evaluated responses
× 100
```

Example:

```text id="q6r2mp"
10,000 responses evaluated
120 contain hallucinated claims

Hallucination Rate =
120 / 10,000 × 100
= 1.2%
```

You can also track **unsupported claim rate** at the claim level.

```text id="p5x8dz"
10,000 factual claims
120 unsupported claims

Unsupported Claim Rate = 1.2%
```

These are related but not identical: one measures **responses**, the other measures **individual claims**.

---

## How do I detect hallucinations in CWD?

```text id="w3m7qa"
RAG / MCP Evidence
       ↓
LLM Response
       ↓
Extract Claims
       ↓
Compare Claims with Evidence
       ↓
Supported?
   ├── YES → Keep
   └── NO  → Reject / Regenerate / Abstain
```

For example:

```text id="r2k6vp"
Evidence:
INC1001 = Open
INC1002 = Open

LLM:
"There are 3 open incidents."

→ Unsupported ❌
```

For critical information, I additionally compare against the **system of record**, such as ServiceNow or Salesforce.

---

## How do I reduce hallucination rate?

In CWD:

```text id="e7p4ns"
Trusted Data
    ↓
RAG / MCP
    ↓
ACL Filtering
    ↓
Relevant Evidence
    ↓
Grounded Prompt
    ↓
Structured Output
    ↓
Claim Validation
    ↓
Final Response
```

Key controls:

* RAG grounding
* MCP for live enterprise data
* Hybrid search + semantic reranking
* ACL/authorization filtering
* Structured outputs
* Evidence/citation mapping
* Factual validation
* Groundedness/faithfulness evaluation
* Explicit abstention when evidence is insufficient
* Golden test cases and regression testing

### Important point

**You cannot realistically guarantee zero hallucinations just by adding a prompt.**

The production approach is:

> **Prevent → Detect → Validate → Abstain/Recover**

---

## Hallucination rate vs Faithfulness

These are closely related but different.

**Faithfulness:**

> Is this particular response supported by the evidence?

**Hallucination rate:**

> Across many evaluated responses, how frequently do we find unsupported/incorrect claims?

```text id="n5q2fw"
Single response → Faithfulness
Many responses  → Hallucination rate
```

---

## Interview-ready answer

> **“Hallucination rate measures how frequently the CWD system generates unsupported or factually incorrect claims. I calculate it using a validated evaluation dataset by comparing generated claims against RAG evidence and authoritative sources such as Salesforce or ServiceNow. For example, if 120 out of 10,000 evaluated responses contain unsupported claims, the response-level hallucination rate is 1.2%. I reduce it using RAG and MCP grounding, ACL filtering, structured outputs, citation and claim validation, and explicit abstention when evidence is insufficient. I track hallucination rate alongside faithfulness, factual accuracy, and abstention accuracy because simply forcing the model to say ‘I don't know’ can artificially reduce hallucinations.”**

### Easy memory

**Hallucination Rate = “How often does the AI say something unsupported or wrong?”**
