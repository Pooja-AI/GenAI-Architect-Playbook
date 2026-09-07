Yes. In CWD, **auditability is the ability to reconstruct what happened, who or what performed it, what data and tools were involved, which policies were applied, what decision was made, and what the final outcome was.**

The important distinction is:

> **Observability tells engineers what happened during runtime; auditability creates governed evidence of security, access, configuration, and business-control events.**

# 1. Why CWD Needs Auditable Records

A traditional application might audit:

```text
User → Application → Database → Transaction
```

CWD has a much larger execution chain:

```text
User
 ↓
Gateway
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
A2A
 ↓
MCP
 ↓
Tool
 ↓
Enterprise Data
 ↓
LLM
 ↓
Response
```

At every boundary, something important can happen:

```text
Authentication
Authorization
Agent selection
Delegation
Tool execution
Data retrieval
RAG retrieval
LLM invocation
Configuration change
Prompt change
Approval
Security violation
Failure/recovery
```

Therefore, CWD needs **end-to-end audit lineage**.

---

# 2. What Does an Audit Record Answer?

Every important audit event should help answer:

```text
WHO?
WHAT?
WHEN?
WHERE?
WHY?
HOW?
AGAINST WHICH RESOURCE?
UNDER WHICH POLICY?
WITH WHICH AGENT/VERSION?
WHAT WAS THE RESULT?
```

For example:

> Who accessed the confidential document?

```text
User: U-1001
Agent: finance-worker
Resource: DOC-2001
Action: READ
Policy: FINANCE-DATA-007
Decision: ALLOW
Time: ...
Correlation: CORR-7890
```

---

# 3. Audit vs Logging vs Observability

These are related but different.

| Capability              | Primary question                                              |
| ----------------------- | ------------------------------------------------------------- |
| **Logging**             | What information did the application record?                  |
| **Observability**       | What happened during execution and why?                       |
| **Audit**               | Can we prove and reconstruct an important action or decision? |
| **Security monitoring** | Is suspicious activity occurring?                             |
| **Evaluation**          | Was the agent/workflow good enough?                           |

For example:

```text
Application log:
"Tool call completed."

Observability:
"Tool call took 1.2 seconds and succeeded after one retry."

Audit:
"Tracking Worker, acting on behalf of authorized user U-1001,
invoked get_tracking_events against shipment SHIP123 under
policy P-1007 at timestamp T."
```

---

# 4. Audit Event Model

I recommend a canonical CWD audit-event envelope:

```json id="6q2v7f"
{
  "event_id": "AUD-9001",
  "event_type": "TOOL_EXECUTION",
  "event_version": "1.0",

  "timestamp": "2026-09-06T20:00:00Z",

  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "turn_id": "TURN-002",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-007",

  "actor": {
    "user_id": "U-1001",
    "agent_id": "tracking-worker",
    "agent_version": "2.4.1"
  },

  "action": {
    "type": "TOOL_EXECUTION",
    "resource": "shipment",
    "resource_id": "SHIP123",
    "tool": "get_tracking_events"
  },

  "authorization": {
    "decision": "ALLOW",
    "policy_id": "SHIP-READ-001"
  },

  "data": {
    "classification": "INTERNAL"
  },

  "result": {
    "status": "SUCCESS"
  }
}
```

The important point is that the audit record contains **references and metadata**, not necessarily the sensitive payload itself.

---

# 5. Correlation IDs Are the Backbone

CWD already has the execution hierarchy:

```text id="8v7k1k"
Correlation ID
      │
      ▼
   Session
      │
   Conversation
      │
     Turn
      │
   Workflow
      │
     Task
      │
      Run
      │
     Step
      │
     Event
```

For example:

```text id="7qqb4w"
CORR-7890
 ├── WF-1001
 │    ├── DT-5001
 │    │    ├── RUN-001
 │    │    └── RUN-002
 │    └── WT-1001
 │         └── RUN-003
 │              ├── STEP-001
 │              ├── STEP-002
 │              └── STEP-003
```

