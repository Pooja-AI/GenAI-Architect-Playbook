# How Does Your Coordinator Decide Which Delegator to Invoke?

## Interview Question

**“How does your Coordinator decide which Delegator to invoke?”**

---

## Strong Interview Answer

The Coordinator acts as the **enterprise-level routing and orchestration layer**.

When a user request comes in, the Coordinator first analyzes the **intent, entities, business domain, and required capabilities** of the request. It then maps that requirement to the appropriate Delegator using a combination of **LLM-based intent classification, agent capability metadata, routing rules, and business policies**.

For example, if the request is related to **manufacturing defects**, the Coordinator routes it to the Manufacturing Delegator. The Manufacturing Delegator then determines which specialized Worker Agents are required, such as a Vision Agent, RAG Agent, Analytics Agent, or Root Cause Analysis Agent.

The important design principle is that the Coordinator knows **which domain should handle the request**, but it does not need to know the detailed implementation of every Worker Agent.

So the flow is:

**User Request → Intent/Domain Identification → Capability Matching → Delegator Selection → Delegator Execution**

---

# Functional Explanation

Suppose the user asks:

> “Analyze this semiconductor defect image and tell me the possible root cause.”

The Coordinator performs several steps.

### Step 1 — Understand the Request

The Coordinator extracts information such as:

* User intent: **defect analysis**
* Domain: **manufacturing**
* Required capability: **image analysis + root-cause analysis**
* Input type: **multimodal/image**
* Priority/security requirements

### Step 2 — Identify Candidate Delegators

The Coordinator looks at available Delegators and their capabilities.

For example:

| Delegator               | Capabilities                                          |
| ----------------------- | ----------------------------------------------------- |
| Manufacturing Delegator | Defect analysis, production issues, manufacturing RCA |
| Supply Chain Delegator  | Inventory, suppliers, logistics                       |
| Quality Delegator       | Quality reports, compliance, quality metrics          |
| Finance Delegator       | Cost, invoices, financial analysis                    |

The request strongly matches the **Manufacturing Delegator**.

### Step 3 — Apply Routing Policy

The Coordinator validates the selection against policies such as:

* Is this Delegator available?
* Does it support the required capability?
* Does the user have permission?
* Is the Delegator healthy?
* Is the requested data accessible?
* Is there a fallback Delegator?

### Step 4 — Invoke the Delegator

The Coordinator sends a structured task to the Manufacturing Delegator.

Conceptually:

```text
User Request
     ↓
Coordinator
     ↓
Intent = Defect Analysis
Domain = Manufacturing
Capability = Multimodal RCA
     ↓
Manufacturing Delegator
     ↓
 ┌───────────────┬──────────────┐
 ↓               ↓              ↓
Vision Agent   RAG Agent    RCA Agent
```

The Delegator now owns the **domain-level decision** of which Workers should execute the task.

---

# Technical Explanation

I would typically implement Coordinator routing using four major components.

## 1. Intent Classification

The Coordinator uses an LLM or classification model to determine:

```json
{
  "intent": "defect_analysis",
  "domain": "manufacturing",
  "capabilities": [
    "image_analysis",
    "knowledge_retrieval",
    "root_cause_analysis"
  ]
}
```

For simple/high-volume requests, I may use a smaller classification model instead of a large reasoning model to reduce latency and cost.

---

## 2. Agent / Delegator Capability Registry

Each Delegator publishes its capabilities.

For example:

```json
{
  "agent": "manufacturing-delegator",
  "domain": "manufacturing",
  "capabilities": [
    "defect_analysis",
    "production_analysis",
    "root_cause_analysis"
  ],
  "protocols": ["A2A"],
  "status": "healthy"
}
```

This allows the Coordinator to perform **capability-based routing** rather than hardcoding every routing decision.

---

## 3. Routing Policy

The Coordinator combines the classified intent with routing policies.

For example:

```text
IF domain == manufacturing
AND capability == defect_analysis
AND user_authorized
THEN → Manufacturing Delegator
```

For more dynamic systems:

```text
User Request
      ↓
Intent Classification
      ↓
Capability Matching
      ↓
Policy Validation
      ↓
Delegator Selection
```

The routing decision can therefore be a combination of:

**LLM reasoning + deterministic rules + capability registry + policy checks**

---

## 4. Health and Availability

I would also consider runtime information.

For example:

```text
Manufacturing Delegator
        ↓
      Healthy?
      /     \
    Yes      No
    ↓         ↓
 Invoke     Fallback
```

This prevents the Coordinator from routing requests to an unavailable Delegator.

---

# Where Does LangGraph Fit?

