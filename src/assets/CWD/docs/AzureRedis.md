# Azure Cache for Redis

For your **CWD Agentic AI architecture**, Azure Cache for Redis is primarily the **high-speed short-term memory and caching layer**.

> **Redis gives agents very fast access to frequently used or temporary context without repeatedly querying slower persistent systems.**

The key distinction:

* **Redis → fast, short-lived memory/cache**
* **Cosmos DB → durable application/agent state**
* **Azure AI Search → enterprise knowledge retrieval**
* **Blob Storage → documents/files**

---

# 1. Where Redis fits in CWD

```text id="redis1"
                     CWD
                      ↓
                Coordinator
                      ↓
                Delegators
                      ↓
                  Workers
                      ↓
             ┌────────┴────────┐
             ↓                 ↓
         Redis             Cosmos DB
       Fast State         Durable State
             ↓                 ↓
       Short-term           Persistent
       Context              State
```

Redis is optimized for **very low-latency reads/writes**.

---

# 2. Why do agents need Redis?

Imagine a user has a 20-turn conversation.

```text id="redis2"
User:
"Analyze EQ-102."

Assistant:
"EQ-102 had a thermal excursion."

User:
"Compare it with last month."

User:
"What corrective action was taken?"
```

The agent needs recent context:

```text id="redis3"
Equipment = EQ-102
Issue = thermal excursion
Time period = last month
Intent = failure analysis
```

Instead of retrieving all this information from a database every time, Redis can keep the frequently accessed context.

---

# 3. Redis as Short-Term Agent Memory

For CWD:

```text id="redis4"
User
 ↓
Coordinator
 ↓
Redis
 ↓
Recent Conversation Context
 ↓
Agent
```

Example:

```json id="redis5"
{
  "sessionId": "S1001",
  "recentIntent": "failure_analysis",
  "equipmentId": "EQ-102",
  "failureType": "thermal_excursion",
  "lastStep": "historical_search"
}
```

The next agent call can quickly retrieve this information.

---

# 4. Session State

Redis can maintain active session state.

Example:

```text id="redis6"
session:S1001
```

containing:

```text
user context
current conversation
current task
current equipment
recent tool results
temporary preferences
workflow status
```

This is particularly useful for **active sessions**.

---

# 5. Conversation Context

Consider:

> User: "Analyze EQ-102."

Then:

> "What happened last month?"

The second question depends on previous context.

Redis can store:

```text id="redis7"
Conversation
   ↓
Recent turns
   ↓
Relevant context
```

The agent retrieves only the necessary recent context rather than sending the entire conversation to the LLM.

This can also reduce:

* token usage
* latency
* unnecessary context
* model cost

---

# 6. Redis Cache

Redis isn't only memory.

It is also a **cache**.

Suppose 1,000 users ask:

> "What is the operating temperature of Product X?"

Instead of repeatedly performing expensive retrieval:

```text id="redis8"
User
 ↓
Coordinator
 ↓
Redis Cache
 ↓
Cache Hit
 ↓
Return Result
```

If the answer isn't cached:

```text id="redis9"
User
 ↓
Redis
 ↓
Cache Miss
 ↓
Azure AI Search
 ↓
LLM
 ↓
Response
 ↓
Redis
```

The next request can potentially use the cached result.

---

# 7. Cache Hit vs Cache Miss

### Cache Hit

```text id="redis10"
Request
 ↓
Redis
 ↓
Found
 ↓
Return
```

Very fast.

### Cache Miss

```text id="redis11"
Request
 ↓
Redis
 ↓
Not Found
 ↓
Search / API / LLM
 ↓
Store result in Redis
 ↓
Return
```

---

# 8. What should you cache?

Good candidates:

### Conversation context

```text id="redis12"
recent conversation
```

### Frequently retrieved information

```text id="redis13"
popular product specification
```

### Expensive API results

```text id="redis14"
equipment metadata
```

### Agent configuration

```text id="redis15"
agent capabilities
prompt configuration
routing information
```

### Temporary workflow state

```text id="redis16"
task status
worker status
temporary intermediate results
```

But don't put every piece of enterprise data into Redis.

---

# 9. TTL — Time To Live

Redis data can automatically expire.

Example:

```text id="redis17"
session:S1001
TTL = 30 minutes
```

