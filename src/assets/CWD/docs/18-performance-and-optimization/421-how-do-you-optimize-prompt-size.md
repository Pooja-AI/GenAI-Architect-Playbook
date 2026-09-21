## How do you optimize prompt size in CWD?

The main principle is:

> **Send only the information the LLM needs for the current task.**

Large prompts increase **input tokens, cost, latency, and sometimes noise**.

### 1. Don't pass the entire conversation

Instead of:

```text
Full conversation history
+ all previous Worker results
+ all tool responses
+ all documents
```

I pass only the relevant context:

```json id="8o2h9k"
{
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "task": "summarize_open_incidents",
  "required_fields": ["incident_id", "severity", "status"]
}
```

---

### 2. Use structured context between agents

In CWD, I don't send the entire Coordinator conversation to every Delegator and Worker.

```text id="q2xw4e"
Coordinator
    ↓
Compact task context
    ↓
Sales Delegator
    ↓
Customer Worker
```

For example:

```json id="8dy8qh"
{
  "task_id": "T1001",
  "customer_id": "C12345",
  "required_data": ["name", "industry", "status"]
}
```

This is much smaller than passing the entire conversation.

---

### 3. Reduce RAG context

Don't send every retrieved document to the LLM.

```text id="uwtqv8"
Azure AI Search
      ↓
Top 10 chunks
      ↓
Reranking
      ↓
Top 3–5 relevant chunks
      ↓
LLM
```

I use:

* metadata filtering
* hybrid search
* appropriate Top-K
* reranking
* deduplication
* relevant chunk selection

---

### 4. Return only required MCP fields

Suppose Salesforce returns:

```text id="a7h2yd"
Customer
Name
Address
Phone
Revenue
Employees
Industry
Contacts
Opportunities
History
Audit information
...
```

If the Worker only needs:

```text
customer_name
industry
status
```

I don't put the entire Salesforce response into the LLM prompt.

Instead:

```python id="s4m2qa"
required = {
    "name": response["name"],
    "industry": response["industry"],
    "status": response["status"]
}
```

---

### 5. Summarize long history

For long conversations:

```text id="5dyv7n"
Old conversation
      ↓
Summary
      +
Recent messages
      ↓
LLM
```

For example:

```text
Summary:
Customer C12345 has 3 open incidents.
Priority is high.
Sales opportunity is in negotiation.

Recent user request:
"Create the customer briefing."
```

Instead of sending hundreds of previous messages.

---

### 6. Remove redundant instructions

Bad prompt:

```text id="7p3n5b"
You are an AI assistant...
You should help the user...
You should provide useful information...
You should be accurate...
...
```

repeated for every Worker.

Instead, use a concise reusable system prompt and task-specific instructions.

```text id="7s9c4m"
Role: Incident Worker
Task: Retrieve open incidents for customer_id.
Return: incident_id, severity, status.
```

---

### 7. Avoid duplicate context

Suppose the Coordinator already knows:

```text
customer_id = C12345
```

Don't repeatedly send:

```text
Customer C12345...
Customer ID is C12345...
The customer's identifier is C12345...
```

Pass it once as structured data.

---

### 8. Control output size too

Prompt optimization isn't only about input.

I also control output:

```python id="t6r1wq"
response = await llm.generate(
    prompt,
    max_tokens=500
)
```

And use structured output:

```json id="e7n4pz"
{
  "summary": "...",
  "open_incidents": 3,
  "risk": "high"
}
```

rather than asking the model for unnecessary explanations.

---

### 9. Use prompt templates

I maintain versioned prompt templates:

```text id="r6w0x4"
Prompt Registry
 ├── coordinator_v3
 ├── sales_delegator_v2
 ├── customer_worker_v4
 └── incident_worker_v2
```

Each prompt contains only the instructions required for that component.

This also makes it easier to evaluate token usage and quality after changes.

---

### 10. Measure token usage

I monitor:

```text id="b0g8m6"
Input tokens / request
Output tokens / request
Total tokens / workflow
Tokens / Worker
Cost / workflow
```

Then identify which component is consuming excessive tokens.

For example:

```text
Before:
Customer Briefing = 12,000 input tokens

After:
Customer Briefing = 5,000 input tokens
```

The exact numbers would come from production measurements; the example illustrates the optimization.

---

## CWD optimization flow

```text id="2u3x5p"
User Request
     ↓
Intent + Entities
     ↓
Compact Task Context
     ↓
Delegator
     ↓
Worker
     ↓
MCP → only required fields
     ↓
RAG → filter + rerank + Top-K
     ↓
Compact context
     ↓
LLM
     ↓
Structured output
```

### 🎯 Interview-ready answer

> **“I optimize prompt size by sending only task-relevant information to the LLM. In CWD, I avoid passing the full conversation and previous Worker results through every layer. Instead, the Coordinator creates a compact structured task context containing the intent, customer ID, required capability, and required fields. For RAG, I filter and rerank results and send only the most relevant chunks. For MCP responses, I return only the fields required by the Worker. I also summarize long conversation history, remove redundant instructions, control output length, and use versioned prompt templates. Finally, I monitor input and output tokens per Worker and per workflow to continuously optimize cost and latency.”**

### Easy memory

**Less history → Less RAG → Less tool data → Less instructions → Structured context → Smaller output → Measure tokens**
