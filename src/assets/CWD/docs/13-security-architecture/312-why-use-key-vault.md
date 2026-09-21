## Why use Key Vault?

**Azure Key Vault is used to securely store and manage secrets, keys, and certificates instead of putting them directly in application code or configuration.**

In CWD, I use it mainly for **secure credential management for enterprise integrations**.

### CWD example

Suppose the **Incident Worker** needs to access ServiceNow through an MCP Server.

Instead of:

```text id="f0p2kr"
Incident Worker
      ↓
ServiceNow password in code ❌
      ↓
ServiceNow
```

I use:

```text id="n8k4sd"
Incident Worker
      ↓
MCP Server
      ↓
Managed Identity
      ↓
Key Vault
      ↓
ServiceNow credential
      ↓
ServiceNow
```

The Worker/LLM **never sees the secret**.

### Why Key Vault?

**1. Centralized secret management**

Instead of storing credentials across applications:

```text
❌ source code
❌ config files
❌ Git
❌ Docker image
❌ notebooks
```

I keep them centrally in Key Vault.

---

**2. Access control**

I can control exactly which identity can retrieve a secret.

```text id="4d7x1m"
Incident MCP Server
       ↓
Managed Identity
       ↓
Key Vault
       ↓
serviceNow-credential → ALLOW

Customer Worker
       ↓
salesforce-admin-key → BLOCK
```

This follows **least privilege**.

---

**3. No secrets in code**

For example:

```python id="6g8s2c"
# ❌ Don't do this
password = "MySecretPassword"
```

Instead, the application retrieves the secret securely when needed.

---

**4. Secret rotation**

Key Vault supports managing secret versions, making it easier to rotate credentials without embedding new credentials into application code.

```text id="q5m9ta"
Old credential
     ↓
New credential
     ↓
Application uses new version
     ↓
Old credential revoked
```

---

**5. Auditing**

Access to secrets can be monitored and audited.

You can determine:

```text id="r2n6cv"
Which identity
     ↓
accessed which secret
     ↓
when
     ↓
from which application/context
```

This is important for enterprise compliance.

---

**6. Protect encryption keys and certificates**

Key Vault isn't only for passwords.

It can manage:

```text
Secrets      → passwords/API credentials
Keys         → encryption/signing keys
Certificates → TLS certificates
```

---

### Important distinction

**Managed Identity and Key Vault solve different problems.**

```text id="h7q3zp"
Managed Identity
      ↓
"Who is my application?"
      ↓
Entra ID identity

Key Vault
      ↓
"Where do I securely retrieve a secret?"
      ↓
Secret / Key / Certificate
```

And:

> **RBAC decides what that identity is allowed to access.**

### Interview-ready answer

> **“We use Azure Key Vault to centrally and securely manage secrets, keys, and certificates instead of embedding credentials in code, configuration, prompts, or containers. In CWD, if an MCP Server needs a legacy ServiceNow or Salesforce credential, it uses its Managed Identity to retrieve the required secret from Key Vault. We enforce least-privilege access, secret rotation, versioning, and auditing. For Azure-native services, I prefer Managed Identity so we can avoid secrets entirely where possible.”**

### Easy memory

**Key Vault = Store securely + Control access + Rotate + Audit**

**Strong interview line:**

> **“Managed Identity removes the need for many secrets; Key Vault securely manages the secrets that we still need.”**
