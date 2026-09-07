# Identity, Authorization, Roles, Permissions, and Entitlements in CWD

The core security principle is:

> An authenticated user is not automatically authorized to access every agent, tool, or enterprise record. CWD must validate who the user is, what the user is allowed to do, which agent is acting, which resource is requested, and whether the specific operation is permitted.

```
User
  ↓
Gateway Authentication
  ↓
Trusted User Identity
  ↓
Coordinator Authorization
  ↓
Agent / Delegator Permission Check
  ↓
Worker Task Authorization
  ↓
Tool / MCP Authorization
  ↓
Enterprise Data Entitlement Check
  ↓
Authorized Result
```


## 1. The Difference Between the Security Concepts

|
Concept

|

Meaning

|

Example

|
| --- | --- | --- |
|

Identity

|

The person, application, or agent requesting access

|

`user-123`

|
|

Authentication

|

Verifies that the identity is genuine

|

Valid Entra ID token

|
|

Role

|

Defines the user's organizational responsibility

|

`FinanceAnalyst`

|
|

Permission

|

Defines an allowed operation

|

`shipment.read`

|
|

Entitlement

|

Defines the resources or data the user may access

|

Shipments for region `US-South`

|
|

Scope

|

Defines the boundary of access

|

Tenant, region, department, environment

|
|

Authorization

|

Decides whether this specific request is allowed

|

User may read this shipment now

|
|

Policy

|

Applies additional business, security, and risk rules

|

Restricted data requires approval

|

### Mental model

```
Identity → Who?
Role → What responsibility?
Permission → What operation?
Entitlement → Which resources?
Scope → Within which boundary?
Authorization → Is this request allowed now?
```

## 2. Authentication: Establishing Trusted Identity

The Gateway validates the caller's identity before allowing entry.

```
User
  ↓
Microsoft Entra ID
  ↓
Access Token
  ↓
API Gateway
  ↓
Token Validation
```

The Gateway validates relevant token properties:

* Signature

* Issuer

* Audience

* Expiration

* Tenant

* Required claims

Conceptually:

Authenticated=ValidIdentity∧ValidToken∧ValidAudience∧TokenNotExpiredAuthenticated = ValidIdentity \land ValidToken \land ValidAudience \land TokenNotExpiredAuthenticated=ValidIdentity∧ValidToken∧ValidAudience∧TokenNotExpired

If authentication fails:

```
Invalid or Missing Token
        ↓
401 Unauthorized
        ↓
No Agent Execution
```

Authentication establishes identity, but it does not establish permission.

## 3. Trusted Identity Context

After authentication, CWD creates a trusted security context.

JSON

```
{
  "identity_context": {
    "user_id": "user-123",
    "tenant_id": "tenant-a",
    "identity_type": "human",
    "authentication_status": "authenticated",
    "claims_reference": "claims-001"
  },
  "request_context": {
    "correlation_id": "CORR-7890",
    "session_id": "S-1001",
    "workflow_id": "WF-1001"
  }
}
```

The Gateway or identity service should obtain identity information from a trusted token or identity provider—not from user-supplied fields such as:

JSON

```
{
  "role": "admin",
  "is_authorized": true
}
```

Those fields are untrusted input.

## 4. Roles

A role represents a responsibility or job function.

Examples:

```
Employee
FinanceAnalyst
EngineeringManager
SupportAgent
PlatformAdministrator
DataSteward
```

A role may contain several permissions:

JSON

```
{
  "role": "FinanceAnalyst",
  "permissions": [
    "finance.report.read",
    "finance.transaction.read"
  ]
}
```

Roles simplify administration, but the role alone should not determine final access. Scope, resource ownership, policy, and current conditions must also be considered.

## 5. Permissions

A permission is a specific allowed operation.

Examples:

```
agent.invoke
shipment.read
shipment.update
report.generate
knowledge.search
tool.get_tracking_events
tool.submit_reroute
```

Permissions should be granular.

```
Broad:
database.access

Better:
shipment.read
shipment.update
shipment.reroute
```

For tools:

```
tracking-worker
    └── tool.get_tracking_events
```

The ability to invoke a Worker does not automatically grant permission to invoke every tool that the Worker can access.

## 6. Entitlements

An entitlement defines which specific resources or data a user may access.

For example:

JSON

```
{
  "user_id": "user-123",
  "entitlements": {
    "tenant_id": "tenant-a",
    "regions": ["US-South"],
    "departments": ["Logistics"],
    "data_classifications": ["INTERNAL"],
    "allowed_resources": ["shipment:*"]
  }
}
```

Two users may have the same role but different entitlements:

```
User A:
FinanceAnalyst + US-South

User B:
FinanceAnalyst + US-West
```

