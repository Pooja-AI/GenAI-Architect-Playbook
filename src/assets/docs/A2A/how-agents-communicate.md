# How Do Two Agents Communicate?

## Interview Question

**“How do two agents communicate with each other in an Agentic AI system?”**

---

# 1. Strong Interview Answer

> **“Two agents communicate by exchanging structured agent-to-agent messages through an A2A communication channel. The calling agent identifies the required capability, discovers or selects the target agent, creates a task, sends the required context, and the receiving agent processes the task and returns status updates and a structured result. The communication can be synchronous or asynchronous depending on the use case.”**

In simple terms:

```text
Agent A
   |
   | A2A Request
   | Task + Context
   v
Agent B
   |
   | A2A Response
   | Status + Result
   v
Agent A
```

---

# 2. What Actually Happens?

The communication typically follows these steps:

```text
1. Agent A determines what capability it needs
                 ↓
2. Agent A discovers Agent B
                 ↓
3. Agent A validates capability and authorization
                 ↓
4. Agent A creates a task
                 ↓
5. Agent A sends task + context to Agent B
                 ↓
6. Agent B accepts/processes the task
                 ↓
7. Agent B sends status updates if required
                 ↓
8. Agent B produces a result/artifact
                 ↓
9. Agent B returns the result
                 ↓
10. Agent A validates and continues its workflow
```

---

# 3. Example

Suppose:

```text
Agent A = Manufacturing Delegator

Agent B = Vision Agent
```

Agent A needs image analysis.

```text
Manufacturing Delegator
        |
        | "Analyze this defect image"
        v
    Vision Agent
```

The important point is that Agent A doesn't need to know how Agent B internally performs image analysis.

Agent A only needs to know:

```text
Capability:
image_analysis

Input:
image + required context

Output:
defect classification + evidence
```

---

# 4. CWD Example

In my CWD Multi-Agent Enterprise Assistant, suppose the user asks:

> **“Analyze this manufacturing defect and identify the probable root cause.”**

The workflow starts:

```text
User
 ↓
Coordinator
 ↓
Manufacturing Delegator
```

The Manufacturing Delegator determines that it needs:

```text
Image Analysis
Historical Retrieval
Telemetry Analysis
Root Cause Analysis
```

---

# 5. Agent-to-Agent Communication

The Delegator communicates with the Vision Agent.

```text
Manufacturing Delegator
          |
         A2A
          |
          v
      Vision Agent
```

Conceptually, the request contains:

```json
{
  "task_id": "TASK-001",
  "capability": "image_analysis",
  "context": {
    "machine_id": "M-102",
    "defect_type": "unknown"
  },
  "input": {
    "image": "defect-image"
  }
}
```

The Vision Agent receives the task.

---

# 6. What Does the Receiving Agent Do?

The Vision Agent may internally perform:

```text
A2A Request
    ↓
Validate Request
    ↓
Understand Task
    ↓
Select Model
    ↓
Use Tools
    ↓
Perform Reasoning
    ↓
Generate Result
```

For example:

```text
Vision Agent
     |
     v
Multimodal Model
     |
     v
Defect Detection
     |
     v
Evidence Extraction
```

The Vision Agent might also use MCP:

```text
Vision Agent
      |
     MCP
      |
      v
Image Processing Tool
```

Notice:

```text
A2A → Delegator ↔ Vision Agent

MCP → Vision Agent ↔ Image Tool
```

---

# 7. Agent B Returns the Result

The Vision Agent returns a structured result.

Conceptually:

```json
{
  "task_id": "TASK-001",
  "status": "COMPLETED",
  "result": {
    "defect_type": "surface_crack",
    "confidence": 0.93,
    "evidence": [
      "Linear crack pattern detected",
      "Defect located near component edge"
    ]
  }
}
```

The Delegator receives it and adds the result to the workflow state.

---

# 8. Communication Is Not Just "Request → Response"

This is important for an architect-level answer.

Agent communication can involve a **task lifecycle**.

```text
SUBMITTED
    ↓
WORKING
    ↓
INPUT_REQUIRED
    ↓
WORKING
    ↓
COMPLETED
```

Or:

```text
SUBMITTED
    ↓
WORKING
    ↓
FAILED
```

This is useful for long-running agent tasks.

For example:

```text
Manufacturing Delegator
          |
         A2A
          |
     Vision Agent
          |
       WORKING
          |
      Processing
          |
      COMPLETED
          |
       Result
```

---

# 9. Synchronous Communication

For a quick operation:

```text
Agent A
   |
   | Request
   v
Agent B
   |
   | Response
   v
Agent A
```

Example:

```text
Delegator
    |
    | Analyze image
    v
Vision Agent
    |
    | Result
    v
Delegator
```

