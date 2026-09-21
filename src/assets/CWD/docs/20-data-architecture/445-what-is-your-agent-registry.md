## What is your Agent Registry?

In CWD, the **Agent Registry is a centralized catalog of all Agents and their capabilities, configuration, tools, versions, and runtime policies**.

Think of it as a **database/catalog that tells the Coordinator and Delegators what Agents exist and what each Agent is allowed to do.**

```text
                    Agent Registry
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
   Coordinator      Sales Delegator    IT Delegator
                         │                │
                         ↓                ↓
                  Customer Worker    Incident Worker
```

### What does the registry contain?

For example, an `incident_worker` entry could look like:

```json
{
  "agent_id": "incident_worker",
  "agent_version": "v3",
  "name": "Incident Worker",
  "domain": "IT",
  "capabilities": [
    "get_open_incidents",
    "search_incidents"
  ],
  "allowed_tools": [
    "servicenow.get_incidents"
  ],
  "mcp_server": "servicenow-mcp",
  "model": "approved-model",
  "prompt_version": "v5",
  "required_scopes": [
    "incident.read"
  ],
  "timeout_seconds": 10,
  "max_tool_calls": 5,
  "status": "ACTIVE"
}
```

So the registry answers:

> **What is this Agent? What can it do? Which tools can it use? Which version is running? What security and runtime policies apply?**

---

## How does CWD use the Agent Registry?

Suppose the user asks:

> **"Give me the open incidents for customer C12345."**

The flow is:

```text
User
 ↓
Coordinator
 ↓
Intent = customer_incidents
 ↓
Agent Registry
 ↓
Find Agent/Capability
 ↓
IT Delegator
 ↓
Incident Worker
 ↓
MCP
 ↓
ServiceNow
```

The Coordinator or Delegator can use registry metadata to determine that the **Incident Worker** supports the required capability.

---

## Why do you need an Agent Registry?

Without a registry, you might hardcode routing:

```python
if intent == "customer_incidents":
    worker = IncidentWorker()
```

That becomes difficult when you have hundreds of Agents.

With a registry:

```text
Intent
 ↓
Capability lookup
 ↓
Agent Registry
 ↓
Eligible Agent
 ↓
Execute
```

This makes the platform more **dynamic and manageable**.

---

## What is the difference between Agent Registry and Prompt Registry?

This is a good interview question.

| Agent Registry     | Prompt Registry     |
| ------------------ | ------------------- |
| Defines the Agent  | Defines prompts     |
| Agent capabilities | Prompt content      |
| Allowed tools      | Prompt version      |
| Agent version      | Prompt parameters   |
| Security scopes    | Prompt lifecycle    |
| Runtime limits     | Evaluation/approval |

For example:

```text
Agent Registry
    ↓
incident_worker v3
    ↓
Prompt Registry
    ↓
incident_prompt v5
    ↓
Model
    ↓
MCP Tool
```

---

## What is the difference between Agent Registry and A2A Agent Card?

Another important distinction:

**Agent Registry** = internal platform catalog.

**A2A Agent Card** = discoverable description of an Agent's capabilities and communication endpoint for agent-to-agent interaction.

For CWD:

```text
Agent Registry
      ↓
Internal configuration / governance
      ↓
Agent

A2A Agent Card
      ↓
Agent identity + capabilities + endpoint
      ↓
Agent-to-Agent communication
```

They can be related, but they serve different purposes.

---

## Where do you store it?

For your Azure CWD architecture:

```text
Agent Registry
      ↓
Cosmos DB / durable configuration store
      ↓
Redis cache
```

**Cosmos DB/configuration store** → source of truth
**Redis** → optional fast cache

I would also version Agent definitions so production can safely roll back.

---

## 🎯 Interview-ready answer

> **“My Agent Registry is a centralized catalog of the Agents in CWD. It stores each Agent's identity, version, domain, capabilities, supported intents, allowed MCP tools, model and prompt versions, security scopes, runtime limits, endpoint information, and lifecycle status. The Coordinator and Delegators use this metadata for capability discovery and routing instead of hardcoding every Agent. I keep the registry in a durable configuration store such as Cosmos DB and can use Redis as a cache. I also version Agent definitions so we can audit, evaluate, and roll back changes safely.”**

### Easy memory

**Agent Registry = Who + What + Tools + Model + Prompt + Security + Runtime + Version**

> **Strong interview line:**
> **“The Agent Registry is the control plane for my Agents; the workflow state is the execution state.”**
