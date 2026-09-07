# Context Propagation Across Coordinator, Delegator, and Worker in CWD

**Core principle:**

> **Propagate the minimum authorized context required for the next execution step—not the entire conversation or workflow state.**

In a production CWD architecture, context propagation is what allows independently executing agents to remain coordinated without creating a giant shared context containing every message, tool result, prompt, credential, and intermediate state.

---

## 1. What Is Context Propagation?

Context propagation is the controlled movement of relevant information across:

```text
User
  │
  ▼
Coordinator
  │
  │  Authorized task context
  ▼
Delegator
  │
  │  Minimal execution context
  ▼
Worker
  │
  │
  ├── MCP Tool
  ├── RAG
  └── Enterprise API
```

The important point is that **context is transformed at each boundary**.

The Coordinator should not simply forward its entire state to the Delegator.

The Delegator should not forward its entire state to every Worker.

Instead:

```text
Full Context
     │
     ▼
Context Selection
     │
     ▼
Authorization
     │
     ▼
Context Projection
     │
     ▼
Next Agent
```

---

# 2. Why Context Propagation Is Difficult

A CWD workflow can contain:

* user messages
* conversation history
* identity information
* entitlements
* business objects
* intent
* domain
* workflow state
* task state
* previous agent results
* RAG results
* tool results
* decisions
* prompt versions
* model information
* correlation IDs
* security metadata
* errors
* approvals
* intermediate outputs

If everything is passed everywhere:

```text
Coordinator
    │
    ├── entire conversation
    ├── all RAG documents
    ├── all tool outputs
    ├── all Worker results
    ├── all security claims
    └── entire workflow state
            │
            ▼
        Delegator
            │
            └── EVERYTHING
                    │
                    ▼
                 Worker
```

This creates:

* context-window growth
* higher token cost
* increased latency
* sensitive-data leakage
* accidental cross-domain exposure
* prompt-injection propagation
* duplicated information
* difficult debugging
* poor scalability
* unclear ownership of state

Therefore, CWD needs **controlled context propagation**.

---

# 3. Context Is Not the Same as State

This distinction is extremely important.

| Concept            | Purpose                               |
| ------------------ | ------------------------------------- |
| Session state      | Overall user interaction              |
| Conversation state | Conversation history                  |
| Turn state         | One request/response                  |
| Workflow state     | Current orchestration execution       |
| Task state         | Objective being executed              |
| Run state          | Specific execution attempt            |
| Step state         | Individual execution action           |
| Context            | Information needed by the next action |
| Memory             | Information intentionally retained    |
| RAG evidence       | Enterprise knowledge                  |
| Execution metadata | Information required for traceability |

Therefore:

```text
State ≠ Context
```

Instead:

```text
State
  │
  ├── identity
  ├── workflow
  ├── tasks
  ├── results
  ├── metadata
  └── history
        │
        ▼
 Context Selection
        │
        ▼
   Context Projection
```

---

# 4. The Coordinator's Context

The Coordinator has the broadest context because it owns the enterprise-level objective.

It may know:

```text
User request
Identity
Session
Conversation
Intent
Domain
Business objective
Workflow
Enterprise constraints
Agent discovery
Delegation decisions
Delegator results
Security context
Correlation IDs
```

