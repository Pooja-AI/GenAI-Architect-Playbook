# Delegator Responsibilities in the CWD Platform

The Delegator is the domain-level orchestration component. It receives an authorized task from the Coordinator, breaks it into smaller executable tasks, identifies the appropriate Worker agents, manages dependencies and execution, and returns an aggregated domain result.

> The Coordinator decides the enterprise objective. The Delegator decides how that objective is executed within its domain. The Worker performs the specialized action.

```
Coordinator
    │
    │ Authorized domain task
    ▼
┌──────────────────────────────────────┐
│              DELEGATOR               │
│                                      │
│ Validate task and scope              │
│ Understand domain objective          │
│ Decompose into Worker tasks          │
│ Identify dependencies                │
│ Discover eligible Workers            │
│ Select and route tasks               │
│ Monitor execution                    │
│ Handle retries and partial failures │
│ Aggregate domain results             │
└──────────────────┬───────────────────┘
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Worker A Worker B Worker C
          │        │        │
          ▼        ▼        ▼
       Tools / RAG / MCP / APIs
```


## 1. What the Delegator Receives

The Coordinator sends a structured, authorized task rather than an unbounded user message.

JSON

```
{
  "task_id": "DT-5001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "coordinator",
  "target_domain": "logistics",
  "objective": "Explain why shipment SHIP123 is delayed",
  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ],
  "input": {
    "shipment_id": "SHIP123"
  },
  "constraints": {
    "timeout_ms": 10000,
    "priority": "high"
  },
  "expected_output": [
    "latest_status",
    "root_cause",
    "recommended_action"
  ]
}
```

The Delegator must validate:

* Task identity and correlation

* Required capability

* Domain ownership

* Input schema

* User and agent authorization

* Scope and entitlements

* Deadline and priority

* Expected output contract

## 2. Task Decomposition

Task decomposition means breaking one domain objective into smaller tasks that can be assigned to specialized Workers.

### Example

```
Domain Objective:
Explain why shipment SHIP123 is delayed
                    │
                    ▼
              Delegator
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
Retrieve         Analyze       Check
tracking         delay         route options
events           cause         if needed
```

A more precise dependency structure is:

```
T1: Retrieve tracking events
        │
        ▼
T2: Analyze delay cause
        │
        ├──────────────► T3: Check approved reroute options
        │
        ▼
T4: Build domain conclusion
```

The Delegator determines:

* What subtasks are required

* Which tasks are independent

* Which tasks depend on previous results

* Which tasks can execute in parallel

* Which tasks require human approval

* What output each Worker must return

### Decomposition example

JSON

```
{
  "parent_task_id": "DT-5001",
  "subtasks": [
    {
      "task_id": "WT-1001",
      "capability": "shipment_tracking",
      "action": "get_tracking_events",
      "depends_on": []
    },
    {
      "task_id": "WT-1002",
      "capability": "delay_analysis",
      "action": "analyze_delay",
      "depends_on": ["WT-1001"]
    },
    {
      "task_id": "WT-1003",
      "capability": "route_constraints",
      "action": "get_reroute_options",
      "depends_on": ["WT-1002"]
    }
  ]
}
```

The Delegator should decompose according to business capability and execution responsibility, not merely create more agents.

## 3. Domain Identification

The Delegator operates within a specific business or technical domain.

Examples:

|
Domain

|

Typical Delegator

|
| --- | --- |
|

Logistics

|

Shipping Delegator

|
|

Finance

|

Finance Delegator

|
|

Human Resources

|

HR Delegator

|
|

Manufacturing

|

Manufacturing Delegator

|
|

Customer Support

|

Support Delegator

|
|

Engineering

|

Engineering Delegator

|

The Coordinator may identify the domain first, while the Delegator validates that the task belongs to its own responsibility.

```
Coordinator:
"Investigate shipment delay"

        ↓

Shipping Delegator:
"This is a logistics task."
```

If the task is outside its domain, the Delegator should reject it, redirect it through an approved route, or request Coordinator clarification.

