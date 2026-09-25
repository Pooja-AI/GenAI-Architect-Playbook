## How do you prevent privilege escalation?

I prevent a service or user from **gaining permissions beyond what they were originally granted**.

### In CWD, I use:

1. **Least-privilege IAM roles**

   * Each Worker gets only required permissions.
   * Don't give Workers `iam:*`.

2. **Restrict IAM management permissions**

   * Application roles should not be able to create/modify IAM roles or policies.
   * Separate deployment/admin roles from runtime roles.

3. **Permission boundaries / SCPs**

   * Permission boundaries limit the maximum permissions a role can receive.
   * AWS Organizations SCPs can enforce organization-wide restrictions.

4. **No privilege-changing APIs**

   * Prevent application roles from actions such as:

   ```text
   iam:CreateRole
   iam:AttachRolePolicy
   iam:PutRolePolicy
   iam:PassRole
   ```

   unless explicitly required.

5. **Separate runtime and deployment identities**

```text
Developer/CI-CD
      ↓
Deployment Role
      ↓
ECS Task Role
      ↓
Worker
```

The Worker should **not** be able to modify its own IAM permissions.

6. **Audit and detection**

   * CloudTrail for IAM activity
   * IAM Access Analyzer
   * Alerts for unusual role/policy changes

### 🎯 Strong interview answer

> **“I prevent privilege escalation through least-privilege roles, strict separation between runtime and deployment identities, permission boundaries and SCPs where appropriate, and by explicitly restricting IAM management and PassRole permissions. I also monitor IAM changes through CloudTrail and IAM Access Analyzer.”**

**Memory:**
**Least Privilege → Separate Roles → Boundaries → Restrict IAM → Audit**
