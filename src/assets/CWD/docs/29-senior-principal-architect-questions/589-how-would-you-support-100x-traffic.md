### Interview answer

> **For 100× traffic, I would not treat it as simply a larger version of 10× scaling. At that level, I would redesign CWD around cell-based architecture, asynchronous execution, aggressive caching, workload isolation, and strict protection of shared dependencies.**
>
> The key principle is: **scale horizontally and isolate failures so one traffic surge doesn't bring down the entire platform.**

### 1. Move from one large CWD to cells

Instead of:

```text id="f9x2k3"
                 CWD
                  |
        +---------+---------+
        |         |         |
     Workers   Workers   Workers
```

I would use **multiple independent cells**:

```text id="n4k8pz"
                    Global Router
                         |
       +-----------------+-----------------+
       |                 |                 |
       v                 v                 v
    Cell 1            Cell 2            Cell 3
       |                 |                 |
 Coordinator         Coordinator        Coordinator
 Delegators          Delegators         Delegators
 Workers             Workers            Workers
```

Traffic can be partitioned by **tenant, geography, workload type, or hash**.

If Cell 2 has a problem, Cell 1 and Cell 3 continue serving traffic.

---

### 2. Make the Coordinator horizontally scalable

I would make the Coordinator **stateless**.

```text id="8h1m5r"
              Load Balancer
                    |
        +-----------+-----------+
        |           |           |
    Coord-1     Coord-2     Coord-3
        |           |           |
        +-----------+-----------+
                    |
             Durable State
```

No important workflow state should live only in Coordinator memory.

---

### 3. Push work asynchronously

At 100× traffic, synchronous chains become dangerous.

Instead:

```text id="j6v0fz"
Request
   |
Coordinator
   |
Event / Queue
   |
+--+---------+----------+
|            |          |
v            v          v
Sales       IT        Other
Worker      Worker     Worker
```

Queues provide:

* buffering
* backpressure
* workload smoothing
* retry
* DLQ
* independent scaling

---

### 4. Partition the workload

I would avoid putting every request into one giant queue or Worker pool.

For example:

```text id="d2k7qa"
                    CWD
                     |
          +----------+----------+
          |          |          |
       Sales Q     IT Q      Support Q
          |          |          |
       Workers    Workers    Workers
```

Now Sales traffic can scale independently from IT traffic.

This is especially useful for your CWD because **Salesforce and ServiceNow workloads have different traffic patterns and downstream limits**.

---

### 5. Protect the LLM layer

At 100× traffic, LLM cost and provider capacity can become major constraints.

I would introduce:

```text id="a3q9kw"
                LLM Gateway
                     |
       +-------------+-------------+
       |             |             |
    Small Model   Medium Model   Large Model
```

Use:

* smaller models for classification/extraction
* larger models only for complex reasoning
* prompt/context reduction
* semantic caching
* response caching where safe
* token budgets
* concurrency limits
* provider rate-limit handling
* fallback models/providers where appropriate

The goal is **not 100× LLM calls simply because traffic increased 100×**.

---

### 6. Aggressive caching

At 100× traffic, repeatedly fetching the same information becomes expensive.

For example:

```text id="x4y7mt"
1000 requests
     |
     +---- Customer profile
     |
     +---- Same customer data
     |
     v
   Cache
     |
  One backend call
```

But cache keys must include tenant/security context:

```text id="d4j9ps"
tenant + resource + authorization context
```

Otherwise caching can create a data-isolation problem.

---

### 7. Protect enterprise systems

This is one of the **most important interview points**.

Even if CWD can process:

```text id="w8g2j1"
100,000 requests/sec
```

Salesforce or ServiceNow may not safely accept that volume.

Therefore:

```text id="g5r8xa"
CWD
 |
Queue
 |
Rate Limiter
 |
Circuit Breaker
 |
Enterprise API
```

Use:

* rate limiting
* connection pooling
* batching where supported
* caching
* circuit breakers
* backpressure
* retries with jitter
* DLQ

**The platform must scale independently of downstream system capacity.**

---

### 8. Use multi-region cells

For 100× global traffic, I would combine cell architecture with multi-region deployment:

```text id="5s0p8e"
                    Global Traffic Manager
                         /      |      \
                        /       |       \
                       v        v        v
                   US-East   US-West   EU
                     |          |       |
                  Cells       Cells   Cells
```

This provides:

* geographic distribution
* lower latency
* regional failure isolation
* independent scaling
* disaster recovery

---

### 9. Partition data

A single database can become a bottleneck.

I would partition by appropriate business dimensions, potentially:

```text id="n7f3ck"
tenant_id
region
customer/domain
workload
```

And use:

* read replicas
* sharding/partitioning
* distributed caches
* asynchronous writes where acceptable
* separate analytical workloads from transactional workloads

---

### 10. Don't scale everything equally

At 100×, this is critical.

Suppose traffic looks like:

```text id="k5s1dt"
Sales requests       → 60%
IT requests           → 25%
Other requests        → 15%
```

I would scale accordingly:

```text id="q8h3vz"
Sales Workers       → 60% capacity
IT Workers          → 25% capacity
Other Workers       → 15% capacity
```

Rather than deploying the same number of instances everywhere.

---

### 11. Introduce admission control

At extreme load, accepting every request can cause cascading failure.

I would implement:

```text id="r3c7ym"
Traffic
   |
Admission Control
   |
   +---- High priority → Process
   |
   +---- Normal        → Queue
   |
   +---- Excess        → Throttle / Retry-After
```

For example, critical enterprise workflows could receive higher priority than non-critical analytics requests.

---

### 12. Observability becomes mandatory

At 100×, logs alone aren't enough.

I would monitor:

```text
                    CWD
                     |
       +-------------+-------------+
       |             |             |
    Traffic       Queues        Workers
       |             |             |
     RPS          Depth        Utilization
     p99          Lag          Errors
       |
     LLM
       |
   Tokens / Cost / Latency
```

Key SLOs:

* requests/sec
* p95/p99 latency
* error rate
* queue lag
* Worker saturation
* MCP latency
* enterprise API throttling
* LLM token usage
* cost per successful workflow

---

## 10× vs 100×

This is a good distinction to make in an interview:

| 10×                    | 100×                                 |
| ---------------------- | ------------------------------------ |
| Horizontal scaling     | **Cell-based architecture**          |
| Autoscaling            | **Partitioned workloads**            |
| Queues                 | **Multiple isolated queues/cells**   |
| Caching                | **Aggressive multi-level caching**   |
| Rate limiting          | **Admission control + backpressure** |
| Multi-instance Workers | **Independent workload pools**       |
| Single-region can work | **Multi-region becomes important**   |
| Optimize bottlenecks   | **Redesign bottlenecks**             |

### Strong closing answer

> **“At 100× traffic, I would move beyond simple horizontal scaling and introduce cell-based architecture. Each cell would contain its own Coordinator, Delegators, Workers, queues, and supporting services, with global routing distributing traffic across cells and regions. I would partition workloads, use asynchronous queues and backpressure, aggressively cache safe data, introduce model routing and token controls, and protect Salesforce, ServiceNow, and other downstream systems with rate limiting and circuit breakers. I would also use admission control and workload prioritization so overload in one area doesn't cascade through the entire platform.”**

### One sentence to memorize

> **“10× requires scaling the architecture; 100× requires changing the architecture—through cells, partitioning, asynchronous execution, backpressure, caching, workload isolation, and multi-region distribution.”**
