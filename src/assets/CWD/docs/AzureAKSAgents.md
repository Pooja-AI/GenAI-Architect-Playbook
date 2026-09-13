# Azure Kubernetes Service (AKS) for Agentic AI

For your **CWD Coordinator → Delegator → Worker architecture**, AKS is the stronger choice when the platform becomes **large-scale, highly customized, and production-critical**.

Think of the difference this way:

> **Azure Container Apps:** managed container platform with lower operational complexity.
> **AKS:** managed Kubernetes platform when you need deeper control over orchestration, networking, scaling, security, scheduling, and large agent fleets.

---

# 1. Why AKS for Agentic AI?

Suppose CWD grows to:

```text
1 Coordinator
10+ Delegators
100+ Specialized Workers
50+ MCP Servers
Multiple model gateways
Multiple RAG services
Thousands of concurrent users
```

You may need:

* Different scaling policies per Worker
* GPU workloads
* CPU-intensive document/image processing
* Dedicated node pools
* Workload isolation
* Advanced networking
* Service-to-service security
* Custom scheduling
* High availability
* Multi-zone deployment
* Advanced observability
* Fine-grained Kubernetes policies

This is where AKS becomes attractive.

---

# 2. CWD Architecture on AKS

A production architecture could look like:

```text
                         Users
                           │
                           ▼
                  Azure Front Door
                           │
                           ▼
                    API Management
                           │
                           ▼
                  ┌─────────────────┐
                  │ AKS Cluster     │
                  │                 │
                  │ Coordinator     │
                  │     │           │
                  │     ▼           │
                  │ Delegators      │
                  │     │           │
                  │     ▼           │
                  │ Worker Pools    │
                  └──────┬──────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
       Azure OpenAI   AI Search      Enterprise
                                    Systems/APIs
```

The important point:

> **AKS hosts your custom agent services; Azure OpenAI/Foundry provides model/AI capabilities around them.**

AKS is not the LLM itself.

---

# 3. Kubernetes Mental Model

You should understand these concepts:

```text
AKS Cluster
    │
    ├── Node Pool
    │      │
    │      ├── Node
    │      │     ├── Pod
    │      │     └── Pod
    │      │
    │      └── Node
    │
    ├── Services
    ├── Ingress
    ├── ConfigMaps
    ├── Secrets
    ├── Deployments
    └── Autoscalers
```

### Cluster

The entire Kubernetes environment.

### Node

A VM that runs workloads.

### Pod

The smallest Kubernetes deployment unit.

Your Worker normally runs inside a Pod.

### Deployment

Defines how Kubernetes should maintain your application.

### Service

Provides stable networking to Pods.

### Ingress

Controls external HTTP/HTTPS access.

---

# 4. Coordinator on AKS

You could deploy your Coordinator as:

```text
coordinator-deployment
```

with multiple replicas:

```text
Coordinator
 ├── Pod 1
 ├── Pod 2
 ├── Pod 3
 └── Pod 4
```

If Pod 1 fails:

```text
Pod 1 ❌

Kubernetes
    ↓
Creates replacement
    ↓
Pod 5 ✅
```

This provides self-healing.

---

# 5. Delegators on AKS

Each Delegator can be independently deployed.

```text
AKS
│
├── Manufacturing Delegator
│      ├── Pod
│      └── Pod
│
├── Quality Delegator
│      ├── Pod
│      └── Pod
│
├── Equipment Delegator
│      ├── Pod
│      └── Pod
│
└── Supply Chain Delegator
       ├── Pod
       └── Pod
```

This allows different scaling requirements.

For example:

```text
Quality:
10 replicas

Supply Chain:
3 replicas

Equipment:
5 replicas
```

---

# 6. Worker Pools

This is one of the most important AKS concepts for your CWD.

Instead of running one Worker:

```text
RCA Worker
```

you can create a Worker pool:

```text
RCA Worker Pool

Pod 1
Pod 2
Pod 3
Pod 4
Pod 5
...
```

If failure-analysis requests increase:

```text
10 requests
   ↓
3 Workers
```

During a large investigation:

```text
500 requests
   ↓
3 Workers
   ↓
10 Workers
   ↓
20 Workers
```

Kubernetes manages the desired number of replicas.

---

# 7. Horizontal Pod Autoscaler

