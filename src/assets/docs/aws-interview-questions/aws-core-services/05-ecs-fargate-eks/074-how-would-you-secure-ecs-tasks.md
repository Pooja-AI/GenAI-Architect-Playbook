# How would you secure ECS tasks?

## Short answer

For CWD, I would use **defense in depth** to secure ECS/Fargate tasks:

**Private network + Security Groups + IAM task roles + Secrets Manager + image security + least privilege + encryption + monitoring.**

```text id="8avz0e"
                    API Gateway
                         ↓
                        ALB
                         ↓
                  Private ECS Tasks
                ┌───────────────┐
                │ Coordinator   │
                │ Delegators    │
                │ Workers       │
                └───────────────┘
                   ↓    ↓    ↓
                 IAM  Secrets  MCP
                   ↓    ↓    ↓
                AWS services / Enterprise
```

---

# 1. Keep ECS tasks private

I would deploy CWD tasks in **private subnets**.

```text id="s6c0hy"
Internet
   ↓
API Gateway
   ↓
ALB
   ↓
Private Subnet
   ↓
ECS/Fargate
```

I would avoid assigning public IPs to the application tasks unless there is a specific requirement.

---

# 2. Use Security Groups

Security Groups should allow only required traffic.

Example:

```text id="j1ngqx"
ALB Security Group
        ↓
   TCP 8000
        ↓
ECS Security Group
```

The ECS security group should **not** allow arbitrary inbound traffic from the internet.

For internal services:

```text id="1e3q7x"
Coordinator SG
      ↓
Delegator SG
      ↓
Worker SG
```

Only the required ports and sources are allowed.

---

# 3. Use IAM Task Roles

This is one of the most important controls.

Instead of putting AWS credentials inside the container:

```text id="v0d2f1"
❌ AWS_ACCESS_KEY_ID
❌ AWS_SECRET_ACCESS_KEY
```

use an ECS **task IAM role**.

```text id="0f8k2z"
CWD Worker
    ↓
ECS Task Role
    ↓
Allowed AWS APIs
```

For example, a Worker that only needs S3 read access should not have permissions to delete S3 objects.

That's **least privilege**.

---

# 4. Separate Task Role and Execution Role

This is a good interview detail.

### Task execution role

Used by ECS/Fargate to do things such as:

```text
Pull image from ECR
Send logs to CloudWatch
```

### Task role

Used by the **application inside the container**:

```text
Coordinator
Worker
   ↓
AWS APIs
```

Memory:

> **Execution role = ECS infrastructure operations**

> **Task role = application permissions**

---

# 5. Store secrets in Secrets Manager

Never put:

```text id="hkn3cq"
Salesforce password
API key
database password
```

inside:

```text id="zj4s7e"
Dockerfile
Git repository
source code
```

Instead:

```text id="0jv2pb"
ECS Worker
    ↓
IAM Task Role
    ↓
Secrets Manager
    ↓
Secret
```

Secrets can be encrypted with **AWS KMS**.

---

# 6. Secure the container image

I would use:

```text id="i9j1vz"
Developer
   ↓
Docker Image
   ↓
ECR
   ↓
Vulnerability scanning
   ↓
ECS/Fargate
```

Security practices:

* Use minimal base images.
* Keep dependencies updated.
* Scan images for vulnerabilities.
* Don't run unnecessary packages.
* Pin dependencies where appropriate.
* Use immutable/versioned image tags.
* Don't put secrets in the image.

For example:

```text id="0u0d2p"
python:3.12-slim
```

is preferable to unnecessarily large base images.

---

# 7. Run the container with least privilege

The application should not run with unnecessary operating-system privileges.

Where supported by the runtime/design:

* Run as a non-root user.
* Use read-only filesystem where practical.
* Drop unnecessary Linux capabilities.
* Avoid privileged containers.
* Restrict writable directories.

Conceptually:

```text id="q1z6tq"
Container
 ├── Non-root user
 ├── Minimal filesystem permissions
 ├── No privileged mode
 └── Minimal capabilities
```

