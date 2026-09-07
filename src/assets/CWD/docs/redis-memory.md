# Redis in CWD

Redis is a high-speed, in-memory data platform that can serve as the low-latency working-data layer for CWD. It is especially useful for information that must be accessed or updated frequently during an active conversation or workflow, such as session context, temporary execution state, caches, locks, and short-lived agent data.

The key principle is:

> Use Redis for fast, bounded, short-lived operational state—not as the authoritative system of record for every type of enterprise data.

## 1. Why Redis Fits CWD

CWD frequently needs to read and update small pieces of state between Coordinator, Delegator, and Worker executions.

```
User Request
     ↓
Coordinator
     ↓
Redis
     ├── Session context
     ├── Workflow state
     ├── Task status
     ├── Cached retrieval results
     ├── Distributed locks
     └── Temporary agent state
     ↓
Delegator / Worker
```

Redis is useful because it provides:

* Low-latency reads and writes

* Key-based access

* Expiration through TTL

* Atomic operations

* Counters and rate limiting

* Distributed coordination primitives

* Pub/Sub and Streams

* Optional persistence

* Horizontal scaling through clustering

The exact latency depends on deployment, network distance, payload size, contention, and configuration. Redis should be treated as a low-latency component, not as a guarantee of a specific response time.

## 2. Redis Versus Other CWD Storage

|
Storage

|

Best suited for

|
| --- | --- |
|

Redis

|

Fast session data, cache, temporary state, locks, coordination

|
|

PostgreSQL / Cosmos DB

|

Durable business records and persistent memory

|
|

Azure AI Search

|

Enterprise document retrieval and vector search

|
|

Object Storage

|

Large files, artifacts, documents, transcripts

|
|

LangGraph checkpoint store

|

Durable workflow execution state

|
|

Service Bus

|

Durable asynchronous task and event delivery

|
|

Key Vault

|

Secrets and credentials

|

A common architecture uses Redis alongside these systems rather than replacing them.

## 3. Redis Data Model for CWD

Redis stores values under keys. The key should encode the ownership and scope of the data.

```
session:{tenant_id}:{session_id}
workflow:{workflow_id}
task:{task_id}
conversation:{conversation_id}
cache:rag:{query_hash}
lock:workflow:{workflow_id}
agent:{agent_id}:state
```

Example:

```
session:tenant-001:SES-1001
workflow:WF-2001
task:WT-3001
cache:rag:abc123
lock:workflow:WF-2001
```

### Recommended key design

* Include tenant or security scope where required.

* Use stable identifiers rather than sensitive information.

* Keep key names predictable.

* Set TTLs for temporary data.

* Avoid placing passwords, tokens, or personal data directly in keys.

* Use namespaces to prevent collisions.

## 4. Redis for Session Information

A session represents the active interaction between a user and the platform.

### Session data may include

* Session ID

* User and tenant reference

* Conversation ID

* Current topic

* Active workflow ID

* Language or approved preferences

* Last activity time

* Session expiration

* Correlation ID

Example:

JSON

```
{
  "session_id": "SES-1001",
  "user_id": "USER-123",
  "tenant_id": "TENANT-001",
  "conversation_id": "CONV-9001",
  "active_workflow_id": "WF-2001",
  "active_topic": "CWD RAG architecture",
  "last_activity": "2026-09-06T16:00:00Z"
}
```

### Session lifecycle

```
Session Created
      ↓
Store Session Context
      ↓
Read on Each Request
      ↓
Update Activity / Context
      ↓
Refresh TTL
      ↓
Session Ends or Expires
      ↓
Delete or Retain Approved Summary
```

Redis is particularly useful when many API or agent instances need to access the same active session.

### Important distinction

A Redis session record is not automatically a permanent memory record. When the session expires, only explicitly approved information should be promoted to persistent memory.

## 5. Redis for Conversation Context

Conversation context includes information needed to maintain continuity during the active interaction.

Examples:

* Recent messages

* Current question

* Resolved references

* Active entities

* Conversation summary

* Pending clarification

* Relevant tool outputs

* Selected RAG chunk references

A conversation history can be stored as a Redis List, Stream, or serialized bounded object.

```
conversation:CONV-9001:messages
conversation:CONV-9001:summary
conversation:CONV-9001:entities
```

### Example context

JSON

```
{
  "conversation_id": "CONV-9001",
  "summary": "The user is designing the CWD RAG architecture.",
  "active_entities": ["CWD", "Redis", "Azure AI Search"],
  "pending_question": "How Redis supports short-lived agent state",
  "recent_message_ids": ["MSG-10", "MSG-11", "MSG-12"]
}
```

