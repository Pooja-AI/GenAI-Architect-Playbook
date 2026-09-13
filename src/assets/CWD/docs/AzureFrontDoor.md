# Azure Front Door

**Azure Front Door** is Microsoft's **global, internet-facing application delivery and security service**. It provides a global entry point for applications and can provide **CDN/edge caching, WAF protection, TLS termination, health-based routing, and traffic acceleration**.

### Mental model

> **Azure Front Door = global front door of your enterprise AI application.**

For your CWD architecture:

```text
Users
  │
  ▼
Azure Front Door
  │
  ├── WAF
  ├── TLS
  ├── Global routing
  ├── Health checks
  └── Edge/CDN
       │
       ▼
      APIM
       │
       ▼
   CWD Coordinator
```

---

# 1. Why do we need Front Door?

Suppose your CWD application is deployed in multiple Azure regions:

```text
                   Users
                     │
                     ▼
              Azure Front Door
                 /          \
                /            \
        East US              Central US
           │                     │
        CWD Stack             CWD Stack
```

Users shouldn't need to know which region to call.

Front Door determines the appropriate backend based on:

* Availability
* Health
* Routing rules
* Geographic configuration
* Performance
* Application requirements

---

# 2. Global Entry Point

Front Door gives your application a **single global endpoint**.

Example:

```text
https://ai.company.com
```

Users access:

```text
ai.company.com
```

instead of:

```text
eastus.company.com
centralus.company.com
westus.company.com
```

Front Door handles routing behind the scenes.

---

# 3. CDN / Edge Acceleration

Front Door can cache suitable content at Microsoft's edge locations.

Example:

```text
User in Texas
     │
     ▼
Nearest/optimal Front Door edge
     │
     ▼
Cached content
```

This is particularly useful for:

* React/JavaScript
* CSS
* Images
* Static files
* Public content
* Other cacheable HTTP responses

### Important

Don't blindly cache dynamic AI responses.

For example:

```text
"Why did equipment EQ-102 fail?"
```

is user-specific and potentially confidential.

You generally don't want a shared CDN cache serving that response to another user.

---

# 4. WAF

**WAF = Web Application Firewall.**

Front Door can integrate WAF protection at the internet edge.

Flow:

```text
Internet
   │
   ▼
Front Door
   │
   ▼
WAF
   │
   ├── Malicious request → Block
   │
   └── Valid request → Continue
```

WAF helps protect against common web attacks such as:

* SQL injection
* Cross-site scripting
* Malicious HTTP requests
* Known attack patterns
* Automated/bot-related threats depending on configuration

---

# 5. TLS Termination

Front Door can terminate HTTPS/TLS at the edge.

Example:

```text
User
  │
  │ HTTPS
  ▼
Front Door
  │
  │ TLS connection to backend as configured
  ▼
APIM
  │
  ▼
CWD
```

### TLS termination means

Front Door receives the encrypted HTTPS connection and handles the TLS session.

You can then configure secure HTTPS communication from Front Door to the backend as well.

### Interview point

> TLS termination at Front Door doesn't mean the backend should use plain HTTP.

For enterprise systems, use HTTPS/private connectivity for backend communication as appropriate.

---

# 6. Routing

Front Door can route traffic to different backends.

Example:

```text
User
 │
 ▼
Front Door
 │
 ├── /api/*  → APIM
 │
 ├── /app/*  → Static Web App
 │
 └── /images/* → Storage/CDN
```

You can also use routing based on domains, paths and backend health.

---

# 7. Health Probes

Suppose CWD has two regions:

```text
Front Door
   │
   ├── East US → Healthy
   │
   └── Central US → Healthy
```

If East US becomes unhealthy:

```text
Front Door
   │
   ├── East US → ❌
   │
   └── Central US → ✅
                    │
                    ▼
                  Traffic
```

Front Door can stop routing traffic to an unhealthy backend according to the configured health and routing behavior.

This improves availability.

---

# 8. Front Door + APIM

This is an **important enterprise architecture pattern**.

They have different responsibilities.

```text
Internet
   │
   ▼
Front Door
   │
   ├── Global routing
   ├── WAF
   ├── TLS
   └── Edge acceleration
   │
   ▼
APIM
   │
   ├── API authentication
   ├── API authorization/policies
   ├── Rate limiting
   ├── API validation
   ├── API versioning
   └── API governance
   │
   ▼
CWD Coordinator
```

### Simple distinction

> **Front Door protects and routes web traffic globally.**

