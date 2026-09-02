# How Did You Decide the Number of Agents in Your Architecture?

## Interview Question

**“How did you decide the number of agents in your architecture?”**

---

## Strong Interview Answer

> **I did not decide the number of agents based on a fixed number or by making every task an agent. I started from the business capabilities and identified where there were meaningful boundaries in responsibility, domain knowledge, tools, security, ownership, and execution.**
>
> I created an agent when a capability required **independent reasoning, specialized tools or knowledge, a distinct business responsibility, or an independent lifecycle**.
>
> If two capabilities were tightly coupled, simple, and always executed together, I kept them within the same agent rather than creating another agent.
>
> So the principle was:
>
> **Business capability → responsibility boundary → agent boundary.**
>
> I also considered operational factors such as scalability, latency, cost, failure isolation, security, and team ownership.
>
> The goal was not to maximize the number of agents. The goal was to find the **minimum number of meaningful autonomous boundaries** required to solve the enterprise problem cleanly.

---

# My Decision Framework

I evaluated each capability using several questions.

```text
                    Business Capability
                           |
            +--------------+--------------+
            |              |              |
        Different       Different      Independent
        reasoning?      tools/data?     lifecycle?
            |              |              |
            +--------------+--------------+
                           |
                           v
                    Agent Boundary?
```

I generally considered an agent when several of these characteristics were present:

### 1. Distinct Business Responsibility

Does this capability represent a meaningful business function?

Example:

```text
Quality Analysis
Vision Analysis
Production Analytics
Root Cause Analysis
```

If yes, it is a candidate for an agent.

---

### 2. Specialized Reasoning

Does the capability require substantially different reasoning?

For example:

```text
Vision Agent
→ Multimodal reasoning

RAG Agent
→ Retrieval + grounding

Analytics Agent
→ Data analysis

Root Cause Agent
→ Evidence correlation
```

If the reasoning patterns are significantly different, separation may be valuable.

---

### 3. Different Tools or Data

If a capability requires a distinct set of enterprise resources:

```text
Quality Agent
    ↓
Quality DB
Quality APIs

Manufacturing Agent
    ↓
Production DB
Equipment APIs
```

that can justify an agent boundary.

But **different tools alone are not sufficient**. I don't create an agent just because two tools are different.

---

### 4. Independent Scaling

Suppose:

```text
Vision Analysis
```

receives 10× more requests than another capability.

If it needs to scale independently, making it an independently deployable agent can be valuable.

---

### 5. Security Boundary

If one capability requires access to sensitive or restricted enterprise resources while another does not, I may create a separate agent boundary.

For example:

```text
Quality Agent
    ↓
Quality Data

Analytics Agent
    ↓
Production Analytics
```

This allows more granular authorization and least-privilege access.

---

### 6. Independent Ownership

In an enterprise environment:

```text
Manufacturing Team
→ Manufacturing Agent

Quality Team
→ Quality Agent

Data Science Team
→ Analytics Agent
```

If different teams own capabilities independently, an agent boundary can make the architecture cleaner.

---

### 7. Independent Lifecycle

I also ask:

> **“Does this capability need to evolve, deploy, version, or fail independently?”**

If yes, that is a strong reason for separation.

---

# What I Would NOT Make an Agent

This is equally important.

I would not create an agent for every small operation.

For example:

```text
RetrieveData()
ValidateInput()
FormatResponse()
CalculateAverage()
```

These may simply be:

* Functions
* Tools
* Libraries
* Workflow nodes

They don't necessarily need to be agents.

---

# Agent vs Tool Decision

A useful rule is:

```text
Does it require autonomous decision-making?
            |
       +----+----+
       |         |
      No        Yes
       |         |
      Tool      Agent
```

For example:

```text
SQL Query
→ Tool

Calculator
→ Tool

REST API
→ Tool

Database Search
→ Tool
```

Whereas:

```text
Quality Investigation
→ Agent

Root Cause Analysis
→ Agent

Complex Defect Analysis
→ Agent
```

because these involve reasoning and decision-making.

---

# Agent vs Workflow Step

Not every reasoning step needs to become a separate autonomous agent.

For example:

```text
Validate → Retrieve → Transform → Generate
```

may simply be a workflow.

I use an agent when the component needs some degree of:

* Decision-making
* Planning
* Tool selection
* Contextual reasoning
* Goal-directed execution

---

# How I Applied This to My Architecture

For my CWD enterprise assistant, I first identified the major business capabilities.

Conceptually:

```text
                    Enterprise Assistant
                           |
       +-------------------+-------------------+
       |                   |                   |
 Manufacturing          Quality            Analytics
       |                   |                   |
   Specialized         Specialized        Specialized
   capabilities        capabilities       capabilities
```

Then I grouped tightly related capabilities under domain boundaries.

This resulted in:

```text
Coordinator
    |
    +── Manufacturing Delegator
    |       |
    |       +── Production Worker
    |       +── Equipment Worker
    |       +── Defect Worker
    |
    +── Quality Delegator
    |       |
    |       +── Quality Worker
    |       +── Historical Data Worker
    |
    +── Analytics Delegator
            |
            +── Analytics Worker
            +── Root Cause Worker
```

