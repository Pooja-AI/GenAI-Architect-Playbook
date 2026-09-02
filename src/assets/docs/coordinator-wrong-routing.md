This is an excellent **architect-level failure-handling question**. The important point is: **don't assume the Coordinator is always correct**. Your architecture should detect, validate, and recover from incorrect routing.

:::writing{variant="document" id="82417"} # What Happens If the Coordinator Makes the Wrong Routing Decision?

## Interview Question

**“What happens if the Coordinator makes the wrong routing decision?”**

---

## Strong Interview Answer

I don't treat the Coordinator's routing decision as blindly correct.

The Coordinator makes an initial routing decision based on intent, domain, capabilities, and policies, but the selected Delegator performs **domain-level validation**.

If the Delegator determines that the request doesn't belong to its domain or that it doesn't have the required capability, it should **reject or redirect the task rather than trying to execute an unrelated request**.

The Delegator can return a structured response such as:

```text
ROUTING_MISMATCH
required_domain = "quality"
required_capability = "quality_analysis"
```

The Coordinator can then re-route the request to the correct Delegator.

So the architecture becomes:

```text
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Validate Request
  ↓
Correct?
 /       \
Yes       No
 ↓         ↓
Execute   Return Routing Mismatch
             ↓
        Coordinator Re-route
             ↓
        Correct Delegator
```

The key principle is:

> **Routing should be a recoverable decision, not a single point of irreversible failure.**

---

# Functional Example

Suppose the user asks:

> **“Why did our product fail the quality inspection?”**

The Coordinator incorrectly classifies this as a **Manufacturing** request.

```text
User
 ↓
Coordinator
 ↓
Manufacturing Delegator
```

The Manufacturing Delegator analyzes the request and realizes:

```text
Actual Domain = Quality
Required Capability = Quality Analysis
```

Instead of attempting to answer incorrectly, it returns:

```json
{
  "status": "ROUTING_MISMATCH",
  "required_domain": "quality",
  "required_capability": "quality_analysis"
}
```

The Coordinator receives the signal:

```text
Manufacturing Delegator
        ↓
ROUTING_MISMATCH
        ↓
Coordinator
        ↓
Quality Delegator
```

Now the correct Delegator handles the request.

---

# Why Use Multiple Validation Layers?

A robust architecture shouldn't rely on one LLM decision.

I prefer:

```text
              Coordinator
                   ↓
           Initial Routing
                   ↓
          Routing Validation
                   ↓
              Delegator
                   ↓
          Domain Validation
                   ↓
              Workers
                   ↓
         Capability Validation
```

This creates **defense in depth**.

If the Coordinator makes a semantic mistake, the Delegator has an opportunity to catch it.

---

# How Does the Delegator Detect Wrong Routing?

The Delegator can validate:

### 1. Domain

```text
Expected:
quality

Received:
manufacturing
```

Mismatch → reject/re-route.

### 2. Capability

For example:

```text
Required:
quality_analysis

Delegator capabilities:
defect_analysis
production_analysis
```

No capability match → routing mismatch.

### 3. Input Type

For example:

```text
Required input:
financial data

Delegator supports:
manufacturing images
```

Mismatch → reject.

### 4. Business Policy

The request may belong to the domain but require a different specialized workflow.

### 5. Authorization

The user may be allowed to access Quality information but not a particular Manufacturing system.

---

# Structured Routing Result

I prefer agents to return **structured results** rather than vague natural-language messages.

For example:

```json
{
  "status": "ROUTING_MISMATCH",
  "reason": "Unsupported domain",
  "expected_domain": "quality",
  "required_capabilities": [
    "quality_analysis"
  ],
  "suggested_delegator": "quality-delegator"
}
```

This makes the recovery process deterministic.

---

# What If the Coordinator Keeps Routing Incorrectly?

This is where you need a **retry/loop limit**.

You don't want:

```text
Coordinator
 ↓
Manufacturing
 ↓
Mismatch
 ↓
Coordinator
 ↓
Quality
 ↓
Mismatch
 ↓
Coordinator
 ↓
Manufacturing
 ↓
...
```

That could create an infinite routing loop.

Instead:

```text
Max routing attempts = N
```

Conceptually:

```text
Coordinator
    ↓
Delegator
    ↓
Mismatch
    ↓
Re-route
    ↓
Delegator
    ↓
Mismatch
    ↓
Maximum attempts reached
    ↓
Escalate / Human / Fail Gracefully
```

The exact threshold should be configurable based on the application.

---

# Confidence-Based Routing

For ambiguous requests, I can also introduce a confidence score.

For example:

```text
Manufacturing → 0.92
Quality       → 0.54
Finance       → 0.08
```

If the confidence is high:

```text
0.92 → Route automatically
```

If confidence is low:

```text
0.54 → Additional classification / clarification
```

For example:

> “Are you asking about the manufacturing process or the quality inspection?”

This prevents unnecessary incorrect routing.

---

# Multi-Domain Requests

Sometimes the Coordinator isn't actually wrong.

The request may legitimately belong to multiple domains.

For example:

