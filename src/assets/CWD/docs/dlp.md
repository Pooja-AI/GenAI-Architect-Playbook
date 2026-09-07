Yes. In CWD, **Data Loss Prevention (DLP)** is the set of controls that prevents sensitive enterprise information from being unintentionally or maliciously exposed while it moves through the agentic workflow.

The key principle is:

> **Sensitive data must be classified, detected, minimized, authorized, filtered, redacted, and monitored before it crosses an agent, model, tool, integration, or user-facing boundary.**

This is especially important for CWD because data can travel through many more places than in a traditional application.

# 1. Why DLP is critical in CWD

A traditional application might have:

```text
User → Application → Database → Response
```

CWD can have:

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
 ├── LLM
 ├── RAG
 ├── MCP
 ├── API
 ├── Memory
 └── Other Agents
 ↓
Enterprise Systems
```

Sensitive information can therefore leak through:

```text
Prompt
Retrieved documents
Agent context
LLM output
Tool arguments
Tool results
A2A messages
Service Bus messages
Memory
Logs
Traces
API responses
Final response
```

DLP must therefore be **end-to-end**, not just a final-response filter.

---

# 2. What Counts as Sensitive Data?

CWD should define enterprise data classifications.

For example:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
```

Sensitive information may include:

```text
PII
PHI
Financial information
Payment information
Credentials
API keys
Passwords
Tokens
Encryption keys
Employee information
Customer information
Source code
Intellectual property
Security information
Export-controlled information
Confidential business data
```

The exact classification taxonomy should come from the organization's data-governance policy.

---

# 3. DLP Mental Model

Think of DLP as a pipeline:

```text
              DATA
                │
                ▼
          CLASSIFICATION
                │
                ▼
             DETECT
                │
                ▼
           IDENTIFY SENSITIVITY
                │
                ▼
          CHECK AUTHORIZATION
                │
                ▼
             MINIMIZE
                │
          ┌─────┴─────┐
          ▼           ▼
       ALLOW         BLOCK
          │
          ▼
        REDACT
          │
          ▼
       TRANSFORM
          │
          ▼
        MONITOR
          │
          ▼
         AUDIT
```

---

# 4. DLP Is Not Just "Block Sensitive Words"

A weak implementation might do:

```python
if "password" in text:
    block()
```

This is inadequate.

Sensitive information can appear as:

```text
"John's SSN is 123-45-6789"

"customer account 847291"

"API token: eyJ..."

"employee salary: $185,000"

"database connection string..."

"Project Falcon confidential design..."
```

DLP should combine multiple detection techniques:

```text
Pattern detection
+
Entity recognition
+
Classification
+
Metadata
+
Context
+
Policy
+
Destination
+
Identity
+
Risk
```

---

# 5. DLP at Request Ingestion

The first opportunity is the Gateway.

```text
User
 ↓
API Gateway
 ↓
DLP / Security Inspection
 ↓
Coordinator
```

Gateway-level controls can detect:

```text
Credentials
Malicious payloads
Oversized sensitive content
Known restricted patterns
Unsupported data types
Policy violations
```

But the Gateway should not attempt to perform every DLP decision.

It provides **early detection and protection**, while deeper controls occur downstream.

---

# 6. Prompt DLP

Consider a user entering:

> "Here is our production database password. Use it to investigate the issue."

Bad:

```text
User
 ↓
Password
 ↓
Prompt
 ↓
LLM
```

The secret has now entered the model context.

Better:

```text
User
 ↓
DLP detection
 ↓
Credential detected
 ↓
Block / redact
 ↓
Ask user to use approved integration
```

For example:

```text
Detected:
API_KEY
PASSWORD
ACCESS_TOKEN
```

Response path:

```text
Sensitive credential
       ↓
Do not send to LLM
       ↓
Use managed identity / Key Vault
```

---

# 7. Never Put Secrets in LLM Context

This is one of the strongest CWD DLP rules.

Never intentionally place:

```text
API keys
Passwords
Client secrets
Access tokens
Private keys
Database credentials
```

inside:

```text
System prompt
Developer prompt
User prompt
RAG context
Memory
A2A payload
LLM context
```

Instead:

```text
LLM
 ↓
Approved tool request
 ↓
Worker
 ↓
Managed Identity
 ↓
Key Vault
 ↓
Credential
 ↓
Enterprise API
```

The model asks for an operation; it does not receive the credential.

---

# 8. Retrieved Context DLP

RAG introduces an important DLP problem.

Suppose the user asks:

> "Give me information about Project Falcon."

Azure AI Search retrieves documents.

One document contains:

```text
CONFIDENTIAL
Employee compensation information...
```

The retrieval system must not simply pass it to the LLM because it is semantically relevant.

Correct pipeline:

```text
Query
 ↓
User Identity
 ↓
Entitlements
 ↓
ACL filtering
 ↓
Retrieval
 ↓
DLP / classification check
 ↓
Authorized + permitted chunks
 ↓
LLM
```

The rule is:

> **Relevant does not mean permissible.**

---

# 9. DLP + RAG

A secure RAG pipeline looks like:

```text
User
 ↓
Coordinator
 ↓
RAG Worker
 ↓
Identity + Entitlements
 ↓
Azure AI Search
 ↓
Security / ACL filtering
 ↓
Classification filtering
 ↓
DLP inspection
 ↓
Ranking
 ↓
Deduplication
 ↓
Context construction
 ↓
LLM
```

You can apply policies such as:

```text
User clearance = INTERNAL

Retrieved document = RESTRICTED

→ Don't provide document
```

or:

```text
User authorized
Document authorized
But field contains unnecessary PII

→ Redact field
```

---

# 10. Data Minimization

One of the strongest DLP controls is simply:

> **Don't send data that the model does not need.**

Bad:

```text
Customer Database
 ↓
Entire customer record
 ↓
LLM
```

Better:

```text
Customer Database
 ↓
Required fields
 ↓
Minimize
 ↓
LLM
```

For example, if the task is:

> "What is the customer's order status?"

The model may need:

```text
customer_id
order_id
order_status
shipment_status
```

It probably doesn't need:

```text
SSN
date_of_birth
credit_card
home_address
salary
```

---

# 11. Context Filtering

The CWD context builder should implement:

```text
Final Context
=
Required Data
∩
Authorized Data
∩
Relevant Data
∩
Allowed Classification
∩
Minimum Necessary Data
```

This prevents "context dumping."

Instead of:

```text
100 documents
50 tool responses
20 conversation turns
full database record
```

use:

```text
Relevant
+
Authorized
+
Minimal
+
Validated
```

---

# 12. Agent Output DLP

Even if the input was safe, the generated answer can expose sensitive information.

Example:

```text
Worker
 ↓
LLM
 ↓
Generated response
 ↓
Contains confidential salary information
```

Therefore:

```text
LLM Output
 ↓
DLP Inspection
 ↓
Sensitive-data detection
 ↓
Policy evaluation
 ↓
Redaction / block / transform
 ↓
User
```

The output validator can detect:

```text
PII
Credentials
Restricted information
Unauthorized records
Sensitive identifiers
Internal-only content
```

---

# 13. Output Validation

A useful pipeline is:

```text
LLM Output
    ↓
Schema Validation
    ↓
Business Validation
    ↓
Grounding Validation
    ↓
Security Validation
    ↓
DLP Validation
    ↓
Policy Validation
    ↓
Response
```

This is important because:

```text
Correct answer
≠
Safe answer
```

An answer can be factually correct but still violate enterprise policy.

---

# 14. Tool-Input DLP

Suppose an LLM generates:

```json
{
  "customer_name": "John Smith",
  "ssn": "123-45-6789",
  "address": "...",
  "credit_card": "..."
}
```

and tries to send all of this to an external tool.

The Worker should not blindly forward it.

Instead:

```text
LLM Tool Request
       ↓
Schema Validation
       ↓
DLP Inspection
       ↓
Data Minimization
       ↓
Authorization
       ↓
Tool Policy
       ↓
MCP
```

Potential result:

```text
Allowed:
customer_name

Removed:
SSN
credit_card
```

