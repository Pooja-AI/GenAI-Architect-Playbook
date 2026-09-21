## How do you monitor latency?

In CWD, I monitor **end-to-end latency and component-level latency** using distributed tracing. The goal is not just to know that a request is slow, but **which component caused the delay**.

### CWD latency flow

```text
User
 ↓
Coordinator
 ↓
A2A
 ↓
Delegator
 ↓
Worker
 ├── RAG
 ├── LLM
 └── MCP
      ↓
 Salesforce / ServiceNow
```

Each step gets its own trace/span.

### 1. What latency do I capture?

For every operation:

```text
trace_id
correlation_id
task_id
component
start_time
end_time
duration
status
```

Example:

```text id="h6s2pk"
CWD Request                 5.8 sec
│
├── Coordinator             0.4 sec
├── A2A → Sales Delegator   0.2 sec
├── Customer Worker         1.1 sec
│    ├── RAG                0.3 sec
│    ├── LLM                0.5 sec
│    └── MCP                0.3 sec
│
└── Incident Worker         3.8 sec
     ├── RAG                0.4 sec
     ├── LLM                0.6 sec
     └── MCP → ServiceNow   2.8 sec  ← bottleneck
```

Now I know the overall request is slow because **ServiceNow MCP latency is high**, not because the LLM is necessarily slow.

---

### 2. Monitor P50, P95 and P99

I don't rely only on average latency.

```text id="1y1t9n"
P50 = typical request
P95 = slower requests
P99 = worst tail latency
```

Example:

```text
Customer Worker
P50 = 0.8 sec
P95 = 1.5 sec
P99 = 3.2 sec
```

If P50 is healthy but P99 suddenly increases, I investigate **tail-latency problems** such as downstream timeouts, retries, throttling or resource contention.

---

### 3. Monitor latency by layer

I maintain separate metrics for:

```text id="4o3w8f"
API latency
Coordinator latency
A2A latency
Delegator latency
Worker latency
RAG latency
LLM latency
MCP latency
Enterprise API latency
Queue latency
```

This makes troubleshooting much easier.

---

### 4. Detect the slowest Worker

Because every Worker has its own span:

```text id="7m2v1x"
Customer Worker      0.8 sec
Opportunity Worker   4.2 sec  ← slow
Incident Worker      1.5 sec
```

I drill into the slow Worker:

```text id="z6r8kp"
Opportunity Worker
       ↓
LLM          0.7 sec
RAG          0.4 sec
MCP          3.0 sec  ← bottleneck
```

Then I investigate the downstream dependency.

---

### 5. Monitor parallel execution correctly

CWD can execute independent Workers in parallel:

```text id="w3p9cy"
                 ┌── Customer Worker ── 1 sec ──┐
Coordinator ─────┤                              ├── Aggregate
                 └── Incident Worker ── 4 sec ──┘
```

The parallel portion is generally constrained by the **slowest required branch**, so I monitor branch-level latency and identify stragglers.

---

### 6. Monitor latency trends

I track latency over time:

```text id="r0j4av"
P95 latency

Week 1 → 3.2 sec
Week 2 → 3.4 sec
Week 3 → 4.1 sec
Week 4 → 6.8 sec  ← regression
```

Then correlate the increase with:

* model change
* prompt change
* RAG/index change
* MCP/API latency
* traffic increase
* retries
* rate limiting
* infrastructure/resource saturation

---

### 7. Set alerts

For example:

```text id="c8y4nd"
P95 > SLA threshold
       ↓
Alert
       ↓
Open trace
       ↓
Identify slow span
       ↓
Find root cause
```

I can also alert on sudden changes rather than only fixed thresholds.

---

### Tools I use

For the Azure CWD architecture:

```text id="2k6m1h"
OpenTelemetry
      ↓
Application Insights
      ↓
Log Analytics
      ↓
Distributed latency traces

Langfuse
      ↓
LLM/Agent latency
```

### Interview-ready answer

> **“I monitor latency at both the end-to-end and component level using distributed tracing. Every Coordinator, A2A, Delegator, Worker, RAG, LLM and MCP operation gets a timestamped span. I track P50, P95 and P99 latency and set alerts on SLA violations and latency regressions. When a request is slow, I drill down through the trace to identify whether the bottleneck is the LLM, RAG, MCP, network, or downstream enterprise system. For parallel Workers, I specifically monitor the slowest branch because it can determine the overall workflow latency.”**

### Strong interview line

> **“I don't just monitor end-to-end latency. I break it down by span so I can answer exactly where the time was spent and which dependency caused the latency.”**

**Easy memory:**
**End-to-end → P50/P95/P99 → Component spans → Slowest branch → Root cause → Alert → Optimize**
