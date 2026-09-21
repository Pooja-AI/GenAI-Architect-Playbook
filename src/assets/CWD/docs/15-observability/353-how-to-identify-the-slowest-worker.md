## How do you identify the slowest Worker?

In CWD, I use **distributed tracing and Worker-level latency metrics** to identify which Worker is contributing most to the end-to-end response time.

### CWD flow

```text
Coordinator
   │
   ├── Sales Delegator
   │     ├── Customer Worker      → 0.8 sec
   │     └── Opportunity Worker   → 4.2 sec  ← slowest
   │
   └── IT Delegator
         └── Incident Worker      → 1.5 sec
```

Each Worker execution is represented as a **trace/span**, so I can measure its duration.

### What I measure

For every Worker, I capture:

```text
worker_name
trace_id
task_id
start_time
end_time
duration
status
retry_count
LLM_latency
RAG_latency
MCP_latency
downstream_latency
```

For example:

```text id="3i5m0p"
Customer Worker
  Total:       800 ms
  LLM:         300 ms
  RAG:         200 ms
  MCP:         250 ms

Opportunity Worker
  Total:      4200 ms
  LLM:         700 ms
  RAG:         400 ms
  MCP:        3000 ms  ← bottleneck

Incident Worker
  Total:      1500 ms
```

So I don't just say **“Opportunity Worker is slow.”** I drill into its child spans and discover that the **Salesforce MCP call is the bottleneck**.

### Important: use P95/P99, not only average

A Worker might normally take 500 ms but occasionally take 10 seconds.

So I monitor:

```text
Worker latency
├── P50
├── P95
└── P99
```

Example:

| Worker             |  P50 |  P95 |  P99 |
| ------------------ | ---: | ---: | ---: |
| Customer Worker    | 0.7s | 1.2s | 2.0s |
| Opportunity Worker | 1.5s | 4.2s | 7.8s |
| Incident Worker    | 1.0s | 1.8s | 3.0s |

This shows that **Opportunity Worker has the highest tail latency**.

### How I troubleshoot it

I drill down:

```text id="7k5v4d"
Slow Worker
    ↓
Worker span
    ↓
Which operation?
    ├── LLM
    ├── RAG
    ├── MCP
    └── Business logic
         ↓
Which dependency?
         ↓
Root cause
```

For example:

```text
Opportunity Worker
      ↓
MCP call
      ↓
Salesforce API
      ↓
High latency
```

Then I investigate Salesforce API latency, network latency, retries, rate limits, payload size, etc.

### Parallel Workers are important

If Workers run in parallel:

```text
Sales Worker ─────── 1 sec ────┐
                                │
IT Worker ────────── 1.5 sec ───┤── Aggregate
                                │
Opportunity Worker ─ 4 sec ─────┘
```

The overall parallel portion is approximately governed by the **slowest required branch**, so identifying that Worker is important for reducing end-to-end latency.

### Interview-ready answer

> **“I identify the slowest Worker using distributed tracing and Worker-level latency metrics. Every Worker gets its own span, and I monitor P50, P95 and P99 latency. When I find a slow Worker, I drill into its child spans—LLM, RAG, MCP, database and downstream API calls—to identify the actual bottleneck. For example, if Opportunity Worker takes 4.2 seconds and 3 seconds is spent in the Salesforce MCP call, I know the Worker itself isn't necessarily the problem; Salesforce is the downstream bottleneck.”**

### Strong interview line

> **“I don't optimize the Worker blindly. I trace inside the Worker to identify whether the bottleneck is LLM, RAG, MCP, network, or a downstream enterprise system.”**

**Easy memory:**
**Worker latency → P95/P99 → Drill down → Find bottleneck → Fix root cause**