**HPA = Horizontal Pod Autoscaler.**

It increases or decreases Pod replicas based on configured metrics.

Simple example:

```text
CPU utilization > threshold
        ↓
Increase Pods

CPU utilization < threshold
        ↓
Decrease Pods
```

For agentic AI, however, CPU alone isn't enough.

You may scale based on:

* CPU
* Memory
* Requests
* Queue depth
* Custom application metrics
* Concurrency
* Processing latency

---

# 8. KEDA for Agent Workers

For agentic workloads, **KEDA** is especially useful.

Suppose:

```text
Coordinator
     ↓
Azure Service Bus
     ↓
RCA Worker
```

Queue:

```text
100 tasks
```

KEDA observes queue depth and scales Workers.

```text
Queue = 10
    ↓
3 Worker Pods

Queue = 500
    ↓
20 Worker Pods
```

When queue decreases:

```text
500 → 100 → 20 → 0
```

Workers can scale back down.

This is a very good pattern for long-running AI tasks.

---

# 9. AKS Autoscaling Has Multiple Levels

You should distinguish:

### HPA

Scales **Pods**.

```text
3 Pods → 10 Pods
```

### Cluster Autoscaler

Scales **Nodes**.

```text
5 Nodes → 10 Nodes
```

### KEDA

Scales workloads based on **events/external metrics**, such as queue depth.

So:

```text
Service Bus Queue
       ↓
      KEDA
       ↓
   Pod scaling
       ↓
Need more capacity?
       ↓
Cluster Autoscaler
       ↓
More Nodes
```

This distinction is excellent for interviews.

---

# 10. LLM Rate Limits and AKS Scaling

This is an important **Solution Architect-level consideration**.

Imagine:

```text
100 Worker Pods
      ↓
Azure OpenAI
      ↓
Model deployment
```

Scaling Pods does **not** automatically mean your LLM capacity increases.

You can have:

```text
100 Pods
   ↓
Azure OpenAI quota
   ↓
429 Too Many Requests
```

Therefore your scaling architecture must consider:

```text
Worker concurrency
+
Azure OpenAI TPM/RPM
+
Model capacity
+
Request size
+
Latency
```

You may implement:

* Concurrency limits
* Queue-based buffering
* Rate limiting
* Multiple model deployments
* Model routing
* Retry with exponential backoff
* Fallback
* Caching where appropriate

---

# 11. Node Pools

This is another major reason to use AKS.

You can create different node pools for different workload types.

For example:

```text
AKS Cluster
│
├── System Node Pool
│
├── CPU Node Pool
│
├── Memory-Optimized Node Pool
│
└── GPU Node Pool
```

### System pool

Runs Kubernetes/system components.

### CPU pool

Good for:

* Coordinator
* Delegators
* API Workers
* Lightweight RAG services

### Memory pool

Useful for:

* Large document processing
* Data processing
* Memory-intensive workloads

### GPU pool

Useful when you host workloads requiring GPU acceleration, such as:

* Vision preprocessing
* Local inference
* Embedding workloads
* Specialized ML models

You don't want every Worker running on expensive GPU nodes.

---

# 12. Kubernetes Scheduling

You can control where workloads run.

Example:

```text
RCA Worker
     ↓
CPU Node Pool

Vision Worker
     ↓
GPU Node Pool
```

Kubernetes features such as:

* Node selectors
* Taints
* Tolerations
* Affinity
* Anti-affinity

can be used for workload placement and isolation.

---

# 13. High Availability

For production CWD, you don't want the entire platform running on one node.

Instead:

```text
Availability Zone 1
   ├── Coordinator
   └── Workers

Availability Zone 2
   ├── Coordinator
   └── Workers

Availability Zone 3
   ├── Coordinator
   └── Workers
```

If one zone experiences an outage:

```text
Zone 1 ❌

Zone 2 → Continue
Zone 3 → Continue
```

For critical production services, design replicas and workloads appropriately across availability zones.

---

# 14. Networking

AKS gives you much deeper networking control than Container Apps.

Typical enterprise design:

```text
                    Internet
                       │
                       ▼
                Front Door / WAF
                       │
                       ▼
                      APIM
                       │
                       ▼
              Private AKS Network
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
 Coordinator       Delegators       Workers
       │               │               │
       └───────────────┼───────────────┘
                       │
          ┌────────────┼─────────────┐
          ▼            ▼             ▼
      AI Search     Azure OpenAI   Enterprise APIs
```

