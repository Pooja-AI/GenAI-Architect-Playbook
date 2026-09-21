## How do you protect PII in CWD?

**PII (Personally Identifiable Information)** is information that can identify or be linked to an individual, such as name, email, phone number, address, employee ID, or other sensitive identifiers.

In CWD, I use **data minimization + access control + masking/redaction + encryption + monitoring**.

### CWD PII protection flow

```text id="p9x4m2"
User
 ↓
Entra ID
 ↓
Authentication + RBAC + Entitlement
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Enterprise System
 ↓
PII Filtering / Redaction
 ↓
Only required data
 ↓
LLM
 ↓
Validated Response
```

### 1. Identify PII

During ingestion or data processing, I identify sensitive fields.

For example:

```text id="v4k7p1"
Name
Email
Phone
Address
Employee ID
Customer contact information
```

Depending on the business and regulatory requirements, I classify the data and apply appropriate handling rules.

---

### 2. Data minimization

The most important rule is:

> **Don't send PII to the LLM unless it is actually required.**

Suppose the user asks:

> "How many open incidents does C12345 have?"

The Worker only needs:

```json id="c2m8q5"
{
  "customer_id": "C12345",
  "incident_count": 3,
  "statuses": ["Open", "Open", "Open"]
}
```

It doesn't need to send:

```text
Customer name
Personal phone
Email
Home address
```

to the LLM.

---

### 3. RBAC + entitlement

Even if a user is authenticated, they shouldn't automatically receive all PII.

```text id="r6w3n8"
User
 ↓
RBAC
 ↓
Data entitlement
 ↓
Can user access this customer's PII?
       ↓
    YES → Continue
    NO  → Deny / redact
```

For RAG, ACL filtering happens **before the document/chunk reaches the LLM**.

---

### 4. Mask or redact PII

If PII is not required, I can mask it.

For example:

```text id="k8p3s2"
Before:
john.smith@company.com
+1-555-123-4567

After:
j***@company.com
+1-***-***-4567
```

For highly sensitive information, I may completely redact it:

```text id="w2c7n4"
Customer SSN: [REDACTED]
```

---

### 5. Protect PII in RAG

During ingestion, I can classify or detect sensitive information and apply the appropriate policy.

```text id="m5q8r1"
Enterprise Document
      ↓
PII Detection / Classification
      ↓
Metadata + ACL
      ↓
Chunking
      ↓
Embedding / Indexing
      ↓
ACL-filtered Retrieval
      ↓
LLM
```

Depending on the use case, sensitive fields can be removed, masked, encrypted, or retained with strict access controls.

---

### 6. Protect PII in MCP responses

Suppose ServiceNow returns:

```json id="f4t9k2"
{
  "incident_id": "INC1001",
  "description": "Contact John Smith at john@company.com",
  "phone": "+1-555-123-4567"
}
```

If the Worker only needs the incident status, the application should transform the response:

```json id="u7m3p6"
{
  "incident_id": "INC1001",
  "status": "Open",
  "priority": "High"
}
```

So unnecessary PII never reaches the LLM.

---

### 7. Encrypt PII

I protect PII:

```text id="x6v2r9"
In transit → TLS
At rest    → Azure encryption
Secrets    → Key Vault
```

Access to stored data is controlled through identities and RBAC.

---

### 8. Don't expose PII in logs

This is especially important for GenAI systems because prompts, tool responses, and traces can accidentally contain sensitive information.

Instead of:

```text id="n3k8q5"
LOG:
Customer = John Smith
Email = john@company.com
Phone = +1-555...
```

I log:

```text id="a8r2m6"
LOG:
correlation_id=C789
worker=customer-worker
tool=get_customer
status=success
```

Sensitive fields are redacted or excluded according to the logging policy.

---

### 9. Prevent PII leakage through prompts

I also protect against prompts such as:

> "Give me all customer personal information."

The LLM doesn't get to decide whether that request is allowed.

```text id="b7q4n9"
User Request
 ↓
Authorization
 ↓
PII policy
 ↓
Entitlement
 ↓
Allowed data only
 ↓
LLM
```

---

## Interview-ready answer

> **“I protect PII in CWD using data minimization, authorization, redaction, encryption, and monitoring. First, I identify and classify sensitive fields. Then I enforce Entra ID authentication, RBAC, and data-level entitlements before accessing the data. I only send the minimum PII required for the task to the LLM, and unnecessary fields are masked or removed. For RAG, ACL filtering happens before documents reach the model, and for MCP responses I filter sensitive fields before passing the result to the LLM. PII is encrypted in transit and at rest, secrets are stored in Key Vault, and sensitive information is redacted from logs and traces. Most importantly, the LLM is never responsible for deciding whether a user is allowed to access PII—the application and enterprise authorization layers enforce that.”**

### Easy memory

**Detect → Authorize → Minimize → Redact → Encrypt → Don't log → Monitor**

**Key interview line:**

> **“PII should be protected before it reaches the LLM, not after the LLM has already seen it.”**
