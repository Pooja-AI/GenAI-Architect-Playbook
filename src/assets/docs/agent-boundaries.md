# How Did You Define the Responsibility and Boundary of Each Agent?

## Interview Question

**“How did you decide what responsibility each agent should have and where one agent's boundary ends and another begins?”**

---

# Strong Interview Answer

I defined agent responsibilities based on **business capability, reasoning responsibility, data and tool ownership, security boundaries, and independent lifecycle requirements**.

I did not create an agent for every individual task.

I first decomposed the business problem into distinct capabilities and then identified which capabilities required **independent reasoning, specialized knowledge, specialized tools, or independent operational ownership**.

For my architecture, this resulted in three levels:

```text
Coordinator
    ↓
Enterprise-level responsibility

Delegator
    ↓
Domain-level responsibility

Worker
    ↓
Specialized capability / execution responsibility
```

The key principle was:

> **One agent should have one clear responsibility and a well-defined boundary.**

If two agents have almost the same responsibility, I would question whether both agents are actually necessary.

---

# 1. Start With Business Capabilities

I first look at the business problem rather than starting with technology.

For example, suppose the enterprise requirement is:

> **“Analyze a manufacturing defect and identify the probable root cause.”**

I decompose this into capabilities:

```text
Manufacturing Domain
        |
        +-- Image / Defect Analysis
        |
        +-- Historical Knowledge Retrieval
        |
        +-- Sensor Analytics
        |
        +-- Root Cause Analysis
```

Then I ask:

```text
Does this capability require:
    ↓
Independent reasoning?
Specialized model?
Specialized tools?
Specialized data?
Different security?
Independent scaling?
Different ownership?
```

If yes, it may deserve an agent boundary.

---

# 2. Coordinator Boundary

## Responsibility

The Coordinator owns **enterprise-level orchestration**.

It answers:

> **“What does the user need and which business domain should handle it?”**

The Coordinator handles:

* User request understanding
* Intent classification
* Domain identification
* High-level routing
* Cross-domain coordination
* Overall workflow initiation
* Final response coordination

Example:

```text
User:
"Analyze this defect and tell me the probable root cause."

        ↓

Coordinator

        ↓

Domain = Manufacturing
Capabilities =
    image_analysis
    historical_analysis
    root_cause_analysis
```

The Coordinator does **not** need to know how the Vision Worker performs image analysis.

### Coordinator boundary

```text
Coordinator KNOWS:
    ✓ Business domains
    ✓ High-level capabilities
    ✓ Routing policies
    ✓ Authorization requirements

Coordinator DOES NOT KNOW:
    ✗ Worker implementation
    ✗ Model-specific prompts
    ✗ SQL queries
    ✗ Detailed domain execution logic
```

---

# 3. Delegator Boundary

The Delegator owns **domain-level responsibility**.

It answers:

> **“How should this particular business domain solve the request?”**

For example:

```text
Manufacturing Delegator
```

may understand:

```text
Manufacturing capabilities:

    Defect Analysis
    Sensor Analysis
    Historical Analysis
    Root Cause Analysis
```

It decomposes the request:

```text
Manufacturing Request
        |
        +---- Image Analysis
        |
        +---- Historical Search
        |
        +---- Sensor Analysis
        |
        +---- RCA
```

Then it selects the appropriate Workers.

### Delegator boundary

```text
Delegator KNOWS:
    ✓ Domain capabilities
    ✓ Domain rules
    ✓ Worker capabilities
    ✓ Domain task decomposition
    ✓ Worker selection

Delegator DOES NOT KNOW:
    ✗ Enterprise-wide routing
    ✗ Detailed Worker implementation
    ✗ Low-level database implementation
```

---

# 4. Worker Boundary

The Worker owns **one specialized capability**.

For example:

```text
Vision Worker
```

responsibility:

```text
Image
  ↓
Defect Detection
  ↓
Classification
  ↓
Visual Evidence
```

A RAG Worker may own:

```text
Question
  ↓
Query Transformation
  ↓
Retrieval
  ↓
Relevant Evidence
```

A Sensor Analytics Worker may own:

```text
Sensor Data
  ↓
Statistical Analysis
  ↓
Anomaly Detection
  ↓
Findings
```

An RCA Worker may own:

```text
Evidence
   ↓
Correlation
   ↓
Root Cause Reasoning
   ↓
Probable Root Cause
```

### Worker boundary

A Worker should know:

```text
✓ Its capability
✓ Its tools
✓ Its data sources
✓ Its model
✓ Its execution logic
```

It should not know:

```text
✗ The entire enterprise workflow
✗ Every other agent
✗ How the Coordinator routes requests
```

---

# 5. The Boundary Test I Used

For every potential agent, I ask several questions.

## Business Responsibility

> Does this component own a distinct business capability?

## Reasoning Responsibility

> Does it require a different reasoning pattern?

## Knowledge Boundary

> Does it require specialized domain knowledge or context?

## Tool/Data Boundary

> Does it use a distinct set of tools or data sources?

## Security Boundary

> Does it require different authorization or data access?

## Scaling Boundary

> Does it need to scale independently?

## Ownership Boundary

