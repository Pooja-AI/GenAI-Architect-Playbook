## IAM User vs IAM Role

The simplest difference:

> **IAM User = a specific AWS identity, usually for a person or long-term credential use.**
> **IAM Role = a temporary identity that a user or AWS service assumes.**

|                     | IAM User                                | IAM Role                               |
| ------------------- | --------------------------------------- | -------------------------------------- |
| Represents          | Person/application identity             | Permission identity                    |
| Credentials         | Can have long-term credentials          | Temporary credentials                  |
| Best for            | Specific human identities, legacy cases | AWS services/workloads                 |
| ECS/Fargate         | ❌ Not preferred                         | ✅                                      |
| Credential rotation | You manage it                           | AWS STS provides temporary credentials |
| CWD usage           | Minimal                                 | **Primary approach**                   |

### In CWD

I would **not create an IAM user for every Coordinator/Worker**.

Instead:

```text
ECS/Fargate
    ↓
Assume IAM Role
    ↓
Temporary Credentials
    ↓
S3 / Bedrock / DynamoDB / OpenSearch
```

Example:

```text
Coordinator Task
      ↓
CoordinatorTaskRole
      ↓
DynamoDB + Bedrock

RAG Worker Task
      ↓
RAGWorkerTaskRole
      ↓
S3 + OpenSearch
```

Each role gets only the permissions it needs.

### Why roles are preferred

If you put AWS access keys inside the Coordinator:

```text
❌ AWS Access Key
❌ Secret Access Key
❌ Store in application
```

there is a credential-management risk.

With a role:

```text
ECS Task
   ↓
IAM Role
   ↓
Temporary credentials
   ↓
AWS API
```

AWS manages the temporary credentials through the task's role.

### 🎯 Strong interview answer

> **“An IAM user represents a specific identity and can have long-term credentials, while an IAM role provides temporary credentials that a user or AWS service can assume. For CWD, I would prefer IAM roles rather than IAM users for workloads. For example, the Coordinator gets a dedicated ECS task role with only the permissions it needs for DynamoDB and Bedrock, while the RAG Worker gets a separate role for S3 and OpenSearch. This follows least privilege and avoids embedding long-term AWS credentials in the application.”**

**Memory trick:**
**User = Identity**
**Role = Temporary permissions for a workload**
