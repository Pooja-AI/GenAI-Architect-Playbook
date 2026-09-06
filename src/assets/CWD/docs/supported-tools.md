# Registration of Tools, APIs, MCP Servers, and External Capabilities in CWD

In CWD, an agent is not useful only because it can reason. It also needs access to **enterprise capabilities** such as databases, APIs, search systems, business applications, SaaS platforms, and internal services.

These integrations should be **registered, governed, discoverable, authorized, and associated with the agent that is allowed to use them**.

The core relationship is:

```text
Agent
  │
  ├── Capabilities
  │
  └── Supported Integrations
          │
          ├── Tools
          ├── APIs
          ├── MCP Servers
          └── External Services
```

The important distinction is:

> **Agent Registry answers “what can this agent do?” while integration/tool registration answers “what external capabilities can this agent use to perform that work?”**

---

# 1. Overall Architecture

A production CWD architecture can look like this:

```text
                         Agent Registry
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
           Agent          Capabilities      Integrations
             │                │                │
             │                │          ┌─────┼─────┐
             │                │          ▼     ▼     ▼
             │                │        Tools  APIs  MCP
             │                │                    Servers
             │                │
             └────────────────┼────────────────────┘
                              │
                              ▼
                         Agent Runtime
                              │
                              ▼
                           Worker
                              │
                              ▼
                         MCP Client
                              │
                              ▼
                         MCP Server
                              │
                              ▼
                     Enterprise System
```

For example:

```text
Shipping Agent
      │
      ├── shipment_tracking
      ├── delay_analysis
      └── rerouting
              │
              ▼
        Supported Tools
              │
              ├── get_tracking_events
              ├── get_carrier_status
              └── get_route_constraints
              │
              ▼
          MCP Server
              │
              ▼
       Shipping Enterprise API
```

---

# 2. Four Different Things Must Be Distinguished

These concepts are related but not identical.

| Concept                 | Meaning                                                 |
| ----------------------- | ------------------------------------------------------- |
| **Tool**                | Specific callable operation                             |
| **API**                 | Interface exposed by an application/service             |
| **MCP Server**          | Standardized server exposing tools/resources/prompts    |
| **External capability** | Business/technical function available outside the agent |

For example:

```text
External capability
    │
    ▼
Shipping API
    │
    ▼
MCP Server
    │
    ├── get_tracking_events
    ├── get_carrier_status
    └── get_route_constraints
```

The Worker doesn't need to understand the internal REST implementation if the MCP server provides a standardized interface.

---

# 3. Tool Registration

A tool represents a specific executable operation.

For example:

```text
get_tracking_events
```

A registry can maintain metadata such as:

```json id="y6zv9m"
{
  "tool_id": "get_tracking_events",
  "name": "Get Shipment Tracking Events",
  "description": "Retrieve shipment tracking events",
  "domain": "logistics",
  "input_schema": {
    "type": "object",
    "properties": {
      "shipment_id": {
        "type": "string"
      }
    },
    "required": ["shipment_id"]
  },
  "output_schema": {
    "type": "object"
  },
  "risk": "low",
  "status": "active"
}
```

The metadata tells the platform:

```text
What is the tool?
What inputs does it accept?
What does it return?
What domain does it belong to?
Is it active?
What risk level does it have?
```

---

# 4. API Registration

An enterprise API can also be registered.

For example:

```text
Shipping Management API
```

Metadata could be:

```json id="5n4xqp"
{
  "api_id": "shipping-management-api",
  "name": "Shipping Management API",
  "base_path": "/shipping",
  "version": "v2",
  "domain": "logistics",
  "owner": "Supply Chain IT",
  "authentication": "Entra ID",
  "status": "active"
}
```

However, **the raw API endpoint should not automatically be exposed directly to an LLM**.

Instead:

```text
LLM
 │
 ▼
Worker
 │
 ▼
Governed Tool
 │
 ▼
API Adapter / MCP
 │
 ▼
Enterprise API
```

This gives the platform control over authorization, validation, rate limits, auditing, and data exposure.

---

# 5. MCP Server Registration

