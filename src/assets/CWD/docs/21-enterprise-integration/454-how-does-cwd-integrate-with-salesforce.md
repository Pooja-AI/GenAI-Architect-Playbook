## How does CWD integrate with Salesforce?

In CWD, **Workers do not directly connect to Salesforce**. They access Salesforce through an **MCP Server**, which provides controlled Salesforce tools.

### CWD flow

```text
User
  ↓
Coordinator
  ↓ A2A
Sales Delegator
  ↓
Customer Worker / Opportunity Worker
  ↓ MCP Client
Salesforce MCP Server
  ↓
Salesforce API
  ↓
Customer / Opportunity Data
```

### Example: Customer Briefing

Suppose the user asks:

> “Give me a briefing for customer C12345.”

#### 1. Coordinator identifies the request

```text
Intent = Customer Briefing
customer_id = C12345
```

It routes the Salesforce-related work to the **Sales Delegator**.

#### 2. Sales Delegator selects Workers

For example:

```text
Sales Delegator
 ├── Customer Worker
 └── Opportunity Worker
```

Both Workers may receive:

```json
{
  "customer_id": "C12345"
}
```

They can execute in parallel because they are independent.

#### 3. Worker calls MCP

The Customer Worker doesn't contain Salesforce SDK/client code.

Instead:

```python
result = await mcp_client.call_tool(
    "get_customer",
    {
        "customer_id": "C12345"
    }
)
```

The Opportunity Worker might call:

```python
result = await mcp_client.call_tool(
    "get_opportunities",
    {
        "customer_id": "C12345"
    }
)
```

#### 4. MCP Server handles Salesforce integration

The MCP Server owns the actual Salesforce integration:

```text
MCP Server
   ↓
Authenticate
   ↓
Validate parameters
   ↓
Authorize tool
   ↓
Call Salesforce API
   ↓
Return structured response
```

For example:

```json
{
  "customer_id": "C12345",
  "name": "ABC Corporation",
  "industry": "Manufacturing",
  "status": "Active"
}
```

The Worker doesn't need to know whether the underlying integration uses REST APIs, Salesforce SDKs, OAuth, or another implementation.

### 5. Results return through the workflow

```text
Salesforce
   ↓
MCP Server
   ↓
MCP Client
   ↓
Customer Worker
   ↓
Sales Delegator
   ↓
Coordinator
```

The Coordinator receives results such as:

```json
{
  "customer": {...},
  "opportunities": [...]
}
```

If the IT Delegator also runs an Incident Worker:

```text
IT Delegator
    ↓
Incident Worker
    ↓ MCP
ServiceNow
```

the Coordinator can combine Salesforce + ServiceNow results into the final Customer Briefing.

### Why use MCP instead of direct Salesforce calls?

The key architectural reason is **controlled enterprise tool access**.

MCP gives you a standardized boundary for:

* Authentication and authorization
* Tool allowlisting
* Input/schema validation
* Salesforce API integration
* Timeouts and retries
* Auditing
* Rate limiting
* Error handling
* Security and access control

So your architecture is:

```text
                 CWD
                  │
          ┌───────▼───────┐
          │  Coordinator  │
          └───────┬───────┘
                  │ A2A
          ┌───────▼───────┐
          │ Sales Delegator│
          └───────┬───────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Customer Worker      Opportunity Worker
        │                   │
        └───────┬───────────┘
                │ MCP
        ┌───────▼───────────┐
        │ Salesforce MCP    │
        │ Server             │
        └───────┬───────────┘
                │
        ┌───────▼───────────┐
        │ Salesforce        │
        └───────────────────┘
```

### Interview-ready answer

> **“In CWD, we integrate with Salesforce through an MCP-based tool layer. The Coordinator identifies the customer briefing intent and routes the Salesforce-related work to the Sales Delegator. The Sales Delegator invokes Workers such as Customer Worker and Opportunity Worker. These Workers use an MCP Client to call approved Salesforce tools exposed by our Salesforce MCP Server. The MCP Server handles authentication, authorization, parameter validation, Salesforce API communication, error handling, and auditing. The Workers receive structured Salesforce results, the Delegator returns them to the Coordinator, and the Coordinator validates and aggregates them with results from other Delegators such as IT or ServiceNow before generating the final response.”**

### Easy way to remember

**Coordinator → Sales Delegator → Worker → MCP → Salesforce**

And the most important interview point:

> **“The Worker knows the business capability; the MCP Server owns the Salesforce integration.”**
