## Monitoring vs Observability

The easiest way to remember:

> **Monitoring tells me WHAT is wrong. Observability helps me understand WHY it is wrong.**

### Simple comparison

| Monitoring                           | Observability                       |
| ------------------------------------ | ----------------------------------- |
| Detects problems                     | Investigates problems               |
| Answers **“Is the system healthy?”** | Answers **“Why is it unhealthy?”**  |
| Dashboards & alerts                  | Logs + metrics + traces + context   |
| Usually predefined metrics           | Explore unknown/unexpected failures |
| CPU, memory, error rate, latency     | Full request/agent journey          |
| Good for known problems              | Good for complex/unknown problems   |

### CWD example

Suppose Customer Briefing takes **20 seconds**.

**Monitoring:**

```text
Latency: 20 sec
Alert: P95 latency > 10 sec
```

It tells me there is a problem.

**Observability:**

```text id="9f6j3x"
Trace: TR-9001
│
├── Coordinator          500 ms
├── A2A → Sales          300 ms
│   ├── Customer Worker  800 ms
│   │   └── MCP → Salesforce     7 sec  ← Problem
│   └── Opportunity Worker        900 ms
│
├── A2A → IT             400 ms
│   └── MCP → ServiceNow          6 sec
│
└── LLM                  4 sec
```

Now I know **where and why** the latency occurred.

---

## In GenAI

Monitoring might track:

```text
✓ Request count
✓ Error rate
✓ CPU / memory
✓ P95 latency
✓ Token usage
```

Observability additionally lets me investigate:

```text
✓ Which model was called?
✓ Which prompt/version was used?
✓ Which Delegator was selected?
✓ Which Worker ran?
✓ Which MCP tool was called?
✓ What retrieval results were returned?
✓ How many tokens were consumed?
✓ Where did latency occur?
✓ Why did the agent retry?
✓ Was the final answer grounded?
```

### CWD observability stack

```text
CWD
 ↓
OpenTelemetry
 ↓
Logs + Metrics + Distributed Traces
 ↓
Application Insights / Log Analytics

        +

Langfuse
 ↓
LLM + Agent traces
Prompts
Tokens
Latency
Evaluation
```

### Interview-ready answer

> **“Monitoring tells me whether my GenAI system is healthy by tracking predefined metrics such as latency, errors, throughput, and resource utilization. Observability goes deeper—it lets me understand why something happened by correlating logs, metrics, and distributed traces across the Coordinator, Delegators, Workers, RAG, MCP, LLM, and downstream systems. In CWD, monitoring might alert me that P95 latency is high, while observability lets me trace the request and identify that Salesforce MCP calls caused the latency.”**

### Strong one-liner

**Monitoring = WHAT is wrong.**
**Observability = WHY and WHERE it is wrong.**
