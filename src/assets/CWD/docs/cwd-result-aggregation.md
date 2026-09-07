# Worker Result Aggregation in CWD

Worker result aggregation is the process through which the Delegator collects outputs from multiple Workers, tools, and enterprise data sources, validates their correctness and authorization, resolves conflicts, combines the results into a domain-level outcome, and returns that outcome to the Coordinator.

> Workers execute specialized tasks; the Delegator determines what the combined results mean for the domain; the Coordinator uses the domain result for enterprise-level orchestration and final response generation.

```
Coordinator
     │
     ▼
Delegator
     │
     ├── Worker A ── Tool / API ── Enterprise System
     │
     ├── Worker B ── RAG / Search ── Knowledge Store
     │
     └── Worker C ── MCP Tool ── Enterprise System
     │
     ▼
Collect Results
     ↓
Validate + Authorize + Normalize
     ↓
Deduplicate + Resolve Conflicts
     ↓
Aggregate Domain Outcome
     ↓
Return Structured Result
     ▼
Coordinator
```

The Delegator should not simply concatenate raw Worker outputs. It must produce a validated, traceable, domain-level result.


## 1. Why Aggregation Is Necessary

A single business request may require several independent executions.

### Example: Shipment Delay Investigation

```
User: "Why is shipment SHIP123 delayed, and what should we do?"
```

The Coordinator may delegate the investigation to a Shipping Delegator, which creates:

|
Worker

|

Responsibility

|

Result

|
| --- | --- | --- |
|

Tracking Worker

|

Retrieve shipment events

|

Shipment is delayed

|
|

Carrier Worker

|

Check carrier conditions

|

Capacity constraint

|
|

Route Worker

|

Check alternative routes

|

Rerouting is possible

|
|

Policy Worker

|

Check rerouting rules

|

Approval may be required

|

The Delegator must combine these results into one coherent domain outcome:

JSON

```
{
  "shipment_id": "SHIP123",
  "status": "delayed",
  "root_cause": "carrier_capacity",
  "recommended_action": "reroute",
  "approval_required": true
}
```

Without aggregation, the Coordinator would receive disconnected technical outputs instead of a meaningful business result.

## 2. The Complete Aggregation Lifecycle

```
Receive Worker Results
        ↓
Correlate Results to Parent Task
        ↓
Check Execution Status
        ↓
Validate Schema and Data
        ↓
Validate Authorization and Scope
        ↓
Normalize Result Formats
        ↓
Deduplicate Overlapping Results
        ↓
Resolve Conflicts
        ↓
Assess Completeness
        ↓
Combine Domain Results
        ↓
Validate Aggregated Outcome
        ↓
Return to Coordinator
```

Each stage has a specific purpose.

## 3. Collecting Results from Multiple Workers

The Delegator may receive results through:

* Synchronous function calls

* A2A responses

* Azure Service Bus messages

* Asynchronous callbacks

* Polling or status queries

* Checkpoint-resume workflows

Every result must contain enough identity information to associate it with the correct task.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "workflow_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "worker_id": "tracking-worker",
  "run_id": "RUN-001",
  "status": "completed"
}
```

### Why correlation matters

A Delegator may execute many tasks concurrently. Without `task_id`, `parent_task_id`, and `correlation_id`, a result could be associated with the wrong request or domain task.

## 4. Collecting Tool and Data-Source Results

Workers may themselves call several tools or data sources.

```
Tracking Worker
   ├── Tracking API
   └── Carrier API

Analysis Worker
   ├── Azure AI Search
   └── Policy Repository

Route Worker
   ├── Route API
   └── Inventory Database
```

The Delegator generally receives Worker-level results, not every raw database row or API response.

```
Raw API / Database / MCP Results
        ↓
Worker Validation and Transformation
        ↓
Worker Result
        ↓
