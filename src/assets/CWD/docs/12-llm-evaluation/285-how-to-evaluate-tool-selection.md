## How do you evaluate tool selection?

**Tool selection evaluation measures whether the Worker/Agent chose the correct MCP tool for the user's task and supplied the correct parameters.**

In simple terms:

> **“Did the Worker choose the right tool for the job?”**

### CWD example

User asks:

> **“Show me open incidents for customer C12345.”**

The Worker should select:

```text id="a6k2mp"
Incident Worker
      ↓
MCP
      ↓
get_incidents(
    customer_id="C12345",
    status="Open"
)
      ↓
ServiceNow
```

That's correct. ✅

If it selects:

```text id="q9v4cx"
search_documents()
```

instead of `get_incidents()`:

❌ Wrong tool selection.

---

## What exactly do I evaluate?

I evaluate **four things**:

### 1. Correct tool

```text id="m3r7kp"
Incident request → get_incidents() ✅
Customer information → get_customer() ✅
Document search → search_documents() ✅
```

### 2. Correct parameters

For:

```text
get_incidents()
```

I check:

```json id="v8n2sd"
{
  "customer_id": "C12345",
  "status": "Open"
}
```

The Worker shouldn't accidentally send:

```json id="p4x7mw"
{
  "customer_id": "C54321"
}
```

### 3. Correct parameter values

Even if the correct tool is selected, the values must be correct.

```text
Tool: get_incidents ✅
customer_id: C12345 ✅
status: Open ✅
```

### 4. Correct sequence

Some tools have dependencies.

```text id="n6q3az"
get_customer()
      ↓
get_customer_entitlements()
      ↓
perform_action()
```

The Worker shouldn't execute a dependent action before obtaining the required context/authorization.

---

# How do I measure it?

I create a **golden dataset** containing the expected tool for each scenario.

Example:

```json id="w5k8rc"
{
  "test_id": "TOOL-001",
  "input": "Show open incidents for C12345",
  "expected_tool": "get_incidents",
  "expected_arguments": {
    "customer_id": "C12345",
    "status": "Open"
  }
}
```

Then run the Worker:

```text id="h7m2vp"
Expected:
get_incidents(C12345, Open)

Actual:
get_incidents(C12345, Open)

→ Correct ✅
```

Another case:

```text
Expected:
get_incidents(C12345, Open)

Actual:
search_documents("C12345")

→ Incorrect ❌
```

---

## Tool-selection accuracy

A simple metric is:

```text id="j4p9sx"
Tool Selection Accuracy =
Correct tool selections
───────────────────────
Total evaluated tool selections
× 100
```

Example:

```text
1,000 tool-selection decisions
950 correct

Accuracy = 950 / 1000 × 100
         = 95%
```

For CWD, I can also separately measure:

```text
Correct tool
Correct parameters
Correct sequence
Unauthorized tool attempts
Unnecessary tool calls
```

---

# Tool selection vs tool success

This is an important interview distinction.

### Tool selection

> Did the Worker choose the correct tool?

### Tool success

> Did that tool actually execute successfully?

Example:

```text id="c8m3qn"
Worker
 ↓
get_incidents(C12345)  ← correct tool ✅
 ↓
ServiceNow
 ↓
Timeout ❌
```

Here:

```text
Tool selection = Correct ✅
Tool execution  = Failed ❌
```

The ServiceNow outage shouldn't be counted as a tool-selection error.

---

# How do I improve poor tool selection?

If I see incorrect selections, I investigate:

```text id="r6v2ka"
Wrong tool
   ↓
Was intent understood correctly?
   ↓
Are tool descriptions clear?
   ↓
Are tool schemas correct?
   ↓
Are examples available?
   ↓
Are tools overlapping?
   ↓
Is authorization filtering tools correctly?
```

Controls include:

* Clear MCP tool descriptions
* Strong input/output schemas
* Tool-specific examples
* Intent/entity validation
* Tool allowlists
* Authorization-aware tool discovery
* Structured tool calling
* Deterministic routing for critical operations
* Tool selection evaluation against golden datasets
* Logging and trajectory analysis

For high-risk operations, I don't rely purely on the LLM to choose freely; I can constrain the available tools based on the user's intent and permissions.

---

## CWD example with multiple tools

Suppose the Worker has:

```text id="s9d4qx"
get_customer()
get_incidents()
create_incident()
search_documents()
update_customer()
```

User says:

> “Show me open incidents for C12345.”

The expected selection is:

```text
get_incidents()
```

Not:

```text
create_incident()     ❌
update_customer()     ❌
search_documents()    ❌
```

This is also a **security concern**. A tool-selection evaluator should verify that the agent doesn't select a tool that the user/agent isn't authorized to execute.

---

## Interview-ready answer

> **“I evaluate tool selection by checking whether the Worker selected the correct MCP tool, supplied the correct parameters and values, and followed the required tool sequence. In CWD, for a request such as ‘show open incidents for C12345,’ the expected tool is `get_incidents` with the correct customer ID and status. I maintain golden test cases with expected tools and arguments, capture actual tool calls through distributed traces, and compare expected versus actual behavior. I separately measure tool-selection accuracy from tool execution success because a correctly selected tool can still fail due to a downstream ServiceNow or Salesforce issue. For critical operations, I also enforce tool allowlists and authorization rather than relying only on the LLM.”**

### Easy memory

**Tool selection = Right Tool + Right Parameters + Right Values + Right Sequence.**