### Why bounded context matters

The system should not send the entire conversation to every agent. Instead:

```
Full Conversation
       ↓
Summarize / Select Relevant Messages
       ↓
Apply Authorization and Scope
       ↓
Bounded Context
       ↓
Coordinator / Delegator / Worker
```

This reduces token usage, latency, and accidental exposure of unrelated information.

## 6. Redis for Temporary Execution State

Execution state describes what is happening in the current workflow.

Example:

JSON

```
{
  "workflow_id": "WF-2001",
  "current_node": "retrieve_context",
  "status": "working",
  "completed_tasks": ["WT-3001"],
  "pending_tasks": ["WT-3002"],
  "retry_count": 1,
  "selected_agent": "knowledge-agent",
  "last_error": null
}
```

Redis can store this state for rapid access by:

* Coordinator instances

* Delegator instances

* Worker instances

* Status APIs

* Monitoring components

### Example workflow key

```
workflow:WF-2001
```

### State update pattern

```
Read Current State
       ↓
Validate Version
       ↓
Apply State Transition
       ↓
Write Updated State
       ↓
Set / Refresh TTL
       ↓
Publish Status Event
```

### Important limitation

Redis alone should not be assumed to provide durable workflow recovery. If a workflow must survive Redis loss, process failure, or long human approval, use a durable checkpoint store or persistent database. Redis can act as a fast working copy or acceleration layer.

## 7. Redis for Task State and Coordination

CWD may have many concurrent tasks:

```
Coordinator
   ├── Delegator A
   │     ├── Worker A1
   │     └── Worker A2
   └── Delegator B
         ├── Worker B1
         └── Worker B2
```

Redis can maintain:

* Task status

* Worker assignment

* Attempt count

* Lease expiration

* Progress percentage

* Dependency counters

* Result references

* Cancellation flags

* Heartbeats

Example:

JSON

```
{
  "task_id": "WT-3001",
  "parent_task_id": "DT-2001",
  "correlation_id": "CORR-7890",
  "status": "working",
  "assigned_worker": "tracking-worker",
  "attempt": 1,
  "heartbeat_at": "2026-09-06T16:02:00Z",
  "result_reference": "artifact://results/WT-3001"
}
```

Redis is useful for fast coordination metadata. Durable task delivery should still be handled by a messaging system such as Azure Service Bus when required.

## 8. Redis for Caching

Caching avoids repeating expensive operations.

### Suitable CWD cache targets

* RAG query results

* Embeddings for repeated queries

* Agent Registry lookups

* Prompt Registry metadata

* Policy decisions with carefully controlled TTLs

* External API responses

* Model configuration

* Frequently used reference data

* Session summaries

Example:

```
cache:rag:{query_hash}:{filter_hash}:{index_version}
```

The cache key should include all factors that affect the result.

For example, an entitlement-aware RAG result must not be cached only by query text:

```
Bad:
cache:rag:what-is-the-shipping-policy

Better:
cache:rag:{query_hash}:{tenant_id}:{entitlement_scope}:{index_version}
```

Otherwise, one user's authorized result could be incorrectly reused for another user.

### Cache-aside pattern

```
Request
   ↓
Check Redis Cache
   ├── Hit → Return Valid Cached Result
   │
   └── Miss
         ↓
      Query Source
         ↓
      Validate Result
         ↓
      Store in Redis with TTL
         ↓
      Return Result
```

### Cache invalidation

A cache should be invalidated when:

* The source data changes

* A prompt version changes

* An embedding model changes

* An index version changes

* User entitlements change

* A policy decision expires

* The cached result becomes stale

> A cache is an optimization, not the source of truth.

## 9. Redis for Distributed Locks

CWD may need to ensure that only one process performs a particular operation at a time.

Examples:

* Updating one workflow

* Refreshing a shared cache

* Running a scheduled ingestion job

* Publishing a prompt version

* Performing a singleton recovery action

* Avoiding duplicate processing of the same task

Example lock key:

```
lock:workflow:WF-2001
```

### Conceptual lock flow

```
Process A ── Try Acquire Lock ──► Redis
                                      │
                                      ▼
                              Lock Granted
                                      │
                                      ▼
                              Execute Operation
                                      │
                                      ▼
                              Release Lock
```

If Process B tries to acquire the same lock while Process A owns it:

```
Process B ── Try Acquire Lock ──► Redis
                                      │
                                      ▼
                                  Lock Busy
                                      │
                                      ▼
                              Wait / Retry / Exit
```

### Lock requirements

A safe distributed lock should include:

* Unique lock value or owner token

* Expiration/lease

* Atomic acquisition

* Ownership verification before release

* Bounded wait time

* Recovery when the owner crashes

* Observability

* Idempotent protected operation

A simple Redis `SET`-based lock is useful for many coordination cases, but lock correctness depends on the failure model. For critical distributed correctness, evaluate the locking design carefully rather than assuming Redis automatically provides consensus.

## 10. Redis for Short-Lived Agent State

Workers often need temporary working data while executing a task.

Examples:

* Current tool selection

* Intermediate calculations

* Retrieved chunk IDs

* Temporary API response references

* Validation results

* Retry counters

* Pending approval status

* Agent heartbeat

* Partial execution results

Example:

JSON

```
{
  "task_id": "WT-3001",
  "worker_id": "tracking-worker",
  "state": "awaiting_tool_result",
  "selected_tool": "get_tracking_events",
  "retrieved_context_ids": ["CH-10", "CH-11"],
  "attempt": 1,
  "expires_at": "2026-09-06T16:10:00Z"
}
```

### Worker state lifecycle

```
Worker Receives Task
       ↓
Create Temporary State
       ↓
Execute Tool / Business Logic
       ↓
Update Intermediate State
       ↓
Validate Result
       ↓
Return Result to Delegator
       ↓
Delete or Expire Temporary State
```

Short-lived state should be associated with:

* `correlation_id`

* `workflow_id`

* `task_id`

* `worker_id`

* `attempt`

This makes concurrent execution traceable and prevents one task from reading another task's state.

## 11. Redis Data Structures Useful in CWD

|
Redis structure

|

CWD use case

|
| --- | --- |
|

String

|

Serialized session, state, cache value

|
|

Hash

|

Session fields, task metadata, agent status

|
|

List

|

Bounded recent messages, simple queues

|
|

Set

|

Unique task IDs, membership, active workers

|
|

Sorted Set

|

Priority queues, deadlines, scheduled tasks

|
|

Stream

|

Ordered event history and consumer groups

|
|

Pub/Sub

|

Ephemeral notifications and live updates

|
|

Bitmap / HyperLogLog

|

Specialized counters and approximate metrics

|

### Example

```
Hash:
workflow:WF-2001

Fields:
status = working
current_node = retrieve_context
retry_count = 1
owner = coordinator-01

Sorted Set:
tasks:priority

Score:
deadline or priority value

Member:
WT-3001

Stream:
workflow-events

Events:
task_submitted
worker_started
tool_completed
task_completed
```

### Pub/Sub versus Streams

|
Pub/Sub

|

Streams

|
| --- | --- |
|

Ephemeral notifications

|

Retained event entries

|
|

Subscribers must be online

|

Consumers can process later

|
|

Good for live UI updates

|

Better for task/event processing

|
|

No built-in durable replay

|

Supports consumer groups and acknowledgments

|

Redis Streams can support lightweight coordination, but they should not automatically replace a durable enterprise message broker for all CWD workloads.

## 12. Redis and Azure Service Bus

Redis and Service Bus solve different problems.

```
                  ┌─────────────────────┐
                  │      CWD            │
                  └──────────┬──────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
       ┌──────────────┐              ┌──────────────┐
       │ Redis        │              │ Service Bus  │
       │ Fast working │              │ Durable      │
       │ state/cache  │              │ messaging    │
       └──────────────┘              └──────────────┘
```

|
Redis

|

Azure Service Bus

|
| --- | --- |
|

Fast state access

|

Durable message delivery

|
|

Cache

|

Queue/topic

|
|

Locks and counters

|

Task transmission

|
|

Session working data

|

Async agent communication

|
|

Temporary coordination

|

Redelivery and DLQ

|
|

TTL-based expiration

|

Message retention and settlement

|

Example:

```
Coordinator
   ├── Writes workflow state → Redis
   └── Sends task → Service Bus
                         ↓
                     Delegator
                         ↓
                 Reads state → Redis
                         ↓
                     Executes
                         ↓
                 Publishes result
                         ↓
                 Updates state → Redis
```

### Important distinction

> Service Bus carries the task; Redis provides fast access to the task's working state.

## 13. Redis and LangGraph

LangGraph manages workflow transitions, while Redis can provide fast access to selected state.

