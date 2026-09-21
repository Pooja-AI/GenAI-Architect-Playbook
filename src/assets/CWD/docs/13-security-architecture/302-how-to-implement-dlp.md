## How do you implement DLP in CWD?

**DLP (Data Loss Prevention)** means preventing sensitive enterprise data—such as PII, confidential customer information, credentials, or proprietary data—from being exposed to an unauthorized user, LLM, tool, log, or external system.

In CWD, I implement DLP as a **policy enforcement layer across the entire agent workflow**, not as a single filter.

### CWD DLP flow

```text
User Request
     ↓
Entra ID
     ↓
Authentication + RBAC
     ↓
DLP / Policy Check
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
MCP
     ↓
Enterprise Data
     ↓
DLP / Classification / Redaction
     ↓
LLM
     ↓
Output DLP Check
     ↓
User
```

### 1. Classify sensitive data

First, I define what data needs protection.

For example:

```text
PUBLIC
INTERNAL
CONFIDENTIAL
RESTRICTED
PII
FINANCIAL
CREDENTIAL / SECRET
```

Example:

```text
Customer email       → PII
Customer contract    → Confidential
API key              → Secret
Employee SSN         → Restricted
```

The classification can be represented as metadata and used by downstream policy checks.

---

### 2. Apply DLP before retrieval

For RAG, I don't retrieve everything and then let the LLM decide.

During ingestion:

```text
Document
 ↓
PII / Sensitive-data detection
 ↓
Classification
 ↓
Metadata + ACL
 ↓
Index
```

Example metadata:

```json
{
  "document_id": "DOC123",
  "classification": "CONFIDENTIAL",
  "allowed_groups": ["Sales-Team"],
  "contains_pii": true
}
```

At query time:

```text
User
 ↓
Identity + Entitlement
 ↓
Azure AI Search
 ↓
ACL + classification filtering
 ↓
Authorized chunks
 ↓
LLM
```

---

### 3. DLP at MCP boundary

Suppose an Incident Worker calls:

```text
get_customer(customer_id="C12345")
```

Salesforce might return much more information than the Worker needs.

I apply **response filtering/data minimization**:

```text
Salesforce
     ↓
MCP Server
     ↓
DLP / Policy
     ↓
Remove unnecessary PII
     ↓
Worker
     ↓
LLM
```

For example:

```json
{
  "customer_id": "C12345",
  "incident_status": "Open",
  "priority": "High"
}
```

instead of passing unnecessary personal information to the model.

---

### 4. DLP on LLM input

Before sending information to the LLM, I check:

```text
Does this request contain sensitive data?
        ↓
Is the user authorized?
        ↓
Is this data required for this task?
        ↓
Can it be masked?
        ↓
Allow / Redact / Block
```

For example:

```text
SSN = 123-45-6789
        ↓
[REDACTED]
```

if the SSN isn't required.

---

### 5. DLP on LLM output

I also check the **model's response before returning it to the user**.

```text
LLM Response
     ↓
Output DLP
     ↓
PII / Secret / Restricted-data detection
     ↓
 ┌───────────────┐
 │ Safe          │ → User
 │ Sensitive     │ → Redact
 │ Unauthorized  │ → Block
 └───────────────┘
```

This protects against accidental leakage or model-generated sensitive information.

---

### 6. Protect secrets

Secrets require particularly strict handling.

The LLM should never receive:

```text
API keys
Passwords
Client secrets
Access tokens
Private keys
```

For example:

```text
❌ Prompt:
"Here is the Salesforce API key: XXXXX"

✓ Application:
Managed Identity / OAuth / Key Vault
```

Credentials should be handled by the application/security layer, not by the LLM.

---

### 7. DLP for agent-to-agent communication

A2A messages also need policy controls.

I don't blindly send the entire Coordinator state to a Delegator.

Instead:

```json
{
  "task_id": "T1001",
  "intent": "customer_briefing",
  "customer_id": "C12345",
  "required_capability": "incident.read"
}
```

Only the information required by the Delegator is passed.

This follows **data minimization**.

---

### 8. DLP for logs and observability

GenAI systems can accidentally leak sensitive data through:

* prompts
* completions
* tool responses
* traces
* error messages
* debugging logs

So I apply masking/redaction before storing telemetry.

```text
Raw response
     ↓
PII / secret detection
     ↓
Redaction
     ↓
Application Insights / Log Analytics / Langfuse
```

For example:

```text
Before:
email=john.smith@company.com

After:
email=[REDACTED]
```

---

### 9. Audit and alert

For every DLP decision, I can capture:

```text
correlation_id
user/agent identity
data classification
policy triggered
source
destination
action = allow / redact / block
timestamp
```

Then alert on patterns such as:

```text
Repeated PII leakage attempts
Unauthorized customer-data access
Secret detected in prompt
Restricted document retrieval
Large-volume data extraction
```

---

## DLP vs RBAC

This is an important interview distinction.

**RBAC asks:**

> "Is this identity allowed to perform this operation?"

**DLP asks:**

> "Can this sensitive data safely move to this destination or be exposed?"

Example:

```text
User has customer.read
        ↓
RBAC → ALLOWED
        ↓
Retrieved record contains PII
        ↓
DLP → Remove unnecessary PII
        ↓
LLM receives minimized data
```

So **RBAC and DLP complement each other**.

---

## Interview-ready answer

> **“I implement DLP in CWD as a policy layer across the complete data flow. First, I classify sensitive data such as PII, confidential information, and secrets. At ingestion and retrieval, I apply ACL, entitlement, and classification filtering so unauthorized data never reaches the LLM. At the MCP boundary, I minimize and filter enterprise-system responses before passing them to the Worker or model. I also inspect LLM inputs and outputs for sensitive data and redact or block violations. Secrets such as API keys and tokens are never passed through prompts or agent state and are managed through secure identity and secret-management mechanisms. Finally, I apply PII redaction to logs and traces and audit DLP decisions. The key principle is that DLP is enforced before, during, and after LLM processing.”**

### Easy memory

**Classify → Authorize → Minimize → Filter → Redact → Block → Audit**

And a strong interview line:

> **“RBAC controls who can access data; DLP controls how sensitive data is allowed to flow.”**