You can integrate AKS into an Azure VNet and use private connectivity to supported Azure services.

---

# 15. Ingress

External users should not directly access every Pod.

A typical flow:

```text
User
 ↓
Front Door / WAF
 ↓
API Management
 ↓
AKS Ingress
 ↓
Coordinator Service
```

Internal:

```text
Coordinator
    ↓
Internal Service
    ↓
Delegator
    ↓
Internal Service
    ↓
Worker
```

Workers don't need public endpoints.

---

# 16. Kubernetes Service

Pods are temporary.

Their IP addresses can change.

A Kubernetes **Service** provides a stable endpoint.

Example:

```text
Quality Delegator Pods

Pod 1 → 10.x.x.1
Pod 2 → 10.x.x.2
Pod 3 → 10.x.x.3
```

Instead of Coordinator knowing those IPs:

```text
Coordinator
     ↓
quality-delegator-service
     ↓
Pod 1 / Pod 2 / Pod 3
```

The Service handles routing to available Pods.

---

# 17. Service-to-Service Communication

Your CWD hierarchy becomes:

```text
Coordinator Service
       ↓
Delegator Service
       ↓
Worker Service
```

Example:

```text
coordinator-service
        ↓
quality-delegator-service
        ↓
rca-worker-service
```

This gives you clean microservice boundaries.

---

# 18. Network Policies

For enterprise security, don't allow every Pod to communicate with every other Pod.

Example:

```text
Coordinator
     │
     ├── allowed → Delegators
     │
     └── blocked → Database
```

And:

```text
RCA Worker
     │
     ├── allowed → AI Search
     ├── allowed → Approved MCP
     └── blocked → Unrelated services
```

Kubernetes NetworkPolicies can restrict traffic between workloads.

This follows the **least-privilege networking principle**.

---

# 19. Managed Identity / Workload Identity

For AKS, you don't want:

```text
API key inside Pod
```

Instead:

```text
Pod
 ↓
Azure Workload Identity
 ↓
Microsoft Entra ID
 ↓
Azure RBAC
 ↓
Azure Service
```

For example:

```text
RCA Worker Pod
       ↓
Workload Identity
       ↓
Azure AI Search
```

or:

```text
Worker
   ↓
Workload Identity
   ↓
Key Vault
```

This is the Kubernetes equivalent of using identity-based access rather than embedding credentials.

---

# 20. Secrets

Avoid putting sensitive values directly into:

```text
Docker image
Git
Source code
```

For enterprise CWD, use:

```text
AKS
 ↓
Workload Identity
 ↓
Key Vault
 ↓
Secret
```

Where possible, use Entra/managed identity directly with Azure services instead of retrieving secrets.

---

# 21. Pod Security

Your Worker containers should follow:

* Non-root containers
* Minimal base images
* Read-only filesystem where practical
* Resource limits
* Resource requests
* Vulnerability scanning
* Network policies
* RBAC
* Secrets management
* Image signing/scanning
* Restricted permissions

Example:

```text
RCA Worker
CPU Request: 250m
CPU Limit: 1
Memory Request: 512Mi
Memory Limit: 2Gi
```

The exact values should come from performance testing.

---

# 22. Resource Requests and Limits

This is important in large AKS clusters.

A Pod can specify:

```text
CPU Request
Memory Request
CPU Limit
Memory Limit
```

### Request

> "I need at least this much capacity."

### Limit

> "Don't allow me to exceed this amount."

This helps Kubernetes schedule workloads correctly.

---

# 23. Fault Isolation

Imagine:

```text
Vision Worker
```

has a memory leak.

Without isolation:

```text
Vision Worker
      ↓
Node resources exhausted
      ↓
Other applications affected
```

With proper resource limits and workload isolation:

```text
Vision Worker
      ↓
Resource limit
      ↓
Worker restarted
```

Other CWD Workers continue operating.

---

# 24. Long-Running Agent Tasks

For your CWD platform, some tasks may take minutes:

```text
Failure Analysis
Document Generation
Large RAG Investigation
Data Analysis
Report Generation
```

Don't make everything synchronous.

Use:

```text
Coordinator
     ↓
Service Bus
     ↓
Worker Pool
     ↓
Result Store
```

Example:

```text
User
 ↓
Coordinator
 ↓
Create Task
 ↓
Service Bus
 ↓
RCA Worker Pool
 ↓
Result
 ↓
Cosmos DB
 ↓
User receives result/status
```

---

# 25. LangGraph + AKS

This maps very well to your project.

Your LangGraph application can run inside a Coordinator or Worker container.

For example:

```text
Coordinator Pod
       │
       ▼
LangGraph StateGraph
       │
       ├── Intent Node
       ├── Planning Node
       ├── Delegator Routing Node
       ├── Execution Node
       └── Aggregation Node
```

LangGraph manages the **agent workflow/state**.

AKS manages:

* Container scheduling
* Replicas
* Networking
* Scaling
* Health
* Deployment
* Infrastructure

So:

> **LangGraph = application-level orchestration.**
> **Kubernetes = infrastructure-level orchestration.**

Very important distinction.

---

# 26. MCP + AKS

Your MCP servers can also be deployed as containers.

```text
Worker
   ↓
MCP Client
   ↓
MCP Server Pod
   ↓
Enterprise Tool/API
```

Example:

```text
ServiceNow Worker
      ↓
MCP Client
      ↓
ServiceNow MCP Server
      ↓
ServiceNow API
```

The MCP server can be independently scaled.

---

# 27. A2A + AKS

For agent-to-agent communication:

```text
Coordinator
      ↓
A2A
      ↓
Quality Delegator
      ↓
A2A
      ↓
RCA Worker
```

Kubernetes Services provide the network endpoints.

For asynchronous workflows:

```text
Agent
 ↓
Azure Service Bus
 ↓
Agent
```

So A2A and Service Bus solve different communication needs.

---

# 28. Deployment Strategy

Suppose you have:

```text
RCA Worker v1
```

You create:

```text
RCA Worker v2
```

You can use Kubernetes deployment strategies such as:

```text
Rolling Update
Blue/Green
Canary
```

For AI systems, canary is particularly useful.

```text
v1 → 95%
v2 → 5%
```

Monitor:

```text
Task Success
Groundedness
Hallucination
Latency
Cost
Tool Success
Safety
```

Then gradually increase:

```text
5%
 ↓
20%
 ↓
50%
 ↓
100%
```

---

# 29. CI/CD

Your deployment pipeline could be:

```text
Developer
   ↓
GitHub / Azure DevOps
   ↓
Build
   ↓
Unit Tests
   ↓
Security Scan
   ↓
Build Docker Image
   ↓
Azure Container Registry
   ↓
Deploy to AKS
   ↓
Integration Tests
   ↓
Evaluation
   ↓
Canary
   ↓
Production
```

For AI agents, add:

```text
Prompt Evaluation
RAG Evaluation
Tool Evaluation
Safety Evaluation
Regression Tests
```

before production promotion.

---

# 30. Observability

For your CWD platform, you need both **Kubernetes observability** and **AI observability**.

### Infrastructure

```text
Node CPU
Node Memory
Pod CPU
Pod Memory
Pod Restarts
Replica Count
Network
```

### Application

```text
Request latency
Error rate
Throughput
Timeouts
Retries
```

### AI

```text
Token usage
TTFT
Model latency
RAG relevance
Groundedness
Tool success
Agent success
Cost
```

### CWD tracing

```text
session_id
task_id
run_id
turn_id
step_id
agent_id
delegator_id
worker_id
tool_id
```

This gives you end-to-end traceability.

---

# 31. Production CWD AKS Architecture

For your interview, this is the architecture I would memorize:

```text
                           USERS
                             │
                             ▼
                    Azure Front Door
                         + WAF
                             │
                             ▼
                    API Management
                             │
                             ▼
                  ┌──────────────────┐
                  │       AKS        │
                  │                  │
                  │  Coordinator     │
                  │      │           │
                  │      ▼           │
                  │  Delegators      │
                  │      │           │
                  │      ▼           │
                  │  Worker Pools    │
                  │                  │
                  │  MCP Services    │
                  └────────┬─────────┘
                           │
          ┌────────────────┼─────────────────┐
          ▼                ▼                 ▼
     Azure OpenAI     Azure AI Search    Enterprise
     / Foundry                           Systems
          │                │                 │
          └────────────────┼─────────────────┘
                           │
                    Azure Service Bus
                           │
                    Async Workflows

       ┌─────────────────────────────────────┐
       │ Security                             │
       │ Entra ID | Workload Identity        │
       │ RBAC | Key Vault | Network Policies │
       └─────────────────────────────────────┘

       ┌─────────────────────────────────────┐
       │ Operations                          │
       │ HPA | KEDA | Cluster Autoscaler     │
       │ Azure Monitor | App Insights        │
       │ Log Analytics                       │
       └─────────────────────────────────────┘

       ┌─────────────────────────────────────┐
       │ AI/LLMOps                           │
       │ Foundry Evaluation | MLflow         │
       │ Prompt Registry | Agent Registry     │
       └─────────────────────────────────────┘
```

---

# 32. End-to-End onsemi Example

### Business Input

> **"Analyze why Lot L1234 experienced an 8% yield drop and determine whether equipment EQ-102 contributed to the issue."**

### Request

```text
User
 ↓
APIM
 ↓
Coordinator Pod
```

### Coordinator

```text
Intent:
Yield Investigation

Domains:
Yield + Equipment
```

### Delegators

```text
             Coordinator
              /       \
             /         \
     Yield Delegator   Equipment Delegator
```

### Worker pools

```text
Yield Delegator
    │
    ├── Yield Worker
    ├── Defect Pareto Worker
    └── Process Correlation Worker

Equipment Delegator
    │
    ├── Alarm Worker
    ├── Equipment Health Worker
    └── Maintenance Worker
```

### Execution

Workers retrieve:

```text
Manufacturing Data
Equipment Data
Historical RCA
Quality Knowledge
```

### Results

```text
Yield Worker
    ↓
8% yield reduction

Equipment Worker
    ↓
Temperature instability

Correlation Worker
    ↓
Strong relationship between EQ-102
and defect increase
```

### Coordinator

Aggregates:

```text
Yield Impact
+
Defect
+
Equipment Evidence
+
Historical Evidence
```

### Final business outcome

> **EQ-102 temperature instability is a probable contributor to the yield reduction. The system provides the supporting evidence, confidence level and recommended engineering investigation.**

If authorized:

```text
RCA
 ↓
ServiceNow Worker
 ↓
MCP/API
 ↓
Incident Created
```

---

# 33. Container Apps vs AKS — Your Interview Answer

If they ask:

**"Why didn't you use Container Apps instead of AKS?"**

Say:

> **"Container Apps is excellent for managed containerized microservices and simpler agent deployments. For a large enterprise CWD platform with many Coordinator, Delegator and Worker services, I would consider AKS when I need more control over workload scheduling, node pools, GPU workloads, networking, network policies, service-to-service communication, custom autoscaling and workload isolation. AKS also gives us a stronger Kubernetes ecosystem for operating a large agent platform. I would not choose AKS automatically; I would choose it when those operational and scale requirements justify the additional complexity."**

---

# 34. Most Important AKS Concepts for Your Interview

Focus on these **12**:

1. **AKS Cluster**
2. **Nodes & Node Pools**
3. **Pods**
4. **Deployments**
5. **Services**
6. **Ingress**
7. **HPA**
8. **KEDA**
9. **Cluster Autoscaler**
10. **Workload Identity**
11. **Network Policies**
12. **Availability Zones**

Then learn these for senior/principal-level depth:

```text
Resource Requests/Limits
      ↓
Pod Disruption Budgets
      ↓
Affinity / Anti-affinity
      ↓
Taints / Tolerations
      ↓
Rolling / Canary Deployment
      ↓
Private Networking
      ↓
Azure CNI
      ↓
Service-to-Service Security
      ↓
GPU Node Pools
      ↓
Observability
```

### The key mental model

> **AKS = infrastructure orchestration.**
> **LangGraph = agent workflow orchestration.**
> **CWD Coordinator = business orchestration.**
> **Delegator = domain/task orchestration.**
> **Worker = business task execution.**
> **MCP = tool integration.**
> **A2A = agent-to-agent communication.**
> **Service Bus = asynchronous decoupling.**
> **HPA/KEDA = workload scaling.**
> **Workload Identity = secure Azure access.**
