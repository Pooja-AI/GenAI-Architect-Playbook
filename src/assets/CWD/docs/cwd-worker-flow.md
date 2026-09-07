# Worker Responsibilities in the CWD Platform

The Worker is the specialized execution component of CWD. It receives a well-defined task from a Delegator, validates the task and its access scope, applies domain logic, uses approved LLM capabilities and enterprise tools when needed, validates the result, and returns a structured response.

> A Worker does not independently decide the enterprise objective. It executes an authorized capability within a bounded task contract.

```
Delegator
    │
    │ Authorized task
    ▼
┌─────────────────────────────────────┐
│              WORKER                 │
│                                     │
│ Validate Input and Scope            │
│ Understand Assigned Objective       │
│ Apply Domain Logic                  │
│ Retrieve Authorized Data            │
│ Select Approved Tools               │
│ Invoke LLM When Needed              │
│ Execute Business Logic              │
│ Validate Output                     │
│ Return Structured Result            │
└───────────────┬─────────────────────┘
                │
       ┌────────┼─────────┐
       ▼        ▼         ▼
      LLM     MCP/API    RAG
                │         │
                ▼         ▼
        Enterprise Systems
```


## 1. What a Worker Receives

The Delegator sends a structured task contract containing the objective, inputs, constraints, and expected output.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator",
  "target_agent": "tracking-worker",
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

The Worker should not receive an unrestricted instruction such as:

```
"Do anything necessary to investigate this shipment."
```

Instead, it receives a bounded objective:

```
"Retrieve authorized tracking events for shipment SHIP123."
```

This improves security, testability, reliability, and observability.

## 2. The Worker Execution Lifecycle

```
Receive Task
     ↓
Validate Task
     ↓
Validate Identity and Scope
     ↓
Understand Assigned Objective
     ↓
Select Execution Strategy
     ↓
Apply Domain Logic
     ↓
Retrieve Data / Call Tools / Invoke LLM
     ↓
Validate Results
     ↓
Build Structured Output
     ↓
Return Result
```

The Worker may use several execution mechanisms, but the overall lifecycle remains controlled.

## 3. Task and Input Validation

Before execution, the Worker validates:

* Task ID and parent task

* Required capability

* Input schema

* Required fields

* Data types

* Business constraints

* Tenant and scope

* Deadline and priority

* Expected output format

* Authorization context

Example:

Python

Run

```
def validate_task(task):
    if task["capability"] != "shipment_tracking":
        raise ValueError("Unsupported capability")

    if not task["input"].get("shipment_id"):
        raise ValueError("shipment_id is required")

    if not authorized_for_scope(task):
        raise PermissionError("Unauthorized task scope")

    return True
```

The Worker must reject malformed or unauthorized tasks before invoking tools or accessing enterprise data.

## 4. Domain Logic

Domain logic is the business-specific reasoning and rules implemented by the Worker.

For a shipping Worker, domain logic may include:

```
Shipment Status
Carrier Events
Expected Delivery
Delay Classification
Route Constraints
Business Rules
```

Example:

Python

Run

```
def classify_delay(tracking_events):
    if not tracking_events:
        return "unknown"

    latest_event = tracking_events[-1]

    if latest_event["status"] == "carrier_capacity":
        return "carrier_capacity"

    if latest_event["status"] == "weather":
        return "weather"

    return "other"
```

The Worker should not rely on an LLM for deterministic business rules when ordinary code can enforce them more reliably.

### Separation

```
Deterministic Business Rules
        ↓
Python / Java / SQL / Domain Services

Probabilistic Reasoning
        ↓
LLM
```

For example:

* Code: Validate shipment ID, calculate delivery variance, enforce thresholds.

* LLM: Summarize events, explain a delay, classify ambiguous text.

* Policy engine: Decide whether access or an action is permitted.

## 5. LLM Capabilities Inside a Worker

A Worker may use an LLM for bounded tasks such as:

* Natural-language classification

* Summarization

* Explanation

* Entity extraction

* Ambiguous text interpretation

* Recommendation generation

* Structured output generation

Example:

```
Tracking Events
      ↓
Worker Domain Logic
      ↓
LLM
      ↓
"Explain the likely cause of the delay"
      ↓
Structured Explanation
```

The LLM should receive only the context required for its assigned task.

JSON

```
{
  "task": "Explain shipment delay",
  "shipment_id": "SHIP123",
  "authorized_events": [
    {
      "status": "delayed",
      "reason": "carrier_capacity"
    }
  ]
}
```

