# Step Functions vs Lambda orchestration

The key idea:

> **Lambda executes code. Step Functions orchestrates the workflow.**

### Simple example

```text
Step Functions
      ↓
 ┌────┼─────────┐
 ↓    ↓         ↓
Lambda Lambda  Lambda
  ↓      ↓       ↓
Sales   RAG    ServiceNow
```

Here, **Step Functions decides the order, retries, branching, and dependencies**, while each Lambda performs a specific task.

## Why not use Lambda to orchestrate everything?

You could write one Lambda like:

```text
Lambda
 ↓
call Worker 1
 ↓
call Worker 2
 ↓
call Worker 3
 ↓
handle retries
 ↓
handle errors
 ↓
wait
 ↓
call Worker 4
```

But this creates problems:

* Orchestration logic becomes application code.
* Long waits consume Lambda execution time.
* Retry/error logic becomes harder to maintain.
* Workflow state becomes your responsibility.
* Complex branching and parallelism become difficult.
* Monitoring the complete workflow is harder.

Instead:

```text
Step Functions
 ↓
Worker 1
 ↓
Parallel
 ├── Worker 2
 └── Worker 3
 ↓
Worker 4
```

Step Functions manages the workflow state and execution.

---

## CWD example

For a short operation:

```text
S3 Event
   ↓
Lambda
   ↓
Extract metadata
   ↓
Done
```

**Lambda is enough.**

For a multi-step CWD workflow:

```text
Coordinator
    ↓
Step Functions
    ↓
Customer Worker
    ↓
Parallel
 ┌──┴──────────┐
 ↓             ↓
Sales Worker  Incident Worker
 └──┬──────────┘
    ↓
Briefing Worker
```

**Step Functions is more appropriate for the orchestration layer.**

---

## When I choose Lambda

Use Lambda for:

* Short-lived functions
* Event-driven processing
* Lightweight transformations
* S3/EventBridge/SQS handlers
* Simple API operations
* Stateless business logic

## When I choose Step Functions

Use Step Functions for:

* Multi-step workflows
* Sequential dependencies
* Parallel execution
* Retry/Catch
* Timeouts
* Conditional branching
* Human approval
* Long-running workflows
* Durable workflow state

### 🎯 Strong interview answer

> **“I don't view Step Functions and Lambda as competitors. Lambda is primarily an execution unit, while Step Functions is the orchestration layer. In CWD, I might use Lambda for short, stateless tasks such as document preprocessing, and Step Functions to coordinate multiple Workers, retries, parallel branches, timeouts, and long-running business workflows. This keeps orchestration logic out of Lambda code and gives me durable workflow execution and better operational visibility.”**

### Easy memory trick

**Lambda = Do the work**

**Step Functions = Coordinate the work**
