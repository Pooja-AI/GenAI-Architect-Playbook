## How do you implement least privilege?

I give **each service/Worker only the minimum permissions required to perform its job**.

```text
Worker
  ↓
Dedicated IAM Role
  ↓
Only required actions
  ↓
Only required resources
```

### Example in CWD

```text
RAG Worker Role
 ├── S3: GetObject → cwd-documents/raw/*
 ├── OpenSearch: Search → CWD index
 └── Bedrock: InvokeModel → required model
```

It should **not** have:

```text
❌ s3:*
❌ dynamodb:*
❌ iam:*
❌ Access to unrelated buckets
```

### I apply least privilege at multiple levels

1. **Identity** — separate IAM role for each Worker.
2. **Action** — allow only required API actions.
3. **Resource** — restrict to specific bucket, table, index, model, etc.
4. **Network** — private subnets/security groups/VPC endpoints.
5. **Data** — user-level authorization and document ACLs.
6. **Credentials** — temporary IAM role credentials, not access keys.
7. **Review** — CloudTrail/IAM Access Analyzer to identify unnecessary permissions.

### 🎯 Strong interview answer

> **“I implement least privilege by giving every CWD component a dedicated IAM role and allowing only the minimum actions on the specific resources it needs. For example, a RAG Worker may only read a specific S3 prefix, search a specific OpenSearch index, and invoke an approved Bedrock model. I also restrict network access, use temporary credentials, and continuously review permissions using CloudTrail and IAM Access Analyzer.”**

**Memory:**
**Who → What → Where → Network → Review**