The LLM should not receive unrestricted enterprise data, hidden credentials, or unrelated conversation history.

## 6. LLM Is Not the Execution Authority

The Worker may ask the LLM to recommend a tool or produce a plan, but the runtime must validate and enforce the action.

```
Worker
  ↓
LLM Recommendation
  ↓
Tool Schema Validation
  ↓
Authorization / Policy
  ↓
Approved Tool
  ↓
Execution
```

Example:

```
LLM recommends:
"Call get_tracking_events"

Worker validates:
- Is this tool approved?
- Is the input valid?
- Is the user authorized?
- Is the shipment within scope?
- Is the tool allowed for this Worker?
```

The Worker must not allow the LLM to directly execute arbitrary shell commands, SQL, HTTP requests, or unrestricted enterprise operations.

## 7. Tool and API Execution

Workers use approved tools and APIs to access enterprise capabilities.

```
Worker
   ↓
Tool Selection
   ↓
Input Validation
   ↓
Authorization
   ↓
MCP Client / API Adapter
   ↓
Enterprise API
   ↓
Validated Result
```

Example:

Python

Run

```
def get_tracking_events(shipment_id, user_context):
    authorize(
        user=user_context,
        permission="shipment.read",
        resource=shipment_id
    )

    return tracking_api.get_events(shipment_id)
```

The Worker should use a narrow business interface:

```
get_tracking_events(shipment_id)
```

rather than unrestricted access:

```
execute_arbitrary_sql(query)
```

## 8. MCP Integration

MCP provides a standardized integration boundary between the Worker and approved enterprise capabilities.

```
Worker
   ↓
MCP Client
   ↓
Shipping MCP Server
   ↓
get_tracking_events
   ↓
Tracking API
   ↓
Enterprise System
```

The Worker uses MCP to:

* Discover approved tools

* Validate tool schemas

* Invoke tools

* Receive structured results

* Handle tool errors

The MCP server remains responsible for its own authentication, authorization, input validation, and backend execution controls.

> MCP standardizes how the Worker accesses capabilities; it does not automatically authorize the Worker.

## 9. Enterprise Data Access

A Worker may access enterprise data through two main patterns.

### A. RAG for knowledge

```
Worker
   ↓
Query Understanding
   ↓
Entitlement-Aware Retrieval
   ↓
Azure AI Search / Vector Store
   ↓
Authorized Chunks
   ↓
Context Assembly
   ↓
LLM
```

Use cases:

* Policy explanation

* Engineering documentation

* Knowledge-base questions

* Procedure lookup

* Historical document analysis

### B. API/MCP for live data

```
Worker
   ↓
Approved MCP Tool / API
   ↓
Enterprise System
   ↓
Current Transactional Data
```

Use cases:

* Current shipment status

* Inventory quantity

* Order status

* Employee record lookup

* Production system information

The Worker must not treat RAG as a substitute for a live system of record when current transactional data is required.

## 10. Entitlement-Aware Retrieval

Before enterprise data reaches the LLM, the Worker applies authorization and security filtering.

```
User Identity
      ↓
Entitlements
      ↓
Resource ACL
      ↓
Security Filter
      ↓
Search
      ↓
Authorized Results
      ↓
LLM Context
```

The core rule is:

AuthorizedData=RelevantData∩UserEntitlements∩ResourceACL∩BusinessScope\boxed{ AuthorizedData = RelevantData \cap UserEntitlements \cap ResourceACL \cap BusinessScope }AuthorizedData=RelevantData∩UserEntitlements∩ResourceACL∩BusinessScope

A semantically relevant document must still be excluded if the user is not entitled to access it.

## 11. Worker Result Validation

A Worker should never assume that a tool or LLM result is correct merely because the call succeeded.

Validation may include:

* Schema validation

* Required fields

* Data types

* Business rules

* Completeness

* Freshness

* Authorization

* Grounding

* Sensitive-data leakage

* Output size

* Confidence or uncertainty

Example:

Python

Run

```
def validate_tracking_result(result):
    required = ["shipment_id", "latest_status"]

    for field in required:
        if field not in result:
            raise ValueError(f"Missing field: {field}")

    if result["latest_status"] not in {
        "in_transit",
        "delivered",
        "delayed",
        "cancelled"
    }:
        raise ValueError("Invalid shipment status")

    return result
```

## 12. Structured Worker Result

