# Enterprise MCP Security in CWD

Enterprise MCP security is about ensuring that **Workers can use only the tools and resources they are authorized to use, with validated inputs, protected credentials, controlled network access, protected data, and complete auditability**.

In the CWD architecture, MCP should be treated as a **governed capability-access boundary**, not simply as a protocol for calling tools.

### Core security principle

> **The Worker may decide what capability is needed, but security controls decide whether that capability is allowed to execute.**

A useful enterprise model is:

```text
User / Application
       │
       ▼
   API Gateway
       │
       ▼
   Coordinator
       │
       ▼
    Delegator
       │
       ▼
     Worker
       │
       │  Identity + Authorization
       ▼
    MCP Client
       │
       │  Authenticated Protocol
       ▼
    MCP Server
       │
       ├── Tool-level authorization
       ├── Input validation
       ├── Policy checks
       ├── Rate limiting
       ├── Audit logging
       └── Secrets / credential handling
       │
       ▼
 Enterprise API / Database / Service
```

MCP itself provides standardized protocol semantics and capability discovery, but **enterprise security must be implemented across the MCP host/client/server and surrounding infrastructure**. MCP's security guidance specifically emphasizes access controls, input validation, rate limiting, output sanitization, timeouts, audit logs, and confirmation for sensitive operations.

---

# 1. Authentication

Authentication answers:

> **Who is making this request?**

In CWD, there can be multiple identities:

```text
Human User
    ↓
Enterprise Application
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP Client
    ↓
MCP Server
```

The system should establish and propagate a trusted identity context.

For example:

```json
{
  "user_id": "user-123",
  "application": "enterprise-ai",
  "agent_id": "order-worker",
  "tenant_id": "tenant-a",
  "correlation_id": "corr-789"
}
```

Authentication might use enterprise identity infrastructure such as:

* OAuth 2.0
* OpenID Connect
* Microsoft Entra ID
* Managed identities
* Service principals
* Workload identities
* Mutual TLS where appropriate

The important point is that:

> **The MCP server should not blindly trust an identity merely because the Worker claims to have permission.**

The identity should be established through a trusted authentication mechanism.

---

# 2. Authorization

Authentication tells us **who**.

Authorization determines:

> **What is that identity allowed to do?**

For example:

```text
Worker: OrderWorker
User: Alice

Requested Tool:
    cancel_order

Authorization:
    OrderWorker → allowed
    Alice → allowed
    Order 123 → allowed
```

Only when all relevant checks succeed should execution occur.

Conceptually:

```python
authorized = (
    identity_authenticated
    and agent_has_tool_permission
    and user_has_permission
    and resource_access_allowed
    and policy_allows_action
)
```

If:

```text
authorized == False
```

then:

```text
DO NOT EXECUTE TOOL
```

This is particularly important because **MCP tool discovery is not authorization**.

A tool appearing in `tools/list` does not mean every Worker or user can invoke it.

---

# 3. Tool-Level Permissions

Enterprise MCP security should operate at the **individual tool level**, rather than simply saying:

```text
Order Worker = access to Order System
```

Instead:

```text
OrderWorker
   │
   ├── get_order_status       ✓
   ├── get_order_details      ✓
   ├── search_orders          ✓
   ├── update_shipping       ✓
   ├── cancel_order           ✗
   └── delete_order           ✗
```

This follows least privilege.

A permission model could look like:

```json
{
  "agent": "order-worker",
  "permissions": {
    "get_order_status": "read",
    "get_order_details": "read",
    "update_shipping": "write",
    "cancel_order": "approval_required"
  }
}
```

This is much safer than giving the Worker unrestricted access to an entire backend.

---

# 4. Identity Propagation

A major enterprise concern is preserving the relationship between:

```text
Human
   ↓
Application
   ↓
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
MCP Server
   ↓
Enterprise API
```

Suppose Alice asks:

> "Cancel order 123."

The backend should ideally be able to determine:

```text
Original user = Alice
Application = Enterprise AI
Agent = OrderWorker
Tool = cancel_order
Resource = Order 123
```

Conceptually:

```json
{
  "subject": "alice",
  "actor": "order-worker",
  "application": "enterprise-ai",
  "tool": "cancel_order",
  "resource": "order-123",
  "correlation_id": "corr-456"
}
```

This enables:

* user-level authorization
* agent-level authorization
* resource-level authorization
* auditing
* accountability
* non-repudiation

### Important distinction

Do not confuse:

```text
Agent identity
```

with:

```text
User identity
```

