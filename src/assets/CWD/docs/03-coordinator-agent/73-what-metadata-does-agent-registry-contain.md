For your **CWD architecture**, the Agent Registry contains the metadata needed to answer:

> **“What agents exist, what can they do, where are they, and under what conditions can I invoke them?”**

### 1. Core Agent Metadata

```python
{
    "agent_id": "sales-delegator-v1",
    "name": "SalesDelegator",
    "type": "delegator",
    "version": "1.0",
    "domain": "Sales",
    "status": "ACTIVE"
}
```

This identifies the agent and its lifecycle status.

---

### 2. Capabilities

This is especially important for **Coordinator → Delegator routing**.

```python
"capabilities": [
    "customer_profile",
    "customer_contract",
    "sales_information",
    "customer_briefing"
]
```

The Coordinator can compare the user's required capabilities against this metadata.

---

### 3. Supported Intents

```python
"supported_intents": [
    "CustomerBriefing",
    "ContractAnalysis"
]
```

For example:

```text
CustomerBriefing
       ↓
SalesDelegator
```

---

### 4. Endpoint / Service Information

The registry needs to know **how to reach the agent**.

```python
"endpoint": "internal://sales-delegator",
"protocol": "A2A",
"health_endpoint": "/health"
```

In your architecture, A2A can be used for **Coordinator/Delegator or Delegator/Delegator communication**, while MCP is used for **agent → tool** communication.

---

### 5. Tools / Workers Available

A Delegator can have metadata about the Workers it can invoke:

```python
"workers": [
    "CustomerProfileWorker",
    "SupportHistoryWorker",
    "ContractWorker"
]
```

And potentially the capabilities/tools associated with them.

```text
SalesDelegator
 ├── CustomerProfileWorker → Salesforce
 ├── SupportHistoryWorker  → ServiceNow
 └── ContractWorker        → Contract System
```

---

### 6. Security & Authorization Metadata

For an enterprise platform, the registry can contain references to access policies:

```python
"security": {
    "required_role": "SalesUser",
    "allowed_scopes": [
        "customer.read"
    ]
}
```

The registry should **not store secrets**. Secrets belong in something like **Azure Key Vault**.

---

### 7. Operational Metadata

Useful for production routing and reliability:

```python
"operational": {
    "timeout_seconds": 15,
    "max_retries": 3,
    "priority": "normal",
    "max_concurrency": 20
}
```

This helps the Delegator/Coordinator apply execution policies.

---

### 8. Version & Lifecycle Metadata

```python
"version": "1.2.0",
"environment": "production",
"registered_at": "...",
"last_updated": "...",
"status": "ACTIVE"
```

This supports versioning, rollout, retirement, and governance.

---

### 9. Observability Metadata

You can also associate telemetry information:

```python
"observability": {
    "service_name": "sales-delegator",
    "trace_enabled": True,
    "metrics_enabled": True
}
```

This helps correlate:

```text
Request
 ↓
Coordinator
 ↓
SalesDelegator
 ↓
CustomerProfileWorker
 ↓
Salesforce
```

using correlation/trace IDs.

---

## Complete simplified example

```python
AGENT_REGISTRY = {
    "SalesDelegator": {
        "agent_id": "sales-delegator-v1",
        "type": "delegator",
        "domain": "Sales",
        "version": "1.0",

        "supported_intents": [
            "CustomerBriefing",
            "ContractAnalysis"
        ],

        "capabilities": [
            "customer_profile",
            "customer_contract",
            "sales_information"
        ],

        "workers": [
            "CustomerProfileWorker",
            "SupportHistoryWorker",
            "ContractWorker"
        ],

        "endpoint": "internal://sales-delegator",
        "protocol": "A2A",

        "security": {
            "required_scopes": ["customer.read"]
        },

        "operational": {
            "timeout_seconds": 15,
            "max_retries": 3
        },

        "status": "ACTIVE"
    }
}
```

### The easiest way to remember

Think of Agent Registry metadata as:

**IDENTITY + CAPABILITY + ROUTING + SECURITY + OPERATIONS + VERSION**

| Category       | Answers                             |
| -------------- | ----------------------------------- |
| Identity       | **Who are you?**                    |
| Domain         | **What business area?**             |
| Intent         | **What requests can you handle?**   |
| Capability     | **What can you do?**                |
| Workers/Tools  | **What can you invoke?**            |
| Endpoint       | **Where/how do I reach you?**       |
| Security       | **Who is allowed to use you?**      |
| Operations     | **How should I execute you?**       |
| Version/Status | **Which version and is it active?** |

### 🎯 Interview answer

> **“The Agent Registry contains the metadata required for agent discovery, routing, governance, and execution. In CWD, that includes agent ID, type, domain, supported intents, capabilities, available Workers, endpoint and protocol information, version and lifecycle status, security policy references, and operational metadata such as timeout and retry configuration. The Coordinator uses this registry during planning to determine which Delegator can handle the request, while secrets are kept separately in Key Vault.”**

**One line to memorize:**

> **“The Agent Registry is the source of truth for what agents exist, what they can do, how to reach them, and what policies govern their execution.”**
