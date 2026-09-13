# Azure Load Balancing

**Azure Load Balancing** is about distributing incoming traffic or workload across multiple healthy instances of an application so that no single instance becomes a bottleneck.

For your **CWD Agentic AI platform**, think:

> **Load balancing = distribute requests/tasks across multiple Coordinator, Delegator, Worker, or API instances for scalability and availability.**

---

# 1. Why do we need Load Balancing?

Suppose you have only one Coordinator:

```text
100 Users
    │
    ▼
Coordinator
```

If 100 users send requests simultaneously, that one instance can become overloaded.

Instead:

```text
                  Users
                    │
                    ▼
              Load Balancer
             /      |      \
            ▼       ▼       ▼
      Coordinator Coordinator Coordinator
        Instance 1  Instance 2  Instance 3
```

Traffic is distributed across instances.

Benefits:

* Scalability
* High availability
* Better throughput
* Fault tolerance
* Reduced bottlenecks
* Rolling deployments

---

# 2. Azure Load Balancing Services

You should know these four:

| Azure Service           | Main purpose                               |
| ----------------------- | ------------------------------------------ |
| **Azure Front Door**    | Global HTTP/HTTPS traffic                  |
| **Application Gateway** | Regional Layer-7 HTTP/HTTPS load balancing |
| **Azure Load Balancer** | Layer-4 TCP/UDP load balancing             |
| **Traffic Manager**     | DNS-based global traffic routing           |

For modern enterprise AI architectures, **Front Door + Application Gateway/Load Balancer + APIM** may be used at different layers depending on requirements.

---

# 3. Layer 4 vs Layer 7

This is an important interview concept.

### Layer 4

Works with:

* TCP
* UDP
* IP
* Port

It doesn't deeply understand HTTP requests.

Example:

```text
Client
   │
   ▼
Azure Load Balancer
   │
   ├── Server 1
   ├── Server 2
   └── Server 3
```

### Layer 7

Understands application-level HTTP/HTTPS traffic.

Can route based on:

* Host
* URL path
* HTTP headers
* HTTP methods
* Cookies

Example:

```text
/api/equipment/* → Equipment service
/api/quality/*   → Quality service
/api/yield/*     → Yield service
```

**Application Gateway** and **Front Door** are Layer-7 capable.

---

# 4. Azure Load Balancer

Azure Load Balancer is primarily a **Layer-4 load balancer**.

Example:

```text
                     Azure Load Balancer
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
          Worker 1       Worker 2       Worker 3
```

It distributes TCP/UDP traffic across backend instances.

### Good for

* VM workloads
* AKS networking scenarios
* High-throughput TCP/UDP workloads
* Internal load balancing
* Regional traffic distribution

---

# 5. Application Gateway

Application Gateway is a **regional Layer-7 application load balancer**.

Example:

```text
User
 │
 ▼
Application Gateway
 │
 ├── /api/quality → Quality service
 ├── /api/equipment → Equipment service
 └── /api/yield → Yield service
```

It can provide:

* HTTP/HTTPS routing
* Path-based routing
* Host-based routing
* TLS termination
* WAF
* Health probes

---

# 6. Front Door vs Application Gateway

This is a very common interview question.

### Front Door

> **Global application delivery**

```text
Users worldwide
       ↓
Azure Front Door
       ↓
Region
```

### Application Gateway

> **Regional application delivery**

```text
Regional users
      ↓
Application Gateway
      ↓
Backend services
```

Memory trick:

> **Front Door = Global**

> **Application Gateway = Regional**

---

# 7. Front Door + Application Gateway

You can use both.

Example:

```text
                    Internet
                       │
                       ▼
                Azure Front Door
                 WAF / Global
                     Routing
                       │
                       ▼
              Application Gateway
                 Regional WAF
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Coordinator   Coordinator   Coordinator
```

This can make sense when you need **global routing plus regional Layer-7 routing**.

But don't automatically deploy every service. Architecture should be based on actual requirements.

---

# 8. Load Balancing in CWD

Suppose your Coordinator has three replicas:

```text
                     APIM
                      │
                      ▼
               Load Balancer
                /     |     \
               ▼      ▼      ▼
          Coord-1  Coord-2  Coord-3
```

If one instance becomes unhealthy:

```text
               Load Balancer
                /           \
               ▼             ▼
          Coord-1          Coord-3
             ❌
```

