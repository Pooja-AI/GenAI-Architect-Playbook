# Cosmos DB in CWD: Durable Application and Execution State

Cosmos DB can serve as the durable operational data layer for distributed CWD services, storing session metadata, task records, workflow checkpoints, execution history, agent results, and other state that must survive process restarts, service scaling, asynchronous execution, and failures.

The key architectural principle is:

> Redis provides fast working state; Cosmos DB provides durable distributed application state; LangGraph controls workflow transitions; Service Bus transports messages; CWD coordinates execution.

## 1. Where Cosmos DB fits

```
                         ┌──────────────────────────┐
                         │       User / Client      │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │     CWD Coordinator      │
                         │  Enterprise orchestration│
                         └────────────┬─────────────┘
                                      │
                         ┌────────────▼─────────────┐
                         │       LangGraph          │
                         │ State + workflow control │
                         └────────────┬─────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
     ┌────────────────┐      ┌────────────────┐      ┌────────────────┐
     │   Delegators   │      │    Workers     │      │  Async Tasks   │
     └────────┬───────┘      └────────┬───────┘      └────────┬───────┘
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │       Cosmos DB          │
                         │ Durable application data │
                         │ and execution state      │
                         └────────────┬─────────────┘
                                      │
             ┌────────────────────────┼───────────────────────┐
             ▼                        ▼                       ▼
      Session metadata         Task/workflow data      Execution history
      Agent results            Checkpoints             Audit references
```

Cosmos DB is not the workflow engine itself. It stores the durable information that the workflow engine and distributed services need.

## 2. Why CWD needs durable application state

CWD services are independently deployed and may run across multiple instances. A request may:

* Continue for several minutes or hours.

* Wait for a human approval.

* Execute multiple Delegators and Workers in parallel.

* Be interrupted by a container restart.

* Be retried after a transient failure.

* Resume after an asynchronous message arrives.

* Require historical investigation or audit.

* Be processed by a different service instance after scaling.

If important state exists only in process memory or Redis, it may be lost, expired, or difficult to reconstruct.

Cosmos DB provides a durable source for information such as:

```
Who initiated the request?
What workflow is running?
Which tasks are pending?
Which Workers completed?
What results were returned?
Which node should execute next?
How many retries occurred?
What approval is waiting?
What happened during the execution?
```

## 3. Application data versus execution data

A useful separation is:

|
Data category

|

Purpose

|

Example

|
| --- | --- | --- |
|

Application data

|

Business and service information

|

Customer case, shipment reference, project context

|
|

Session metadata

|

Active interaction context

|

Session ID, user reference, tenant, current topic

|
|

Task data

|

Individual work items

|

Task status, assigned Worker, input, result

|
|

Workflow state

|

Current orchestration position

|

Current node, pending branches, checkpoint

|
|

Execution history

|

Historical execution record

|

Events, transitions, retries, timestamps

|
|

Agent results

|

Outputs returned by agents

|

Delegator summary, Worker result, artifacts

|
|

Approval state

|

Human decision lifecycle

|

Pending approval, approver, decision

|
|

Operational metadata

|

Runtime management

|

Version, duration, error code, correlation ID

|

These categories may be stored in separate containers or represented as different document types within a shared container.

## 4. Cosmos DB data model

Cosmos DB is a NoSQL document database. A CWD document can contain structured JSON with flexible fields.

### Example: session document

JSON

```
{
  "id": "session-1001",
  "documentType": "session",
  "tenantId": "tenant-a",
  "sessionId": "session-1001",
  "userId": "user-789",
  "conversationId": "conversation-456",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "activeTopic": "shipment investigation",
  "status": "active",
  "createdAt": "2026-09-06T15:00:00Z",
  "lastActivityAt": "2026-09-06T15:04:00Z",
  "expiresAt": "2026-09-06T17:00:00Z"
}
```

### Example: task document

JSON

