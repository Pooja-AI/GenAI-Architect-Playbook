## What is the end-to-end latency in CWD?

**End-to-end latency** is the **total time from when the user sends a request until CWD returns the final business response**.

For example, in the CWD **Customer Briefing** use case:

```text
User
 ↓
API / FastAPI
 ↓
Coordinator
 ↓ A2A
 ├── Sales Delegator
 │     ├── Customer Worker → MCP → Salesforce
 │     └── Opportunity Worker → MCP → Salesforce
 │
 └── IT Delegator
       └── Incident Worker → MCP → ServiceNow
 ↓
Coordinator validates + aggregates
 ↓
Final response
```

### Example latency breakdown

Assume the calls are executed in parallel:

| Component                             |      Latency |
| ------------------------------------- | -----------: |
| API authentication + request handling |       100 ms |
| Coordinator planning                  |       300 ms |
| A2A communication                     |       200 ms |
| Sales Workers                         |      1.5 sec |
| IT Incident Worker                    |      4.0 sec |
| Aggregation + validation              |       300 ms |
| **End-to-end latency**                | **~4.9 sec** |

The important point is that **parallel Workers don't simply add together**.

If Sales takes 1.5 sec and IT takes 4 sec:

```text
Sales Worker ─────── 1.5 sec ────┐
                                  ├── Aggregate
IT Worker ────────── 4.0 sec ────┘
```

The critical path is approximately:

**100ms + 300ms + 200ms + 4.0s + 300ms ≈ 4.9s**

### How would you reduce CWD latency?

I would:

1. **Parallelize independent Delegators/Workers**
2. Use **async MCP calls**
3. Cache frequently accessed, safe data
4. Optimize RAG — fewer but more relevant documents
5. Reduce unnecessary LLM calls and token size
6. Use connection pooling for MCP/downstream APIs
7. Set timeouts so slow dependencies don't block indefinitely
8. Monitor **P50/P95/P99 latency**
9. Use distributed tracing to identify the actual bottleneck

For example:

```text
CWD = 5 sec
   ↓
Trace
   ↓
Coordinator     0.3s
A2A             0.2s
LLM             1.0s
RAG             0.4s
MCP             0.2s
ServiceNow      2.9s  ← bottleneck
```

So I would **not automatically optimize the Coordinator**. The trace shows that ServiceNow is consuming most of the latency.

### 🎯 Interview-ready answer

> **“End-to-end latency in CWD is the total time from receiving the user request to returning the final validated response. Because independent Delegators and Workers execute in parallel, the latency is driven mainly by the critical path rather than the sum of all Worker times. I measure P50, P95, and P99 latency using distributed tracing and break it down across the Coordinator, A2A, LLM, RAG, MCP, and downstream enterprise systems. If a downstream system such as ServiceNow is the bottleneck, I optimize that dependency rather than blindly scaling the Coordinator.”**

**Easy memory:**
**E2E latency = Request → Processing → Critical path → Validation → Response.**
