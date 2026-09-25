# How would you handle a sudden 100× traffic spike?

For CWD, I would use **buffering + throttling + autoscaling + downstream protection** rather than simply adding 100× more containers.

### Architecture

```text
                 100× Traffic
                      ↓
                API Gateway
                      ↓
             Rate Limit / Throttle
                      ↓
               CWD Coordinator
                      ↓
               ┌──────┴──────┐
               ↓             ↓
             SQS           SQS
               ↓             ↓
          Worker Pool   Worker Pool
               ↓             ↓
          MCP / APIs / Bedrock
               ↓
       Salesforce / ServiceNow
```

### 1. Absorb the spike

Use **SQS** as a buffer.

```text
100× requests
     ↓
   SQS
     ↓
Workers process at sustainable rate
```

This prevents the spike from immediately reaching Salesforce, ServiceNow, or Bedrock.

### 2. Protect the API

Use **API Gateway throttling/rate limits**.

If the system can safely handle 5,000 requests/sec, don't allow unlimited traffic through just because 500,000 requests/sec arrive.

For non-critical requests, I can return:

```text
202 Accepted
job_id = CWD-12345
```

and process asynchronously.

### 3. Scale Workers

Monitor:

* SQS queue depth
* Oldest message age
* ECS CPU/memory
* Worker processing latency
* Request rate

Then scale ECS/Fargate Workers.

```text
Queue depth ↑
      ↓
CloudWatch
      ↓
ECS Auto Scaling
      ↓
More Worker tasks
```

But scaling must respect downstream limits.

### 4. Protect downstream systems

Suppose Salesforce supports only a certain concurrency level.

Don't do:

```text
100× traffic
    ↓
100× Workers
    ↓
Salesforce overload
```

Instead:

```text
100× traffic
     ↓
SQS
     ↓
Controlled Worker concurrency
     ↓
Salesforce
```

Use **rate limits, concurrency limits, connection pools, circuit breakers and backoff**.

### 5. Protect Bedrock

A 100× spike can also cause model throttling.

I would use:

* concurrency limits
* SQS buffering
* exponential backoff + jitter
* model routing
* token limits
* semantic caching where appropriate
* approved fallback models where appropriate

### 6. Prioritize critical requests

If necessary:

```text
             SQS
              ↓
       ┌──────┴──────┐
       ↓             ↓
   High Priority   Low Priority
       ↓             ↓
   Process first   Process later
```

For example, critical IT incidents can receive higher priority than batch document processing.

### 7. Monitor the system

During the spike, watch:

```text
Traffic
Queue depth
Oldest message age
P50/P95/P99 latency
ECS task count
CPU / Memory
429 rate
5xx rate
Bedrock latency
MCP latency
Salesforce/ServiceNow latency
DLQ depth
```

The key is to watch **queue age**, not just queue depth.

---

## 🎯 Strong interview answer

> **“For a sudden 100× traffic spike, I would not simply scale everything by 100×. First, I would use API Gateway throttling and SQS to absorb and control the spike. Then I would autoscale ECS Workers based on queue depth, queue age, and resource utilization. I would apply concurrency and rate limits to protect downstream systems such as Salesforce, ServiceNow, and Bedrock, with retries, exponential backoff, circuit breakers, and DLQs. For critical workloads I would prioritize processing, while non-critical workloads can remain asynchronous. Throughout the event, I would monitor P95/P99 latency, queue age, 429s, errors, downstream latency, and DLQ depth.”**

### Easy memory trick

**100× spike → Protect → Buffer → Scale → Throttle → Prioritize → Monitor**

### Key distinction

**Autoscaling handles increased capacity.
SQS handles increased workload.
Backpressure protects downstream systems.**