> **“Analyze this manufacturing defect and estimate its financial impact.”**

This requires:

```text
Manufacturing
       +
Finance
```

The Coordinator can route to multiple Delegators:

```text
                   Coordinator
                    /       \
                   ↓         ↓
          Manufacturing    Finance
           Delegator       Delegator
                ↓             ↓
             RCA           Cost Analysis
                \             /
                 \           /
                  ↓         ↓
                   Coordinator
                       ↓
                  Final Answer
```

So an important distinction is:

> **Wrong routing vs multi-domain routing.**

The solution isn't always to choose one Delegator.

---

# Where Does LangGraph Help?

LangGraph can model the routing and recovery as explicit conditional transitions.

Conceptually:

```text
START
  ↓
Analyze Intent
  ↓
Select Delegator
  ↓
Validate Delegator
  ↓
 ┌───────────────┬────────────────┐
 ↓               ↓                ↓
VALID          MISMATCH        AMBIGUOUS
 ↓               ↓                ↓
Execute       Re-route        Clarify
                 ↓
             Retry Limit?
              /       \
            No         Yes
            ↓           ↓
         Re-route     Escalate
```

This is preferable to asking an LLM to continuously decide what to do without guardrails.

---

# Where Does A2A Fit?

If the Coordinator and Delegators are independently deployed agents, the routing and re-routing communication can happen through A2A.

```text
Coordinator
     │
     │ A2A
     ↓
Manufacturing Delegator
     │
     │
     ↓
Routing Mismatch
     │
     │ A2A response
     ↓
Coordinator
     │
     │ A2A
     ↓
Quality Delegator
```

A2A provides the communication mechanism.

The **routing policy and recovery logic** remain part of the orchestration architecture.

---

# What If the Wrong Routing Produces a Result?

This is more dangerous.

Suppose the Coordinator incorrectly sends a request to Manufacturing, and the Manufacturing Delegator successfully returns an answer.

A technical success doesn't mean a **business-correct result**.

Therefore, I would use validation before returning the final answer.

```text
Worker Result
      ↓
Domain Validation
      ↓
Output Schema Validation
      ↓
Evidence / Confidence Check
      ↓
Final Response
```

If the result doesn't satisfy the expected task contract:

```text
Invalid Result
     ↓
Retry / Re-route / Escalate
```

This prevents:

> **“The system returned an answer, therefore the answer must be correct.”**

---

# Observability

I would also monitor routing quality.

Metrics could include:

```text
routing_accuracy
routing_mismatch_rate
reroute_rate
ambiguous_request_rate
routing_latency
failed_routing_rate
fallback_rate
```

For example:

```text
1000 requests
     ↓
950 correct first-time routes
 30 re-routed
 20 escalated
```

A high re-routing rate could indicate:

* Poor routing prompts
* Incorrect capability metadata
* Overlapping Delegator capabilities
* Poor intent classification
* Missing domain definitions

This turns routing into something we can **measure and improve**.

---

# Architect-Level Answer

> “I don't make the Coordinator's routing decision irreversible. The Coordinator performs the initial intent and domain classification, but the Delegator validates that the request belongs to its domain and that it has the required capabilities. If the Delegator detects a routing mismatch, it returns a structured mismatch response with the required domain or capability, and the Coordinator can re-route the request. I use bounded retries to prevent routing loops, confidence thresholds for ambiguous requests, and multi-Delegator execution when a request genuinely spans multiple domains. I also monitor routing accuracy and re-routing rates so we can continuously improve the routing model and capability registry.”

---

# 30-Second Interview Answer

> “I treat Coordinator routing as a recoverable decision. The selected Delegator validates the domain, required capabilities, input type, and policies. If it detects a mismatch, it returns a structured routing-mismatch response rather than trying to execute the request. The Coordinator can then re-route to another Delegator, with a bounded retry limit to prevent loops. For ambiguous requests, we can use confidence thresholds or ask for clarification, and for true multi-domain requests we can invoke multiple Delegators. We also monitor routing accuracy and re-routing rates as part of observability.”

---

# Strong Follow-Up Scenario

### Interviewer:

**“What if the Coordinator repeatedly routes to the wrong Delegator?”**

### Answer:

> “I would prevent infinite routing loops using a maximum routing-attempt limit. After the threshold, I would either escalate to a human, ask the user for clarification, or fail gracefully. I would also investigate the routing telemetry because repeated mismatches usually indicate a problem with intent classification, capability metadata, overlapping domain definitions, or routing policies.”

---

# Golden Architecture Principle

> **“Don't assume the Coordinator is always right; make routing validated, recoverable, bounded, and observable.”**

### Memory Trick

```text
ROUTE
  ↓
VALIDATE
  ↓
 ┌───────────┐
 │ Correct?  │
 └─────┬─────┘
       │
   ┌───┴───┐
   ↓       ↓
  YES      NO
   ↓       ↓
EXECUTE  RE-ROUTE
           ↓
        RETRY LIMIT
           ↓
       ESCALATE
```

**Route → Validate → Re-route → Limit → Escalate**