---

# 15. Tool-Output DLP

DLP also works in the opposite direction.

```text
Enterprise API
 ↓
MCP Tool
 ↓
Worker
```

The API may return:

```json
{
  "customer": "John",
  "order": "ORD-100",
  "status": "shipped",
  "ssn": "...",
  "credit_card": "..."
}
```

But the Worker only needs:

```json
{
  "order": "ORD-100",
  "status": "shipped"
}
```

So:

```text
Tool Result
 ↓
DLP
 ↓
Filter / redact
 ↓
Worker context
```

This prevents unnecessary sensitive data from entering the LLM context.

---

# 16. MCP + DLP

MCP is an integration protocol; it does **not automatically provide DLP**.

The secure pattern is:

```text
Worker
 ↓
MCP Client
 ↓
Tool Authorization
 ↓
Input DLP
 ↓
MCP Server
 ↓
Enterprise API
 ↓
Output DLP
 ↓
Worker
```

For each tool, define:

```text
Tool
Required permission
Allowed data classification
Allowed destinations
Input schema
Output schema
DLP policy
Rate limit
Risk level
HITL requirement
```

Example:

```json
{
  "tool": "customer_order_lookup",
  "allowed_data": [
    "INTERNAL"
  ],
  "restricted_fields": [
    "ssn",
    "credit_card",
    "password"
  ],
  "requires_authorization": true
}
```

---

# 17. A2A + DLP

Agents can also leak information to other agents.

Bad:

```text
Coordinator
 ↓
Full user profile
 ↓
Shipping Agent
```

The Shipping Agent doesn't need:

```text
employee_salary
medical_information
personal_phone
```

Instead:

```text
Coordinator
 ↓
Task-specific context projection
 ↓
Shipping Agent
```

For example:

```json
{
  "task_id": "DT-5001",
  "shipment_id": "SHIP123",
  "objective": "Analyze shipment delay",
  "required_context": {
    "shipment_status": true,
    "tracking_events": true
  }
}
```

This is **context-level least privilege**.

---

# 18. DLP + Agent-to-Agent Context

The rule should be:

> **Never propagate the entire upstream context simply because the downstream agent could technically receive it.**

Instead:

```text
Upstream State
      ↓
Context Projection
      ↓
Authorization
      ↓
DLP
      ↓
Minimum Required Context
      ↓
Downstream Agent
```

This reduces cross-agent data exposure.

---

# 19. Memory DLP

CWD memory can become a major leakage point.

Don't automatically store:

```text
Every conversation
Every tool response
Every retrieved document
Every credential
Every sensitive field
```

Instead:

```text
Conversation
 ↓
Memory Candidate
 ↓
Classification
 ↓
DLP
 ↓
Policy
 ↓
Retention decision
 ↓
Persistent Memory
```

For example:

```text
User preference:
"Preferred response format is concise."

→ Store ✓
```

But:

```text
"My password is ..."
```

should not become persistent memory.

---

# 20. Redis DLP

Redis may contain:

```text
Session context
Short-term memory
Temporary tool results
Workflow state
Cache
```

DLP should prevent sensitive information from unnecessarily entering Redis.

Especially avoid:

```text
API keys
Passwords
Access tokens
Private keys
```

And use:

```text
TTL
Encryption
Access controls
Tenant isolation
Data minimization
```

where appropriate.

---

# 21. Cosmos DB DLP

Cosmos may contain:

```text
Session state
Conversation-turn state
Task state
Run state
Step state
Execution references
```

Don't automatically persist complete:

```text
LLM context
Tool payloads
Retrieved documents
Secrets
Raw API responses
```

Instead use references:

```text
Step
 ↓
ResultReference
 ↓
Secure artifact/data store
```

This reduces unnecessary duplication of sensitive data.

---

# 22. Logs and Observability

This is one of the most frequently overlooked DLP areas.

Bad:

```text
logger.info(
    f"LLM prompt={prompt}"
)

logger.info(
    f"API response={response}"
)
```

The prompt or response might contain:

```text
PII
credentials
confidential data
customer information
source code
```

