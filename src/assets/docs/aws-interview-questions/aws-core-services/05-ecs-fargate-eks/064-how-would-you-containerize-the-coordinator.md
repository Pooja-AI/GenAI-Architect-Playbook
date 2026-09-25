# How would you containerize the Coordinator?

## Short answer

I would package the **CWD Coordinator** as a Docker container containing the **FastAPI application, LangGraph orchestration code, configuration, and required Python dependencies**.

Then I would deploy that container as an **ECS/Fargate service** with environment-specific configuration, IAM permissions, health checks, logging, autoscaling, and private networking.

## CWD flow

```text
User
  ↓
API Gateway
  ↓
ALB
  ↓
ECS/Fargate
  ↓
┌──────────────────────────────┐
│      Coordinator Container   │
│                              │
│ FastAPI                      │
│    ↓                         │
│ Coordinator                  │
│    ↓                         │
│ LangGraph                    │
│    ↓                         │
│ Agent Registry / State       │
└──────────────────────────────┘
  ↓
Delegators
  ↓
Workers
```

---

## 1. Create the Coordinator application

For example:

```text
coordinator/
├── app/
│   ├── main.py
│   ├── coordinator.py
│   ├── graph.py
│   ├── state.py
│   ├── routing.py
│   └── config.py
├── requirements.txt
├── Dockerfile
└── .dockerignore
```

`main.py` exposes the FastAPI API.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "healthy"}
```

The Coordinator/LangGraph logic is called from the API layer.

---

## 2. Create the Dockerfile

A simple example:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

The important idea is:

```text
Docker Image
    ↓
Python Runtime
    +
Dependencies
    +
Coordinator Code
    +
LangGraph
    +
FastAPI
```

---

## 3. Build the image

```bash
docker build -t cwd-coordinator:1.0 .
```

Then test locally:

```bash
docker run -p 8000:8000 cwd-coordinator:1.0
```

Test:

```text
GET /health
```

---

## 4. Push the image to ECR

I would use **Amazon ECR** as the container registry.

```text
Developer
   ↓
Docker Build
   ↓
Docker Image
   ↓
Amazon ECR
   ↓
ECS/Fargate
```

I would tag images with an immutable version, for example:

```text
cwd-coordinator:1.4.2
```

rather than relying only on `latest`.

---

## 5. Deploy to ECS/Fargate

Create an ECS task definition containing:

```text
Container
 ├── Image → ECR
 ├── CPU
 ├── Memory
 ├── Port 8000
 ├── Environment variables
 ├── IAM task role
 ├── Log configuration
 └── Health check
```

Example:

```text
ECS Service
     ↓
Fargate Task 1
     ↓
Coordinator Container

Fargate Task 2
     ↓
Coordinator Container
```

Multiple tasks allow horizontal scaling.

---

## 6. Don't put secrets inside the image

For example, I would **not** put this in the Dockerfile:

```text
OPENAI_API_KEY=xxxx
```

Instead:

```text
ECS Task
   ↓
IAM Task Role
   ↓
Secrets Manager / Parameter Store
```

For CWD, configuration could include:

```text
ENVIRONMENT=prod
AWS_REGION=us-east-1
MODEL_ID=...
OPENSEARCH_INDEX=...
MCP_ENDPOINT=...
```

Secrets such as credentials should come from **Secrets Manager**.

---

## 7. Add health checks

The Coordinator should expose something like:

```text
GET /health
```

ECS can use the health check to determine whether the container is healthy.

For example:

```text
ALB
 ↓
Coordinator Task 1 → healthy
Coordinator Task 2 → healthy
Coordinator Task 3 → unhealthy
                         ↓
                   ECS replaces task
```

---

## 8. Add logging and tracing

Every request should carry a correlation ID.

```text
API Gateway
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
MCP
    ↓
Salesforce
```

Example:

```text
correlation_id = RUN123
```

I would send container logs to **CloudWatch** and use distributed tracing/OpenTelemetry where appropriate.

Monitor:

* Request count
* Errors
* P50/P95/P99 latency
* CPU
* Memory
* Container restarts
* Downstream latency
* Bedrock latency
* MCP failures

---

## 9. Scale the Coordinator

If traffic increases:

```text
Low traffic

ECS
 └── Coordinator Task 1


High traffic

ECS
 ├── Coordinator Task 1
 ├── Coordinator Task 2
 ├── Coordinator Task 3
 └── Coordinator Task 4
```

ECS Service Auto Scaling can increase/decrease task count.

But an important point is that **Coordinator state should not live only inside the container**.

Use external stores such as:

```text
DynamoDB → durable workflow/application state
Redis    → cache / short-lived state
```

This allows another Coordinator task to continue processing when necessary.

---

# 🎯 Strong interview answer

> **“I would containerize the CWD Coordinator as a Dockerized FastAPI and LangGraph application. I would create a lightweight Docker image containing the Python runtime, dependencies, and Coordinator code, build and test it, push the versioned image to Amazon ECR, and deploy it as an ECS/Fargate service behind API Gateway and an ALB. Configuration would come from environment variables or Parameter Store, while secrets would come from Secrets Manager using the ECS task IAM role. I would add health checks, CloudWatch logging, correlation IDs, distributed tracing, and ECS autoscaling. I would keep workflow state outside the container so the Coordinator remains stateless and horizontally scalable.”**

## Easy memory trick

**Code → Docker → ECR → Fargate → Health → Scale → Monitor**

```text
Coordinator Code
      ↓
   Docker
      ↓
     ECR
      ↓
  Fargate
      ↓
 Health Check
      ↓
 Auto Scaling
      ↓
 CloudWatch
```

### Key architectural point

**Containerize the Coordinator runtime, but don't containerize its durable state.**

```text
Container
 ├── FastAPI
 ├── LangGraph
 ├── Coordinator logic
 └── Configuration

External
 ├── DynamoDB → state
 ├── Redis → cache
 ├── Secrets Manager → secrets
 └── CloudWatch → logs
```
