## How do you enforce token budgets?

The main principle is:

> **I treat tokens as a controlled resource, not something the Agent can consume without limits.**

In CWD, I enforce budgets at the **workflow, Worker, and LLM-call levels**.

### 1. Define token budgets

For example, a CWD workflow could have:

```text
Workflow budget       = 20,000 tokens
Coordinator budget    = 3,000
Sales Worker budget   = 5,000
IT Worker budget      = 5,000
Final synthesis       = 4,000
Safety reserve        = 3,000
```

These numbers are **illustrative**; actual budgets come from testing and cost/SLO requirements.

---

### 2. Track every LLM call

For each call, I capture:

```text
input_tokens
output_tokens
total_tokens
model
worker_id
workflow_id
tenant_id
```

Example:

```python
result = await llm.ainvoke(prompt)

usage = result.usage

state["input_tokens"] += usage.input_tokens
state["output_tokens"] += usage.output_tokens
state["total_tokens"] += usage.total_tokens
```

---

### 3. Check budget before making expensive calls

Before calling the LLM:

```python
if state["total_tokens"] >= WORKFLOW_TOKEN_BUDGET:
    raise TokenBudgetExceeded()
```

So the workflow cannot continue indefinitely.

```text
Worker
  ↓
Check remaining budget
  ↓
 ┌───────────────┐
 │ Budget left?  │
 └───────┬───────┘
      YES│       │NO
         ↓       ↓
      LLM call   Stop safely
```

---

### 4. Control input tokens

A large part of token consumption comes from the **input**, especially in Agentic AI.

In CWD, I reduce:

* conversation history
* RAG Top-K
* MCP response size
* duplicated Worker results
* unnecessary tool descriptions
* redundant instructions

For example:

```text
RAG:
20 chunks
   ↓
rerank
   ↓
top 3–5 chunks
   ↓
LLM
```

And MCP should return only the fields required by the Worker.

---

### 5. Control output tokens

I also set a maximum output-token limit per call.

Conceptually:

```python
llm = ChatOpenAI(
    model="approved-model",
    max_tokens=1000
)
```

The exact parameter depends on the model/provider.

This prevents an unexpectedly verbose response from consuming the entire workflow budget.

---

### 6. Reserve tokens for important steps

This is especially useful in CWD.

Suppose:

```text
Workflow budget = 20K
Current usage   = 17K
Remaining       = 3K
```

I don't allow an early Worker to consume the entire remaining budget because the **final aggregation/synthesis** still needs tokens.

So I can reserve:

```text
Final synthesis reserve = 3K
```

Then earlier Workers cannot consume that reserved amount.

---

### 7. Use different budgets for different Workers

Not every Worker needs the same budget.

For example:

```text
Customer Worker
→ 2K

Opportunity Worker
→ 3K

Incident Worker
→ 4K

Complex analysis Worker
→ 7K
```

This prevents one Worker from consuming the entire workflow's token allocation.

---

### 8. Limit agent loops

Token budgets work together with execution limits.

```text
Max iterations = 5
Max tool calls  = 10
Token budget    = 20K
Workflow timeout = 30 sec
```

The workflow stops when any hard safety limit is reached.

```text
Iteration limit
       OR
Tool-call limit
       OR
Token limit
       OR
Time limit
       ↓
Safe termination
```

---

### 9. Route to cheaper models when appropriate

If a task doesn't require a powerful model:

```text
Simple task
   ↓
Smaller model
   ↓
Lower token cost
```

But I don't blindly switch models just because the budget is low. The selected model still has to meet the required quality and safety threshold.

---

### 10. Handle budget exhaustion gracefully

If the budget is reached:

```text
Token budget exceeded
        ↓
Stop additional LLM calls
        ↓
Validate available results
        ↓
 ┌──────────────────┐
 │ Sufficient data? │
 └───────┬──────────┘
      YES│       │NO
         ↓       ↓
 Return partial  HITL / retry later
 result
```

**Never ask the LLM to fabricate missing information just because the budget was exhausted.**

---

## CWD example

User asks:

> “Give me a complete customer briefing for C12345.”

```text
Coordinator
   ↓
Token budget = 20K
   ↓
Sales Delegator
   ├── Customer Worker → 2K
   └── Opportunity Worker → 3K
   ↓
IT Delegator
   └── Incident Worker → 4K
   ↓
Final synthesis → reserved 4K
```

If Workers have already consumed too many tokens:

```text
Used = 18K
Remaining = 2K
Final reserve = 4K
```

The Coordinator **doesn't start another expensive LLM call**. It can return the available validated information, queue/retry the remaining work, or request HITL depending on business criticality.

---

## 🎯 Interview-ready answer

> **“I enforce token budgets at the workflow, Worker, and individual LLM-call levels. I track input and output tokens for every model call using workflow ID, Worker ID, model, and tenant ID. Before each expensive call, I check the remaining budget, and I enforce maximum input and output tokens. I also control RAG Top-K, MCP response size, conversation history, agent iterations, and tool calls to prevent unnecessary token consumption. For important steps such as final synthesis, I can reserve part of the workflow budget so earlier Workers cannot consume everything. If the token budget is exhausted, I stop additional LLM calls and return the validated partial result, queue the remaining work, or route to HITL rather than allowing the agent to continue or fabricate information.”**

### Easy memory

**Set budget → Track tokens → Check before call → Limit input/output → Reserve → Control loops → Stop safely**

> **Strong interview line:**
> **“Token budgeting is both a cost-control mechanism and a runaway-agent safety mechanism.”**