## 4. Identifying the Appropriate Worker

The Delegator maps each subtask to a required capability.

```
Subtask
   ↓
Required Capability
   ↓
Agent Registry
   ↓
Eligible Workers
   ↓
Worker Selection
```

Example:

```
Task: Retrieve shipment events
        ↓
Capability: shipment_tracking
        ↓
Registry:
  tracking-worker-v1
  tracking-worker-v2
  tracking-worker-v3
        ↓
Filter and rank
        ↓
Select tracking-worker-v2
```

The Delegator should select based on:

* Capability match

* Authorization

* Tenant and data scope

* Health

* Readiness

* Availability

* Current workload

* Version compatibility

* Environment

* Priority and deadline

* Cost or latency constraints

### Eligibility formula

EligibleWorkers=CapabilityMatch∧Authorization∧ScopeAllowed∧Healthy∧Ready∧Available∧VersionCompatible\boxed{ EligibleWorkers = CapabilityMatch \land Authorization \land ScopeAllowed \land Healthy \land Ready \land Available \land VersionCompatible }EligibleWorkers=CapabilityMatch∧Authorization∧ScopeAllowed∧Healthy∧Ready∧Available∧VersionCompatible

## 5. Agent Registry and Worker Discovery

The Agent Registry answers:

> Which registered agents can perform this capability, and what is their current operational state?

Example registry metadata:

JSON

```
{
  "agent_id": "tracking-worker-v2",
  "agent_type": "worker",
  "domain": "logistics",
  "capabilities": [
    "shipment_tracking"
  ],
  "version": "2.4.1",
  "environment": "production",
  "health": "healthy",
  "readiness": "ready",
  "availability": "available",
  "max_concurrency": 20,
  "current_load": 6,
  "supported_protocol": "A2A"
}
```

The Delegator should not hardcode Worker endpoints.

Python

Run

```
candidates = registry.find(
    capability="shipment_tracking",
    domain="logistics",
    environment="production"
)

eligible = [
    worker for worker in candidates
    if worker.health == "healthy"
    and worker.readiness == "ready"
    and worker.availability == "available"
    and policy.authorized(worker)
]

selected_worker = router.select(
    eligible,
    priority="high",
    deadline_ms=5000
)
```

The actual selection must also consider task-specific scope and authorization.

## 6. Worker Selection Is Not Just Capability Matching

Two Workers may have the same capability but different operational suitability.

```
Worker A:
Capability match ✓
Healthy ✓
Ready ✓
High workload ✗

Worker B:
Capability match ✓
Healthy ✓
Ready ✓
Low workload ✓

Worker C:
Capability match ✓
Healthy ✗
```

The Delegator should select Worker B.

### Selection model

SelectedWorker=f(Capability,Authorization,Scope,Health,Readiness,Availability,Load,Version,Priority,Deadline,Cost)\boxed{ SelectedWorker = f( Capability, Authorization, Scope, Health, Readiness, Availability, Load, Version, Priority, Deadline, Cost ) }SelectedWorker=f(Capability,Authorization,Scope,Health,Readiness,Availability,Load,Version,Priority,Deadline,Cost)

The LLM may recommend a capability, but the Delegator's runtime and policy controls determine the actual Worker.

## 7. Routing Tasks to Workers

After selecting a Worker, the Delegator creates a structured task contract.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator",
  "target_agent": "tracking-worker-v2",
  "capability": "shipment_tracking",
  "action": "get_tracking_events",
  "input": {
    "shipment_id": "SHIP123"
  },
  "constraints": {
    "timeout_ms": 5000,
    "priority": "high"
  },
  "expected_output": {
    "tracking_events": true,
    "latest_status": true
  }
}
```

The task may be delivered through:

```
Delegator
    ↓
A2A / Internal Task Contract
    ↓
Service Bus or Direct Runtime Call
    ↓
Worker
```

The communication mechanism depends on the deployment design. The important point is that the Worker receives a bounded, authorized, structured task.

## 8. Parallel and Sequential Execution

The Delegator determines whether tasks can execute concurrently.

### Sequential execution

```
T1 Retrieve Events
        ↓