Delegator Aggregation
```

This preserves separation of responsibilities:

* Worker: Understands the source and validates its output.

* Delegator: Combines domain results.

* Coordinator: Combines domain outcomes across the enterprise.

## 5. Validating Execution Status

The Delegator must distinguish between different result states.

JSON

```
{
  "task_id": "WT-1001",
  "status": "completed",
  "result": {
    "latest_status": "delayed"
  },
  "error": null
}
```

Possible statuses include:

* `completed`

* `failed`

* `partial`

* `timeout`

* `cancelled`

* `needs_input`

* `needs_approval`

A task with `status: "completed"` may still contain a business outcome such as `shipment_not_found`. Conversely, a task with `status: "failed"` may have produced a useful partial result.

### Important distinction

```
Execution Status ≠ Business Outcome
```

The Delegator must preserve both.

## 6. Schema and Data Validation

Before combining results, the Delegator validates:

* Required fields

* Data types

* Expected schema

* Task identity

* Source and Worker identity

* Result completeness

* Business validity

* Data freshness

* Error structure

* Output size

* Provenance

Example:

Python

Run

```
def validate_worker_result(result):
    required = ["task_id", "status"]

    for field in required:
        if field not in result:
            raise ValueError(f"Missing field: {field}")

    if result["status"] == "completed" and "result" not in result:
        raise ValueError("Completed result must contain business output")

    return result
```

A successful HTTP response or valid JSON does not automatically mean the business result is correct.

## 7. Authorization and Scope Validation

The Delegator must ensure that each result belongs to the authorized task and scope.

For example:

```
Worker A → Tenant A shipment data
Worker B → Tenant B shipment data
```

The Delegator must not combine those results merely because they have similar shipment identifiers.

Validation should include:

* Tenant identity

* User entitlement scope

* Parent task scope

* Business domain

* Resource identity

* Data classification

* Allowed result-sharing boundary

  Authorized Result
  =
  Valid Result
  ∩ Correct Tenant
  ∩ Correct Task
  ∩ Correct Resource
  ∩ Allowed Scope

Authorization is not inherited merely because another Worker was authorized.

## 8. Normalizing Different Result Formats

Different Workers may return different structures.

### Tracking Worker

JSON

```
{
  "shipment_id": "SHIP123",
  "latest_status": "delayed"
}
```

### Carrier Worker

JSON

```
{
  "shipment": "SHIP123",
  "cause_code": "CAPACITY"
}
```

### Route Worker

JSON

```
{
  "id": "SHIP123",
  "alternative_available": true
}
```

The Delegator normalizes them into a common domain model:

JSON

```
{
  "shipment_id": "SHIP123",
  "tracking_status": "delayed",
  "delay_cause": "carrier_capacity",
  "alternative_available": true
}
```

Normalization prevents every downstream component from understanding every Worker-specific schema.

## 9. Deduplicating Results

Multiple Workers may return overlapping information.

```
Tracking Worker:
"Shipment delayed."

Carrier Worker:
"Shipment delayed because of capacity."

Policy Worker:
"Shipment is currently delayed."
```

The Delegator should avoid repeating the same fact several times.

Deduplication may use:

* Stable record IDs

* Source document IDs

* Event IDs

* Content hashes

* Business-object identifiers

* Semantic similarity

* Version and timestamp comparison

  Duplicate Information
  ↓
  Retain Authoritative / Newest / Most Complete Record
  ↓
  Preserve Source References

Deduplication should not remove genuinely independent evidence.

## 10. Resolving Conflicting Results

Different sources may disagree.

### Example

```
Tracking API: Shipment delayed
Carrier API: Shipment in transit
```

The Delegator should not blindly choose the first result or ask the LLM to decide without evidence.

A conflict-resolution strategy may consider:

1. Source authority

2. Data freshness

3. Effective date

4. Record version

5. Business context

6. Source reliability

7. Policy-defined precedence

8. Human review for high-impact conflicts

JSON

```
{
  "field": "shipment_status",
  "values": [
    {
      "value": "delayed",
      "source": "tracking-api",
      "observed_at": "2026-09-06T15:10:00Z"
    },
    {
      "value": "in_transit",
      "source": "carrier-api",
      "observed_at": "2026-09-06T14:45:00Z"
    }
  ],
  "resolution": {
    "selected_value": "delayed",
    "reason": "newer authoritative tracking event"
  }
}
```

If the conflict cannot be safely resolved, the Delegator should return:

```
status = partial
conflicts = present
needs_review = true
```

It should not invent certainty.

## 11. Handling Partial Results

Multi-Worker execution can partially succeed.

```
Tracking Worker  → Completed
Carrier Worker   → Completed
Route Worker     → Timeout
```

The Delegator should preserve the successful results and explicitly report the missing information.

JSON

```
{
  "status": "partial",
  "result": {
    "shipment_id": "SHIP123",
    "latest_status": "delayed",
    "delay_cause": "carrier_capacity"
  },
  "missing_information": [
    "alternative_route_analysis"
  ],
  "warnings": [
    "Route Worker timed out"
  ]
}
```

Partial aggregation is useful when the available evidence is sufficient for a limited response.

## 12. Sequential and Parallel Aggregation

### Sequential execution

```
Worker A
   ↓