---

# 8. Encrypt traffic

For CWD:

```text id="l4xqjp"
Client
  ↓ HTTPS
API Gateway
  ↓
ALB
  ↓
ECS
  ↓
MCP
  ↓
Enterprise Systems
```

Use TLS for network communication.

For sensitive AWS data:

```text id="w3j2p4"
ECS
 ↓
KMS encryption
 ↓
S3 / DynamoDB / Secrets Manager
```

---

# 9. Protect MCP connections

This is especially important for CWD.

```text id="rj4s0c"
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Salesforce / ServiceNow
```

I would apply:

* Authentication
* Authorization
* TLS
* Input validation
* Least privilege
* Tool-level permissions
* Audit logging
* Timeouts
* Rate limits

The Worker should **not** be able to call every MCP tool just because it is running inside ECS.

---

# 10. Protect against container escape / runtime threats

I would also follow container hardening practices:

```text id="a0w1qg"
Minimal image
      ↓
Non-root
      ↓
No privileged mode
      ↓
Least capabilities
      ↓
Private networking
      ↓
Runtime monitoring
```

For sensitive workloads, I would also evaluate AWS/runtime-specific security controls appropriate to the environment.

---

# 11. Network segmentation

I would separate components where useful.

For example:

```text id="5hz7js"
Public/API layer
       ↓
ALB
       ↓
Application subnet
       ↓
ECS Coordinator
       ↓
Internal services
       ↓
Enterprise integration
```

The goal is to prevent:

```text id="d3p0zt"
Compromised Worker
       ↓
❌ Access everything
```

Instead:

```text id="axd5jb"
Compromised Worker
       ↓
Only explicitly allowed resources
```

---

# 12. Monitor and audit

I would monitor:

```text id="b9m7rj"
CloudWatch
 ├── ECS logs
 ├── CPU/memory
 ├── task failures
 └── network/application errors

CloudTrail
 └── AWS API activity

Security tooling
 └── vulnerability / threat findings
```

For CWD, I would also propagate:

```text id="f34bqz"
correlation_id
session_id
run_id
delegator_id
worker_id
```

so I can trace:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
Enterprise System
```

---

# 13. Protect the AI layer

Because CWD is an agentic system, container security alone isn't enough.

For example:

```text id="z8myy1"
Worker
 ↓
Untrusted MCP response
 ↓
LLM
```

I would treat external content as **untrusted data**, validate tool parameters, enforce authorization outside the LLM, and restrict tools using least privilege.

The LLM should **never decide authorization**.

---

# 🎯 Strong interview answer

> **“I secure CWD ECS tasks using defense in depth. I place the tasks in private subnets, expose them only through the required ALB/API boundary, and use security groups with least-privilege rules. Each task gets an IAM task role with only the AWS permissions it needs, while secrets are stored in Secrets Manager and encrypted with KMS. I use minimal and vulnerability-scanned container images, run containers as non-root where practical, avoid privileged containers, and encrypt service-to-service traffic. For CWD specifically, I also secure MCP communication with authentication, authorization, tool-level permissions and auditing. Finally, I use CloudWatch, CloudTrail and security monitoring to detect and investigate runtime activity.”**

## Easy memory trick

**Network → IAM → Secrets → Image → Runtime → Encryption → Monitor**

```text id="y7v8k3"
Private Network
      ↓
Security Groups
      ↓
IAM Task Role
      ↓
Secrets Manager
      ↓
Secure Image
      ↓
Non-root Container
      ↓
TLS/KMS
      ↓
CloudWatch/CloudTrail
```

### Key distinction

**Security Group** → *Who can connect to the task?*

**IAM Task Role** → *What AWS resources can the application access?*

**Secrets Manager** → *Where are sensitive credentials stored?*

**Container hardening** → *What can the process do inside the container?*

**MCP authorization** → *Which enterprise tools can the Worker actually execute?*

**CloudWatch/CloudTrail** → *What happened and how do I investigate it?*
