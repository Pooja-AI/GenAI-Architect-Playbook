In your **CWD architecture**, the Agent/Delegator/Worker Registry should be treated as a **central, durable configuration/metadata store**, not as something maintained inside the LLM or LangGraph state.

### Recommended CWD design

```text
                    ┌─────────────────────┐
                    │   Agent Registry    │
                    │                     │
                    │ Coordinator         │
                    │ Sales Delegator     │
                    │ IT Delegator        │
                    │ Manufacturing       │
                    │ Workers             │
                    │ Capabilities        │
                    │ Policies            │
                    └──────────┬──────────┘
                               │
                               ↓
                         Coordinator
                               │
                    ┌──────────┴──────────┐
                    ↓                     ↓
             SalesDelegator          ITDelegator
                    ↓                     ↓
                 Workers               Workers
```

For **your CWD implementation**, you can describe the registry as a **central Agent Registry service backed by a durable database**, with the exact database depending on the deployment.

For example:

```python
AGENT_REGISTRY = {
    "SalesDelegator": {
        "type": "delegator",
        "domain": "Sales",
        "intents": ["CustomerBriefing", "ContractAnalysis"],
        "capabilities": [
            "customer_profile",
            "customer_contract"
        ],
        "endpoint": "internal-service-endpoint",
        "status": "active"
    },

    "ITDelegator": {
        "type": "delegator",
        "domain": "IT",
        "intents": ["ITSupport", "IncidentAnalysis"],
        "capabilities": [
            "incident_history",
            "service_requests"
        ],
        "status": "active"
    }
}
```

### What does the registry store?

Typically:

| Metadata                | Example                              |
| ----------------------- | ------------------------------------ |
| Agent ID                | `sales-delegator-v1`                 |
| Agent type              | `Delegator`                          |
| Domain                  | Sales                                |
| Supported intents       | CustomerBriefing                     |
| Capabilities            | Customer profile, contracts          |
| Endpoint/service        | Internal service address             |
| Version                 | `v1`                                 |
| Status                  | Active                               |
| Authentication metadata | Identity/service principal reference |
| Allowed tools           | Salesforce, ServiceNow               |
| Health status           | Healthy                              |
| Policy metadata         | Mandatory/optional capabilities      |

### Registry vs LangGraph state

This distinction is **very important for your interview**:

**Agent Registry**

> "What agents exist and what can they do?"

**LangGraph State**

> "What is happening in this particular request?"

For example:

```text
Agent Registry:
SalesDelegator → CustomerBriefing → CustomerProfileWorker

LangGraph State for REQ-123:
SalesDelegator → RUNNING
CustomerProfileWorker → SUCCESS
SupportHistoryWorker → FAILED
```

The registry is relatively stable metadata.

The LangGraph state is **runtime execution state**.

### Azure example

Since your CWD is Azure-based, you could implement the registry using something like:

```text
Agent Registry API
       ↓
Cosmos DB / Azure SQL
       ↓
Agent metadata
Delegator metadata
Worker metadata
Capability mappings
Version information
Policies
```

You could expose it through an internal Registry API so the Coordinator doesn't directly manipulate the database.

### One important correction for interviews

Don't say:

> "The LLM maintains the Agent Registry."

❌ Incorrect.

Don't say:

> "LangGraph stores the Agent Registry."

❌ Not its primary responsibility.

Say:

> **"The Agent Registry is a centralized, durable metadata store containing registered Coordinators, Delegators, Workers, capabilities, versions, endpoints, and policies. The Coordinator queries the registry during planning and routing, while LangGraph manages the runtime workflow state."**

### One-line answer to memorize

> **"The Agent Registry is stored centrally as durable agent metadata; the Coordinator reads it for discovery and routing, while LangGraph maintains the runtime execution state."**
