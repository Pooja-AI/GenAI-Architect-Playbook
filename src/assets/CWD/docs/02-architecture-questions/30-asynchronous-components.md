In your **CWD (Coordinator → Delegator → Worker)** architecture, asynchronous components are those where the caller **does not need to block and wait for the operation to finish before continuing**.

### Asynchronous components in CWD

A practical CWD architecture can use async processing for:

#### 1. Event publishing / messaging

For example, after a workflow starts or finishes:

```text
Coordinator
    ↓
Service Bus / Event Bus
    ↓
Event Consumer
```

The Coordinator can publish an event without waiting for every downstream consumer.

Examples:

* Audit events
* Usage/cost events
* Evaluation events
* Analytics events
* Notification events

---

#### 2. Long-running Workers

Suppose a Worker performs a long-running operation:

```text
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
Long-running job
```

Instead of keeping the user request open for several minutes, the Worker can submit a job and return a job ID:

```text
Worker → Job submitted → job_id = 123
                         ↓
                    Background processing
                         ↓
                    Result stored
```

The workflow can later resume or retrieve the result.

---

#### 3. Retry / recovery processing

If a Worker fails, retry processing can be handled asynchronously:

```text
Worker fails
    ↓
Retry Queue
    ↓
Background Worker
    ↓
Retry
```

The main request doesn't necessarily need to perform all retry attempts itself.

---

#### 4. Observability and audit

These are excellent asynchronous candidates:

```text
CWD
 ↓
Logs / Metrics / Traces
 ↓
App Insights / Log Analytics
```

The business response shouldn't have to wait for every telemetry event to be processed.

---

#### 5. Post-response evaluation

For example:

```text
User receives response
        ↓
Evaluation pipeline
        ↓
LLM evaluation
        ↓
Grounding / relevance / quality metrics
```

Evaluation can happen asynchronously because it isn't required to construct the immediate response.

### Important distinction for your interview

Don't say:

> "Workers are asynchronous."

That is too broad.

Instead say:

> **“Worker execution can be synchronous or asynchronous depending on the business operation. In CWD, independent Workers can execute concurrently, while long-running or non-critical operations such as background jobs, event processing, telemetry, audit, and post-response evaluation can be handled asynchronously.”**

### CWD picture

```text
                    ┌── Salesforce Worker ──→ Result ──┐
                    │                                  │
Coordinator → Delegator                                ├→ Aggregate
                    │                                  │
                    └── ServiceNow Worker ─→ Result ──┘
                                                        │
                                                        ↓
                                                   Final Response


Meanwhile:

CWD ──→ Service Bus ──→ Audit/Event Processing
CWD ──→ Telemetry ──→ Observability
CWD ──→ Evaluation Queue ──→ LLM Evaluation
CWD ──→ Long-running Job ──→ Background Processing
```

### Easy interview answer

> **“In CWD, the core user-facing orchestration is synchronous because the Coordinator needs the required Worker results before producing the final answer. Asynchronous processing is used for non-blocking activities such as Service Bus events, audit and telemetry processing, long-running jobs, retries, notifications, and post-response evaluation. This keeps the user-facing latency low while allowing background processing to continue independently.”**