```
{
  "id": "task-WT-1001",
  "documentType": "task",
  "tenantId": "tenant-a",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "parentTaskId": "DT-5001",
  "sourceAgent": "shipping-delegator",
  "targetWorker": "tracking-worker",
  "capability": "shipment_tracking",
  "status": "completed",
  "attempt": 1,
  "input": {
    "shipmentId": "SHIP123"
  },
  "resultReference": "result-WT-1001",
  "createdAt": "2026-09-06T15:00:10Z",
  "completedAt": "2026-09-06T15:00:11Z"
}
```

### Example: workflow state document

JSON

```
{
  "id": "workflow-WF-1001",
  "documentType": "workflow",
  "tenantId": "tenant-a",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "workflowType": "shipment-investigation",
  "status": "waiting_for_aggregation",
  "currentNode": "aggregate_results",
  "completedTasks": [
    "WT-1001",
    "WT-1002"
  ],
  "pendingTasks": [
    "WT-1003"
  ],
  "retryCounts": {
    "WT-1001": 0,
    "WT-1002": 1
  },
  "promptId": "shipment-delay-analysis",
  "promptVersion": "2.2.0",
  "lastCheckpointAt": "2026-09-06T15:03:00Z",
  "stateVersion": 7
}
```

## 5. Core CWD use cases

### 5.1 Session metadata

Cosmos DB can retain durable session information such as:

* Session and conversation identifiers.

* User and tenant references.

* Active workflow ID.

* Current business object.

* Session status.

* Creation and last-activity timestamps.

* Selected language or approved preferences.

* Session expiration and retention metadata.

A session document should contain references to sensitive or large content rather than unnecessarily storing the entire conversation.

```
Session metadata
      │
      ├── session_id
      ├── user_id
      ├── tenant_id
      ├── conversation_id
      ├── workflow_id
      ├── correlation_id
      ├── active topic
      └── expiration policy
```

Redis may cache active session context, while Cosmos DB preserves the durable session record.

### 5.2 Task information

Every delegated task should have a durable task record.

```
Task created
    ↓
Task persisted
    ↓
Message published
    ↓
Worker executes
    ↓
Task status updated
    ↓
Result persisted
    ↓
Parent workflow notified
```

Task data may include:

* Task ID and parent task ID.

* Correlation ID and workflow ID.

* Source and target agent.

* Required capability.

* Input and constraints.

* Status and attempt count.

* Assignment information.

* Start and completion timestamps.

* Error details.

* Result reference.

* Idempotency key.

This allows a Delegator to recover task status even if its process restarts.

### 5.3 Workflow state and checkpoints

LangGraph manages the workflow graph, but durable state must be stored somewhere that survives process failure.

A checkpoint may contain:

JSON

```
{
  "workflowId": "WF-1001",
  "currentNode": "retrieve_knowledge",
  "status": "running",
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "completedBranches": [
    "tracking_lookup",
    "carrier_status"
  ],
  "pendingBranches": [
    "historical_incidents"
  ],
  "taskResults": {
    "WT-1001": "result-WT-1001",
    "WT-1002": "result-WT-1002"
  },
  "retrievedChunkIds": [
    "doc-123-chunk-4",
    "doc-456-chunk-2"
  ],
  "promptVersion": "2.2.0",
  "retryCount": 1,
  "stateVersion": 12
}
```

The checkpoint enables:

* Resume after a service restart.

* Recovery after Worker failure.

* Continuation after human approval.

* Reconciliation of asynchronous tasks.

* Reproduction of execution decisions.

* Recovery of pending parallel branches.

### Important distinction

```
LangGraph
    → Defines and controls workflow transitions

Cosmos DB
    → Persists workflow state and execution data

Redis
    → Provides fast temporary working state

Service Bus
    → Delivers tasks and events

Policy/IAM
    → Determines whether actions are authorized
```

Cosmos DB does not automatically make a workflow durable. The application or LangGraph persistence integration must explicitly save and restore state.

### 5.4 Execution history

Execution history records what happened, not only the current state.

JSON

```
{
  "id": "event-00045",
  "documentType": "executionEvent",
  "tenantId": "tenant-a",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "agentId": "tracking-worker",
  "eventType": "TASK_COMPLETED",
  "fromStatus": "working",
  "toStatus": "completed",
  "node": "execute_tracking_lookup",
  "attempt": 1,
  "durationMs": 1240,
  "timestamp": "2026-09-06T15:10:00Z",
  "metadata": {
    "tool": "get_tracking_events",
    "resultReference": "result-WT-1001"
  }
}
```

