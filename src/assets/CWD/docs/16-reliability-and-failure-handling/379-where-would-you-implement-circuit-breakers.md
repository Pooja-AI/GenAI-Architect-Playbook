## Where would you implement circuit breakers in CWD?

I would implement **circuit breakers at dependency boundaries**, especially where CWD calls external or independently failing services.

### Main places in CWD

```text id="8q6s4h"
Coordinator
    ↓ A2A
Delegator
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
┌─────────────────────────────┐
│ Circuit Breaker             │
│                             │
│ Salesforce                  │
│ ServiceNow                  │
│ SharePoint                  │
│ External APIs               │
└─────────────────────────────┘
```

### 1. MCP → Salesforce

For example, Customer Worker calls Salesforce:

```text id="x2k8mw"
Customer Worker
      ↓
MCP Client
      ↓
Circuit Breaker
      ↓
MCP Server
      ↓
Salesforce
```

If Salesforce repeatedly returns `503` or times out, the circuit opens.

---

### 2. MCP → ServiceNow

For Incident Worker:

```text id="m8v7xk"
Incident Worker
      ↓
MCP Client
      ↓
Circuit Breaker
      ↓
MCP Server
      ↓
ServiceNow
```

This prevents repeated calls when ServiceNow is unavailable.

---

### 3. Worker → LLM

You can also use a circuit breaker around **LLM/model-provider calls** when repeated timeouts or service errors occur.

```text id="4xq2za"
Worker
  ↓
LLM Client
  ↓
Circuit Breaker
  ↓
Azure OpenAI / Bedrock
```

For rate limits like `429`, the primary response is usually **backoff and respecting `Retry-After`**; a circuit breaker can be useful if the dependency remains unhealthy.

---

### 4. Worker → RAG/Search dependency

For example:

```text id="q3f1bz"
Worker
  ↓
RAG
  ↓
Circuit Breaker
  ↓
Azure AI Search
```

If the search service repeatedly fails, the Worker can fail safely or use an approved fallback rather than continuously hammering the search service.

---

### Where I would NOT normally put it

I would **not put one giant circuit breaker around the entire CWD workflow**:

```text
❌ Coordinator
      ↓
   One global circuit breaker
      ↓
Everything
```

That would make one unhealthy dependency potentially affect unrelated capabilities.

Instead, I prefer **dependency-specific circuit breakers**:

```text
Salesforce   → CB-Salesforce
ServiceNow   → CB-ServiceNow
Azure OpenAI → CB-LLM
AI Search    → CB-Search
```

This provides **failure isolation**.

### Interview-ready answer

> **“I implement circuit breakers at dependency boundaries, not around the entire CWD workflow. For example, I would have separate circuit breakers for MCP calls to Salesforce and ServiceNow, and potentially for LLM and search dependencies. If one dependency repeatedly fails, its circuit opens while other Workers and capabilities continue operating normally. This provides failure isolation and prevents cascading failures.”**

### Strong interview line

> **“Circuit breakers should be dependency-specific so that one failing downstream system doesn't bring down the entire multi-agent workflow.”**

### Easy memory

**Put circuit breakers where CWD crosses a dependency boundary.**

**Worker → MCP → External System = Circuit Breaker boundary.**
