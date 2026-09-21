## How do you protect secrets?

**Secrets** include API keys, passwords, database credentials, client secrets, certificates, and access tokens.

In CWD, my main principle is:

> **Never hard-code secrets or pass secrets through the LLM, A2A messages, MCP payloads, or logs.**

### CWD secret-management flow

```text id="f0s6ja"
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Managed Identity / Workload Identity
 ↓
Entra ID
 ↓
Key Vault (only when a secret is actually required)
 ↓
MCP Server
 ↓
Salesforce / ServiceNow
```

### 1. Don't hard-code secrets

❌ Never:

```python
SALESFORCE_PASSWORD = "MyPassword123"
API_KEY = "sk-xxxxx"
```

Also don't store them in Git, Docker images, notebooks, or configuration files committed to source control.

---

### 2. Prefer Managed Identity

For Azure-hosted CWD components, I prefer **Managed Identity**.

```text id="q9k3vt"
Worker
  ↓
Managed Identity
  ↓
Entra ID
  ↓
Access Token
  ↓
Azure Resource
```

The application doesn't need to store a client secret.

---

### 3. Use Key Vault when a secret is unavoidable

For legacy systems that require credentials:

```text id="j5n8cx"
Worker / MCP Server
       ↓
Managed Identity
       ↓
Azure Key Vault
       ↓
Retrieve required secret
       ↓
Connect to enterprise system
```

The application gets permission to read **only the specific secret it needs**.

---

### 4. Apply least privilege

For example:

```text id="m7c2pa"
Incident Worker
   → read ServiceNow credential
   → NO Salesforce admin credential
   → NO Key Vault administrator access
```

Use RBAC/access policies to restrict secret access.

---

### 5. Never put secrets into LLM context

This is especially important for GenAI.

Don't do:

```text id="s2w6hd"
Prompt:
"Use this Salesforce password: XXXXX"
```

or:

```text id="g4k1zm"
A2A message:
{
   "password": "XXXXX"
}
```

or:

```text id="v8q3nx"
MCP arguments:
{
   "api_key": "XXXXX"
}
```

The LLM should only request an operation; the application handles authentication.

---

### 6. Don't log secrets

Logs and traces should never contain:

```text
API keys
Passwords
Access tokens
Client secrets
Authorization headers
```

Instead:

```text id="w6m2dr"
tool_name = "get_customer"
worker_id = "customer-worker"
status = "success"
correlation_id = "C789"
```

Sensitive values should be redacted.

---

### 7. Rotate secrets

If a client secret or API credential must be used:

```text id="x4k8pn"
Secret
 ↓
Expiration / rotation
 ↓
New secret
 ↓
Application picks up new value
 ↓
Old secret revoked
```

Don't wait until a secret is compromised before rotating it.

---

### 8. Separate environments

Don't use the same credential for:

```text
Development
Test
Staging
Production
```

For example:

```text id="a6r1yt"
DEV → DEV credentials
QA  → QA credentials
PROD → PROD credentials
```

This limits blast radius.

---

### 9. Protect secrets in MCP

In CWD, the Worker doesn't need to know Salesforce's password.

```text id="n4q7sx"
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Authentication / Secret retrieval
 ↓
Salesforce
```

The **MCP Server/integration layer** owns the downstream authentication mechanism.

This is much safer than giving every Worker direct Salesforce credentials.

---

### 10. Detect accidental secret exposure

I also use secret scanning and DLP controls in the development/deployment pipeline.

For example:

```text id="c7v5mk"
Developer commit
      ↓
Secret scanning
      ↓
Secret detected?
   ↙       ↘
 Yes       No
 ↓          ↓
Block      Continue
```

Also scan logs, configuration, containers, and CI/CD variables where appropriate.

---

## CWD example

Suppose the **Incident Worker** needs to retrieve incidents from ServiceNow.

I don't give the Worker a ServiceNow password.

Instead:

```text id="e9p2wd"
Incident Worker
      ↓
MCP Client
      ↓
MCP Server
      ↓
Managed Identity / authorized credential
      ↓
ServiceNow
      ↓
Incident data
      ↓
Worker
```

The LLM sees the **business result**, not the credential used to obtain it.

---

## Interview-ready answer

> **“I protect secrets using centralized secret management and workload identities. In CWD, I prefer Managed Identity and OAuth instead of storing client secrets. If a legacy integration requires a secret, I store it in Azure Key Vault and grant only the required Worker or MCP Server least-privilege access. Secrets are never hard-coded, committed to Git, included in prompts, A2A messages, MCP parameters, or logs. I also separate credentials by environment, rotate them regularly, use secret scanning in CI/CD, and audit access to secrets. For enterprise integrations, I prefer keeping credentials inside the MCP/integration layer rather than exposing them to individual Workers.”**

### Easy memory

**Don't Hard-code → Managed Identity → Key Vault → Least Privilege → Don't Expose → Rotate → Scan → Audit**

### Strong interview line

> **“The LLM should know what operation it wants to perform, but it should never know the credential used to perform that operation.”**
