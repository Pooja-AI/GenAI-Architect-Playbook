## How do you implement resource-based policies?

A **resource-based policy is attached to the AWS resource itself** and defines **who can access that resource and what they can do**.

```text
Worker
  ↓
IAM Role
  ↓
Resource-based Policy
  ↓
S3 / SQS / KMS / etc.
```

### Example: S3 in CWD

Suppose the RAG Worker should read only CWD documents.

```text
RAGWorkerRole
      ↓
S3 Bucket Policy
      ↓
cwd-documents/raw/*
```

The S3 bucket policy can say:

```text
Principal: RAGWorkerRole
Action: s3:GetObject
Resource: arn:aws:s3:::cwd-documents/raw/*
```

So the Worker can read the required objects but not unrelated buckets.

### Why use it?

It gives another security layer:

```text
Identity Policy
       +
Resource Policy
       ↓
Access decision
```

For example:

* **IAM policy** → what the Worker role is allowed to do
* **S3 bucket policy** → what the bucket allows that role to do

### 🎯 Strong interview answer

> **“I use resource-based policies to control access directly at the resource level. For example, in CWD, an S3 bucket policy can allow only the RAG Worker IAM role to read objects from a specific prefix. Combined with the Worker's IAM identity policy, this provides defense in depth and prevents unauthorized access to other resources.”**

**Memory:**
**IAM policy = Who can do what**
**Resource policy = Who can access this resource**
