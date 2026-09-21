## What should the LLM do when evidence is insufficient?

The LLM should **abstain instead of guessing**.

In CWD, if the retrieved RAG context or MCP results don't contain enough evidence to answer the question, the LLM should clearly say that the available enterprise data is insufficient.

### CWD flow

```text
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
Evidence check
 ↓
Is evidence sufficient?
 ├── YES → LLM generates grounded answer
 │
 └── NO  → Abstain / ask clarification
```

### Example

User asks:

> "What is the reason for customer C12345's production outage?"

Suppose:

```text
ServiceNow → Incident exists
              Status = Open
              Description = Network issue

RAG → No RCA document found
```

The LLM should **not** say:

> "The outage was caused by a database failure."

That would be a hallucination.

Instead:

> **"I found an open network-related incident for customer C12345, but I don't have sufficient evidence to determine the confirmed root cause."**

### What can the system do?

Depending on the situation, I use four options:

1. **Retrieve again**
   Try broader/hybrid search or query refinement.

2. **Use another authoritative source**
   For example, use MCP → ServiceNow if RAG doesn't contain current incident information.

3. **Ask for clarification**
   If the user's request is ambiguous.

4. **Abstain**
   If no trustworthy evidence exists.

### Grounded prompting

I explicitly instruct the LLM:

```text
Answer only using the provided evidence.

Do not infer or invent facts.

If the evidence is insufficient:
- state that the information is unavailable,
- explain what evidence was found if useful,
- do not guess.
```

### Structured response

For stronger control, the Worker can return:

```json
{
  "answerable": false,
  "confidence": "insufficient_evidence",
  "evidence": [],
  "reason": "No confirmed RCA information was found."
}
```

The Coordinator can then decide whether to:

```text
answerable = true
       ↓
Generate final answer

answerable = false
       ↓
Retry / alternative source / clarify / abstain
```

### Interview-ready answer

> **“When evidence is insufficient, I don't allow the LLM to guess. In CWD, the Worker first determines whether the retrieved RAG or MCP evidence is sufficient. If not, we can retry retrieval, use an authoritative source such as ServiceNow, or ask for clarification. If there is still insufficient evidence, the LLM abstains and clearly states what is known and what cannot be confirmed. I enforce this through grounded prompts, structured outputs, validation, and monitoring of abstention and retrieval-miss rates.”**

### Easy memory

**Insufficient evidence → Don't guess → Retry → Check authoritative source → Clarify → Abstain.**
