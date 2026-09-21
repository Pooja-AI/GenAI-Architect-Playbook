## What is Task Completion Rate?

**Task completion rate measures the percentage of CWD requests that successfully complete the intended business workflow and produce an acceptable result.**

In simple terms:

> **“Did CWD actually finish the user's task successfully?”**

### CWD example

User asks:

> **“Give me a customer briefing for C12345.”**

The expected workflow is:

```text id="x7k3pm"
User
 ↓
Coordinator
 ↓
Sales Delegator ──→ Customer Worker ──→ Salesforce
 ↓
IT Delegator ─────→ Incident Worker ──→ ServiceNow
 ↓
Validate + Aggregate
 ↓
Customer Briefing
```

If both required branches complete and the final response passes validation:

```text id="p8q2md"
Task = SUCCESS ✅
```

If the workflow fails before producing the required result:

```text id="z5n7rx"
Task = FAILED ❌
```

---

## How do I calculate it?

```text id="c4v8na"
Task Completion Rate =
Successfully completed tasks
───────────────────────────
Total tasks started
× 100
```

Example:

```text id="m3q9fk"
1,000 CWD tasks started
950 successfully completed

Completion Rate = 950 / 1000 × 100
                = 95%
```

---

## What counts as "completed"?

This is important.

I don't consider a task successful merely because the LLM returned a response.

For CWD, I define success criteria.

For example, Customer Briefing requires:

```text id="h6s2wp"
Intent correctly identified       ✅
Required Delegators executed     ✅
Required Workers executed        ✅
Enterprise data retrieved        ✅
Authorization passed             ✅
Results validated                ✅
Required facts present           ✅
Final response generated         ✅
```

Only then do I mark the task as successfully completed.

---

## Partial completion

Suppose:

```text id="q1m8vc"
Sales Delegator → SUCCESS ✅
IT Delegator    → FAILED  ❌
```

The system might return a partial result if the business allows it.

```text id="f9r2kd"
Sales information → Available
IT incident data  → Unavailable
```

I would **not automatically count that as a fully completed task**.

I can separately track:

* Full completion rate
* Partial completion rate
* Failed task rate

This gives a more accurate picture of CWD reliability.

---

## Task completion vs agent routing accuracy

These are different metrics.

### Routing accuracy

> Did I choose the correct Delegator?

### Task completion rate

> Did the entire workflow successfully finish?

Example:

```text id="8j4q2n"
Correct routing ✅
       ↓
MCP timeout ❌
       ↓
Workflow fails ❌
```

Here:

* Routing accuracy → ✅
* Task completion → ❌

---

## Task completion vs tool success

Similarly:

```text id="d7p3ax"
Correct MCP call
      ↓
ServiceNow unavailable
      ↓
Retry
      ↓
Success
```

The initial tool call may fail, but the **overall CWD task can still complete successfully** after recovery.

That's why task completion is an **end-to-end metric**.

---

## What I monitor in production

I break task completion down by:

```text id="v4m8qn"
Overall completion rate
       │
       ├── Sales tasks
       ├── IT tasks
       ├── Customer Briefing
       ├── Incident Investigation
       ├── RAG tasks
       └── MCP tasks
```

I also investigate failures by root cause:

* Coordinator failure
* Delegator failure
* Worker failure
* MCP failure
* Salesforce/ServiceNow failure
* RAG failure
* LLM timeout
* Validation failure
* Authorization failure
* Human approval timeout

---

## Interview-ready answer

> **“Task completion rate is the percentage of CWD workflows that successfully complete the intended business task. I don't consider simply generating an LLM response as success. For example, for a Customer Briefing, the required Delegators and Workers must execute, enterprise data must be retrieved and authorized, results must pass validation, and the final response must satisfy the business requirements. I calculate successful completed tasks divided by total tasks started. I also separately track partial completions and failures so we can identify where the workflow is breaking.”**

### Easy memory

**Task Completion Rate = “Did the entire CWD business task actually finish successfully?”**