Typical event types include:

```
WORKFLOW_CREATED
TASK_CREATED
AGENT_SELECTED
TASK_SUBMITTED
TASK_STARTED
TOOL_INVOKED
TASK_COMPLETED
TASK_FAILED
RETRY_SCHEDULED
CHECKPOINT_CREATED
APPROVAL_REQUESTED
APPROVAL_GRANTED
APPROVAL_REJECTED
WORKFLOW_RESUMED
WORKFLOW_COMPLETED
WORKFLOW_CANCELLED
```

Execution history supports debugging, audit, SLA analysis, incident investigation, and operational reporting.

### 5.5 Agent results

Agent results should be persisted separately from task metadata when they are large, independently reusable, or required for audit.

JSON

```
{
  "id": "result-WT-1001",
  "documentType": "agentResult",
  "tenantId": "tenant-a",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "agentId": "tracking-worker",
  "agentVersion": "2.4.1",
  "status": "completed",
  "result": {
    "shipmentId": "SHIP123",
    "latestStatus": "delayed",
    "rootCause": "carrier_capacity",
    "location": "Dallas"
  },
  "artifacts": [],
  "warnings": [],
  "createdAt": "2026-09-06T15:10:00Z"
}
```

For large outputs, store the actual artifact in Blob Storage and keep only a reference in Cosmos DB:

```
Agent Result
    ├── Small structured result → Cosmos DB
    ├── Large document/artifact → Blob Storage
    └── Searchable knowledge → Azure AI Search
```

## 6. Recommended container design

A possible logical design is:

|
Container

|

Main responsibility

|

Partition key example

|
| --- | --- | --- |
|

`sessions`

|

Session metadata and lifecycle

|

`/tenantId`

|
|

`workflows`

|

Current workflow state and checkpoints

|

`/tenantId`

|
|

`tasks`

|

Task records and status

|

`/tenantId`

|
|

`agent-results`

|

Structured agent outputs

|

`/tenantId`

|
|

`execution-events`

|

Append-oriented execution history

|

`/tenantId`

|
|

`approvals`

|

Human approval state

|

`/tenantId`

|
|

`application-data`

|

Durable business/application documents

|

Business-specific

|

The exact partition strategy depends on tenant size, access patterns, workload distribution, and cross-tenant isolation requirements.

### Partition key principle

> Choose a partition key that aligns with the dominant query pattern and distributes load evenly.

For a multi-tenant CWD platform, `tenantId` is often a useful starting point because it supports tenant isolation and common tenant-scoped queries. However, a very large tenant may require a more granular strategy, such as:

```
/tenantId
/tenantId + workflowId
/tenantId + sessionId
```

The choice must be validated against actual throughput and query patterns.

## 7. Cosmos DB consistency and concurrency

Distributed CWD services may update the same workflow or task concurrently.

For example:

```
Delegator instance A → updates task to completed
Delegator instance B → retries the same task
Worker instance C    → submits a late result
```

Without concurrency control, one update may overwrite another.

### Optimistic concurrency

Cosmos DB supports optimistic concurrency through document versioning and ETags.

Conceptual flow:

```
Read document with ETag v7
        ↓
Calculate updated state
        ↓
Write only if ETag is still v7
        ↓
If conflict:
    reread latest state
    reconcile
    retry or reject update
```

Example:

Python

Run

```
from azure.cosmos import CosmosClient
from azure.cosmos.exceptions import CosmosHttpResponseError

def update_workflow(container, workflow_id, workflow, etag):
    try:
        return container.replace_item(
            item=workflow_id,
            body=workflow,
            etag=etag,
            match_condition="IfNotModified"
        )
    except CosmosHttpResponseError as exc:
        if exc.status_code == 412:
            raise RuntimeError("Workflow state changed concurrently")
        raise
```

The exact SDK behavior and enum usage should be aligned with the installed Azure Cosmos DB SDK version.