Instead log:

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "agent_id": "tracking-worker",
  "operation": "tracking_lookup",
  "status": "completed",
  "duration_ms": 1240,
  "data_classification": "CONFIDENTIAL",
  "result_reference": "result-001"
}
```

rather than the entire payload.

---

# 23. DLP and Observability

The observability system itself becomes a data-protection boundary.

Monitor:

```text
DLP violations
Sensitive-data detections
Blocked prompts
Blocked tool calls
Redactions
Unauthorized retrieval
Sensitive output attempts
Cross-tenant attempts
External data transfers
Policy violations
```

But don't create a new leak by logging the sensitive content that triggered the DLP rule.

Prefer:

```text
Detected type = PII
Classification = CONFIDENTIAL
Action = BLOCK
Policy = DLP-007
```

rather than:

```text
Detected SSN = 123-45-6789
```

---

# 24. External Integration DLP

Suppose a Worker wants to send information to an external SaaS API.

The DLP decision should consider:

```text
Who?
What data?
Why?
Where?
Which destination?
Which classification?
Is external transfer allowed?
```

Conceptually:

```text
Worker
 ↓
External API request
 ↓
Destination Policy
 ↓
Data Classification
 ↓
DLP
 ↓
Authorization
 ↓
Allow / Redact / Block
```

Example:

```text
INTERNAL data → approved internal API ✓

CONFIDENTIAL data → approved partner API ✓/policy-dependent

RESTRICTED data → public SaaS ✗
```

---

# 25. Data Egress Control

This is especially important for agentic systems.

The model may generate a tool request such as:

```text
"Send customer data to external-service.com"
```

The LLM must not determine whether that transfer is permitted.

Instead:

```text
LLM
 ↓
Tool Request
 ↓
Worker
 ↓
Destination Policy
 ↓
DLP
 ↓
Authorization
 ↓
Network/Egress Policy
 ↓
Tool
```

This prevents an agent from becoming an uncontrolled data-exfiltration mechanism.

---

# 26. Classification + Destination

DLP decisions can be represented conceptually as:

```text
ALLOW =
DataClassification
+
UserAuthorization
+
AgentAuthorization
+
ToolAuthorization
+
DestinationPolicy
+
BusinessPurpose
```

For example:

```text
Data = RESTRICTED
Destination = Public Internet

→ BLOCK
```

while:

```text
Data = INTERNAL
Destination = Approved Enterprise API

→ ALLOW
```

---

# 27. Redaction

Not every DLP violation requires blocking.

Sometimes the correct action is:

```text
Detect
 ↓
Redact
 ↓
Continue
```

Example:

```text
Original:

Customer John Smith
SSN 123-45-6789
Order ORD-1001
Status shipped
```

After DLP:

```text
Customer John Smith
SSN [REDACTED]
Order ORD-1001
Status shipped
```

The agent can continue without unnecessary sensitive information.

---

# 28. Tokenization / Masking

For some enterprise workflows, use:

```text
Tokenization
Masking
Pseudonymization
Redaction
Field filtering
Aggregation
```

Example:

```text
4111 1111 1111 1111
        ↓
**** **** **** 1111
```

The exact transformation depends on organizational policy and regulatory requirements.

---

# 29. DLP Decision Actions

A mature CWD DLP engine should support several actions:

```text
ALLOW
REDACT
MASK
TOKENIZE
TRANSFORM
QUARANTINE
REQUIRE_APPROVAL
BLOCK
AUDIT_ONLY
```

For example:

```text
Low-risk PII
 → Mask

Sensitive internal data
 → Allow internally

Restricted external transfer
 → Block

High-risk business operation
 → Human approval
```

---

# 30. DLP + Human-in-the-Loop

Some situations should not simply be automatically blocked.

For example:

```text
Worker wants to export CONFIDENTIAL report
```

The policy may say:

```text
DLP detection
      ↓
Risk classification
      ↓
Human approval
      ↓
Approved?
 ┌────┴────┐
YES       NO
 │         │
 ▼         ▼
