## Infrastructure as Code for CWD

I would use **Terraform** to define and manage the AWS infrastructure instead of creating resources manually.

```text id="r2c8hf"
Git
 ↓
Terraform Code
 ↓
Plan
 ↓
Review / Approval
 ↓
terraform apply
 ↓
AWS Infrastructure
```

### What I would define

```text id="3n8yqk"
Terraform
 ├── VPC / Subnets / Security Groups
 ├── API Gateway / ALB
 ├── ECS / Fargate
 ├── ECR
 ├── Lambda
 ├── SQS / DLQ
 ├── DynamoDB
 ├── S3
 ├── OpenSearch
 ├── IAM
 ├── KMS / Secrets Manager
 └── CloudWatch
```

### Environment structure

```text id="c4v7pn"
Terraform Modules
       ↓
 ┌─────┼─────┐
Dev   Test   Prod
```

Use reusable modules and environment-specific variables.

### CI/CD

```text id="8d4x2m"
Git Push
   ↓
Terraform Validate
   ↓
Terraform Plan
   ↓
Security / Policy Check
   ↓
Approval
   ↓
Terraform Apply
```

For production, I would require **plan review and approval** before `apply`.

### Important practices

* Store Terraform state in a **remote backend**, commonly S3 with appropriate locking/state-management controls.
* Use modules for reusable components.
* Keep secrets out of Terraform code.
* Use IAM least privilege.
* Version-control all infrastructure changes.
* Run `plan` before `apply`.
* Detect and prevent configuration drift.

### Interview answer

> “I would implement CWD infrastructure using Terraform. I would define the VPC, ECS, API Gateway, ALB, ECR, SQS, DynamoDB, S3, OpenSearch, IAM, KMS, and monitoring as code. I would create reusable modules and separate Dev, Test, and Prod configurations. Terraform changes would go through Git, validation, plan, security checks, approval, and apply through CI/CD, giving us repeatable and auditable infrastructure.”
