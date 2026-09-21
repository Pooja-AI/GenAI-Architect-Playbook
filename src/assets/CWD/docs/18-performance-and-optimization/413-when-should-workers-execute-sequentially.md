## When should Workers execute sequentially in CWD?

Workers should execute **sequentially when one Worker depends on the output, decision, or side effect of another Worker**.

### Simple rule

> **If Worker B cannot start correctly without Worker A's result, execute A → B sequentially.**

### Example 1: Output dependency

Suppose the user asks for a customer briefing, but we first need to identify the customer's active account.

```text id="q8w8p5"
Customer Worker
      ↓
Account ID / Account status
      ↓
Opportunity Worker
      ↓
Opportunity details
```

The Opportunity Worker cannot safely proceed until the Customer Worker provides the required information.

So:

```text
W1 → W2
```

---

### Example 2: Create → Update

Suppose:

```text id="qf7g9p"
Create ServiceNow Incident
        ↓
Get Incident ID
        ↓
Update Incident
```

The update depends on the incident created by the first Worker.

Therefore:

```text id="7g0yhj"
Create Incident Worker
        ↓
Update Incident Worker
```

You should **not** execute these concurrently.

---

### Example 3: Validation dependency

```text id="p6w8ae"
Worker 1
  ↓
Generate result
  ↓
Validation Worker
  ↓
Approved result
  ↓
Next Worker
```

The next Worker should wait until validation succeeds.

---

### Example 4: Business workflow dependency

Imagine CWD has:

```text
Customer Worker
      ↓
Eligibility Worker
      ↓
Recommendation Worker
      ↓
Action Worker
```

The recommendation should not be generated before eligibility is known, and the action should not happen before the recommendation is approved.

So the workflow is:

```text id="i5z8cp"
W1 → W2 → W3 → W4
```

---

## How does LangGraph handle this?

You create **normal sequential edges** when there is a dependency:

```python
workflow.add_edge(
    "customer_worker",
    "opportunity_worker"
)

workflow.add_edge(
    "opportunity_worker",
    "validation"
)
```

Conceptually:

```text id="5r9j50"
Customer Worker
      ↓
Opportunity Worker
      ↓
Validation
      ↓
Coordinator
```

For independent Workers, you use parallel branches instead.

---

## Sequential vs Parallel

| Situation                                 | Execution      |
| ----------------------------------------- | -------------- |
| Workers are independent                   | **Parallel**   |
| Worker B needs Worker A output            | **Sequential** |
| Create → Update                           | **Sequential** |
| Fetch → Transform                         | **Sequential** |
| Generate → Validate                       | **Sequential** |
| Independent Salesforce + ServiceNow reads | **Parallel**   |
| Two Workers both need only `customer_id`  | **Parallel**   |

### Important interview point

**Don't make everything sequential just because it's easier.**

That increases latency unnecessarily.

Instead, model the workflow as a **dependency graph**:

```text id="d6j3v7"
                 ┌→ Customer Worker ──┐
Coordinator ─────┤                    ├→ Aggregate
                 └→ Opportunity ──────┘

If dependency exists:

Coordinator
     ↓
Customer Worker
     ↓
Opportunity Worker
     ↓
Aggregate
```

### 🎯 Interview-ready answer

> **“Workers should execute sequentially when there is a dependency between them—for example, when Worker B needs Worker A's output, when one Worker creates a resource that another Worker must update, or when validation must happen before the next action. In CWD, I model these dependencies explicitly in LangGraph using sequential edges. Independent Workers execute in parallel to reduce latency, while dependent Workers execute sequentially to preserve correctness.”**

**Easy memory:**

> **No dependency → Parallel**
> **Dependency → Sequential**
> **Side-effect dependency → Always carefully sequence + use idempotency**
