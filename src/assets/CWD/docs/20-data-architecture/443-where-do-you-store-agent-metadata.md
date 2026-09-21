## Where do you store agent metadata?

In CWD, I store **Agent metadata in an Agent Registry / configuration store**, rather than keeping it inside the workflow state.

For your Azure architecture:

```text id="9q2m1x"
                Agent Registry
                     ↓
        ┌────────────┼────────────┐
        ↓            ↓            ↓
   Coordinator    Delegators    Workers
        ↓
   Load agent metadata
```

### 1. What is Agent metadata?

It describes **what an Agent is, what it can do, which tools it can use, and how it should be executed**.

For example:

```json id="4v7k2p"
{
  "agent_id": "incident_worker",
  "agent_version": "v3",
  "name": "Incident Worker",
  "description": "Retrieves customer incidents",
  "domain": "IT",
  "capabilities": [
    "get_open_incidents",
    "search_incidents"
  ],
  "allowed_tools": [
    "servicenow.get_incidents"
  ],
  "model": "approved-model",
  "prompt_version": "p5",
  "mcp_server": "servicenow-mcp",
  "timeout_seconds": 10,
  "max_tool_calls": 5,
  "status": "ACTIVE"
}
```

---

### 2. Where exactly?

For CWD, I would use an **Agent Registry backed by a durable database/configuration store**.

For example:

```text id="2n8f5c"
Agent Registry
     ↓
Cosmos DB / configuration store
```

The exact registry implementation can vary, but the important design is:

**Agent definitions are versioned, centrally managed, and durable.**

---

### 3. Why not store it in Redis?

Redis can cache agent metadata for fast lookup:

```text id="5z7k1a"
Worker needs metadata
       ↓
Redis
   ↓ HIT → use metadata
   ↓ MISS
Agent Registry
   ↓
Redis
```

But Redis shouldn't be the authoritative store.

```text id="5x2c9p"
Agent Registry → Source of truth
Redis         → Cache
```

---

### 4. What metadata do I maintain?

I typically separate it into several categories:

| Category   | Example                            |
| ---------- | ---------------------------------- |
| Identity   | `agent_id`, name, version          |
| Capability | supported tasks                    |
| Routing    | domain, intent, supported requests |
| Tools      | allowed MCP tools                  |
| Model      | model ID/version                   |
| Prompt     | prompt version                     |
| Security   | required roles/scopes              |
| Runtime    | timeout, retry, max iterations     |
| Endpoint   | A2A endpoint / service location    |
| Status     | active, disabled, deprecated       |

---

### 5. How does this work in CWD?

Suppose the user asks:

> "Give me open incidents for C12345."

The flow is:

```text id="6k1w4z"
User
 ↓
Coordinator
 ↓
Intent = customer_incidents
 ↓
Agent Registry
 ↓
Find IT / Incident capability
 ↓
IT Delegator
 ↓
Incident Worker
 ↓
Allowed MCP tool
 ↓
ServiceNow
```

The Coordinator/Delegator doesn't need to hardcode every Worker capability.

It can use the registry metadata to determine which agent supports the requested capability.

---

### 6. Versioning is important

I version:

```text id="r7t3b8"
Agent version
Prompt version
Model version
Tool configuration version
```

For example:

```text
incident_worker
    Agent version: v3
    Prompt version: p5
    Model version: m2
    Tool config: tc4
```

This is important for **rollback, debugging, audit, and evaluation**.

If production quality suddenly decreases, I can determine exactly which Agent/Prompt/Model configuration was running.

---

## 🎯 Interview-ready answer

> **“In CWD, I store Agent metadata in a centralized, durable Agent Registry backed by a configuration store such as Cosmos DB. The metadata includes the Agent ID and version, capabilities, domain, supported intents, allowed MCP tools, model and prompt versions, security scopes, runtime limits, endpoint information, and status. The Coordinator and Delegators use this registry for capability discovery and routing rather than hardcoding all Agent definitions. Redis can be used as a cache for low-latency metadata lookup, but the registry remains the source of truth. I also version Agent, prompt, model, and tool configurations so we can audit, evaluate, troubleshoot, and roll back changes.”**

### Easy memory

**Agent Registry → Identity + Capability + Tools + Model + Prompt + Security + Runtime + Version**

> **Strong interview line:**
> **“Agent metadata is configuration, not workflow state, so I keep it centrally managed, versioned, and independently deployable.”**