This is appropriate when the response is expected quickly.

---

# 10. Asynchronous Communication

For long-running tasks:

```text
Agent A
   |
   | Submit Task
   v
Agent B
   |
   | Task Accepted
   |
   |........ processing ........|
   |
   | Status Update
   |
   |........ processing ........|
   |
   | Final Result
   v
Agent A
```

This is useful for:

* Large document analysis
* Complex investigations
* Long-running workflows
* Human-in-the-loop tasks
* Batch processing

---

# 11. How Does Agent A Find Agent B?

Agent A should not necessarily hardcode every agent endpoint.

It can use:

```text
Agent Registry
       ↓
Capability Discovery
       ↓
Agent Card / Metadata
       ↓
Agent Selection
```

For example:

```text
Required capability:
image_analysis
```

Registry:

```text
Vision-Agent-1
Vision-Agent-2
Vision-Agent-3
```

The system can evaluate:

```text
Capability
Health
Authorization
Availability
Latency
Cost
Version
```

and select an appropriate agent.

---

# 12. Authentication and Authorization

Before communication:

```text
Agent A
   |
   v
Authenticate
   |
   v
Authorize
   |
   v
Agent B
```

For enterprise environments, communication may involve:

```text
OAuth / OIDC
mTLS
JWT
API Gateway
RBAC
Network Policies
```

Important distinction:

> **Discovery tells us which agent exists. Authorization tells us whether Agent A is allowed to invoke Agent B.**

---

# 13. How Does Agent A Know What Agent B Can Do?

Through agent capability metadata.

For example:

```json
{
  "agent": "vision-agent",
  "capabilities": [
    "image_analysis",
    "defect_detection",
    "visual_classification"
  ]
}
```

Agent A can determine:

```text
"I need image_analysis"

        ↓

"Vision Agent provides image_analysis"

        ↓

"Invoke Vision Agent"
```

This is **capability-based communication**.

---

# 14. Does Agent A Send Its Entire Context?

**No.**

A good enterprise architecture uses **scoped context**.

For example:

```text
Delegator
    |
    | Sends:
    | - Task
    | - Machine ID
    | - Defect image
    | - Relevant context
    ↓
Vision Agent
```

It should not send:

```text
Entire conversation
Entire enterprise state
Unrelated business information
Other agents' private context
Sensitive data not required for the task
```

This helps reduce:

```text
Token cost
Latency
Data exposure
Context confusion
Coupling
```

---

# 15. What Happens After Agent B Responds?

Agent A validates the response.

For example:

```text
Result received
      ↓
Schema validation
      ↓
Business validation
      ↓
Confidence/evidence validation
      ↓
Accept result
      ↓
Continue workflow
```

If the result is invalid:

```text
Result
  ↓
Validation failed
  ↓
Retry / fallback / re-plan / escalate
```

The LLM should not be the only mechanism deciding whether a result is valid.

---

# 16. Multiple Agents Communicating

In CWD, several agents may participate:

```text
                    Manufacturing
                      Delegator
                    /     |      \
                  A2A    A2A      A2A
                   /       |        \
                  v        v         v
              Vision      RAG    Analytics
                Agent     Agent      Agent
                  \        |        /
                   \       |       /
                    \      |      /
                         RCA
                         Agent
```

The Delegator may execute independent tasks in parallel.

For example:

```text
             Manufacturing Delegator
                    /       |       \
                   /        |        \
              Vision       RAG     Analytics
                 |           |          |
              2 sec        1 sec       3 sec
                   \        |        /
                    \       |       /
                         RCA
```

The RCA Agent receives the required results and performs final reasoning.

---

# 17. Who Controls the Communication?

This is an important distinction.

**A2A provides the communication mechanism.**

The **orchestration layer** controls:

```text
Which agent can communicate
When it can communicate
What task it can perform
Maximum retries
Timeout
Allowed transitions
Termination
Fallback
```

In my architecture:

```text
LangGraph
     |
     | Controls workflow
     v
A2A
     |
     | Enables agent communication
     v
Agent
```

So:

> **A2A enables communication; LangGraph controls the workflow around that communication.**

---

# 18. How Do We Prevent Infinite Agent-to-Agent Calls?

Consider:

```text
Agent A
   ↓
Agent B
   ↓
Agent A
   ↓
Agent B
   ↓
...
```

The orchestration layer should enforce:

```text
Maximum hops
Maximum iterations
Timeout
Retry limit
Cycle detection
Allowed transitions
Termination conditions
Task IDs
```

Example:

```text
MAX_AGENT_HOPS = 5
MAX_RETRIES = 2
MAX_EXECUTION_TIME = 60 seconds
```

If the limit is reached:

```text
Agent Loop Detected
        ↓
Stop Workflow
        ↓
Fallback / Human Escalation
```

