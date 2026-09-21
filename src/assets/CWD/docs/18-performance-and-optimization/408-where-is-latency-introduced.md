## Where is latency introduced in CWD?

Latency can be introduced at **every layer of the CWD architecture**, but the biggest delays usually come from **LLM calls, RAG retrieval, MCP calls, and downstream enterprise systems**.

### CWD latency flow

```text
User
 ↓
API / FastAPI
 ↓
Authentication
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ↓
LLM / RAG
 ↓
MCP Client
 ↓
MCP Server
 ↓
Salesforce / ServiceNow / SharePoint
 ↓
Worker
 ↓
Delegator
 ↓
Coordinator
 ↓
Final Response
```

### Main sources of latency

| Layer                     | Where latency comes from                   |
| ------------------------- | ------------------------------------------ |
| **API**                   | Network + request processing               |
| **Authentication**        | Token validation / authorization           |
| **Coordinator**           | Intent detection, planning, LLM reasoning  |
| **A2A**                   | Network + serialization between agents     |
| **Delegator**             | Worker selection and orchestration         |
| **Worker**                | Business logic + LLM calls                 |
| **RAG**                   | Embedding/search/reranking                 |
| **MCP**                   | Tool-call network and protocol overhead    |
| **MCP Server**            | Tool execution and integration logic       |
| **Salesforce/ServiceNow** | API response time, throttling, network     |
| **Aggregation**           | Validation, merging and final LLM response |

### Important point: parallelism

In your CWD architecture, if Sales and IT Delegators run in parallel:

```text
Sales Delegator ─────── 1.5 sec ────┐
                                    │
IT Delegator ────────── 4.0 sec ────┤
                                    ↓
                              Coordinator
```

You don't normally add `1.5 + 4.0`.

The **4-second branch becomes part of the critical path**.

### How do you find where latency is coming from?

Use **distributed tracing**:

```text
Trace ID: TR-1001

Coordinator       300 ms
 ├─ A2A            200 ms
 ├─ Sales Worker  1,500 ms
 │   └─ Salesforce 1,200 ms
 │
 └─ IT Worker     4,000 ms
     └─ MCP        200 ms
         └─ ServiceNow 3,700 ms  ← bottleneck
```

This tells you that **MCP itself isn't necessarily slow**. The actual bottleneck could be ServiceNow.

### 🎯 Interview-ready answer

> **“Latency can be introduced at every CWD layer—API, authentication, Coordinator planning, A2A communication, Worker execution, LLM calls, RAG retrieval, MCP communication, and downstream systems such as Salesforce or ServiceNow. Since independent Workers execute in parallel, I focus on the critical path. I use distributed tracing with trace ID, workflow ID, task ID, and span IDs to break down P95 and P99 latency and identify the actual bottleneck. Then I optimize the specific slow component rather than assuming the Coordinator is responsible.”**

**Easy memory:**
**API → Coordinator → A2A → Delegator → Worker → LLM/RAG → MCP → Enterprise API → Aggregate.**