This lets an auditor reconstruct one business request across distributed services.

---

# 6. Authentication Audit

Authentication records answer:

> **Who established an identity?**

Example:

```json id="7i5v1r"
{
  "event_type": "AUTHENTICATION",
  "actor": {
    "user_id": "U-1001"
  },
  "authentication_method": "EntraID",
  "result": "SUCCESS",
  "application": "CWD-Gateway",
  "timestamp": "..."
}
```

Useful events include:

```text
LOGIN_SUCCESS
LOGIN_FAILURE
TOKEN_VALIDATION_SUCCESS
TOKEN_VALIDATION_FAILURE
SESSION_CREATED
SESSION_EXPIRED
IDENTITY_CHANGED
```

Never log:

```text
password
access token
client secret
private key
```

---

# 7. Authorization Audit

Authentication says:

> "This is user U-1001."

Authorization says:

> "Is U-1001 allowed to perform this operation?"

Example:

```json id="q4ow0g"
{
  "event_type": "AUTHORIZATION_DECISION",
  "actor": {
    "user_id": "U-1001",
    "agent_id": "finance-worker"
  },
  "action": "READ",
  "resource": "FINANCE_REPORT",
  "resource_id": "REPORT-1001",
  "policy_id": "FINANCE-007",
  "decision": "DENY",
  "reason_code": "MISSING_ENTITLEMENT"
}
```

Audit both:

```text
ALLOW
DENY
```

because denied access attempts are important security evidence.

---

# 8. Agent Execution Audit

CWD should record significant agent lifecycle events:

```text id="wcvdpu"
AGENT_SELECTED
AGENT_TASK_RECEIVED
AGENT_STARTED
AGENT_COMPLETED
AGENT_FAILED
AGENT_TIMEOUT
AGENT_RETRY
AGENT_FAILOVER
AGENT_ESCALATED
```

Example:

```json id="ckp04n"
{
  "event_type": "AGENT_SELECTED",
  "agent_id": "shipping-agent",
  "agent_version": "1.8.0",
  "capability": "shipment_delay_analysis",
  "selection_reason": "capability+health+authorization+availability",
  "correlation_id": "CORR-7890"
}
```

This is particularly important for dynamic routing.

---

# 9. Why Agent Version Must Be Audited

Suppose:

```text id="4zz65s"
Monday:
tracking-worker v2.4.1

Tuesday:
tracking-worker v2.5.0
```

A business result changes.

Without version information, troubleshooting becomes difficult.

Therefore record:

```text id="5uym77"
Agent ID
Agent Version
Prompt Version
Model Version
Tool Version
Workflow Version
```

when relevant.

This provides **execution reproducibility**.

---

# 10. Delegation Audit

Coordinator:

```text
Coordinator
 ↓
Shipping Delegator
```

Audit:

```json id="hrz07g"
{
  "event_type": "AGENT_DELEGATION",
  "source_agent": "coordinator",
  "target_agent": "shipping-delegator",
  "task_id": "DT-5001",
  "capability": "shipment_delay_analysis",
  "authorization": "ALLOW",
  "correlation_id": "CORR-7890"
}
```

This helps establish:

> Why did the Coordinator send this task to this agent?

---

# 11. Worker Selection Audit

Dynamic routing makes this particularly valuable.

Record:

```text id="fx7e4m"
Required capability
Candidate agents
Eligibility checks
Rejected candidates
Selected agent
Selection reason
Agent version
Health/readiness
Policy decision
```

Example:

```json id="03du5k"
{
  "event_type": "WORKER_SELECTION",
  "capability": "shipment_tracking",
  "selected_worker": "tracking-worker-03",
  "selection_factors": {
    "health": "healthy",
    "readiness": "ready",
    "authorization": "allowed",
    "version": "compatible",
    "load": "low"
  }
}
```

You don't necessarily need to store every internal routing calculation, but the decision evidence should be sufficient to explain the selection.

