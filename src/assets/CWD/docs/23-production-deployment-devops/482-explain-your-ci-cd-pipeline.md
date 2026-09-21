## Explain your CI/CD pipeline

For **CWD**, my CI/CD pipeline automates the journey from developer code to a tested and production-ready Agentic AI deployment.

### Overall flow

```text
Developer
   ↓
Git Repository
   ↓
Pull Request
   ↓
Build
   ↓
Unit Tests
   ↓
Code Quality + Security Scan
   ↓
Docker Build
   ↓
Container/Image Scan
   ↓
Push to Azure Container Registry
   ↓
Deploy DEV
   ↓
Integration Tests
   ↓
LLM / RAG / Agent Evaluation
   ↓
Deploy QA / Staging
   ↓
Approval
   ↓
Canary / Blue-Green Production
   ↓
Monitoring
```

### 1. Developer commits code

A developer pushes changes to Git.

For example:

```text
feature/cwd-worker-retry
        ↓
Pull Request
        ↓
Code Review
```

I use branch protection and require review before merging production-bound changes.

---

### 2. Build and unit testing

The pipeline first installs dependencies and runs unit tests.

```bash
pip install -r requirements.txt
pytest tests/unit
```

I test components such as:

```text
Coordinator logic
Delegator routing
Worker logic
MCP tool handling
Validation
Retry logic
API endpoints
```

---

### 3. Code quality and security

Then I run checks such as:

```text
Linting
Type checking
Dependency vulnerability scanning
Secret scanning
SAST
```

The important point is that **credentials should never be committed to Git**.

---

### 4. Build Docker image

Once the application passes validation:

```bash
docker build -t cwd-api:<version> .
```

I use an immutable version/tag rather than relying only on `latest`.

For example:

```text
cwd-api:1.4.2
```

---

### 5. Container security scan

Before deployment, I scan the image for vulnerabilities.

```text
Docker Image
     ↓
Container Security Scan
     ↓
Pass? ── No → Stop pipeline
     ↓
    Yes
```

---

### 6. Push to Azure Container Registry

The approved image is pushed to **Azure Container Registry**.

```text
CI Pipeline
     ↓
Docker Image
     ↓
ACR
```

The deployment environment pulls the exact approved image version.

---

### 7. Deploy to DEV

The pipeline deploys the image to the development environment.

```text
ACR
 ↓
DEV
 ↓
FastAPI
Coordinator
Delegators
Workers
MCP
```

Environment-specific configuration is injected separately.

I don't bake environment-specific secrets into the Docker image.

---

### 8. Integration testing

Now I test the complete CWD flow.

For example:

```text
FastAPI
   ↓
Coordinator
   ↓ A2A
Sales Delegator
   ↓
Customer Worker
   ↓ MCP
Salesforce
```

I also test:

* Authentication
* Authorization
* MCP tools
* Enterprise API integration
* Retry/timeout
* Error handling
* Queue processing
* Checkpoint/resume

---

### 9. GenAI evaluation — very important

For CWD, traditional tests aren't enough.

I run a **golden evaluation dataset** containing normal, edge, ambiguous, failure, and security scenarios.

For example:

```text
Input
  ↓
New Agent Version
  ↓
Expected behavior
  ↓
Evaluate
```

Metrics can include:

```text
Task completion
Agent routing accuracy
Tool-call accuracy
RAG relevance
Groundedness
Hallucination rate
Latency
Token usage
Cost
```

If the new prompt/model/workflow causes unacceptable regression, the pipeline stops.

---

### 10. Deploy to staging/QA

After automated tests and evaluations pass:

```text
DEV
 ↓
QA / Staging
 ↓
Production approval
```

In staging I perform broader integration, performance, security, and end-to-end tests.

---

### 11. Production deployment

For production, I prefer a controlled rollout such as:

```text
New Version
    ↓
Canary
    ↓
Small percentage of traffic
    ↓
Monitor
    ↓
Healthy?
   / \
 No   Yes
 ↓     ↓
Rollback  Gradual rollout
```

This is particularly useful for Agentic AI because a deployment can be technically healthy while the **agent behavior has degraded**.

---

### 12. Monitor and rollback

After deployment I monitor:

```text
API errors
P95/P99 latency
Worker failures
A2A failures
MCP failures
LLM timeouts/429s
RAG failures
Token usage
Cost
Task completion
Groundedness
```

If the new version has problems:

```text
Production
    ↓
Detect regression
    ↓
Rollback to previous image/version
```

Because images and Agent configurations are versioned, rollback is controlled.

---

## Example pipeline

```yaml id="j6j3gq"
stages:
  - build
  - test
  - security
  - docker
  - deploy-dev
  - integration
  - genai-evaluation
  - deploy-staging
  - approval
  - deploy-production
```

The exact CI/CD platform can vary; the important part is the **gates and promotion strategy**.

---

## What makes a GenAI CI/CD pipeline different?

Traditional CI/CD asks:

> **“Does the software work?”**

For CWD, I also ask:

> **“Does the Agent still behave correctly?”**

So I include:

```text
Code Tests
     +
Security Tests
     +
Integration Tests
     +
LLM Evaluation
     +
RAG Evaluation
     +
Agent Trajectory/Tool Evaluation
```

This is an important point to emphasize in an **AI Architect interview**.

## Interview-ready answer

> **“My CWD CI/CD pipeline starts with a Git pull request and code review, followed by unit tests, linting, type checking, dependency and security scanning. I then build an immutable Docker image, scan it, and push it to Azure Container Registry. The image is deployed progressively through Dev, QA and staging environments. For CWD, I add GenAI-specific evaluation gates using a golden dataset to validate agent routing, tool-call accuracy, RAG relevance, groundedness, task completion, latency and cost. After the automated gates pass, production is deployed using a controlled canary or blue-green strategy. I continuously monitor the new version and can roll back to the previous immutable version if application or Agent behavior regresses.”**

### Easy memory

**PR → Test → Scan → Docker → ACR → DEV → Integration → GenAI Eval → QA → Approval → Canary → Monitor → Rollback**

### Strong interview line

> **“For Agentic AI, CI/CD is not just code deployment; it is behavior validation plus controlled deployment.”**
