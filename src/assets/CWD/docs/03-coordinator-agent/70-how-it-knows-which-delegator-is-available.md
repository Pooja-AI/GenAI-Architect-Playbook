In CWD, the **Coordinator does not “discover” Delegators dynamically from the LLM**. It knows which Delegators are available through a **Delegator Registry**.

### How it knows which Delegator is available

Think of the flow as:

**Coordinator → Delegator Registry → validate → select Delegator**

For example, CWD can maintain a registry like:

```python
DELEGATOR_REGISTRY = {
    "SalesDelegator": {
        "intents": [
            "CustomerBriefing",
            "ContractAnalysis"
        ],
        "capabilities": [
            "customer_profile",
            "sales_information",
            "customer_contract"
        ]
    },

    "ITDelegator": {
        "intents": [
            "ITSupport",
            "IncidentAnalysis"
        ],
        "capabilities": [
            "incident_history",
            "service_requests",
            "ticket_information"
        ]
    },

    "ManufacturingDelegator": {
        "intents": [
            "ManufacturingFailureAnalysis"
        ],
        "capabilities": [
            "failure_analysis",
            "manufacturing_data"
        ]
    }
}
```

The registry can be stored in a configuration/database/service rather than hard-coded.

### Example

User says:

> "Prepare a customer briefing for customer C123 and include recent support issues."

The Coordinator first gets:

```json
{
  "intent": "CustomerBriefing",
  "entities": {
    "customer_id": "C123"
  },
  "capabilities": [
    "customer_profile",
    "support_history"
  ]
}
```

Then Coordinator checks the registry:

```text
CustomerBriefing
       ↓
Delegator Registry
       ↓
SalesDelegator supports CustomerBriefing
       ↓
SalesDelegator selected
```

It can then pass the request to the **Sales Delegator**, which decides which Workers are required.

### But how does it know a Delegator is actually available?

This is an important **production architecture** point.

The registry tells us:

> **"This Delegator exists and supports these capabilities."**

But availability/health should be checked separately.

For example:

```text
Delegator Registry
       │
       ├── SalesDelegator
       ├── ITDelegator
       └── ManufacturingDelegator
       
Health / Service Discovery
       │
       ├── SalesDelegator → HEALTHY
       ├── ITDelegator → HEALTHY
       └── ManufacturingDelegator → UNAVAILABLE
```

Depending on the deployment, availability can be obtained through:

* Kubernetes/AKS service discovery
* service registry
* health/readiness endpoints
* load balancer/service mesh
* cloud-native service discovery
* heartbeat/health status

So there are **two different concepts**:

| Question                                          | Mechanism                          |
| ------------------------------------------------- | ---------------------------------- |
| Does this Delegator exist and support the intent? | **Delegator Registry**             |
| Is the Delegator currently healthy/available?     | **Health check/service discovery** |
| Is the user allowed to use it?                    | **Authorization/Policy**           |
| Which Workers should it execute?                  | **Delegator + Worker Registry**    |

### In your CWD architecture

A strong interview answer would be:

> **"The Coordinator knows the available Delegators through a Delegator Registry. The registry contains each Delegator's supported intents, capabilities, endpoint or service information, and metadata. After the LLM identifies the intent, the Coordinator matches the intent and required capabilities against the registry. Before execution, we also validate authorization and Delegator health. The LLM can propose a route, but the registry and deterministic policies are the source of truth."**

### Easy way to remember

**Registry answers "WHO can handle it?"**
**Health check answers "WHO is available now?"**
**Policy answers "WHO is allowed to handle it?"**
**Delegator answers "WHICH Workers should execute it?"**