---

# 12. Tool Call Audit

For every significant MCP/API/tool invocation:

```text id="02g7l7"
Tool selected
Tool authorized
Arguments validated
Tool invoked
Tool completed/failed
Result validated
```

Example:

```json id="b0u7wm"
{
  "event_type": "TOOL_EXECUTION",
  "agent_id": "tracking-worker",
  "mcp_server": "shipping-mcp",
  "tool": "get_tracking_events",
  "resource": "SHIP123",
  "authorization": "ALLOW",
  "result": "SUCCESS",
  "duration_ms": 1240,
  "correlation_id": "CORR-7890"
}
```

Avoid recording full sensitive tool arguments/results unless explicitly required and protected.

---

# 13. Data Access Audit

This is one of the most important enterprise controls.

For example:

```text id="3q4f8k"
Worker
 ↓
Azure AI Search
 ↓
Document
```

Audit:

```json id="0a1x4k"
{
  "event_type": "DATA_ACCESS",
  "actor": {
    "user_id": "U-1001",
    "agent_id": "finance-worker"
  },
  "action": "READ",
  "resource_type": "DOCUMENT",
  "resource_id": "DOC-1001",
  "classification": "CONFIDENTIAL",
  "authorization": "ALLOW",
  "purpose": "financial_analysis",
  "correlation_id": "CORR-7890"
}
```

This gives the enterprise a data-access trail.

---

# 14. RAG Audit

For RAG, don't necessarily audit every chunk's entire text.

Instead record:

```text id="vabg78"
Query
Search index
Retrieval method
Number of candidates
Number authorized
Number rejected
Documents/chunks selected
Classification
Reranking
Context construction
LLM processing
```

For example:

```json id="d09jhe"
{
  "event_type": "RAG_RETRIEVAL",
  "index": "enterprise-knowledge",
  "retrieval_mode": "hybrid",
  "candidate_count": 50,
  "authorized_count": 18,
  "selected_count": 6,
  "classification_max": "CONFIDENTIAL",
  "security_filter": "finance-management",
  "correlation_id": "CORR-7890"
}
```

This lets you investigate:

> Why did this document reach the model?

---

# 15. LLM Audit

LLM calls should be auditable without storing sensitive prompts indiscriminately.

Record:

```text id="yyl1kt"
Model
Model version
Prompt ID
Prompt version
Agent
Workflow
Step
Input token count
Output token count
Latency
Result status
Context references
Policy decision
```

Example:

```json id="h6n4ap"
{
  "event_type": "LLM_INVOCATION",
  "agent_id": "shipping-worker",
  "prompt_id": "shipment-delay-analysis",
  "prompt_version": "2.2.0",
  "model": "approved-enterprise-model",
  "model_version": "v4",
  "input_tokens": 1840,
  "output_tokens": 420,
  "status": "SUCCESS",
  "context_references": [
    "DOC-1001",
    "TOOL-2001"
  ]
}
```

This gives reproducibility without creating a second sensitive-data repository.

---

# 16. Configuration Change Audit

Configuration is often overlooked.

CWD should audit changes to:

```text id="qk5hcg"
Agent configuration
Worker configuration
Routing rules
RBAC
Policies
Prompt versions
Model configuration
Tool permissions
MCP registrations
Agent Registry
DLP rules
Data classification rules
Feature flags
Environment configuration
```

Example:

```json id="83rq8g"
{
  "event_type": "CONFIGURATION_CHANGE",
  "actor": {
    "user_id": "ADMIN-100"
  },
  "resource": "routing-policy",
  "resource_id": "SHIPMENT-ROUTING",
  "change_type": "UPDATE",
  "previous_version": "3.1",
  "new_version": "3.2",
  "approval_id": "APR-1001",
  "timestamp": "..."
}
```

---

# 17. Prompt Change Audit

Since you have a Prompt Registry, prompt changes should be auditable.

Example:

```text id="qjst4d"
Prompt:
shipment-delay-analysis

v2.1.0
 ↓
Review
 ↓
Approval
 ↓
v2.2.0
 ↓
Production
```

Audit:

```json id="4a5m2g"
{
  "event_type": "PROMPT_PUBLISHED",
  "prompt_id": "shipment-delay-analysis",
  "version": "2.2.0",
  "author": "USER-100",
  "reviewer": "USER-200",
  "approval_id": "APR-1001",
  "environment": "PROD"
}
```

This supports change governance.

---

# 18. Approval Audit

For HITL:

```text id="br0msv"
Agent
 ↓
High-risk operation
 ↓
Policy
 ↓
Human Approval
 ↓
Continue / Reject
```

Audit both:

```text
APPROVAL_REQUESTED
APPROVAL_GRANTED
APPROVAL_DENIED
APPROVAL_EXPIRED
```

Example:

```json id="pr4t2v"
{
  "event_type": "HUMAN_APPROVAL",
  "approval_id": "APR-2001",
  "workflow_id": "WF-1001",
  "requested_action": "external_data_transfer",
  "risk_level": "HIGH",
  "approver": "USER-500",
  "decision": "DENIED",
  "timestamp": "..."
}
```

---

# 19. Security Event Audit

Security events should have dedicated event types.

Examples:

```text id="8e04hx"
AUTHENTICATION_FAILURE
AUTHORIZATION_DENIED
DLP_VIOLATION
PROMPT_INJECTION_DETECTED
UNAUTHORIZED_TOOL_ATTEMPT
CROSS_TENANT_ACCESS_ATTEMPT
PRIVILEGE_ESCALATION_ATTEMPT
INVALID_AGENT_IDENTITY
SUSPICIOUS_TOOL_USAGE
POLICY_VIOLATION
SECRET_EXPOSURE_ATTEMPT
```

Example:

```json id="u4v7ij"
{
  "event_type": "DLP_VIOLATION",
  "actor": {
    "agent_id": "finance-worker"
  },
  "data_classification": "RESTRICTED",
  "detected_type": "CREDENTIAL",
  "destination": "external-api",
  "action": "BLOCK",
  "policy_id": "DLP-007",
  "correlation_id": "CORR-7890"
}
```

---

# 20. Audit Sensitive Data Without Logging Sensitive Data

This is a critical architectural rule:

> **The audit trail must not become a data-exfiltration channel.**

Don't record:

```text id="8zhrpd"
Password
API key
Access token
Full SSN
Private key
Full confidential document
Full LLM prompt
Full tool response
```

Prefer:

```text id="u5dzan"
Data type
Classification
Resource ID/reference
Policy
Action
Decision
Hash/reference
Correlation ID
```

For example:

```json id="4l6x9m"
{
  "data_type": "SSN",
  "classification": "RESTRICTED",
  "action": "REDACT",
  "policy": "DLP-021",
  "result": "SUCCESS"
}
```

---

# 21. Audit Data vs Payload Data

Separate these concepts.

```text id="n9p4nz"
Audit Metadata
       │
       ├── Event ID
       ├── Actor
       ├── Action
       ├── Resource
       ├── Policy
       ├── Decision
       ├── Timestamp
       └── Correlation
       
Sensitive Payload
       │
       └── Secure controlled store/reference
```

This minimizes exposure.

---

# 22. Immutable Audit Trail

Audit records should have stronger integrity guarantees than ordinary application logs.

Consider:

```text id="wpgb5j"
Application
   ↓
Audit Event
   ↓
Durable Audit Store
   ↓
Immutable / Tamper-Evident Retention
```

Important properties:

```text id="qmsjke"
Append-oriented
Tamper-resistant
Access-controlled
Timestamped
Correlated
Retained according to policy
Searchable
Exportable for investigation
```

For highly sensitive environments, consider immutable/WORM-style retention and cryptographic integrity controls where required.

---

