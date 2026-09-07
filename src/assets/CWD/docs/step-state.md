# Step-Level State in CWD

**Step-level state represents the smallest meaningful unit of execution inside a CWD workflow or task.** A step corresponds to one concrete action such as planning, delegation, retrieval, LLM invocation, tool execution, validation, aggregation, or response generation.

> **Task state answers: “What objective are we executing?”**
> **Run state answers: “What happened during this execution attempt?”**
> **Step state answers: “What happened during this specific action within the run?”**

This gives CWD a hierarchical execution model:

```text
Session
   │
   └── Conversation Turn
          │
          └── Workflow
                │
                └── Task
                      │
                      └── Run
                            │
                            ├── Step 1: Planning
                            ├── Step 2: Delegation
                            ├── Step 3: Retrieval
                            ├── Step 4: Tool Execution
                            ├── Step 5: LLM Invocation
                            ├── Step 6: Validation
                            ├── Step 7: Aggregation
                            └── Step 8: Response Generation
```

---

# 1. What is step-level state?

A **step** is one executable unit in the workflow graph.

For example:

```text
User:
"Why is shipment SHIP123 delayed?"

        ↓

Step 1
Intent / Planning

        ↓

Step 2
Delegation

        ↓

Step 3
Retrieve tracking information

        ↓

Step 4
Call carrier API

        ↓

Step 5
Analyze results with LLM

        ↓

Step 6
Validate result

        ↓

Step 7
Aggregate

        ↓

Step 8
Generate response
```

Each step has its own state.

A simplified step record:

```json
{
  "stepId": "STEP-004",
  "runId": "RUN-003",
  "stepType": "tool_execution",
  "status": "completed",
  "startedAt": "2026-09-06T15:01:10Z",
  "completedAt": "2026-09-06T15:01:11Z"
}
```

---

# 2. Why step-level state is required

Without step-level state, CWD may know:

```text
Task = failed
```

or:

```text
Run = failed
```

but not:

> **Which action failed?**

With step-level state:

```text
Run RUN-003
    │
    ├── Planning       → completed
    ├── Delegation     → completed
    ├── Retrieval      → completed
    ├── Tool execution → FAILED
    ├── Validation     → not executed
    └── Response       → not executed
```

This enables:

* Precise failure diagnosis.
* Step-level retries.
* Workflow recovery.
* Performance analysis.
* Tool/LLM observability.
* Reproducibility.
* Conditional routing.
* Partial execution recovery.
* Auditability.

---

# 3. State hierarchy

The relationship between the different CWD state levels is:

```text
SESSION
   │
   ▼
CONVERSATION TURN
   │
   ▼
WORKFLOW
   │
   ▼
TASK
   │
   ▼
RUN
   │
   ▼
STEP
   │
   └── Tool calls / model calls / retrieval / outputs
```

Each level answers a different question:

| Level        | Question                                             |
| ------------ | ---------------------------------------------------- |
| **Session**  | Who is interacting?                                  |
| **Turn**     | What did the user ask?                               |
| **Workflow** | What overall process are we executing?               |
| **Task**     | What objective are we trying to achieve?             |
| **Run**      | What happened during this execution attempt?         |
| **Step**     | What happened during this specific execution action? |

---

# 4. Core step-state attributes

A production step record typically contains:

```text
Step Identity
      +
Step Type
      +
Input
      +
Execution Status
      +
Agent / Worker
      +
Start / End Time
      +
Attempt
      +
Intermediate Output
      +
Error
      +
Decision
      +
Dependency
      +
Validation
      +
Result Reference
      +
Execution Metadata
```

---

# 5. Step identity

Every step needs a unique identity.

```json
{
  "stepId": "STEP-004",
  "taskId": "WT-1001",
  "runId": "RUN-003",
  "workflowId": "WF-1001",
  "turnId": "TURN-002",
  "correlationId": "CORR-7890"
}
```

This enables tracing:

```text
CORR-7890
   ↓
WF-1001
   ↓
WT-1001
   ↓
RUN-003
   ↓
STEP-004
```

