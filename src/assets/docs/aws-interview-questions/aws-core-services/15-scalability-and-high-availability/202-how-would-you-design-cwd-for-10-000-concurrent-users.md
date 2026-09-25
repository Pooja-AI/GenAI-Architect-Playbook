## CWD for 10,000 concurrent users

The key is **horizontal scaling + asynchronous processing + controlled concurrency**.

```text id="m3x7qa"
             10,000 Users
                  ↓
            API Gateway
                  ↓
                ALB
                  ↓
       ┌──────────┼──────────┐
       ↓          ↓          ↓
  Coordinator  Coordinator  Coordinator
       ↓
   Delegators
       ↓
      SQS
       ↓
   ┌───┼────┐
   ↓   ↓    ↓
 Workers Workers Workers
   ↓
MCP / RAG / Bedrock
   ↓
DynamoDB / Redis / S3
```

### Key design decisions

1. **Multiple ECS/Fargate tasks** for Coordinator, Delegators, and Workers.
2. **Auto Scaling** based on CPU, request rate, P95 latency, and SQS queue depth.
3. **SQS** to absorb traffic spikes and provide backpressure.
4. **DynamoDB** for scalable session/task/run state.
5. **Redis** for caching and reducing repeated LLM/RAG calls.
6. **OpenSearch** scales the RAG retrieval layer.
7. **Bedrock throttling protection** using concurrency limits, queues, retries with exponential backoff, and model routing.
8. **Independent Worker scaling** — Customer Workers may need different capacity from Incident Workers.
9. **Multi-AZ deployment** for availability.
10. **CloudWatch + X-Ray/OpenTelemetry** for P95/P99 latency, errors, queue backlog, and bottleneck detection.

### Important point

**10,000 concurrent users does NOT mean 10,000 LLM calls at the same instant.**

We control downstream concurrency:

```text
10,000 users
     ↓
API accepts requests
     ↓
SQS buffers work
     ↓
Controlled Worker concurrency
     ↓
Bedrock / MCP / RAG
```

This protects Bedrock and enterprise systems such as Salesforce and ServiceNow from sudden overload.

### Interview answer

> “For 10,000 concurrent users, I would design CWD as a horizontally scalable, stateless architecture. I would run multiple Coordinator, Delegator, and Worker tasks across multiple AZs, use API Gateway and ALB for traffic distribution, DynamoDB and Redis for externalized state and caching, and SQS for asynchronous workloads and backpressure. I would autoscale each layer independently and control downstream concurrency so 10,000 users don't translate into 10,000 simultaneous calls to Bedrock or enterprise systems.”

**Memory:**
**10K Users → Horizontal Scale → Queue → Backpressure → Independent Workers → Protect Downstream**
