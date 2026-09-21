## What information should never be logged?

In CWD, I follow **data minimization**: logs should contain enough information for troubleshooting and auditing, but never become a copy of sensitive production data.

### Never log these

```text id="m8zq4p"
❌ Passwords
❌ API keys
❌ OAuth access/refresh tokens
❌ Client secrets
❌ Private keys / certificates
❌ Database credentials
❌ Session secrets
```

These should be stored in **Key Vault / Secrets Manager** and referenced securely.

---

### 1. Authentication credentials

Never log:

```text
Authorization: Bearer eyJ...
client_secret=...
password=...
refresh_token=...
```

Instead log:

```text
authentication = success
user_id = U123
```

---

### 2. Sensitive personal information

Avoid logging unnecessary:

* SSN
* bank/account information
* credit-card numbers
* personal addresses
* phone numbers
* personal email addresses
* government ID numbers
* health information

If business requirements require some identifier, **mask or tokenize it**.

```text
❌ SSN = 123-45-6789

✓ SSN = ***-**-6789
```

---

### 3. Confidential HR information

For the CWD example:

```text
❌ Employee salary
❌ Performance review
❌ Disciplinary records
❌ Compensation details
❌ Private employee documents
```

Instead:

```text
action = HR_RECORD_ACCESS
employee_id = EMP-123
authorization = denied
```

---

### 4. Secrets inside MCP calls

Never log:

```text id="o7y5z2"
MCP request:
{
  "api_key": "...",
  "password": "...",
  "access_token": "..."
}
```

Log metadata:

```text id="y0x3px"
tool = get_customer
status = success
latency_ms = 820
```

---

### 5. Full confidential prompts/responses

In GenAI systems, prompts and responses can contain sensitive enterprise data.

For example, don't blindly log:

```text
❌ Full HR document
❌ Full customer record
❌ Confidential source code
❌ Entire ServiceNow ticket
❌ Entire Salesforce response
```

Instead capture safe metadata:

```text
prompt_version = v17
model = GPT-...
input_tokens = 2400
output_tokens = 500
status = success
```

If prompt/response capture is genuinely required for debugging or evaluation, apply **redaction, access controls, retention limits, and approved secure storage**.

---

### 6. Encryption keys

Never log:

```text
❌ Encryption keys
❌ Key Vault secret values
❌ Certificates' private keys
```

You can log:

```text
key_version = v3
operation = encrypt
status = success
```

---

## What about customer IDs?

A customer ID isn't automatically a secret, but it can still be sensitive depending on the environment.

Instead of putting unnecessary business data in every log, I use:

```text
customer_id = C12345
```

only when needed for troubleshooting/audit and when access to those logs is appropriately restricted.

For more sensitive identifiers, use masking or tokenization.

---

## CWD logging principle

```text id="5s4d8h"
                 Production Data
                      ↓
              Data Minimization
                      ↓
              Redaction / Masking
                      ↓
                  Safe Logs
                      ↓
        Restricted Access + Retention
```

### What I DO log

```text id="7c3f1m"
✓ correlation_id
✓ trace_id
✓ task_id
✓ tenant_id
✓ agent/worker name
✓ tool name
✓ authorization decision
✓ status
✓ latency
✓ error type
✓ retry count
✓ model/version
✓ token counts
```

### Interview-ready answer

> **“I never log credentials, API keys, OAuth tokens, passwords, private keys, or other authentication secrets. I also avoid logging unnecessary PII, confidential HR information, financial data, or full customer records. In GenAI, I don't blindly log complete prompts, retrieved documents, or model responses because they can contain sensitive enterprise data. I use structured metadata such as trace ID, task ID, tool name, status, latency, and error type, and apply masking or redaction when sensitive values are unavoidable.”**

### Strong interview line

> **“Logs are part of the security boundary. I never allow troubleshooting telemetry to become a source of data leakage.”**
