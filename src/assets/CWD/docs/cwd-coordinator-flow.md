# Coordinator Responsibilities in the CWD Platform

The Coordinator is the enterprise-level control plane of CWD. It transforms a user request into a governed execution plan, manages the overall workflow state, coordinates Delegators and Workers, handles failures, and produces the final response.

> The Coordinator decides what needs to happen and controls the workflow. Delegators decide how their domain work is executed. Workers perform specialized actions.

```
User Request
      ↓
Gateway
      ↓
┌─────────────────────────────────────────┐
│              COORDINATOR                │
│                                         │
│ Interpret Request                       │
│ Determine Intent                        │
│ Identify Domain                         │
│ Validate Authorization                   │
│ Create Execution Plan                   │
│ Discover Agents                         │
│ Delegate Tasks                          │
│ Track Workflow State                    │
│ Monitor Results                         │
│ Recover from Failures                   │
│ Aggregate Results                       │
│ Generate Final Response                 │
└──────────────────┬──────────────────────┘
                   ↓
             Delegators
                   ↓
                Workers
```


## 1. Coordinator's Position in CWD

The Coordinator sits between the external request layer and the domain execution layer.

```
                    USER
                      │
                      ▼
                API GATEWAY
                      │
                      ▼
               COORDINATOR
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
     Shipping     Finance       HR
     Delegator    Delegator    Delegator
          │           │           │
          ▼           ▼           ▼
       Workers      Workers      Workers
          │           │           │
          ▼           ▼           ▼
       Tools / RAG / MCP / Enterprise APIs
```

The Coordinator owns the enterprise objective, not the implementation details of every Worker.

## 2. Request Interpretation

The Coordinator receives a validated request envelope from the Gateway.

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "message": "Why is shipment SHIP123 delayed?",
  "identity_context": {
    "user_id": "user-123",
    "tenant_id": "tenant-a"
  }
}
```

The Coordinator first determines what the request means.

### Interpretation activities

* Understand the user's objective

* Identify important entities

* Extract constraints

* Determine whether clarification is required

* Identify the business domain

* Determine the expected response type

* Identify whether the request requires knowledge retrieval, live data, computation, or an action

Example:

```
Input:
"Why is shipment SHIP123 delayed?"

Interpretation:
Intent = root_cause_analysis
Domain = logistics
Entity = shipment SHIP123
Query Type = analytical
Required Capability = shipment_tracking + delay_analysis
Expected Output = explanation + recommended action
```

The LLM may help interpret natural language, but the Coordinator validates the result against known capabilities, schemas, and policies.

## 3. Intent Determination

Intent represents what the user wants to accomplish.

Examples:

|
User request

|

Intent

|
| --- | --- |
|

“What is the shipment status?”

|

Status lookup

|
|

“Why is the shipment delayed?”

|

Root-cause analysis

|
|

“Compare these two suppliers.”

|

Comparison

|
|

“Create a purchase request.”

|

Transactional action

|
|

“Explain the quality policy.”

|

Knowledge retrieval

|
|

“Summarize this report.”

|

Summarization

|

The Coordinator may classify:

JSON

```
{
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "query_type": "analytical",
  "entities": {
    "shipment_id": "SHIP123"
  },
  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ]
}
```

### Why intent matters

Intent determines:

* Which domain is relevant

* Which agents may be needed

* Whether RAG or live APIs are appropriate

* Whether the request is read-only or action-oriented

* What output is expected

* What security and approval rules may apply

> Intent is not merely a label. It is the starting point for selecting the correct execution strategy.

## 4. Authorization and Policy Validation

After understanding the request, the Coordinator checks whether the requested operation is permitted.

```
Interpreted Intent
      ↓
Required Capability
      ↓
User Permission
      ↓
Scope / Entitlement
      ↓
Resource Authorization
      ↓
Risk / Policy
      ↓
Continue or Reject
```

Example:

```
User requests shipment analysis
        ↓
Can user invoke shipment_tracking?
        ↓
Is SHIP123 within the user's entitlement?
        ↓
Is the requested operation read-only?
        ↓
