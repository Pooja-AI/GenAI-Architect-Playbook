# Azure Container Registry (ACR) for Agentic AI

Microsoft **Azure Container Registry (ACR)** is Azure's private container registry for **storing, versioning, securing, scanning, and distributing container images**.

For your CWD architecture, the mental model is:

> **ACR = the secure image warehouse for your Coordinator, Delegators, Workers, MCP servers, and other containerized services.**

---

# 1. Where ACR fits in CWD

Your development workflow looks like:

```text
Developer
    ↓
Source Code
    ↓
Docker Build
    ↓
Container Image
    ↓
Azure Container Registry
    ↓
AKS / Container Apps
    ↓
Running Agent / Worker
```

For example:

```text
CWD Quality Worker
       ↓
Docker Build
       ↓
quality-worker:v1.4
       ↓
ACR
       ↓
AKS
       ↓
Quality Worker Pods
```

ACR **stores the image**.

AKS or Container Apps **runs the image**.

---

# 2. What is a Container Image?

A container image packages everything required to run your application.

For example, your Worker might require:

```text
Python
FastAPI
LangGraph
OpenAI SDK
MCP SDK
Business logic
Dependencies
Configuration
```

Docker packages these into an image:

```text
quality-worker:v1.0
```

That image is pushed to ACR:

```text
ACR
 └── quality-worker
      ├── v1.0
      ├── v1.1
      └── v1.2
```

---

# 3. ACR Repository and Tags

Think of ACR as:

```text
ACR Registry
   │
   ├── coordinator
   │     ├── v1.0
   │     └── v1.1
   │
   ├── quality-delegator
   │     ├── v1.0
   │     └── v1.2
   │
   ├── rca-worker
   │     ├── v2.0
   │     └── v2.1
   │
   └── mcp-server
         ├── v1.0
         └── v1.1
```

### Repository

Represents the application:

```text
rca-worker
```

### Tag

Represents a particular version:

```text
v2.1
```

So:

```text
rca-worker:v2.1
```

means:

> RCA Worker application, version 2.1.

---

# 4. Why ACR is important for Agentic AI

Your CWD platform may have many independently deployed services:

```text
Coordinator
Delegators
Workers
MCP Servers
RAG Services
Model Gateway
Document Processing
Evaluation Services
```

Each can have its own container image.

```text
ACR
 │
 ├── coordinator
 ├── manufacturing-delegator
 ├── quality-delegator
 ├── equipment-delegator
 ├── rca-worker
 ├── image-analysis-worker
 ├── service-now-worker
 └── mcp-server
```

This supports independent:

* deployment
* versioning
* rollback
* scaling
* release management

---

# 5. Complete CI/CD Workflow

This is important for Solution Architect interviews.

```text
Developer
    ↓
GitHub / Azure DevOps
    ↓
Build
    ↓
Unit Tests
    ↓
Docker Build
    ↓
Security Scan
    ↓
Push Image
    ↓
Azure Container Registry
    ↓
Deploy
    ↓
AKS / Container Apps
```

For AI applications, add AI evaluation:

```text
Code
 ↓
Build
 ↓
Unit Tests
 ↓
Container Security Scan
 ↓
AI Evaluation
 ↓
RAG Evaluation
 ↓
Tool Evaluation
 ↓
Safety Tests
 ↓
Push to ACR
 ↓
Deploy
```

---

# 6. Example: CWD RCA Worker

Suppose you update your RCA Worker.

Old:

```text
rca-worker:v1.0
```

You make improvements:

```text
rca-worker:v1.1
```

Build:

```text
Docker build
```

Then push:

```text
ACR
 └── rca-worker:v1.1
```

AKS deployment changes from:

```text
rca-worker:v1.0
```

to:

```text
rca-worker:v1.1
```

Now new pods run version 1.1.

---

# 7. Versioning

Versioning is extremely important for agentic applications.

Don't rely only on:

```text
latest
```

Prefer explicit versions:

```text
coordinator:1.3.0
quality-worker:2.1.0
rca-worker:1.7.2
```