> **APIM governs APIs.**

---

# 9. Front Door + CWD

For your CWD application:

```text
                         Users
                           │
                           ▼
                  Azure Front Door
                           │
                   ┌───────┴───────┐
                   │      WAF      │
                   └───────┬───────┘
                           │
                           ▼
                         APIM
                           │
                           ▼
                     Coordinator
                           │
                           ▼
                      Delegators
                           │
                           ▼
                        Workers
                    ┌──────┼──────┐
                    ▼      ▼      ▼
                  RAG    MCP    APIs
```

Front Door is the **outer edge**.

---

# 10. Front Door + React UI

Your CWD React application can be hosted using something like:

```text
React UI
   │
   ▼
Static Web Apps / Storage
   │
   ▼
Azure Front Door
```

The user accesses:

```text
https://cwd.company.com
```

Front Door can provide:

* HTTPS
* Global delivery
* WAF
* CDN/edge caching
* Custom domain
* Routing

---

# 11. Front Door + Private Backend

For enterprise architecture, you generally don't want the backend agent services exposed directly to the internet.

Better:

```text
Internet
   │
   ▼
Front Door + WAF
   │
   ▼
APIM
   │
   ▼
Private Network
   │
   ▼
CWD Coordinator
```

And:

```text
Coordinator
    │
    ▼
Delegators
    │
    ▼
Workers
    │
    ▼
Private Endpoints
    │
    ├── Azure AI Search
    ├── Key Vault
    ├── Storage
    ├── SQL
    └── Azure OpenAI
```

This creates a strong **public-edge / private-backend** architecture.

---

# 12. Front Door + Private Link

For supported backend configurations, Front Door can use private connectivity so backend services don't need to be publicly exposed.

Conceptually:

```text
User
 │
 ▼
Front Door
 │
 │ private connectivity
 ▼
Private Backend
 │
 ▼
CWD
```

This is especially valuable when the enterprise requirement is:

> "The backend must not be directly accessible from the public internet."

---

# 13. Front Door + WAF vs Azure Firewall

Don't confuse them.

### Front Door WAF

Protects **web applications at the edge**.

```text
Internet
 ↓
Front Door WAF
 ↓
Application
```

### Azure Firewall

Provides **network-level centralized traffic control** inside/around Azure networks.

```text
VNet
 │
 ▼
Azure Firewall
 │
 ├── Network rules
 ├── Application rules
 └── Traffic inspection/control
```

They can be used together.

---

# 14. Front Door vs Application Gateway

Another common interview question.

### Azure Front Door

Best for:

* Global applications
* Global routing
* Edge delivery
* CDN
* WAF at global edge
* Multi-region applications

### Application Gateway

Best for:

* Regional Layer-7 load balancing
* HTTP/HTTPS routing
* WAF
* Backend applications inside Azure/VNet

Simple memory:

> **Front Door = global edge.**

> **Application Gateway = regional application delivery/load balancing.**

---

# 15. Front Door vs Traffic Manager

Another common question.

### Front Door

HTTP/HTTPS application delivery with:

* WAF
* CDN/edge capabilities
* Layer-7 routing
* TLS
* Global application acceleration

### Traffic Manager

DNS-based traffic distribution.

Think:

> **Traffic Manager = DNS routing.**

> **Front Door = HTTP/HTTPS global application edge.**

---

# 16. Front Door + Agentic AI

Front Door doesn't perform agent reasoning.

It doesn't decide:

> "Should I call the Quality Delegator?"

That's the Coordinator's job.

Architecture:

```text
Front Door
    ↓
APIM
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
LLM / RAG / MCP / APIs
```

### Responsibilities

| Component    | Responsibility            |
| ------------ | ------------------------- |
| Front Door   | Global entry/edge         |
| WAF          | Web security              |
| APIM         | API governance            |
| Coordinator  | Agent orchestration       |
| Delegator    | Domain/task orchestration |
| Worker       | Task execution            |
| AI Search    | Retrieval                 |
| Azure OpenAI | Model inference           |

---

# 17. Front Door + Authentication

Front Door is not your complete identity system.

You might have:

```text
User
 ↓
Front Door/WAF
 ↓
APIM
 ↓
Entra ID authentication
 ↓
CWD
```

**Entra ID** determines who the user is.

APIM/application policies can validate the token and enforce API-level controls.

---

# 18. Front Door + DDoS

Front Door provides edge-level protection capabilities, while Azure DDoS Protection addresses DDoS protection for Azure network resources.