The Worker returns a bounded result to the Delegator.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "worker": {
    "id": "tracking-worker",
    "version": "2.4.1"
  },
  "status": "completed",
  "result": {
    "shipment_id": "SHIP123",
    "latest_status": "delayed",
    "last_event": "Carrier capacity constraint",
    "event_time": "2026-09-06T15:10:00Z"
  },
  "artifacts": [],
  "warnings": [],
  "error": null,
  "metadata": {
    "duration_ms": 1240,
    "tools_used": [
      "get_tracking_events"
    ]
  }
}
```

The result separates:

```
Execution Status
    +
Business Result
    +
Errors
    +
Artifacts
    +
Execution Metadata
```

### Why this matters

A Worker may technically complete execution but return a business failure:

```
status = completed
business_result = shipment_not_found
```

Therefore:

> Execution success is not always business success.

## 13. Worker Error Handling

Workers classify errors rather than returning arbitrary text.

JSON

```
{
  "task_id": "WT-1001",
  "status": "failed",
  "error": {
    "code": "TRACKING_API_TIMEOUT",
    "type": "dependency_timeout",
    "message": "Tracking service did not respond within the deadline.",
    "retryable": true,
    "attempt": 1
  }
}
```

Typical error categories:

|
Error

|

Worker behavior

|
| --- | --- |
|

Invalid input

|

Reject

|
|

Unauthorized access

|

Stop and audit

|
|

Tool timeout

|

Return retryable error

|
|

API rate limit

|

Backoff or return retryable error

|
|

Invalid tool result

|

Reject result

|
|

Missing enterprise data

|

Return controlled business outcome

|
|

LLM timeout

|

Retry within budget

|
|

Policy violation

|

Stop

|
|

Dependency unavailable

|

Return structured failure

|

The Delegator or Coordinator may then decide whether to retry, fail over, replan, or escalate.

## 14. Worker State and Execution

A Worker may maintain local execution state:

```
Task ID
Current Step
Input Validation Status
Tool Calls
Intermediate Results
Retry Count
Execution Status
Final Result
```

For example:

JSON

```
{
  "task_id": "WT-1001",
  "status": "running",
  "current_step": "validate_tracking_result",
  "tool_calls": [
    {
      "tool": "get_tracking_events",
      "status": "completed"
    }
  ],
  "retry_count": 0
}
```

For complex Workers, LangGraph can manage this internal workflow.

```
START
  ↓
Validate Input
  ↓
Retrieve Data
  ↓
Select Tool
  ↓
Execute Tool
  ↓
Validate Result
  ↓
Apply Domain Logic
  ↓
Generate Output
  ↓
END
```

Simple atomic Workers may not need LangGraph.

## 15. Worker and LangGraph

LangGraph is useful when a Worker has multiple steps, conditional paths, retries, or human approval.

```
Worker
   └── LangGraph
         ├── Validate
         ├── Retrieve
         ├── Execute
         ├── Validate Output
         └── Return
```

### Separation

```
LangGraph
→ Controls workflow state and transitions

Worker
→ Implements specialized execution

MCP
→ Connects to approved tools

Policy
→ Authorizes actions

LLM
→ Performs bounded reasoning

RAG
→ Supplies authorized enterprise evidence
```

## 16. Example: Shipment Delay Worker

Python

Run

```
def execute_shipment_delay_task(task, user_context):
    # 1. Validate task
    validate_task(task)

    shipment_id = task["input"]["shipment_id"]

    # 2. Validate authorization and scope
    authorize(
        user=user_context,
        permission="shipment.read",
        resource=shipment_id
    )

    # 3. Retrieve current data through an approved adapter
    tracking_events = tracking_api.get_events(
        shipment_id=shipment_id
    )

    # 4. Validate enterprise result
    tracking_events = validate_tracking_events(
        tracking_events
    )

    # 5. Apply deterministic domain logic
    delay_category = classify_delay(tracking_events)

    # 6. Use LLM only for bounded explanation
    explanation = llm_explain_delay(
        events=tracking_events,
        category=delay_category
    )

    # 7. Validate generated explanation
    explanation = validate_explanation(explanation)

    # 8. Return structured result
    return {
        "task_id": task["task_id"],
        "status": "completed",
        "result": {
            "shipment_id": shipment_id,
            "delay_category": delay_category,
            "explanation": explanation
        }
    }
```

This example illustrates the principle:

```
Validate → Authorize → Retrieve → Apply Logic → Reason → Validate → Return
```

## 17. Worker Communication with the Delegator

```
Delegator
    ↓
Structured Task
    ↓
Worker
    ↓