### Why this matters in CWD

Concurrency control protects:

* Task status transitions.

* Retry counters.

* Parallel branch aggregation.

* Approval decisions.

* Workflow checkpoints.

* Agent assignment changes.

* Cancellation and completion races.

## 8. Idempotency and duplicate messages

Azure Service Bus may redeliver a message. A Worker may receive the same task more than once.

CWD should persist an idempotency key:

JSON

```
{
  "id": "task-WT-1001",
  "idempotencyKey": "CORR-7890:WT-1001:attempt-1",
  "status": "completed",
  "resultReference": "result-WT-1001"
}
```

Before executing:

```
Does task already have a completed result?
    ├── Yes → return existing result
    └── No  → execute and persist result
```

This prevents duplicate side effects such as:

* Creating the same ticket twice.

* Sending duplicate notifications.

* Submitting the same reroute request twice.

* Repeating a financial or operational write.

Idempotency is an application responsibility. Cosmos DB stores the durable record, but the Worker and business adapter must enforce the behavior.

## 9. Cosmos DB and asynchronous CWD execution

For long-running tasks, Cosmos DB and Service Bus work together.

```
Coordinator
    │
    ├── Persist workflow = submitted
    │
    └── Publish A2A task to Service Bus
                │
                ▼
          Delegator
                │
                ├── Persist task = accepted
                ├── Execute Workers
                ├── Persist progress
                └── Persist result
                        │
                        ▼
                 Publish completion
                        │
                        ▼
                  Coordinator
                        │
                        ├── Read durable state
                        ├── Aggregate results
                        └── Resume workflow
```

### Responsibility separation

|
Component

|

Responsibility

|
| --- | --- |
|

Service Bus

|

Message delivery, buffering, redelivery, DLQ

|
|

Cosmos DB

|

Durable task/workflow/application state

|
|

LangGraph

|

Workflow transitions, retries, recovery paths

|
|

Redis

|

Fast temporary state and cache

|
|

Agent Registry

|

Agent metadata and availability

|
|

Policy/IAM

|

Authorization and entitlements

|
|

App Insights/OpenTelemetry

|

Detailed telemetry

|
|

Blob Storage

|

Large artifacts and documents

|

## 10. Cosmos DB versus Redis

|
Concern

|

Redis

|

Cosmos DB

|
| --- | --- | --- |
|

Primary role

|

Fast working-data layer

|

Durable application-data layer

|
|

Latency

|

Very low

|

Low, but generally higher than in-memory access

|
|

Session cache

|

Excellent

|

Durable session record

|
|

Temporary state

|

Excellent

|

Durable state

|
|

Workflow recovery

|

Not sufficient alone

|

Suitable durable checkpoint store

|
|

Long-term records

|

Not ideal as sole store

|

Suitable

|
|

Execution history

|

Limited unless carefully designed

|

Suitable

|
|

TTL

|

Commonly used

|

Supported

|
|

Distributed locks

|

Useful coordination primitive

|

Not a direct replacement for a lock service

|
|

Large documents

|

Not ideal

|

Store references; use Blob Storage for large content

|
|

Semantic search

|

Not its primary role

|

Not its primary role

|
|

Business system of record

|

Usually no

|

Possible, depending on data model and requirements

|

A common pattern is:

```
Request
   ↓
Redis: fast active context
   ↓
Cosmos DB: durable session/workflow/task state
   ↓
Service Bus: asynchronous delivery
   ↓
LangGraph: workflow control
```

## 11. Cosmos DB versus other CWD stores

|
Store

|

Best suited for

|
| --- | --- |
|

Cosmos DB

|

Durable JSON application and execution state

|
|

Redis

|

Low-latency cache, session working state, locks, counters

|
|

Azure SQL/PostgreSQL

|

Relational transactions, joins, strong relational constraints

|
|

Azure AI Search

|

Keyword, vector, hybrid retrieval and ranking

|
|

Blob Storage

|

Large files, artifacts, raw documents

|
|

Service Bus

|

Reliable asynchronous messaging

|
|

Application Insights

|

