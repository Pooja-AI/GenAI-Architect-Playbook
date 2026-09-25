# How would you encrypt application secrets?

## Short answer
Encrypt application secrets with Secrets Manager backed by KMS, and use envelope encryption for fields.

## Key points
- A customer-managed key per environment.
- Envelope encryption: generate a data key, encrypt the data, store the encrypted data key.
- Access controlled by IAM and key policy.

## CWD context
Separate keys per environment prevent cross-environment access.
## How would you encrypt application secrets?

For CWD, I would use **AWS Secrets Manager**, not store secrets in code, Docker images, or environment files.

```text id="3x8f4m"
Application
    ↓
IAM Task Role
    ↓
Secrets Manager
    ↓
KMS
    ↓
Encrypted Secret
```

### Example secrets

* Database credentials
* API keys
* OAuth client secrets
* Enterprise system credentials
* Third-party service tokens

### Implementation

1. Store secrets in **Secrets Manager**.
2. Encrypt them at rest using **KMS**.
3. Give the ECS Worker only `secretsmanager:GetSecretValue` for the required secret.
4. Retrieve the secret at runtime.
5. Never log the secret.
6. Rotate secrets periodically/automatically where supported.
7. Audit access using CloudTrail.

### 🎯 Strong interview answer

> **“I would store application secrets in AWS Secrets Manager and encrypt them using KMS. ECS Workers would access only the specific secrets they need through their IAM task role. Secrets are retrieved at runtime rather than stored in code or Docker images, and I would enable rotation and CloudTrail auditing.”**

**Memory:**
**Secrets Manager → KMS → IAM → Runtime → Rotate → Audit**