Execution
    ↓
Structured Result
    ↓
Delegator
```

The Worker should not return only:

```
"Done."
```

It should return enough structured information for the Delegator to:

* Determine success or failure

* Aggregate results

* Identify partial completion

* Retry if appropriate

* Preserve provenance

* Explain the outcome

* Continue the workflow

## 18. Worker Responsibilities vs Other Components

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

Domain decomposition

|  |

✓

|  |
|

Specialized task execution

|  |  |

✓

|
|

Input validation

|  |

✓

|

✓

|
|

Task-level authorization

|  |  |

✓

|
|

Domain business logic

|  |  |

✓

|
|

LLM reasoning

|  |  |

✓

|
|

Tool/API execution

|  |  |

✓

|
|

Enterprise data retrieval

|  |  |

✓

|
|

Local workflow state

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

Final response

|

✓

|  |  |
|

Tool-level security

|  |  |

✓ / MCP

|

## 19. Common Anti-Patterns

### 1. Worker acts as an independent Coordinator

Problem: It expands scope, creates uncontrolled execution, and bypasses domain orchestration.

Better: Execute only the assigned capability.

### 2. Worker trusts the LLM's tool decision

Problem: The LLM may recommend unauthorized or invalid operations.

Better: Validate tools through policy, schemas, and approved adapters.

### 3. Worker accesses enterprise data without entitlement checks

Problem: It can expose cross-tenant or restricted information.

Better: Enforce authorization before retrieval and at the enterprise system.

### 4. Worker returns raw tool output

Problem: Internal data, secrets, or malformed results may leak.

Better: Validate, sanitize, and return a bounded result.

### 5. Worker uses an LLM for deterministic business rules

Problem: Probabilistic output can violate exact business requirements.

Better: Use code or policy engines for deterministic rules.

### 6. Worker has unrestricted tool access

Problem: A compromised or misdirected Worker can perform excessive actions.

Better: Use narrow, least-privilege tools.

### 7. Worker retries every failure

Problem: Causes duplicate writes, retry storms, and cost increases.

Better: Classify errors and apply bounded retry and idempotency.

## 20. Core Worker Formula

Worker=TaskValidation+Authorization+DomainLogic+LLMCapabilities+ToolExecution+EnterpriseDataAccess+ResultValidation+ErrorHandling+StructuredOutput\boxed{ Worker = TaskValidation + Authorization + DomainLogic + LLMCapabilities + ToolExecution + EnterpriseDataAccess + ResultValidation + ErrorHandling + StructuredOutput }Worker=TaskValidation+Authorization+DomainLogic+LLMCapabilities+ToolExecution+EnterpriseDataAccess+ResultValidation+ErrorHandling+StructuredOutput

A more complete execution formula is:

WorkerExecution=AuthorizedTask+ValidatedInput+DomainLogic+ApprovedTools+AuthorizedData+BoundedLLMReasoning+ValidatedOutput\boxed{ WorkerExecution = AuthorizedTask + ValidatedInput + DomainLogic + ApprovedTools + AuthorizedData + BoundedLLMReasoning + ValidatedOutput }WorkerExecution=AuthorizedTask+ValidatedInput+DomainLogic+ApprovedTools+AuthorizedData+BoundedLLMReasoning+ValidatedOutput

## 21. Interview-Ready Answer

> “In CWD, a Worker is a specialized execution agent responsible for completing an authorized task within a specific capability boundary. It receives a structured task from the Delegator, validates the input, identity, scope, and expected output, and then applies domain-specific business logic. Depending on the task, it may use deterministic code, an LLM for bounded reasoning, approved APIs or MCP tools for enterprise operations, and RAG for authorized knowledge retrieval. Before accessing data or tools, the Worker enforces task-level and resource-level authorization. It validates tool results and LLM outputs, handles errors and controlled retries, and returns a structured result containing execution status, business output, warnings, errors, and metadata. The Worker does not independently determine the enterprise objective or bypass policy. The Delegator manages domain orchestration, while the Worker performs the specialized action and reports the result.”

## Final Definition

A Worker in CWD is a specialized execution component that receives an authorized task, validates its inputs and security context, applies domain-specific logic, uses approved LLM capabilities, tools, APIs, and enterprise data, validates the resulting output, handles execution failures, and returns a structured, traceable result to the Delegator.

Mental model: Delegator assigns the task → Worker validates and executes → Domain logic + LLM + MCP/API + RAG provide capabilities → Worker validates the result → Delegator aggregates the outcome.