Logs, metrics, traces, operational telemetry

|
|

Vector database

|

Semantic memory and embedding-based retrieval

|

Cosmos DB is particularly attractive when CWD needs flexible JSON documents, globally distributed service access, scalable throughput, and operational data that does not require complex relational joins.

## 12. Security and governance

Cosmos DB should not be treated as a security boundary by itself.

### Required controls

* Authenticate services using Entra ID or managed identities.

* Use role-based access control for database and container operations.

* Enforce tenant isolation.

* Apply least-privilege access to containers.

* Encrypt data in transit and at rest.

* Use private networking where required.

* Avoid secrets in documents.

* Avoid putting unnecessary sensitive data into workflow state.

* Apply retention and TTL policies.

* Restrict who can read execution history.

* Redact sensitive tool outputs before persistence.

* Audit access to restricted data.

* Preserve classification and ownership metadata.

* Prevent untrusted prompt or tool content from becoming executable instructions.

### Important rule

> Persisting data does not authorize access to it.

A Worker must still be authorized to read a session, task, result, or workflow document.

## 13. Data lifecycle

Durable state should have an explicit lifecycle.

```
CREATE
  ↓
ACTIVE
  ↓
UPDATED
  ↓
COMPLETED
  ↓
RETENTION PERIOD
  ↓
ARCHIVE / DELETE
```

Different data types need different retention policies:

|
Data

|

Typical lifecycle

|
| --- | --- |
|

Active session

|

Short-lived, TTL-based

|
|

Temporary task state

|

Until completion plus recovery window

|
|

Workflow checkpoint

|

Until workflow completion and retention requirement

|
|

Agent result

|

Until downstream consumers and audit needs are satisfied

|
|

Execution history

|

Longer retention for audit and operational analysis

|
|

Approval record

|

Retained according to governance requirements

|
|

Business data

|

Governed by business and compliance retention policy

|

Do not automatically apply the same TTL to all containers.

## 14. Example durable state service

The following is a simplified application-level pattern using the Azure Cosmos DB Python SDK.

Python

Run

```
from datetime import datetime, timezone
from typing import Any, Optional

from azure.cosmos import CosmosClient
from azure.cosmos.container import ContainerProxy


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class CosmosStateStore:
    def __init__(
        self,
        endpoint: str,
        credential: str,
        database_name: str,
        container_name: str,
    ):
        self.client = CosmosClient(endpoint, credential)
        self.database = self.client.get_database_client(database_name)
        self.container: ContainerProxy = (
            self.database.get_container_client(container_name)
        )

    def save(self, document: dict[str, Any]) -> dict[str, Any]:
        document["updatedAt"] = utc_now()
        return self.container.upsert_item(document)

    def get(self, document_id: str, partition_key: str) -> Optional[dict[str, Any]]:
        try:
            return self.container.read_item(
                item=document_id,
                partition_key=partition_key,
            )
        except Exception:
            return None

    def delete(self, document_id: str, partition_key: str) -> None:
        self.container.delete_item(
            item=document_id,
            partition_key=partition_key,
        )
```

### Workflow persistence wrapper

Python

Run

```
class WorkflowRepository:
    def __init__(self, store: CosmosStateStore):
        self.store = store

    def create_workflow(
        self,
        workflow_id: str,
        tenant_id: str,
        correlation_id: str,
        workflow_type: str,
    ) -> dict:
        workflow = {
            "id": workflow_id,
            "documentType": "workflow",
            "tenantId": tenant_id,
            "workflowId": workflow_id,
            "correlationId": correlation_id,
            "workflowType": workflow_type,
            "status": "submitted",
            "currentNode": "start",
            "completedTasks": [],
            "pendingTasks": [],
            "stateVersion": 1,
            "createdAt": utc_now(),
            "updatedAt": utc_now(),
        }

        return self.store.save(workflow)

    def checkpoint(
        self,
        workflow: dict,
        current_node: str,
        status: str,
    ) -> dict:
        workflow["currentNode"] = current_node
        workflow["status"] = status
        workflow["stateVersion"] += 1
        return self.store.save(workflow)
```