# 23. Audit Store vs Operational Database

Don't automatically put every audit event into Cosmos DB.

A useful separation is:

```text id="3p0zga"
Cosmos DB
   ↓
Operational application state

Audit Store
   ↓
Governed audit evidence

Azure Monitor / OpenTelemetry
   ↓
Runtime telemetry

Service Bus / Kafka
   ↓
Message/event transport
```

This keeps responsibilities clear.

---

# 24. Audit Event Flow

A mature CWD architecture can look like:

```text id="0b4h6s"
                    CWD
                     │
       ┌─────────────┼──────────────┐
       │             │              │
       ▼             ▼              ▼
 Authentication  Authorization   Execution
       │             │              │
       └─────────────┼──────────────┘
                     ▼
                Audit Events
                     │
                     ▼
             Audit Collector
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Audit Storage         Security SIEM
          │                     │
          ▼                     ▼
      Compliance           Detection/Alert
      Investigation
```

---

# 25. Audit Event Categories

I would define CWD audit events around these categories:

### Identity

```text
AUTHENTICATION
IDENTITY_CHANGE
SESSION_CREATED
SESSION_TERMINATED
```

### Authorization

```text
AUTHORIZATION_ALLOW
AUTHORIZATION_DENY
ENTITLEMENT_CHANGE
ROLE_CHANGE
PERMISSION_CHANGE
```

### Agent execution

```text
AGENT_SELECTED
AGENT_STARTED
AGENT_COMPLETED
AGENT_FAILED
AGENT_RETRIED
AGENT_FAILOVER
```

### Workflow

```text
WORKFLOW_STARTED
WORKFLOW_PAUSED
WORKFLOW_RESUMED
WORKFLOW_COMPLETED
WORKFLOW_FAILED
```

### Data

```text
DATA_ACCESS
RAG_RETRIEVAL
DATA_CLASSIFICATION
DLP_DETECTION
DATA_REDACTION
DATA_EXPORT
```

### Tools

```text
TOOL_SELECTED
TOOL_AUTHORIZED
TOOL_EXECUTED
TOOL_FAILED
```

### Governance

```text
PROMPT_CREATED
PROMPT_APPROVED
PROMPT_PUBLISHED
MODEL_APPROVED
MODEL_DEPLOYED
POLICY_CHANGED
```

### Human oversight

```text
APPROVAL_REQUESTED
APPROVAL_GRANTED
APPROVAL_DENIED
```

### Security

```text
SECURITY_VIOLATION
PROMPT_INJECTION
UNAUTHORIZED_ACCESS
PRIVILEGE_ESCALATION
CROSS_TENANT_ATTEMPT
```

---

# 26. Audit and CWD State Hierarchy

Your existing state hierarchy becomes very useful:

```text id="oih0kw"
Session
   ↓
Conversation
   ↓
Turn
   ↓
Workflow
   ↓
Task
   ↓
Run
   ↓
Step
   ↓
Audit Events
```

Example:

```text id="07yikd"
CORR-7890
 │
 └── WF-1001
      │
      ├── DT-5001
      │    └── RUN-003
      │         ├── STEP-001
      │         │    └── AUTHORIZATION
      │         ├── STEP-002
      │         │    └── AGENT_SELECTION
      │         ├── STEP-003
      │         │    └── RAG_RETRIEVAL
      │         └── STEP-004
      │              └── TOOL_EXECUTION
      │
      └── RESPONSE
```

This creates an **execution lineage**.

---

# 27. Audit + LangGraph

LangGraph controls workflow state and transitions.

Therefore, meaningful state transitions should produce audit events.

For example:

```text id="6yrv9a"
START
 ↓
AUTHORIZE
 ↓
DISCOVER_AGENT
 ↓
DELEGATE
 ↓
EXECUTE
 ↓
WAIT_FOR_APPROVAL
 ↓
RESUME
 ↓
AGGREGATE
 ↓
COMPLETE
```

Audit:

```text id="h7njc1"
WORKFLOW_STARTED
AUTHORIZATION_COMPLETED
AGENT_DISCOVERED
TASK_DELEGATED
TASK_STARTED
APPROVAL_REQUESTED
APPROVAL_GRANTED
WORKFLOW_RESUMED
WORKFLOW_COMPLETED
```

Not every internal state mutation needs to become a compliance audit event; choose meaningful, policy-relevant events.

---

# 28. Audit + Service Bus

When using asynchronous messaging, audit correlation becomes essential.

```text id="r4a7kw"
Coordinator
 ↓
A2A Task
 ↓
Service Bus
 ↓
Delegator
```

Record:

```text id="y21ov4"
message_id
correlation_id
workflow_id
task_id
parent_task_id
source_agent
target_agent
delivery attempt
processing status
```

This allows you to reconstruct asynchronous execution.

---

# 29. Audit + A2A

For A2A communication:

```text id="efx4a5"
Coordinator
      │
      │ A2A
      ▼
Delegator
```

Audit:

```text id="r2f7gi"
Who sent?
Which agent received?
Which task?
Which capability?
Which identity?
Which authorization?
Which correlation?
What result?
```

The audit record should not necessarily contain the entire A2A payload.

---

# 30. Audit + MCP

For MCP:

```text id="m1o2t7"
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Tool
 ↓
Enterprise System
```

Audit each meaningful security boundary:

```text id="m6zldf"
Tool discovery
Tool authorization
Tool invocation
Resource access
Tool result
DLP action
```

This makes it possible to answer:

> "Which agent used which enterprise capability to access this resource?"

---

# 31. Audit + Zero Trust

This fits directly into the Zero Trust model:

```text id="14xj4h"
VERIFY
   ↓
AUTHENTICATE
   ↓
AUTHORIZE
   ↓
EXECUTE
   ↓
MONITOR
   ↓
AUDIT
```

For every important action:

```text id="8k3e4k"
Identity
+
Context
+
Permission
+
Resource
+
Policy
+
Action
+
Result
```

should be traceable.

---

# 32. Audit + Least Privilege

Audit data should help detect violations of least privilege.

For example:

```text id="6m7t0p"
tracking-worker
```

normally uses:

```text
shipment.read
```

But suddenly:

```text
tracking-worker
 ↓
customer.salary.read
```

Audit + security analytics should detect:

```text
Unexpected capability
Unexpected resource
Unexpected volume
Unexpected destination
```

This is a powerful runtime security control.

---

# 33. Audit + DLP

DLP events should be auditable.

For example:

```text id="z2r4c6"
Worker
 ↓
Tool request
 ↓
DLP detects credential
 ↓
BLOCK
```

Audit:

```json id="0wqxk5"
{
  "event_type": "DLP_VIOLATION",
  "correlation_id": "CORR-7890",
  "agent_id": "worker-01",
  "data_type": "CREDENTIAL",
  "classification": "RESTRICTED",
  "destination": "external-api",
  "action": "BLOCK",
  "policy_id": "DLP-007"
}
```

This creates evidence without storing the credential.

---

# 34. Audit + Configuration Governance

Every production change should have:

```text id="b98x7e"
Who changed it?
What changed?
Old version
New version
Why?
Approval
When?
Environment
Deployment result
```

For example:

```text id="39a6r0"
Prompt v2.1
      ↓
Prompt v2.2
      ↓
Security Review
      ↓
Business Approval
      ↓
Production Deployment
```

The audit trail connects all these events.

---

# 35. Audit Retention

Retention should be policy-driven.

Different records may require different retention:

```text id="fh88to"
Operational telemetry
→ shorter retention

Security events
→ longer retention

Compliance audit records
→ policy/regulation dependent

Business transaction records
→ business retention policy
```

Don't retain everything forever.

Audit itself creates:

```text
Storage cost
Privacy risk
Security risk
Discovery/compliance obligations
```

So:

> **Audit what is required, retain it for the required period, protect it appropriately, and delete it according to policy.**

---

# 36. Audit Access Must Also Be Controlled

The audit system contains sensitive information.

Therefore:

```text id="7f1bmc"
Auditor
Security Team
Compliance
Platform Operator
Developer
```

should not necessarily have the same access.

For example:

```text
Developer
→ operational telemetry

Security Analyst
→ security events

Compliance Auditor
→ governed audit evidence

Administrator
→ controlled administrative records
```

Audit data itself needs:

```text
RBAC
Least privilege
Tenant isolation
Encryption
Access logging
Retention
```

And importantly:

> **Accessing audit records should itself be auditable.**

---

# 37. Audit Investigation Example

Suppose compliance asks:

> "Why did user U-1001 receive this confidential answer?"

You should be able to trace:

```text id="bq7r0a"
U-1001 authenticated
       ↓
Authorization = ALLOW
       ↓
Coordinator selected
       ↓
Finance Delegator selected
       ↓
Worker selected
       ↓
RAG retrieval
       ↓
Document DOC-1001
       ↓
ACL = ALLOW
       ↓
Classification = CONFIDENTIAL
       ↓
DLP = PASS
       ↓
LLM invocation
       ↓
Output validation = PASS
       ↓
Response delivered
```

All of these should share:

```text
CORR-7890
```

This is the real value of CWD auditability.

---

# 38. Audit Investigation for a Security Incident

Suppose a restricted document was accidentally exposed.

The investigator can query:

```text id="g4jpj4"
Document ID
      ↓
Who accessed it?
      ↓
Which agent?
      ↓
Which Worker?
      ↓
Which workflow?
      ↓
Which tool?
      ↓
Which user?
      ↓
Which policy?
      ↓
Which model?
      ↓
Which prompt?
      ↓
Which destination?
```

That is **end-to-end forensic lineage**.

---

# 39. Audit vs Evaluation

Another important distinction:

```text id="8t5r2r"
Audit:
"Did the system do X?"

Evaluation:
"Was doing X good/correct?"

Observability:
"How did X execute?"

Testing:
"Does the system behave as expected?"
```

Example:

```text
Audit:
Worker called tool X.

Observability:
Tool X took 2.1 seconds.

Evaluation:
Tool X was the correct tool.

Security:
User was authorized.

DLP:
No restricted data was transferred.
```

These complement one another.

---

# 40. Recommended CWD Audit Architecture

```text id="kgqk4v"
                     CWD
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
   Gateway        Coordinator     Workers
       │              │              │
       └──────────────┼──────────────┘
                      │
              Delegators / A2A
                      │
                MCP / Tools
                      │
                Data Access
                      │
                      ▼
              Audit Event SDK
                      │
                      ▼
              Audit Collector
                      │
             ┌────────┴────────┐
             ▼                 ▼
       Durable Audit       Security/SIEM
          Storage              │
             │                 ▼
             ▼              Alerts
        Compliance
        Investigation
```

Supporting:

```text
OpenTelemetry → Runtime Observability
Cosmos DB     → Operational State
Redis         → Working State
Service Bus   → Async Messaging
Key Vault     → Secrets
Entra ID      → Identity
Policy/IAM    → Authorization
```

---

# 41. Audit Event Lifecycle

```text id="q8hjhf"
Action Occurs
     ↓
Identify Actor
     ↓
Identify Resource
     ↓
Capture Context
     ↓
Capture Policy Decision
     ↓
Sanitize Sensitive Data
     ↓
Generate Audit Event
     ↓
Durable Audit Storage
     ↓
Security Monitoring
     ↓
Compliance / Investigation
```

---

# 42. Minimum Audit Fields

I would establish a standard CWD audit envelope containing:

```text id="1n0sm3"
event_id
event_type
event_version
timestamp

correlation_id
session_id
conversation_id
turn_id
workflow_id
task_id
run_id
step_id

user_id/reference
agent_id
agent_version
service_identity

action
resource
resource_id

authorization_decision
policy_id
classification

source
destination

status
error_code

approval_id
prompt_id
prompt_version
model_version

result_reference
```

Not every event needs every field, but the schema should support them.

---

# 43. Tamper Resistance

For high-value audit records, consider:

```text id="7q45s1"
Append-only storage
Immutable retention
Access-controlled writers
Restricted deletion
Hash chaining / integrity metadata
Trusted timestamps
Separation of audit writer and administrator
```

The objective is:

> **An administrator who can operate CWD should not automatically be able to silently rewrite the evidence of their own actions.**

That is an important separation-of-duties principle.

---

# 44. Audit Metrics

Useful operational metrics include:

```text id="8f4cwv"
Authentication failures
Authorization denials
Sensitive-data access
DLP violations
Unauthorized tool attempts
Agent execution failures
Configuration changes
Prompt changes
Policy changes
Approval requests
Approval denials
Security events
Cross-tenant attempts
Privilege escalation attempts
Audit ingestion failures
Audit storage failures
```

Also monitor:

```text
Audit Event Volume
Audit Processing Latency
Audit Delivery Failure Rate
Missing Correlation IDs
Malformed Audit Events
Audit Storage Availability
```

A failed audit pipeline can itself become a governance risk.

---

# 45. Critical Principle: Don't Let Audit Failure Become Silent

For some events, especially security/compliance-critical events:

```text id="z8tq2b"
Business Action
      │
      ▼
Audit Event
      │
      ▼
Audit Successfully Recorded?
   ┌──┴──┐
  YES    NO
   │      │
   ▼      ▼
Continue  Policy-dependent
           block/hold/fail
```

Whether an action must fail closed when audit is unavailable is a **risk-based enterprise policy decision**. For highly regulated operations, stronger fail-closed controls may be appropriate.

---

# 46. CWD Auditability Formula

```text id="xw4d9j"
CWD Auditability
=
Identity Evidence
+
Authentication Evidence
+
Authorization Evidence
+
Agent Execution Evidence
+
Workflow Evidence
+
Tool Evidence
+
Data Access Evidence
+
Configuration Evidence
+
Approval Evidence
+
Security Evidence
+
Correlation
+
Tamper Resistance
+
Retention
```

And:

```text id="09c2hk"
Audit Trail
=
WHO
+
WHAT
+
WHEN
+
WHERE
+
WHY
+
HOW
+
RESOURCE
+
POLICY
+
RESULT
```

# 47. Interview-Ready Answer

> **“In CWD, I treat auditability as a first-class cross-cutting capability rather than simply storing application logs. Every significant identity, authorization, agent, workflow, tool, data-access, configuration, approval, and security event is captured in a standardized, correlated audit-event model. We propagate correlation, workflow, task, run, and step identifiers across Gateway, Coordinator, Delegator, Worker, A2A, Service Bus, MCP, RAG, and enterprise systems so an individual business request can be reconstructed end to end. Authentication records establish who authenticated; authorization records establish why access was allowed or denied; agent and workflow events capture execution and routing; tool and data-access events capture enterprise resource usage; configuration and prompt events establish change lineage; approval events capture human decisions; and security/DLP events capture violations and enforcement actions. Audit records are sanitized so credentials, PII, tokens, and confidential payloads are not unnecessarily stored. Durable, access-controlled, tamper-resistant audit storage provides evidence for compliance and forensic investigation, while OpenTelemetry and Azure Monitor provide detailed runtime observability. Audit access itself is controlled and audited.”**

### Core definition

**CWD auditability is the governed capability to create a correlated, tamper-resistant, access-controlled record of significant identity, authorization, agent, workflow, tool, data-access, configuration, approval, and security events, allowing the enterprise to reconstruct who did what, when, against which resource, under which policy, using which agent/model/tool, and with what outcome—without turning the audit trail itself into a source of sensitive-data leakage.**