```
LangGraph
   ├── Current node
   ├── Conditional routing
   ├── Retry / recovery
   ├── Checkpoint references
   └── Workflow state
          │
          ▼
        Redis
   ├── Fast working copy
   ├── Session context
   ├── Temporary results
   └── Coordination metadata
```

A practical pattern is:

1. LangGraph loads the current state.

2. Redis supplies low-latency session or temporary context.

3. The graph executes a node.

4. The node updates Redis if needed.

5. Durable checkpointing persists recovery-critical state.

6. LangGraph selects the next node.

Redis should not replace LangGraph's workflow semantics or durable checkpoint strategy.

## 14. Redis and Persistent Memory

Persistent memory is intended to survive sessions. Redis is often used for active memory retrieval and caching, while durable memory belongs in a persistent store.

```
Persistent Memory Store
          │
          ▼
Memory Service
          │
          ▼
Redis Cache
          │
          ▼
Coordinator / Worker
```

### Example flow

```
New Conversation
      ↓
Check Redis for Cached Memory
      ├── Hit → Validate and Use
      │
      └── Miss
            ↓
       Query Persistent Memory Store
            ↓
       Apply Authorization and Scope
            ↓
       Cache Approved Result in Redis
            ↓
       Use in Current Workflow
```

Redis may contain:

* Recently used memory

* Session-specific memory projection

* Cached project context

* Temporary memory retrieval results

It should not be the only copy of important persistent memory unless the durability and recovery requirements explicitly support that design.

## 15. Security and Governance

Redis can contain sensitive information even when the data is temporary.

### Required controls

* Authentication and authorization

* Tenant isolation

* Encryption in transit and at rest

* Private networking where appropriate

* Network access restrictions

* Least-privilege application identities

* TTL and retention policies

* Sensitive-data minimization

* Audit and monitoring

* Backup and recovery controls

* Keyspace and command restrictions where appropriate

### Data handling rules

* Do not store secrets in session state.

* Do not place sensitive information in Redis keys.

* Do not cache entitlement-aware results without including the correct security scope.

* Do not expose raw Redis state directly to the LLM.

* Do not assume TTL alone satisfies compliance deletion requirements.

* Do not allow one tenant to read another tenant's keys.

* Do not treat cached policy decisions as permanently valid.

### Security boundary

```
User Identity
      ↓
IAM / Policy
      ↓
CWD Authorization
      ↓
Redis Access Control
      ↓
Scoped Data Retrieval
      ↓
Validated Agent Context
```

Redis is a storage and coordination layer. It does not independently determine whether a user is authorized to access enterprise information.

## 16. Example Redis Implementation

The following Python example uses `redis-py` and demonstrates session storage, temporary workflow state, caching, and a lease-based lock.

Python

Run

```
import json
import time
import uuid
from typing import Any, Optional

import redis


class CWDRedisStore:
    def __init__(self, redis_url: str):
        self.client = redis.Redis.from_url(
            redis_url,
            decode_responses=True,
        )

    def set_json(
        self,
        key: str,
        value: dict[str, Any],
        ttl_seconds: int,
    ) -> None:
        self.client.set(
            key,
            json.dumps(value),
            ex=ttl_seconds,
        )

    def get_json(self, key: str) -> Optional[dict[str, Any]]:
        value = self.client.get(key)

        if value is None:
            return None

        return json.loads(value)

    def delete(self, key: str) -> None:
        self.client.delete(key)

    def save_session(
        self,
        tenant_id: str,
        session_id: str,
        session_data: dict[str, Any],
        ttl_seconds: int = 1800,
    ) -> None:
        key = f"session:{tenant_id}:{session_id}"
        self.set_json(key, session_data, ttl_seconds)

    def get_session(
        self,
        tenant_id: str,
        session_id: str,
    ) -> Optional[dict[str, Any]]:
        key = f"session:{tenant_id}:{session_id}"
        return self.get_json(key)

    def save_workflow_state(
        self,
        workflow_id: str,
        state: dict[str, Any],
        ttl_seconds: int = 3600,
    ) -> None:
        key = f"workflow:{workflow_id}"
        self.set_json(key, state, ttl_seconds)

    def get_workflow_state(
        self,
        workflow_id: str,
    ) -> Optional[dict[str, Any]]:
        return self.get_json(f"workflow:{workflow_id}")

    def cache_result(
        self,
        cache_key: str,
        result: dict[str, Any],
        ttl_seconds: int = 300,
    ) -> None:
        self.set_json(
            f"cache:{cache_key}",
            result,
            ttl_seconds,
        )

    def get_cached_result(
        self,
        cache_key: str,
    ) -> Optional[dict[str, Any]]:
        return self.get_json(f"cache:{cache_key}")

    def acquire_lock(
        self,
        resource: str,
        ttl_seconds: int = 30,
    ) -> Optional[str]:
        lock_key = f"lock:{resource}"
        owner_token = str(uuid.uuid4())

        acquired = self.client.set(
            lock_key,
            owner_token,
            nx=True,
            ex=ttl_seconds,
        )

        return owner_token if acquired else None

    def release_lock(
        self,
        resource: str,
        owner_token: str,
    ) -> bool:
        lock_key = f"lock:{resource}"

        # Compare ownership and delete atomically.
        release_script = """
        if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
        else
            return 0
        end
        """

        result = self.client.eval(
            release_script,
            1,
            lock_key,
            owner_token,
        )

        return result == 1
```

