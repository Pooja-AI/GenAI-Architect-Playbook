## Why use IAM roles instead of access keys?

Because **IAM roles provide temporary credentials and avoid storing long-term AWS secrets in the application**.

### Access keys

```text
Application
   ↓
Access Key + Secret Key
   ↓
AWS
```

Problems:

* Long-lived credentials
* Need rotation
* Risk of leaking through code, Docker images, logs, or configuration
* Harder to manage at scale

### IAM Role

```text
ECS/Fargate
     ↓
IAM Task Role
     ↓
Temporary Credentials
     ↓
AWS Services
```

Benefits:

1. **Temporary credentials** — automatically obtained and rotated.
2. **No hard-coded secrets** in application code.
3. **Least privilege** — each CWD service can have its own role.
4. **Better auditing** — CloudTrail can track role-based activity.
5. **Easier operations** — no manual access-key rotation for workloads.

### CWD example

```text
Coordinator → CoordinatorRole → Bedrock + DynamoDB

RAG Worker → RAGWorkerRole → S3 + OpenSearch

Sales Worker → SalesWorkerRole → Required AWS resources
```

Each service gets only what it needs.

### 🎯 Strong interview answer

> **“I prefer IAM roles over access keys for CWD workloads because roles provide temporary credentials and eliminate the need to store long-lived AWS secrets in the application. Each ECS task can assume a dedicated least-privilege role, such as a Coordinator role or RAG Worker role. This reduces credential leakage and rotation risk and provides better auditability through CloudTrail.”**

**Memory trick:**
**Access Key = Long-lived secret**
**IAM Role = Temporary + Least Privilege**
