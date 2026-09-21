## How do you calculate token cost?

For an LLM call, I calculate **input-token cost + output-token cost**.

### Basic formula

```text id="3o5d0r"
Token Cost
=
(Input Tokens / 1,000,000 × Input Price)
+
(Output Tokens / 1,000,000 × Output Price)
```

The prices depend on the specific model/provider and pricing tier.

---

### Example

Suppose one CWD LLM call uses:

```text id="q7r8s1"
Input tokens  = 10,000
Output tokens = 2,000

Input price   = $X / 1M tokens
Output price  = $Y / 1M tokens
```

Then:

```text id="7t2k9p"
Input cost
= 10,000 / 1,000,000 × X

Output cost
= 2,000 / 1,000,000 × Y

Total token cost
= Input cost + Output cost
```

I use the **actual model's current pricing** for `X` and `Y`; I wouldn't hard-code a generic price into the architecture.

---

## In CWD, I calculate it for every LLM call

For example:

```text id="1n0v3c"
Customer Briefing
      │
      ├── Coordinator LLM
      │      └── input + output tokens
      │
      ├── Sales Worker LLM
      │      └── input + output tokens
      │
      └── Final synthesis LLM
             └── input + output tokens
```

Then:

```text id="p2b5j7"
Workflow token cost
=
Coordinator cost
+ Worker costs
+ Final synthesis cost
```

---

## What tokens do I track?

I monitor:

```text id="5y7v2n"
Input tokens
Output tokens
Total tokens
Tokens / LLM call
Tokens / Worker
Tokens / workflow
Tokens / tenant
Cost / workflow
```

For example:

```json id="k4m8z2"
{
  "workflow_id": "WF-1001",
  "model": "model-X",
  "input_tokens": 8200,
  "output_tokens": 2100,
  "total_tokens": 10300,
  "estimated_cost": 0.03
}
```

---

## Important: input tokens are often where optimization matters

In CWD, input tokens can become large because the prompt may contain:

```text id="8b3v1q"
System instructions
+ conversation history
+ RAG chunks
+ MCP results
+ Worker context
+ tool definitions
```

So I optimize:

```text id="3j6w8n"
Reduce history
      ↓
Reduce RAG Top-K
      ↓
Return only required MCP fields
      ↓
Remove duplicate context
      ↓
Use compact structured state
      ↓
Reduce input tokens
```

---

## Don't forget cached calls

If semantic caching produces a valid cache hit:

```text id="f2w7q1"
Request
  ↓
Semantic Cache HIT
  ↓
No LLM call
  ↓
LLM token cost = $0
```

There may still be **embedding/search/cache infrastructure cost**, but you avoid the LLM inference cost.

---

## 🎯 Interview-ready answer

> **“I calculate token cost separately for every LLM call using input tokens and output tokens multiplied by the model's respective per-token prices. For a CWD workflow, I sum the cost of all Coordinator, Worker, and synthesis calls to get the workflow-level token cost. I capture input, output, and total tokens along with model, workflow, Worker, and tenant IDs for cost attribution. I then optimize the major drivers by reducing unnecessary LLM calls, conversation history, RAG context, MCP payloads, and agent loops, and by using cheaper models where the quality threshold allows.”**

### Easy memory

**Input tokens × input price + Output tokens × output price = LLM token cost**

Then:

**All LLM calls → Sum → Cost/workflow**
