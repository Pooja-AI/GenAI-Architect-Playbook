## How would Lambda retrieve secrets?

I would give the **Lambda function an execution role** that has permission to read only the required secret from **AWS Secrets Manager**.

```text
Lambda
  ↓
Lambda Execution Role
  ↓
Secrets Manager
  ↓
KMS
  ↓
Secret
```

### Example

```text
CWD Document Lambda
        ↓
CWDDocumentLambdaRole
        ↓
secretsmanager:GetSecretValue
        ↓
CWD/Salesforce/API
```

### Security

* No secret in source code or deployment package.
* IAM role uses **least privilege**.
* Secret encrypted with **KMS**.
* Don't log the secret.
* Enable rotation where applicable.
* CloudTrail can audit secret access.

### 🎯 Strong interview answer

> **“Lambda retrieves secrets from Secrets Manager using its execution IAM role. I grant only `GetSecretValue` access to the specific secret required by that function. The secret is KMS-encrypted, retrieved at runtime, never hard-coded or logged, and access is audited through CloudTrail.”**

**Memory:**
**Lambda → IAM Role → Secrets Manager → KMS → Secret**
