# Worker Tool Discovery and Invocation in CWD

A Worker should not access enterprise systems arbitrarily. It must discover the tools required for its assigned capability, verify that those tools are authorized, validate the task inputs, execute through a governed interface such as MCP, and return a controlled result to the Delegator.

> Worker = Capability + Authorized Tool + Validated Inputs + Governed Execution + Structured Result

The key principle is:

> The LLM may recommend a tool, but the Worker runtime and policy controls decide whether that tool can be invoked.

## 1. Where MCP Fits in the CWD Architecture

MCP is used at the Worker-to-tool boundary. It provides a standardized way for a Worker or agent runtime to discover and invoke approved tools.

```text
User Request
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server / Governed Tool Adapter
    ↓
Enterprise System
```

### Example

```text
Revenue Worker
    ↓
MCP Client
    ↓
Revenue MCP Server
    ↓
Approved Snowflake Tool
    ↓
Snowflake
```

The MCP server acts as a controlled integration boundary. It should not be treated as a mechanism for bypassing authorization or granting unrestricted database access.

## 2. Tool Discovery

The Worker first identifies the capability required by its assigned task.

For example:

```text
Task:
    Calculate customer revenue growth

Required capability:
    calculate_revenue_growth

Possible tools:
    - retrieve_customer_revenue
    - calculate_revenue_growth
```

The Worker may discover available tools through:

* MCP tool listing
* Agent Registry capability metadata
* Tool Registry
* Domain-specific configuration
* Governed tool catalogs
* Static capability mappings

### MCP discovery flow

```text
Worker
    ↓
Connect to approved MCP server
    ↓
List available tools
    ↓
Read tool names and descriptions
    ↓
Read input schemas
    ↓
Filter tools by Worker capability
    ↓
Select an authorized tool
```

A discovered tool is not automatically an authorized tool. Discovery only tells the Worker what the tool can do.

## 3. Tool Metadata

Each enterprise tool should expose sufficient metadata for safe selection.

| Metadata | Purpose |
| --- | --- |
| Tool name | Unique identifier |
| Description | Explains the capability |
| Input schema | Defines accepted parameters |
| Output schema | Defines expected response |
| Owning domain | Identifies business ownership |
| Required permissions | Defines access requirements |
| Data classification | Identifies sensitivity |
| Allowed operations | Read, write, update, or execute |
| Risk level | Supports additional controls |
| Timeout | Limits execution duration |
| Version | Supports compatibility |
| Availability | Indicates whether the tool is operational |

### Example tool definition

```json
{
  "name": "retrieve_customer_revenue",
  "description": "Retrieve authorized quarterly revenue for a customer",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customer_id": {
        "type": "string"
      },
      "quarters": {
        "type": "integer",
        "minimum": 1,
        "maximum": 8
      }
    },
    "required": ["customer_id", "quarters"]
  }
}
```

The Worker uses this metadata to understand how to invoke the tool safely.

## 4. Tool Authorization

Before invocation, the Worker must verify that the requested tool is permitted.

Authorization should consider:

* User identity
* User role and entitlements
* Agent identity
* Worker capability
* Domain ownership
* Tool permissions
* Data classification
* Requested operation
* Environment
* Policy restrictions
* Approval requirements

### Authorization flow

```text
Tool discovered
    ↓
Check Worker capability
    ↓
Check agent identity
    ↓
Check user entitlement
    ↓
Check data-access permission
    ↓
Check operation risk
    ↓
Policy decision
    ↓
ALLOW / DENY / REDACT / REQUIRE_APPROVAL
```

### Example

A Worker may be authorized to:

```text
Read customer revenue
```

but not authorized to:

```text
Update customer credit limit
Delete customer records
Export restricted financial data
```

The Worker must not assume that read permission implies write permission.

## 5. Input Validation

Before calling an MCP tool, the Worker validates the input against the tool's schema and business rules.

### Validation includes

* Required fields
* Data types
* String formats
* Allowed values
* Numeric ranges
* Date ranges
* Entity identifiers
* Maximum result size
* Query complexity
* Business constraints
* Authorization scope

### Example

```json
{
  "customer_id": "CUST-1001",
  "quarters": 4
}
```

The Worker should reject:

```json
{
  "customer_id": "",
  "quarters": 1000
}
```

It should also reject an otherwise valid request if the customer is outside the user's permitted access scope.

## 6. Execution Policy Enforcement

Tool invocation must be governed by execution policies.

### Common policies