Export    Block
```

LangGraph can checkpoint the workflow while waiting for approval.

---

# 31. DLP + Policy Engine

DLP should work with—not replace—authorization.

For example:

```text
User is authorized
        +
Data is sensitive
        +
Destination is external
        +
Policy prohibits external transfer
        ↓
BLOCK
```

Therefore:

```text
Authorization
     +
DLP
     +
Policy
     +
Destination Control
```

provide stronger protection than any one control.

---

# 32. DLP Across the Complete CWD Pipeline

A mature architecture looks like:

```text
                         USER
                           │
                           ▼
                       GATEWAY
                           │
                    DLP / validation
                           │
                           ▼
                     COORDINATOR
                           │
                    Policy + DLP
                           │
                           ▼
                      DELEGATOR
                           │
                    Context filtering
                           │
                           ▼
                        WORKER
                           │
               ┌───────────┴───────────┐
               ▼                       ▼
             RAG                      MCP
               │                       │
        ACL + DLP                Tool DLP
               │                       │
               ▼                       ▼
          LLM Context              API/Data
               │                       │
               └───────────┬───────────┘
                           ▼
                    Output Validation
                           │
                    DLP / Redaction
                           │
                           ▼
                       RESPONSE
```

---

# 33. DLP + CWD Components

| CWD component | DLP responsibility                                               |
| ------------- | ---------------------------------------------------------------- |
| Gateway       | Detect obvious sensitive input and enforce ingress policy        |
| Coordinator   | Enforce enterprise data-use and workflow policy                  |
| Delegator     | Minimize domain context passed to Workers                        |
| Worker        | Validate and minimize task/tool/data payloads                    |
| RAG Worker    | ACL filtering, classification, DLP, context minimization         |
| MCP Client    | Validate tool requests                                           |
| MCP Server    | Tool/data boundary DLP and authorization                         |
| LLM           | Generate within controlled context; never be the DLP authority   |
| A2A           | Restrict and inspect inter-agent context                         |
| Service Bus   | Protect message payloads and avoid sensitive data where possible |
| Redis         | Minimize/categorize short-lived sensitive context                |
| Cosmos        | Minimize durable sensitive state                                 |
| Key Vault     | Protect secrets/keys/certificates                                |
| Observability | Detect violations without logging sensitive payloads             |
| Policy Engine | Determine allowed data use/transfer                              |
| HITL          | Approve high-risk data operations                                |

---

# 34. DLP Detection Pipeline

A practical detection engine can use:

```text
Input
 ↓
Schema validation
 ↓
Data classification
 ↓
Pattern detection
 ↓
Sensitive entity detection
 ↓
Credential detection
 ↓
Metadata inspection
 ↓
Destination inspection
 ↓
Identity/entitlement check
 ↓
Policy evaluation
 ↓
Risk scoring
 ↓
Action
```

Potential detection technologies include:

```text
Regex / pattern matching
Microsoft Purview sensitivity labels
Microsoft Purview DLP capabilities
Azure AI services / classifiers
Custom ML classifiers
NER models
Enterprise classification services
Schema-based detection
Metadata-based classification
```

The exact combination depends on your organization's Microsoft security and data-governance architecture.

---

# 35. Example DLP Rule

Conceptually:

```json
{
  "policy_id": "DLP-007",
  "name": "Prevent-Credential-Exposure",
  "data_types": [
    "PASSWORD",
    "API_KEY",
    "ACCESS_TOKEN",
    "PRIVATE_KEY"
  ],
  "sources": [
    "prompt",
    "tool_result",
    "rag_context",
    "memory"
  ],
  "destinations": [
    "llm",
    "a2a",
    "external_api",
    "logs"
  ],
  "action": "BLOCK",
  "audit": true
}
```

Another rule:

```json
{
  "policy_id": "DLP-021",
  "name": "Minimize-PII",
  "data_types": [
    "SSN",
    "DOB",
    "PHONE"
  ],
  "destination": "llm",
  "action": "REDACT",
  "audit": true
}
```

---

# 36. DLP Risk Scoring

You can conceptually calculate risk using:

```text
DLP Risk =
Data Sensitivity
×
Destination Risk
×
User/Agent Risk
×
Operation Risk
×
Exposure Scope
```

For example:

```text
Restricted data
×
External destination
×
Autonomous Worker
×
Write/export operation
```

would produce a much higher risk than:

```text
Internal data
×
Internal read-only API
×
Authorized Worker
```

Risk thresholds can then determine:

```text
LOW
 → Allow