An agent being authorized to call a tool does not automatically mean the user is authorized to perform every operation through that agent.

---

# 5. Input Validation

Never allow an LLM-generated tool argument to go directly into an enterprise system.

For example:

```json
{
  "order_id": "123",
  "quantity": 5000000
}
```

The MCP server should validate:

```text
Protocol validation
        ↓
Schema validation
        ↓
Type validation
        ↓
Business validation
        ↓
Authorization
        ↓
Execution
```

Example:

```python
def validate_order_request(request):

    if not request.order_id:
        raise ValueError("order_id is required")

    if not request.quantity:
        raise ValueError("quantity is required")

    if request.quantity < 1:
        raise ValueError("quantity must be positive")

    if request.quantity > MAX_ALLOWED_QUANTITY:
        raise ValueError("quantity exceeds allowed limit")
```

Input validation protects against:

* malformed requests
* unexpected types
* injection attacks
* excessive values
* invalid identifiers
* unauthorized parameters
* dangerous commands

---

# 6. Never Trust the LLM

This is one of the most important enterprise principles.

The LLM might produce:

```text
tool = delete_customer
customer_id = 123
```

The runtime should **not** interpret this as authorization.

Instead:

```text
LLM recommendation
       ↓
Worker decision
       ↓
MCP tool request
       ↓
Policy validation
       ↓
Authorization
       ↓
Risk assessment
       ↓
Human approval if required
       ↓
Tool execution
```

Therefore:

> **LLM output is a request or recommendation, not a security decision.**

---

# 7. Secrets Management

MCP servers frequently need credentials to access:

* databases
* APIs
* cloud services
* SaaS platforms
* enterprise applications

These credentials should **never be placed inside prompts or hardcoded in Worker code**.

Bad:

```python
API_KEY = "abc123-secret"
```

Bad:

```text
Prompt:
Use this API key to call the production service:
abc123...
```

Better:

```text
Worker
   ↓
MCP Server
   ↓
Managed Identity
   ↓
Secret / Token Provider
   ↓
Enterprise API
```

In an Azure-oriented CWD architecture, this could involve:

```text
Microsoft Entra ID
        +
Managed Identity
        +
Azure Key Vault
        +
RBAC
```

The MCP server retrieves credentials only when required.

### Principle

```text
Secrets belong in the security infrastructure,
not in the LLM context.
```

---

# 8. Network Controls

Even an authorized MCP server should not have unrestricted network access.

A production architecture should use controls such as:

```text
MCP Server
    │
    ├── Private Endpoint
    │
    ├── VNet
    │
    ├── Firewall
    │
    ├── NSG
    │
    └── Egress restrictions
            │
            ▼
      Approved Services
```

For example:

```text
Order MCP Server
      │
      ├── ✓ Order API
      ├── ✓ Customer API
      ├── ✓ Inventory API
      │
      ├── ✗ Arbitrary Internet
      ├── ✗ Unknown API
      └── ✗ Internal admin systems
```

This provides defense in depth.

Even if an agent is compromised, the MCP server should not be able to reach arbitrary systems.

---

# 9. Data Protection

MCP can expose enterprise information through resources and tool results.

Therefore data should be classified:

```text
Public
Internal
Confidential
Restricted
Highly Restricted
```

Before returning data:

```text
Enterprise Data
      ↓
Classification
      ↓
Access Control
      ↓
Data Filtering
      ↓
Redaction
      ↓
MCP Resource / Tool Result
      ↓
Worker
```

For example, an employee may be allowed to see:

```json
{
  "order_id": "12345",
  "status": "SHIPPED",
  "customer": "ABC Corp"
}
```

but not:

```json
{
  "credit_card": "...",
  "internal_security_token": "...",
  "password": "..."
}
```

Sensitive information should also be protected in:

* prompts
* workflow state
* checkpoints
* logs
* traces
* tool responses
* error messages

---

# 10. Output Validation and Sanitization

Security does not end after the backend returns data.

Consider:

```text
Enterprise API
      ↓
MCP Server
      ↓
Tool Result
      ↓
Worker
```

The MCP server should validate and sanitize returned information.

For example:

```python
def sanitize_customer(customer):

    return {
        "id": customer["id"],
        "name": customer["name"],
        "status": customer["status"]
    }
```

Instead of returning every field from the database.

This reduces:

* data leakage
* accidental exposure
* prompt injection propagation
* unnecessary context
* sensitive information entering the LLM

MCP security guidance also recommends validating tool results and sanitizing outputs.

---

# 11. Rate Limiting