### Usage

Python

Run

```
store = CWDRedisStore(
    redis_url="redis://localhost:6379/0"
)

store.save_session(
    tenant_id="TENANT-001",
    session_id="SES-1001",
    session_data={
        "conversation_id": "CONV-9001",
        "active_topic": "CWD architecture",
        "workflow_id": "WF-2001",
    },
)

state = store.get_session(
    tenant_id="TENANT-001",
    session_id="SES-1001",
)

store.save_workflow_state(
    workflow_id="WF-2001",
    state={
        "status": "working",
        "current_node": "retrieve_context",
        "retry_count": 0,
    },
)

store.cache_result(
    cache_key="rag:query123:scope456:v7",
    result={
        "chunk_ids": ["CH-10", "CH-11"],
        "search_mode": "hybrid",
    },
    ttl_seconds=300,
)

lock_token = store.acquire_lock(
    resource="workflow:WF-2001",
    ttl_seconds=30,
)

if lock_token:
    try:
        # Perform a short, idempotent protected operation.
        print("Lock acquired")
    finally:
        store.release_lock(
            resource="workflow:WF-2001",
            owner_token=lock_token,
        )
```

### Production improvements

The example is intentionally simplified. Production code should add:

* Connection pooling and health checks

* TLS configuration

* Authentication

* Tenant-aware key construction

* Structured logging

* Metrics and tracing

* Serialization limits

* Schema validation

* Optimistic concurrency or atomic state transitions

* Lock renewal for operations longer than the lease

* Durable checkpointing

* Error handling and retry policy

* Redis Cluster or managed Redis configuration

* Backup and disaster recovery strategy

## 17. Optimistic Concurrency for Workflow State

Multiple agents may update the same workflow. A simple read-modify-write can lose updates.

### Unsafe pattern

```
Coordinator reads state version 1
Delegator reads state version 1

Coordinator writes version 2
Delegator writes version 2

Coordinator's update may be overwritten.
```

### Safer pattern

```
Read state + version
       ↓
Apply update
       ↓
Write only if version is unchanged
       ↓
Increment version
       ↓
Retry or reconcile on conflict
```

Example state:

JSON

```
{
  "workflow_id": "WF-2001",
  "version": 7,
  "status": "working",
  "pending_tasks": ["WT-3002"]
}
```

For critical workflows, use atomic Redis transactions, Lua scripts, or a durable state store with explicit concurrency controls.

## 18. Redis Failure and Recovery

Redis should be designed as a dependency that can fail.

### Possible failures

* Redis unavailable

* Network timeout

* Connection exhaustion

* Eviction of required data

* Expired session

* Stale cache

* Lock owner crash

* Split-brain or failover behavior

* Serialization or schema mismatch

### Recommended recovery behavior

|
Data type

|

Recovery strategy

|
| --- | --- |
|

Cache

|

Recompute from source

|
|

Session context

|

Recreate or request clarification

|
|

Temporary Worker state

|

Retry or reconstruct from task state

|
|

Workflow state

|

Resume from durable checkpoint

|
|

Lock

|

Wait, expire, or recover safely

|
|

Task coordination

|

Reconcile with Service Bus and durable state

|
|

Persistent memory

|

Read from durable memory store

|

### Key principle

> Redis failure should degrade performance or temporary continuity—not silently corrupt the authoritative business state.

## 19. Redis Usage Guidelines

### Use Redis when

* Data is accessed frequently.

* Data is small or bounded.

* Low latency matters.

* Data has a clear TTL.

* Multiple instances need shared working state.

* Atomic counters or locks are required.

