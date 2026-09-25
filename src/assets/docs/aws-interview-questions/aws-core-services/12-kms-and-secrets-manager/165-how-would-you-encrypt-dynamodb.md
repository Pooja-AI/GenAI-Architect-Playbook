## How would you encrypt DynamoDB?

For CWD, DynamoDB provides **encryption at rest by default**. For stronger key control, I can use a **customer-managed KMS key**.

```text id="9e4x1p"
CWD Worker
    ↓ TLS
DynamoDB
    ↓
KMS Encryption
    ↓
Encrypted data
```

### Implementation

1. **Encryption at rest**

   * DynamoDB automatically encrypts stored data.

2. **KMS**

   * Use AWS-owned/AWS-managed encryption for standard requirements.
   * Use **customer-managed KMS key** when we need more control over key policies and auditing.

3. **Encryption in transit**

   * DynamoDB API communication uses **TLS/HTTPS**.

4. **Access control**

   * Use IAM roles with least privilege.

```text id="2xqv7r"
Worker
  ↓
IAM Task Role
  ↓
DynamoDB
  ↓
KMS
```

5. **Audit**

   * Use CloudTrail for API activity and KMS key usage auditing.

### 🎯 Strong interview answer

> **“DynamoDB encrypts data at rest by default. In CWD, I would use a customer-managed KMS key when stronger key control or compliance requirements exist. Access would be through least-privilege IAM roles, communication would use TLS, and CloudTrail would provide auditing.”**

**Memory:**
**DynamoDB = Default Encryption → KMS Control → IAM → TLS → Audit**