An MCP server is registered as an integration endpoint.

Example:

```json id="bjq3sv"
{
  "mcp_server_id": "shipping-mcp",
  "name": "Shipping MCP Server",
  "version": "1.3.0",
  "domain": "logistics",
  "transport": "streamable-http",
  "endpoint": "https://shipping-mcp.company.com/mcp",
  "owner": "Supply Chain AI",
  "status": "healthy"
}
```

The registry can associate the server with an agent:

```text
Shipping Agent
      │
      ▼
shipping-mcp
      │
      ├── get_tracking_events
      ├── get_carrier_status
      └── get_route_constraints
```

The MCP server then exposes those capabilities according to the MCP contract.

---

# 6. External Capability Registration

An external capability is the business function the integration provides.

For example:

```text
Capability:
shipment_tracking
```

It could be implemented through:

```text
shipment_tracking
       │
       └── get_tracking_events
              │
              └── Shipping API
```

Another capability:

```text
delay_analysis
       │
       ├── get_tracking_events
       ├── get_carrier_status
       └── analyze_delay
```

Therefore there is a hierarchy:

```text
Business Capability
       │
       ▼
Agent Capability
       │
       ▼
Worker
       │
       ▼
Tool
       │
       ▼
MCP Server / API
       │
       ▼
Enterprise System
```

---

# 7. The Agent Registry Relationship

The Agent Registry can maintain relationships between agents and integrations.

Example:

```json id="6jhj0y"
{
  "agent_id": "shipping-agent",

  "capabilities": [
    "shipment_tracking",
    "delay_analysis",
    "rerouting"
  ],

  "integrations": [
    {
      "type": "mcp_server",
      "id": "shipping-mcp",
      "allowed_tools": [
        "get_tracking_events",
        "get_carrier_status",
        "get_route_constraints"
      ]
    }
  ]
}
```

This tells CWD:

> Shipping Agent is allowed to use these specific capabilities from this MCP server.

---

# 8. Why Agent-to-Integration Mapping Is Important

Without explicit registration:

```text
Agent
  │
  └── Can call anything
```

This is dangerous.

A production architecture should instead have:

```text
Agent
  │
  ▼
Registered Integrations
  │
  ▼
Approved Tools
  │
  ▼
Policy
  │
  ▼
Execution
```

For example:

```text
Shipping Agent
    │
    ├── get_tracking_events       ✅
    ├── get_carrier_status        ✅
    ├── payment_approval          ❌
    └── execute_any_sql           ❌
```

This implements **least privilege**.

---

# 9. Registration Lifecycle

The registration process can be:

```text
Integration Development
        │
        ▼
Security Review
        │
        ▼
Tool/API/MCP Definition
        │
        ▼
Schema Validation
        │
        ▼
Ownership Assignment
        │
        ▼
Policy Assignment
        │
        ▼
Registry Registration
        │
        ▼
Health Validation
        │
        ▼
Available for Discovery
```

Only approved integrations should become available to production agents.

---

# 10. Example Registration Flow

Suppose the enterprise wants to expose:

```text
Shipment Tracking API
```

through MCP.

### Step 1 — Create MCP server

```text
shipping-mcp
```

### Step 2 — Define tools

```text
get_tracking_events
get_carrier_status
get_route_constraints
```

### Step 3 — Register server

```text
Agent Registry
      │
      ▼
shipping-mcp
```

### Step 4 — Register tools

```text
shipping-mcp
      │
      ├── get_tracking_events
      ├── get_carrier_status
      └── get_route_constraints
```

### Step 5 — Associate with agent

```text
Shipping Agent
      │
      ▼
shipping-mcp
```

### Step 6 — Apply policy

```text
Shipping Agent
      │
      ├── get_tracking_events       ALLOW
      ├── get_carrier_status        ALLOW
      └── get_route_constraints     ALLOW
```

### Step 7 — Runtime execution

```text
Worker
  │
  ▼
MCP Client
  │
  ▼
Shipping MCP Server
  │
  ▼
Shipping API
```

---

# 11. Tool Discovery vs Tool Registration

These should be distinguished.

