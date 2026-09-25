## How would Lambda access S3 securely?

I would use a **Lambda execution role with least-privilege S3 permissions**—not hard-coded access keys.

```text
S3
 ↑
 │
Lambda
 ↓
Lambda Execution Role
 ↓
IAM Policy
 ↓
Specific S3 Bucket / Prefix
```

### 1. Create Lambda execution role

Example:

```text
Lambda
  ↓
CWDDocumentProcessorRole
```

The role might allow only:

```text
s3:GetObject
arn:aws:s3:::cwd-documents/raw/*
```

If Lambda needs to write processed files:

```text
s3:PutObject
arn:aws:s3:::cwd-documents/processed/*
```

Avoid:

```text
s3:*
Resource: *
```

---

### 2. S3 bucket policy

I would also use the S3 bucket policy as an additional security layer.

```text
Lambda Role
     ↓
IAM Policy
     ↓
S3 Bucket Policy
     ↓
S3 Object
```

The bucket policy can restrict access to the specific Lambda role and enforce security requirements such as TLS.

---

### 3. Encrypt the data

Use:

```text
S3
 ↓
SSE-KMS
 ↓
KMS Key
```

The Lambda role needs the required KMS permissions to read/write encrypted objects.

---

### 4. Private networking

If the Lambda runs inside a VPC and the architecture requires private AWS connectivity, I can use an **S3 VPC Gateway Endpoint** so traffic to S3 doesn't need to traverse the public internet.

---

### 5. Audit access

Use **CloudTrail** to audit S3 API activity:

```text
Lambda
 ↓
S3 GetObject
 ↓
CloudTrail
 ↓
Audit
```

### 🎯 Strong interview answer

> **“I would give the Lambda function a dedicated execution role with least-privilege S3 permissions instead of using access keys. For example, the role could have GetObject only on the CWD raw-document prefix and PutObject only on the processed prefix. I would also use an S3 bucket policy as a second authorization layer, encrypt sensitive data with SSE-KMS, use an S3 VPC endpoint where private connectivity is required, and audit access through CloudTrail.”**

**Memory trick:**
**Role → Least Privilege → Bucket Policy → KMS → Private Access → Audit**