You can also use immutable image digests.

Conceptually:

```text
rca-worker:v1.7.2
        ↓
Image Digest
        ↓
Exact immutable image
```

This gives you reproducible deployments.

---

# 8. Why `latest` can be dangerous

Suppose production is running:

```text
rca-worker:latest
```

You push a new image.

Now `latest` points to a different version.

You may not know exactly which image a deployment used.

For production:

> **Prefer immutable versioning/digests over relying on `latest`.**

---

# 9. ACR + AKS

This is the most common architecture for your CWD.

```text
Developer
    ↓
Docker
    ↓
ACR
    ↓
AKS
    ↓
Pods
```

AKS pulls the image:

```text
AKS
 ↓
ACR
 ↓
rca-worker:v1.5
```

Then Kubernetes creates the Worker Pods.

```text
AKS
 ├── RCA Worker Pod
 ├── RCA Worker Pod
 └── RCA Worker Pod
```

---

# 10. ACR + Azure Container Apps

Same concept:

```text
Developer
    ↓
Docker
    ↓
ACR
    ↓
Container Apps
    ↓
Agent / Worker
```

Container Apps pulls:

```text
quality-worker:v2.0
```

from ACR and runs it.

So:

> **ACR stores the image.**

> **Container Apps runs the container.**

---

# 11. Securing ACR

Enterprise ACR should not simply be an open public image repository.

Security can include:

* Microsoft Entra ID
* Azure RBAC
* Managed Identity
* Private networking/private endpoints
* Network restrictions
* Image scanning
* Vulnerability management
* Encryption
* Audit logging
* Least privilege

---

# 12. Managed Identity for AKS → ACR

Instead of putting registry credentials inside Kubernetes:

```text
AKS
 ↓
Username/password
 ↓
ACR
```

Use identity-based access:

```text
AKS Workload / Node Identity
          ↓
     Entra ID
          ↓
     Azure RBAC
          ↓
          ACR
```

The AKS environment receives permission to pull images from ACR.

This is much better for enterprise security.

---

# 13. Image Vulnerability Scanning

Before deploying a Worker, you should scan the container image.

Example:

```text
Docker Image
     ↓
Security Scan
     ↓
┌───────────────┐
│ CVE detected? │
└───────┬───────┘
        ↓
      YES
        ↓
Block deployment
```

For example, the image might contain a vulnerable Python package.

The pipeline should catch it before production.

---

# 14. ACR + Microsoft Defender

In an enterprise environment, you can integrate container security capabilities with **Microsoft Defender for Cloud**.

The goal is to detect:

* vulnerable packages
* vulnerable images
* configuration problems
* suspicious activity
* container security risks

The important interview point isn't memorizing every Defender feature.

Say:

> "I would integrate image vulnerability scanning into the CI/CD pipeline and enforce security gates before production deployment."

---

# 15. ACR and Private Networking

For sensitive enterprise workloads:

```text
Internet
   X
   |
   | blocked
   ↓
Private Network
   ↓
AKS
   ↓
Private ACR
```

This helps keep container images within controlled enterprise networking.

---

# 16. ACR Geo-Replication

For globally distributed applications, ACR can support geographically distributed registries through replication capabilities.

Conceptually:

```text
             ACR
              │
       ┌──────┴──────┐
       ↓             ↓
    East US       West US
       ↓             ↓
     AKS           AKS
```

Benefits can include:

* lower image-pull latency
* regional deployment support
* resilience
* distributed production environments

---

# 17. ACR and AI Model Images

Not every AI workload needs a huge model inside the container.

For example:

```text
Agent Container
    ↓
Azure OpenAI / Foundry
```

The container contains:

```text
Agent code
LangGraph
SDKs
Business logic
```

The foundation model is accessed as a managed service.

For local/specialized models:

```text
ACR
 ↓
Model-serving image
 ↓
AKS GPU node
 ↓
Model inference
```

This distinction is important.

> **ACR stores the container image, not necessarily the model itself.**

---