T2 Analyze Delay
        ↓
T3 Recommend Action
```

Use when one task depends on another.

### Parallel execution

```
             ┌── T1 Retrieve Tracking ──┐
             │                          │
Delegator ───┼── T2 Check Carrier ──────┼── Aggregate
             │                          │
             └── T3 Check Route ────────┘
```

Use when tasks are independent.

### Dependency-aware execution

```
T1 ────────┐
           ├──► T4 Aggregate
T2 ────────┘
           │
T3 ────────┘
```

The Delegator should avoid unnecessary parallelism because excessive fan-out can increase:

* LLM cost

* Tool/API load

* Queue pressure

* Memory usage

* Failure probability

* Aggregation complexity

## 9. Delegator Workflow State

The Delegator maintains domain-level task state.

JSON

```
{
  "delegation_id": "DT-5001",
  "workflow_id": "WF-1001",
  "status": "running",
  "subtasks": {
    "WT-1001": "completed",
    "WT-1002": "running",
    "WT-1003": "pending"
  },
  "dependencies": {
    "WT-1002": ["WT-1001"],
    "WT-1003": ["WT-1002"]
  },
  "results": {
    "WT-1001": "result-001"
  },
  "retry_counts": {
    "WT-1001": 0,
    "WT-1002": 0
  }
}
```

The Delegator tracks:

* Parent task

* Subtasks

* Dependencies

* Selected Workers

* Execution status

* Intermediate results

* Retry attempts

* Errors

* Partial completion

* Aggregation status

* Final domain result

### State ownership

```
Coordinator → Enterprise workflow state
Delegator   → Domain task state
Worker      → Local execution state
LangGraph   → Workflow transitions and checkpoints
```

## 10. LangGraph Inside the Delegator

A Delegator can use LangGraph to manage its internal workflow.

```
START
  ↓
Receive Domain Task
  ↓
Validate Task
  ↓
Decompose Task
  ↓
Identify Dependencies
  ↓
Discover Workers
  ↓
Select Workers
  ↓
Execute Tasks
  ↓
Monitor Results
  ↓
Aggregate Domain Result
  ↓
Return to Coordinator
  ↓
END
```

Example conceptual graph:

Python

Run

```
from langgraph.graph import StateGraph, START, END

builder = StateGraph(dict)

builder.add_node("validate_task", validate_task)
builder.add_node("decompose_task", decompose_task)
builder.add_node("discover_workers", discover_workers)
builder.add_node("execute_tasks", execute_tasks)
builder.add_node("aggregate_results", aggregate_results)

builder.add_edge(START, "validate_task")
builder.add_edge("validate_task", "decompose_task")
builder.add_edge("decompose_task", "discover_workers")
builder.add_edge("discover_workers", "execute_tasks")
builder.add_edge("execute_tasks", "aggregate_results")
builder.add_edge("aggregate_results", END)

delegator_graph = builder.compile()
```

This is conceptual code; production implementations should add authorization, persistence, error handling, and controlled execution.

## 11. Conditional Routing and Recovery

The Delegator decides what happens when a Worker fails.

```
Worker Result
     │
     ├── Success ──────────────► Continue / Aggregate
     │
     ├── Retryable Failure ────► Retry
     │
     ├── Worker Unavailable ───► Rediscover / Failover
     │
     ├── Missing Input ────────► Ask Coordinator
     │
     ├── Approval Required ────► Pause / Human Review
     │
     └── Permanent Failure ────► Partial Result / Escalate
```

Example:

Python

Run

```
def route_worker_result(state):
    if state["status"] == "completed":
        return "aggregate"

    if state["retryable"]:
        return "retry"

    if state["worker_unavailable"]:
        return "rediscover"

    if state["approval_required"]:
        return "human_review"

    return "fail_or_escalate"