MEDIUM
 → Redact / monitor

HIGH
 → Approval

CRITICAL
 → Block
```

---

# 37. DLP vs Authorization

These are different.

### Authorization asks:

> **Is this identity allowed to access the data?**

### DLP asks:

> **Even if the identity can access it, is it safe and permitted to move/use/disclose this data in this way?**

Example:

```text
User is authorized to see salary data
        ↓
YES

But user asks agent to send it
to public external service
        ↓
DLP
        ↓
BLOCK
```

Therefore:

```text
Authorization ≠ DLP
```

Both are required.

---

# 38. DLP vs Encryption

Encryption protects data from unauthorized interception/storage access.

DLP controls **what data is allowed to move where and how it can be used**.

```text
Encryption
=
Protect the data

DLP
=
Control the data flow
```

They complement each other.

---

# 39. DLP vs Data Classification

Classification says:

```text
"What sensitivity level is this data?"
```

DLP says:

```text
"What should happen because of that sensitivity?"
```

Example:

```text
Document = RESTRICTED

DLP Policy:
RESTRICTED + external destination
→ BLOCK
```

---

# 40. DLP + Zero Trust

This fits directly into your previous CWD Zero Trust architecture.

```text
Zero Trust
     ↓
Verify identity
     ↓
Verify authorization
     ↓
Verify resource
     ↓
Verify data classification
     ↓
Verify destination
     ↓
Apply DLP
     ↓
Minimize data
     ↓
Execute
     ↓
Monitor
```

Even if an agent is trusted:

> **The data flow itself must still be evaluated.**

---

# 41. DLP Monitoring Metrics

CWD should monitor:

```text
DLP detections
DLP blocks
DLP redactions
Sensitive-data transfer attempts
Credential exposure attempts
Unauthorized data access
Cross-tenant data attempts
Restricted-data retrieval
External data-transfer attempts
Sensitive output violations
Tool DLP violations
A2A data violations
RAG classification violations
DLP false positives
DLP false negatives
Human approval requests
```

Useful metrics:

```text
DLP Violation Rate
=
DLP Violations / Total Data Flow Events
```

```text
DLP Block Rate
=
Blocked Sensitive Transfers / Sensitive Transfer Attempts
```

```text
DLP Redaction Rate
=
Redacted Outputs / Outputs Containing Detected Sensitive Data
```

---

# 42. DLP Observability Example

A DLP event should be correlated:

```json
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-007",
  "agent_id": "tracking-worker",
  "data_classification": "CONFIDENTIAL",
  "detected_type": "PII",
  "source": "tool_result",
  "destination": "llm_context",
  "action": "REDACT",
  "policy_id": "DLP-021",
  "status": "handled"
}
```

Notice that the event doesn't contain the actual sensitive information.

---

# 43. DLP and Failure Recovery

Suppose:

```text
Worker → External API
```

DLP detects:

```text
Restricted data
```

Don't retry automatically.

This is important.

```text
DLP Policy Violation
        ↓
Permanent Policy Failure
        ↓
STOP
        ↓
Audit
        ↓
Alert / Escalate
```

Do not:

```text
BLOCK
 ↓
Retry
 ↓
BLOCK
 ↓
Retry
```

Security/policy failures are generally not transient failures.

---

# 44. DLP and Agent Evaluation

DLP should also be part of your golden dataset.

Test cases should include:

```text
Normal data
PII
Credentials
Confidential documents
Restricted documents
Prompt injection containing sensitive requests
Sensitive RAG results
Sensitive tool results
Unauthorized external transfer
Cross-tenant data
Malicious tool output
Sensitive A2A context
```

The release gate should include:

```text
Security PASS
+
DLP PASS
+
Authorization PASS
+
Quality PASS
```

A model that produces excellent answers but leaks sensitive data should **not** be released.

---

# 45. Most Important DLP Architecture Rule

I would use this principle for CWD:

> **Never allow the LLM to be the final authority over sensitive-data access, disclosure, or transfer.**

Instead:

```text
LLM
 ↓