# 18. ACR in CWD Release Strategy

Suppose you have:

```text
Production
rca-worker:v1.4
```

You release:

```text
rca-worker:v1.5
```

Deploy to a small percentage:

```text
v1.4 → 90%
v1.5 → 10%
```

Monitor:

* task success
* hallucination rate
* RAG groundedness
* tool success
* latency
* token usage
* cost
* errors

If good:

```text
v1.4 → 0%
v1.5 → 100%
```

If bad:

```text
rollback → v1.4
```

ACR provides the versioned images that make this deployment strategy practical.

---

# 19. ACR + AI Evaluation

This is particularly important for your profile.

Traditional CI/CD:

```text
Code
 ↓
Unit Tests
 ↓
Build
 ↓
Deploy
```

Agentic AI CI/CD:

```text
Code
 ↓
Unit Tests
 ↓
Docker Build
 ↓
Security Scan
 ↓
Agent Evaluation
 ↓
RAG Evaluation
 ↓
Tool Evaluation
 ↓
Safety Evaluation
 ↓
Push to ACR
 ↓
Deploy
 ↓
Canary
 ↓
Production
```

This demonstrates that you understand **LLMOps**, not just DevOps.

---

# 20. ACR vs Azure Storage

Don't confuse them.

### Azure Container Registry

```text
Container Images
```

Examples:

```text
worker:v1
agent:v2
mcp-server:v3
```

### Azure Storage

```text
Files
Documents
Images
Logs
Artifacts
```

For example:

```text
Blob Storage
 ↓
Defect images

ACR
 ↓
Image-analysis-worker container
```

---

# 21. ACR vs Docker Hub

### Docker Hub

Public/private container registry service.

### ACR

Azure-native private registry with:

* Azure RBAC
* Entra integration
* Azure networking
* Managed identity integration
* Azure security ecosystem
* AKS integration

For a Microsoft enterprise environment:

> **ACR is a natural choice for private container images running on AKS or Azure Container Apps.**

---

# 22. CWD End-to-End Architecture

Put everything you've learned together:

```text
                         Developer
                             ↓
                    GitHub / Azure DevOps
                             ↓
                     Build + Test + Eval
                             ↓
                        Docker Build
                             ↓
                    Security / CVE Scan
                             ↓
                    Azure Container Registry
                             ↓
                 ┌───────────┴───────────┐
                 ↓                       ↓
                AKS                Container Apps
                 ↓                       ↓
          Coordinator             Agent / Worker
          Delegators
          Worker Pools
                 ↓
             Service Bus
                 ↓
          Async Workers
                 ↓
          MCP / Enterprise APIs
```

---

# 23. Most Important Distinctions

Memorize this table:

| Component           | Responsibility                          |
| ------------------- | --------------------------------------- |
| **Docker**          | Builds container image                  |
| **ACR**             | Stores and distributes container images |
| **AKS**             | Orchestrates/runs containers at scale   |
| **Container Apps**  | Runs managed containerized applications |
| **Service Bus**     | Reliable asynchronous messaging         |
| **Event Grid**      | Event routing                           |
| **Azure Functions** | Serverless task execution               |
| **Logic Apps**      | Business workflow/integration           |

---

# 24. Strong Interview Answer

> **"I would use Azure Container Registry as the private image registry for the CWD platform. Each major service, such as the Coordinator, domain Delegators, specialized Workers and MCP servers, would be packaged as a container image and versioned in ACR. The CI/CD pipeline would build the image, run unit and integration tests, perform container vulnerability scanning and AI-specific evaluations, and then push an immutable version to ACR. AKS or Azure Container Apps would pull the approved image using identity-based access and deploy it. For production, I would avoid relying on the latest tag, use versioned images or digests, and support controlled canary or rolling deployments with rollback. ACR would also be secured using Entra ID, Azure RBAC, managed identity and private networking where required."**

### One-line mental model

> **Docker builds → ACR stores → AKS/Container Apps runs → CI/CD deploys → Security protects → Versioning enables rollback.**