After the TTL:

```text
Redis
 ↓
Data automatically expires
```

This is useful for temporary information.

Examples:

```text id="redis18"
OTP-like temporary state
Session context
Temporary tool results
Short-lived cache
Conversation context
```

For CWD, the TTL should be determined by business requirements.

---

# 10. Redis + Cosmos DB

This is one of the most important comparisons for your interview.

You can use both.

```text id="redis19"
                 Agent
                   ↓
           ┌───────┴────────┐
           ↓                ↓
        Redis           Cosmos DB
           ↓                ↓
     Fast temporary      Durable
        context            state
```

Example:

### Redis

```text
session:S1001
recent_messages
current_equipment
recent_search_results
```

### Cosmos DB

```text
session S1001
task T2001
run R3001
execution history
agent metadata
audit information
```

---

# 11. What happens when Redis loses data?

This is why Redis should not automatically be treated as your system of record.

Example:

```text id="redis20"
Redis
 ↓
Temporary Context
```

If that context expires or is unavailable:

```text id="redis21"
Redis unavailable
      ↓
Retrieve durable state
      ↓
Cosmos DB
```

The application can rebuild the active context from durable state.

So:

> **Redis improves performance; Cosmos DB provides durable persistence.**

---

# 12. Distributed State

Suppose CWD has multiple Coordinator instances.

```text id="redis22"
                Load Balancer
                     ↓
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      Coordinator Coordinator Coordinator
          1          2          3
          └──────────┼──────────┘
                     ↓
                   Redis
```

User request 1 goes to Coordinator 1.

Request 2 goes to Coordinator 3.

Because shared session context is in Redis, Coordinator 3 can still access:

```text id="redis23"
session:S1001
```

This is the benefit of **distributed state**.

---

# 13. Why not local memory?

Bad architecture:

```text id="redis24"
Coordinator 1
   ↓
Local Memory
   ↓
Session Context
```

If request 2 goes to another replica:

```text id="redis25"
Coordinator 2
   ↓
No Context
```

With Redis:

```text id="redis26"
Coordinator 1 ──┐
                ├──→ Redis
Coordinator 2 ──┤
                └──→ Shared Context
```

All replicas can access the same short-term state.

---

# 14. Redis in an Agent Workflow

Suppose:

> "Analyze EQ-102 and compare it with the last three failures."

The Coordinator stores:

```text id="redis27"
session:S1001
equipment = EQ-102
intent = failure_analysis
```

Delegator creates:

```text id="redis28"
task:T2001
status = IN_PROGRESS
```

Worker performs retrieval.

Temporary results:

```text id="redis29"
retrieval:T2001
 ├── FA-2026-104
 ├── FA-2025-872
 └── RCA-2025-641
```

RCA Worker reads those results quickly.

Final result can then be persisted to Cosmos DB.

---

# 15. Redis + Agentic RAG

Redis can sit between the agent and retrieval layer.

```text id="redis30"
User
 ↓
Coordinator
 ↓
RAG Agent
 ↓
Redis
 ↓
Cache Hit?
 ├── Yes → Return cached context
 │
 └── No
       ↓
 Azure AI Search
       ↓
 Retrieved Context
       ↓
 Redis Cache
       ↓
 LLM
```

This can reduce repeated retrieval for frequently repeated queries.

---

# 16. Redis + Azure AI Search

These services have very different jobs.

```text id="redis31"
Redis
 ↓
"Give me something I already accessed recently."

Azure AI Search
 ↓
"Find relevant enterprise knowledge."
```

Example:

### First request

```text id="redis32"
Question
 ↓
Azure AI Search
 ↓
Retrieve documents
 ↓
Redis Cache
```

### Same/similar request shortly afterward

```text id="redis33"
Question
 ↓
Redis
 ↓
Cached result
```

---

# 17. Redis + Service Bus

Redis and Service Bus solve different problems.

### Redis

Fast state/cache:

```text id="redis34"
Agent → Redis → Get context
```

### Service Bus

Reliable asynchronous messaging:

```text id="redis35"
Coordinator
    ↓
Service Bus
    ↓
Worker
```

Combined:

```text id="redis36"
Coordinator
   ↓
Service Bus
   ↓
Worker
   ↓
Redis
   ↓
Temporary Context
```

