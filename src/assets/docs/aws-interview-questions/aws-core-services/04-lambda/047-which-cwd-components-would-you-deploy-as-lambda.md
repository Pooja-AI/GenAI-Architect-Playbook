# Which CWD components would you deploy as Lambda?

## Short answer

I would **not deploy the entire CWD Coordinator → Delegator → Worker architecture as Lambda**.

I would use Lambda for **small, stateless, event-driven Workers or supporting functions**.

```text
                    CWD
                     │
          ┌──────────┴──────────┐
          ↓                     ↓
   Main CWD Service        Supporting Functions
   ECS/Fargate                  Lambda
          │                     │
    Coordinator             Preprocessing
          │                 Validation
     Delegators             Event handlers
          │                 SQS consumers
       Workers              Lightweight adapters
```

## Components I would deploy as Lambda

### 1. Document preprocessing Worker

For example:

```text
S3
 ↓
Lambda
 ↓
Extract metadata / preprocess
 ↓
SQS
 ↓
RAG ingestion
```

Good Lambda use case because the task is relatively short and event-driven.

---

### 2. Event-driven Workers

For example, when Salesforce or another system produces an event:

```text
Salesforce Event
      ↓
EventBridge
      ↓
Lambda
      ↓
Update CWD state/cache
```

Lambda is useful because the function only runs when an event occurs.

---

### 3. Lightweight MCP adapters

If an MCP-related operation is simple and short-running:

```text
Worker
   ↓
MCP Server
   ↓
Lambda
   ↓
Enterprise API
```

For example, a lightweight read-only API adapter.

I would **not** use Lambda for an MCP operation that requires long-running processing or persistent connections.

---

### 4. SQS message processors

For asynchronous CWD work:

```text
CWD
 ↓
SQS
 ↓
Lambda
 ↓
Process message
```

Examples:

* Document processing
* Notifications
* Metadata updates
* Small background jobs
* Audit/event processing

---

### 5. Lightweight validation/transformation

For example:

```text
API/Event
   ↓
Lambda
   ↓
Validate / transform
   ↓
Downstream service
```

Useful when the processing is small and stateless.

---

### 6. Scheduled jobs

Lambda can also handle scheduled CWD tasks:

```text
EventBridge Scheduler
       ↓
Lambda
       ↓
Run evaluation/reconciliation
```

For example:

* Periodic cache cleanup
* Metadata reconciliation
* Lightweight health checks
* Scheduled evaluation jobs

---

# What I would NOT deploy as Lambda

### ❌ Coordinator

I would normally keep:

```text
Coordinator
```

inside the main CWD service on **ECS/Fargate**.

Reason:

* Complex LangGraph workflow
* Multiple steps
* State/checkpointing
* Long-running execution
* More runtime control

---

### ❌ Delegator

I would also normally keep:

```text
Delegator
```

with the main CWD application.

The Delegator performs orchestration such as:

```text
Discover Workers
      ↓
Select Workers
      ↓
Parallel execution
      ↓
Aggregate results
```

That is better suited to the continuously running CWD service.

---

### ❌ Complex Workers

A Worker that performs:

```text
Worker
 ↓
MCP
 ↓
Salesforce
 ↓
RAG
 ↓
Bedrock
 ↓
Multiple retries
 ↓
Aggregation
```

may be better deployed as a containerized service if it is long-running or resource-intensive.

---

### ❌ Entire LangGraph runtime

I would not say:

> "I deployed LangGraph completely in Lambda."

unless the actual workflow fits Lambda's execution/runtime constraints.

For an enterprise CWD platform, I'd typically use:

```text
API Gateway
      ↓
ECS/Fargate
      ↓
FastAPI
      ↓
Coordinator
      ↓
Delegators
      ↓
Workers
```

and use Lambda around it for supporting event-driven tasks.

---

# Example CWD architecture

```text
                         API Gateway
                              │
                              ↓
                        ECS / Fargate
                              │
                         CWD FastAPI
                              │
                        Coordinator
                              │
                    ┌─────────┴─────────┐
                    ↓                   ↓
              Sales Delegator      IT Delegator
                    ↓                   ↓
                Workers             Workers
                    │                   │
                    └─────────┬─────────┘
                              ↓
                         MCP / RAG
                              ↓
                    Bedrock / Enterprise APIs


Supporting Lambda functions
────────────────────────────────────────

S3 ──→ Lambda ──→ SQS ──→ RAG ingestion

EventBridge ──→ Lambda ──→ CWD state/cache

SQS ──→ Lambda ──→ Lightweight background processing

Scheduler ──→ Lambda ──→ Reconciliation/evaluation
```

## 🎯 Strong interview answer

> **“I would use Lambda selectively in CWD for short, stateless and event-driven workloads. Examples include document preprocessing triggered by S3, EventBridge handlers, SQS-based background processing, lightweight MCP or enterprise API adapters, validation and scheduled reconciliation jobs. I would keep the main Coordinator, Delegators and complex multi-step Workers on ECS/Fargate because CWD uses LangGraph and can require long-running workflows, state management and more runtime control. So Lambda complements the CWD platform rather than replacing the main agent runtime.”**

## Easy memory trick

**Lambda = Small + Short + Event-driven**

**Fargate = Main CWD + Long-running + Complex**

### Most important interview point

Don't say **"every Worker is Lambda."**

Say:

> **“I choose Lambda based on the Worker characteristics. Short, stateless, event-driven Workers can use Lambda; complex or long-running Workers use ECS/Fargate.”**
