## How would you encrypt S3?

For CWD, I would use **SSE-KMS** for sensitive enterprise documents.

```text
CWD Worker
    ↓ TLS
S3 Bucket
    ↓
SSE-KMS
    ↓
KMS Key
    ↓
Encrypted Object
```

### Implementation

1. **Enable default encryption**

   * Configure the S3 bucket to use SSE-KMS.

2. **Use a KMS key**

   * Customer-managed KMS key when stronger control is required.
   * Control key usage through IAM + KMS key policy.

3. **Enforce encryption**

   * Bucket policy can deny uploads that don't use the required encryption.

4. **Encrypt in transit**

   * Require HTTPS/TLS using a bucket policy.

5. **Protect the bucket**

   * Block Public Access
   * Least-privilege IAM
   * Private VPC endpoint where appropriate
   * Enable CloudTrail auditing

### 🎯 Strong interview answer

> **“For CWD, I would enable S3 default encryption using SSE-KMS for sensitive enterprise documents. I would control KMS key access through IAM and the KMS key policy, enforce encryption and TLS through the bucket policy, and enable S3 Block Public Access and CloudTrail auditing. This gives encryption at rest, encryption in transit, access control, and auditability.”**

**Memory:**
**SSE-KMS → IAM → Bucket Policy → TLS → Block Public Access → Audit**