For example:

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",

  "user_request": "Why is shipment SHIP123 delayed?",

  "intent": "root_cause_analysis",
  "domain": "logistics",

  "business_object": {
    "type": "shipment",
    "id": "SHIP123"
  },

  "constraints": {
    "priority": "high",
    "deadline_ms": 10000
  },

  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ]
}
```

The Coordinator does **not** necessarily send all of this to every downstream component.

It creates a **context projection**.

---

# 5. Coordinator → Delegator Context

The Delegator needs enough information to perform domain-level orchestration.

It generally needs:

```text
Task objective
Business object
Relevant constraints
Required capability
Correlation metadata
Security context/reference
Relevant prior results
Expected output
```

For example:

```json
{
  "task_id": "DT-5001",
  "parent_task_id": "WF-1001",

  "correlation_id": "CORR-7890",

  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",

  "objective": "Investigate shipment delay",

  "domain": "logistics",

  "business_object": {
    "type": "shipment",
    "id": "SHIP123"
  },

  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ],

  "constraints": {
    "priority": "high",
    "deadline_ms": 10000
  },

  "security_context": {
    "identity_reference": "IDCTX-123",
    "scope_reference": "SCOPE-456"
  },

  "expected_output": {
    "shipment_status": true,
    "root_cause": true
  }
}
```

Notice what is **not** included:

* entire conversation history
* unrelated RAG documents
* unrelated Worker results
* raw authentication tokens
* secrets
* unrelated user preferences
* every Coordinator state field

This is **context minimization**.

---

# 6. Delegator Context

The Delegator receives the Coordinator's projection and creates smaller context projections for Workers.

For example:

```text
Coordinator
     │
     │ "Investigate shipment SHIP123"
     ▼
Shipping Delegator
     │
     ├── Tracking Worker
     │
     ├── Carrier Worker
     │
     └── Delay Analysis Worker
```

The Delegator might create:

### Tracking Worker

```json
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",

  "objective": "Retrieve shipment tracking events",

  "business_object": {
    "shipment_id": "SHIP123"
  },

  "required_capability": "shipment_tracking",

  "constraints": {
    "timeout_ms": 5000
  }
}
```

### Carrier Worker

```json
{
  "task_id": "WT-1002",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",

  "objective": "Retrieve carrier status",

  "business_object": {
    "shipment_id": "SHIP123"
  },

  "required_capability": "carrier_status",

  "constraints": {
    "timeout_ms": 3000
  }
}
```

Each Worker receives **only the context required for its task**.

---

# 7. Worker Context

A Worker should receive the smallest practical execution context.

For example:

```text
Worker Context
    │
    ├── task identity
    ├── objective
    ├── input
    ├── required capability
    ├── authorization reference
    ├── correlation metadata
    ├── constraints
    └── relevant evidence
```

The Worker should not receive:

```text
Entire conversation
Entire workflow
Other Workers' private state
Unrelated RAG documents
Other domains' data
Secrets
Unnecessary user information
```

This follows the principle:

> **Need-to-know context, not everything-known context.**

---

# 8. Context Projection

A useful architectural pattern is **Context Projection**.

Instead of:

```python
worker_context = coordinator_state
```

use:

```python
worker_context = {
    "task_id": task["task_id"],
    "correlation_id": task["correlation_id"],
    "objective": task["objective"],
    "input": task["input"],
    "constraints": task["constraints"],
    "security_context": task["security_context"]
}
```

Conceptually:

```text
              Coordinator State
                     │
          ┌──────────┴──────────┐
          │                     │
     Relevant Data          Irrelevant Data
          │                     │
          ▼                     X
    Authorization
          │
          ▼
    Context Projection
          │
          ▼
       Delegator
```

---

# 9. Context Propagation Does Not Mean Copying Data

A very important production principle is:

> **Propagate references instead of large payloads whenever possible.**

Instead of:

```json
{
  "retrieved_documents": [
    "...500 pages..."
  ]
}
```

use:

```json
{
  "evidence_references": [
    "RAG-RESULT-1001",
    "RAG-RESULT-1002"
  ]
}
```

The Worker can retrieve the authorized information when needed.

Similarly:

```text
Large Tool Result
       │
       ▼
Object Storage / Cosmos DB
       │
       ▼
Result Reference
       │
       ▼
Next Agent
```

This keeps agent messages small.

---

# 10. Execution Metadata Must Always Propagate

Context minimization does **not** mean removing execution metadata.

Certain metadata should travel through the entire workflow.

For example:

```text
correlation_id
workflow_id
task_id
parent_task_id
run_id
step_id
message_id
tenant_id
source_agent
target_agent
```

A typical hierarchy is:

```text
Correlation ID
      │
      ▼
