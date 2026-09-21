## How do you rotate secrets?

**Secret rotation** means periodically replacing an old credential with a new one and safely moving applications to the new credential without downtime.

In CWD, I prefer **Managed Identity/OAuth** so there are fewer secrets to rotate. For legacy integrations that require API keys, passwords, or client secrets, I use **Key Vault + automated rotation**.

### CWD rotation flow

```text id="7w3k9p"
Current Secret
      ↓
Rotation Trigger
(scheduled / expiry / security event)
      ↓
Generate New Secret
      ↓
Store New Version in Key Vault
      ↓
MCP / Application picks up new version
      ↓
Health Check
      ↓
Revoke Old Secret
      ↓
Audit
```

### Example: ServiceNow MCP

Suppose the MCP Server uses a ServiceNow client secret.

```text id="g5n2rx"
MCP Server
    ↓
Managed Identity
    ↓
Key Vault
    ↓
ServiceNow Client Secret v1
```

During rotation:

```text id="b8c4qm"
ServiceNow
    ↓
Create new credential
    ↓
Key Vault
    ↓
Secret v2
    ↓
MCP Server uses v2
    ↓
Validate connectivity
    ↓
Revoke v1
```

### How I implement it

**1. Store secrets centrally**

```text
Key Vault
 └── servicenow-client-secret
       ├── v1
       └── v2
```

I don't put the secret in application code.

**2. Automate rotation**

Rotation can be triggered by:

* scheduled policy
* expiration
* security incident
* credential compromise

Avoid relying on developers to manually remember rotations.

**3. Use overlapping validity**

For credentials that support it, keep the old and new credentials valid briefly:

```text
Old secret → valid
New secret → valid

Application switches to new secret

Old secret → revoked
```

This reduces downtime during rotation.

**4. Refresh applications safely**

The MCP Server retrieves the new secret from Key Vault rather than requiring a code deployment.

For long-lived applications, I make sure the application can refresh/reload credentials safely.

**5. Validate before revoking**

I verify:

```text
New credential
   ↓
Authentication works
   ↓
MCP health check
   ↓
Enterprise API works
   ↓
Revoke old credential
```

**6. Audit the rotation**

Record:

```text
secret identifier
rotation time
identity performing rotation
success/failure
new secret version
```

Never log the actual secret value.

### What if the secret is compromised?

I don't wait for the scheduled rotation.

```text
Compromise detected
       ↓
Immediately revoke old credential
       ↓
Generate new credential
       ↓
Store in Key Vault
       ↓
Update application
       ↓
Audit + investigate
```

### Managed Identity reduces rotation

For Azure-native CWD components:

```text id="p3x7mw"
Worker
   ↓
Managed Identity
   ↓
Entra ID
   ↓
Access Token
   ↓
Azure Service
```

There is no application-managed password/API key to rotate.

So my preference is:

> **Managed Identity where possible → Key Vault for unavoidable secrets → automated rotation for those secrets.**

### Interview-ready answer

> **“In CWD, I first minimize the number of secrets by using Managed Identity and OAuth wherever possible. For legacy integrations that require client secrets or API credentials, I store them in Key Vault and automate rotation. I create a new credential, store it as a new Key Vault version, update or refresh the MCP/application to use the new version, validate connectivity, and then revoke the old credential. I use overlapping validity where supported to avoid downtime. Rotation events are audited, and the actual secret value is never logged. If a credential is compromised, I perform immediate emergency rotation rather than waiting for the scheduled cycle.”**

### Easy memory

**Generate → Store new version → Switch → Validate → Revoke old → Audit**

**Strong interview line:**

> **“I rotate secrets automatically, validate the new credential before revoking the old one, and prefer Managed Identity to eliminate secret rotation wherever possible.”**