### Task repository

Python

Run

```
class TaskRepository:
    def __init__(self, store: CosmosStateStore):
        self.store = store

    def create_task(
        self,
        task_id: str,
        tenant_id: str,
        workflow_id: str,
        correlation_id: str,
        capability: str,
        input_data: dict,
    ) -> dict:
        task = {
            "id": task_id,
            "documentType": "task",
            "tenantId": tenant_id,
            "taskId": task_id,
            "workflowId": workflow_id,
            "correlationId": correlation_id,
            "capability": capability,
            "input": input_data,
            "status": "submitted",
            "attempt": 0,
            "createdAt": utc_now(),
            "updatedAt": utc_now(),
        }

        return self.store.save(task)

    def complete_task(
        self,
        task: dict,
        result_reference: str,
    ) -> dict:
        task["status"] = "completed"
        task["resultReference"] = result_reference
        task["completedAt"] = utc_now()
        return self.store.save(task)
```

This is a conceptual repository pattern. Production implementations should add typed schemas, explicit exception handling, authorization checks, ETag concurrency, retry policy, telemetry, and tenant-aware partition handling.

## 15. End-to-end execution example

Consider a user asking:

> “Investigate why shipment SHIP123 is delayed and recommend the next action.”

### Step 1: Coordinator creates the workflow

```
workflow_id = WF-1001
correlation_id = CORR-7890
```

The Coordinator persists the workflow as `submitted`.

### Step 2: LangGraph starts execution

The workflow state is checkpointed:

```
currentNode = classify_intent
status = running
```

### Step 3: Delegator creates domain tasks

```
WT-1001 → Tracking lookup
WT-1002 → Carrier status
WT-1003 → Historical incident retrieval
```

Each task is persisted in Cosmos DB before or as part of controlled dispatch.

### Step 4: Service Bus delivers tasks

Workers receive the tasks asynchronously.

### Step 5: Workers persist results

Each Worker stores:

* Execution status.

* Validated business result.

* Tool references.

* Duration.

* Error or warning.

* Correlation and task identifiers.

### Step 6: Delegator aggregates

The Delegator reads the task results, validates them, and persists a domain-level result.

### Step 7: Coordinator resumes

The Coordinator loads the workflow checkpoint, sees that all required branches completed, and advances to response generation.

### Step 8: Final response and history

The final response is returned, while execution history remains available for:

* Audit.

* Troubleshooting.

* Performance analysis.

* Reproduction.

* Operational reporting.

## 16. Failure and recovery behavior

|
Failure

|

Cosmos DB role

|

Recovery action

|
| --- | --- | --- |
|

Coordinator restart

|

Preserves workflow checkpoint

|

Resume from last valid node

|
|

Delegator restart

|

Preserves task and domain state

|

Reconcile pending tasks

|
|

Worker timeout

|

Preserves attempt and task status

|

Retry or select another Worker

|
|

Duplicate Service Bus message

|

Stores idempotency/result record

|

Avoid duplicate execution

|
|

Human approval delay

|

Preserves approval state

|

Resume after decision

|
|

Late Worker result

|

Preserves task identity and status

|

Accept, reject, or reconcile based on state

|
|

Partial branch failure

|

Preserves completed and pending branches

|

Retry failed branch or return partial result

|
|

Concurrent update

|

ETag/version detects conflict

|

Reload and reconcile

|
|

Service outage

|

Durable state remains available subject to service availability

|

Resume when dependencies recover

|

### Important distinction

Cosmos DB persistence supports recovery, but recovery logic still belongs to CWD, LangGraph, Delegators, and Workers.

## 17. Anti-patterns

### 1. Store everything in one document

A single giant workflow document becomes difficult to update, query, partition, and manage concurrently.

### 2. Use Cosmos DB as a message broker

Cosmos DB stores state; Service Bus is designed for message delivery.

### 3. Use Redis as the only durable store

Redis is excellent for working state, but critical recovery data should have a durable persistence strategy.

### 4. Persist raw unrestricted tool output

Tool outputs may contain sensitive data, large payloads, or untrusted instructions. Validate, minimize, classify, and store references where possible.