| Policy | Example |
| --- | --- |
| Tool allowlist | Worker can use only approved revenue tools |
| Data minimization | Retrieve only required customer fields |
| Read/write restriction | Worker is read-only |
| Rate limit | Maximum API calls per minute |
| Timeout | Tool must respond within 30 seconds |
| Result limit | Maximum 500 records per request |
| Approval policy | Financial updates require approval |
| Environment policy | Production writes require additional controls |
| Audit policy | Every invocation must be logged |
| Secret policy | Credentials cannot be passed through prompts |

### Example

```text
Worker requests:
    update_customer_credit_limit

Policy:
    Worker is read-only

Decision:
    DENY
```

The Worker should return a controlled authorization failure to the Delegator.

## 7. Tool Invocation Through MCP

Once the tool is authorized and inputs are validated, the Worker invokes it through the MCP client.

### Conceptual flow

```text
Worker
    ↓
Build validated tool arguments
    ↓
MCP client
    ↓
Approved MCP server
    ↓
Tool execution
    ↓
Enterprise system
    ↓
MCP response
    ↓
Worker validation
```

### Example

```python
async def execute_revenue_task(task):
    validate_task(task)
    authorize_tool("retrieve_customer_revenue", task)

    arguments = {
        "customer_id": task.customer_id,
        "quarters": task.quarters
    }

    result = await mcp_client.call_tool(
        "retrieve_customer_revenue",
        arguments
    )

    validate_tool_result(result)

    return result
```

This is a conceptual implementation. The actual MCP client, server, authentication, and policy interfaces depend on the production CWD contracts.

## 8. MCP Does Not Replace Security

MCP standardizes tool interaction; it does not automatically provide enterprise authorization.

Security must still be enforced through:

* Entra ID or managed identity
* Token validation
* RBAC and entitlement checks
* Policy services
* Tool-level permissions
* Source-system authorization
* Network controls
* Private endpoints
* Secret management
* Audit logging

### Defense-in-depth model

```text
Gateway authorization
        ↓
Coordinator policy checks
        ↓
Delegator domain authorization
        ↓
Worker task authorization
        ↓
MCP tool authorization
        ↓
Enterprise system authorization
```

Multiple checks are intentional because a failure at one layer should not automatically expose enterprise data.

## 9. Data Retrieval Through Governed Tools

The Worker should retrieve data through approved adapters rather than constructing unrestricted access requests.

### Example

```text
Revenue Worker
    ↓
MCP tool: retrieve_customer_revenue
    ↓
Revenue adapter
    ↓
Parameterized query
    ↓
Snowflake
    ↓
Authorized result
```

The adapter can enforce:

* Parameterized queries
* Row-level filters
* Column-level restrictions
* Data masking
* Query timeouts
* Result limits
* Audit metadata
* Connection security

The Worker receives only the permitted result.

## 10. Deterministic Processing After Tool Invocation

After retrieving data, the Worker should use deterministic processing whenever possible.

### Example

```text
MCP retrieves revenue
    ↓
Worker validates values
    ↓
Worker calculates growth using Python
    ↓
Worker validates calculation
    ↓
Worker returns structured result
```

The LLM is not required to calculate a simple percentage or transform a known schema.

### Why this matters

* Predictable results
* Easier testing
* Lower latency
* Lower cost
* Better auditability
* Reduced hallucination risk
* Easier regulatory and business review

## 11. When the LLM Participates in Tool Selection

An LLM may help interpret the task and recommend a tool.

### Example

```text
Task:
    "Show revenue for the last four quarters"

LLM recommendation:
    retrieve_customer_revenue

Worker runtime:
    Checks capability
    Checks allowlist
    Checks authorization
    Validates arguments
    Invokes approved tool
```

The LLM should not be allowed to:

* Invent tool names
* Select tools outside the allowlist
* Modify authorization context
* Pass unrestricted SQL
* Bypass input validation
* Invoke tools directly without runtime controls

### Control principle

```text
LLM recommends
    ↓
Worker validates
    ↓
Policy authorizes
    ↓
MCP executes
```

## 12. Tool Result Validation

The Worker validates the MCP response before using or returning it.

### Checks include

* Tool execution status
* Output schema
* Required fields
* Data types
* Record completeness
* Source identity
* Authorization scope
* Error indicators
* Partial-result flags
* Data freshness, when required

### Example

```text
MCP response received
    ↓
Validate schema
    ↓
Check requested customer
    ↓
Check all requested quarters
    ↓
Check numeric revenue values
    ↓
Check currency
    ↓
Apply business logic
```

If the tool returns malformed or incomplete data, the Worker should not mark the task as successfully completed.

## 13. Error Handling During Tool Invocation

The Worker must distinguish between different execution failures.

