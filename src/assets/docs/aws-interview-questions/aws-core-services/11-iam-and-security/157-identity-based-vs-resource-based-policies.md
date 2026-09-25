## Identity-based vs Resource-based policies

The easiest way to remember:

**Identity-based = attached to the identity**
**Resource-based = attached to the resource**

|             | Identity-based                   | Resource-based                      |
| ----------- | -------------------------------- | ----------------------------------- |
| Attached to | IAM User/Role                    | AWS Resource                        |
| Answers     | “What can this identity do?”     | “Who can access this resource?”     |
| Example     | ECS Worker IAM Role              | S3 Bucket Policy                    |
| Common use  | Worker → AWS service permissions | Control access to specific resource |

### CWD example

**Identity-based policy:**

```text
RAGWorkerRole
     ↓
Allow s3:GetObject
     ↓
cwd-documents/raw/*
```

**Resource-based policy:**

```text
S3 Bucket
     ↓
Bucket Policy
     ↓
Allow RAGWorkerRole → GetObject
```

So:

```text
          RAG Worker
              ↓
        IAM Role Policy
              ↓
       What can I access?
              ↓
        S3 Bucket
              ↑
       Bucket Policy
              ↑
       Who can access me?
```

### 🎯 Strong interview answer

> **“Identity-based policies are attached to IAM identities such as roles and define what that identity can do. Resource-based policies are attached to resources such as S3 buckets or SQS queues and define which principals can access the resource. In CWD, I would use both where appropriate for defense in depth.”**

**Memory:**
**Identity policy → What can I do?**
**Resource policy → Who can access me?**