Is additional approval required?
```

The Coordinator should not allow an LLM-generated plan to bypass authorization.

Allowed=Authenticated∧PermissionAllowed∧EntitlementAllowed∧PolicyAllowed\boxed{ Allowed = Authenticated \land PermissionAllowed \land EntitlementAllowed \land PolicyAllowed }Allowed=Authenticated∧PermissionAllowed∧EntitlementAllowed∧PolicyAllowed

Authorization may also be repeated by the Delegator, Worker, MCP server, and enterprise API.

## 5. Execution Planning

The Coordinator converts the interpreted request into an enterprise-level execution plan.

The plan describes:

* Required capabilities

* Participating Delegators

* Task dependencies

* Parallel or sequential execution

* Expected outputs

* Constraints and deadlines

* Retry and recovery expectations

* Approval requirements

* Final aggregation strategy

### Example plan

JSON

```
{
  "workflow_id": "WF-1001",
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "objective": "Explain why shipment SHIP123 is delayed",
  "tasks": [
    {
      "task_id": "T1",
      "capability": "shipment_tracking",
      "action": "retrieve_tracking_events"
    },
    {
      "task_id": "T2",
      "capability": "delay_analysis",
      "action": "analyze_delay",
      "depends_on": ["T1"]
    }
  ],
  "execution_mode": "sequential",
  "expected_output": [
    "latest_status",
    "root_cause",
    "recommended_action"
  ]
}
```

The Coordinator does not need to know every internal Worker implementation. It expresses the business objective and required capabilities.

## 6. Planning Does Not Mean Unrestricted LLM Control

A production Coordinator should separate reasoning from execution control.

```
LLM
  ↓
Proposed Intent / Plan
  ↓
Schema Validation
  ↓
Policy Validation
  ↓
Agent Registry
  ↓
Runtime / LangGraph
  ↓
Actual Execution
```

The LLM may propose:

```
"Use the shipping Delegator."
```

But the runtime verifies:

* The Delegator is registered

* The capability matches

* The agent is healthy and ready

* The user is authorized

* The version is compatible

* The environment is correct

The LLM should not directly choose arbitrary endpoints, tools, or database queries.

## 7. Agent Discovery and Selection

The Coordinator queries the Agent Registry to discover suitable Delegators or agents.

```
Required Capability
        ↓
Agent Registry
        ↓
Candidate Agents
        ↓
Capability Filter
        ↓
Authorization Filter
        ↓
Health / Readiness Filter
        ↓
Version / Environment Filter
        ↓
Best Eligible Agent
```

Example:

JSON

```
{
  "required_capability": "shipment_tracking",
  "domain": "logistics",
  "environment": "production",
  "selected_agent": "shipping-delegator",
  "selection_reason": "capability_match_and_ready"
}
```

The Coordinator should not hardcode:

Python

Run

```
shipping_delegator_url = "http://shipping-agent-1:8000"
```

Instead:

Python

Run

```
candidates = registry.find(
    capability="shipment_tracking",
    domain="logistics",
    environment="production"
)

eligible = [
    agent for agent in candidates
    if agent.health == "healthy"
    and agent.readiness == "ready"
    and policy.authorized(agent)
]

selected_agent = router.select(eligible)
```

## 8. Delegation Through A2A

Once the Coordinator selects a suitable Delegator, it sends a structured task through the agent-to-agent communication layer.

```
Coordinator
     │
     │ A2A Task
     ▼
Shipping Delegator
     │
     ├── Decompose domain work
     ├── Select Workers
     ├── Execute tasks
     └── Aggregate domain result
     │
     ▼
Coordinator
```

Example:

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",
  "capability": "shipment_delay_analysis",
  "objective": "Explain why shipment SHIP123 is delayed",
  "input": {
    "shipment_id": "SHIP123"
  },
  "constraints": {
    "timeout_ms": 10000,
    "priority": "high"
  },
  "expected_output": {
    "latest_status": true,
    "root_cause": true,
    "recommended_action": true
  }
}
```

The Coordinator sends the business task contract, not necessarily the internal Worker graph or raw tool instructions.

## 9. Workflow State Management

The Coordinator must remember what has happened and what should happen next.

This is where LangGraph can provide stateful workflow orchestration.

```
Workflow State
      │
      ├── Current Node
      ├── Intent
      ├── Domain
      ├── Execution Plan
      ├── Completed Tasks
      ├── Pending Tasks
      ├── Task Results
      ├── Retry Counts
      ├── Approval Status
      ├── Errors
      └── Final Response Status
```

Example:

Python

Run

