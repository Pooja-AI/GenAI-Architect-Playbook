## What is Managed Identity?

**Managed Identity is an Azure-managed identity for an application or service that allows it to access Azure resources without storing passwords, API keys, or client secrets in the application.**

In simple terms:

> **Azure manages the credential for my application, so I don't have to manage secrets myself.**

### In CWD

Suppose the **Incident Worker** needs to access Azure Key Vault or an Azure service.

Without Managed Identity:

```text
Worker
 ↓
Client ID + Client Secret
 ↓
Azure Service
```

The secret has to be stored and rotated securely.

With Managed Identity:

```text
Incident Worker
      ↓
Managed Identity
      ↓
Microsoft Entra ID
      ↓
Access Token
      ↓
Azure Service
```

The application doesn't need to store a password or client secret.

### Example

Imagine our CWD Worker needs to read a secret from Key Vault.

```text
Incident Worker
      ↓
"Give me an Entra token for Key Vault"
      ↓
Entra ID
      ↓
Access Token
      ↓
Azure Key Vault
      ↓
Secret
```

The Worker doesn't contain:

```python
# Don't do this
client_secret = "my-secret-value"
```

Instead, Azure provides the workload identity and token acquisition.

### Two common types

**1. System-assigned Managed Identity**

* Tied to a specific Azure resource.
* Created and managed with that resource.
* Deleted when the resource is deleted.

Example:

```text
Azure Container App
      ↓
System-assigned Identity
      ↓
Key Vault
```

**2. User-assigned Managed Identity**

* Created as a separate Azure resource.
* Can be assigned to multiple Azure resources.
* Useful when multiple services need the same managed identity.

```text
             User-assigned Identity
              /              \
             ↓                ↓
      Coordinator          Worker
```

### How authorization works

Managed Identity **doesn't automatically give access to everything**.

First:

```text
Worker
 ↓
Managed Identity
 ↓
Entra ID token
```

Then Azure checks whether that identity has the required permissions:

```text
Identity
   ↓
RBAC / Access Policy
   ↓
Allowed? ── No → DENY
   │
  Yes
   ↓
Access resource
```

So:

> **Managed Identity = identity/credential management**

while:

> **RBAC = permission control**

### CWD interview example

For our CWD architecture:

```text
Customer Worker
      ↓
Managed Identity
      ↓
Entra ID
      ↓
Token
      ↓
MCP Server / Azure Service
      ↓
Authorization
      ↓
Salesforce / ServiceNow / Azure resources
```

For Salesforce or ServiceNow specifically, the downstream system may use its own OAuth/service-account mechanism. Managed Identity is most directly useful for **Azure resources and Azure-hosted workloads**; it doesn't magically authenticate to every external SaaS system.

### Interview-ready answer

> **“Managed Identity is an Azure feature that gives an application or workload an identity in Microsoft Entra ID without requiring us to store credentials such as client secrets in the application. In CWD, our Coordinator, Delegators, or Workers running on Azure can use Managed Identity to obtain Entra access tokens and access authorized Azure resources such as Key Vault or other services. We then use RBAC and least-privilege permissions to control what that identity can access. This reduces secret management, credential exposure, and manual credential rotation.”**

**Easy memory:**

**Managed Identity = Azure manages the identity and credentials; RBAC decides what that identity can access.**