---

# 19. What If Agent B Fails?

Agent A should not simply wait forever.

A failure-handling flow could be:

```text
A2A Request
     ↓
Agent B
     ↓
Timeout
     ↓
Classify Failure
     ↓
+-------------------+
|                   |
Transient          Persistent
|                   |
Retry               Fallback
|                   |
+---------+---------+
          ↓
      Continue /
      Partial /
      Escalate
```

For example:

```text
Vision Agent
     |
   TIMEOUT
     |
     v
Retry
     |
     v
Fallback Vision Agent
```

---

# 20. A2A Communication vs Traditional API Call

Traditional REST:

```text
Service A
    |
   REST
    |
Service B
```

A2A:

```text
Agent A
    |
   A2A
    |
Agent B
```

The important difference is the **interaction abstraction**.

A traditional API usually focuses on:

```text
Endpoint
Request
Response
```

Agent-oriented communication additionally considers:

```text
Agent identity
Capabilities
Tasks
Context
Task lifecycle
Status
Artifacts
Agent discovery
```

---

# 21. A2A + MCP Together

An agent can receive work from another agent using A2A and then use MCP to perform the work.

```text
Agent A
   |
  A2A
   |
   v
Agent B
   |
  MCP
   |
   +---- Database
   +---- API
   +---- Search
   +---- File System
   +---- Enterprise Tool
```

Example:

```text
Manufacturing Delegator
          |
         A2A
          |
      RAG Agent
          |
         MCP
          |
          v
   Knowledge Repository
```

This is a very common enterprise pattern.

---

# 22. A2A + MCP + LangGraph

The complete relationship is:

```text
                   LangGraph
                Workflow/State
                      |
                      v
              Manufacturing
                 Delegator
                      |
                     A2A
                      |
                      v
                   Agent
                      |
                     MCP
                      |
                      v
                Tool / Data
```

### Responsibilities

```text
LangGraph
→ Orchestration

A2A
→ Agent-to-Agent Communication

MCP
→ Tool/Data Access
```

---

# 23. Strong Architect-Level Explanation

> **“I treat agent-to-agent communication as a distributed-system interaction rather than simply an LLM-to-LLM call. The calling agent first identifies the required capability, discovers and selects the target agent, validates authorization, creates a task, and sends only the required context. The receiving agent processes the task, potentially using its own LLM and MCP tools, and returns task status and a structured result. The orchestration layer maintains the workflow state, validates the result, and decides whether to continue, retry, fall back, or escalate. In my CWD architecture, A2A provides the communication boundary between independently managed Coordinator, Delegator, and Worker agents, while LangGraph manages the workflow and MCP provides access to enterprise tools and data.”**

---

# 24. 30-Second Interview Answer

> **“Two agents communicate through an A2A interaction where one agent acts as the client and another provides the required capability. The calling agent discovers the target agent, validates its capability and authorization, creates a task, and sends the required context. The receiving agent processes the task and returns status and a structured result. In my CWD example, the Manufacturing Delegator can send an image-analysis task to the Vision Agent using A2A. The Vision Agent may then use MCP to access image-processing tools and returns the analysis through A2A. LangGraph manages the overall workflow and state around these interactions.”**

---

# 25. Interview Follow-Up Questions

After explaining this, an interviewer may ask:

### Q1. How does an agent discover another agent?

**Answer:**

> Through an Agent Registry, Agent Card, or another discovery mechanism based on capabilities and metadata.

### Q2. Does A2A replace REST?

**Answer:**

> No. REST/gRPC remain appropriate for traditional service-to-service communication. A2A provides an agent-oriented interaction model.

### Q3. Does A2A replace MCP?

**Answer:**

> No. A2A is Agent ↔ Agent, while MCP is Agent ↔ Tool/Data/Resource.

### Q4. Who controls the workflow?

**Answer:**

> The orchestration layer, such as LangGraph, controls workflow state, routing, retries, and termination. A2A provides the communication boundary.

### Q5. What happens if the target agent fails?

**Answer:**

> Use timeout, bounded retry, fallback agent, circuit breaker, partial results, or human escalation depending on the failure and business criticality.

---

# Final Memory Model

```text
                 USER
                   |
                   v
              Coordinator
                   |
              LangGraph
             "What next?"
                   |
                   v
              Delegator
                   |
                  A2A
             "Talk to Agent"
                   |
                   v
             Worker Agent
                   |
                  MCP
             "Use Tool/Data"
                   |
                   v
          Enterprise Systems
```

## Golden Interview Line

> **“A2A is not simply an API call between two LLMs. It provides an agent-to-agent interaction boundary where agents can discover capabilities, exchange tasks and context, track execution, and return results, while the orchestration layer controls the overall workflow.”**
