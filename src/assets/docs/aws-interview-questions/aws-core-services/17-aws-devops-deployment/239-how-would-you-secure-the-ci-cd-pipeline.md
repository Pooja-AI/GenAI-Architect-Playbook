For an interview, keep it simple:

> **“I secure the CI/CD pipeline using least-privilege IAM roles, Secrets Manager or Parameter Store for secrets, encryption with KMS, and protected Git branches. I also enable code scanning, dependency and container-image scanning, and require approval before production deployment. CloudTrail and pipeline logs provide auditability.”**

### Simple flow

```text
Developer
   ↓
Git Repository
   ↓
Code Scan / Security Scan
   ↓
Build + Test
   ↓
Container/Image Scan
   ↓
Approval Gate
   ↓
Deploy to AWS
   ↓
CloudTrail + CloudWatch
```

**Key point:** No hardcoded credentials + least privilege + security scanning + production approval + audit logging.