### Registration

The enterprise platform says:

```text
This tool is approved and available.
```

### Discovery

At runtime, the Worker/MCP client asks:

```text
What tools does this MCP server expose?
```

For MCP specifically, servers expose tools through the protocol's tool discovery mechanism.

Conceptually:

```text
MCP Client
    │
    │ tools/list
    ▼
MCP Server
    │
    ▼
Available Tools
```

The result could contain:

```text
get_tracking_events
get_carrier_status
get_route_constraints
```

But:

> **Discovery does not mean the caller is authorized to use every discovered tool.**

Authorization remains a separate control.

---

# 12. Registry vs MCP Discovery

This is an important architectural distinction.

### Agent Registry

Answers:

> **Which MCP server/integration should this agent use?**

```text
Agent Registry
      │
      ▼
shipping-mcp
```

### MCP

Answers:

> **What tools/resources does this MCP server expose?**

```text
shipping-mcp
      │
      ├── get_tracking_events
      ├── get_carrier_status
      └── get_route_constraints
```

So:

```text
Agent Registry
     ↓
Integration Discovery

MCP
     ↓
Tool/Resource Discovery
```

---

# 13. API Adapter Pattern

An MCP server does not necessarily implement business logic directly.

A good architecture is:

```text
MCP Tool
   │
   ▼
MCP Handler
   │
   ▼
Business Adapter
   │
   ▼
Enterprise API
```

Example:

```python id="p4pp7f"
class ShippingApiAdapter:

    def get_tracking_events(self, shipment_id):
        return shipping_api.get(
            f"/shipments/{shipment_id}/events"
        )
```

Then:

```python id="4qflqm"
class ShippingMcpServer:

    def get_tracking_events(self, shipment_id):

        validate(shipment_id)

        authorize(
            capability="shipment_tracking"
        )

        result = adapter.get_tracking_events(
            shipment_id
        )

        return sanitize(result)
```

The Worker never needs to know the internal API implementation.

---

# 14. Registration Metadata

A production integration registry might contain:

```json id="i6v4cm"
{
  "integration_id": "shipping-mcp",
  "type": "mcp_server",

  "name": "Shipping MCP Server",

  "owner": {
    "team": "Supply Chain AI"
  },

  "domain": "logistics",

  "version": "1.3.0",

  "endpoint": "https://shipping-mcp.company.com/mcp",

  "transport": "streamable-http",

  "status": "healthy",

  "tools": [
    {
      "name": "get_tracking_events",
      "risk": "low"
    },
    {
      "name": "get_carrier_status",
      "risk": "low"
    }
  ],

  "allowed_agents": [
    "shipping-agent",
    "supply-chain-agent"
  ]
}
```

---

# 15. Security Metadata

Integration registration should also contain governance information.

For example:

```json id="v3lq2r"
{
  "tool_id": "get_tracking_events",

  "security": {
    "authentication": "managed_identity",
    "authorization": "rbac",
    "data_classification": "internal",
    "allowed_domains": [
      "logistics"
    ],
    "rate_limit": 100,
    "requires_human_approval": false
  }
}
```

For high-risk operations:

```json id="q5m5ja"
{
  "tool_id": "reroute_shipment",

  "security": {
    "risk": "high",
    "requires_human_approval": true
  }
}
```

This integrates naturally with the CWD **Policy + HITL + MCP** architecture.

---

# 16. Runtime Selection

Suppose the Worker needs shipment tracking.

The execution flow is:

```text
Worker
  │
  │ Required capability:
  │ shipment_tracking
  ▼
Integration Registry
  │
  ▼
Approved MCP Server
  │
  ▼
Tool Discovery
  │
  ▼
get_tracking_events
  │
  ▼
Policy Check
  │
  ▼
MCP tools/call
  │
  ▼
Enterprise API
```

The LLM doesn't directly choose an arbitrary URL.

---

# 17. How This Works With CWD

The complete CWD architecture becomes:

```text
                         Coordinator
                              │
                              ▼
                         Delegator
                              │
                              ▼
                           Worker
                              │
                     ┌────────┴────────┐
                     │                 │
                     ▼                 ▼
               Agent Registry       Policy
                     │
                     ▼
             Approved Integration
                     │
              ┌──────┴──────┐
              ▼             ▼
          MCP Server       API
              │             │
              ▼             ▼
           Tools       Enterprise Service
```

The Worker remains responsible for executing the specialized task.

---

# 18. LangGraph's Role

LangGraph does **not** replace integration registration.

It controls the workflow.

For example:

```text
Receive Task
     │
     ▼
Determine Required Capability
     │
     ▼
Discover Integration
     │
     ▼
Policy Check
     │
     ▼
Invoke Tool
     │
     ▼
Validate Result
     │
     ▼
Continue / Retry / Recover
```

LangGraph manages these transitions.

The registry tells it which integrations exist.

MCP defines the standardized tool interaction.

---

# 19. Service Bus's Role

If execution is asynchronous:

```text
Worker
   │
   ▼
Service Bus
   │
   ▼
Integration Worker
   │
   ▼
MCP
```

Service Bus handles:

* message delivery
* buffering
* redelivery
* dead-lettering
* asynchronous communication

It does **not** replace the integration registry or MCP.

---

# 20. Complete Responsibility Separation

This is the architecture you want to remember:

| Component                | Responsibility                                           |
| ------------------------ | -------------------------------------------------------- |
| **Agent Registry**       | Register/discover agents and their approved integrations |
| **Integration Registry** | Register APIs, MCP servers, tools, resources             |
| **Policy/IAM**           | Decide whether access is permitted                       |
| **Coordinator**          | Enterprise-level planning                                |
| **Delegator**            | Domain-level task decomposition                          |
| **Worker**               | Execute specialized task                                 |
| **LangGraph**            | Workflow state, routing, retry, recovery                 |
| **MCP Client**           | Connect Worker/agent to MCP server                       |
| **MCP Server**           | Expose governed tools/resources                          |
| **API Adapter**          | Translate standardized operation to enterprise API       |
| **Service Bus**          | Asynchronous transport                                   |
| **Enterprise System**    | Actual business data/function                            |

---

# 21. Agent Integration Registry Model

A useful conceptual model is:

```text
                    Agent Registry
                         │
                         ▼
                       Agent
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        Capabilities            Integrations
             │                       │
             │              ┌────────┼─────────┐
             │              ▼        ▼         ▼
             │            Tools     APIs     MCP Servers
             │                       │         │
             │                       │         ▼
             │                       │       Tools
             │                       │
             └───────────────────────┘
                         │
                         ▼
                     Workers
                         │
                         ▼
                 Enterprise Systems
```

---

# 22. Example: Shipping Agent

Suppose:

```text
Agent:
shipping-agent
```

Business capabilities:

```text
shipment_tracking
delay_analysis
rerouting_recommendation
```

Registered integrations:

```text
MCP:
shipping-mcp

Tools:
 ├── get_tracking_events
 ├── get_carrier_status
 ├── get_route_constraints
 └── submit_reroute_request
```

Mapping:

```text
shipping-agent
      │
      ├── shipment_tracking
      │       └── get_tracking_events
      │
      ├── delay_analysis
      │       ├── get_tracking_events
      │       └── get_carrier_status
      │
      └── rerouting_recommendation
              ├── get_route_constraints
              └── submit_reroute_request
```

Notice the distinction:

```text
Business Capability
        ↓
Agent Capability
        ↓
Worker Task
        ↓
MCP Tool
        ↓
Enterprise API
```

---

# 23. High-Risk Tool Example

Suppose:

```text
submit_reroute_request
```

actually changes a shipment.

The registration can classify it:

```json id="wnx8te"
{
  "tool_id": "submit_reroute_request",
  "risk": "high",
  "side_effect": true,
  "requires_approval": true
}
```

Then the runtime flow becomes:

```text
Worker
  │
  ▼
Tool selected
  │
  ▼
Risk Check
  │
  ▼
High Risk
  │
  ▼
Human Approval
  │
  ▼
Policy Authorization
  │
  ▼
MCP Tool
  │
  ▼
Enterprise API
```