Workflow ID
      │
      ├── Task A
      │     ├── Run A1
      │     │     ├── Step A1-1
      │     │     └── Step A1-2
      │     │
      │     └── Run A2
      │
      └── Task B
            └── Run B1
```

This lets CWD answer:

> Which user request caused this Worker execution?

---

# 11. Correlation Metadata vs Business Context

Do not confuse these.

### Execution metadata

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-002"
}
```

### Business context

```json
{
  "shipment_id": "SHIP123",
  "carrier": "ABC",
  "region": "US",
  "business_unit": "Operations"
}
```

Both may propagate, but for different reasons.

```text
Execution Metadata
        │
        └── Traceability / Recovery / Audit

Business Context
        │
        └── Correct Task Execution
```

---

# 12. Security Boundaries

Context propagation is also a **security boundary**.

A Worker should not automatically inherit every privilege or piece of information possessed by the Coordinator.

For example:

```text
Coordinator
   │
   │ User identity + authorization reference
   ▼
Delegator
   │
   │ Domain-scoped authorization
   ▼
Worker
   │
   │ Tool-specific permission
   ▼
MCP Server
   │
   ▼
Enterprise System
```

At each boundary:

```text
Authenticate
     ↓
Identify
     ↓
Authorize
     ↓
Validate Context
     ↓
Execute
```

---

# 13. Identity Propagation

CWD may need to preserve multiple identities:

```text
Human User
     │
     ▼
Coordinator Identity
     │
     ▼
Delegator Identity
     │
     ▼
Worker Identity
     │
     ▼
MCP / Enterprise Service Identity
```

The system should distinguish:

```text
Who initiated the request?
Who is executing the task?
What is the agent allowed to do?
What data can the user access?
```

Do **not** simply copy authentication tokens into every prompt or context object.

Instead use secure identity/token mechanisms and references.

---

# 14. Authorization Must Be Re-Evaluated

A crucial principle:

> **Context propagation does not equal authorization propagation.**

Suppose the Coordinator knows:

```text
User can access Finance + Logistics
```

That does not mean every Worker should automatically receive Finance data.

The Worker should operate within its own authorized scope.

For RAG:

```text
User Entitlements
       │
       ▼
Security Filter
       │
       ▼
Authorized Documents
       │
       ▼
Worker
```

For MCP:

```text
Worker
   │
   ▼
Tool Permission
   │
   ▼
Resource Permission
   │
   ▼
Enterprise API
```

---

# 15. Context Classification

A production CWD system can classify context.

| Context Type | Example                 | Propagation          |
| ------------ | ----------------------- | -------------------- |
| Required     | Task objective          | Yes                  |
| Required     | Task ID                 | Yes                  |
| Required     | Correlation ID          | Yes                  |
| Relevant     | Shipment ID             | Yes                  |
| Relevant     | Authorized RAG evidence | Usually              |
| Optional     | Conversation summary    | Sometimes            |
| Unnecessary  | Old unrelated turns     | No                   |
| Sensitive    | Credentials             | Never through prompt |
| Restricted   | Unrelated employee data | No                   |
| Large        | Raw documents           | Reference instead    |

This makes context propagation a governed process.

---

# 16. Context Selection Algorithm

Conceptually:

```python
def build_context(source_state, target_agent, task):
    context = {}

    # 1. Execution metadata
    context["correlation_id"] = source_state["correlation_id"]
    context["workflow_id"] = source_state["workflow_id"]
    context["task_id"] = task["task_id"]

    # 2. Task information
    context["objective"] = task["objective"]
    context["input"] = task["input"]

    # 3. Relevant business context
    context["business_context"] = select_relevant_business_context(
        source_state,
        task
    )

    # 4. Security context
    context["security_context"] = build_authorized_security_context(
        source_state,
        target_agent,
        task
    )

    # 5. Relevant evidence
    context["evidence"] = select_relevant_evidence(
        source_state,
        task
    )

    # 6. Remove unnecessary fields
    context = minimize_context(context)

    # 7. Validate
    validate_context(context, target_agent)

    return context
```