If the step invokes a tool, the tool call can reference `STEP-004`.

---

# 6. Step types

CWD can standardize common execution step types.

| Step                    | Purpose                       |
| ----------------------- | ----------------------------- |
| `planning`              | Determine execution strategy  |
| `intent_classification` | Interpret user objective      |
| `authorization`         | Validate access/policy        |
| `agent_discovery`       | Find eligible agent           |
| `delegation`            | Assign work                   |
| `retrieval`             | Retrieve enterprise knowledge |
| `reranking`             | Rank retrieved evidence       |
| `context_construction`  | Build LLM context             |
| `llm_invocation`        | Invoke approved model         |
| `tool_selection`        | Select approved capability    |
| `tool_execution`        | Execute tool                  |
| `validation`            | Validate result               |
| `aggregation`           | Combine results               |
| `human_approval`        | Wait for authorized approval  |
| `response_generation`   | Generate final response       |
| `response_validation`   | Validate final response       |

The exact step taxonomy should be standardized across the CWD platform.

---

# 7. Planning step

The planning step determines what should happen next.

```text
User Request
     ↓
Planning
     ↓
Required capabilities
     ↓
Execution plan
```

Example:

```json
{
  "stepId": "STEP-001",
  "stepType": "planning",
  "status": "completed",
  "input": {
    "userRequest": "Why is shipment SHIP123 delayed?"
  },
  "output": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "requiredCapabilities": [
      "shipment_tracking",
      "delay_analysis"
    ]
  }
}
```

The LLM may assist with planning, but runtime policy and registered capabilities determine what can actually execute.

---

# 8. Delegation step

The Coordinator or Delegator decides which agent should perform the work.

```text
Planning
   ↓
Required capability
   ↓
Agent Registry
   ↓
Eligible agents
   ↓
Policy checks
   ↓
Selected agent
```

Example:

```json
{
  "stepId": "STEP-002",
  "stepType": "delegation",
  "status": "completed",
  "input": {
    "requiredCapability": "shipment_tracking"
  },
  "output": {
    "selectedAgent": "shipping-delegator",
    "reason": "Capability and policy match"
  }
}
```

The step records the decision without storing unnecessary internal reasoning.

---

# 9. Retrieval step

The RAG Worker may perform:

```text
Query
 ↓
Query transformation
 ↓
Azure AI Search
 ↓
Security filtering
 ↓
Ranking
 ↓
Relevant chunks
```

Step state:

```json
{
  "stepId": "STEP-003",
  "stepType": "retrieval",
  "status": "completed",
  "input": {
    "query": "shipment delay SHIP123"
  },
  "output": {
    "retrievalMode": "hybrid",
    "candidateCount": 50,
    "authorizedCount": 32,
    "finalCount": 7,
    "resultReferences": [
      "chunk-1001",
      "chunk-1002",
      "chunk-1045"
    ]
  }
}
```

Notice that the step can preserve **references to evidence** instead of embedding entire documents into workflow state.

---

# 10. LLM invocation step

The LLM invocation should be treated as a distinct execution step.

```text
Governed Prompt
      +
Authorized Context
      +
User Request
      ↓
Approved Model
      ↓
LLM
      ↓
Structured Output
```

Example:

```json
{
  "stepId": "STEP-005",
  "stepType": "llm_invocation",
  "status": "completed",
  "model": {
    "name": "approved-model",
    "version": "4.0"
  },
  "prompt": {
    "promptId": "shipment-delay-analysis",
    "version": "2.2.0"
  },
  "inputReference": "context-001",
  "outputReference": "llm-output-001",
  "metadata": {
    "inputTokens": 4200,
    "outputTokens": 620,
    "durationMs": 1100
  }
}
```

This is important for reproducibility.

If an answer changes later, CWD can determine:

```text
Which prompt?
Which model?
Which context?
Which retrieved evidence?
Which configuration?
```

---

# 11. Tool execution step

Tool execution is another discrete step.

