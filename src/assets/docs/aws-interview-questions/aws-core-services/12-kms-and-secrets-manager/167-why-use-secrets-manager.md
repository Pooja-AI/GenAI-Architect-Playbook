## Why use Secrets Manager?

Because it provides a **centralized and secure way to store, retrieve, rotate, and audit application secrets**.

### Without Secrets Manager ❌

```text
API Key
 ↓
Code / Docker Image / Config
 ↓
Security Risk
```

### With Secrets Manager ✅

```text
ECS Worker
    ↓
IAM Task Role
    ↓
Secrets Manager
    ↓
Encrypted Secret
```

### Key benefits

1. **No hard-coded secrets** in source code or Docker images.
2. **Encryption at rest** using KMS.
3. **IAM-based access control** — only authorized Workers can retrieve secrets.
4. **Secret rotation** — supports changing credentials without manually updating code.
5. **Centralized management** — one place to manage application secrets.
6. **Auditing** — access can be tracked through CloudTrail.

### 🎯 Strong interview answer

> **“I use Secrets Manager to avoid storing credentials and API keys in application code, Docker images, or configuration files. Secrets are encrypted with KMS, accessed at runtime using least-privilege IAM roles, and can be rotated and audited. This improves both security and operational management.”**

**Memory:**
**Store → Encrypt → Access → Rotate → Audit**
