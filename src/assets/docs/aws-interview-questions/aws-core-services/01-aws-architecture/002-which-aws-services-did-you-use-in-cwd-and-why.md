For your **CWD interview**, I would answer this as a **service → responsibility → why** mapping. Don't just list AWS services.

### AWS services used in CWD

| AWS Service                      | Where I used it                               | Why I used it                                                           |
| -------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| **Amazon API Gateway**           | API entry point                               | Secure API exposure, throttling, routing, request control               |
| **AWS WAF**                      | In front of APIs                              | Protect APIs from common web attacks                                    |
| **Amazon ECS / EKS**             | Run FastAPI, Coordinator, Delegators, Workers | Containerized, scalable agent services                                  |
| **Amazon Bedrock**               | LLM layer                                     | Foundation-model access without managing model infrastructure           |
| **Amazon OpenSearch Serverless** | RAG/vector search                             | Store embeddings and perform semantic/vector/hybrid retrieval           |
| **Amazon S3**                    | Document/data storage                         | Store enterprise documents, files, artifacts and ingestion data         |
| **AWS Glue**                     | Data ingestion/ETL                            | Clean and transform documents/data before RAG ingestion                 |
| **Amazon DynamoDB**              | Workflow/session state                        | Persist session, task, run, worker status and checkpoints               |
| **ElastiCache for Redis**        | Cache                                         | Fast access to frequently used state/data                               |
| **Amazon SQS**                   | Async processing                              | Decouple services and handle retries/long-running jobs                  |
| **Amazon EventBridge**           | Event-driven communication                    | Publish and route business/domain events                                |
| **AWS Step Functions**           | Durable workflows                             | Manage retries, parallel execution, timeouts and long-running workflows |
| **IAM**                          | Authorization                                 | Least-privilege access to AWS resources                                 |
| **AWS KMS**                      | Encryption                                    | Encrypt data and manage encryption keys                                 |
| **AWS Secrets Manager**          | Secrets                                       | Securely store API keys, credentials and secrets                        |
| **CloudWatch**                   | Monitoring                                    | Logs, metrics, alarms and dashboards                                    |
| **CloudTrail**                   | Auditing                                      | Track AWS API activity and security events                              |
| **ECR**                          | Container registry                            | Store Docker images used by ECS/EKS                                     |
| **CodePipeline / CodeBuild**     | CI/CD                                         | Build, test and deploy application changes                              |
| **SageMaker**                    | Custom ML workloads                           | Use when custom ML models/inference are required                        |

### How they fit together

```text
                         USER
                           |
                           v
                     AWS WAF
                           |
                           v
                    API Gateway
                           |
                           v
                 FastAPI / ECS / EKS
                           |
                           v
                    COORDINATOR
                    (LangGraph)
                           |
              +------------+------------+
              |                         |
              v                         v
       SALES DELEGATOR          IT DELEGATOR
              |                         |
        +-----+-----+             +-----+-----+
        |           |             |           |
        v           v             v           v
     Worker      Worker        Worker      Worker
        |           |             |           |
        +-----------+-------------+-----------+
                            |
                           MCP
                            |
              +-------------+-------------+
              |             |             |
          Salesforce     ServiceNow    SharePoint
```

Supporting services:

```text
             +------------------+
             |   Amazon Bedrock |
             |       LLM        |
             +---------+--------+
                       |
                       v
                  AI reasoning


             +------------------+
             | OpenSearch       |
             | Serverless       |
             | Vector / Hybrid  |
             +------------------+
                       |
                       v
                      RAG


S3 → Glue → Chunking → Embeddings → OpenSearch


DynamoDB
   ↓
Session / Task / Run / Worker State


Redis
   ↓
Cache / Fast State


SQS → Async Jobs → Workers → DLQ


CloudWatch + OpenTelemetry
   ↓
Logs + Metrics + Traces
```

## The important "WHY" behind each major service

### 1. API Gateway — API entry

> "I used API Gateway as the controlled entry point for CWD. It provides API routing, throttling and integration with our security layer."

### 2. ECS/EKS — Agent runtime