Worker B uses A's result
   ↓
Worker C uses B's result
   ↓
Aggregate
```

Example:

```
Retrieve shipment → Analyze delay → Recommend action
```

### Parallel execution

```
             ┌── Worker A ──┐
Delegator ───┼── Worker B ──┼── Aggregate
             └── Worker C ──┘
```

Example:

```
Tracking ───────┐
Carrier ────────┼── Domain Aggregation
Route ──────────┘
```

Parallel tasks reduce latency when they are independent, but the Delegator must wait for required dependencies before final aggregation.

## 13. Dependency-Aware Aggregation

The Delegator can model dependencies as a directed acyclic graph.

```
Tracking Data
     │
     ├──────────────► Delay Analysis
     │
     └──────────────► Route Analysis
                            │
                            ▼
                     Recommendation
                            │
                            ▼
                       Aggregation
```

A dependent Worker should not execute until its prerequisite data is available and validated.

The Delegator must distinguish:

* A task that failed

* A task that was skipped because a dependency failed

* A task that is still waiting

* A task that completed with partial data

This distinction is important for recovery and auditability.

## 14. Domain-Level Aggregation

The Delegator transforms individual Worker results into a domain-level outcome.

Python

Run

```
def aggregate_shipping_results(results):
    tracking = results["tracking"]
    carrier = results["carrier"]
    route = results["route"]

    return {
        "shipment_id": tracking["shipment_id"],
        "status": tracking["latest_status"],
        "root_cause": carrier["delay_cause"],
        "recommended_action": (
            "reroute"
            if route["alternative_available"]
            else "monitor"
        )
    }
```

The Delegator should use deterministic business rules for deterministic decisions. An LLM may help summarize or interpret ambiguous evidence, but the aggregation contract and policy constraints should remain controlled by the runtime.

## 15. Aggregation with LLM Assistance

An LLM can assist with:

* Summarizing multiple Worker results

* Explaining conflicting evidence

* Producing a natural-language domain summary

* Extracting common themes

* Generating a structured explanation

  Validated Worker Results
  ↓
  Context Assembly
  ↓
  Governed Prompt
  ↓
  LLM
  ↓
  Structured Domain Summary
  ↓
  Schema + Business Validation

The LLM should not:

* Override authorization

* Invent missing results

* Change task status

* Ignore failed Workers

* Resolve security conflicts

* Execute unauthorized actions

Example bounded prompt:

```
Summarize the validated shipping results.
Use only the supplied evidence.
Identify uncertainty and conflicts.
Do not invent missing information.
Return the required JSON schema.
```

## 16. Returning Results to the Coordinator

The Delegator returns a domain-level result, not raw Worker implementation details.

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator",
  "target_agent": "coordinator",
  "status": "completed",
  "result": {
    "domain": "shipping",
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommended_action": "reroute"
  },
  "worker_summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "errors": [],
  "warnings": [],
  "artifacts": [],
  "metadata": {
    "duration_ms": 4200
  }
}
```

The Coordinator can then:

* Combine results from other Delegators

* Decide whether more work is required

* Trigger recovery

* Request human approval

* Generate the final user response

## 17. Delegator vs Coordinator Aggregation

|
Aspect

|

Delegator

|

Coordinator

|
| --- | --- | --- |
|

Aggregation scope

|

Domain-level

|

Enterprise-level

|
|

Inputs

|

Worker results

|

Delegator results

|
|

Main question

|

What happened in this domain?

|

What does this mean for the overall request?

|
|

Responsibilities

|

Normalize, deduplicate, validate, combine

|

Combine domains, resolve enterprise dependencies, generate final response

|
|

Output

|

Domain result

|

Final enterprise outcome

|

```
Worker Results
      ↓
Delegator Aggregation
      ↓
Domain Result
      ↓
Coordinator Aggregation
      ↓
Enterprise Result
      ↓
Final Response
```

## 18. Aggregation and LangGraph

LangGraph can manage the aggregation workflow.

```
START
  ↓
Receive Worker Results
  ↓
Validate Results
  ↓
Check Completeness
  ↓
{All Required Results Available?}
  ├── Yes → Normalize
  ├── No  → Wait / Retry / Recover
  └── Partial → Aggregate Partial Result
  ↓
Resolve Conflicts
  ↓
Aggregate Domain Outcome
  ↓
Validate Aggregated Result
  ↓
Return to Coordinator
```

LangGraph provides:

* State management

* Conditional routing

* Parallel branch coordination

* Checkpointing

* Retry and recovery

* Human approval pauses

* Resumption after asynchronous results

The actual data validation, authorization, and business rules remain implemented by the appropriate services.

## 19. Aggregation State

The Delegator may maintain state such as:

JSON

```
{
  "parent_task_id": "DT-5001",
  "expected_tasks": [
    "WT-1001",
    "WT-1002",
    "WT-1003"
  ],
  "completed_tasks": [
    "WT-1001",
    "WT-1002"
  ],
  "pending_tasks": [
    "WT-1003"
  ],
  "results": {
    "WT-1001": "result-001",
    "WT-1002": "result-002"
  },
  "status": "waiting",
  "aggregation_status": "partial"
}
```

Large raw outputs should normally be stored by reference rather than copied into every state object.

## 20. Observability and Provenance

Every aggregated result should be traceable to its contributing sources.

```
Coordinator Request
   ↓
Delegator Task
   ↓
Worker Task
   ↓
Tool / API / RAG Result
   ↓
Validated Worker Result
   ↓
Aggregated Domain Result
```

Useful metadata includes:

* `correlation_id`

* `workflow_id`

* `task_id`

* `run_id`

* `step_id`

* Worker ID and version

* Tool or API name

* Source document or record reference

* Validation status

* Conflict-resolution decision

* Aggregation duration

* Error and retry information

This allows the Coordinator and operators to answer:

> Which evidence and Worker executions produced this domain result?

## 21. Failure and Recovery During Aggregation

|
Scenario

|

Delegator action

|
| --- | --- |
|

One Worker times out

|

Retry, fail over, or return partial result

|
|

One Worker returns invalid schema

|

Reject result and recover

|
|

Required Worker fails

|

Wait, retry, or stop aggregation

|
|

Optional Worker fails

|

Continue with warning

|
|

Conflicting source values

|

Apply authority/freshness rules or escalate

|
|

Duplicate result arrives

|

Use idempotency and ignore duplicate processing

|
|

Result belongs to wrong task

|

Reject and audit

|
|

Aggregation exceeds deadline

|

Return timeout or partial result

|
|

Human approval required

|

Persist state and pause

|
|

Coordinator unavailable

|

Persist result and retry delivery

|

### Idempotent aggregation

The Delegator should be able to process the same result more than once without duplicating its effect.

Python

Run

```
def record_result(result):
    key = f"{result['parent_task_id']}:{result['task_id']}"

    if result_store.exists(key):
        return "already_processed"

    result_store.save(key, result)
    return "recorded"
```