```

Retries should be bounded by:

* Error classification

* Maximum attempts

* Deadline

* Backoff and jitter

* Worker health

* Idempotency

* Cost budget

* Business risk

## 12. Worker Failover

If a selected Worker becomes unavailable, the Delegator can rediscover another eligible Worker.

```
Selected Worker A
       ↓
Unavailable
       ↓
Agent Registry
       ↓
Worker B
       ↓
Validate compatibility and authorization
       ↓
Retry or reassign task
```

The Delegator should not automatically retry a non-idempotent write without reconciliation or an idempotency key.

```
Read operation:
Retry may be safe.

Create / update operation:
Retry requires idempotency and business safeguards.
```

## 13. Aggregating Worker Results

The Delegator converts multiple Worker results into one domain-level result.

```
Tracking Worker ─────┐
                     │
Carrier Worker ──────┼──► Shipping Delegator
                     │
Route Worker ────────┘
                              │
                              ▼
                     Domain-Level Result
```

Example Worker results:

JSON

```
[
  {
    "task_id": "WT-1001",
    "status": "completed",
    "result": {
      "latest_status": "delayed"
    }
  },
  {
    "task_id": "WT-1002",
    "status": "completed",
    "result": {
      "root_cause": "carrier_capacity"
    }
  }
]
```

The Delegator returns:

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator",
  "target_agent": "coordinator",
  "status": "completed",
  "result": {
    "domain": "logistics",
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommended_action": "evaluate_approved_reroute"
  },
  "worker_summary": {
    "total": 2,
    "successful": 2,
    "failed": 0
  },
  "errors": [],
  "artifacts": []
}
```

The Delegator should not forward raw Worker outputs unless explicitly required by the contract.

## 14. Partial Results

A domain task may complete partially.

```
Tracking Worker → Success
Carrier Worker  → Success
Route Worker    → Timeout
```

The Delegator may return:

JSON

```
{
  "status": "partial",
  "result": {
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity"
  },
  "warnings": [
    "Reroute options could not be retrieved within the deadline."
  ],
  "errors": [
    {
      "task_id": "WT-1003",
      "type": "timeout",
      "retryable": true
    }
  ]
}
```

This allows the Coordinator to decide whether to:

* Continue with partial information

* Retry

* Ask the user

* Escalate

* Return a limited answer

## 15. Delegator and Data Access

The Delegator generally does not directly access every enterprise system. It routes work to Workers with the appropriate capabilities.

```
Delegator
    ↓
Tracking Worker
    ↓
MCP Client
    ↓
Shipping MCP Server
    ↓
Tracking API
```

For knowledge retrieval:

```
Delegator
    ↓
RAG Worker
    ↓
Entitlement-Aware Retrieval
    ↓
Azure AI Search
    ↓
Authorized Evidence
```

The Worker remains responsible for task-level authorization and secure execution.

## 16. Delegator vs Coordinator vs Worker

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

Enterprise objective

|

✓

|  |  |
|

Domain objective

|  |

✓

|  |
|

Intent interpretation

|

✓

|  |  |
|

Enterprise planning

|

✓

|  |  |
|

Domain decomposition

|  |

✓

|  |
|

Worker discovery

|  |

✓

|  |
|

Worker selection

|  |

✓

|  |
|

Domain authorization

|  |

✓

|  |
|

Specialized execution

|  |  |

✓

|
|

Tool / MCP execution

|  |  |

✓

|
|

Local business logic

|  |  |

✓

|
|

Domain aggregation

|  |

✓

|  |
|

Enterprise aggregation

|

✓

|  |  |
|

Enterprise workflow state

|

✓

|  |  |
|

Domain task state

|  |

✓

|  |
|

Local execution state

|  |  |

✓

|

## 17. Common Anti-Patterns

### 1. Delegator sends the entire user conversation to every Worker

Problem: Excessive context, security exposure, and unclear responsibility.

Better: Send the minimum authorized task context.

### 2. Delegator selects Workers only by name

Problem: Hardcoded routing prevents scaling and failover.

Better: Use capability-based discovery and runtime eligibility.

### 3. Delegator ignores authorization