> "I ran the FastAPI application and agent components as containerized services. ECS or EKS gives us horizontal scaling and independent deployment of Coordinator, Delegators and Workers."

### 3. Bedrock — LLM

> "I used Amazon Bedrock for foundation-model access. It lets the application consume managed foundation models without us managing the underlying model infrastructure."

### 4. OpenSearch — RAG

> "I used OpenSearch Serverless for vector and hybrid retrieval. Enterprise documents are converted into embeddings and retrieved based on the user's query."

### 5. S3 — Documents

> "S3 is our durable object storage layer for documents, files and processing artifacts."

### 6. Glue — Data preparation

> "Glue is used for data preparation and ETL, especially for batch ingestion pipelines before documents become available to the RAG layer."

### 7. DynamoDB — Workflow state

This one is particularly important for your CWD.

> "I used DynamoDB to persist workflow state such as session ID, task ID, run ID, current node, Worker status, retry information and results. This allows the workflow to resume instead of restarting from the beginning."

For example:

```text
W1 → SUCCESS
W2 → SUCCESS
W3 → FAILED
             ↓
        DynamoDB
             ↓
         Fix W3
             ↓
       Resume W3
             ↓
        Aggregate
```

### 8. SQS — Reliability and decoupling

> "I use SQS when processing doesn't need to be synchronous. It decouples producers and consumers, supports retries and provides DLQs for repeatedly failed messages."

### 9. Step Functions — Durable workflows

> "Step Functions is useful for infrastructure-level workflows requiring durable execution, retries, timeouts and parallel branches. I would use it alongside LangGraph rather than replacing LangGraph's agent reasoning."

### 10. IAM/KMS/Secrets Manager — Security

```text
IAM
 ↓
Who can access what?

KMS
 ↓
How is data encrypted?

Secrets Manager
 ↓
Where are credentials stored?
```

My principle is:

> **Least privilege + encryption + no hardcoded secrets.**

### 11. CloudWatch/OpenTelemetry — Observability

For CWD, I would monitor both traditional application metrics and AI-specific metrics:

```text
Latency
Token usage
LLM cost
Model errors
Worker success rate
MCP success rate
Tool latency
RAG retrieval quality
Agent completion rate
Retry rate
```

For example:

```text
Request
  ↓
Coordinator       300 ms
  ↓
Sales Worker      800 ms
  ↓
MCP               2 sec
  ↓
Bedrock           3 sec
```

Distributed tracing lets me identify exactly where the latency occurred.

---

## ⭐ Best interview answer — 45 seconds

If they ask **"Which AWS services did you use in CWD and why?"**, I would say:

> **"For CWD, I used API Gateway as the secure API entry point and ECS/EKS to run our FastAPI and multi-agent services. The Coordinator, Delegators and Workers were implemented as containerized services, with LangGraph managing stateful agent orchestration.**
>
> **For the AI layer, I used Amazon Bedrock for foundation models and OpenSearch Serverless for vector and hybrid RAG retrieval. S3 stored documents and artifacts, while Glue supported data preparation and ingestion.**
>
> **DynamoDB persisted session, task, run and workflow state so we could resume partially failed workflows. Redis was used for low-latency caching. SQS and DLQs handled asynchronous processing and failures, while Step Functions could manage durable infrastructure workflows.**
>
> **For security, I used IAM, KMS, Secrets Manager and private networking with least-privilege access. For observability, I used CloudWatch, CloudTrail and distributed tracing with OpenTelemetry. ECR stored container images and CodePipeline/CodeBuild supported CI/CD.**
>
> **The key design principle was to use each AWS service for a specific responsibility rather than putting everything into one service."**

### One-line memory trick

**API → Compute → Agents → LLM → RAG → State → Async → Security → Observability**

```text
API Gateway
     ↓
ECS/EKS
     ↓
Coordinator → Delegators → Workers
     ↓
Bedrock + MCP
     ↓
OpenSearch + S3 + Glue
     ↓
DynamoDB + Redis
     ↓
SQS + Step Functions
     ↓
IAM + KMS + Secrets Manager
     ↓
CloudWatch + CloudTrail
```

This is the cleanest way to explain the AWS stack without sounding like you're simply listing AWS services.
