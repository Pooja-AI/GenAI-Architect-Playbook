## When should you use REST?

Use **REST when you need straightforward API communication between an application/service and another system or backend service**.

### In your CWD architecture

For example, the MCP Server may communicate with Salesforce through its REST API:

```text
Coordinator
    |
   A2A
    v
Delegator
    |
   A2A
    v
Worker
    |
   MCP
    v
MCP Server
    |
   REST
    v
Salesforce
```

The Worker doesn't need to directly know the Salesforce REST endpoint. The **MCP Server handles the enterprise API integration**.

### Use REST when:

1. **Calling a traditional enterprise API**

```text
Application → REST API → Salesforce
```

2. **Building backend microservices**

```text
Order Service → REST → Customer Service
```

3. **CRUD operations are straightforward**

```text
GET    /customers/C123
POST   /customers
PUT    /customers/C123
DELETE /customers/C123
```

4. **You need synchronous request/response**

```text
Request → API → Response
```

5. **The other system already exposes REST APIs**

For example, Salesforce, ServiceNow, or an internal enterprise service may provide REST endpoints.

6. **You don't need agent-level collaboration**

If the interaction is simply:

```text
Service A → API → Service B
```

you generally don't need A2A.

---

## REST vs A2A vs MCP

| Requirement                                      | Use      |
| ------------------------------------------------ | -------- |
| Agent communicates with another agent            | **A2A**  |
| Agent needs an enterprise tool                   | **MCP**  |
| Application/service calls an API                 | **REST** |
| CRUD operations against backend                  | **REST** |
| Agent delegates a business task to another agent | **A2A**  |
| Worker invokes `get_customer` tool               | **MCP**  |
| MCP Server calls Salesforce API                  | **REST** |

### Example from CWD

Suppose the Customer Worker needs customer information.

**A2A:**

```text
Sales Delegator
      |
      | "Get customer information for C123"
      v
Customer Worker
```

**MCP:**

```text
Customer Worker
      |
      | get_customer(C123)
      v
Salesforce MCP Server
```

**REST:**

```text
Salesforce MCP Server
      |
      | GET /customer/C123
      v
Salesforce API
```

So the three technologies can work **together**, not replace each other.

### 🎯 Strong interview answer

> **“I use REST for traditional API-to-service communication, especially when calling enterprise systems or microservices that expose HTTP APIs. In our CWD architecture, the MCP Server can use Salesforce or ServiceNow REST APIs internally. I use A2A for agent-to-agent collaboration and MCP for standardized agent-to-tool access. So REST handles backend API integration, MCP provides the AI-facing tool abstraction, and A2A handles agent collaboration.”**

### Easy memory trick

**A2A → Agent ↔ Agent**
**MCP → Agent ↔ Tool**
**REST → Service ↔ API**