> Could a different team own and evolve this capability independently?

## Lifecycle Boundary

> Does it need to be deployed, versioned, or released independently?

---

# 6. Example Decision

Suppose I identify:

```text
Image Processing
```

I ask:

```text
Does it require a specialized vision model?
YES

Does it have specialized image-processing tools?
YES

Does it have independent logic?
YES

Can it scale independently?
YES

Does it have a distinct capability?
YES
```

Therefore:

```text
→ Vision Worker
```

But suppose I have:

```text
Validate JSON
```

That does not need an agent.

It is deterministic.

Therefore:

```text
→ Utility / Workflow Step
```

Similarly:

```text
SQL query
Database lookup
API call
Calculator
File parsing
Schema validation
```

are generally **tools or deterministic workflow operations**, not separate agents.

---

# 7. Agent vs Tool Boundary

This is an important distinction.

I don't make something an agent just because it performs a task.

### Tool

```text
Input
  ↓
Deterministic Operation
  ↓
Output
```

Example:

```text
Get machine temperature
```

This should probably be:

```text
MCP Tool → Sensor API
```

### Agent

```text
Goal
 ↓
Reason
 ↓
Select approach
 ↓
Use tools
 ↓
Evaluate results
 ↓
Produce conclusion
```

For example:

```text
Root Cause Analysis Agent
```

may decide:

```text
Which evidence should I analyze?
Which tools should I call?
Which hypotheses should I compare?
Is additional evidence required?
What is the probable root cause?
```

That requires reasoning and autonomy.

---

# 8. Agent Boundary Through Tools and Data

Another strong boundary indicator is **tool/data ownership**.

For example:

```text
Vision Worker
    ↓
Vision Model
Image Processing Tools

RAG Worker
    ↓
Vector DB
Knowledge Base
Embedding Model

Analytics Worker
    ↓
SQL
Data Warehouse
Python Analytics

RCA Worker
    ↓
Historical Data
Analytics Results
Domain Knowledge
```

This prevents every agent from having access to every enterprise system.

That provides:

* Better security
* Least privilege
* Smaller context
* Lower coupling
* Easier testing
* Better governance

---

# 9. Security Is Also an Agent Boundary

Suppose:

```text
Finance Data
Manufacturing Data
Customer Data
```

require different access policies.

I don't necessarily want one generic agent to have access to everything.

Instead:

```text
Manufacturing Agent
      ↓
Manufacturing Data

Finance Agent
      ↓
Finance Data
```

Each agent can receive only the permissions required for its responsibility.

This creates a stronger **security boundary**.

---

# 10. Context Boundary

Another important consideration is context.

I don't want to send the entire enterprise context to every agent.

For example:

```text
Coordinator
    |
    | User intent + domain
    ↓
Manufacturing Delegator
    |
    | Defect details + required capability
    ↓
Vision Worker
    |
    | Image + relevant metadata
```

The Vision Worker doesn't need:

```text
User's entire conversation
+
Finance information
+
Unrelated manufacturing records
+
Other agents' internal reasoning
```

It receives only what it needs.

This provides:

> **Scoped context instead of global context.**

---

# 11. Independent Scaling as a Boundary

Suppose:

```text
Vision Analysis
```

receives 10x more traffic than:

```text
RCA
```

If they are separate Workers:

```text
Vision Worker
    → Scale 10 instances

RCA Worker
    → Scale 3 instances
```

We don't have to scale the entire application.

That is another reason for defining the boundary.

---

# 12. Independent Model Selection

Different capabilities may require different models.

For example:

```text
Vision Worker
    → Multimodal model

RAG Worker
    → Embedding + LLM

Analytics Worker
    → Smaller reasoning model + Python

RCA Worker
    → Advanced reasoning model
```

This allows model selection based on the capability instead of forcing one model to perform everything.

---

# 13. Ownership Boundary

In enterprise environments, organizational ownership can also influence the architecture.

For example:

```text
Team A
    → Manufacturing Vision

Team B
    → Knowledge/RAG

Team C
    → Analytics

Team D
    → RCA
```

If these capabilities evolve independently, separate agent boundaries can reduce coordination and deployment coupling.

This is especially useful when agents are independently deployed and communicate through A2A.

---

# 14. What I Did NOT Do

I did **not** follow:

```text
One task = One Agent
```

That can create agent proliferation.

Instead, I followed:

```text
Business Capability
        ↓
Responsibility Boundary
        ↓
Reasoning Boundary
        ↓
Tool/Data Boundary
        ↓
Agent Boundary
```

For example:

```text
"Get temperature"
        ↓
Tool

"Analyze sensor anomalies"
        ↓
Agent

"Determine root cause from multiple evidence sources"
        ↓
Agent
```

---

# 15. My Responsibility Matrix

| Component        | Primary Responsibility | Should Not Own               |
| ---------------- | ---------------------- | ---------------------------- |
| Coordinator      | Enterprise routing     | Worker implementation        |
| Delegator        | Domain decomposition   | Enterprise-wide routing      |
| Vision Worker    | Image analysis         | Overall workflow             |
| RAG Worker       | Knowledge retrieval    | Business-wide routing        |
| Analytics Worker | Data analysis          | Agent orchestration          |
| RCA Worker       | Root-cause reasoning   | Infrastructure orchestration |
| MCP Tool         | Tool/data access       | Autonomous reasoning         |
| LangGraph        | Workflow/state         | Business capability          |
| A2A              | Agent communication    | Workflow decisions           |

