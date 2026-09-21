## Managed Identity vs Client Secret

The simplest difference is:

> **Managed Identity = Azure manages the credential.**
> **Client Secret = We manage the credential.**

### Comparison

|                       | Managed Identity       | Client Secret                                |
| --------------------- | ---------------------- | -------------------------------------------- |
| Credential storage    | Azure-managed          | Application/team-managed                     |
| Secret in code/config | ❌ No                   | ⚠️ Usually required somewhere                |
| Rotation              | Azure-managed          | We must rotate                               |
| Secret exposure risk  | Lower                  | Higher                                       |
| Entra ID integration  | Yes                    | Yes                                          |
| Best for              | Azure-hosted workloads | Applications that can't use Managed Identity |
| Operational overhead  | Low                    | Higher                                       |

### CWD example

#### Managed Identity

Our **Incident Worker** runs on Azure Container Apps:

```text id="b9d4u1"
Incident Worker
      ↓
Managed Identity
      ↓
Microsoft Entra ID
      ↓
Access Token
      ↓
Azure Key Vault
```

There is no client secret sitting in the Worker configuration.

We then give that identity only the required RBAC permissions.

---

#### Client Secret

With a client secret:

```text id="5t6g2n"
Incident Worker
      ↓
Client ID + Client Secret
      ↓
Microsoft Entra ID
      ↓
Access Token
      ↓
Azure Service
```

The secret must be securely stored, for example in **Key Vault**, and we need a process for rotation and expiration.

---

### Why I prefer Managed Identity in CWD

For Azure-hosted CWD components, I would generally prefer Managed Identity because:

1. **No application-managed secret**
2. **Less credential exposure**
3. **Reduced rotation overhead**
4. **Works naturally with Azure resources**
5. **Supports least-privilege RBAC**
6. **Better fit for production enterprise workloads**

For example:

```text id="c4h1v8"
Coordinator ── Managed Identity ──→ Azure resources
Delegator   ── Managed Identity ──→ Azure resources
Worker      ── Managed Identity ──→ Azure resources
```

Each identity can have different permissions.

### Important interview point

Don't say:

> "Managed Identity is always better."

Say:

> **"For Azure-hosted workloads, I prefer Managed Identity because it removes application-managed secrets. If the workload is outside Azure or the target system requires a client credential, I may use a service principal with a client secret or preferably certificate/federated credentials, depending on the integration."**

### CWD interview-ready answer

> **“The main difference is credential management. With Managed Identity, Azure manages the workload identity and credentials, so my CWD application doesn't need to store or rotate a client secret. With a client secret, the application authenticates as an Entra application using a client ID and secret, and we are responsible for securely storing, rotating, and protecting that secret. For Azure-hosted CWD components such as Workers or Delegators, I prefer Managed Identity with least-privilege RBAC. For external or legacy integrations where Managed Identity isn't supported, client credentials may still be required.”**

**Easy memory:**

**Managed Identity → Azure manages credentials.**
**Client Secret → Application team manages credentials.**