Both may have:

```
finance.report.read
```

But they may not be entitled to read the same records.

> Permissions answer “what operation?” Entitlements answer “which data or resources?”

## 7. Authorization Before Agent Access

The Coordinator should validate whether the user is allowed to invoke the requested capability.

```
Authenticated User
        ↓
Requested Capability
        ↓
Role / Permission Check
        ↓
Scope / Entitlement Check
        ↓
Policy Check
        ↓
Agent Invocation Allowed?
```

Example:

```
User requests:
"Analyze shipment SHIP123"
```

The Coordinator checks:

```
Can this user invoke shipment analysis?
Does the user belong to the correct tenant?
Is SHIP123 within the user's region?
Is the requested operation permitted?
Does the task require elevated approval?
```

If denied:

```
403 Forbidden
```

The Coordinator should not delegate the task merely because an agent exists that can perform it.

## 8. Authorization Is Required at Multiple Boundaries

CWD should use defense in depth.

```
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP / Tool
  ↓
Enterprise System
```

Each boundary has a different responsibility.

|
Boundary

|

Main validation

|
| --- | --- |
|

Gateway

|

Caller authentication and ingress access

|
|

Coordinator

|

Enterprise intent, user authorization, risk

|
|

Delegator

|

Domain-level permission and task scope

|
|

Worker

|

Task authorization, input validation, data scope

|
|

MCP Client

|

Approved server and tool access

|
|

MCP Server

|

Tool-level authorization and input validation

|
|

Enterprise API

|

Final resource-level enforcement

|

A downstream service must not assume that an upstream check was sufficient.

## 9. Coordinator Authorization

The Coordinator evaluates the overall business request.

```
User Request
    ↓
Intent = shipment_analysis
    ↓
Required Capability = shipment_tracking
    ↓
User Permission Check
    ↓
Scope / Entitlement Check
    ↓
Policy Decision
```

The Coordinator may decide:

```
Allowed → Continue
Denied → Stop
Needs Approval → Human Review
Insufficient Context → Ask User
```

The LLM may recommend an intent or plan, but it must not make the final authorization decision.

```
LLM → Recommendation
Policy / IAM → Authorization Decision
Runtime → Enforced Action
```

## 10. Delegator Authorization

The Delegator validates whether the domain task is allowed within its responsibility.

Example:

```
Coordinator:
"Investigate shipment SHIP123"

Delegator:
"Retrieve tracking events and analyze delay"
```

The Delegator checks:

* Is this task within its registered domain?

* Is the requested capability permitted?

* Is the user or calling agent authorized?

* Is the task scope valid?

* Are the requested Workers approved for this operation?

* Does the task require additional approval?

The Delegator should not expand a narrow task into unrelated access.

## 11. Worker Authorization

The Worker performs task-level authorization before execution.

```
Worker Receives Task
        ↓
Validate Task Identity
        ↓
Validate User / Agent Context
        ↓
Validate Capability
        ↓
Validate Resource Scope
        ↓
Validate Tool Permission
        ↓
Execute
```

Example:

JSON

```
{
  "task_id": "WT-1001",
  "capability": "shipment_tracking",
  "action": "get_tracking_events",
  "input": {
    "shipment_id": "SHIP123"
  },
  "scope": {
    "tenant_id": "tenant-a",
    "region": "US-South"
  }
}
```

The Worker must verify that `SHIP123` belongs to an authorized tenant and region before retrieving it.

## 12. Tool and MCP Authorization

A Worker may be authorized to execute a task but still be unauthorized to use a particular tool.

```
Worker Permission
        ↓
Approved MCP Server
        ↓
Approved Tool
        ↓
Tool Permission
        ↓
Resource Authorization
        ↓
Execution
```

Example:

```
Allowed:
get_tracking_events

Not automatically allowed:
submit_reroute_request
delete_shipment
export_all_shipments
```

A narrow tool contract is safer than unrestricted access:

JSON

```
{
  "tool": "get_tracking_events",
  "required_permission": "shipment.read",
  "allowed_scope": "user_entitlements",
  "risk": "low"
}
```

MCP standardizes the integration interface, but the MCP server must still enforce authentication, authorization, validation, rate limits, and audit controls.

## 13. Enterprise Data Entitlement Validation

For enterprise data, authorization must happen before the data reaches the LLM.

```
User Identity
      ↓
Retrieve Entitlements
      ↓
Build Security Filter
      ↓
Search Enterprise Data
      ↓
Return Only Authorized Records
      ↓
Rerank / Deduplicate
      ↓
Build Context
      ↓
LLM
```

The core rule is:

AuthorizedData=RelevantData∩UserEntitlements∩ResourceACL∩BusinessScope∩PolicyConstraints\boxed{ AuthorizedData = RelevantData \cap UserEntitlements \cap ResourceACL \cap BusinessScope \cap PolicyConstraints }AuthorizedData=RelevantData∩UserEntitlements∩ResourceACL∩BusinessScope∩PolicyConstraints

### Example

```
User asks:
"Show all shipment delays."
```

The search system must not simply retrieve all relevant shipments. It must filter by:

```
Tenant
Region
Department
Resource ACL
Data Classification
Business Scope
```

A document that is semantically relevant but unauthorized must be excluded.

> Relevance does not override authorization.

## 14. RAG Security Filtering

For RAG, access-control metadata must be preserved during ingestion.

```
Enterprise Document
      ↓
Extract Content
      ↓
Extract ACL / Security Metadata
      ↓
Chunk Document
      ↓
Copy ACL to Chunks
      ↓
Embed
      ↓
Index
```

At runtime:

```
User Identity
      ↓
User Entitlements
      ↓
Security Filter
      ↓
Azure AI Search
      ↓
Authorized Chunks
      ↓
Reranking
      ↓
LLM Context
```

Example metadata:

JSON

```
{
  "document_id": "DOC-1001",
  "chunk_id": "DOC-1001-03",
  "tenant_id": "tenant-a",
  "department": "Logistics",
  "classification": "CONFIDENTIAL",
  "allowed_groups": ["logistics-ops"],
  "allowed_regions": ["US-South"]
}
```

The RAG Worker should validate the user's entitlements against this metadata before context construction.

## 15. Live Data and Transactional APIs

RAG is appropriate for knowledge, policies, and documentation. Live transactional data should generally be accessed through an approved API or MCP tool.

```
Question:
"What is the current shipment status?"
        ↓
Tracking API / MCP Tool
```

The tool must enforce:

```
User Identity
Tenant
Resource ID
Permission
Entitlement
Business Rules
```

The Worker should not retrieve a record simply because the user knows its identifier.

## 16. Identity Propagation Across Agents

The original user identity and the acting agent identity should both be traceable.

```
Human User
    ↓
Coordinator Identity
    ↓
Delegator Identity
    ↓
Worker Identity
    ↓
MCP Server Identity
    ↓
Enterprise API
```

A task context may contain:

JSON

```
{
  "principal": {
    "user_id": "user-123",
    "tenant_id": "tenant-a"
  },
  "acting_agent": {
    "agent_id": "shipping-delegator",
    "workload_identity": "agent-runtime-001"
  },
  "delegation": {
    "source_agent": "coordinator",
    "purpose": "shipment_analysis",
    "correlation_id": "CORR-7890"
  }
}
```

The enterprise system should be able to distinguish:

```
Who requested the action?
Which agent performed it?
Which tool was used?
Which resource was accessed?
Under which permission?
```

Identity propagation does not mean blindly forwarding the user's raw access token to every component.

## 17. Authorization Formula

A practical authorization decision can be represented as:

Authorized=Authenticated∧RoleAllowed∧PermissionAllowed∧ScopeAllowed∧EntitlementAllowed∧ResourceAllowed∧PolicyAllowed∧RiskAllowed\boxed{ Authorized = Authenticated \land RoleAllowed \land PermissionAllowed \land ScopeAllowed \land EntitlementAllowed \land ResourceAllowed \land PolicyAllowed \land RiskAllowed }Authorized=Authenticated∧RoleAllowed∧PermissionAllowed∧ScopeAllowed∧EntitlementAllowed∧ResourceAllowed∧PolicyAllowed∧RiskAllowed

For sensitive operations:

```
Authorized
    ↓
Risk Evaluation
    ↓
Human Approval if Required
    ↓
Execute
```

A valid authentication token is therefore only the first condition.

## 18. Example: Shipment Analysis Request

```
User:
"Why is shipment SHIP123 delayed?"
```

### Step-by-step security flow

```
1. Gateway validates user token
2. Gateway establishes tenant and correlation context
3. Coordinator identifies shipment-analysis intent
4. Coordinator checks shipment.read permission
5. Coordinator checks tenant and regional entitlement
6. Coordinator authorizes shipping Delegator
7. Delegator authorizes tracking Worker
8. Worker validates SHIP123 belongs to allowed scope
9. Worker checks get_tracking_events permission
10. MCP server validates tool access
11. Enterprise API enforces resource authorization
12. Worker validates returned data
13. Coordinator generates response from authorized result
```

If the user is not entitled to `SHIP123`, the request stops before data retrieval.

## 19. Authorization Failure Examples

|
Failure

|

Correct behavior

|
| --- | --- |
|

Missing token

|

Reject at Gateway

|
|

Expired token

