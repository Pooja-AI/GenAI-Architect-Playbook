## How would you manage Dev / Test / Prod?

I would keep environments **isolated**, but use the **same deployment process and infrastructure pattern**.

```text
Developer
   ↓
   Git
   ↓
 DEV
   ↓
 Tests
   ↓
 TEST / STAGING
   ↓
 Approval
   ↓
 PROD
```

### Environment separation

| Environment      | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| **Dev**          | Development and quick testing                         |
| **Test/Staging** | Integration, performance, security and LLM evaluation |
| **Prod**         | Real users and production workloads                   |

### For CWD

Each environment gets separate:

* ECS/Fargate services
* DynamoDB tables
* S3 buckets
* OpenSearch indexes
* Redis
* SQS queues
* Secrets
* IAM roles
* Bedrock configuration where needed

```text
DEV
cwd-dev-* 

TEST
cwd-test-*

PROD
cwd-prod-*
```

### Important practices

1. **Infrastructure as Code** → Terraform/CloudFormation/CDK.
2. **Same Docker image** → promote the tested image from Test → Prod rather than rebuilding.
3. **Environment-specific configuration** → use Parameter Store/Secrets Manager.
4. **Separate AWS accounts** → ideally Dev, Test, and Prod accounts for stronger isolation.
5. **CI/CD promotion** → Dev → Test → Prod.
6. **Production approval** → require approval before Prod deployment.
7. **No production data in Dev/Test** → use synthetic or properly sanitized data.

### Interview answer

> “I manage Dev, Test, and Prod as isolated environments, ideally using separate AWS accounts. Each environment has its own compute, data stores, queues, secrets, and IAM roles. I use Infrastructure as Code to keep the environments consistent and CI/CD to promote the same tested container image from Dev to Test and then Production. Production requires stronger approval, monitoring, and access controls.”

**Memory:**
**Isolate → Same Architecture → Same Image → Test → Approve → Promote**
