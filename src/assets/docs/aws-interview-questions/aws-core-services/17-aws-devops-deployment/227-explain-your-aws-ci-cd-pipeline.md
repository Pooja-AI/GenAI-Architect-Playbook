## AWS CI/CD pipeline for CWD

I would use **GitHub → CodeBuild → ECR → ECS**, with automated quality gates before production.

```text
Developer
   ↓
GitHub
   ↓
CodePipeline
   ↓
CodeBuild
   ├── Unit Tests
   ├── Integration Tests
   ├── Security Scan
   └── LLM Evaluation
   ↓
Build Docker Image
   ↓
ECR
   ↓
Deploy to Dev
   ↓
QA / Evaluation
   ↓
Deploy to Staging
   ↓
Approval
   ↓
Blue-Green / Canary
   ↓
ECS Production
   ↓
CloudWatch
```

### Step-by-step

**1. Developer pushes code**

* GitHub triggers the pipeline.

**2. Build & test**

* CodeBuild installs dependencies.
* Run unit/integration tests.
* Run linting and security/dependency scans.

**3. AI quality gates**
For CWD, also evaluate:

* RAG relevance/groundedness
* hallucination rate
* tool-call accuracy
* agent workflow success
* latency/token usage

**4. Build & push**

* Build Docker image.
* Tag with commit/version.
* Push to **ECR**.

**5. Deploy Dev → Staging**

* Update ECS task definition with the new image.
* Deploy automatically.
* Run smoke/integration tests.

**6. Production deployment**
Use **blue-green or canary deployment**.

```text
Blue = Current
Green = New
       ↓
  Small traffic
       ↓
Monitor
       ↓
Healthy → 100%
Unhealthy → Rollback
```

**7. Monitoring**
CloudWatch + X-Ray/OpenTelemetry + Langfuse monitor:

* errors
* P95/P99 latency
* CPU/memory
* Bedrock throttling
* token/cost
* agent/tool failures
* LLM quality

### Interview answer

> “My CWD CI/CD pipeline starts with a GitHub commit and triggers CodePipeline. CodeBuild runs unit, integration, security, and AI-quality tests. If the quality gates pass, we build and version the Docker image and push it to ECR. We deploy progressively through Dev and Staging, then use blue-green or canary deployment to ECS/Fargate in production. CloudWatch and distributed tracing monitor the deployment, and if technical or AI-quality metrics degrade, we automatically roll back to the previous version.”

**Memory:**
**Commit → Test → AI Evaluate → Build → ECR → Dev → Staging → Canary → Monitor → Rollback**
