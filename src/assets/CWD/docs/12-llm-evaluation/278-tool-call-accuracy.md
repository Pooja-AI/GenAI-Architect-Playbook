## What is Tool-Call Accuracy?

**Tool-call accuracy measures whether the Worker/Agent selected the correct MCP tool and called it with the correct parameters for the user's task.**

In simple terms:

> **“Did the agent call the right tool with the right inputs?”**

### CWD example

User asks:

> **“Show me open incidents for customer C12345.”**

The Incident Worker should select:

```text id="q2k8fd"
get_incidents(
    customer_id="C12345",
    status="Open"
)
```

That's a **correct tool call**.

But if the Worker calls:

```text id="n7h4px"
get_customer(
    customer_id="C12345"
)
```

❌ Wrong tool.

Or:

```text id="8k3z2m"
get_incidents(
    customer_id="C99999"
)
```

❌ Correct tool, wrong parameter.

---

## What exactly do I evaluate?

I break tool-call accuracy into several checks:

```text id="j5q9sw"
User Request
     ↓
Worker
     ↓
Tool Selection
     ↓
Parameter Generation
     ↓
Authorization
     ↓
MCP Tool
```

### 1. Correct tool

Did the Worker choose the right MCP tool?

```text
Customer information → get_customer ✅
Incident information → get_incidents ✅
Document search → search_documents ✅
```

### 2. Correct parameters

Did it pass the correct values?

```json id="r4k7pz"
{
  "customer_id": "C12345",
  "status": "Open"
}
```

### 3. Correct parameter values

The Worker shouldn't accidentally send:

```json id="3z8m1x"
{
  "customer_id": "C54321"
}
```

when the user's request was for `C12345`.

### 4. Correct sequence

Sometimes tools have dependencies.

```text id="g0p5cf"
get_customer(C12345)
       ↓
get_customer_entitlements(C12345)
       ↓
get_incidents(C12345)
```

Calling them in the wrong order can produce an incorrect workflow.

### 5. Correct tool arguments/schema

MCP tool schemas should be validated before execution.

```text id="m6v4rk"
Tool Schema
   ↓
Validate arguments
   ↓
Valid → Execute
Invalid → Reject / Regenerate
```

---

## How do I calculate it?

Suppose I have 1,000 golden test cases.

```text id="h7p2nx"
Correct tool selected = 950
Total tool-selection cases = 1,000

Tool-selection accuracy = 95%
```

I can separately track:

```text id="a1f6qk"
Tool selection accuracy
Parameter accuracy
Argument/schema validity
Tool execution success
```

This is useful because **tool selection can be correct while execution still fails**.

---

## Tool-call accuracy vs Tool success rate

This is an important distinction.

### Tool-call accuracy

> Did the agent **choose and construct the correct call**?

### Tool success rate

> Did the tool **successfully execute**?

Example:

```text id="p8c4wz"
Worker selects:
get_incidents(C12345)
        ↓
Correct call ✅
        ↓
ServiceNow unavailable
        ↓
Tool execution fails ❌
```

Here:

* Tool-call accuracy → ✅
* Tool success rate → ❌

So I don't treat them as the same metric.

---

## CWD evaluation example

For a Customer Briefing:

```text id="v9x2kd"
Coordinator
    ↓
IT Delegator
    ↓
Incident Worker
    ↓
MCP
    ↓
get_incidents(customer_id="C12345")
    ↓
ServiceNow
```

I verify:

```text id="q4f7sm"
Correct Worker?        ✅
Correct MCP tool?      ✅
Correct customer ID?   ✅
Correct parameters?    ✅
Authorized?            ✅
Tool executed?         ✅
Returned data valid?   ✅
```

This gives me a much stronger evaluation than simply checking whether the final answer "looks good."

---

## Interview-ready answer

> **“Tool-call accuracy measures whether an agent selects the correct tool and generates the correct parameters for the task. In CWD, for example, if the user asks for open incidents for C12345, the Incident Worker should call the `get_incidents` MCP tool with the correct customer ID and status. I evaluate tool selection, parameter correctness, schema validity, and required call sequence against golden test cases. I keep this separate from tool success rate because a correctly constructed tool call can still fail due to a downstream Salesforce or ServiceNow outage.”**

### Easy memory

**Tool-call accuracy = Right tool + Right parameters + Right sequence.**

**Tool success = Did the tool actually execute successfully?**
