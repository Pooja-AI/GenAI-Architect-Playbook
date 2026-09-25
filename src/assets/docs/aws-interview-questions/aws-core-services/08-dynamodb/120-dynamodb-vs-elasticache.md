# DynamoDB vs ElastiCache

The simplest distinction:

> **DynamoDB = durable application state**
> **ElastiCache = fast temporary cache**

|                 | **DynamoDB**                 | **ElastiCache (Redis)**                                              |
| --------------- | ---------------------------- | -------------------------------------------------------------------- |
| Primary purpose | Durable database             | Cache / in-memory data store                                         |
| Persistence     | Durable                      | Primarily memory-based; persistence options exist depending on setup |
| Latency         | Very low                     | Extremely low                                                        |
| Data survival   | Designed for durable storage | Cache data can be lost/evicted depending on configuration            |
| Scaling         | Horizontal                   | Horizontal/sharded depending on Redis architecture                   |
| Best for        | Workflow/application state   | Frequently accessed temporary data                                   |
| CWD example     | Run/checkpoint/idempotency   | LLM/RAG cache/session cache/rate limiting                            |

## CWD example

### DynamoDB

Store important workflow state:

```text id="t6z1vy"
RUN123
 ├── status = RUNNING
 ├── current_step = IncidentWorker
 ├── retry_count = 2
 └── completed_steps = [...]
```

If the ECS container crashes:

```text id="d9s4ra"
Container crashes
      ↓
New container
      ↓
Read DynamoDB
      ↓
Resume workflow
```

### ElastiCache / Redis

Store frequently accessed temporary information:

```text id="q9w2cx"
User query
    ↓
Semantic cache
    ↓
Redis
    ↓
Cached answer
```

Other examples:

* LLM response cache
* RAG retrieval cache
* Session context
* Rate limiting counters
* Distributed locks
* Frequently accessed configuration

---

## Why not use Redis for critical workflow state?

Suppose:

```text id="3z7h1b"
Redis
  ↓
RUN123 = COMPLETED
  ↓
Cache eviction / failure
```

If that state is lost, CWD may not know where the workflow was.

So I would keep **source-of-truth workflow state in DynamoDB** and use Redis to accelerate frequently accessed data.

```text id="9u5q4x"
             CWD
              │
       ┌──────┴──────┐
       ▼             ▼
  DynamoDB        Redis
  Source of       Fast
  Truth           Cache
```

### 🎯 Strong interview answer

> **“I use DynamoDB as the durable source of truth for CWD state such as session, task, run, Worker status, checkpoints, and idempotency records. I use ElastiCache Redis for temporary, frequently accessed data such as semantic LLM cache, RAG cache, rate limiting, session acceleration, and distributed locks. Redis improves latency and reduces repeated downstream or LLM calls, while DynamoDB provides durable state that survives container or cache failures.”**

### Easy memory trick

**DynamoDB = Remember**
**Redis = Remember Fast**

### Key distinction

**DynamoDB answers:** *“What is the authoritative state?”*

**Redis answers:** *“Can I get this frequently needed data faster?”*
