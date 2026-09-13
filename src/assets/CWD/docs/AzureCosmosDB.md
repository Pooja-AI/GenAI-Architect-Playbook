# Azure Cosmos DB

For your **CWD Agentic AI architecture**, Azure Cosmos DB is primarily the **persistent NoSQL state and metadata layer**.

> **Cosmos DB remembers the state of the application and agents across requests, sessions, and workflows.**

It is different from Azure AI Search:

* **Cosmos DB → stores application/agent state**
* **Azure AI Search → retrieves enterprise knowledge**
* **Blob Storage → stores files/documents**

---

# 1. Where Cosmos DB fits in CWD

```text id="cosmos1"
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
┌─────────────────────────────┐
│        CWD State Layer      │
│                             │
│ Azure Cosmos DB             │
│ ├── Session State           │
│ ├── Task State              │
│ ├── Run State               │
│ ├── Agent Metadata          │
│ ├── Workflow State          │
│ └── Execution Metadata      │
└─────────────────────────────┘
```

The key idea is:

> **Agents should not depend only on in-memory state. Important workflow state should be persisted.**

---

# 2. Why do we need persistent state?

Suppose a user starts:

> "Analyze equipment EQ-102 failure."

The Coordinator creates:

```text id="cosmos2"
session_id = S1001
task_id    = T2001
run_id     = R3001
```

Then:

```text id="cosmos3"
Coordinator
   ↓
Quality Delegator
   ↓
RCA Worker
   ↓
Historical RAG Worker
```

If the Coordinator container restarts, the application should still know:

```text id="cosmos4"
Task T2001
Status = IN_PROGRESS

Completed:
✓ Equipment history
✓ Historical failures

Pending:
□ RCA correlation
□ Final response
```

Cosmos DB provides that persistence.

---

# 3. Conversation State

Conversation state represents the user's ongoing interaction.

Example:

```json id="cosmos5"
{
  "sessionId": "S1001",
  "userId": "U123",
  "conversationId": "C5001",
  "lastIntent": "failure_analysis",
  "currentEquipment": "EQ-102",
  "lastQuestion": "Why did it fail?",
  "createdAt": "2026-09-12T18:00:00Z"
}
```

Next user message:

> "Has this happened before?"

The system can understand that **"this" refers to the EQ-102 failure**.

---

# 4. Task State

Conversation state and task state are different.

### Conversation

> What has the user been discussing?

### Task

> What is the current workflow doing?

Example:

```json id="cosmos6"
{
  "taskId": "T2001",
  "sessionId": "S1001",
  "intent": "equipment_failure_analysis",
  "status": "IN_PROGRESS",
  "delegator": "QualityFailureAnalysis",
  "currentStep": "historical_search",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Possible statuses:

```text id="cosmos7"
PENDING
PLANNING
IN_PROGRESS
WAITING
COMPLETED
FAILED
CANCELLED
```

---

# 5. Run State

One task can have multiple executions.

```text id="cosmos8"
Task T2001
   │
   ├── Run R3001 → Failed
   │
   └── Run R3002 → Successful
```

This is useful for:

* retries
* debugging
* replay
* auditing
* troubleshooting

You can store:

```text id="cosmos9"
session_id
task_id
run_id
agent_id
delegator_id
worker_id
status
start_time
end_time
error
correlation_id
```

This matches the CWD execution hierarchy you have been using:

```text id="cosmos10"
Session
  └── Task
       └── Run
            └── Turn
                 └── Step
```

---

# 6. Agent Metadata

Cosmos DB can also store information about agents.

For example:

```json id="cosmos11"
{
  "agentId": "RCA-Worker",
  "name": "Root Cause Analysis Worker",
  "domain": "Quality",
  "capabilities": [
    "failure_analysis",
    "root_cause_analysis"
  ],
  "status": "ACTIVE",
  "version": "2.1",
  "endpoint": "internal-service",
  "supportedTools": [
    "historical-rag",
    "equipment-api"
  ]
}
```

The Coordinator or Delegator can use this information when selecting capabilities.

For a larger platform, you may also use a dedicated **Agent Registry** pattern rather than putting every registry concern into Cosmos DB.

---

# 7. CWD Agent State Example

Suppose:

> "Analyze EQ-102 failure and compare it with historical failures."

The Coordinator stores:

```text id="cosmos12"
Task T100
Status = IN_PROGRESS
```

Delegator stores:

```text id="cosmos13"
Quality Delegator
Status = IN_PROGRESS
```

Workers update:

```text id="cosmos14"
Equipment Worker
Status = COMPLETED

Historical RAG Worker
Status = COMPLETED

RCA Worker
Status = IN_PROGRESS
```

Finally:

```text id="cosmos15"
RCA Worker
Status = COMPLETED

