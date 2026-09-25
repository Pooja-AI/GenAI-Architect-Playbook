## How would you deploy CWD on AWS?

I would use **containerized services on ECS/Fargate**, with CI/CD through **AWS CodePipeline/CodeBuild or GitHub Actions**.

```text
Developer
   ↓
Git
   ↓
CI/CD
   ↓
Build + Test + Security Scan
   ↓
Docker Image
   ↓
ECR
   ↓
ECS/Fargate
   │
   ├── Coordinator
   ├── Sales Delegator
   ├── IT Delegator
   └── Workers
        ↓
   MCP / Bedrock / RAG
```

### Deployment flow

**1. Build**

* Develop FastAPI + LangGraph services.
* Create Docker images.
* Run unit, integration, security, and LLM evaluation tests.

**2. Push**

* Push versioned images to **Amazon ECR**.

**3. Deploy**

* ECS/Fargate runs Coordinator, Delegators, and Workers.
* Deploy across multiple AZs.
* ALB distributes traffic.
* API Gateway is the external API entry point.

**4. Configuration & security**

* IAM task roles for AWS permissions.
* Secrets Manager for secrets.
* KMS for encryption.
* Private subnets/VPC endpoints for AWS services.

**5. Supporting services**

```text
API Gateway
     ↓
ALB
     ↓
ECS/Fargate
     ↓
Coordinator
     ↓
Delegators
     ↓
Workers
  ↓    ↓    ↓
Bedrock OpenSearch MCP
```

State/data:

* **DynamoDB** → workflow/session state
* **Redis** → cache
* **S3** → documents/artifacts
* **OpenSearch** → RAG retrieval
* **SQS** → asynchronous workloads/DLQ

**6. Production rollout**

Use **blue-green or canary deployment**:

```text
Current Version
      ↓
Deploy New Version
      ↓
Health + Functional + LLM Evaluation
      ↓
Small Traffic %
      ↓
Monitor
      ↓
100% Traffic
```

If errors, latency, or AI-quality metrics degrade → **rollback to the previous version**.

### Interview answer

> “I would containerize the CWD Coordinator, Delegators, and Workers and push the images to ECR. ECS/Fargate would run these services across multiple AZs behind ALB, with API Gateway as the external entry point. DynamoDB stores workflow state, S3 stores documents, OpenSearch handles RAG, Redis provides caching, SQS handles asynchronous workloads, and Bedrock provides the foundation models. IAM, Secrets Manager, KMS and private networking provide security. CI/CD would run automated tests and LLM evaluation before deploying through blue-green or canary rollout, with CloudWatch and tracing for monitoring and rollback.”
