## How would you rotate secrets?

I would use **AWS Secrets Manager rotation** so credentials are changed without hard-coding or manually updating applications.

```text id="6q8x2m"
Secrets Manager
      ↓
Rotation Lambda
      ↓
Create new credential
      ↓
Update target system
      ↓
Test new credential
      ↓
Mark new version as current
```

### Example: Salesforce/API credential

1. Secrets Manager stores the credential.
2. Rotation is triggered on a schedule.
3. Rotation process creates a new credential in the target system.
4. Updates the secret in Secrets Manager.
5. Application retrieves the **current version** at runtime.
6. Validate the new credential.
7. Retire/revoke the old credential.

### Important for ECS/Lambda

Applications should **not permanently cache the secret**.

For long-running ECS Workers, after rotation, refresh/reload the secret so the Worker doesn't continue using the old credential indefinitely.

### 🎯 Strong interview answer

> **“I would use Secrets Manager rotation, typically with a scheduled rotation workflow. The rotation process creates a new credential in the target system, stores the new version in Secrets Manager, validates it, makes it current, and then retires the old credential. Applications retrieve the current secret at runtime, and I ensure long-running services refresh the credential after rotation.”**

**Memory:**
**Create → Update → Validate → Switch → Revoke old**