Task T100
Status = COMPLETED
```

The state survives application restarts.

---

# 8. Cosmos DB + LangGraph

This is particularly relevant to your CWD architecture.

LangGraph manages the **workflow graph and execution state**, while Cosmos DB can provide **durable application persistence**.

Conceptually:

```text id="cosmos16"
            LangGraph
               ↓
        Workflow Execution
               ↓
       ┌───────┴────────┐
       ↓                ↓
 Coordinator        Delegator
       ↓                ↓
     Worker           Worker
       ↓
       └──────→ Cosmos DB
                  ↓
             Persistent State
```

Think:

> **LangGraph = how the workflow executes**

> **Cosmos DB = where application state can persist**

The exact persistence implementation depends on the framework and deployment design.

---

# 9. Session Persistence

Imagine:

### Day 1

User:

> "Analyze EQ-102."

System creates:

```text id="cosmos17"
Session S1001
Equipment = EQ-102
```

### Later

User:

> "Compare it with last month's failure."

The application retrieves session context:

```text id="cosmos18"
S1001
 ↓
EQ-102
 ↓
Previous failure analysis
```

The agent doesn't need the user to repeat everything.

---

# 10. Distributed Application Pattern

This is one of the biggest reasons Cosmos DB is useful.

Your CWD services may be distributed:

```text id="cosmos19"
                 Coordinator
                      ↓
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Delegator A   Delegator B   Delegator C
        ↓             ↓             ↓
     Workers       Workers       Workers
        │             │             │
        └─────────────┼─────────────┘
                      ↓
                 Cosmos DB
```

Each service can access shared persistent state.

This avoids depending on local memory.

---

# 11. Why NoSQL?

Agent state is often semi-structured.

One task might contain:

```text id="cosmos20"
equipmentId
failureType
workerResults
toolCalls
retrievedDocuments
errors
timestamps
```

Another task might contain:

```text id="cosmos21"
productId
customerId
salesData
recommendations
approvalState
```

The structures aren't necessarily identical.

A NoSQL document model is therefore useful.

Example:

```json id="cosmos22"
{
  "id": "T1001",
  "type": "agentTask",
  "domain": "quality",
  "status": "completed",
  "workerResults": [
    {
      "worker": "ImageAnalysisWorker",
      "status": "completed"
    },
    {
      "worker": "HistoricalRAGWorker",
      "status": "completed"
    }
  ]
}
```

---

# 12. Partition Key

This is an important Cosmos DB interview topic.

Cosmos DB distributes data using a **partition key**.

For CWD, you might consider:

```text id="cosmos23"
Partition Key = /tenantId
```

or potentially:

```text id="cosmos24"
Partition Key = /userId
```

depending on the access pattern.

For example:

```text id="cosmos25"
Tenant A
 ├── Session 1
 ├── Session 2
 └── Session 3

Tenant B
 ├── Session 4
 └── Session 5
```

A good partition-key strategy helps distribute workload and avoid hot partitions.

### Interview principle

> **Choose the partition key based on access patterns, cardinality, and expected workload distribution—not simply because the field is convenient.**

---

# 13. Scalability

Cosmos DB is designed for distributed, scalable workloads.

For an Agentic AI platform:

```text id="cosmos26"
Users ↑
   ↓
Requests ↑
   ↓
Agent Tasks ↑
   ↓
State Operations ↑
   ↓
Cosmos DB
   ↓
Distributed Scaling
```

This is useful when CWD has:

* many concurrent users
* many agent executions
* many workers
* high-frequency state updates
* geographically distributed users/applications

---

# 14. Global Distribution

For globally distributed enterprise applications, Cosmos DB supports distributing data across Azure regions.

Conceptually:

```text id="cosmos27"
              CWD
               ↓
       ┌───────┴────────┐
       ↓                ↓
   US Region        Europe Region
       ↓                ↓
    Cosmos DB        Cosmos DB
```

This can help with:

* regional latency
* availability
* business continuity
* disaster recovery

The exact consistency and multi-region write strategy should be chosen based on business requirements.

---

# 15. Consistency

Cosmos DB provides different consistency models.

Conceptually, you can choose stronger consistency when correctness is more important, or weaker/eventual consistency when scalability and latency are more important.

For example:

### Agent execution status

You may need reasonably current state.

```text
IN_PROGRESS
     ↓
COMPLETED
```

### Analytics/eventual reporting

Slightly stale data may be acceptable.

The architect chooses the consistency model based on the data's business requirements.

---

# 16. Cosmos DB + Redis

These two are often confused.

### Redis

Best suited for:

* very fast cache
* short-lived state
* session cache
* frequently accessed context

### Cosmos DB

Best suited for:

* durable application state
* task state
* workflow metadata
* persistent conversation records
* agent metadata

A strong architecture can use both:

```text id="cosmos28"
Agent
  ↓
Redis
  ↓
