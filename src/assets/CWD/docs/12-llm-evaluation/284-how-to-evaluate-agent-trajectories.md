## How do you evaluate agent trajectories?

**Agent trajectory evaluation means evaluating the complete sequence of decisions and actions an agent took to accomplish a task—not just whether the final answer was correct.**

In CWD, I evaluate the path:

```text
User Request
    ↓
Coordinator
    ↓ A2A
Sales Delegator
    ↓
Customer Worker
    ↓ MCP
Salesforce
    ↓
Result
    ↓
Coordinator
```

I ask:

> **“Did the agent take the correct steps, in the correct order, using the correct tools, with the correct inputs, and stop when the task was complete?”**

---

## What exactly is a trajectory?

A trajectory is the sequence of:

```text
Thought/Decision → Agent → Tool → Input → Observation → Next Decision
```

For example:

```text id="t7k3mp"
Task:
"Give me open incidents for C12345"

Trajectory:

1. Coordinator identifies intent = incident_lookup
2. Coordinator routes → IT Delegator
3. IT Delegator selects → Incident Worker
4. Worker selects MCP tool → get_incidents
5. Worker sends customer_id = C12345
6. MCP Server → ServiceNow
7. ServiceNow returns 2 incidents
8. Worker validates response
9. IT Delegator returns result
10. Coordinator aggregates
11. Final response generated
```

That is the **agent trajectory**.

---

# What do I evaluate?

I evaluate several dimensions.

### 1. Routing correctness

Did Coordinator select the correct Delegator?

```text
Customer Briefing
      ↓
Sales + IT Delegators
```

If Coordinator sends it to Manufacturing Delegator unnecessarily:

❌ Routing error.

---

### 2. Worker selection

Did the Delegator select the right Worker?

```text
IT Delegator
      ↓
Incident Worker ✅
```

Instead of:

```text
IT Delegator
      ↓
Knowledge Worker ❌
```

---

### 3. Tool selection

Did the Worker select the correct MCP tool?

```text
Incident request
      ↓
get_incidents() ✅
```

instead of:

```text
search_documents() ❌
```

---

### 4. Tool parameters

Was the tool called with the correct arguments?

```json id="k5r8px"
{
  "name": "get_incidents",
  "arguments": {
    "customer_id": "C12345",
    "status": "Open"
  }
}
```

I validate:

* Correct tool
* Correct customer ID
* Correct filters
* Correct schema
* Correct authorization

---

### 5. Sequence correctness

Some actions have dependencies.

For example:

```text
Authenticate
    ↓
Get customer
    ↓
Get incidents
    ↓
Aggregate
```

The agent shouldn't try to retrieve incidents before the required customer context or authorization is available.

---

### 6. Unnecessary actions

I also look for **extra steps**.

Example:

```text
User asks for open incidents

Worker:
→ search ServiceNow
→ search SharePoint
→ call Salesforce
→ call ServiceNow
→ call ServiceNow again
```

If only ServiceNow was required:

❌ The trajectory is inefficient.

This increases:

* latency
* cost
* failure probability

---

### 7. Recovery behavior

Suppose:

```text
Worker
 ↓
MCP → ServiceNow
 ↓
Timeout
```

A good trajectory should be:

```text
Timeout
 ↓
Retry
 ↓
Success
```

Not:

```text
Timeout
 ↓
Call unrelated tool
 ↓
Generate an answer anyway
```

I evaluate whether the agent followed the expected recovery policy.

---

### 8. Termination

The agent should stop when the task is complete.

Bad trajectory:

```text
Get incidents
 ↓
Get incidents again
 ↓
Get incidents again
 ↓
LLM continues calling tools
```

This indicates a possible **agent loop**.

I monitor:

* Number of steps
* Number of tool calls
* Maximum iterations
* Repeated tool calls
* Loop detection
* Completion condition

---

# Example trajectory evaluation

Expected trajectory:

```text id="n3q7vx"
Customer Briefing
      ↓
Coordinator
      ↓
Sales + IT
      ↓
Customer Worker + Incident Worker
      ↓
Salesforce + ServiceNow
      ↓
Validate
      ↓
Aggregate
      ↓
Response
```

Actual trajectory:

```text id="b6m2kw"
Customer Briefing
      ↓
Coordinator
      ↓
IT Delegator
      ↓
Incident Worker
      ↓
ServiceNow
      ↓
Coordinator
      ↓
Response
```

The final response may look reasonable, but trajectory evaluation identifies:

```text
Expected: Sales + IT
Actual:   IT only

→ Missing Sales Delegator ❌
```

So **final-answer evaluation alone would miss this problem.**

---

# How do I implement it in CWD?

I capture structured traces for every step:

```json id="r8p4mc"
{
  "trace_id": "TR9001",
  "task_id": "T1001",
  "agent": "incident-worker",
  "step": 4,
  "action": "mcp_call",
  "tool": "get_incidents",
  "arguments": {
    "customer_id": "C12345"
  },
  "status": "success",
  "latency_ms": 320
}
```

Then I compare the **actual trajectory** against expected behavior from my golden dataset.

```text
Golden trajectory
        ↓
Expected steps/actions
        ↓
Compare
        ↑
Actual production/test trajectory
```

---

# What metrics do I use?

I track:

| Metric                    | What it tells me                               |
| ------------------------- | ---------------------------------------------- |
| Routing accuracy          | Correct Delegator?                             |
| Worker selection accuracy | Correct Worker?                                |
| Tool-call accuracy        | Correct MCP tool/parameters?                   |
| Task success              | Did the task complete?                         |
| Step efficiency           | Did it take unnecessary steps?                 |
| Tool-call count           | How many tools were called?                    |
| Recovery success          | Did it recover from failures?                  |
| Loop rate                 | Did the agent get stuck?                       |
| Invalid action rate       | Did it perform prohibited/wrong actions?       |
| Trajectory success rate   | Did the overall path follow expected behavior? |
| Cost/trajectory           | How expensive was the path?                    |
| Latency/trajectory        | How long did the path take?                    |

---

## LLM-as-a-Judge can help

For complex agent trajectories, I can use an evaluator model to judge:

* Was the selected action appropriate?
* Was the tool choice justified by available evidence?
* Did the agent unnecessarily call tools?
* Did it recover correctly?
* Did it follow the task objective?

But I **wouldn't rely only on an LLM judge**.

For CWD, I combine:

```text
Deterministic checks
        +
Golden trajectories
        +
Distributed traces
        +
LLM-based evaluation
        +
Business rules
```

For example, **customer ID, authorization, tool name, and required Delegator** can often be checked deterministically.

---

## Important distinction: trajectory vs final answer

```text
Final-answer evaluation:
"Was the answer correct?"

Trajectory evaluation:
"Did the agent reach the answer correctly and safely?"
```

An agent could produce the correct answer using an incorrect or unauthorized path.

For example:

```text
Correct answer ✅
Wrong customer data accessed ❌
Wrong tool used ❌
Unauthorized access ❌
```

So trajectory evaluation is particularly important for **enterprise agentic AI**.

---

## Interview-ready answer

> **“I evaluate agent trajectories by looking at the complete sequence of decisions and actions taken to complete a task, not just the final answer. In CWD, I evaluate whether the Coordinator selected the correct Delegators, whether Delegators selected the correct Workers, whether Workers selected the correct MCP tools and parameters, whether the execution order was correct, and whether failures were recovered properly. I capture each step using distributed traces with correlation ID, task ID, agent, tool, parameters, status, latency, and errors. Then I compare the actual trajectory against golden test cases and use deterministic rules plus LLM-based evaluation for more subjective decisions. I also measure unnecessary tool calls, loops, recovery success, latency, cost, and overall trajectory success.”**

### Easy memory

**Trajectory evaluation = “Did the agent take the right path, not just reach the right answer?”**

**Route → Select Worker → Select Tool → Execute → Recover → Stop → Evaluate**