For an enterprise application, security can be layered:

```text
Internet
   ↓
Front Door
   ↓
WAF
   ↓
APIM
   ↓
Private Network
   ↓
CWD
```

Don't describe Front Door simply as "the DDoS solution"; it is one part of the overall protection architecture.

---

# 19. Front Door + Multi-Region CWD

For a production enterprise platform:

```text
                         Users
                           │
                           ▼
                    Azure Front Door
                           │
                  ┌────────┴────────┐
                  ▼                 ▼
             East US            Central US
                  │                 │
                  ▼                 ▼
                 APIM              APIM
                  │                 │
                  ▼                 ▼
              CWD Stack          CWD Stack
                  │                 │
             ┌────┴────┐       ┌────┴────┐
             ▼         ▼       ▼         ▼
          Agents      RAG   Agents      RAG
```

This can provide:

* High availability
* Regional failover
* Disaster recovery
* Lower latency
* Controlled traffic distribution

But your **state/data layer** also needs a multi-region strategy. Front Door alone doesn't make the entire application highly available.

---

# 20. Front Door + AI Workloads

A useful distinction:

### Good candidates for edge caching

```text
React JS
CSS
Images
Public documentation
Static assets
```

### Usually don't cache blindly

```text
LLM responses
User-specific RAG results
Confidential enterprise data
Agent execution results
ServiceNow responses
```

Because these may be:

* User-specific
* Sensitive
* Dynamic
* Authorization-dependent

---

# 21. Strong Production Architecture

For your CWD:

```text
                         Internet
                            │
                            ▼
                 ┌────────────────────┐
                 │   Azure Front Door  │
                 │                    │
                 │ Global Routing     │
                 │ WAF                │
                 │ TLS                │
                 │ Edge/CDN           │
                 └──────────┬─────────┘
                            │
                            ▼
                         APIM
                            │
                  Authentication/
                  API Governance
                            │
                            ▼
                 ┌────────────────────┐
                 │    Private VNet    │
                 │                    │
                 │ Coordinator        │
                 │ Delegators         │
                 │ Workers            │
                 │ MCP Servers        │
                 └─────────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         AI Search      Azure OpenAI   Enterprise
                                      APIs/Data
```

---

# 22. Front Door vs APIM — Must Know

| Feature                | Front Door            | APIM                           |
| ---------------------- | --------------------- | ------------------------------ |
| Global entry point     | ✅                     | Possible, but not primary role |
| Global routing         | ✅                     | Limited/different purpose      |
| CDN/edge               | ✅                     | ❌                              |
| WAF                    | ✅                     | ❌ as primary role              |
| TLS                    | ✅                     | ✅                              |
| API gateway            | ❌                     | ✅                              |
| API policies           | ❌                     | ✅                              |
| API versioning         | ❌                     | ✅                              |
| API rate limiting      | Limited edge controls | ✅                              |
| API transformation     | ❌                     | ✅                              |
| Backend API governance | ❌                     | ✅                              |
| Agent orchestration    | ❌                     | ❌                              |

### Easy interview answer

> **“Front Door is my global edge and application delivery layer; APIM is my API governance layer.”**

---

# 23. Strong Solution Architect Interview Answer

> **“For my CWD enterprise AI platform, I would use Azure Front Door as the global entry point for the application. It would provide global routing, TLS termination, WAF protection, health-based backend routing and edge delivery for appropriate static content. I would place API Management behind Front Door so that API-specific concerns such as authentication policies, throttling, request validation, versioning and API governance are centralized in APIM.**
>
> **The CWD Coordinator, Delegators, Workers and MCP services would remain in private network environments rather than being directly exposed to the internet. Front Door would provide the secure public edge, while APIM would provide controlled API access to the private application layer. For multi-region deployments, Front Door could route users to healthy regional CWD stacks and support failover. I would also avoid caching user-specific or confidential LLM/RAG responses because those responses may be authorization- and user-dependent.”**

---

## Final mental model

Remember these **7 lines**:

> **Front Door = Global Entry Point**
> **WAF = Web Protection**
> **CDN = Edge Delivery**
> **TLS = Secure HTTPS**
> **Routing = Send traffic to the right backend**
> **Health Probe = Avoid unhealthy backends**
> **APIM = API Governance**

### Best one-line interview statement

> **“I use Azure Front Door as the global secure edge for CWD, providing WAF, TLS, global routing and edge delivery, while API Management handles API-level authentication, throttling, governance and policies before requests reach the private agent platform.”**