```
state = {
    "workflow_id": "WF-1001",
    "correlation_id": "CORR-7890",
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "plan": {},
    "completed_tasks": [],
    "pending_tasks": ["T1", "T2"],
    "results": {},
    "retry_counts": {},
    "status": "running"
}
```

### Why state matters

Without durable state, the Coordinator may lose:

* Which tasks completed

* Which tasks failed

* Which results are available

* Whether approval was granted

* Whether a retry already occurred

* Which step should execute next

## 10. LangGraph's Role in Coordinator Orchestration

LangGraph can represent the Coordinator workflow as a graph of nodes and transitions.

```
START
  ↓
Interpret Request
  ↓
Validate Authorization
  ↓
Create Plan
  ↓
Discover Agents
  ↓
Delegate Tasks
  ↓
Monitor Results
  ↓
Aggregate Results
  ↓
Generate Response
  ↓
END
```

Each node performs a bounded responsibility.

|
Node

|

Responsibility

|
| --- | --- |
|

`interpret_request`

|

Determine intent, domain, entities

|
|

`authorize_request`

|

Validate permissions and policy

|
|

`create_plan`

|

Build execution plan

|
|

`discover_agents`

|

Find eligible agents

|
|

`delegate_tasks`

|

Send A2A tasks

|
|

`monitor_execution`

|

Track task status

|
|

`aggregate_results`

|

Combine domain results

|
|

`generate_response`

|

Produce final answer

|
|

`validate_response`

|

Check output quality and policy

|

LangGraph manages state and transitions; it does not replace IAM, Agent Registry, A2A, MCP, or the runtime.

## 11. Conditional Routing

The Coordinator must decide what happens after each stage.

```
Task Result
    │
    ├── Success ──────────────► Aggregate
    │
    ├── Retryable Failure ────► Retry / Replan
    │
    ├── Agent Unavailable ────► Rediscover / Failover
    │
    ├── Approval Required ────► Human Review
    │
    ├── Missing Information ──► Ask User
    │
    └── Permanent Failure ────► Stop / Escalate
```

Example:

Python

Run

```
def route_after_delegation(state):
    if state["approval_required"]:
        return "human_review"

    if state["status"] == "completed":
        return "aggregate_results"

    if state["retryable_failure"]:
        return "retry_or_replan"

    if state["agent_unavailable"]:
        return "rediscover_agent"

    return "stop_with_error"
```

The Coordinator should not blindly continue because the LLM says the task succeeded.

## 12. Monitoring Downstream Execution

After delegation, the Coordinator tracks:

* Task status

* Delegator status

* Worker completion

* Partial results

* Timeouts

* Retries

* Errors

* Approval state

* Deadline

* Correlation identifiers

  Coordinator
  │
  ├── Task A → Completed
  ├── Task B → Running
  ├── Task C → Failed
  └── Task D → Waiting for approval

For asynchronous execution:

```
Coordinator submits task
        ↓
Receives acknowledgment
        ↓
Stores workflow state
        ↓
Continues or waits
        ↓
Receives progress/completion event
        ↓
Resumes workflow
```

Asynchronous execution requires durable state and correlation; it is not fire-and-forget.

## 13. Result Aggregation

The Coordinator receives domain-level results from Delegators.

```
Shipping Delegator ──┐
                     ├── Coordinator
Finance Delegator ───┤
                     │
HR Delegator ────────┘
```

The Coordinator combines results according to the original business objective.

Example:

JSON

```
{
  "workflow_id": "WF-1001",
  "status": "completed",
  "domain_results": [
    {
      "domain": "logistics",
      "status": "delayed",
      "root_cause": "carrier_capacity"
    }
  ],
  "final_objective": "Explain shipment delay"
}
```

The Coordinator should not simply concatenate raw Worker outputs. It should:

* Validate result structure

* Check completeness

* Resolve conflicts

* Handle partial results

* Preserve provenance

* Determine whether the business objective was achieved

## 14. Final Response Generation

The Coordinator transforms validated execution results into a user-facing response.

```
Validated Domain Results
        ↓
Context Assembly
        ↓
Governed Prompt
        ↓
LLM Response Generation
        ↓
Response Validation
        ↓
User
```

Example:

```
"Shipment SHIP123 is delayed because of a carrier
capacity constraint. The latest tracking event indicates
that the carrier is experiencing capacity limitations.
The recommended action is to evaluate an approved reroute."
```

