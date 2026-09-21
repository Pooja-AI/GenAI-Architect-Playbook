## What is Agent Routing Accuracy?

**Agent routing accuracy measures whether the Coordinator sends a user's request to the correct Delegator/Agent based on the user's intent and required capability.**

In CWD:

> **“Did the Coordinator choose the right Delegator for this request?”**

### CWD example

User asks:

> **“Give me the customer information and open incidents for C12345.”**

The Coordinator identifies:

```text id="8x3m2p"
Intent = Customer Briefing
customer_id = C12345
```

It should route to:

```text id="j7k4qa"
Coordinator
    │
    ├──→ Sales Delegator ✅
    │       └── Customer Worker
    │
    └──→ IT Delegator ✅
            └── Incident Worker
```

If it sends the request only to the **Manufacturing Delegator**, that's a routing error.

---

## How do I measure it?

I create golden routing cases with expected Delegators.

Example:

```json id="d3p8zn"
{
  "input": "Show me open incidents for C12345",
  "expected_delegators": ["it"]
}
```

The actual system returns:

```text id="q9m2vx"
actual_delegators = ["it"]
```

So:

```text id="f5r7kc"
Correct routing = 1
Total routing cases = 1

Accuracy = 100%
```

Across 1,000 cases:

```text id="u1z6ab"
950 correctly routed
────────────────────
1000 total cases

= 95% routing accuracy
```

---

## Multi-agent routing

CWD can have multiple Delegators:

```text id="4z8n2c"
Coordinator
   ├── Sales Delegator
   ├── IT Delegator
   └── Manufacturing Delegator
```

A request may require **multiple Delegators**.

For example:

> "Give me a complete customer briefing."

Expected:

```text id="m6v9qt"
Sales + IT
```

If the Coordinator selects:

```text id="k2p7ws"
Sales + IT + Manufacturing
```

then the routing isn't necessarily fully correct because it invoked an unnecessary Delegator.

So I can measure:

* Correct Delegator selection
* Missing Delegators
* Unnecessary Delegators
* Multi-agent routing accuracy

---

## Routing accuracy vs Worker selection

Don't confuse these.

### Agent/Delegator routing

```text
Coordinator
    ↓
Which Delegator?
```

### Worker selection

```text
Delegator
    ↓
Which Worker?
```

Example:

```text id="9x2q4m"
Customer Briefing
       ↓
Coordinator
       ↓
Sales Delegator       ← Agent routing
       ↓
Customer Worker       ← Worker selection
```

So in CWD:

> **Coordinator → Delegator = Agent routing**

> **Delegator → Worker = Worker routing/selection**

---

## How I improve routing accuracy

If routing accuracy is low, I analyze:

```text id="r4m8ks"
Low Routing Accuracy
       ↓
Check intent classification
       ↓
Check entity extraction
       ↓
Check Agent/Delegator descriptions
       ↓
Improve routing rules/prompts
       ↓
Add examples
       ↓
Add confidence threshold
       ↓
Evaluate again
```

For ambiguous requests, I don't force a route.

Example:

> “I need information about ABC.”

If the system cannot determine whether the user wants **Sales**, **IT**, or **Manufacturing**, it can ask a clarification question.

---

## Interview-ready answer

> **“Agent routing accuracy measures whether the Coordinator selects the correct Delegator or agent for a user's request. In CWD, I create golden test cases containing the expected Delegator or Delegators. For example, a Customer Briefing request may require both Sales and IT Delegators. I compare the actual routing with the expected routing and measure correct, missing, and unnecessary Delegator selections. I separately measure Worker selection accuracy because Delegator routing and Worker selection happen at different layers.”**

### Easy memory

**Agent routing accuracy = “Did the Coordinator send the task to the right Delegator?”**