The important point is that I **grouped capabilities first and created agents second**.

---

# Why Not Create One Agent Per Task?

Suppose I have:

```text
10 tasks
```

I don't automatically create:

```text
10 agents
```

Instead, I ask:

```text
Task A + Task B
       ↓
Same responsibility?
Same tools?
Same reasoning?
Same lifecycle?
       ↓
Maybe one agent
```

Whereas:

```text
Task C
       ↓
Different domain
Different reasoning
Different ownership
       ↓
Separate agent
```

This avoids **agent proliferation**.

---

# Why Not Use Fewer Agents?

I also avoid creating one giant agent just to minimize the count.

For example:

```text
Coordinator
     |
Enterprise Agent
     |
  Everything
```

This creates:

* Large prompts
* Too many tools
* Complex routing
* Broad permissions
* Difficult testing
* Difficult observability
* Higher reasoning complexity

So the objective is not:

> **Minimum number of agents**

or:

> **Maximum number of agents**

It is:

> **Minimum number of meaningful responsibility boundaries.**

---

# My Agent-Boundary Checklist

Before creating an agent, I ask:

| Question                               | If Yes                    |
| -------------------------------------- | ------------------------- |
| Distinct business capability?          | Candidate                 |
| Requires specialized reasoning?        | Candidate                 |
| Different tools/data?                  | Candidate                 |
| Needs independent scaling?             | Strong candidate          |
| Different security boundary?           | Strong candidate          |
| Different team ownership?              | Strong candidate          |
| Independent deployment/lifecycle?      | Strong candidate          |
| Could simply be a function/tool?       | Don't create agent        |
| Always executes as part of same logic? | Consider keeping together |
| No autonomous decision-making?         | Probably a tool/workflow  |

---

# A Practical Scoring Approach

For a large enterprise design, I can make the decision more systematic.

For each capability, evaluate:

```text
Business independence       0–2
Reasoning complexity        0–2
Tool/data independence      0–2
Security boundary           0–2
Scaling requirement         0–2
Team ownership              0–2
Lifecycle independence      0–2
```

A high score indicates a stronger case for an independent agent.

This isn't a mandatory mathematical formula; it is a **design heuristic** to make the architecture decision explainable.

---

# Avoiding Over-Agentization

One of the biggest mistakes in multi-agent architecture is:

> **“Every function becomes an agent.”**

That creates:

```text
Coordinator
   ↓
Agent A
   ↓
Agent B
   ↓
Agent C
   ↓
Agent D
```

with excessive:

* LLM calls
* Network calls
* Token consumption
* Latency
* State management
* Failure points

Sometimes the correct architecture is simply:

```text
Agent
  ↓
Tool
  ↓
Database
```

rather than:

```text
Agent
  ↓
Agent
  ↓
Agent
  ↓
Database
```

---

# Cost and Latency Consideration

Every additional agent can introduce additional processing.

For example:

```text
User
 ↓
Coordinator LLM
 ↓
Delegator LLM
 ↓
Worker LLM
 ↓
Tool
```

Potentially means multiple model calls.

Therefore, I evaluate:

```text
Business value of separation
             VS
Cost + latency + complexity
```

If the separation doesn't provide enough value, I don't create another agent.

---

# The Architecture Principle

I use this principle:

```text
             More Complexity
                   ↑
                   |
            Multi-Agent
                   |
        Meaningful boundaries
                   |
          Single / Few Agents
                   |
             Simple Problem
                   ↓
             Less Complexity
```

The architecture should evolve with business complexity.

---

# Architect-Level Interview Answer

> **“I decided the number of agents based on responsibility boundaries rather than task count. I first decomposed the business problem into capabilities and then looked at domain independence, reasoning specialization, tool and data boundaries, security, scaling, ownership, and lifecycle.**
>
> **If two capabilities were tightly coupled and always executed together, I kept them in the same agent. If a capability had meaningful autonomy, specialized reasoning, independent tools or data, or needed to scale or evolve independently, I considered it a separate agent.**
>
> **I also deliberately avoided turning every function into an agent because that would increase latency, cost, operational complexity, and failure points. So my goal was not to create as many agents as possible; it was to create the minimum number of meaningful autonomous boundaries required by the enterprise use case.”**

---

# One-Line Interview Answer

> **“I determined the agent count from business and architectural boundaries—not from the number of tasks—creating an agent only when a capability had meaningful autonomy, specialization, or independent operational requirements.”**

---

# Memory Trick

```text
Don't ask:

"How many tasks do I have?"

Ask:

"How many meaningful autonomous boundaries do I have?"
```

### Final Principle

> **Business capability → Responsibility boundary → Agent boundary**

And:

> **If it can be a tool, make it a tool. If it needs autonomous reasoning, consider an agent. If it is only workflow logic, keep it in the workflow.**