The exact implementation may use Cosmos DB, Redis, or another durable store according to the reliability requirements.

## 22. Common Anti-Patterns

### 1. Concatenating raw Worker outputs

Problem: Produces inconsistent, duplicated, and difficult-to-interpret results.

Better: Normalize and aggregate into a domain contract.

### 2. Treating every Worker as successful because it returned HTTP 200

Problem: Technical success may hide business failure or invalid data.

Better: Validate execution status and business result separately.

### 3. Ignoring partial failures

Problem: The Coordinator may believe the domain result is complete when important evidence is missing.

Better: Return explicit partial status and missing information.

### 4. Letting the LLM resolve authorization conflicts

Problem: A language model is not a security authority.

Better: Enforce authorization and source precedence outside the LLM.

### 5. Losing provenance

Problem: The system cannot explain where the result came from.

Better: Preserve Worker, task, source, version, and evidence references.

### 6. Aggregating results across incompatible tenants or scopes

Problem: Can cause data leakage and incorrect business conclusions.

Better: Validate tenant and resource scope before aggregation.

### 7. Retrying aggregation without idempotency

Problem: Duplicate results or repeated side effects may occur.

Better: Use stable task identities and idempotent result recording.

## 23. Core Aggregation Formula

DomainAggregation=ResultCollection+Correlation+StatusValidation+SchemaValidation+AuthorizationValidation+Normalization+Deduplication+ConflictResolution+CompletenessAssessment+BusinessCombination+OutputValidation\boxed{ DomainAggregation = ResultCollection + Correlation + StatusValidation + SchemaValidation + AuthorizationValidation + Normalization + Deduplication + ConflictResolution + CompletenessAssessment + BusinessCombination + OutputValidation }DomainAggregation=ResultCollection+Correlation+StatusValidation+SchemaValidation+AuthorizationValidation+Normalization+Deduplication+ConflictResolution+CompletenessAssessment+BusinessCombination+OutputValidation

A more precise conceptual formula is:

AggregatedResult=ValidatedWorkerResults+AuthorizedToolData+AuthorizedEnterpriseEvidence+DomainLogic−Duplicates−InvalidResults−UnauthorizedData+ConflictResolution\boxed{ AggregatedResult = ValidatedWorkerResults + AuthorizedToolData + AuthorizedEnterpriseEvidence + DomainLogic - Duplicates - InvalidResults - UnauthorizedData + ConflictResolution }AggregatedResult=ValidatedWorkerResults+AuthorizedToolData+AuthorizedEnterpriseEvidence+DomainLogic−Duplicates−InvalidResults−UnauthorizedData+ConflictResolution

Subject to:

```
Task Scope + Business Rules + Deadline + Output Schema + Security Policy
```

## Interview-Ready Answer

> “In CWD, the Delegator aggregates results from multiple Workers, tools, and enterprise data sources into a validated domain-level outcome. It first correlates each result using task, workflow, parent-task, and correlation identifiers. It then checks execution status, schema, authorization, tenant scope, data validity, and provenance. Results are normalized into a common domain model, deduplicated, and checked for conflicts using source authority, freshness, version, and business rules. The Delegator handles partial results, dependency failures, retries, and timeouts explicitly rather than hiding them. It may use an LLM to summarize validated evidence, but deterministic validation, authorization, and business rules remain outside the LLM. Finally, it returns a structured result containing domain output, execution status, Worker summary, warnings, errors, and metadata to the Coordinator. The Coordinator then performs enterprise-level aggregation and generates the final response.”

## Final Definition

Worker result aggregation in CWD is the governed process through which a Delegator collects correlated outputs from multiple Workers, tools, APIs, retrieval systems, and enterprise data sources; validates their execution status, schema, authorization, scope, and business correctness; normalizes, deduplicates, and reconciles the results; combines them using domain logic; and returns a structured, traceable domain-level outcome to the Coordinator.

Mental model: Collect → Correlate → Validate → Authorize → Normalize → Deduplicate → Resolve Conflicts → Assess Completeness → Aggregate → Validate → Return to Coordinator.