An autonomous Worker can potentially generate many tool calls.

For example:

```text
Worker
 ↓
search_orders
 ↓
search_orders
 ↓
search_orders
 ↓
search_orders
 ↓
...
```

Without controls, this could overload an enterprise API.

Therefore:

```text
MCP Server
    ↓
Rate Limiter
    ↓
Tool Execution
```

Example policy:

```json
{
  "tool": "search_orders",
  "limit": 100,
  "window": "1 minute"
}
```

You can also implement limits by:

* user
* Worker
* agent
* tenant
* tool
* API
* IP/network identity
* workflow

Rate limiting is explicitly part of MCP's security considerations.

---

# 12. Preventing Unsafe Tool Execution

This is especially important for tools that modify enterprise state.

Classify tools by risk.

| Tool               | Risk     | Control                         |
| ------------------ | -------- | ------------------------------- |
| `get_order_status` | Low      | Normal authorization            |
| `search_orders`    | Low      | RBAC + rate limit               |
| `update_address`   | Medium   | Authorization + validation      |
| `update_payment`   | High     | Approval                        |
| `cancel_order`     | High     | Approval                        |
| `delete_customer`  | Critical | Strong authorization + approval |
| `execute_sql`      | Critical | Avoid / tightly restrict        |
| `execute_shell`    | Critical | Generally prohibit              |

A useful policy model is:

```text
Tool Request
     ↓
Risk Classification
     ↓
     ├── Low Risk ─────────→ Execute
     │
     ├── Medium Risk ──────→ Additional validation
     │
     ├── High Risk ────────→ Human approval
     │
     └── Critical ─────────→ Deny / exceptional controlled path
```

---

# 13. Human Approval for High-Risk Tools

This integrates directly with the CWD HITL architecture.

For example:

```text
Worker
  ↓
cancel_order
  ↓
Policy Engine
  ↓
High Risk?
  ↓ YES
Checkpoint
  ↓
Human Approval
  ↓
Approved?
  ├── YES → MCP Tool
  └── NO  → Stop
```

The important design principle is:

> **The Worker can recommend the action, but authorization and approval control whether the action actually occurs.**

---

# 14. Preventing Arbitrary Tool Execution

One of the biggest anti-patterns is creating overly generic tools.

### Dangerous

```text
execute_sql(sql)
```

or:

```text
execute_shell(command)
```

or:

```text
call_any_api(url, method, body)
```

These tools effectively turn an agent into a general-purpose privileged execution engine.

### Better

Expose narrow business capabilities:

```text
get_order_status(order_id)

get_customer_profile(customer_id)

update_shipping_address(order_id, address)

create_support_case(customer_id, issue)
```

This creates a much smaller attack surface.

### Principle

```text
Business Capability
       >
Generic Execution Capability
```

The narrower the tool, the easier it is to:

* authorize
* validate
* audit
* monitor
* rate-limit
* test
* secure

---

# 15. MCP Server as a Security Boundary

A good enterprise MCP server should act as a controlled gateway around a business capability.

```text
                 MCP Server
                     │
       ┌─────────────┼─────────────┐
       │             │             │
 Authentication  Authorization  Validation
       │             │             │
       └─────────────┼─────────────┘
                     │
               Policy Engine
                     │
               Rate Limiter
                     │
               Audit Logging
                     │
               Backend Adapter
                     │
                     ▼
             Enterprise System
```

The MCP server should **not simply forward whatever the LLM requests**.

---

# 16. Security Pipeline

A strong CWD implementation can use this pipeline:

```text
1. Receive MCP request
          ↓
2. Authenticate caller
          ↓
3. Validate protocol
          ↓
4. Identify Worker / application / user
          ↓
5. Check tool permission
          ↓
6. Check resource permission
          ↓
7. Validate input schema
          ↓
8. Validate business rules
          ↓
9. Check risk / policy
          ↓
10. Check human approval if required
          ↓
11. Apply rate limits
          ↓
12. Retrieve secrets securely
          ↓
13. Execute backend operation
          ↓
14. Validate backend result
          ↓
15. Sanitize output
          ↓
16. Audit execution
          ↓
17. Return structured result
```

This is the core enterprise security pattern.

---

# 17. Conceptual CWD Security Implementation

A simplified Worker-to-MCP execution model might look like:

```python
def execute_tool(worker, user, tool_name, arguments):

    # 1. Authentication
    identity = authenticate(user)

    # 2. Tool-level authorization
    if not policy.allows_tool(
        identity=identity,
        worker=worker,
        tool=tool_name
    ):
        raise PermissionError("Tool access denied")

    # 3. Input validation
    validate_tool_schema(tool_name, arguments)

    # 4. Business validation
    validate_business_rules(tool_name, arguments)

    # 5. Risk evaluation
    risk = policy.get_risk_level(tool_name)

    # 6. Human approval
    if risk == "HIGH":
        request_human_approval(
            identity,
            worker,
            tool_name,
            arguments
        )

    # 7. Rate limiting
    rate_limiter.check(worker, tool_name)

    # 8. Execute through MCP
    result = mcp_client.call_tool(
        tool_name,
        arguments
    )

    # 9. Validate/sanitize result
    result = validate_and_sanitize(result)

    # 10. Audit
    audit.log(
        user=identity,
        worker=worker,
        tool=tool_name,
        result_status="success"
    )

    return result
```

This is conceptual architecture code rather than a complete MCP SDK implementation.

---

# 18. Where Each Security Control Belongs

A common architecture mistake is putting every security control inside the MCP server.

Security should be layered.

| Layer          | Primary responsibility                             |
| -------------- | -------------------------------------------------- |
| API Gateway    | Authentication, ingress protection                 |
| Coordinator    | Workflow authorization, intent/risk policies       |
| Delegator      | Domain-level authorization and Worker selection    |
| Worker         | Task validation and domain reasoning               |
| MCP Client     | Secure protocol interaction                        |
| MCP Server     | Tool authorization, validation, execution controls |
| Policy Service | Centralized policy decisions                       |
| Entra ID / IAM | Identity                                           |
| Key Vault      | Secrets                                            |
| Network        | Connectivity and segmentation                      |
| Backend API    | Final resource authorization                       |
| Audit Platform | Centralized audit/monitoring                       |

This creates **defense in depth**.

---

# 19. CWD + MCP Security Responsibility

The clean separation is:

```text
                    CWD
                     │
          Workflow + Governance
                     │
      ┌──────────────┼──────────────┐
      │              │              │
 Coordinator      Delegator       Worker
      │              │              │
      └──────────────┼──────────────┘
                     │
                    MCP
                     │
          Capability Integration
                     │
                MCP Server
                     │
      ┌──────────────┼──────────────┐
      │              │              │
 Authorization   Validation      Execution
      │              │              │
      └──────────────┼──────────────┘
                     │
              Enterprise Systems
```

The distinction is important:

### LangGraph

Controls:

```text
state
workflow
routing
retry
checkpoint
recovery
HITL
```

### Policy/IAM

Controls:

```text
identity
authorization
permissions
risk
entitlements
```

### MCP

Controls the standardized:

```text
application/agent
        ↓
capability
```

interaction.

### MCP Server

Controls:

```text
tool validation
tool authorization
backend execution
result handling
```

---

# 20. Complete Secure CWD Execution Flow

Consider:

> "Update the shipping address for order 123."

```text
User
 │
 ▼
API Gateway
 │
 │ Authenticate
 ▼
Coordinator
 │
 │ Validate intent + authorization
 ▼
Delegator
 │
 │ Select Order Worker
 ▼
Order Worker
 │
 │ Domain reasoning
 │
 │ "I need update_shipping_address"
 ▼
MCP Client
 │
 │ tools/list / capability discovery
 │
 │ tools/call
 ▼
MCP Server
 │
 ├── Authenticate
 ├── Identify Worker/User
 ├── Check tool permission
 ├── Validate schema
 ├── Validate address
 ├── Check policy
 ├── Check risk
 ├── Rate limit
 ├── Retrieve credentials
 │
 ▼
Order API
 │
 ▼
Result
 │
 ▼
MCP Server
 │
 ├── Validate result
 ├── Sanitize result
 └── Audit
 │
 ▼
MCP Client
 │
 ▼
Worker
 │
 ▼
Delegator
 │
 ▼
Coordinator
 │
 ▼
Final Response
```

If the operation requires approval:

```text
Policy
  ↓
HIGH RISK
  ↓
Checkpoint
  ↓
Human Approval
  ↓
Approved
  ↓
MCP Tool
```

If authorization fails:

```text
Authorization
     ↓
   DENIED
     ↓
DO NOT EXECUTE
     ↓
Audit
     ↓
Recovery / Final Response
```

---

# 21. Security vs MCP Discovery

This distinction is extremely important for interviews.

```text
tools/list
     ↓
"What tools exist?"
```

does **not** mean:

```text
"Which tools am I allowed to use?"
```

Therefore:

```text
Discovery
   ≠
Authorization
```

