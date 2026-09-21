## What is faithfulness?

**Faithfulness measures whether the LLM's answer is supported by the evidence provided to it.**

In simple terms:

> **Did the LLM stay faithful to the retrieved context, or did it invent information?**

### CWD example

Suppose the Worker retrieves from ServiceNow:

```text
INC1001
Status: Open
Priority: High
Description: Network connectivity issue
```

The LLM generates:

> “INC1001 is a high-priority open incident related to network connectivity.”

✅ **Faithful** — every claim is supported by the evidence.

But if it generates:

> “INC1001 is a critical database failure caused by a hardware problem.”

❌ **Not faithful** — the retrieved evidence does not support those claims.

### How I measure it

```text id="6v7k3p"
Retrieved Evidence
       ↓
LLM Answer
       ↓
Extract factual claims
       ↓
Compare claims with evidence
       ↓
Supported?
 ├── Yes → Faithful
 └── No  → Unfaithful / hallucinated
```

A simple conceptual metric is:

```text
Faithfulness =
Supported claims / Total factual claims
```

For example:

```text
100 factual claims
90 supported
10 unsupported

Faithfulness = 90%
```

### Faithfulness vs factual accuracy

This distinction is important in interviews:

| Metric               | Question                                                      |
| -------------------- | ------------------------------------------------------------- |
| **Faithfulness**     | Is the answer supported by the provided context?              |
| **Factual accuracy** | Is the answer actually true according to the source of truth? |

For example, if your retrieved document itself contains an incorrect customer address, the LLM may faithfully repeat that address.

So:

> **Faithful ≠ automatically factually correct.**

That's why CWD also validates data against authoritative systems such as Salesforce or ServiceNow.

### Interview-ready answer

> **“Faithfulness measures whether the claims in the LLM's response are supported by the retrieved context or evidence. In CWD, for example, if ServiceNow returns that an incident is open and high priority, the LLM's response should only make claims supported by those results. I measure faithfulness by comparing generated claims against retrieved evidence. However, faithfulness doesn't guarantee that the source itself is correct, so for critical information I also validate against the system of record.”**

### Easy memory

**Faithfulness = “Did the answer stay true to the evidence I gave the LLM?”**