```text
LLM / Agent decision
       ↓
Policy
       ↓
Tool authorization
       ↓
MCP
       ↓
Enterprise system
       ↓
Tool result
```

Example:

```json
{
  "stepId": "STEP-004",
  "stepType": "tool_execution",
  "tool": {
    "protocol": "MCP",
    "server": "shipping-mcp",
    "name": "get_tracking_events"
  },
  "status": "completed",
  "inputReference": "tool-input-001",
  "outputReference": "tool-output-001",
  "durationMs": 420
}
```

The important architecture boundary is:

```text
LLM
 ↓
Recommendation
 ↓
Policy / Authorization
 ↓
MCP
 ↓
Enterprise Tool
```

The LLM does **not** directly control enterprise authorization.

---

# 12. Validation step

Validation determines whether the output is acceptable.

```text
Tool / LLM Result
       ↓
Schema validation
       ↓
Business validation
       ↓
Security validation
       ↓
Grounding validation
       ↓
Accepted / rejected
```

Example:

```json
{
  "stepId": "STEP-006",
  "stepType": "validation",
  "status": "completed",
  "inputReference": "llm-output-001",
  "checks": {
    "schemaValid": true,
    "businessRulesValid": true,
    "grounded": true,
    "securityValid": true
  },
  "result": "passed"
}
```

Validation can cause conditional routing:

```text
Validation
   │
   ├── Passed → Continue
   ├── Retryable → Retry
   ├── Needs approval → HITL
   └── Failed → Recovery
```

---

# 13. Aggregation step

When multiple Workers execute in parallel:

```text
              ┌── Worker A ──┐
              │              │
Delegator ────┼── Worker B ──┼── Aggregation
              │              │
              └── Worker C ──┘
```

The aggregation step combines their results.

```json
{
  "stepId": "STEP-007",
  "stepType": "aggregation",
  "status": "completed",
  "inputs": [
    "result-WA",
    "result-WB",
    "result-WC"
  ],
  "outputReference": "aggregated-result-001"
}
```

Aggregation may include:

* Result combination.
* Conflict resolution.
* Deduplication.
* Completeness checking.
* Confidence assessment.
* Business rule validation.

---

# 14. Response-generation step

The final step converts validated results into the user-facing response.

```text
Validated Results
       ↓
Response Strategy
       ↓
Governed Prompt
       ↓
LLM
       ↓
Response Validation
       ↓
Final Response
```

Example:

```json
{
  "stepId": "STEP-008",
  "stepType": "response_generation",
  "status": "completed",
  "inputReference": "aggregated-result-001",
  "outputReference": "response-TURN-002",
  "validated": true
}
```

---

# 15. Step status lifecycle

Each step should have an explicit state.

```text
CREATED
   ↓
READY
   ↓
RUNNING
   │
   ├── WAITING
   ├── RETRYING
   └── PAUSED
   │
   ▼
COMPLETED
```

Failure states:

```text
RUNNING
   ├── FAILED
   ├── TIMED_OUT
   ├── CANCELLED
   └── REJECTED
```

Example statuses:

* `created`
* `ready`
* `running`
* `waiting`
* `waiting_for_approval`
* `retrying`
* `completed`
* `failed`
* `timed_out`
* `cancelled`
* `skipped`

---

# 16. Step dependencies

Steps often depend on previous steps.

```text
Planning
   ↓
Delegation
   ↓
Retrieval
   ↓
Context Construction
   ↓
LLM Invocation
   ↓
Validation
   ↓
Aggregation
   ↓
Response
```

But CWD can also execute independent steps in parallel:

```text
             ┌── Tracking Retrieval ──┐
Planning ────┤                         ├── Aggregation
             └── Carrier Retrieval ───┘
```

Step-level state records:

```json
{
  "dependencies": [
    {
      "stepId": "STEP-003",
      "condition": "completed"
    }
  ]
}
```

LangGraph can use these dependencies to determine the next executable node.

---

# 17. Step-level retry

Not every failure requires restarting the entire task.

Example:

```text
Task
  │
  └── Run
       │
       ├── Planning       ✓
       ├── Delegation     ✓
       ├── Retrieval      ✓
       ├── Tool Execution ✗
       └── Validation
```

If the tool timeout is retryable:

```text
Retry Tool Execution
        ↓
Tool succeeds
        ↓
Validation
        ↓
Continue
```

There is no need to repeat planning and delegation.

This is a major benefit of granular step state.

### But caution

Step retry must consider:

* Idempotency.
* Side effects.
* Deadline.
* Retry budget.
* Error classification.
* Dependency validity.
* Current Worker health.

---

# 18. Step-level state and checkpointing

LangGraph can checkpoint execution after important steps.

```text
Step 1 → checkpoint
Step 2 → checkpoint
Step 3 → checkpoint
Step 4 → checkpoint
```

Suppose the runtime crashes after retrieval:

```text
Before failure:

Planning       ✓
Delegation     ✓
Retrieval      ✓
LLM Invocation ✗
```

After recovery:

```text
Load checkpoint
       ↓
Restore step state
       ↓
Resume at LLM Invocation
```

This prevents unnecessary repetition.

---

# 19. Step state and Cosmos DB

Cosmos DB can persist step-level state when durable execution tracking is required.

A conceptual document:

```json
{
  "id": "STEP-004",

  "tenantId": "tenant-a",

  "stepId": "STEP-004",
  "taskId": "WT-1001",
  "runId": "RUN-003",
  "workflowId": "WF-1001",
  "turnId": "TURN-002",
  "correlationId": "CORR-7890",

  "stepType": "tool_execution",

  "status": "completed",

  "agent": {
    "agentId": "tracking-worker",
    "version": "2.4.1"
  },

  "tool": {
    "protocol": "MCP",
    "server": "shipping-mcp",
    "name": "get_tracking_events"
  },

  "dependencies": [
    "STEP-003"
  ],

  "attempt": 1,

  "timestamps": {
    "createdAt": "2026-09-06T15:01:10Z",
    "startedAt": "2026-09-06T15:01:11Z",
    "completedAt": "2026-09-06T15:01:11Z"
  },

  "inputReference": "input-004",

  "outputReference": "output-004",

  "error": null,

  "metadata": {
    "durationMs": 420
  }
}
```

For very high-volume systems, however, not every low-level event needs to become a durable Cosmos document. Detailed telemetry is often better suited to an observability platform.

---

# 20. Step state vs execution history

This distinction is important.

### Step state

```json
{
  "stepId": "STEP-004",
  "status": "completed"
}
```

It represents the current snapshot.

### Step history

```text
15:01:10 STEP_CREATED
15:01:11 STEP_STARTED
15:01:11 TOOL_AUTHORIZED
15:01:11 TOOL_INVOKED
15:01:11 TOOL_COMPLETED
15:01:11 STEP_COMPLETED
```

Therefore:

```text
Step State
    = Current snapshot

Step History
    = Chronological events
```

You can use both without forcing Cosmos DB to become your complete telemetry platform.

---

# 21. Step state and observability

Every step should be traceable.

A structured event might contain:

```json
{
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "runId": "RUN-003",
  "stepId": "STEP-004",
  "agentId": "tracking-worker",
  "stepType": "tool_execution",
  "status": "completed",
  "durationMs": 420
}
```

This enables an execution trace:

```text
CORR-7890
   │
   ▼
WF-1001
   │
   ▼
WT-1001
   │
   ▼
RUN-003
   │
   ├── STEP-001 Planning
   ├── STEP-002 Delegation
   ├── STEP-003 Retrieval
   ├── STEP-004 Tool
   ├── STEP-005 LLM
   ├── STEP-006 Validation
   └── STEP-007 Response
```

---

# 22. Step-level state and security

Step state can contain sensitive information.

For example:

```text
Tool input
Tool output
Retrieved documents
LLM context
User data
Business decisions
```

Therefore:

> **Step-level state must inherit the security context of the task and execution.**

Controls include:

* Tenant isolation.
* Identity propagation.
* RBAC/ABAC.
* Data classification.
* Input/output filtering.
* Secret protection.
* Sensitive-data redaction.
* Retention policies.
* Audit.
* Least privilege.

Do not store full sensitive payloads if a secure reference is sufficient.

---

# 23. Step-level state and prompt/RAG provenance

For an LLM step, CWD should be able to identify:

```text
Prompt ID
Prompt version
Model
Model version
Retrieved evidence
RAG index
Embedding version
Tool outputs
```

Example:

```json
{
  "stepType": "llm_invocation",

  "prompt": {
    "id": "shipment-delay-analysis",
    "version": "2.2.0"
  },

  "model": {
    "name": "approved-model",
    "version": "4.0"
  },

  "contextReferences": [
    "chunk-1001",
    "chunk-1002",
    "tool-output-001"
  ]
}
```

This gives you an execution lineage:

```text
User Request
     ↓
Prompt Version
     ↓
RAG Evidence
     ↓
Tool Results
     ↓
Model Version
     ↓
LLM Step
     ↓
Validated Output
```

---

# 24. Example complete execution

Suppose the user asks:

> “Why is shipment SHIP123 delayed?”

CWD might execute:

```text
TURN-002
│
├── STEP-001 Intent Classification
│       completed
│
├── STEP-002 Planning
│       completed
│
├── STEP-003 Delegation
│       shipping-delegator
│
├── STEP-004 Tracking Retrieval
│       completed
│
├── STEP-005 Carrier Tool Execution
│       completed
│
├── STEP-006 RAG Retrieval
│       completed
│
├── STEP-007 Context Construction
│       completed
│
├── STEP-008 LLM Analysis
│       completed
│
├── STEP-009 Result Validation
│       completed
│
├── STEP-010 Aggregation
│       completed
│
└── STEP-011 Response Generation
        completed
```

The final answer can then be traced all the way back to its evidence and execution steps.

---

# 25. Step-level state enables intelligent recovery

Consider:

```text
Planning             ✓
Delegation           ✓
Retrieval            ✓
Tool Execution       ✗
```

The failure classification says:

```text
MCP_TIMEOUT
retryable = true
```

LangGraph can route:

```text
Tool Execution
      ↓
Retry
      ↓
Tool Execution
      ↓
Success
      ↓
Validation
```

If instead:

```text
Authorization denied
```

then:

```text
Tool Execution
      ↓
Authorization Failure
      ↓
STOP
```

This is why:

> **Step-level state gives LangGraph enough granularity to make recovery decisions without restarting the entire workflow.**

---

# 26. Step-level state and parallel execution

CWD can execute independent steps concurrently.

```text
                 ┌── STEP A: Tracking ─────┐
                 │                          │
Planning ────────┼── STEP B: Carrier ──────┼── Aggregation
                 │                          │
                 └── STEP C: RAG Search ───┘
```

Each step maintains independent state:

```json
{
  "stepId": "STEP-A",
  "status": "completed"
}
```

```json
{
  "stepId": "STEP-B",
  "status": "completed"
}
```

```json
{
  "stepId": "STEP-C",
  "status": "failed",
  "retryable": true
}
```

The aggregation step can wait for required dependencies while allowing independent branches to continue.

---

# 27. Step-level state and state ownership

```text
Coordinator
   │
   └── Planning / Routing steps

Delegator
   │
   └── Decomposition / Assignment / Aggregation steps

Worker
   │
   ├── Retrieval
   ├── Tool execution
   ├── Business logic
   └── Validation

LangGraph
   │
   └── Controls transitions

Cosmos DB
   │
   └── Durable state

Observability
   │
   └── Detailed telemetry
```

This prevents one component from becoming responsible for everything.

---

# 28. What should and should not be stored?

### Store

* Step ID.
* Parent run/task/workflow.
* Step type.
* Status.
* Attempt.
* Agent/Worker.
* Start/end timestamps.
* Dependency references.
* Input/output references.
* Error classification.
* Validation result.
* Relevant execution metadata.
* Prompt/model/tool version references where applicable.