---

# 18. Redis + LangGraph

In your CWD architecture:

```text id="redis37"
LangGraph
   ↓
Workflow State
   ↓
Redis
   ↓
Fast State Access
```

For example:

```text id="redis38"
State:
{
  current_node: "RCAWorker",
  equipment: "EQ-102",
  retrieved_cases: [...],
  completed_workers: [...],
  next_action: "generate_report"
}
```

The exact persistence mechanism depends on how you implement LangGraph checkpoints and your application architecture.

The conceptual distinction is:

> **LangGraph controls workflow transitions; Redis can provide fast shared state/checkpoint storage.**

For durable long-term records, Cosmos DB or another persistent store may still be appropriate.

---

# 19. Distributed Locking

Redis can also help coordinate distributed workers in some architectures.

Example:

```text id="redis39"
Worker A ──┐
           ↓
        Redis Lock
           ↑
Worker B ──┘
```

This can help prevent two workers from simultaneously processing the same logically exclusive operation.

However, locking must be designed carefully; don't use Redis as a substitute for proper transactional/idempotent processing.

For CWD, **idempotency keys** and Service Bus processing semantics remain important for operations such as creating ServiceNow tickets.

---

# 20. Security

For enterprise CWD:

```text id="redis40"
CWD Service
     ↓
Managed Identity / Authentication
     ↓
Azure Redis
```

Use appropriate:

* authentication
* TLS
* network isolation
* private connectivity
* access controls
* encryption
* monitoring
* expiration policies

Avoid storing highly sensitive data unnecessarily.

A good design principle:

> **Cache only what you need, for only as long as you need it.**

---

# 21. Production Considerations

For a production Agentic AI platform, monitor:

```text id="redis41"
Cache Hit Rate
Cache Miss Rate
Latency
Memory Usage
Connections
Evictions
CPU
Throughput
Errors
```

### Important metric

**Cache hit rate**

```text
Cache Hits
────────────── × 100
Total Requests
```

Higher isn't automatically better—the cache must still contain useful, fresh data.

---

# 22. Cache Invalidation

One of the hardest caching problems is stale data.

Suppose:

```text id="redis42"
Product X temperature = 150°C
```

is cached.

Then the source system changes it to:

```text
175°C
```

If Redis still returns 150°C, the agent gets stale information.

Solutions include:

* short TTL
* explicit invalidation
* event-driven invalidation
* versioned cache keys
* source-of-truth validation for critical data

For **critical operational data**, don't blindly trust cached values.

---

# 23. Strong CWD Architecture

```text id="redis43"
                    CWD
                     ↓
                Coordinator
                     ↓
                Delegator
                     ↓
                  Worker
                     ↓
          ┌──────────┼──────────┐
          ↓          ↓          ↓
       Redis     AI Search   Cosmos DB
          ↓          ↓          ↓
      Fast       Enterprise   Durable
      Context     Knowledge     State
          │
          ↓
       LLM / Agent
```

Each layer has a specific responsibility.

---

# 24. Strong Solution Architect Interview Answer

> **"In my CWD architecture, I would use Azure Cache for Redis primarily for low-latency short-term agent memory, active session context and caching. For example, the Coordinator can store the user's recent conversation context, current equipment ID, active task information and frequently accessed intermediate results in Redis so that different Coordinator or Worker replicas can access the same context without relying on local process memory. I would use TTLs for temporary data and carefully design cache invalidation for data that can become stale. Redis would not be my system of record. I would persist durable workflow state, execution history and important agent metadata in Cosmos DB, while Azure AI Search would remain the enterprise knowledge retrieval layer. This separation gives CWD fast access to active context while maintaining durable persistence and scalable distributed processing."**

---

# Final mental model

```text id="redis44"
Blob Storage
    ↓
"Files"

Azure AI Search
    ↓
"Knowledge"

Cosmos DB
    ↓
"Durable application state"

Redis
    ↓
"Fast temporary memory/cache"

Service Bus
    ↓
"Reliable asynchronous messages"
```

### The one sentence to remember

> **Azure Cache for Redis provides the fast, distributed short-term memory and caching layer for CWD, while Cosmos DB provides durable state and Azure AI Search provides enterprise knowledge retrieval.**
