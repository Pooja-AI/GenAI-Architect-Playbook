## IAM architecture for CWD

In CWD, I would use **IAM for AWS resource access** and keep **business/user authorization** separate.

```text
User
 ↓
Enterprise IdP / Entra ID
 ↓
API Gateway
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
AWS Services
 ├── S3
 ├── Bedrock
 ├── OpenSearch
 ├── DynamoDB
 └── Secrets Manager
```

### 1. ECS Task Roles

Each CWD service gets its own **IAM task role**.

```text
Coordinator Role
 ├── DynamoDB
 ├── Bedrock
 └── CloudWatch

Sales Worker Role
 ├── Salesforce-related resources
 ├── S3
 └── Bedrock

RAG Worker Role
 ├── S3
 ├── OpenSearch
 └── Bedrock
```

This follows **least privilege**.

A Sales Worker should not automatically have permission to access everything the Coordinator can access.

---

### 2. Task Role vs Execution Role

This is an important interview distinction.

**ECS Task Execution Role**

Used by ECS itself:

```text
ECS → ECR
   → CloudWatch Logs
```

**ECS Task Role**

Used by the application:

```text
Coordinator → DynamoDB
Coordinator → Bedrock
Worker → S3/OpenSearch
```

---

### 3. Example policy

A RAG Worker might have permission only for the required S3 prefix:

```text
s3:GetObject
arn:aws:s3:::cwd-documents/approved/*
```

rather than:

```text
s3:* on *
```

That's least privilege.

---

### 4. Secrets

I would **not put credentials in Docker images or environment files committed to Git**.

```text
Worker
 ↓
Secrets Manager
 ↓
Secret
```

KMS can protect the secret encryption keys.

---

### 5. User authorization is separate

IAM answers:

> **“Can this AWS workload access this AWS resource?”**

But CWD also needs to answer:

> **“Can this particular user access this customer/document/action?”**

That comes from the enterprise identity and authorization layer.

```text
User
 ↓
Entra ID / IdP
 ↓
Groups / Roles / Entitlements
 ↓
CWD Authorization
 ↓
Document ACL / Tool permissions
```

For example, IAM might allow the RAG Worker to query OpenSearch, but **CWD ACL filtering** determines which documents the user is allowed to retrieve.

---

### 6. Cross-service security

I would also use:

* IAM policies
* Resource-based policies where applicable
* KMS
* Security Groups
* VPC/private networking
* CloudTrail
* IAM Access Analyzer

to create defense in depth.

### 🎯 Strong interview answer

> **“In CWD, I use IAM for workload-to-AWS resource authorization and follow least privilege. Each Coordinator, Delegator and Worker gets an appropriate IAM task role rather than sharing one broad role. The ECS execution role is used by ECS for things like pulling images and writing logs, while the task role is used by the application to access services such as S3, Bedrock, DynamoDB and OpenSearch. Secrets are stored in Secrets Manager and protected with KMS. Separately, user-level authorization is handled through the enterprise identity and CWD authorization layer, including document ACLs and tool permissions. This gives us workload security plus user-level authorization.”**

**Memory trick:**

**IAM = Workload → AWS resources**

**CWD Authorization = User → Business resources**