### 5. Ignore partition-key design

Poor partitioning can create hot partitions, inefficient queries, and unpredictable performance.

### 6. Overwrite workflow state without concurrency control

Parallel branches and retries can lose updates without versioning or ETag checks.

### 7. Treat stored state as authorization

A document existing in Cosmos DB does not mean every agent or user can read it.

### 8. Store secrets in execution documents

Use managed identity, Key Vault, and secure configuration instead.

### 9. Keep all execution history forever

Retention, archival, deletion, and classification policies must be explicit.

## 18. Architect-level separation of responsibilities

```
CWD Coordinator
    → Owns enterprise workflow and overall request state

Delegator
    → Owns domain task state and aggregation

Worker
    → Owns specialized execution state and validated results

LangGraph
    → Controls nodes, transitions, retries, checkpoints, and recovery

Cosmos DB
    → Persists durable application and execution documents

Redis
    → Provides fast temporary state and caching

Service Bus
    → Transports asynchronous tasks and events

Agent Registry
    → Stores agent identity, capabilities, health, and endpoints

Prompt Registry
    → Stores governed prompt versions and metadata

Policy / IAM
    → Enforces authorization and entitlements

Azure AI Search
    → Retrieves enterprise knowledge

Blob Storage
    → Stores large artifacts and raw files
```

## 19. Core formulas

### Durable execution state

Durable CWD State=Session Metadata+Task Data+Workflow Checkpoints+Agent Results+Execution History+Approval State+Correlation+Versioning+Retention\text{Durable CWD State} = \text{Session Metadata} + \text{Task Data} + \text{Workflow Checkpoints} + \text{Agent Results} + \text{Execution History} + \text{Approval State} + \text{Correlation} + \text{Versioning} + \text{Retention}Durable CWD State=Session Metadata+Task Data+Workflow Checkpoints+Agent Results+Execution History+Approval State+Correlation+Versioning+Retention

### Reliable distributed execution

Reliable CWD Execution=Durable State+Async Messaging+Idempotency+Concurrency Control+Checkpointing+Retry/Recovery+Observability+Authorization\text{Reliable CWD Execution} = \text{Durable State} + \text{Async Messaging} + \text{Idempotency} + \text{Concurrency Control} + \text{Checkpointing} + \text{Retry/Recovery} + \text{Observability} + \text{Authorization}Reliable CWD Execution=Durable State+Async Messaging+Idempotency+Concurrency Control+Checkpointing+Retry/Recovery+Observability+Authorization

### State-store mental model

```
Redis      = Fast working state
Cosmos DB  = Durable application and execution state
Service Bus= Reliable task delivery
LangGraph  = Workflow control
RAG        = Enterprise knowledge
Policy/IAM = Authorization
CWD        = Enterprise orchestration
```

## Interview-ready answer

> In our CWD architecture, Cosmos DB acts as the durable application and execution data layer for distributed Coordinator, Delegator, and Worker services. We use it to persist session metadata, workflow records, task information, checkpoints, agent results, approval state, and execution history. LangGraph controls workflow transitions and recovery, while Cosmos DB ensures that the state required for continuation survives service restarts, asynchronous execution, scaling, and failures. Service Bus handles task delivery, Redis provides low-latency temporary state and caching, and Blob Storage holds large artifacts. We use correlation IDs, tenant-aware partitioning, optimistic concurrency, idempotency, access control, retention, and audit metadata so that distributed CWD execution remains durable, traceable, secure, and recoverable.

## Final definition

Cosmos DB in CWD is the durable, scalable, and tenant-aware application-data layer that stores session metadata, task records, workflow checkpoints, execution history, agent results, approval state, and other operational documents required to coordinate distributed services across failures and asynchronous execution. It complements LangGraph for workflow control, Service Bus for reliable messaging, Redis for fast temporary state, and Policy/IAM for authorization, enabling CWD to maintain persistent, traceable, recoverable, and governed execution state throughout the enterprise agent lifecycle.


### One-line mental model

Cosmos DB remembers what the distributed CWD system must retain; LangGraph decides what happens next.