Fast temporary context

      +

Cosmos DB
  ↓
Durable persistent state
```

Simple mental model:

> **Redis = fast memory**

> **Cosmos DB = durable application memory**

---

# 17. Cosmos DB vs Azure AI Search

Another important interview distinction:

| Cosmos DB         | Azure AI Search                |
| ----------------- | ------------------------------ |
| Application state | Enterprise knowledge retrieval |
| Task state        | Document/chunk retrieval       |
| Session data      | Vector search                  |
| Agent metadata    | Keyword search                 |
| Workflow metadata | Hybrid search                  |
| JSON documents    | Search index                   |
| CRUD/query        | Retrieval/ranking              |

Example:

```text id="cosmos29"
"Where is task T100?"
       ↓
Cosmos DB

"Find historical EQ-102 failures."
       ↓
Azure AI Search
```

---

# 18. Cosmos DB vs Blob Storage

```text id="cosmos30"
Failure-analysis.pdf
      ↓
Blob Storage
```

But:

```text id="cosmos31"
{
  "taskId": "T100",
  "status": "completed"
}
      ↓
Cosmos DB
```

So:

> **Blob = files**

> **Cosmos = application state**

---

# 19. Security Architecture

For CWD:

```text id="cosmos32"
CWD Service
     ↓
Managed Identity
     ↓
Microsoft Entra ID
     ↓
Azure RBAC
     ↓
Cosmos DB
```

Additional enterprise controls:

* private endpoints
* network isolation
* encryption
* least-privilege access
* auditing
* monitoring
* tenant isolation
* data retention policies

Don't put Cosmos DB keys directly into source code.

---

# 20. Complete CWD Data Architecture

Now combine the services you've been learning:

```text id="cosmos33"
                    CWD
                     │
        ┌────────────┼────────────┐
        ↓            ↓            ↓
    Blob Storage  Cosmos DB   Azure AI Search
        │            │            │
     Documents    Agent State   RAG Knowledge
     Images       Task State    Vector Search
     Artifacts    Sessions      Hybrid Search
        │          Metadata     Semantic Rank
        │            │            │
        └────────────┼────────────┘
                     ↓
                 Agent/LLM
```

Each service has a distinct responsibility.

---

# 21. End-to-End CWD Example

User asks:

> **"Analyze EQ-102 failure and tell me whether we had a similar failure before."**

### Step 1 — Session

Cosmos DB:

```text id="cosmos34"
Session S1001
```

### Step 2 — Task

```text id="cosmos35"
Task T2001
Status = IN_PROGRESS
```

### Step 3 — Coordinator

Routes to:

```text id="cosmos36"
Quality/Failure Analysis Delegator
```

### Step 4 — Workers

Delegator invokes:

```text id="cosmos37"
Image Analysis Worker
Historical RAG Worker
RCA Worker
```

### Step 5 — RAG

Historical RAG Worker:

```text id="cosmos38"
Azure AI Search
      ↓
Historical Failure Reports
```

### Step 6 — State Updates

Workers update Cosmos DB:

```text id="cosmos39"
ImageAnalysis = COMPLETED
HistoricalSearch = COMPLETED
RCA = COMPLETED
```

### Step 7 — Final response

Coordinator retrieves the completed state and produces:

```text id="cosmos40"
Task = COMPLETED

Result:
Similar failure found in 2025.
Probable root cause: thermal excursion.
```

The original reports remain in Blob Storage, retrieved content comes from Azure AI Search, and execution/session state lives in Cosmos DB.

---

# 22. Strong Solution Architect Interview Answer

> **"In my CWD architecture, I would use Azure Cosmos DB as the persistent NoSQL state layer for conversations, sessions, tasks, workflow execution state and agent metadata. The Coordinator can create a session and task record, and Delegators and Workers can update their execution status as the workflow progresses. I would maintain identifiers such as session ID, task ID, run ID, turn ID, step ID and correlation ID to provide end-to-end traceability. Cosmos DB is especially useful because CWD is a distributed agent platform where services can restart, scale horizontally or execute asynchronously, so critical state should not live only in process memory. I would design the partition key around the application's access pattern and workload distribution, and use Managed Identity, RBAC and private networking for security. I would use Redis separately when I need extremely low-latency caching, while Cosmos DB would remain the durable application-state store."**

---

# Final mental model

```text id="cosmos41"
Blob Storage
     ↓
"Where are my files?"

Azure AI Search
     ↓
"Where is the knowledge I need?"

Redis
     ↓
"What context do I need very quickly?"

Cosmos DB
     ↓
"What is the persistent state of my application?"

LLM / Agents
     ↓
"What should I reason about?"
```

### Most important interview distinction

> **Blob Storage stores documents, Azure AI Search retrieves knowledge, Redis provides fast temporary context, and Cosmos DB persists application/agent state.**
