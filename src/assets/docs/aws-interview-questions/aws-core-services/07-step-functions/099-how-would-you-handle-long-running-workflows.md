# How would you handle long-running workflows?

For CWD, I would use **AWS Step Functions Standard** for long-running workflows because it provides durable execution, retries, timeouts, waiting, and recovery.

### Example

Suppose a Customer Briefing workflow takes several minutes and requires human approval:

```text id="m5f1wa"
User Request
     ↓
Coordinator
     ↓
Step Functions Standard
     ↓
Customer Worker
     ↓
Sales Worker
     ↓
Human Approval
     ↓
Incident Worker
     ↓
Briefing Worker
     ↓
Completed
```

## 1. Use asynchronous execution

Don't keep the user's HTTP request open for the entire workflow.

Instead:

```text id="q7d3mx"
User
 ↓
API Gateway
 ↓
Start Workflow
 ↓
Return job_id
 ↓
202 Accepted
```

Then the workflow runs independently.

The user can later query:

```text
GET /jobs/{job_id}
```

to get:

```text
QUEUED
RUNNING
COMPLETED
FAILED
```

---

## 2. Persist state

Step Functions maintains workflow execution state.

For application-specific state:

```text id="2n7z4k"
Step Functions
      ↓
DynamoDB
 ├── job status
 ├── Worker results
 ├── correlation ID
 └── business metadata
```

Large outputs/documents can go to **S3** instead of putting large payloads directly into the workflow state.

---

## 3. Use retries and timeouts

```text id="v8f6q2"
Worker
  ↓
Timeout
  ↓
Retry + Backoff
  ↓
Success → Continue
  ↓
Failure → Catch / Recovery
```

This prevents one temporary failure from killing the entire long-running workflow.

---

## 4. Handle waiting periods

If the workflow needs human approval:

```text id="f0w9sa"
Generate Recommendation
        ↓
Wait for Approval
        ↓
Human approves
        ↓
Continue workflow
```

The workflow can pause rather than keeping an ECS container running and consuming resources.

---

## 5. Use SQS for long-running Worker jobs

If a Worker itself performs a lengthy operation:

```text id="p3x5km"
Step Functions
      ↓
     SQS
      ↓
Worker
      ↓
Long-running processing
      ↓
Update job status
      ↓
Continue workflow
```

This gives you buffering, retry, DLQ, and independent Worker scaling.

---

## 6. Don't put everything into Step Functions

For CWD:

```text id="c1z8py"
LangGraph
   ↓
Dynamic agent reasoning
   ↓
Step Functions
   ↓
Durable workflow execution
   ↓
Workers
```

**LangGraph** decides dynamically what the agents should do.

**Step Functions** manages reliable execution of predefined workflow portions.

---

### 🎯 Strong interview answer

> **“For long-running CWD workflows, I use Step Functions Standard with asynchronous execution. The API returns a job ID instead of keeping the HTTP request open. Step Functions maintains durable workflow state, while DynamoDB stores application-specific status and metadata and S3 stores large artifacts. I use retries, timeouts, and Catch for failure recovery, and SQS when Worker processing needs buffering or independent scaling. For human approvals or other long waits, the workflow can pause and resume without keeping an application container running.”**

### Easy memory trick

**Async → Durable → Wait → Retry → Resume → Monitor**

### Key distinction

**Long-running workflow ≠ long-running container.**

The workflow can remain active in **Step Functions** while your ECS Workers run only when actual work needs to be performed.
