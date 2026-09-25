## Where would you use AWS KMS?

I use **AWS KMS to manage encryption keys** and protect sensitive CWD data.

```text
CWD
 ↓
KMS Key
 ↓
Encrypt / Decrypt
```

### In CWD, I would use KMS for:

1. **S3**

   * Encrypt enterprise documents using **SSE-KMS**.
   * Example: customer documents, reports, PDFs.

2. **Secrets Manager**

   * Protect application secrets and credentials with KMS encryption.

3. **DynamoDB**

   * Encrypt sensitive application state using a customer-managed KMS key when required.

4. **CloudWatch Logs**

   * Encrypt sensitive logs where required.

5. **SQS**

   * Encrypt queued messages, especially if they contain sensitive customer/workflow data.

6. **Other AWS services**

   * Use KMS where the service supports KMS encryption and the security requirements call for customer-controlled keys.

### Example

```text
RAG Worker
    ↓
S3
    ↓
SSE-KMS
    ↓
CWD KMS Key
```

The Worker needs appropriate **KMS permissions** such as `kms:Decrypt` to read encrypted data.

### 🎯 Strong interview answer

> **“In CWD, I would use AWS KMS as the centralized key-management layer for encrypting sensitive data. For example, S3 documents can use SSE-KMS, and KMS can also protect secrets and other supported AWS resources. I would control key usage through IAM and KMS key policies and audit key activity through CloudTrail.”**

**Memory:**
**KMS = Key Management + Encryption + Access Control + Audit**