* Cached results can be recomputed.

* Temporary coordination is needed.

### Avoid using Redis as the only store when

* Data is the authoritative business record.

* Long-term retention is required.

* Complex relational queries are required.

* Large documents or files must be stored.

* Regulatory evidence must be retained durably.

* Workflow recovery depends on state surviving Redis loss.

* The data requires strong transactional guarantees beyond the selected Redis design.

## 20. End-to-End CWD Example

### Scenario

A user asks:

> “Continue analyzing the shipment delay from our previous conversation.”

```
1. Gateway authenticates the user.
       ↓
2. Coordinator creates correlation_id and workflow_id.
       ↓
3. Coordinator reads session context from Redis.
       ↓
4. Memory Service retrieves approved persistent memory.
       ↓
5. Coordinator loads workflow state from Redis or durable checkpoint.
       ↓
6. Delegator receives scoped shipment context.
       ↓
7. Worker checks Redis for cached retrieval results.
       ↓
8. Cache miss → Worker queries Azure AI Search.
       ↓
9. Worker stores short-lived retrieval results in Redis.
       ↓
10. Worker executes approved MCP tool.
       ↓
11. Worker updates temporary task state in Redis.
       ↓
12. Delegator aggregates the result.
       ↓
13. Coordinator updates workflow state.
       ↓
14. Final response is returned.
       ↓
15. Temporary state expires; approved memory may be persisted separately.
```

### What Redis contributes

* Fast session lookup

* Shared workflow working state

* Cached retrieval

* Temporary Worker context

* Task progress

* Locking and concurrency control

* Reduced repeated computation

### What Redis does not contribute by itself

* Enterprise authorization

* Agent discovery

* Prompt governance

* Durable business truth

* LLM reasoning

* RAG ranking

* A2A protocol

* MCP protocol

* Complete workflow orchestration

## 21. Core Architectural Formula

CWD Redis Layer=Session Storage+Temporary State+Caching+Conversation Context+Distributed Coordination+Short-Lived Agent State+TTL+Atomicity+Low-Latency Access\boxed{ CWD\ Redis\ Layer = Session\ Storage + Temporary\ State + Caching + Conversation\ Context + Distributed\ Coordination + Short\text{-}Lived\ Agent\ State + TTL + Atomicity + Low\text{-}Latency\ Access }CWD Redis Layer=Session Storage+Temporary State+Caching+Conversation Context+Distributed Coordination+Short-Lived Agent State+TTL+Atomicity+Low-Latency Access

For safe usage:

Redis Working Data=Fast Access+Bounded Lifetime+Scoped Authorization+Recoverability+Observability\boxed{ Redis\ Working\ Data = Fast\ Access + Bounded\ Lifetime + Scoped\ Authorization + Recoverability + Observability }Redis Working Data=Fast Access+Bounded Lifetime+Scoped Authorization+Recoverability+Observability

## Interview-Ready Answer

> In CWD, Redis serves as the low-latency working-data layer for session information, conversational context, temporary workflow state, task coordination, caching, distributed locks, and short-lived Worker state. The Coordinator can store active session and workflow metadata in Redis, while Delegators and Workers use it to share task progress, intermediate results, and coordination information across independently deployed instances. Redis TTLs prevent temporary data from remaining indefinitely, and atomic operations or locks help control concurrent updates. Redis can cache RAG results, Agent Registry metadata, and other expensive lookups, but cache keys must include tenant, entitlement, and version information where required. Durable workflow checkpoints, persistent memory, enterprise records, and asynchronous task delivery should remain in appropriate durable systems such as a checkpoint store, database, Azure AI Search, and Service Bus. Redis therefore accelerates CWD execution without becoming the authoritative source of enterprise truth.

## Final Definition

Redis in CWD is a low-latency, shared working-data layer used to store and retrieve session context, temporary execution state, cached results, conversation summaries, distributed coordination metadata, locks, and short-lived agent state. Through key-based access, TTLs, atomic operations, and coordination primitives, Redis improves responsiveness and scalability across Coordinator, Delegator, and Worker instances while relying on durable systems for authoritative business data, persistent memory, reliable messaging, and long-term workflow recovery.

### Mental model

```
Redis = Fast Working Memory
Database = Durable Business Memory
RAG = Enterprise Knowledge
Service Bus = Durable Task Delivery
LangGraph = Workflow Control
Policy / IAM = Authorization
CWD = Enterprise Orchestration
```

Redis answers: “What temporary information must be available quickly to keep the current agent workflow running?”