Traffic is sent to healthy instances according to the configured health/routing behavior.

---

# 9. Kubernetes / AKS Load Balancing

This is particularly important for your CWD architecture.

Suppose you deploy:

```text
Coordinator Deployment
        │
        ├── Pod 1
        ├── Pod 2
        └── Pod 3
```

Pods are ephemeral.

Their IP addresses can change.

A Kubernetes **Service** provides a stable endpoint:

```text
                    Coordinator Service
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
            Pod 1        Pod 2        Pod 3
```

The Service distributes traffic to healthy Pods.

---

# 10. AKS + Ingress

For HTTP applications:

```text
Internet / APIM
       │
       ▼
Ingress
       │
       ▼
Kubernetes Service
       │
       ▼
Coordinator Pods
```

Ingress can provide HTTP routing such as:

```text
/api/coordinator → Coordinator Service
/api/quality     → Quality Service
/api/equipment   → Equipment Service
```

---

# 11. Load Balancing Delegators

You don't only load-balance Coordinators.

Suppose:

```text
Quality Delegator
       │
       ├── Instance 1
       ├── Instance 2
       └── Instance 3
```

Requests can be distributed across the instances.

Similarly:

```text
Equipment Worker
       │
       ├── Worker 1
       ├── Worker 2
       ├── Worker 3
       └── Worker 4
```

This is especially useful when many users are asking questions simultaneously.

---

# 12. Worker Load Balancing vs Queue-Based Scaling

This distinction is **very important for Agentic AI**.

For short synchronous requests:

```text
Request
   ↓
Load Balancer
   ↓
Worker 1 / 2 / 3
```

For long-running tasks:

```text
Coordinator
     │
     ▼
Service Bus Queue
     │
     ▼
Worker Pool
 ┌───┼───┬───┐
 ▼   ▼   ▼   ▼
W1  W2  W3  W4
```

Here the **queue distributes work**, rather than simply using a traditional request load balancer.

### Mental model

> **Load Balancer = distribute network requests.**

> **Service Bus = distribute asynchronous work.**

---

# 13. Agentic AI Has a Special Problem

Normal applications often scale based on:

* CPU
* Memory
* Requests per second

AI applications need additional considerations:

* LLM TPM
* RPM
* Concurrent model calls
* Token consumption
* TTFT
* Model latency
* GPU capacity
* Cost

Example:

```text
100 Worker replicas
       │
       ▼
Azure OpenAI
       │
       ▼
TPM/RPM quota exceeded
       │
       ▼
429
```

Simply adding more Worker instances can actually **make the problem worse**.

So:

> **Scale the application and model capacity together.**

---

# 14. Load Balancing + Azure OpenAI

Suppose you have multiple model deployments:

```text
                   AI Gateway
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Deployment A  Deployment B  Deployment C
       East US       Central US     West US
```

The gateway can route requests according to policies such as:

* Capacity
* Region
* Model
* Health
* Latency
* Quota
* Priority

This can provide better resilience.

But routing must respect the model's supported deployment/region and quota characteristics.

---

# 15. Load Balancing vs Autoscaling

These are different.

### Load balancing

Answers:

> **Where should this request go?**

### Autoscaling

Answers:

> **How many instances should I run?**

Example:

```text
100 requests
    │
    ▼
Load Balancer
    │
 ┌──┼──┐
 ▼  ▼  ▼
W1 W2 W3
```

If traffic increases:

```text
1000 requests
     │
     ▼
Autoscaler
     │
     ▼
10 Workers
     │
     ▼
Load Balancer
     │
     ▼
Workers
```

You typically need both.

---

# 16. Health Probes

Load balancers need to know whether backend instances are healthy.

Example:

```text
Load Balancer
      │
      ├── Worker 1 → Healthy
      ├── Worker 2 → Healthy
      └── Worker 3 → Unhealthy
```

Worker 3 should not continue receiving traffic if it fails the configured health check.

For CWD services, health endpoints could distinguish:

```text
/liveness
/readiness
```

### Liveness

> Is the application process alive?

### Readiness

> Is the application ready to receive traffic?

This distinction is particularly useful for AI services that may require model/configuration initialization.

---

# 17. Session State and Load Balancing

Agent applications often maintain state.

Suppose:

```text
User
 ↓
Request 1 → Worker 1
Request 2 → Worker 2
Request 3 → Worker 3
```