### Avoid storing unnecessarily

* Complete conversation.
* Entire enterprise documents.
* Secrets.
* Access tokens.
* Huge tool payloads.
* Unfiltered sensitive data.
* Unbounded LLM context.
* Internal chain-of-thought.

Use references to controlled stores where possible.

---

# 29. Anti-patterns

### ❌ One giant state object

```text
Session + workflow + task + run + every tool result
```

This creates excessive coupling.

### ❌ No step identity

You cannot trace individual execution actions.

### ❌ Restarting the entire task after every step failure

Granular recovery becomes impossible.

### ❌ Treating every step as independently authorized

Authorization must follow the appropriate user/agent/task/resource policy.

### ❌ Storing raw LLM context indefinitely

Creates security, privacy, cost, and retention problems.

### ❌ Storing detailed telemetry only in Cosmos DB

Use an observability platform for high-volume traces and metrics.

### ❌ Letting LLM directly control execution

LLM decisions should pass through policy, capability, and tool controls.

---

# 30. Complete CWD state model

The full hierarchy now becomes:

```text
SESSION
│
└── CONVERSATION TURN
    │
    └── WORKFLOW
        │
        └── TASK
            │
            └── RUN
                │
                ├── STEP: Planning
                │
                ├── STEP: Delegation
                │
                ├── STEP: Retrieval
                │
                ├── STEP: Tool Execution
                │
                ├── STEP: LLM Invocation
                │
                ├── STEP: Validation
                │
                ├── STEP: Aggregation
                │
                └── STEP: Response Generation
```

This is the **execution-state hierarchy** of CWD.

---

# 31. Architect-level separation

```text
Session
  → Overall interaction

Turn
  → One user request / response

Workflow
  → Overall execution process

Task
  → Specific objective

Run
  → One execution attempt

Step
  → One execution action

Event
  → One occurrence within that action
```

And the execution relationship is:

$$
\boxed{
\text{Session}
\rightarrow
\text{Turn}
\rightarrow
\text{Workflow}
\rightarrow
\text{Task}
\rightarrow
\text{Run}
\rightarrow
\text{Step}
\rightarrow
\text{Event}
}
$$

---

# 32. Final formula

$$
\boxed{
\text{Step-Level State}
=
\text{Step Identity}
+
\text{Step Type}
+
\text{Dependencies}
+
\text{Input}
+
\text{Agent/Worker}
+
\text{Status}
+
\text{Attempt}
+
\text{Timestamps}
+
\text{Intermediate Output}
+
\text{Validation}
+
\text{Failure}
+
\text{Result Reference}
+
\text{Execution Metadata}
}
$$

## Interview-ready answer

> **In CWD, step-level state represents an individual execution action inside a run, such as planning, delegation, retrieval, LLM invocation, tool execution, validation, aggregation, or response generation. Each step has a unique step ID linked to the task, run, workflow, turn, and correlation ID. It records the step type, dependencies, assigned agent or Worker, status, attempt, timestamps, inputs and outputs or their secure references, validation results, and structured failure information. LangGraph uses this state to determine workflow transitions, conditional routing, retries, parallel execution, checkpointing, and recovery. Cosmos DB can persist durable step snapshots when required, while observability systems capture detailed execution events and telemetry. The key benefit is granular recovery: if a tool step fails, CWD can retry or recover that step without necessarily restarting the entire task or workflow.**

## Final definition

**Step-level state in CWD is the granular execution state associated with one specific action within a run. It records what step is being performed, its dependencies, participating agent or Worker, execution status, timestamps, attempts, inputs, intermediate outputs, validation results, failures, and final output references. By providing this fine-grained state, CWD can trace every meaningful execution action, support conditional routing and parallelism, perform targeted retries and recovery, checkpoint progress, and establish end-to-end execution lineage from the user's request to the final response.**

### Final mental model

**Session = interaction → Turn = request → Workflow = process → Task = objective → Run = attempt → Step = action → Event = occurrence.**
