# How would you implement service discovery?

## Short answer

For CWD on **ECS/Fargate**, I would use **AWS Cloud Map** for service discovery, especially for internal communication between the **Coordinator → Delegators → Workers**.

Instead of hardcoding container IP addresses, services discover each other through a **logical service name**.

```text
Coordinator
    ↓
service discovery
    ↓
Sales Delegator
    ↓
service discovery
    ↓
Customer Worker
```

## CWD flow

```text
                     CWD
                      ↓
               Coordinator
                      ↓
             AWS Cloud Map
             /            \
            ↓              ↓
    Sales Delegator    IT Delegator
            ↓              ↓
      Cloud Map        Cloud Map
            ↓              ↓
    Customer Worker   Incident Worker
```

---

# 1. Why do we need service discovery?

Imagine ECS creates containers dynamically:

```text
Customer Worker
10.0.1.25
```

Later that container is replaced:

```text
Customer Worker
10.0.2.41
```

If the Coordinator has:

```text
CUSTOMER_WORKER_IP=10.0.1.25
```

the application breaks.

So we don't use container IPs directly.

Instead:

```text
customer-worker.cwd.local
```

The IP can change, but the service name remains the same.

---

# 2. AWS Cloud Map

AWS Cloud Map provides service discovery.

Example:

```text
Namespace:
cwd.internal

Services:
├── coordinator
├── sales-delegator
├── service-delegator
├── customer-worker
└── incident-worker
```

Then:

```text
Coordinator
     ↓
sales-delegator.cwd.internal
```

The service discovery system resolves that name to the currently available task.

---

# 3. ECS registers tasks

Suppose we have:

```text
Customer Worker
 ├── Task 1 → 10.0.1.10
 ├── Task 2 → 10.0.1.11
 └── Task 3 → 10.0.1.12
```

Cloud Map knows:

```text
customer-worker.cwd.internal
       ↓
10.0.1.10
10.0.1.11
10.0.1.12
```

If Task 2 disappears:

```text
customer-worker.cwd.internal
       ↓
10.0.1.10
10.0.1.12
```

The application doesn't need to know that Task 2 was replaced.

---

# 4. Coordinator → Delegator

For example:

```text
Coordinator
     ↓
sales-delegator.cwd.internal
     ↓
Sales Delegator
```

The Coordinator doesn't need:

```text
10.0.1.25
```

It uses:

```text
sales-delegator.cwd.internal
```

---

# 5. Delegator → Worker

Similarly:

```text
Sales Delegator
       ↓
customer-worker.cwd.internal
       ↓
Customer Worker
```

If we scale:

```text
Customer Worker
   ↓
Task 1
Task 2
Task 3
Task 4
```

service discovery can resolve the service to available instances.

---

# 6. Service discovery vs ALB

This is an important interview question.

### ALB

Use when you need:

```text
HTTP/HTTPS
Load balancing
Health checks
External or internal HTTP entry point
```

Example:

```text
API Gateway
    ↓
ALB
    ↓
Coordinator
```

### Cloud Map

Use when you need:

```text
Internal service discovery
Dynamic service addresses
Service-to-service communication
```

Example:

```text
Coordinator
    ↓
Cloud Map
    ↓
Sales Delegator
```

They can also be used together depending on the architecture.

---

# 7. Service discovery doesn't replace authorization

Finding a service doesn't mean you're allowed to call it.

For example:

```text
Coordinator
    ↓
Discover Sales Worker
    ↓
IAM / network policy / application authorization
    ↓
Allowed?
    ↓
Call Worker
```

I would still use:

* IAM
* Security groups
* Private networking
* Authentication
* Authorization
* Least privilege
* mTLS where appropriate
* Application-level access controls

---

# 8. Service discovery + MCP

In CWD, there's another layer.

```text
Coordinator
   ↓
Sales Delegator
   ↓
Customer Worker
   ↓
MCP Client
   ↓
MCP Server
   ↓
Salesforce
```

Service discovery can help locate **internal Worker or MCP services**, but MCP itself handles **tool discovery**.

So:

**Cloud Map = Where is the service?**

**MCP `tools/list` = What tools does this server provide?**

That's a very important distinction.

---

# 9. Example

Suppose CWD has:

```text
Sales Delegator
Customer Worker
Opportunity Worker
```

Cloud Map:

```text
cwd.internal
│
├── sales-delegator
├── customer-worker
└── opportunity-worker
```

Request:

```text
Customer Briefing
customer_id = C123
```

Flow:

```text
Coordinator
    ↓
Sales Delegator
    ↓
Cloud Map
    ↓
customer-worker.cwd.internal
    ↓
Customer Worker
    ↓
MCP
    ↓
Salesforce
```

---

# 🎯 Strong interview answer

> **“For internal CWD service-to-service communication, I would use AWS Cloud Map for service discovery. ECS tasks are dynamically created and replaced, so I don't want the Coordinator or Delegators to hardcode container IP addresses. I would register services such as Sales Delegator, Customer Worker and Incident Worker in a private Cloud Map namespace and access them through stable service names. Cloud Map handles dynamic service registration and discovery, while security groups, IAM and application authorization control who can actually call the service. For HTTP load balancing I can use an ALB, while Cloud Map solves the service-discovery problem.”**

## Easy memory trick

**Cloud Map = “Where is the service?”**

```text
Coordinator
    ↓
Cloud Map
    ↓
sales-delegator.cwd.internal
    ↓
Sales Delegator
```

### Key distinction

| Component            | Responsibility                        |
| -------------------- | ------------------------------------- |
| **Cloud Map**        | Discover internal services            |
| **ALB**              | Load balance HTTP traffic             |
| **ECS**              | Run/manage containers                 |
| **IAM/Auth**         | Control permissions                   |
| **MCP**              | Discover and invoke tools             |
| **Service Registry** | CWD-level knowledge of agents/workers |

**Interview one-liner:**

> **“Cloud Map tells me where the service is; ALB distributes traffic; IAM and authorization determine whether I can call it.”**
