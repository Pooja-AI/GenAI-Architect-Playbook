# When would you choose EKS?

## Short answer

I would choose **Amazon EKS** when CWD requires **Kubernetes-level orchestration, advanced container management, high scalability, complex microservices, or Kubernetes-native capabilities** that go beyond what ECS/Fargate provides.

## Key points

* Kubernetes orchestration.
* Large-scale containerized workloads.
* Complex microservice architecture.
* Advanced autoscaling.
* Kubernetes-native deployment patterns.
* Service mesh and advanced networking.
* GPU workloads when required.
* Fine-grained workload scheduling.
* Helm/operators/custom Kubernetes controllers.
* Multi-team platform standardization.

### CWD flow

```text id="r5k8dn"
User / Application
       ↓
   API Gateway
       ↓
      ALB
       ↓
      EKS
       ↓
 ┌───────────────────────────┐
 │ CWD Kubernetes Cluster    │
 │                           │
 │ Coordinator               │
 │ Delegators                │
 │ Workers                   │
 │ MCP Services              │
 │ RAG Services              │
 │ Evaluation Services       │
 └───────────────────────────┘
       ↓
Bedrock / OpenSearch / AWS Services
```

## Why EKS?

**1. Complex microservices**

If CWD grows into many independently deployed services:

```text id="w2f6mc"
Coordinator Service
       ↓
Sales Delegator
       ↓
Service Delegator
       ↓
Multiple Workers
       ↓
MCP Services
       ↓
Evaluation Services
```

EKS provides Kubernetes orchestration for these workloads.

---

**2. Advanced autoscaling**

We can scale workloads based on different signals:

```text id="g8v3qp"
CPU
Memory
Request rate
Queue depth
Custom metrics
        ↓
Kubernetes Autoscaling
        ↓
More / fewer Pods
```

For example, if Worker demand increases significantly, Kubernetes can scale Worker pods independently.

---

**3. Kubernetes-native deployment**

EKS supports standard Kubernetes mechanisms such as:

* Deployments
* Services
* ConfigMaps
* Secrets
* Ingress
* Helm
* Horizontal Pod Autoscaler
* Cluster Autoscaler/Karpenter

This is useful when an organization already has a strong Kubernetes platform.

---

**4. Advanced networking**

For complex enterprise environments, we may need:

* Private subnets
* Network policies
* Ingress control
* Service-to-service communication
* Service mesh
* Fine-grained traffic routing

EKS gives us Kubernetes-native options for these patterns.

---

**5. GPU workloads**

If CWD eventually hosts specialized models or AI workloads requiring GPUs:

```text id="c0r7vy"
AI Worker
   ↓
GPU Pod
   ↓
EKS GPU Node
```

EKS can provide Kubernetes-based scheduling and management of those workloads.

For managed foundation models such as Bedrock, we wouldn't need GPUs in CWD simply to call the model.

---

**6. Platform standardization**

If the company already runs hundreds of applications on Kubernetes, using EKS can provide a common platform for:

```text id="n4q9ws"
CWD
Other AI services
ML services
Microservices
Internal platforms
```

This can simplify organizational standards around deployment, observability, security, and operations.

---

## When I would NOT choose EKS

I wouldn't choose EKS just because it is powerful.

For a relatively simple CWD deployment:

```text
Simple API
   ↓
ECS/Fargate
```

may be sufficient.

EKS introduces additional Kubernetes operational complexity:

* Cluster management
* Kubernetes upgrades
* Networking
* RBAC
* Pod scheduling
* Ingress
* Observability
* Security policies

So there should be a real architectural reason to use it.

---

## ECS/Fargate vs EKS

| Requirement                  | ECS/Fargate                       | EKS                               |
| ---------------------------- | --------------------------------- | --------------------------------- |
| Simple container service     | ✅                                 | Possible                          |
| Long-running API             | ✅                                 | ✅                                 |
| Server management            | Low                               | Low, but more platform complexity |
| Kubernetes required          | ❌                                 | ✅                                 |
| Complex microservices        | ✅                                 | ✅                                 |
| Advanced Kubernetes features | Limited                           | ✅                                 |
| Helm/operators               | ❌                                 | ✅                                 |
| Service mesh                 | Possible through other mechanisms | Strong Kubernetes ecosystem       |
| GPU scheduling               | Possible                          | Strong fit                        |
| Operational complexity       | Lower                             | Higher                            |
| Existing Kubernetes platform | Less natural                      | Strong fit                        |

---

## Example in CWD

Suppose CWD grows from:

```text id="s7m3ka"
1 Coordinator
2 Delegators
10 Workers
```

to:

```text id="d1x8rp"
Multiple Coordinators
     ↓
Many Delegators
     ↓
Hundreds of Workers
     ↓
Many MCP services
     ↓
Evaluation / Guardrail services
     ↓
Multiple AI workloads
```

At that point, if the organization already operates Kubernetes, EKS can provide a standardized platform for deploying and scaling these services.

---

## 🎯 Strong interview answer

> **“I would choose EKS when the CWD platform requires Kubernetes-level orchestration and advanced container capabilities. For example, if we have many independently deployed Coordinators, Delegators, Workers, MCP services, and AI workloads that need independent scaling, advanced scheduling, service-to-service networking, or GPU workloads, EKS becomes a strong option. I would also consider it when the organization already has a mature Kubernetes platform and operational expertise. I wouldn't choose EKS just because it is more powerful; for a simpler containerized CWD backend, ECS/Fargate can provide the required capability with less operational complexity.”**

## Easy memory trick

**EKS = Kubernetes + Scale + Control + Complex workloads**

Think:

```text id="q5n9bt"
Lambda
  ↓
Function

ECS/Fargate
  ↓
Container

EKS
  ↓
Kubernetes platform
```

## Key distinction

> **“I choose ECS/Fargate when I mainly need managed containers. I choose EKS when I need the Kubernetes platform and its advanced orchestration capabilities.”**
