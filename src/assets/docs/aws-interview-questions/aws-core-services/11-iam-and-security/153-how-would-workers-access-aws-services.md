## How would Workers access AWS services?

Each Worker gets a **dedicated ECS task IAM role** with only the permissions it needs.

```text
Worker
  ↓
ECS Task Role
  ↓
IAM Policy
  ↓
AWS Service
```

### Example

```text
Customer Worker
   ↓
CustomerWorkerRole
   ├── DynamoDB → GetItem
   ├── S3 → GetObject
   └── Bedrock → InvokeModel
```

A RAG Worker might have:

```text
RAGWorkerRole
   ├── S3 → GetObject
   ├── OpenSearch → Search
   └── Bedrock → InvokeModel
```

### Security

* **No hard-coded AWS access keys**
* Use temporary credentials through the **ECS task role**
* Apply **least privilege**
* Separate roles for different Workers
* Use **KMS** for encryption
* Use **VPC endpoints/private networking** where appropriate
* Monitor with **CloudTrail + CloudWatch**

### 🎯 Strong interview answer

> **“Each CWD Worker would use a dedicated ECS task IAM role. The role would contain only the permissions required by that Worker—for example, a RAG Worker could access S3, OpenSearch, and Bedrock, while a Customer Worker might access DynamoDB and Bedrock. ECS provides temporary credentials automatically, so we don't store access keys in the container. This gives us least privilege, isolation, and auditability.”**

**Memory:**
**Worker → Task Role → Least Privilege → AWS Service**