In my architecture, **LangGraph manages the Coordinator's workflow and state transitions**.

Conceptually:

```text
START
  ↓
Analyze Request
  ↓
Classify Intent
  ↓
Identify Domain
  ↓
Match Capability
  ↓
Check Policy
  ↓
Select Delegator
  ↓
Invoke Delegator
  ↓
Monitor Result
  ↓
END
```

LangGraph provides the workflow control, state management, conditional routing, retries, and potentially checkpointing/HITL.

---

# Where Does A2A Fit?

If the Delegator is an independently managed agent/service, the Coordinator can communicate with it using **A2A**.

So:

```text
Coordinator
     │
     │ A2A
     ↓
Manufacturing Delegator
     │
     │ A2A
     ↓
Worker Agents
```

The important distinction is:

* **LangGraph → controls the workflow**
* **A2A → communicates between agents**
* **MCP → connects agents to tools/data**

---

# Does the LLM Make the Final Routing Decision?

Not necessarily.

For enterprise systems, I would avoid making routing **100% dependent on an LLM**.

A better architecture is:

```text
             User Request
                  ↓
          Coordinator Agent
                  ↓
        ┌──────────────────┐
        │ Intent Classifier │
        └────────┬─────────┘
                 ↓
        Capability Registry
                 ↓
          Routing Policies
                 ↓
        Security / Health Check
                 ↓
         Delegator Selection
```

The LLM provides the **semantic understanding**, while deterministic components provide **control and governance**.

This is important because routing is a critical enterprise decision.

---

# What If Multiple Delegators Match?

I would use a scoring or policy-based selection mechanism.

For example:

```text
Manufacturing Delegator
  Capability Match = 95%
  Health = Healthy
  Authorization = Allowed

Quality Delegator
  Capability Match = 70%
  Health = Healthy
  Authorization = Allowed
```

The Coordinator selects the Manufacturing Delegator because it has the stronger capability match.

For complex requests, it could also select **multiple Delegators**.

Example:

> “Analyze the manufacturing defect and determine its financial impact.”

The Coordinator could route to:

```text
              Coordinator
                 /    \
                ↓      ↓
       Manufacturing   Finance
        Delegator     Delegator
             ↓            ↓
        Defect RCA    Cost Analysis
                \       /
                 ↓     ↓
                Coordinator
                    ↓
              Final Response
```

This is where the hierarchical architecture becomes useful.

---

# What Does the Coordinator NOT Do?

The Coordinator should **not** contain all business logic.

It should not know:

```text
How Vision Agent analyzes an image
How RAG retrieves documents
How RCA calculates root cause
How SQL queries are generated
How manufacturing rules are implemented
```

Instead:

```text
Coordinator
    ↓
"What business domain should handle this?"
    
Delegator
    ↓
"What capabilities/workers are required?"
    
Worker
    ↓
"How do I execute this specialized task?"
```

This keeps the architecture loosely coupled.

---

# Architect-Level Answer

The Coordinator uses **capability-based intelligent routing**.

I separate routing into three levels:

### 1. Semantic Decision

**What is the user asking for?**

LLM/classifier identifies intent and domain.

### 2. Capability Decision

**Which Delegator has the required capability?**

Capability registry provides the mapping between business domains and Delegator capabilities.

### 3. Governance Decision

**Is it safe and valid to invoke that Delegator?**

Policy, authorization, health, availability, and operational constraints are checked before invocation.

Therefore, the Coordinator doesn't simply say:

> “This contains the word manufacturing, so call Manufacturing Agent.”

Instead, it performs:

> **Intent → Domain → Capability → Policy → Delegator**

That makes the routing more deterministic, governable, and scalable.

---

# 30-Second Interview Answer

> “The Coordinator uses capability-based routing. First, it analyzes the user's intent, domain, entities, and required capabilities. Then it matches those capabilities against a Delegator registry and applies routing policies such as authorization, availability, and health. Once the appropriate Delegator is selected, the Coordinator invokes it, using LangGraph for workflow and state management and A2A when the Delegator is an independently managed agent. The Coordinator decides which domain should handle the request; the Delegator decides which specialized Workers should execute it.”

---

# Golden Line

> **“The Coordinator decides the domain; the Delegator decides the capability; the Worker executes the task.”**

### Memory Trick

```text
USER
 ↓
WHAT?
 ↓
Coordinator
 ↓
WHICH DOMAIN?
 ↓
Delegator
 ↓
WHICH CAPABILITY?
 ↓
Worker
 ↓
EXECUTE
```

**Intent → Domain → Capability → Policy → Delegator**
