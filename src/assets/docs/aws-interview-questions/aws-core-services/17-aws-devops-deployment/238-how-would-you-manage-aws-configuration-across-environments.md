For an interview, keep it simple:

> **“I manage AWS configuration separately for each environment—Dev, QA, and Prod—using Infrastructure as Code such as Terraform or CloudFormation. Environment-specific values are stored in AWS Systems Manager Parameter Store or Secrets Manager, while sensitive values are never hardcoded. CI/CD pipelines deploy the same infrastructure code with different environment parameters. I also use IAM roles, tagging, and CloudTrail to control and audit changes.”**

### Simple flow

```text
Terraform / CloudFormation
          ↓
   Environment Config
   ┌──────┼──────┐
  DEV     QA    PROD
   ↓       ↓      ↓
Parameter Store / Secrets Manager
          ↓
      AWS Services
```

**Key point:** Same infrastructure code, different environment-specific configuration.