This is perfectly fine **if the application is stateless and state is externalized**.

For CWD, store important state in services such as:

* Redis
* Cosmos DB
* SQL/database
* Durable state stores

Then any Coordinator instance can process the next request.

```text
             Coordinator Pool
          /       |        \
         ▼        ▼         ▼
       C1         C2        C3
          \       |        /
           ▼      ▼       ▼
             Redis/DB
              State
```

### Better than sticky sessions

For highly scalable architectures, prefer **externalized shared state** over depending heavily on session affinity/sticky sessions.

---

# 18. CWD Production Architecture

A strong architecture could look like:

```text
                         Users
                           │
                           ▼
                  Azure Front Door
                    Global + WAF
                           │
                           ▼
                          APIM
                           │
                           ▼
                  Regional Entry Layer
                           │
                           ▼
                 Coordinator Service
                    /      |      \
                   ▼       ▼       ▼
                  C1       C2       C3
                           │
                           ▼
                    Delegator Services
                  /        |         \
                 ▼         ▼          ▼
             Quality   Equipment    Supply Chain
                 │         │          │
                 ▼         ▼          ▼
              Workers   Workers    Workers
                 │         │          │
                 └─────────┼──────────┘
                           ▼
                     Service Bus
                    for async tasks
                           │
                           ▼
                  Enterprise Systems
```

---

# 19. Complete Azure Load-Balancing Strategy

For CWD, I would think about traffic at multiple levels:

### Level 1 — Global

**Azure Front Door**

```text
Global users → Front Door → Region
```

### Level 2 — API

**APIM**

```text
Client → APIM → API backend
```

### Level 3 — Regional application

**Application Gateway / Ingress**

```text
Regional traffic → App Gateway → Services
```

### Level 4 — Kubernetes

**Kubernetes Service**

```text
Service → Pods
```

### Level 5 — Async work

**Service Bus**

```text
Task → Queue → Worker Pool
```

### Level 6 — AI model capacity

**AI gateway/model routing**

```text
Worker → AI Gateway → Model Deployment
```

---

# 20. Very Important Interview Comparison

| Technology              | Main purpose                               |
| ----------------------- | ------------------------------------------ |
| **Front Door**          | Global HTTP/HTTPS routing + edge           |
| **Application Gateway** | Regional Layer-7 routing                   |
| **Azure Load Balancer** | Layer-4 TCP/UDP load balancing             |
| **Traffic Manager**     | DNS-based global routing                   |
| **Kubernetes Service**  | Stable endpoint + Pod traffic distribution |
| **Ingress**             | HTTP routing into Kubernetes               |
| **Service Bus**         | Asynchronous workload distribution         |
| **Autoscaler**          | Adjust number of instances                 |
| **AI Gateway**          | Model traffic/capacity/routing             |

---

# 21. Strong Solution Architect Interview Answer

> **“For a production CWD platform, I would use multiple traffic-distribution layers based on the workload. Azure Front Door would provide the global entry point, WAF, TLS and multi-region routing. API Management would govern API traffic, while Application Gateway or Kubernetes Ingress could provide regional Layer-7 routing when required. Within AKS, Kubernetes Services would distribute requests across Coordinator, Delegator and Worker Pods.**
>
> **For long-running or bursty agent tasks, I would not rely only on synchronous load balancing. I would use Azure Service Bus to distribute asynchronous work across Worker pools, with KEDA or another autoscaling mechanism scaling workers based on queue depth. For AI workloads, I would also consider model capacity—TPM, RPM, concurrency, latency and 429 rates—because simply adding more Worker replicas can overwhelm the model deployment. Finally, I would externalize agent state into Redis or a persistent store so that Coordinator instances remain largely stateless and requests can be distributed freely across healthy replicas.”**

---

## Final mental model

Remember:

> **Front Door → Global traffic**

> **APIM → API traffic**

> **Application Gateway → Regional HTTP traffic**

> **Load Balancer → TCP/UDP traffic**

> **Kubernetes Service → Pod traffic**

> **Service Bus → Async work**

> **Autoscaling → Number of instances**

> **AI Gateway → Model traffic**

### Best interview sentence

> **“For agentic AI, load balancing is not just distributing HTTP requests; I design traffic distribution together with autoscaling, asynchronous queues, externalized state and LLM capacity so that scaling the agent layer does not overwhelm downstream tools or model quotas.”**