Problem: A domain agent may invoke a Worker or resource outside the user's entitlement.

Better: Validate task, scope, and permissions before execution.

### 4. Delegator creates unnecessary subtasks

Problem: More agents increase latency, cost, and failure probability.

Better: Decompose only when specialization or dependency requires it.

### 5. Delegator treats all failures as retryable

Problem: Causes retry storms and duplicate writes.

Better: Classify errors and apply bounded recovery.

### 6. Delegator forwards raw Worker results

Problem: Exposes internal details and may leak sensitive data.

Better: Validate, aggregate, and return a domain-level contract.

### 7. Delegator assumes a healthy Worker is always available

Problem: Health does not guarantee capacity or readiness.

Better: Consider health, readiness, availability, load, and deadline.

## 18. End-to-End Example

```
User:
"Why is shipment SHIP123 delayed?"
        ↓
Gateway
        ↓
Coordinator
        ├── Intent: root_cause_analysis
        ├── Domain: logistics
        ├── Authorization
        └── Delegates domain task
        ↓
Shipping Delegator
        ├── Validate task
        ├── Decompose objective
        ├── Identify dependencies
        ├── Discover Workers
        ├── Select tracking Worker
        └── Route task
        ↓
Tracking Worker
        ├── Validate task and scope
        ├── Call approved tracking tool
        ├── Retrieve authorized data
        └── Return tracking result
        ↓
Shipping Delegator
        ├── Analyze delay
        ├── Validate Worker result
        └── Aggregate domain result
        ↓
Coordinator
        ├── Validate domain result
        ├── Generate final response
        └── Return to user
```

## 19. Core Formula

Delegator=TaskValidation+DomainDecomposition+DependencyManagement+WorkerDiscovery+WorkerSelection+TaskRouting+ExecutionMonitoring+Recovery+DomainAggregation\boxed{ Delegator = TaskValidation + DomainDecomposition + DependencyManagement + WorkerDiscovery + WorkerSelection + TaskRouting + ExecutionMonitoring + Recovery + DomainAggregation }Delegator=TaskValidation+DomainDecomposition+DependencyManagement+WorkerDiscovery+WorkerSelection+TaskRouting+ExecutionMonitoring+Recovery+DomainAggregation

A more complete routing formula is:

WorkerSelection=CapabilityMatch∧Authorization∧ScopeAllowed∧Health∧Readiness∧Availability∧VersionCompatibility\boxed{ WorkerSelection = CapabilityMatch \land Authorization \land ScopeAllowed \land Health \land Readiness \land Availability \land VersionCompatibility }WorkerSelection=CapabilityMatch∧Authorization∧ScopeAllowed∧Health∧Readiness∧Availability∧VersionCompatibility

## 20. Interview-Ready Answer

> “In CWD, the Delegator is responsible for domain-level orchestration. It receives an authorized task from the Coordinator, validates the task and its scope, understands the domain objective, decomposes it into smaller Worker tasks, identifies dependencies, and determines which tasks can execute in parallel. It then queries the Agent Registry to discover Workers with the required capabilities and filters them using authorization, scope, health, readiness, availability, version, workload, priority, and deadline. The Delegator routes structured task contracts to the selected Workers through approved communication mechanisms such as A2A or internal task messaging. It monitors execution, handles retries, failover, partial failures, and approval requirements, and aggregates validated Worker results into a domain-level result for the Coordinator. LangGraph can manage the Delegator's state, transitions, checkpointing, and recovery, while Workers remain responsible for specialized business execution and tool access.”

## Final Definition

The Delegator in CWD is the domain-level orchestration component that receives an authorized enterprise task, decomposes it into capability-specific subtasks, identifies and selects eligible Worker agents through the Agent Registry, routes structured tasks for execution, manages dependencies and execution state, handles failures and recovery, and aggregates validated Worker results into a domain-level response for the Coordinator.

Mental model: Coordinator = What should happen? → Delegator = How should this domain execute it? → Agent Registry = Who can do it? → Worker = Perform the specialized action → Delegator = Aggregate the domain result.
