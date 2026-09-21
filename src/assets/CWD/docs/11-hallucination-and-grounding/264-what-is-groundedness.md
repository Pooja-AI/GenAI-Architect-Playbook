## What is groundedness?

**Groundedness measures how well an LLM's response is supported by reliable evidence or context.**

In simple terms:

> **“Is the answer based on evidence, or did the LLM make something up?”**

### CWD example

Suppose the Incident Worker retrieves from ServiceNow:

```text
INC1001
Status: Open
Priority: High
Description: Network connectivity issue
```

LLM response:

> “INC1001 is a high-priority open incident related to network connectivity.”

✅ **Grounded** — the response is supported by the retrieved evidence.

If the LLM says:

> “INC1001 was caused by a database hardware failure.”

❌ **Not grounded** — there is no evidence supporting that claim.

### How I validate groundedness

```text id="n2x7kc"
RAG / MCP Evidence
       ↓
   LLM Response
       ↓
 Extract Claims
       ↓
Compare Claims ↔ Evidence
       ↓
Grounded?
 ├── YES → Return response
 └── NO  → Reject / Regenerate / Abstain
```

A conceptual metric is:

```text
Groundedness =
Supported claims / Total factual claims
```

For example:

```text
100 factual claims
95 supported by evidence

Groundedness = 95%
```

### Groundedness vs Faithfulness

They are closely related and are sometimes used interchangeably, but for interviews I would explain the distinction this way:

| Concept              | Meaning                                                                                        |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| **Groundedness**     | Is the response anchored in reliable evidence/context?                                         |
| **Faithfulness**     | Does the response faithfully represent the provided context without adding unsupported claims? |
| **Factual accuracy** | Is the information actually correct according to the source of truth?                          |

So:

```text id="7f2x9k"
Groundedness → Is it anchored in evidence?
Faithfulness  → Did it stay true to that evidence?
Accuracy      → Is the underlying fact actually correct?
```

### CWD architecture

For CWD, I use:

```text id="j8r4wp"
Salesforce / ServiceNow / SharePoint
              ↓
         MCP / RAG
              ↓
      Trusted Evidence
              ↓
             LLM
              ↓
   Grounding Validation
              ↓
      Final Response
```

For critical facts, I prefer **authoritative systems of record** such as Salesforce or ServiceNow rather than relying solely on retrieved documents.

### Interview-ready answer

> **“Groundedness measures whether an LLM response is anchored in reliable evidence rather than generated from unsupported assumptions. In CWD, Workers retrieve evidence through RAG or MCP, and the LLM generates the response from that evidence. We then validate the generated claims against the retrieved context. If claims aren't supported, we reject or regenerate the response, or abstain when evidence is insufficient. For critical facts, we also validate against the system of record.”**

### Easy memory

**Groundedness = Evidence → Answer → Claim validation.**

> **“A grounded answer is an answer that can be traced back to supporting evidence.”**
