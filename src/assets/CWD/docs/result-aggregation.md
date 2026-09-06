# How the Coordinator Collects, Validates, Combines, and Synthesizes Results

## 1. Overview

In CWD, the Coordinator is responsible not only for sending tasks to downstream agents, but also for **bringing their results back together into one reliable enterprise response**.

When a business request requires multiple Delegators, Workers, tools, or enterprise systems, the Coordinator must determine:

* Which results have been received
* Which task produced each result
* Whether the result is valid
* Whether all required tasks completed
* Whether results are consistent
* How results should be combined
* Whether additional execution is required
* How the final response should be synthesized

The overall flow is:

```text
                    User Request
                         |
                         v
                    Coordinator
                         |
                  Execution Plan
                         |
              +----------+----------+
              |          |          |
              v          v          v
          Delegator A Delegator B Worker C
              |          |          |
              v          v          v
           Result A    Result B    Result C
              |          |          |
              +----------+----------+
                         |
                         v
                Result Collection
                         |
                         v
                  Result Validation
                         |
                         v
                Result Correlation
                         |
                         v
                Result Aggregation
                         |
                         v
                 Conflict Analysis
                         |
                         v
                  LLM Synthesis
                         |
                         v
              Final Response Validation
                         |
                         v
                       User
```

The key principle is:

> **The Coordinator does not blindly concatenate agent responses. It collects, validates, correlates, aggregates, and then synthesizes the results into a coherent final business response.**

---

# 2. Why Result Aggregation Is Required

Consider a request:

```text
"Create a customer briefing for ABC Corporation."
```

The Coordinator may have generated the following tasks:

```text
Task 1 → Customer Profile
Task 2 → Open Opportunities
Task 3 → Revenue
Task 4 → Recent Interactions
Task 5 → Generate Briefing
```

The first four tasks could execute independently:

```text
                  Coordinator
                       |
        +--------------+--------------+
        |              |              |
        v              v              v
 Customer Worker   Opportunity     Revenue
        |            Worker          Worker
        |              |              |
        v              v              v
    Profile       Opportunities     Revenue

                       +
                 Interaction
                    Worker
                       |
                       v
                  Interactions
```

The Coordinator must bring these results together before generating the final briefing.

---

# 3. Result Lifecycle

Every downstream result should follow a controlled lifecycle:

```text
Task Submitted
      |
      v
Task Running
      |
      v
Result Received
      |
      v
Result Correlated
      |
      v
Result Validated
      |
      v
Result Normalized
      |
      v
Result Aggregated
      |
      v
Conflict / Completeness Check
      |
      v
LLM Synthesis
      |
      v
Final Validation
      |
      v
Final Response
```

This provides a clear separation between:

```text
Collection
Validation
Aggregation
Synthesis
```

---

# 4. Collecting Results

The Coordinator receives results from downstream agents through the execution mechanism used by CWD, such as A2A and associated messaging patterns.

A result should contain execution metadata.

Example:

```json
{
  "task_id": "task-102",
  "run_id": "run-001",
  "correlation_id": "corr-123",
  "source_agent": "sales-delegator",
  "status": "completed",
  "result": {
    "customer": "ABC Corporation",
    "open_opportunities": 4
  }
}
```

The Coordinator uses:

```text
task_id
run_id
correlation_id
```

to determine exactly where the result belongs.

---

# 5. Correlation of Results

Suppose several workers return results:

```text
Result A → task-101
Result B → task-102
Result C → task-103
Result D → task-104
```

The Coordinator maintains a mapping:

```text
Execution Plan
      |
      +--> task-101 → Customer Profile
      |
      +--> task-102 → Opportunities
      |
      +--> task-103 → Revenue
      |
      +--> task-104 → Interactions
```

When a result arrives:

```text
Incoming Result
      |
      v
Read task_id
      |
      v
Find corresponding task
      |
      v
Update task state
      |
      v
Store result
```

This prevents results from different tasks or executions from being mixed.

---