This is much safer than allowing the LLM to execute the operation directly.

---

# 24. What Should NOT Be Registered as a Generic Capability?

Avoid unrestricted tools such as:

```text
execute_any_sql
execute_any_shell
call_any_url
run_any_code
```

Instead expose bounded business operations:

```text
get_customer_order
get_invoice_status
get_shipment_events
get_inventory_level
create_support_ticket
```

This provides a much stronger security boundary.

---

# 25. Registration and Intelligent Tool Selection

Just as the Agent Registry enables intelligent **agent selection**, integration metadata enables intelligent **tool selection**.

The hierarchy is:

```text
User Request
      │
      ▼
Required Business Capability
      │
      ▼
Agent Selection
      │
      ▼
Required Execution Capability
      │
      ▼
Tool Selection
      │
      ▼
MCP Server
      │
      ▼
Enterprise System
```

For example:

```text
User:
"Why is SHIP123 delayed?"

        ↓

Capability:
delay_analysis

        ↓

Agent:
shipping-agent

        ↓

Worker:
delay-analysis-worker

        ↓

Tools:
get_tracking_events
get_carrier_status

        ↓

MCP Server:
shipping-mcp

        ↓

Enterprise:
Shipping Management System
```

---

# 26. The Complete Registration Lifecycle

The entire enterprise flow can be summarized as:

```text
                 DEVELOP
                    │
                    ▼
             Define Capability
                    │
                    ▼
             Define Tool/API
                    │
                    ▼
              Define MCP Server
                    │
                    ▼
             Security / Policy
                    │
                    ▼
                 REGISTER
                    │
                    ▼
              Agent Registry
                    │
                    ▼
               DISCOVER
                    │
                    ▼
              SELECT / AUTHORIZE
                    │
                    ▼
                EXECUTE
                    │
                    ▼
                 MCP/API
                    │
                    ▼
             Enterprise System
                    │
                    ▼
                OBSERVE
                    │
                    ▼
             Audit / Monitoring
```

---

# 27. Interview-Ready Answer

> **In CWD, tools, APIs, MCP servers, and external capabilities are treated as governed integrations rather than arbitrary resources that an agent can access. Each integration is registered with metadata such as identity, type, owner, domain, endpoint, version, supported capabilities, tools, authentication mechanism, data classification, risk level, status, and allowed agents. An agent is then explicitly associated with the integrations and tools it is permitted to use. At runtime, the Worker determines the required execution capability, discovers the approved integration, validates authorization and policy, and invokes the appropriate tool through an MCP client or approved API adapter. MCP provides the standardized agent-to-tool interaction contract, while the registry provides discovery and governance, Policy/IAM provides authorization, and LangGraph controls workflow, retry, recovery, and state. This prevents unrestricted tool access and allows the enterprise to enforce least privilege, auditing, rate limits, data protection, and human approval for high-risk operations.**

## Final Definition

> **Integration registration is the governed process of defining, cataloging, associating, authorizing, and exposing the tools, APIs, MCP servers, and external capabilities that an agent is allowed to use, enabling CWD to perform secure, discoverable, policy-controlled, and auditable tool execution.**

### Core Formula

```text
Agent Integration Management
=
Integration Definition
+
Registration
+
Agent Association
+
Capability Mapping
+
Tool Discovery
+
Authorization
+
Policy
+
Secure Execution
+
Monitoring
+
Audit
```

### The mental model to remember

```text
                 AGENT
                   │
          "What can I do?"
                   │
                   ▼
             CAPABILITIES
                   │
          "What can I use?"
                   │
                   ▼
             INTEGRATIONS
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
     TOOLS        APIs       MCP
                               │
                               ▼
                          MCP SERVER
                               │
                               ▼
                       ENTERPRISE SYSTEM
```

**The key architectural principle is:**

> **Agents should never have unrestricted access to enterprise systems. Their capabilities and integrations should be explicitly registered, mapped, authorized, and governed; Workers execute the approved operation, MCP standardizes tool interaction, and enterprise systems remain behind controlled adapters and security boundaries.**
