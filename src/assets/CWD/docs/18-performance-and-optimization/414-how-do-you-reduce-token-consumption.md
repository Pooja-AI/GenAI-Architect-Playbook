## How do you reduce token consumption in CWD?

The main principle is:

> **Send only the information the LLM actually needs.**

In CWD, token consumption can come from **prompts, conversation history, RAG context, tool results, and repeated agent calls**.

### 1. Reduce prompt size

Don't send large system instructions repeatedly.

Instead of:

```text
Large prompt
+ full business rules
+ full conversation
+ all tool descriptions
+ all previous results
```

send only the relevant instructions for that Worker.

---

### 2. Reduce conversation history

Don't send the entire conversation on every LLM call.

Use:

```text
Recent messages
+
Conversation summary
+
Current task
```

For example:

```text
100 messages
      ↓
Summarize older messages
      ↓
Keep 5 recent messages + summary
      ↓
LLM
```

---

### 3. Reduce RAG Top-K

If RAG returns:

```text
Top-K = 20
```

but only 5 documents are useful, you're unnecessarily consuming tokens.

Use:

```text
Search
 ↓
Top 10 candidates
 ↓
Rerank
 ↓
Top 3–5 relevant chunks
 ↓
LLM
```

This reduces context tokens while maintaining relevance.

---

### 4. Compress retrieved context

Instead of sending full documents:

```text
Document → 10 pages
```

extract only the relevant information:

```text
Customer:
  Name
  Status
  Open incidents
  Revenue
```

You can use chunking, filtering, or context compression.

---

### 5. Return only required fields from tools

This is particularly important for MCP.

Bad:

```text
Salesforce
 → entire customer object
 → history
 → metadata
 → unused fields
```

Better:

```text
Salesforce
 → customer_id
 → customer_name
 → account_status
 → industry
```

The Worker then sends only required fields to the LLM.

---

### 6. Avoid unnecessary LLM calls

Use deterministic code where possible.

For example:

```text
Is customer_id present?
       ↓
Python validation
       ↓
No LLM required
```

Don't use an LLM for simple:

* Validation
* Routing rules
* Formatting
* Boolean checks
* Data transformations

---

### 7. Use smaller models for simple tasks

Example:

```text
Intent classification
        ↓
Small / fast model

Complex customer briefing
        ↓
More capable model
```

This reduces token cost and often latency.

---

### 8. Prevent unnecessary agent loops

An agent can accidentally generate:

```text
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
 ↓
LLM
 ↓
Tool
```

Set:

* Maximum iterations
* Maximum tool calls
* Clear termination conditions
* Deterministic routing when possible

---

### 9. Don't pass the same result through every layer

In CWD:

```text
Coordinator
 ↓
Delegator
 ↓
Worker
```

Don't repeatedly pass the **entire conversation and all previous outputs**.

Pass a compact task context:

```json
{
  "task_id": "T1001",
  "customer_id": "C12345",
  "required_fields": ["status", "open_incidents"]
}
```

This is especially useful between Coordinator → Delegator → Worker.

---

### 10. Limit output tokens

If the user asks:

> "Give me the customer's open incident count."

Don't allow the LLM to generate a 1,000-token response.

Use appropriate output limits and structured responses.

---

## How I measure token consumption

I would track:

```text
Input tokens
Output tokens
Total tokens
Tokens / workflow
Tokens / Worker
Tokens / LLM call
Cost / workflow
```

Example:

```text
Customer Briefing

Coordinator LLM       800 tokens
Customer Worker       600 tokens
Opportunity Worker    500 tokens
Incident Worker       500 tokens
Final synthesis       700 tokens
                      ─────────
Total                3,100 tokens
```

Then I can identify which component is consuming the most tokens.

### 🎯 Interview-ready answer

> **“I reduce token consumption in CWD by minimizing prompt and conversation history, controlling RAG Top-K, compressing retrieved context, returning only required fields from MCP tools, avoiding unnecessary LLM calls, using smaller models for simple tasks, limiting agent iterations and tool calls, and controlling output length. I also pass compact structured task context between Coordinator, Delegator, and Worker instead of repeatedly passing the full conversation and previous results. Finally, I monitor input, output, and total tokens per workflow and per Worker to identify optimization opportunities.”**

**Easy memory:**

> **Less prompt → Less history → Less RAG → Less tool data → Fewer LLM calls → Smaller model → Fewer loops → Smaller output.**
