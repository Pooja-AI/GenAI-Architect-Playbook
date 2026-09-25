# What are Lambda's limitations for agentic workloads?

## Short answer

Lambda is excellent for **short, stateless, event-driven tasks**, but it is not always ideal for the **main agentic runtime**.

Agentic workloads often involve:

* Long-running reasoning
* Multiple agent/Worker calls
* State and checkpoints
* Parallel tool calls
* Streaming
* Large dependencies
* Persistent connections

So for CWD, I would typically use **ECS/Fargate for the main Coordinator/Delegator runtime** and Lambda selectively for lightweight Workers.

## Key limitations

### 1. Execution duration

Lambda has a **maximum execution timeout of 15 minutes**.

An agentic workflow can potentially run much longer:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker 1
 ↓
MCP
 ↓
Worker 2
 ↓
RAG
 ↓
Worker 3
 ↓
LLM
 ↓
Human approval
 ↓
Resume
```

That's not a natural fit for one Lambda invocation.

---

### 2. State management

Lambda execution environments are **not a durable place to store workflow state**.

Agentic systems need:

```text
Session
 ↓
Task
 ↓
Run
 ↓
Turn
 ↓
Step
 ↓
Checkpoint
```

So I would store state externally:

```text
Lambda
 ↓
DynamoDB / Redis / other durable state
```

For CWD, LangGraph checkpoint/state should be persisted outside the Lambda execution environment.

---

### 3. Cold starts

Agentic applications can have significant dependencies:

```text
LangGraph
LangChain
MCP SDK
RAG libraries
AWS SDK
custom libraries
```

Large packages can increase initialization time.

For latency-sensitive agent interactions:

```text
Cold start
   ↓
Extra latency
```

Provisioned Concurrency can help, but it adds cost.

---

### 4. Fan-out can create concurrency problems

This is especially important for CWD.

One request could become:

```text
Coordinator
    ↓
Delegator
    ↓
10 Workers
    ↓
10 Lambda executions
```

100 users could potentially create:

```text
100 × 10 = 1,000
```

concurrent Worker executions.

That can cause:

* Lambda throttling
* Bedrock throttling
* Salesforce overload
* ServiceNow overload
* Higher cost

You need concurrency limits, queues and backpressure.

---

### 5. Long-running connections

Some agentic systems may need:

* Persistent connections
* Streaming
* Long-running MCP interactions
* WebSocket connections
* Connection pooling

Lambda is not designed to be a general-purpose persistent application server.

For those workloads, a containerized service can be a better fit.

---

### 6. Large dependencies / custom runtimes

Agentic applications can become dependency-heavy.

For example:

```text
CWD
 ├── LangGraph
 ├── MCP
 ├── RAG
 ├── Document processing
 ├── ML libraries
 └── Custom enterprise SDKs
```

Lambda supports layers and container images, but a large application can still become harder to manage efficiently.

ECS/Fargate gives more control over the container environment.

---

### 7. Complex workflow orchestration

Lambda itself doesn't provide agent reasoning/orchestration.

For example:

```text
Coordinator
 ↓
Choose Delegator
 ↓
Parallel Workers
 ↓
Evaluate result
 ↓
Retry
 ↓
Human approval
 ↓
Resume
```

You still need something like:

* LangGraph
* Step Functions
* Another workflow engine

Lambda is **compute**, not the agent orchestration framework.

---

### 8. Retry complexity

Agentic workflows can have many layers:

```text
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Salesforce
```

If each layer independently retries, you can accidentally create:

```text
3 Coordinator retries
×
3 Worker retries
×
3 MCP retries
=
27 downstream attempts
```

So retry policies need to be centrally designed and bounded.

---

## CWD architecture I would use

```text
                       API Gateway
                            ↓
                       ECS/Fargate
                            ↓
                       Coordinator
                            ↓
                     ┌──────┴──────┐
                     ↓             ↓
                Delegator       Delegator
                     ↓             ↓
                  Workers        Workers
                     ↓             ↓
                  MCP/RAG      MCP/RAG
                     ↓             ↓
                  Systems      Bedrock


Supporting workloads
────────────────────────────
S3/EventBridge/SQS
        ↓
      Lambda
        ↓
 Short/event-driven processing
```

## When Lambda is still a good choice

I would use Lambda for:

* S3 document preprocessing
* EventBridge handlers
* SQS consumers
* Lightweight MCP adapters
* Simple validation/transformation
* Scheduled jobs
* Notifications
* Small background Workers

## 🎯 Strong interview answer

> **“Lambda has several limitations for agentic workloads. Agent workflows can be long-running, stateful and highly parallel, while Lambda has a maximum invocation duration, ephemeral execution environments and concurrency limits. Cold starts and large dependency packages can also affect latency. Agentic systems may require persistent connections, checkpointing and complex orchestration, which Lambda doesn't provide by itself. Therefore, in CWD I would typically run the main FastAPI and LangGraph Coordinator/Delegator runtime on ECS/Fargate, while using Lambda for short, stateless and event-driven supporting workloads. State would be externalized to services such as DynamoDB or Redis, and queues would control bursty Worker execution.”**

## Easy memory trick

**Agentic workload = L-S-C-P**

* **L** → Long-running
* **S** → Stateful
* **C** → Concurrent/fan-out
* **P** → Persistent connections

> **Lambda = short/event-driven. Fargate = long/complex agent runtime.**
