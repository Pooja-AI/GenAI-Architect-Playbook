## Why private VNet?

A **private VNet (Virtual Network)** gives my CWD components a **controlled private network environment** instead of exposing services directly to the public internet.

For an enterprise AI platform like CWD, the main reasons are **network isolation, reduced attack surface, controlled traffic, and secure access to enterprise systems**.

### CWD architecture

```text id="n7p4kx"
                    Internet
                       │
                    HTTPS/TLS
                       ↓
                ┌─────────────┐
                │ APIM / WAF  │
                └──────┬──────┘
                       │
                 Private VNet
        ┌──────────────┼──────────────┐
        │              │              │
        ↓              ↓              ↓
  Coordinator     Delegators       Workers
                                      │
                                      ↓
                                MCP Servers
                                      │
                           Private Endpoints
                                      │
             ┌────────────────────────┼───────────────┐
             ↓                        ↓               ↓
        Azure AI Search          Storage          Key Vault
```

### Why private VNet?

**1. Network isolation**

I keep sensitive CWD services inside a controlled network boundary.

```text
Internet
   ↓
   ✗ → Worker
   ✗ → MCP Server
   ✗ → Database
```

Only approved entry points can reach the platform.

---

**2. Reduce attack surface**

I don't want these components publicly exposed:

* Coordinator
* Delegators
* Workers
* MCP servers
* databases
* internal services

The smaller the public attack surface, the fewer externally reachable components I need to protect.

---

**3. Control east-west traffic**

Inside CWD, I don't automatically trust one service just because it is inside the VNet.

For example:

```text
Coordinator → Delegator     ✓
Delegator → Worker          ✓
Worker → MCP                ✓
User → MCP                  ✗
Worker → random database    ✗
Worker → random internet    ✗
```

Network rules can restrict which components can communicate.

---

**4. Secure enterprise data access**

CWD accesses sensitive systems such as:

```text
Salesforce
ServiceNow
SharePoint
Snowflake
Oracle
```

A private network architecture provides controlled connectivity between the AI platform and enterprise resources.

---

**5. Support private endpoints**

Private VNet works well with Azure Private Endpoints:

```text
CWD VNet
   ↓
Private Endpoint
   ↓
Azure AI Search
Storage
Cosmos DB
Key Vault
```

So Azure services can be accessed through private IP connectivity rather than requiring public exposure.

---

**6. Control outbound traffic**

This is especially important for **data-exfiltration protection**.

Instead of:

```text
Worker → unrestricted Internet
```

I use controlled egress:

```text
Worker
  ↓
Firewall / egress policy
  ↓
Approved destination
  ↓
Enterprise service
```

Unexpected external destinations can be blocked.

---

**7. Network segmentation**

I can separate workloads logically:

```text
VNet
│
├── Ingress
│    └── APIM
│
├── Agent
│    ├── Coordinator
│    ├── Delegators
│    └── Workers
│
├── MCP
│    └── MCP Servers
│
└── Private Endpoint
     ├── Search
     ├── Storage
     ├── Cosmos DB
     └── Key Vault
```

This provides additional containment if one component is compromised.

---

### Important: Private VNet ≠ complete security

This is a common interview question.

Being inside a private VNet **does not mean the service is automatically trusted**.

I still use:

```text
Private VNet
    +
TLS
    +
Entra ID
    +
RBAC
    +
Data Entitlement
    +
MCP Authorization
    +
DLP
    +
Audit
```

This follows a **zero-trust approach**.

### Private VNet vs Private Endpoint

Think of them as different things:

```text
Private VNet
→ Creates the private network environment.

Private Endpoint
→ Gives a supported Azure service private connectivity into that VNet.
```

Example:

```text
                 Private VNet
┌─────────────────────────────────┐
│ Worker                          │
│    ↓                            │
│ Private Endpoint                │
└────┼────────────────────────────┘
     ↓
Azure AI Search
```

### Interview-ready answer

> **“We use a private VNet to isolate the CWD platform and reduce its public attack surface. The Coordinator, Delegators, Workers, and MCP servers can run in controlled network segments, while traffic between components is restricted using network policies. We use private connectivity to Azure services such as AI Search, Storage, Cosmos DB, and Key Vault where appropriate, and control outbound traffic to prevent data exfiltration. However, the VNet is only one security layer—I still enforce TLS, Entra ID, RBAC, data entitlements, MCP authorization, and DLP using a zero-trust model.”**

### Easy memory

**VNet = Isolate → Segment → Restrict → Private Access → Control Egress**

**Strong interview line:**

> **“Private VNet reduces network exposure, but I never treat network location as proof of trust.”**