# 6. Result State

The Coordinator should maintain task execution status.

For example:

```text
task-101 → COMPLETED
task-102 → COMPLETED
task-103 → FAILED
task-104 → COMPLETED
```

The Coordinator can therefore determine:

```text
Required tasks = 4
Completed = 3
Failed = 1
```

It should not immediately generate a final answer without considering the failed task.

---

# 7. Result Validation

A downstream agent returning a successful HTTP/A2A response does not necessarily mean that the **business result is valid**.

The Coordinator can perform multiple validation checks.

### 7.1 Structural validation

Does the response conform to the expected schema?

```json
{
  "customer": "...",
  "revenue": 0,
  "currency": "USD"
}
```

If the expected field is missing:

```text
revenue = missing
```

the result is incomplete.

---

### 7.2 Status validation

```text
COMPLETED
FAILED
PARTIAL
TIMEOUT
CANCELLED
```

Only appropriate states should contribute to final synthesis.

---

### 7.3 Business validation

The Coordinator may validate basic business constraints.

For example:

```text
Revenue cannot be negative
Customer identifier must match requested customer
Currency must be known
Required reporting period must exist
```

Domain-specific validation can also remain within the Delegator/Worker.

---

### 7.4 Authorization validation

The Coordinator must ensure that the returned data is permitted to flow back to the user.

The execution being authorized does not automatically mean every returned field can be exposed.

```text
Agent Result
     |
     v
Data Governance / Policy
     |
     +---- Restricted ---> Redact
     |
     v
Approved Result
```

---

# 8. Result Normalization

Different agents may return information in different formats.

For example:

```text
Sales Worker:
revenue = "$12.5M"

Finance Worker:
revenue = 12500000

Analytics Worker:
revenue = 12.5
unit = "million USD"
```

The Coordinator should normalize results before aggregation.

Conceptually:

```text
Agent Results
      |
      v
Normalization
      |
      v
Common Result Model
```

Example:

```json
{
  "metric": "revenue",
  "value": 12500000,
  "currency": "USD",
  "period": "FY2026"
}
```

This makes downstream aggregation more reliable.

---

# 9. Result Aggregation

After validation and normalization, the Coordinator combines the results.

For example:

```text
Customer Profile
       +
Opportunities
       +
Revenue
       +
Interactions
       |
       v
Unified Customer Context
```

Conceptually:

```json
{
  "customer": {
    "name": "ABC Corporation",
    "profile": {...},
    "revenue": {...},
    "opportunities": [...],
    "interactions": [...]
  }
}
```

This aggregated context becomes the input to the synthesis step.

---

# 10. Aggregation Is Not the Same as Synthesis

This distinction is important.

### Aggregation

Combines structured information.

```text
Result A
Result B
Result C
      |
      v
Combined Data
```

### Synthesis

Uses reasoning to turn the combined information into a meaningful business response.

```text
Combined Data
      |
      v
LLM
      |
      v
Business Narrative
```

Therefore:

```text
Workers
   |
   v
Raw Results
   |
   v
Coordinator
   |
   +--> Validate
   |
   +--> Normalize
   |
   +--> Aggregate
   |
   v
Structured Context
   |
   v
LLM
   |
   v
Synthesized Response
```

---

# 11. Example of Aggregation

Suppose the downstream agents return:

### Customer Worker

```json
{
  "customer": "ABC Corporation",
  "industry": "Semiconductor",
  "region": "North America"
}
```

### Opportunity Worker

```json
{
  "open_opportunities": 4,
  "pipeline_value": 8200000
}
```

### Revenue Worker

```json
{
  "revenue": 12500000,
  "currency": "USD"
}
```

### Interaction Worker

```json
{
  "recent_interactions": 7,
  "last_interaction": "2026-08-28"
}
```

The Coordinator aggregates them:

