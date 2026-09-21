## Why use Microsoft Entra ID in CWD?

We use **Microsoft Entra ID as the central identity and access-management layer** for both users and application/workload identities. It provides authentication, token-based access, RBAC, Conditional Access, and managed identities. ([Microsoft Learn][1])

### In CWD

```text
User
  ↓
Microsoft Entra ID
  ↓ OAuth access token
FastAPI / APIM
  ↓
Coordinator
  ↓ A2A
Delegator
  ↓
Worker
  ↓ MCP
Enterprise Systems
```

### Why it fits CWD

**1. Centralized authentication**

Instead of CWD maintaining its own usernames/passwords, Entra ID provides centralized identity and token-based authentication. It also supports enterprise capabilities such as SSO and MFA. ([Microsoft Learn][2])

**2. Authorization**

We can use scopes, application roles, RBAC and claims to determine what a user or workload is allowed to access. The API/resource still performs the final authorization decision. ([Microsoft Learn][1])

For example:

```text
User
 ├── customer.read     ✓
 ├── incident.read     ✓
 └── customer.delete   ✗
```

**3. Agent/workload identities**

CWD has non-human components—Coordinator, Delegators and Workers. Entra supports workload identities for applications, services and containers, including managed identities. ([Microsoft Learn][3])

For Azure-hosted CWD components, **Managed Identity** is particularly useful because Azure manages the credentials instead of us storing secrets in code or configuration. ([Microsoft Learn][4])

```text
Sales Worker
    ↓
Managed Identity
    ↓
Entra ID token
    ↓
MCP Server
```

**4. Least privilege**

Each workload can receive only the permissions it needs.

```text
Customer Worker
   → customer.read

Incident Worker
   → incident.read

Ticket Worker
   → ticket.create
```

So compromising one Worker doesn't automatically give it unrestricted access.

**5. Enterprise security policies**

Entra provides capabilities such as Conditional Access and identity-risk controls. Current Microsoft documentation also describes workload identity protections and agent identities for AI workloads. ([Microsoft Learn][5])

### Interview-ready answer

> **“We use Microsoft Entra ID because CWD is an enterprise multi-agent platform and we need centralized identity and access control for both users and workloads. Users authenticate through Entra ID and receive OAuth access tokens. Coordinator, Delegators, and Workers can have separate workload identities, and for Azure-hosted components we can use Managed Identity to avoid managing credentials. We use scopes, roles, RBAC, and entitlement checks for authorization, and apply least privilege at each layer. This gives us centralized authentication, workload identity, secure service-to-service communication, and enterprise-grade access governance.”**

### Easy memory

**Entra ID = Identity + Token + Authorization + Workload Identity + Least Privilege**

And in CWD:

**User identity → Agent identity → Tool authorization → Data entitlement.**

[1]: https://learn.microsoft.com/en-us/entra/architecture/authorize-applications-resources-workloads?utm_source=chatgpt.com "Authorize applications, resources, and workloads with Microsoft Entra ID - Microsoft Entra | Microsoft Learn"
[2]: https://learn.microsoft.com/en-us/entra/identity-platform/authentication-vs-authorization?utm_source=chatgpt.com "Authentication vs. authorization - Microsoft identity platform | Microsoft Learn"
[3]: https://learn.microsoft.com/en-us/entra/workload-id/workload-identities-overview?utm_source=chatgpt.com "Workload identities - Microsoft Entra Workload ID | Microsoft Learn"
[4]: https://learn.microsoft.com/en-us/entra/architecture/service-accounts-managed-identities?utm_source=chatgpt.com "Securing managed identities in Microsoft Entra ID - Microsoft Entra | Microsoft Learn"
[5]: https://learn.microsoft.com/en-us/entra/identity/conditional-access/workload-identity?utm_source=chatgpt.com "Microsoft Entra Conditional Access for workload identities - Microsoft Entra ID | Microsoft Learn"
