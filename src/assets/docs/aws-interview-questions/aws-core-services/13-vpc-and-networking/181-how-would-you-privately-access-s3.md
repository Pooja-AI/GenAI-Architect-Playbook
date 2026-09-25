## How would you privately access S3?

For CWD, I would use an **S3 Gateway VPC Endpoint**.

```text
Private ECS Worker
       ↓
Private Subnet
       ↓
Route Table
       ↓
S3 Gateway Endpoint
       ↓
Amazon S3
```

### Why?

* No public IP required.
* Traffic stays on the AWS network.
* No NAT Gateway required for S3 access.
* Can restrict which VPC/subnets/roles can access the bucket.
* Combine with **IAM + S3 bucket policy + KMS**.

### CWD example

```text
RAG Worker
   ↓
S3 Gateway Endpoint
   ↓
CWD Documents Bucket
   ↓
SSE-KMS encrypted documents
```

### 🎯 Strong interview answer

> **“For private S3 access, I would use an S3 Gateway VPC Endpoint. The private ECS Worker routes S3 traffic through the endpoint instead of going through NAT or the public internet. I would additionally restrict access using IAM roles and S3 bucket policies and use SSE-KMS for sensitive documents.”**

**Memory:**
**Private ECS → Route Table → S3 Gateway Endpoint → S3**