```json
{
  "customer": "ABC Corporation",
  "industry": "Semiconductor",
  "region": "North America",
  "revenue": {
    "value": 12500000,
    "currency": "USD"
  },
  "opportunities": {
    "count": 4,
    "pipeline_value": 8200000
  },
  "interactions": {
    "count": 7,
    "last_interaction": "2026-08-28"
  }
}
```

---

# 12. Dependency-Aware Result Collection

The Coordinator must understand task dependencies.

Example:

```text
Task A ─────┐
            |
Task B ─────+----> Task D
            |
Task C ─────┘
```

Task D cannot execute until A, B, and C are complete.

Therefore:

```text
A = completed
B = completed
C = completed
        |
        v
D = READY
```

But:

```text
A = completed
B = failed
C = completed
        |
        v
D = BLOCKED
```

The Coordinator can then decide whether to:

```text
Retry B
Use alternate source
Continue with partial data
Ask for clarification
Fail workflow
```

---

# 13. Parallel Result Handling

CWD can execute independent tasks in parallel.

Example:

```text
Coordinator
     |
     +------------------+
     |                  |
     v                  v
Sales Delegator    Finance Delegator
     |                  |
     v                  v
Sales Workers      Finance Workers
     |                  |
     +--------+---------+
              |
              v
        Coordinator
```

Results may arrive at different times:

```text
10:01:01 → Sales result
10:01:03 → Finance result
10:01:05 → Customer result
```

The Coordinator uses task and correlation identifiers to associate each result with the correct execution.

It does not depend on response arrival order.

---

# 14. Partial Results

A production agentic workflow must handle partial completion.

Example:

```text
Customer Profile      → SUCCESS
Opportunities         → SUCCESS
Revenue               → TIMEOUT
Interactions          → SUCCESS
```

The Coordinator determines whether the missing revenue information is:

```text
Critical
```

or:

```text
Optional
```

If critical:

```text
Workflow
   |
   v
Retry / Alternate Agent / Escalation
```

If optional:

```text
Workflow
   |
   v
Continue with Partial Result
```

The final response should clearly indicate missing information rather than inventing it.

---

# 15. Conflicting Results

Multiple agents may return different values.

Example:

```text
Sales Agent:
Revenue = $12.5M

Finance Agent:
Revenue = $12.1M
```

The Coordinator should not arbitrarily choose one.

Instead:

```text
Conflicting Results
        |
        v
Identify Source
        |
        v
Check Timestamp
        |
        v
Check Data Authority
        |
        v
Apply Business Policy
        |
        v
Resolve / Report Conflict
```

For example, Finance may be the authoritative source for financial reporting.

The Coordinator can then prefer the governed authoritative source.

---

# 16. Source Attribution

Results should retain their source information.

For example:

```json
{
  "metric": "revenue",
  "value": 12500000,
  "source": "finance-worker",
  "system": "Snowflake",
  "retrieved_at": "2026-09-05T10:15:00Z"
}
```

This is valuable for:

* auditability
* traceability
* conflict resolution
* debugging
* business confidence

The final response can therefore be based on traceable evidence rather than opaque agent output.

---

# 17. LLM-Based Synthesis

Once results are validated and aggregated, the Coordinator can use an LLM to synthesize the final response.

The LLM receives structured context such as:

```text
Intent:
create_customer_briefing

Customer:
ABC Corporation

Validated Results:
- Customer profile
- Revenue
- Opportunities
- Interactions

Output requirement:
Executive customer briefing
```

The LLM's responsibility is:

```text
Understand validated results
        |
        v
Identify important information
        |
        v
Connect related facts
        |
        v
Generate coherent narrative
```

It should not be responsible for deciding whether the underlying data was authorized or whether an agent was allowed to execute.

---

# 18. Synthesis Prompt

Conceptually, the Coordinator may construct:

```text
You are generating the final response for the user's request.

User Intent:
Create a customer briefing.

Validated Data:
{aggregated_results}

Instructions:
- Use only the validated data.
- Do not invent missing information.
- Clearly indicate incomplete results.
- Preserve important source context.
- Follow the requested output format.
- Do not expose restricted information.
```