| Failure | Worker action |
| --- | --- |
| Tool not found | Return capability or configuration error |
| Unauthorized tool | Return access-denied result |
| Invalid arguments | Reject before invocation |
| MCP connection failure | Retry if permitted |
| Tool timeout | Stop and return timeout status |
| Rate limit | Apply controlled backoff |
| Enterprise API failure | Retry or return dependency error |
| Invalid tool response | Return validation failure |
| Partial data | Return partial-result status |
| Non-idempotent failure | Avoid unsafe automatic retry |

### Example

```json
{
  "task_id": "task-204",
  "status": "failed",
  "error": {
    "code": "TOOL_NOT_AUTHORIZED",
    "message": "The Worker is not authorized to invoke the requested tool",
    "retryable": false
  }
}
```

The Delegator can then decide whether to use another Worker, continue with partial results, or escalate.

## 14. Returning Structured Results

The Worker should return both the business result and execution metadata.

### Example

```json
{
  "task_id": "task-204",
  "worker_id": "revenue-worker",
  "status": "completed",
  "result": {
    "customer_id": "CUST-1001",
    "growth_percentage": 25.83,
    "currency": "USD"
  },
  "tool_execution": {
    "tool_name": "retrieve_customer_revenue",
    "protocol": "MCP",
    "status": "success"
  },
  "validation": {
    "input_valid": true,
    "output_schema_valid": true,
    "business_rules_valid": true
  },
  "sources": [
    {
      "system": "Snowflake",
      "reference": "revenue_fact_table"
    }
  ],
  "correlation_id": "corr-789"
}
```

This allows the Delegator to understand not only what result was produced, but also how the result was obtained and whether it is trustworthy.

## 15. End-to-End Example

### Business request

> "Prepare a customer briefing for CUST-1001."

The Delegator creates an atomic task:

```json
{
  "task_id": "task-204",
  "capability": "retrieve_customer_revenue",
  "parameters": {
    "customer_id": "CUST-1001",
    "quarters": 4
  },
  "expected_output": "quarterly_revenue"
}
```

### Worker execution

```text
1. Receive task
        ↓
2. Validate customer_id and quarters
        ↓
3. Check user and Worker permissions
        ↓
4. Discover revenue tools through MCP
        ↓
5. Select retrieve_customer_revenue
        ↓
6. Validate tool arguments
        ↓
7. Invoke MCP tool
        ↓
8. Revenue adapter queries Snowflake
        ↓
9. Validate returned data
        ↓
10. Calculate growth deterministically
        ↓
11. Create structured result
        ↓
12. Record telemetry and audit data
        ↓
13. Return result to Delegator
```

The Delegator can combine this result with profile, opportunity, and interaction results to produce the customer briefing.

## 16. Worker Tool Invocation Responsibilities

| Responsibility | Worker behavior |
| --- | --- |
| Discover tools | Find tools matching the assigned capability |
| Understand tools | Read descriptions and schemas |
| Select tools | Choose only approved tools |
| Validate inputs | Check schema, business rules, and permissions |
| Enforce policy | Apply tool, data, and execution restrictions |
| Invoke tools | Use MCP or another approved interface |
| Retrieve data | Access only permitted enterprise data |
| Process results | Apply deterministic logic where possible |
| Validate outputs | Verify schema, completeness, and correctness |
| Handle failures | Retry safely or return controlled errors |
| Audit execution | Record tool, policy, timing, and outcome |
| Return results | Send structured output to the Delegator |

## 17. What the Worker Must Not Do

The Worker must not:

* Discover and invoke arbitrary external tools.
* Treat every discovered MCP tool as authorized.
* Bypass Entra ID, RBAC, or policy checks.
* Pass unrestricted SQL or API requests.
* Expose secrets through tool arguments.
* Send unnecessary sensitive data to tools or LLMs.
* Invoke write operations without permission.
* Ignore input or output schemas.
* Retry non-idempotent operations without safeguards.
* Return unvalidated tool responses.
* Decide the complete domain workflow.

## Final Definition

> A Worker discovers enterprise tools through approved mechanisms such as MCP, evaluates them against its assigned capability and authorization scope, validates inputs, enforces execution policies, invokes the selected tool through a governed adapter, validates the returned data, handles failures safely, and provides a structured, traceable result to the Delegator.

### Core formula

```text
Worker Tool Execution
=
Discover
+ Understand
+ Authorize
+ Validate Inputs
+ Select Approved Tool
+ Enforce Policy
+ Invoke Through MCP
+ Retrieve Data
+ Process
+ Validate Output
+ Handle Errors
+ Return Structured Result
```