---

# 16. How LangGraph Fits the Boundaries

LangGraph is not itself an agent boundary.

It is the **orchestration layer** that connects the boundaries.

```text
                  LangGraph
                     |
          +----------+----------+
          |                     |
    Coordinator            Delegator
                              |
                    +---------+---------+
                    |         |         |
                  Vision     RAG     Analytics
                  Worker    Worker    Worker
```

LangGraph manages:

* State
* Routing
* Transitions
* Parallel execution
* Retries
* Checkpoints
* Termination

The agents own the **business responsibilities**.

---

# 17. How A2A Fits the Boundaries

A2A becomes useful when the boundary is strong enough that agents can be treated as independent services.

For example:

```text
Coordinator
      |
     A2A
      ↓
Manufacturing Delegator
      |
     A2A
      ↓
Vision Worker
```

The architectural boundary becomes stronger when the agent has:

```text
Independent capability
+
Independent lifecycle
+
Independent deployment
+
Independent ownership
+
Clear communication contract
```

If these don't exist, I may keep the components inside the same LangGraph workflow instead of introducing A2A.

---

# 18. A Simple Boundary Formula

I use this mental model:

```text
Agent Boundary =
    Business Responsibility
    +
    Reasoning Responsibility
    +
    Knowledge Boundary
    +
    Tool/Data Boundary
    +
    Security Boundary
    +
    Scaling Boundary
    +
    Ownership/Lifecycle Boundary
```

The more of these boundaries exist, the stronger the justification for a separate agent.

---

# 19. Avoiding Over-Engineering

I also ask:

> **“Can this responsibility be implemented as a deterministic function or tool?”**

If yes:

```text
Don't create an agent.
```

If it needs:

```text
Reasoning + autonomy + specialized capability
```

then:

```text
Consider an agent.
```

If it needs:

```text
Independent deployment + lifecycle + communication
```

then:

```text
Consider an A2A agent boundary.
```

---

# Architect-Level Decision Flow

```text
                 Business Requirement
                         |
                         v
                Identify Capability
                         |
                         v
             Is responsibility distinct?
                    /           \
                  No             Yes
                  |               |
             Keep together        v
                           Requires reasoning?
                              /        \
                            No          Yes
                            |            |
                           Tool          v
                                  Specialized knowledge?
                                      /       \
                                    No         Yes
                                    |           |
                              Same agent       v
                                       Independent boundary?
                                          /          \
                                        No            Yes
                                        |              |
                                  Same workflow    New Agent
                                                       |
                                                A2A if independently
                                                deployed/managed
```

---

# Strong Architect-Level Answer

> **“I defined agent boundaries based on responsibility rather than task count. I started with business capabilities and looked at whether each capability had distinct reasoning, specialized knowledge, tools or data, security requirements, scaling needs, and independent ownership or lifecycle. That led to a three-level boundary in my architecture: the Coordinator owns enterprise-level routing, the Delegator owns domain-level decomposition and worker selection, and Workers own specialized execution capabilities. I intentionally kept deterministic operations such as API calls, database queries, and validation as tools or workflow steps rather than creating agents for them. I also use scoped context and least-privilege access so each agent only sees the data and tools required for its responsibility. If a boundary requires independent deployment or lifecycle, I can expose that agent through A2A; otherwise, I keep it within the LangGraph workflow. The goal is to create the minimum number of meaningful autonomous boundaries, not the maximum number of agents.”**

---

# 30-Second Interview Version

> **“I defined agent boundaries based on business capability, reasoning responsibility, specialized knowledge, tool and data ownership, security, scaling, and independent lifecycle. The Coordinator owns enterprise-level routing, the Delegator owns domain-level decomposition and worker selection, and each Worker owns one specialized capability. I didn't make every task an agent—deterministic operations such as database queries and API calls remain tools. If a capability needs independent reasoning and lifecycle, I create an agent; if it is deterministic, I keep it as a tool or workflow step. So my principle is business capability → responsibility boundary → agent boundary.”**

---

# Memory Trick

## **B-R-K-T-S-S-O**

**B — Business capability**
**R — Reasoning responsibility**
**K — Knowledge boundary**
**T — Tools & data**
**S — Security**
**S — Scaling**
**O — Ownership / lifecycle**

### One-line memory:

> **“I create an agent when there is a meaningful boundary in capability, reasoning, data, security, scaling, or ownership.”**

---

# Golden Architect Principle

> **“Don't create agents around tasks. Create agents around meaningful responsibility boundaries.”**

And the three most important boundaries in your architecture are:

```text
Coordinator → WHICH DOMAIN?

Delegator   → WHICH CAPABILITY?

Worker      → EXECUTE THE CAPABILITY
```

That is the cleanest way to explain **why your Coordinator → Delegator → Worker hierarchy exists**.