The final response should be based on validated results and authorized evidence—not unsupported LLM assumptions.

## 15. Response Validation

Before returning the answer, the Coordinator may validate:

* Required fields

* Business correctness

* Groundedness

* Sensitive-data leakage

* Policy compliance

* Output schema

* Completeness

* User-facing clarity

  Generated Response
  ↓
  Schema Check
  ↓
  Grounding Check
  ↓
  Security / Data Leakage Check
  ↓
  Policy Check
  ↓
  Return or Regenerate

If validation fails:

```
Invalid Response
      ↓
Retry / Regenerate / Escalate
```

## 16. Failure and Recovery Control

The Coordinator owns enterprise-level recovery decisions.

```
Delegator Failure
      ↓
Coordinator
      │
      ├── Retry task
      ├── Rediscover agent
      ├── Select alternate agent
      ├── Replan workflow
      ├── Continue with partial result
      ├── Request human approval
      └── Terminate safely
```

Recovery depends on:

Recovery=f(ErrorType,Retryability,Attempts,Deadline,Health,Idempotency,Risk,Policy)Recovery = f( ErrorType, Retryability, Attempts, Deadline, Health, Idempotency, Risk, Policy )Recovery=f(ErrorType,Retryability,Attempts,Deadline,Health,Idempotency,Risk,Policy)

Examples:

|
Failure

|

Coordinator action

|
| --- | --- |
|

Temporary timeout

|

Bounded retry

|
|

Agent unavailable

|

Rediscover or failover

|
|

Invalid Worker result

|

Reject and retry/replan

|
|

Authorization denial

|

Stop and audit

|
|

Missing user information

|

Ask clarification

|
|

High-risk action

|

Human approval

|
|

Partial domain failure

|

Return partial result or escalate

|

## 17. Human-in-the-Loop

The Coordinator can pause the workflow when a decision requires human oversight.

```
Workflow
   ↓
Risk Evaluation
   ↓
Approval Required
   ↓
Checkpoint State
   ↓
Human Review
   ↓
Approved / Rejected
   ↓
Resume or Stop
```

Examples:

* Financial transaction

* Sensitive data export

* Production change

* High-impact business decision

* Uncertain or conflicting evidence

* Privileged tool execution

LangGraph can pause and resume workflow execution, while the policy and approval systems determine whether the action is permitted.

## 18. Coordinator State vs Memory

These are different concepts.

|
Component

|

Purpose

|
| --- | --- |
|

Workflow state

|

What is happening in the current execution

|
|

Session context

|

What is happening in the current interaction

|
|

Persistent memory

|

Approved information retained across sessions

|
|

RAG

|

Authoritative enterprise evidence

|
|

Agent Registry

|

Available agent capabilities

|
|

Prompt Registry

|

Approved prompt versions

|

Example:

```
Workflow State:
"T1 completed, T2 pending"

Persistent Memory:
"User prefers concise responses"

RAG:
"Current shipment policy document"

Agent Registry:
"Shipping Delegator is ready"

Prompt Registry:
"shipment-delay-analysis v2.2.0"
```

The Coordinator assembles only the relevant and authorized information into the current workflow context.

## 19. End-to-End Coordinator Example

```
User:
"Why is shipment SHIP123 delayed?"
        ↓
Gateway
        ↓
Coordinator
        │
        ├── Authenticate context received
        ├── Interpret intent
        ├── Identify logistics domain
        ├── Check authorization
        ├── Create workflow WF-1001
        ├── Discover shipping Delegator
        ├── Send A2A task
        │
        ▼
Shipping Delegator
        │
        ├── Select tracking Worker
        ├── Retrieve tracking data through MCP/API
        ├── Analyze delay
        └── Return domain result
        │
        ▼
Coordinator
        │
        ├── Validate result
        ├── Update workflow state
        ├── Aggregate results
        ├── Generate final response
        └── Validate response
        ↓
User
```

## 20. Responsibility Separation

|
Responsibility

|

Coordinator

|

Delegator

|

Worker

|
| --- | --- | --- | --- |
|

Understand enterprise request

|

✓

|  |  |
|

Determine overall intent

|

✓

|  |  |
|

Identify domain

|

✓

|  |  |
|

Enterprise authorization

|

✓

|  |  |
|

Create enterprise plan

|

✓