The LLM then generates:

```text
Customer Briefing — ABC Corporation

Customer Overview
ABC Corporation operates in ...

Revenue
Current revenue is $12.5M.

Pipeline
There are 4 open opportunities representing
$8.2M in pipeline.

Recent Engagement
There have been 7 recent interactions, with the
latest interaction occurring on August 28.

Key Takeaways
...
```

---

# 19. Final Response Validation

The LLM-generated response should still pass through governance.

The Coordinator can perform:

```text
LLM Response
     |
     v
Output Validation
     |
     +--> Policy Check
     |
     +--> DLP / Redaction
     |
     +--> Sensitive Data Check
     |
     +--> Completeness Check
     |
     v
Approved Response
```

This is important because an LLM can generate content that was not explicitly present in the structured results.

The system should ensure:

```text
Generated response
        ⊆
Authorized validated context
```

where appropriate.

---

# 20. Result Handling With Multiple Delegators

Consider a cross-domain request:

```text
"Give me an executive view of customer ABC's
sales pipeline and financial exposure."
```

The Coordinator may invoke:

```text
                 Coordinator
                     |
          +----------+----------+
          |                     |
          v                     v
    Sales Delegator       Finance Delegator
          |                     |
          v                     v
    Sales Workers          Finance Workers
          |                     |
          +----------+----------+
                     |
                     v
                Coordinator
                     |
                     v
               Aggregation
                     |
                     v
                 Synthesis
```

The Coordinator becomes the point where cross-domain results are combined.

---

# 21. Maintaining Result Context

Every result should remain associated with the original execution context.

For example:

```json
{
  "task_id": "task-103",
  "run_id": "run-001",
  "turn_id": "turn-001",
  "correlation_id": "corr-001",

  "source_agent": "finance-delegator",

  "result": {
    "revenue": 12500000
  }
}
```

This allows the Coordinator to distinguish:

```text
Customer ABC / Run 1
```

from:

```text
Customer XYZ / Run 2
```

even when both workflows are executing concurrently.

---

# 22. Observability During Result Processing

Every result-processing step should be observable.

Conceptually:

```text
Result Received
      |
      v
result_received
      |
      v
result_validated
      |
      v
result_normalized
      |
      v
result_aggregated
      |
      v
synthesis_started
      |
      v
synthesis_completed
      |
      v
response_validated
```

Useful metadata includes:

```text
correlation_id
task_id
run_id
agent_id
worker_id
status
latency
error
result_size
model
token usage
```

This allows the platform team to diagnose where an execution failed or became slow.

---

# 23. Error and Retry Handling

Suppose:

```text
Opportunity Worker
        |
        v
TIMEOUT
```

The Coordinator can update:

```text
task-102 = FAILED
```

Then apply the execution policy:

```text
Retry?
   |
   +--> Yes → Retry task
   |
   +--> No
          |
          v
      Alternate Agent?
          |
          +--> Yes → Re-route
          |
          +--> No → Partial Result / Failure
```

The important point is that a failure in one worker should not automatically destroy the entire workflow if the workflow can safely continue.

---

# 24. Coordinator's Result Aggregation Responsibilities

The Coordinator owns the enterprise-level result lifecycle:

```text
1. Receive results
2. Correlate results
3. Track task status
4. Validate structure
5. Validate execution status
6. Apply authorization/data policy
7. Normalize results
8. Detect missing results
9. Detect conflicts
10. Combine results
11. Determine whether workflow can continue
12. Provide validated context to LLM
13. Synthesize final response
14. Validate final response
15. Return response
16. Record execution telemetry
```

---

# 25. Delegator's Role in Result Aggregation

The Delegator also performs aggregation, but at a **domain level**.

For example:

```text
Sales Delegator
      |
      +--> Customer Worker
      +--> Opportunity Worker
      +--> Interaction Worker
      |
      v
Sales Domain Result
```

The Delegator may combine these into:

```json
{
  "customer": "ABC Corporation",
  "sales_summary": {
    "opportunities": [...],
    "interactions": [...]
  }
}
```

Then:

```text
Sales Delegator
        |
        v
Coordinator
```

The Coordinator can combine that Sales result with Finance or other domain results.

---

# 26. Two-Level Aggregation

This creates an important CWD pattern:

```text
                    Coordinator
                         |
          +--------------+--------------+
          |                             |
          v                             v
   Sales Delegator              Finance Delegator
          |                             |
     +----+----+                    +---+---+
     |    |    |                    |       |
     v    v    v                    v       v
    W1   W2   W3                   W4      W5
     |    |    |                    |       |
     +----+----+                    +---+---+
          |                             |
          v                             v
   Sales Aggregation             Finance Aggregation
          |                             |
          +--------------+--------------+
                         |
                         v
                  CWD Aggregation
                         |
                         v
                     Synthesis
```

Therefore:

```text
Worker Aggregation
        ↓
Delegator Aggregation
        ↓
Coordinator Aggregation
        ↓
Final Synthesis
```

---

# 27. Conceptual Python Model

A simplified Coordinator result model could be:

```python
from pydantic import BaseModel, Field
from typing import Any, Dict, List


class AgentResult(BaseModel):
    task_id: str
    run_id: str
    correlation_id: str
    source_agent: str
    status: str
    result: Dict[str, Any] = Field(default_factory=dict)
    error: str | None = None


class ResultAggregator:

    def __init__(self):
        self.results: Dict[str, AgentResult] = {}

    def collect(self, result: AgentResult):
        self.results[result.task_id] = result

    def validate(self, result: AgentResult) -> bool:

        if result.status != "completed":
            return False

        if not result.task_id:
            return False

        if not result.correlation_id:
            return False

        return True

    def get_valid_results(self) -> List[AgentResult]:

        return [
            result
            for result in self.results.values()
            if self.validate(result)
        ]

    def aggregate(self) -> Dict[str, Any]:

        aggregated = {}

        for result in self.get_valid_results():
            aggregated[result.task_id] = result.result

        return aggregated
```

This represents the basic pattern:

```text
Collect
   ↓
Validate
   ↓
Store
   ↓
Aggregate
```

A production implementation would additionally handle schema validation, authorization, retries, provenance, conflicts, persistence, event-driven responses and policy enforcement.

---

# 28. Conceptual Synthesis Method

After aggregation:

```python
def synthesize_response(aggregated_context, user_request):

    prompt = {
        "user_request": user_request,
        "validated_context": aggregated_context,
        "instructions": [
            "Use only validated information",
            "Do not invent missing values",
            "Clearly identify incomplete results",
            "Respect output policy"
        ]
    }

    return llm.generate(prompt)
```

The important architecture is:

```text
Raw Agent Results
       |
       v
Validation
       |
       v
Structured Aggregated Context
       |
       v
LLM
       |
       v
Final Response
```

---

# 29. What the Coordinator Must NOT Do

The Coordinator should not:

### Blindly trust agent responses

```text
Agent says SUCCESS
       ↓
Automatically send to user
```

### Concatenate responses

```text
Result A + Result B + Result C
```

This can produce inconsistent or confusing output.

### Allow the LLM to invent missing results

```text
Missing Revenue
      ↓
LLM guesses revenue
```

This is unacceptable for enterprise workflows.

### Ignore provenance

The Coordinator should know where important information originated.

### Bypass policy during synthesis

The final response must still respect enterprise data governance.

---

# 30. Complete End-to-End Example

User:

```text
"Give me an executive briefing for customer ABC,
including sales pipeline, revenue, and recent interactions."
```

### Step 1 — Coordinator creates tasks

```text
Task A → Sales Pipeline
Task B → Revenue
Task C → Recent Interactions
Task D → Executive Briefing
```

### Step 2 — Tasks execute

