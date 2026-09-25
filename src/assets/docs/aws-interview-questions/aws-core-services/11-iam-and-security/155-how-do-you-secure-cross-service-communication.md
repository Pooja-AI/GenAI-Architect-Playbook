## How do you secure cross-service communication?

In CWD, I secure **Coordinator → Delegator → Worker** communication using **authentication, authorization, encryption, network isolation, and auditing**.

```text
Coordinator
    ↓ TLS
Authentication
    ↓
Authorization
    ↓
Delegator
    ↓ TLS
Worker
```

### 1. Authentication

Use workload identity such as **IAM roles / temporary credentials** for AWS services and enterprise identity mechanisms for service-to-service APIs.

### 2. Authorization

Each service gets only the permissions it needs.

```text
Coordinator → allowed → Sales Delegator
Sales Delegator → allowed → Sales Workers
```

A Worker cannot automatically call another unrelated service.

### 3. Encryption

Use **TLS/HTTPS** for communication.

For private CWD services:

```text
Private VPC
   ↓
Security Groups
   ↓
Internal Load Balancer / Service Discovery
   ↓
Worker
```

### 4. Network isolation

* ECS tasks in private subnets
* Security groups restrict source/destination and ports
* VPC endpoints/private connectivity where appropriate
* No unnecessary public endpoints

### 5. Validate requests

Each service validates:

* Caller identity
* Authorization
* Request schema
* Tenant/context
* Correlation ID
* Tool/action permissions

### 6. Audit

Log:

```text
user → service → target service → action → result → latency
```

Use **CloudTrail, CloudWatch, OpenTelemetry/Langfuse** as appropriate.

### 🎯 Strong interview answer

> **“For CWD, I secure Coordinator-to-Delegator-to-Worker communication using TLS, workload authentication, least-privilege authorization, and private network connectivity. Each service has its own identity and permissions, and requests are validated before execution. I also use correlation IDs and centralized logging for auditing and troubleshooting.”**

**Memory:**
**Authenticate → Authorize → Encrypt → Isolate → Validate → Audit**
