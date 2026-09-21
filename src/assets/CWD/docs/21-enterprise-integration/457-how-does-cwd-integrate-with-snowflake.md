## How does CWD integrate with Snowflake?

In CWD, **Workers should not directly connect to Snowflake**. The Worker uses an **MCP Client** to invoke approved data-access tools exposed by a **Snowflake MCP Server**.

### CWD flow

```text
User
  ↓
Coordinator
  ↓ A2A
Relevant Delegator
  ↓
Data / Analytics Worker
  ↓ MCP Client
Snowflake MCP Server
  ↓
Snowflake
  ↓
Enterprise Data
```

For example, in a **Customer Briefing**, Snowflake might contain customer sales analytics, historical transactions, forecasts, or manufacturing metrics.

---

### 1. Coordinator identifies the requirement

Suppose the user asks:

> “Give me a briefing for customer C12345, including sales trends.”

The Coordinator creates:

```text
Intent      = Customer Briefing
customer_id = C12345
requirement = Customer Sales Analytics
```

It routes the analytics task to the appropriate Delegator.

```text
Coordinator
    ↓
Sales / Analytics Delegator
    ↓
Customer Analytics Worker
```

---

### 2. Worker calls an MCP tool

The Worker doesn't contain Snowflake connection logic.

It calls an approved MCP tool:

```python
result = await mcp_client.call_tool(
    "get_customer_sales_metrics",
    {
        "customer_id": "C12345",
        "period": "last_12_months"
    }
)
```

The Worker is asking for a **business capability**, not constructing a raw database connection.

---

### 3. Snowflake MCP Server handles the database access

The MCP Server performs the controlled integration:

```text
MCP Request
     ↓
Validate parameters
     ↓
Authenticate workload
     ↓
Authorize operation
     ↓
Validate allowed query/tool
     ↓
Execute Snowflake operation
     ↓
Validate/normalize result
     ↓
Return structured response
```

For example:

```json
{
  "customer_id": "C12345",
  "period": "last_12_months",
  "revenue": 12500000,
  "growth_percent": 8.4,
  "orders": 342
}
```

The MCP Server can internally use Snowflake's supported APIs/driver/query mechanisms; **that implementation detail is hidden from the Worker**.

---

## 4. Don't allow the LLM to generate unrestricted SQL

This is an important production architecture point.

I would **not** simply give the Agent unrestricted SQL access to Snowflake.

Instead, expose controlled business tools:

```text
get_customer_sales_metrics()
get_customer_revenue()
get_customer_orders()
get_customer_forecast()
get_manufacturing_metrics()
```

Then the MCP Server maps those tools to approved queries or stored procedures.

For example:

```python
async def get_customer_sales_metrics(customer_id, period):

    validate_customer_id(customer_id)
    authorize_customer_access(customer_id)

    query = """
        SELECT customer_id,
               SUM(revenue) AS revenue,
               COUNT(order_id) AS orders
        FROM customer_sales
        WHERE customer_id = ?
          AND order_date >= ?
        GROUP BY customer_id
    """

    return await snowflake.execute(query, [customer_id, start_date])
```

This gives you much stronger control than:

```python
# Avoid unrestricted agent-generated SQL
sql = llm.generate(...)
snowflake.execute(sql)
```

---

## 5. Security

For Snowflake, I would apply **least privilege and policy-based access**.

```text
User Identity
      ↓
CWD Authorization
      ↓
Worker Identity
      ↓
MCP Authorization
      ↓
Snowflake Role / Policy
      ↓
Authorized Data
```

Controls can include:

* Workload identity / OAuth
* Least-privilege Snowflake roles
* Read-only roles for analytical Workers
* Row-level access policies where required
* Masking policies for sensitive columns
* Tenant/customer authorization
* Query allowlists or controlled query templates
* Input validation
* Audit logging
* Network restrictions/private connectivity where applicable
* No credentials in prompts or Agent messages

For example, if the user is not entitled to customer `C12345`, the MCP layer should reject the request **before Snowflake data is returned**.

---

## 6. How does Snowflake fit with RAG?

Snowflake and Azure AI Search can have different roles.

### Structured analytics

```text
Worker
 ↓
MCP
 ↓
Snowflake
 ↓
SQL / structured data
```

Use this for:

* Revenue
* Orders
* Sales trends
* Forecasts
* KPIs
* Aggregations

### Unstructured knowledge

```text
Worker
 ↓
Azure AI Search
 ↓
Vector + Keyword Retrieval
 ↓
Documents
```

Use this for:

* Technical documents
* Customer presentations
* Service knowledge
* SharePoint content
* PDFs

So I wouldn't automatically put Snowflake data into the vector database.

---

## 7. Combining Snowflake with Salesforce and ServiceNow

This is where CWD becomes useful for your **Customer Briefing** example.

```text
                         Coordinator
                              |
             +----------------+----------------+
             |                |                |
             ▼                ▼                ▼
      Sales Delegator   IT Delegator    Analytics Delegator
             |                |                |
      Customer Worker    Incident Worker    Analytics Worker
             |                |                |
           MCP              MCP              MCP
             |                |                |
        Salesforce        ServiceNow       Snowflake
             |                |                |
             +----------------+----------------+
                              ↓
                         Coordinator
                              ↓
                     Validate + Aggregate
                              ↓
                       Final Briefing
```

The final response could combine:

```text
Salesforce
 → Customer profile + opportunities

ServiceNow
 → Open incidents

Snowflake
 → Revenue + sales trends + KPIs
```

The Coordinator validates that each result is successful and then synthesizes the business response.

---

## What if Snowflake is unavailable?

The Worker should **not fabricate analytics**.

```text
Analytics Worker
      ↓
MCP Server
      ↓
Snowflake
      X
   Timeout
      ↓
Retry with backoff
      ↓
Still failing?
      ↓
Structured dependency error
      ↓
Coordinator
```

For example:

```json
{
  "status": "DEPENDENCY_UNAVAILABLE",
  "source": "Snowflake",
  "retryable": true
}
```

If Snowflake analytics are optional, the Coordinator can return a partial briefing:

> Customer and ServiceNow information are available, but current sales analytics could not be retrieved from Snowflake.

---

# Interview-ready answer

> **“In CWD, we integrate with Snowflake through an MCP-based data-access layer. The Coordinator identifies when structured analytics are required and routes the task through the appropriate Delegator to an Analytics Worker. The Worker uses an MCP Client to call an approved business tool such as `get_customer_sales_metrics`, passing the customer ID and required parameters. The Snowflake MCP Server handles authentication, authorization, parameter validation, controlled query execution, and auditing before accessing Snowflake. I would avoid giving the LLM unrestricted SQL access; instead, I expose controlled, least-privilege tools or approved query templates. Snowflake remains the source of truth for structured analytical data, while Azure AI Search can serve as the retrieval layer for unstructured documents. The Worker returns structured results to the Delegator and Coordinator, where they are validated and aggregated with Salesforce, ServiceNow, or other enterprise results.”**

### Easy memory

**Coordinator → Delegator → Analytics Worker → MCP → Snowflake**

And the key interview point:

> **“Snowflake is the source of truth for structured analytics; MCP provides the governed tool boundary, and the Worker should not have unrestricted database access.”**