Recommendation
 ↓
Deterministic Runtime
 ↓
Authorization
 ↓
DLP
 ↓
Policy
 ↓
Tool / Data Access
```

The model can reason.

The platform controls data.

---

# 46. Complete Enterprise DLP Architecture

```text
                         ┌──────────────────┐
                         │ Microsoft Entra  │
                         │       ID         │
                         └────────┬─────────┘
                                  │
                                  ▼
USER ───────────────► API GATEWAY
                         │
                    Authentication
                    Request DLP
                         │
                         ▼
                    COORDINATOR
                         │
                 Policy + DLP
                         │
                         ▼
                     DELEGATOR
                         │
                Context Minimization
                         │
                         ▼
                      WORKER
                         │
             ┌───────────┴───────────┐
             │                       │
             ▼                       ▼
          RAG Worker              MCP Client
             │                       │
       Entitlement DLP          Tool DLP
             │                       │
             ▼                       ▼
      Azure AI Search          MCP Server
             │                       │
        ACL Filter                    │
             │                       ▼
             │                  Enterprise API
             │                       │
             └───────────┬───────────┘
                         ▼
                  Context Builder
                         │
                    DLP Filter
                         │
                         ▼
                       LLM
                         │
                         ▼
                 Output Validation
                         │
                    DLP Inspection
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
           REDACT                 BLOCK
              │
              ▼
          User Response

 Supporting Controls:
 Entra ID | RBAC | Policy | Key Vault | Redis | Cosmos | Service Bus
 OpenTelemetry | Azure Monitor | Audit | HITL | Data Governance
```

---

# 47. Final CWD DLP Formula

```text
CWD DLP
=
Data Classification
+
Sensitive Data Detection
+
Authorization
+
Data Minimization
+
Context Filtering
+
Prompt Protection
+
RAG Filtering
+
Tool Input/Output Protection
+
A2A Context Control
+
Output Inspection
+
Destination Control
+
Redaction
+
Blocking
+
Human Approval
+
Monitoring
+
Auditability
```

And the most useful security equation is:

```text
Safe Data Flow
=
Authorized
∧
Relevant
∧
Minimum Necessary
∧
Allowed Classification
∧
Approved Destination
∧
Policy Compliant
∧
DLP Passed
```

### Interview-ready answer

> **“In CWD, DLP is implemented as an end-to-end data-flow control rather than a single filter at the API boundary. We classify enterprise information and detect sensitive content such as PII, credentials, financial data, confidential information, and restricted data as it moves through prompts, RAG context, memory, A2A messages, MCP tool inputs and outputs, agent responses, and enterprise integrations. Before sensitive data reaches an LLM or downstream system, CWD applies identity and entitlement checks, data minimization, classification policies, destination controls, and DLP rules. Depending on risk, the platform can allow, redact, mask, transform, require human approval, or block the operation. Credentials are kept outside model context and retrieved through managed identity and Key Vault. RAG applies ACL and entitlement filtering before context construction, while tool and MCP boundaries validate both input and output. Agent outputs are inspected again before being returned to the user. DLP events are correlated with workflow, task, run, step, agent, tool, and policy identifiers for monitoring and audit, while sensitive payloads themselves are not unnecessarily logged. This creates defense-in-depth against accidental disclosure, prompt injection, unauthorized data transfer, cross-agent leakage, and external data exfiltration.”**

**Core definition:** **Data Loss Prevention in CWD is the defense-in-depth capability that detects, classifies, minimizes, filters, redacts, blocks, and monitors sensitive enterprise information as it flows through users, prompts, agent context, RAG, memory, A2A communication, MCP tools, agent outputs, and enterprise integrations, ensuring that only authorized, necessary, policy-compliant data reaches each destination.**