```text
Sales Delegator
      |
      v
Sales Worker
      |
      v
Pipeline Result

Finance Delegator
      |
      v
Finance Worker
      |
      v
Revenue Result

Customer Delegator
      |
      v
Interaction Worker
      |
      v
Interaction Result
```

### Step 3 — Coordinator collects

```text
Pipeline Result
Revenue Result
Interaction Result
```

### Step 4 — Coordinator validates

```text
Pipeline → Valid
Revenue → Valid
Interactions → Valid
```

### Step 5 — Coordinator aggregates

```json
{
  "customer": "ABC Corporation",
  "pipeline": {...},
  "revenue": {...},
  "interactions": {...}
}
```

### Step 6 — Coordinator synthesizes

```text
Aggregated Context
        |
        v
       LLM
        |
        v
Executive Briefing
```

### Step 7 — Final validation

```text
Executive Briefing
        |
        v
Policy / DLP / Output Validation
        |
        v
Approved
```

### Step 8 — Response

```text
User
  ↑
  |
Coordinator
```

---

# 31. Final CWD Result Processing Architecture

The complete pattern is:

```text
                         COORDINATOR
                              |
                    Execution Plan
                              |
              +---------------+---------------+
              |               |               |
              v               v               v
        Delegator A      Delegator B      Delegator C
              |               |               |
           Workers          Workers          Workers
              |               |               |
              v               v               v
          Results A        Results B        Results C
              |               |               |
              +---------------+---------------+
                              |
                              v
                     Result Collection
                              |
                              v
                       Correlation
                              |
                              v
                       Validation
                              |
                              v
                       Normalization
                              |
                              v
                    Completeness Check
                              |
                              v
                     Conflict Detection
                              |
                              v
                       Aggregation
                              |
                              v
                  Structured Context
                              |
                              v
                         LLM Synthesis
                              |
                              v
                    Output Governance
                              |
                              v
                     Final Response
                              |
                              v
                            USER
```

---

# 32. Responsibility Boundary

| Activity                      |     Worker |  Delegator | Coordinator |
| ----------------------------- | ---------: | ---------: | ----------: |
| Execute specific task         |        Yes |         No |          No |
| Return task result            |        Yes |        Yes |          No |
| Aggregate worker results      |         No |        Yes |          No |
| Aggregate domain results      |         No |        Yes |          No |
| Collect multi-domain results  |         No |         No |         Yes |
| Correlate results             |      Local |     Domain |  Enterprise |
| Validate task output          |        Yes |        Yes |         Yes |
| Detect missing results        |      Local |     Domain |  Enterprise |
| Detect cross-domain conflicts |         No |    Limited |         Yes |
| Build enterprise context      |         No |     Domain |         Yes |
| Final response synthesis      |         No |         No |         Yes |
| Final response governance     |         No |     Domain |         Yes |
| End-to-end observability      | Contribute | Contribute |  Coordinate |

---

# 33. Key Architectural Principle

The Coordinator follows this pattern:

```text
COLLECT
   ↓
CORRELATE
   ↓
VALIDATE
   ↓
NORMALIZE
   ↓
CHECK COMPLETENESS
   ↓
RESOLVE CONFLICTS
   ↓
AGGREGATE
   ↓
SYNTHESIZE
   ↓
GOVERN
   ↓
RESPOND
```

The most important distinction is:

```text
Worker
= Produces a task result

Delegator
= Combines results within its business domain

Coordinator
= Combines results across the enterprise workflow

LLM
= Synthesizes validated information into a human-readable response
```

## Final Definition

> **The Coordinator acts as the result-control and synthesis layer of CWD. It collects responses from multiple Delegators and Workers, correlates them using task/run/correlation context, validates their status and content, handles missing or conflicting results, combines validated outputs into a unified execution context, and uses the LLM to synthesize that context into a governed final response.**

In short:

```text
Coordinator Result Management
=
Collect
+ Correlate
+ Validate
+ Normalize
+ Aggregate
+ Resolve
+ Synthesize
+ Govern
+ Respond
```