Similarly:

```text
Resource discovery
   ≠
Resource access permission
```

A Worker might discover:

```text
delete_customer
```

but authorization could return:

```text
DENY
```

The MCP security guidance explicitly recommends access controls and notes that available tools may vary based on authorization.

---

# 22. Security Controls Summary

| Security concern                              | Enterprise control                    |
| --------------------------------------------- | ------------------------------------- |
| Who is calling?                               | Authentication                        |
| What can they do?                             | Authorization                         |
| Which tool?                                   | Tool-level permissions                |
| Which resource?                               | Resource-level authorization          |
| Is the request valid?                         | Schema/input validation               |
| Is the action safe?                           | Risk/policy evaluation                |
| Is approval required?                         | HITL                                  |
| Where are credentials?                        | Key Vault / managed identity          |
| Where can server connect?                     | Network controls                      |
| How much can it call?                         | Rate limiting                         |
| What data can leave?                          | Data filtering/redaction              |
| Is returned data safe?                        | Output validation                     |
| Can execution be tracked?                     | Audit logs                            |
| Can a bad request execute arbitrary commands? | Narrow tools + deny generic execution |
| Can backend enforce security too?             | Defense in depth                      |

---

# 23. Enterprise MCP Security Anti-Patterns

### ❌ Giving every Worker every tool

```text
Worker → All MCP Tools
```

Use:

```text
Worker → Approved Tool Subset
```

### ❌ Trusting the LLM's decision

```text
LLM says "allowed"
       ↓
execute
```

Never do this.

### ❌ Hardcoded secrets

```python
API_KEY = "..."
```

Use managed identity/secure secret infrastructure.

### ❌ Generic unrestricted tools

```text
execute_sql()
execute_shell()
call_any_api()
```

Avoid these wherever possible.

### ❌ Treating discovery as permission

```text
tools/list → therefore authorized
```

Incorrect.

### ❌ Logging sensitive data

```text
audit.log(full_prompt + full_tool_result)
```

Instead:

```text
audit.log(
    user,
    worker,
    tool,
    resource_id,
    decision,
    status,
    correlation_id
)
```

with sensitive payloads minimized or redacted.

---

# 24. Interview-Ready Answer

If an interviewer asks:

> **"How do you secure MCP in an enterprise CWD architecture?"**

A strong answer is:

> **"I treat MCP as a governed capability-access boundary rather than just a tool-calling protocol. Authentication establishes the identity of the user, application, Worker, and MCP server. Authorization is enforced at the tool and resource level using least privilege and centralized policy. The Worker can recommend a tool, but it cannot bypass authorization. MCP inputs are schema-validated and then subjected to business and policy validation before execution. Secrets are managed through enterprise identity and secret-management infrastructure rather than prompts or source code. Network controls restrict MCP servers to approved enterprise services. Tool results are validated, sanitized, and filtered according to data classification. Rate limiting, timeouts, and concurrency controls prevent abuse and overload. High-risk tools can trigger CWD human-approval gates before execution. Finally, every important decision and execution event is correlated and audited. This creates defense in depth across CWD, MCP, IAM, policy, network, and backend systems."**

---

# Final Architecture Definition

**Enterprise MCP security in CWD is a defense-in-depth security model that authenticates identities, authorizes users and Workers at tool/resource level, propagates trusted identity context, validates inputs and outputs, protects secrets, restricts network connectivity, protects enterprise data, controls execution rate and risk, requires human approval for sensitive operations, and produces auditable execution records while preventing agents from performing arbitrary or unauthorized tool operations.**

### Core security formula

```text
Enterprise MCP Security
=
Authentication
+ Identity Propagation
+ Authorization
+ Tool Permissions
+ Input Validation
+ Policy/Risk Controls
+ Secrets Management
+ Network Controls
+ Data Protection
+ Output Validation
+ Rate Limiting
+ Auditability
+ Human Approval
+ Least Privilege
```

### The key CWD principle

```text
LLM
  = Reason / Recommend

Worker
  = Domain Reasoning / Execute Task

LangGraph
  = State / Workflow / Recovery

Policy + IAM
  = Decide What Is Allowed

MCP
  = Standardize Capability Access

MCP Server
  = Validate + Authorize + Execute Tool

Enterprise Backend
  = Final Business-System Enforcement
```

**Therefore:**

> **The agent decides what it wants to do; CWD decides where it fits in the workflow; policy and identity decide whether it is permitted; MCP provides the standardized capability interface; and the MCP server securely validates and executes the approved operation.**