|

Reject at Gateway

|
|

Valid user, unauthorized agent

|

Deny Coordinator invocation

|
|

Authorized agent, unauthorized tool

|

Deny Worker tool call

|
|

Authorized tool, unauthorized record

|

Deny enterprise data access

|
|

Cross-tenant request

|

Reject

|
|

Restricted data without approval

|

Escalate or deny

|
|

Missing scope

|

Ask for clarification or deny

|
|

Policy violation

|

Stop and audit

|

A security denial is not necessarily a system failure. Correctly denying unauthorized access is a successful security outcome.

## 20. Responsibility Separation

```
Gateway
    → Who is calling?

Identity Provider
    → Is the identity genuine?

IAM / Policy
    → What is the identity allowed to do?

Agent Registry
    → Which agents exist and what can they do?

Coordinator
    → Is the overall request authorized?

Delegator
    → Is the domain task authorized?

Worker
    → Is this specific execution authorized?

MCP Server
    → Is this tool invocation authorized?

Enterprise System
    → Can this principal access this resource?
```

## 21. Common Anti-Patterns

### 1. Authentication equals authorization

```
Valid token → Allow everything
```

Why it is unsafe: A valid identity may have limited permissions.

### 2. Trusting user-supplied roles

```
{
  "role": "admin"
}
```

Why it is unsafe: Roles must come from a trusted identity or authorization system.

### 3. Authorizing only at the Gateway

Why it is unsafe: Internal agents and tools can still be misused.

### 4. Letting the LLM decide access

Why it is unsafe: LLM output is probabilistic and can be manipulated by prompt injection.

### 5. Filtering RAG results only after retrieval

Why it is unsafe: Unauthorized content may already have entered intermediate context, logs, or traces.

### 6. Treating memory as authorization

Why it is unsafe: A remembered statement such as “the user is an administrator” is not a trusted authorization decision.

### 7. Giving Workers unrestricted database access

Why it is unsafe: A compromised or misdirected Worker could access unrelated records.

### 8. Forwarding unrestricted credentials between agents

Why it is unsafe: It increases the blast radius of a compromised component.

## 22. Security Control Pipeline

```
Request
   ↓
Authenticate User
   ↓
Validate Token
   ↓
Establish Tenant / Identity
   ↓
Validate Request Schema
   ↓
Identify Intent and Capability
   ↓
Check User Role
   ↓
Check Permission
   ↓
Check Entitlement and Scope
   ↓
Authorize Agent
   ↓
Authorize Delegator
   ↓
Authorize Worker
   ↓
Authorize Tool / MCP
   ↓
Authorize Enterprise Resource
   ↓
Apply Risk and Policy Controls
   ↓
Human Approval if Required
   ↓
Execute
   ↓
Validate and Sanitize Result
   ↓
Audit
   ↓
Return Authorized Response
```

## 23. Interview-Ready Answer

> “In CWD, identity and access control are enforced as a defense-in-depth process. The Gateway authenticates the user through an enterprise identity provider such as Microsoft Entra ID and establishes trusted tenant and correlation context. The Coordinator then evaluates the requested intent, role, permission, scope, entitlement, resource, and policy requirements before selecting an agent. The Delegator and Worker repeat authorization at the domain and task levels, while MCP servers enforce tool-level permissions and enterprise APIs enforce final resource-level access. For RAG, user entitlements and document ACLs are applied before unauthorized content reaches the LLM. The platform also propagates both user and agent identity for auditability without blindly forwarding credentials. The LLM may recommend a plan, but deterministic IAM and policy services make and enforce authorization decisions. This ensures that being authenticated, having a role, or discovering an agent never automatically grants access to every tool or enterprise record.”

## Final Definition

Identity and access validation in CWD is the defense-in-depth process that authenticates human and agent identities, resolves roles and permissions, evaluates entitlements and scopes, authorizes agent and tool execution, filters enterprise data according to resource ACLs and business policies, and enforces access at every relevant boundary before data or actions are permitted.

CWDAccessControl=Identity+Authentication+Roles+Permissions+Entitlements+Scopes+Authorization+Policy+ToolSecurity+DataSecurity+Auditability\boxed{ CWDAccessControl = Identity + Authentication + Roles + Permissions + Entitlements + Scopes + Authorization + Policy + ToolSecurity + DataSecurity + Auditability }CWDAccessControl=Identity+Authentication+Roles+Permissions+Entitlements+Scopes+Authorization+Policy+ToolSecurity+DataSecurity+Auditability

Mental model: Authentication proves who you are; roles and permissions describe what you may do; entitlements define which resources you may access; authorization decides whether the current request is allowed; and CWD enforces that decision across agents, tools, and enterprise data.
