## How would you secure traffic between services?

For CWD, I use **TLS + authentication + authorization + network isolation**.

```text id="j4q5t8"
Coordinator
    │
    │ HTTPS/TLS
    ▼
Delegator
    │
    │ HTTPS/TLS
    ▼
Worker
```

### 1. TLS encryption

Use **HTTPS/TLS** for Coordinator → Delegator → Worker communication so data is encrypted in transit.

### 2. Service authentication

Each service has its own identity.

```text id="h6v1re"
Coordinator Identity
       ↓
Authentication
       ↓
Delegator
```

Use IAM/workload identity or enterprise identity mechanisms depending on the communication path.

### 3. Authorization

Don't assume that an authenticated service can call everything.

```text id="6x3q2m"
Coordinator → allowed → Sales Delegator
Sales Delegator → allowed → Sales Worker
```

Use least-privilege permissions and service-level authorization.

### 4. Network isolation

Keep CWD services in **private subnets** and use Security Groups:

```text id="3n7q8k"
Coordinator SG
     ↓ allowed
Delegator SG
     ↓ allowed
Worker SG
```

### 5. Validate requests

Each service validates:

* Caller identity
* Authorization
* Request schema
* Tenant/context
* Correlation ID
* Allowed operation

### 6. Audit

Track service-to-service calls using **CloudWatch/CloudTrail and distributed tracing**, with correlation IDs.

### 🎯 Strong interview answer

> **“I secure CWD service-to-service traffic using TLS for encryption in transit, service identities for authentication, least-privilege authorization, and private networking with Security Groups. Each service validates the caller and request before execution, and I use correlation IDs and centralized logging for auditing and troubleshooting.”**

**Memory:**
**TLS → Authenticate → Authorize → Isolate → Validate → Audit**
