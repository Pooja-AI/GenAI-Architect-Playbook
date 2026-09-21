## How do you handle authentication to each enterprise system?

In CWD, I **don't put Salesforce, ServiceNow, Oracle, SharePoint, or Snowflake credentials inside Workers or prompts**.

Authentication is handled at the **MCP/integration layer**, using the appropriate enterprise identity mechanism and a secret/identity store.

### Overall flow

```text
User
 ↓
Entra ID Authentication
 ↓
Coordinator
 ↓ A2A
Delegator
 ↓
Worker
 ↓ MCP
MCP Server
 ↓
Enterprise Authentication
 ↓
Enterprise System
```

The important distinction is:

* **User authentication** → Who is the user?
* **Worker/MCP authentication** → Which workload is making the call?
* **Authorization** → Is that user/workload allowed to perform this operation?

---

## 1. Salesforce

For Salesforce, the MCP Server can use an approved **OAuth-based integration**.

```text
Worker
 ↓ MCP
Salesforce MCP Server
 ↓
OAuth / Service Identity
 ↓
Salesforce API
```

The credentials/tokens are managed securely rather than being placed in Worker code.

For example:

```text
Salesforce MCP
 ├── Client identity
 ├── OAuth configuration
 └── Secure token handling
```

The MCP Server obtains/uses the appropriate token and calls Salesforce.

---

## 2. ServiceNow

Similarly:

```text
Incident Worker
      ↓
ServiceNow MCP Server
      ↓
OAuth / approved service credential
      ↓
ServiceNow API
```

The Worker doesn't know the ServiceNow credentials.

For example:

```python
await mcp_client.call_tool(
    "get_open_incidents",
    {"customer_id": "C12345"}
)
```

The MCP Server handles authentication when communicating with ServiceNow.

---

## 3. SharePoint / Microsoft Graph

For SharePoint, authentication can use **Microsoft Entra ID / OAuth** with appropriate Microsoft Graph permissions.

```text
Document Worker
      ↓
SharePoint MCP
      ↓
Entra ID / OAuth
      ↓
Microsoft Graph
      ↓
SharePoint
```

Permissions should be scoped to exactly what the integration requires.

For example, a read-only Worker shouldn't receive permissions that allow arbitrary document modification.

---

## 4. Oracle

For Oracle, the exact mechanism depends on how Oracle is exposed in the enterprise environment.

For example:

```text
Oracle Worker
      ↓
Oracle MCP Server
      ↓
Enterprise Identity / Secure Credential
      ↓
Oracle API / Database
```

If database access is required, I would use a **least-privilege Oracle database role**.

For example:

```text
oracle_read_role
    ├── SELECT customer_orders
    ├── SELECT inventory
    └── SELECT product_information
```

rather than giving the Agent administrative database privileges.

---

## 5. Snowflake

For Snowflake:

```text
Analytics Worker
      ↓
Snowflake MCP
      ↓
Workload Identity / OAuth / approved authentication
      ↓
Snowflake
      ↓
Least-privilege role
```

The MCP Server authenticates to Snowflake and assumes the appropriate role.

For example:

```text
analytics_read_role
        ↓
Approved schemas/tables
        ↓
Customer analytics
```

Again, the Agent should not have unrestricted database privileges.

---

# Where do we store secrets?

In your Azure-based CWD architecture, I would use:

**Azure Key Vault** for secrets, keys, certificates, and sensitive connection configuration.

```text
MCP Server
    ↓
Managed Identity
    ↓
Azure Key Vault
    ↓
Retrieve secret/configuration
    ↓
Enterprise API
```

The MCP Server gets permission to retrieve the required secret using its **Managed Identity**.

So I don't do this:

```python
SALESFORCE_PASSWORD = "my-password"  # ❌
```

or:

```python
api_key = "secret..."  # ❌
```

And I never put credentials into:

* Prompts
* A2A messages
* MCP parameters
* Conversation state
* Logs
* Agent configuration

---

# Authentication vs authorization

This distinction is very important in an interview.

### Authentication

> **Who are you?**

Example:

```text
MCP Server → Salesforce
"Here is my valid OAuth credential."
```

### Authorization

> **What are you allowed to do?**

Example:

```text
Incident Worker
    ↓
get_open_incidents → ALLOWED
delete_incident    → DENIED
```

So even if the MCP Server is authenticated to ServiceNow, it shouldn't automatically be allowed to perform every ServiceNow operation.

---

# User identity + workload identity

For sensitive enterprise data, I would also preserve the **user context**.

```text
User
 ↓
Entra ID
 ↓
Coordinator
 ↓
Worker Identity + User Context
 ↓
MCP Authorization
 ↓
Enterprise System
```

For example:

```json
{
  "user_id": "U123",
  "tenant_id": "T001",
  "worker_id": "incident_worker",
  "requested_action": "get_open_incidents",
  "customer_id": "C12345"
}
```

The authorization layer can evaluate:

```text
Is user U123 allowed?
        +
Is Incident Worker allowed?
        +
Is customer C12345 accessible?
        +
Is get_open_incidents allowed?
```

Only if the required checks pass do we call ServiceNow.

---

# How this looks across CWD

```text
                         CWD
                          │
                     Coordinator
                          │
                    A2A / Identity
                          │
        ┌─────────────────┼──────────────────┐
        ▼                 ▼                  ▼
   Sales Worker      Incident Worker    Analytics Worker
        │                 │                  │
       MCP               MCP                MCP
        │                 │                  │
        ▼                 ▼                  ▼
 Salesforce MCP     ServiceNow MCP     Snowflake MCP
        │                 │                  │
     OAuth/API        OAuth/API        OAuth/Workload
        │                 │                  │
        ▼                 ▼                  ▼
 Salesforce          ServiceNow         Snowflake
```

And separately:

```text
MCP Servers
     ↓
Managed Identity
     ↓
Azure Key Vault
```

---

# What about token expiration?

I don't hardcode long-lived tokens.

The integration layer handles token lifecycle:

```text
Need API call
    ↓
Check credential/token
    ↓
Valid?
 ┌──┴───┐
Yes     No
 ↓       ↓
Call   Refresh/obtain
         ↓
       Call
```

If authentication fails:

```text
401 → Don't blindly retry
     ↓
Refresh/re-authenticate if appropriate
     ↓
Retry once if valid
     ↓
Otherwise structured AUTHENTICATION_FAILED
```

For **403**, I treat it primarily as an authorization problem rather than a transient failure.

---

# Interview-ready answer

> **“In CWD, I separate user authentication, workload authentication, and authorization. Users authenticate through Microsoft Entra ID, while Workers access enterprise systems through MCP Servers. Each MCP Server uses the appropriate enterprise authentication mechanism—for example OAuth-based authentication for Salesforce and ServiceNow, Entra ID/OAuth for SharePoint through Microsoft Graph, and approved workload or database authentication for Oracle and Snowflake. Secrets and credentials are never embedded in Workers, prompts, or A2A messages; in our Azure environment, we use Managed Identity and Azure Key Vault for secure credential management. I also enforce least-privilege permissions at the enterprise system and MCP layers. Authentication establishes identity, but authorization determines whether that Worker and user are allowed to perform the specific operation. All authentication and authorization decisions are audited without logging secrets or access tokens.”**

### Easy memory

**User → Entra ID**

**Worker → MCP**

**MCP → Enterprise authentication**

**Key Vault → Secrets**

**RBAC/ABAC → Authorization**

**Audit → Who did what**

### Strong interview line

> **“I never give the LLM or Worker raw enterprise credentials. Identity is established outside the LLM, secrets are managed centrally, and authorization is enforced at the MCP and enterprise-system boundaries.”**