The important architecture is:

```text
Source State
     │
     ▼
Relevance Selection
     │
     ▼
Security Filtering
     │
     ▼
Scope Filtering
     │
     ▼
Context Minimization
     │
     ▼
Schema Validation
     │
     ▼
Target Agent
```

---

# 17. Context Relevance Scoring

Context selection can conceptually use:

```text
ContextScore =
    Relevance
  + TaskScope
  + Recency
  + Authority
  + BusinessApplicability
  + Dependency
  - Redundancy
  - SensitivityRisk
  - TokenCost
```

Only information above an appropriate threshold should be propagated.

For example:

```text
Candidate Context
       │
       ├── Relevant? ──────── No → Remove
       │
       ├── Authorized? ───── No → Remove
       │
       ├── In Scope? ─────── No → Remove
       │
       ├── Valid? ────────── No → Remove
       │
       ├── Too Large? ────── Yes → Summarize/Reference
       │
       ▼
   Propagate
```

---

# 18. Context Growth Problem

Consider a workflow:

```text
Turn
 │
 ▼
Coordinator
 │
 ▼
Delegator
 │
 ├── Worker A
 │     └── 10 tool results
 │
 ├── Worker B
 │     └── 20 tool results
 │
 └── Worker C
       └── 15 tool results
```

If everything is merged:

```text
Coordinator Context
       │
       ▼
Delegator Context
       │
       ▼
Worker Context
       │
       ▼
More Results
       │
       ▼
Larger Context
       │
       ▼
Even Larger Context
```

This produces **context explosion**.

---

# 19. Techniques to Prevent Context Growth

### 1. Summarization

Instead of:

```text
50 tool responses
```

store:

```text
Validated summary
```

Example:

```json
{
  "summary": "Shipment departed Dallas but carrier capacity constraints caused a 24-hour delay.",
  "source_references": [
    "RESULT-001",
    "RESULT-004"
  ]
}
```

---

### 2. Reference-Based Context

Instead of propagating large content:

```json
{
  "result_reference": "RESULT-1001"
}
```

---

### 3. Context Filtering

Remove information irrelevant to the next task.

---

### 4. Scope-Based Propagation

```text
Coordinator context
       ↓
Enterprise scope

Delegator context
       ↓
Domain scope

Worker context
       ↓
Task scope
```

---

### 5. TTL

Temporary context should expire.

For example:

```text
Short-term context → Redis → TTL
Execution state → Cosmos DB
Long-term memory → Persistent Memory
```

---

### 6. Checkpoint References

LangGraph state can reference large artifacts rather than embedding them directly.

---

# 20. LangGraph's Role

LangGraph can maintain workflow state such as:

```python
state = {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",

    "intent": "root_cause_analysis",

    "delegator_results": [],

    "tasks": [],

    "current_node": "delegation"
}
```

But the entire LangGraph state should **not automatically become the prompt**.

Instead:

```text
LangGraph State
      │
      ▼
Context Builder
      │
      ├── select
      ├── filter
      ├── authorize
      ├── summarize
      └── reference
      │
      ▼
LLM / Delegator / Worker
```

This is one of the most important design principles.

> **Workflow state is larger than LLM context.**

---

# 21. Context Propagation with A2A

At agent boundaries, A2A can carry the structured task and relevant context.

```text
Coordinator
    │
    │ A2A
    │
    ▼
Delegator
    │
    │ A2A / internal task contract
    │
    ▼
Worker
```

The A2A message should contain:

```text
Task identity
Correlation
Objective
Relevant context
Constraints
Expected output
Security references
```

Not:

```text
Entire Coordinator state
```

---

# 22. Context Propagation with MCP

At the Worker boundary:

```text
Worker
   │
   ▼
MCP Client
   │
   ▼
MCP Server
   │
   ▼
Enterprise System
```

The Worker should provide the tool with the minimum required arguments.

Example:

```json
{
  "shipment_id": "SHIP123"
}
```

rather than:

```json
{
  "entire_conversation": "...",
  "entire_workflow": "...",
  "all_rag_results": "...",
  "all_previous_tool_calls": "...",
  "shipment_id": "SHIP123"
}
```

This is both a **security** and **performance** improvement.

---

# 23. Context Propagation Across the Complete CWD

The complete pattern becomes:

```text
                    USER
                      │
                      ▼
                  GATEWAY
                      │
                      ▼
                COORDINATOR
                      │
          ┌───────────┴───────────┐
          │                       │
     Full Workflow          Enterprise Context
          │                       │
          └───────────┬───────────┘
                      │
               Context Builder
                      │
             Authorized Projection
                      │
                    A2A
                      │
                      ▼
                 DELEGATOR
                      │
               Domain Context
                      │
               Context Builder
                      │
             Task-Level Projection
                      │
                      ▼
                    WORKER
                      │
            ┌─────────┴─────────┐
            │                   │
           RAG                 MCP
            │                   │
            ▼                   ▼
       Knowledge          Enterprise APIs
```

And results flow back upward:

```text
Enterprise System
       │
       ▼
     Worker
       │
       │ validated result
       ▼
   Delegator
       │
       │ aggregated domain result
       ▼
  Coordinator
       │
       │ enterprise result
       ▼
      User
```

---

# 24. Context Transformation at Each Boundary

A very useful architectural model is:

```text
Coordinator
   │
   │ Enterprise Context
   ▼
Delegator
   │
   │ Domain Context
   ▼
Worker
   │
   │ Execution Context
   ▼
Tool / System
```

Therefore:

### Coordinator

```text
Enterprise Context
```

### Delegator

```text
Domain Context
```

### Worker

```text
Task Execution Context
```

### MCP

```text
Tool Input Context
```

This progressively reduces the context surface.

---

# 25. Context Ownership

Each component should own its context.

| Component   | Context Ownership           |
| ----------- | --------------------------- |
| Gateway     | Request/session/identity    |
| Coordinator | Enterprise workflow         |
| Delegator   | Domain orchestration        |
| Worker      | Task execution              |
| LangGraph   | Workflow state/transitions  |
| Redis       | Short-lived working context |
| Cosmos DB   | Durable operational state   |
| Vector DB   | Semantic memory             |
| RAG         | Enterprise evidence         |
| Policy/IAM  | Authorization               |
| MCP         | Tool/system boundary        |
| Service Bus | Message delivery            |

This prevents a common anti-pattern:

> **Every agent becomes responsible for every piece of state.**

---

# 26. Context Propagation and Memory

Memory should also be selectively propagated.

Suppose persistent memory contains:

```text
User prefers concise reports
Previous project = Project A
Old shipment issue = XYZ
Favorite dashboard = Operations
```

A Worker performing shipment tracking does not need all four.

It might need:

```text
Current shipment = SHIP123
```

The context builder determines:

```text
Memory
  │
  ▼
Semantic Relevance
  │
  ▼
Task Scope
  │
  ▼
Authorization
  │
  ▼
Relevant Memory
```

---

# 27. Context Propagation and RAG

RAG follows the same principle.

Don't propagate:

```text
100 retrieved documents
```

Instead:

```text
Query
 ↓
Retrieve
 ↓
Security Filter
 ↓
Rank
 ↓
Deduplicate
 ↓
Select
 ↓
Context Assembly
 ↓
Worker/LLM
```

So:

```text
RAG Corpus
    ↓
Relevant + Authorized Evidence
    ↓
Context Projection
    ↓
LLM
```

---

# 28. Context Propagation and Human-in-the-Loop

Suppose a workflow requires approval.

The system should persist:

```json
{
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "step_id": "STEP-007",
  "correlation_id": "CORR-7890",
  "status": "waiting_for_approval",
  "context_reference": "CTX-5001"
}
```

After approval:

```text
Approval
   │
   ▼
Retrieve Context
   │
   ▼
Authorize Again
   │
   ▼
Resume LangGraph
   │
   ▼
Continue Execution
```

Do not assume that a previously captured context remains authorized forever.

---

# 29. Context Propagation and Async Execution

With Azure Service Bus:

```text
Coordinator
    │
    │ A2A task
    ▼
Service Bus
    │
    ▼
Delegator
    │
    │ Worker tasks
    ▼
Service Bus
    │
    ▼
Workers
```

The message should carry execution identifiers:

```json
{
  "message_id": "MSG-1001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001"
}
```

Large context should remain in durable stores and be referenced.

---

# 30. Context Propagation and Failure Recovery

Suppose Worker A fails.

The Delegator should be able to recover using:

```text
Task ID
Run ID
Correlation ID
Current status
Previous results
Retry count
Required capability
Constraints
```

It does not need the entire Coordinator conversation.

Example:

```text
Worker A
   │
   X Failure
   │
   ▼
Delegator
   │
   ├── Retry?
   ├── Select alternate Worker?
   ├── Replan?
   └── Escalate?
```

Because execution metadata was preserved, recovery remains correlated.

---

# 31. Context Propagation Contract

A strong CWD implementation can define a standard context envelope:

```json
{
  "execution": {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",
    "task_id": "WT-1001",
    "run_id": "RUN-003",
    "step_id": "STEP-002",
    "parent_task_id": "DT-5001"
  },

  "identity": {
    "user_reference": "USER-REF-123",
    "agent_id": "tracking-worker"
  },

  "objective": {
    "capability": "shipment_tracking",
    "action": "get_tracking_events"
  },

  "business_context": {
    "shipment_id": "SHIP123"
  },

  "constraints": {
    "timeout_ms": 5000,
    "priority": "high"
  },

  "evidence": {
    "references": []
  },

  "security": {
    "scope_reference": "SCOPE-456",
    "classification": "internal"
  }
}
```

This gives every agent a predictable structure.

---

# 32. Context Validation

Before accepting propagated context:

```python
def validate_context(context):

    required = [
        "execution",
        "objective",
        "security"
    ]

    for field in required:
        if field not in context:
            raise ValueError(f"Missing {field}")

    if not context["execution"]["correlation_id"]:
        raise ValueError("Missing correlation ID")

    if not context["objective"]["capability"]:
        raise ValueError("Missing capability")

    validate_security_context(context["security"])

    return True
```

Then:

```text
Receive
  ↓
Schema Validation
  ↓
Identity Validation
  ↓
Authorization
  ↓
Scope Validation
  ↓
Business Validation
  ↓
Execute
```

---

# 33. Anti-Patterns

### ❌ 1. Passing the entire conversation

```text
Coordinator → Delegator → Worker
      EVERYTHING
```

Creates unnecessary context and leakage risk.

---

### ❌ 2. Sharing entire LangGraph state

Workflow state ≠ LLM context.

---

### ❌ 3. Passing raw authentication tokens

Secrets should not be treated as conversational context.

---

### ❌ 4. Passing all RAG results

Use filtering, ranking, deduplication and references.

---

### ❌ 5. Passing every Worker result to every Worker

Workers should receive only relevant results.

---

### ❌ 6. Losing correlation metadata

This breaks:

* tracing
* debugging
* audit
* recovery
* asynchronous workflows

---

### ❌ 7. Treating memory as authorization

```text
Memory says user can access X
```

does **not** mean:

```text
User is authorized for X
```

---

### ❌ 8. Letting the LLM decide what sensitive context it can access

The LLM can recommend context usage.

Policy/runtime controls actual access.

---

# 34. Recommended CWD Context Architecture

