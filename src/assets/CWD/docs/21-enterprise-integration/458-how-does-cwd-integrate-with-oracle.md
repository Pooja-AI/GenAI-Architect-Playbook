## How does CWD integrate with Oracle?

In CWD, **Workers do not directly connect to Oracle**. The Worker uses an **MCP Client** to call approved Oracle tools exposed through an **Oracle MCP Server**.

### CWD flow

```text
User
  ↓
Coordinator
  ↓ A2A
Relevant Delegator
  ↓
Oracle / ERP Worker
  ↓ MCP Client
Oracle MCP Server
  ↓
Oracle API / Database
  ↓
Enterprise Data
```

For example, Oracle could provide **ERP, inventory, order, financial, manufacturing, or supply-chain data** needed for a customer or manufacturing briefing.

---

### 1. Coordinator identifies the requirement

Suppose the user asks:

> **“Give me a briefing for customer C12345, including order and inventory information.”**

The Coordinator creates:

```text
Intent       = Customer Briefing
customer_id  = C12345
Requirements = Customer + Orders + Inventory
```

It routes the Oracle-related work through the appropriate Delegator:

```text
Coordinator
    ↓
Operations / ERP Delegator
    ↓
Oracle Worker
```

---

### 2. Oracle Worker calls an MCP tool

The Worker doesn't contain Oracle connection code.

For example:

```python
result = await mcp_client.call_tool(
    "get_customer_orders",
    {
        "customer_id": "C12345"
    }
)
```

Or:

```python
result = await mcp_client.call_tool(
    "get_inventory_status",
    {
        "customer_id": "C12345"
    }
)
```

The Worker is requesting a **business capability**, not directly executing arbitrary Oracle SQL.

---

### 3. Oracle MCP Server handles the integration

The MCP Server acts as the controlled integration boundary:

```text
MCP Request
    ↓
Validate parameters
    ↓
Authenticate
    ↓
Authorize tool/action
    ↓
Call Oracle API / database
    ↓
Validate response
    ↓
Normalize response
    ↓
Return structured result
```

For example:

```json
{
  "customer_id": "C12345",
  "orders": [
    {
      "order_id": "ORD10045",
      "status": "SHIPPED",
      "quantity": 500
    }
  ]
}
```

The Worker doesn't need to know whether the MCP Server internally uses an Oracle REST API, Oracle client/driver, stored procedure, or another approved integration mechanism.

---

## 4. Don't give the Agent unrestricted Oracle access

This is an important **production interview point**.

I would avoid:

```text
LLM
 ↓
Generate arbitrary SQL
 ↓
Oracle
```

Instead, expose controlled tools:

```text
get_customer_orders()
get_inventory_status()
get_product_details()
get_supply_status()
get_manufacturing_status()
```

The MCP Server maps these capabilities to approved Oracle operations.

For example:

```python
async def get_customer_orders(customer_id):

    validate_customer_id(customer_id)

    authorize_customer_access(customer_id)

    query = """
        SELECT order_id,
               customer_id,
               status,
               quantity
        FROM customer_orders
        WHERE customer_id = :customer_id
    """

    return await oracle.execute(
        query,
        {"customer_id": customer_id}
    )
```

This provides a much stronger security boundary than allowing an LLM to generate unrestricted SQL.

---

## 5. Security

The security flow should be:

```text
User
 ↓
Authentication
 ↓
CWD Authorization
 ↓
Worker Identity
 ↓
MCP Authorization
 ↓
Oracle Role / Policy
 ↓
Authorized Data
```

Important controls include:

* Least-privilege Oracle roles
* Read-only roles for read Workers
* Separate permissions for write operations
* Parameter/schema validation
* Row-level or application-level access controls where required
* Tenant/customer authorization
* Secrets stored outside prompts/code
* TLS/private connectivity where applicable
* Audit logging
* Query/tool allowlisting
* Timeouts and rate limits

For example, if the user isn't authorized to access `C12345`, the request should be rejected **before the Oracle data is returned**.

---

## 6. What about Oracle write operations?

For operations such as:

```text
create_order
update_order
create_purchase_request
update_inventory
```

I would apply stronger controls.

```text
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Authorization
 ↓
Schema Validation
 ↓
Idempotency Check
 ↓
Oracle
```

For a write operation, use an **idempotency key/transaction ID** so a retry doesn't accidentally create duplicate transactions.

For high-impact operations, you can also introduce:

```text
Worker
 ↓
Policy Check
 ↓
Human Approval
 ↓
MCP Tool
 ↓
Oracle
```

---

## 7. Oracle failure handling

Suppose Oracle times out:

```text
Oracle Worker
      ↓
MCP Server
      ↓
Oracle
      X
   Timeout
      ↓
Retry with backoff
      ↓
Still failing?
      ↓
Circuit Breaker
      ↓
Structured Error
      ↓
Coordinator
```

The Worker can return:

```json
{
  "status": "DEPENDENCY_UNAVAILABLE",
  "source": "Oracle",
  "retryable": true
}
```

The Coordinator then decides whether the Oracle result is critical.

If it's optional:

```text
Salesforce     → SUCCESS
ServiceNow     → SUCCESS
Oracle         → FAILED

→ Return partial Customer Briefing
```

If the Oracle information is mandatory, CWD can pause the workflow or escalate for recovery/HITL.

**The LLM should never invent missing Oracle data.**

---

# Oracle + Salesforce + ServiceNow + Snowflake

This is a strong way to explain your CWD architecture in an interview:

```text
                           Coordinator
                                |
              +-----------------+----------------+
              |                 |                |
              ▼                 ▼                ▼
       Sales Delegator    IT Delegator    Operations Delegator
              |                 |                |
       Customer Worker     Incident Worker    Oracle Worker
       Opportunity Worker                       |
              |                 |                |
             MCP               MCP              MCP
              |                 |                |
         Salesforce         ServiceNow         Oracle
                                                 
                                +
                         Analytics Worker
                                |
                               MCP
                                |
                            Snowflake
                                |
              +-----------------+----------------+
                                ↓
                           Coordinator
                                ↓
                     Validate + Aggregate
                                ↓
                         Final Response
```

So each enterprise system has a **specialized integration boundary**, while CWD keeps the Agent architecture consistent.

---

# Interview-ready answer

> **“In CWD, we integrate with Oracle through an MCP-based tool layer. The Coordinator identifies when Oracle data is required and routes the task through the appropriate Delegator to an Oracle or ERP Worker. The Worker uses an MCP Client to call approved business tools such as `get_customer_orders` or `get_inventory_status`. The Oracle MCP Server handles authentication, authorization, parameter validation, controlled Oracle API or database access, response validation, and auditing. I don't give the LLM unrestricted SQL access to Oracle; I expose controlled, least-privilege business capabilities. Oracle remains the system of record for the relevant enterprise data. The Worker returns structured results to the Delegator and Coordinator, where they are validated and aggregated with results from Salesforce, ServiceNow, or Snowflake. If Oracle is unavailable, we use bounded retries and circuit breakers and return a structured failure or partial result rather than hallucinating data.”**

### Easy memory

**Coordinator → Delegator → Oracle Worker → MCP → Oracle**

And the key interview line:

> **“The Worker owns the business capability, the MCP Server owns the Oracle integration, and Oracle remains the system of record.”**
