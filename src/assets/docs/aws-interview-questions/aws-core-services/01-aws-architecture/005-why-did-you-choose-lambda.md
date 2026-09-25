# Why did you choose Lambda?

## Short answer

AWS Lambda is a serverless compute service that we use for **short-running, event-driven, lightweight CWD tasks** without managing servers.

## Key points

* Serverless — no server management.
* Automatically scales based on incoming requests/events.
* Good for short-lived functions.
* Pay based on execution/usage.
* Integrates with API Gateway, S3, EventBridge, SQS, Step Functions, etc.
* Useful for preprocessing, validation, lightweight tool functions and event processing.
* Supports retries and asynchronous processing through AWS event services.
* Not ideal for long-running or highly stateful workloads.

### CWD flow

```text
User / Application
       ↓
   API Gateway
       ↓
     CWD API
       ↓
   Coordinator
       ↓
    Delegator
       ↓
     Worker
       ↓
 ┌───────────────┐
 │ Lambda        │
 │               │
 │ Validation    │
 │ Preprocessing │
 │ Tool Function │
 │ Event Handler │
 └───────────────┘
       ↓
Enterprise Systems
```

## Why Lambda?

**1. Serverless execution**

We don't need to provision or maintain servers for lightweight functions.

```text
Request
   ↓
Lambda
   ↓
Execute function
   ↓
Return result
```

**2. Automatic scaling**

If multiple requests arrive, Lambda can create additional execution environments according to configured limits.

```text
10 requests
     ↓
Lambda
     ↓
Multiple executions
```

We still configure concurrency limits to protect downstream systems.

**3. Good for event-driven workloads**

For example:

```text
S3 document uploaded
        ↓
      Lambda
        ↓
Extract / preprocess
        ↓
S3 / OpenSearch
```

Or:

```text
Queue message
      ↓
Lambda
      ↓
Process event
```

**4. Cost efficiency**

For intermittent workloads, serverless execution can avoid paying for continuously running compute capacity.

**5. AWS integration**

Lambda integrates naturally with:

* API Gateway
* S3
* SQS
* EventBridge
* Step Functions
* DynamoDB
* CloudWatch

## Example

Suppose a document is uploaded to S3:

```text
User uploads document
        ↓
       S3
        ↓
     Lambda
        ↓
Extract / preprocess
        ↓
Chunk / metadata processing
        ↓
OpenSearch / downstream pipeline
```

Another example is a lightweight CWD tool:

```text
Worker
   ↓
MCP Server
   ↓
Lambda
   ↓
Enterprise API
   ↓
Result
```

Lambda can implement a small, stateless function behind the MCP integration when that pattern fits the workload.

---

## When I would NOT use Lambda

This is an important interview point.

I wouldn't automatically put the entire CWD application into Lambda.

For example, **long-running, stateful, complex orchestration or workloads requiring persistent processes** may be better suited to ECS/EKS or another compute platform.

```text
Short + event-driven
        ↓
     Lambda

Long-running / persistent
        ↓
    ECS / EKS
```

The exact choice depends on execution duration, state, concurrency, networking, startup requirements, and operational needs.

---

## 🎯 Strong interview answer

> **“We chose Lambda for short-running, stateless, event-driven components of CWD where we didn't need to manage servers. It provides automatic scaling, pay-per-use execution, and integrates well with services such as API Gateway, S3, SQS, EventBridge, Step Functions, and CloudWatch. For example, we can use Lambda for request validation, lightweight preprocessing, event processing, or implementing a small tool function behind an MCP integration. We would not use Lambda for every component; long-running or persistent workloads would be better suited to ECS or EKS.”**

## Easy memory trick

**Serverless → Event-driven → Short-lived → Auto-scale → Pay-per-use**

## Key distinction

> **“Lambda is for lightweight serverless compute; it does not replace LangGraph for orchestration or Bedrock for LLM capabilities.”**