|  |  |
|

Discover suitable agents

|

✓

|  |  |
|

Domain task decomposition

|  |

✓

|  |
|

Select specialized Workers

|  |

✓

|  |
|

Execute business operation

|  |  |

✓

|
|

Call approved tools

|  |  |

✓

|
|

Retrieve enterprise data

|  |  |

✓

|
|

Aggregate domain results

|  |

✓

|  |
|

Aggregate enterprise results

|

✓

|  |  |
|

Manage overall workflow state

|

✓

|  |  |
|

Manage domain task state

|  |

✓

|  |
|

Manage local execution state

|  |  |

✓

|
|

Final response generation

|

✓

|  |  |

## 21. Coordinator and Supporting Components

```
                    COORDINATOR
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   LangGraph        Agent Registry     Policy / IAM
   Workflow         Discovery          Authorization
   State
        │
        ├──────────────► A2A
        │
        ├──────────────► Service Bus
        │
        ├──────────────► Prompt Registry
        │
        ├──────────────► RAG / Context
        │
        └──────────────► Observability
```

### Separation of concerns

```
LLM
→ Reason and recommend

Coordinator
→ Enterprise objective and orchestration

LangGraph
→ Workflow state and transitions

Agent Registry
→ Discover available agents

Policy / IAM
→ Authorize actions

A2A
→ Agent communication

Delegator
→ Domain orchestration

Worker
→ Specialized execution

MCP
→ Tool and system integration
```

## 22. Common Anti-Patterns

### 1. Coordinator performs every Worker task

Problem: It becomes a bottleneck and violates separation of concerns.

### 2. LLM directly controls execution

Problem: The model may select unauthorized tools, endpoints, or actions.

### 3. No durable workflow state

Problem: Failures lose progress and completed results.

### 4. Hardcoded agent endpoints

Problem: Prevents dynamic discovery, scaling, and failover.

### 5. Blind delegation

Problem: The Coordinator delegates without validating authorization, capability, health, or version.

### 6. Raw result forwarding

Problem: Internal implementation details, sensitive data, or malformed results reach the user.

### 7. Unlimited retries and recursive planning

Problem: Causes retry storms, cost explosion, and infinite workflows.

### 8. Treating memory as current truth

Problem: Historical context may be stale or unauthorized.

## 23. Interview-Ready Answer

> “In CWD, the Coordinator is the enterprise orchestration control plane. It receives a validated request from the Gateway, interprets the user's objective, determines intent, domain, query type, entities, and required capabilities, and validates authorization and policy constraints. It then creates an execution plan that defines the required Delegators, task dependencies, execution mode, expected outputs, deadlines, and recovery behavior. Using the Agent Registry, it discovers eligible agents and delegates structured tasks through A2A. LangGraph can manage the Coordinator's workflow state, conditional routing, checkpointing, parallel execution, retries, human approval, and resume behavior. The Coordinator monitors downstream task status, handles failures and partial results, aggregates validated domain-level responses from Delegators, and generates the final response using governed prompts and authorized context. The LLM supports interpretation and planning, but runtime controls, policy, registry, and Workers enforce actual execution. This separation allows CWD to remain scalable, secure, observable, and recoverable.”

## Final Definition

The Coordinator in CWD is the enterprise-level orchestration component that interprets user requests, determines intent and domain, validates authorization, creates execution plans, discovers and delegates to appropriate agents, manages workflow state and conditional transitions, monitors and recovers downstream execution, aggregates validated results, and produces the final governed response.

Coordinator=RequestInterpretation+IntentDetermination+Authorization+Planning+AgentDiscovery+Delegation+WorkflowState+Monitoring+Recovery+Aggregation+ResponseGeneration\boxed{ Coordinator = RequestInterpretation + IntentDetermination + Authorization + Planning + AgentDiscovery + Delegation + WorkflowState + Monitoring + Recovery + Aggregation + ResponseGeneration }Coordinator=RequestInterpretation+IntentDetermination+Authorization+Planning+AgentDiscovery+Delegation+WorkflowState+Monitoring+Recovery+Aggregation+ResponseGeneration

Mental model: The Coordinator decides what needs to happen, LangGraph controls how the workflow progresses, the Agent Registry identifies who can perform the work, Delegators manage domain execution, Workers perform specialized actions, and the Coordinator combines the results into one enterprise response.