```text
                         ┌──────────────────┐
                         │      USER        │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     GATEWAY      │
                         │ Identity/Session │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │       COORDINATOR        │
                    │ Enterprise Workflow      │
                    │ LangGraph State          │
                    └────────────┬─────────────┘
                                 │
                       Context Projection
                                 │
                         Policy + Filtering
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       DELEGATOR          │
                    │ Domain Context            │
                    │ Domain Task State         │
                    └────────────┬─────────────┘
                                 │
                       Context Projection
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │         WORKER           │
                    │ Task Execution Context    │
                    └───────┬─────────┬────────┘
                            │         │
                         RAG│         │MCP
                            ▼         ▼
                       Knowledge   Enterprise
                         Store      Systems
```

Supporting infrastructure:

```text
Redis       → short-lived working context
Cosmos DB   → durable execution/application state
Service Bus → asynchronous message delivery
Vector DB   → semantic memory
RAG         → enterprise knowledge
Policy/IAM  → authorization
Key Vault   → secrets
Observability → execution telemetry
LangGraph   → workflow/state control
```

---

# 35. The Key Design Rule

The entire architecture can be summarized as:

```text
                    SOURCE STATE
                         │
                         ▼
                ┌─────────────────┐
                │ Relevance Check │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Security Check  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Scope Filtering │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Context Reduce  │
                │ Summarize/Refs  │
                └────────┬────────┘
                         │
                         ▼
                ┌─────────────────┐
                │ Schema Validate │
                └────────┬────────┘
                         │
                         ▼
                   TARGET AGENT
```

The rule is:

> **Select → Authorize → Minimize → Validate → Propagate.**

---

# 36. Enterprise Context Propagation Formula

A useful architecture formula is:

```text
Context Propagation
=
Relevant Context
+ Execution Metadata
+ Identity Context
+ Authorization Scope
+ Task Constraints
+ Required Evidence
- Unnecessary Context
- Unauthorized Data
- Redundant Data
- Excessive Payload
```

Or more formally:

```text
Propagated Context
=
Relevant
∩ Authorized
∩ Task-Scoped
∩ Valid
∩ Current
∩ Within Token/Size Budget
```

---

# 37. Interview-Ready Answer

> **Context propagation in CWD is the controlled transfer of relevant, authorized, and task-specific information across the Coordinator, Delegator, and Worker boundaries. The Coordinator maintains enterprise-level workflow context and creates a context projection for the appropriate Delegator. The Delegator further reduces that context to domain-specific task context for individual Workers. Execution metadata such as correlation ID, workflow ID, task ID, run ID, and parent relationships is preserved end-to-end for tracing, recovery, and auditability. Security context is propagated through controlled identity and authorization references rather than exposing credentials or unrestricted privileges. Large data such as RAG results, tool outputs, and artifacts are preferably referenced rather than copied. LangGraph maintains workflow state, while a context-building layer determines what portion of that state should enter the next agent's execution context. This prevents context explosion, reduces token cost and latency, maintains security boundaries, and allows independently deployed CWD agents to collaborate safely and efficiently.**

## Final Definition

> **Context propagation in CWD is a governed context-management mechanism that selectively extracts, authorizes, scopes, minimizes, validates, and transfers the information required for the next execution stage across Coordinator, Delegator, and Worker agents while preserving correlation and execution metadata. It separates workflow state from agent context, protects security boundaries, uses references and summarization to control context growth, and ensures each agent receives only the information necessary to perform its authorized responsibility.**

### Mental Model

```text
Coordinator
   │
   │ Enterprise Context
   ▼
Context Projection
   │
   ▼
Delegator
   │
   │ Domain Context
   ▼
Context Projection
   │
   ▼
Worker
   │
   │ Task Context
   ▼
MCP / RAG / Enterprise Systems
```

**In one sentence:**

> **CWD propagates context downward by progressively projecting enterprise context into domain context and then task context, while preserving execution lineage and authorization and removing everything that is unnecessary, unauthorized, redundant, or too large.**
