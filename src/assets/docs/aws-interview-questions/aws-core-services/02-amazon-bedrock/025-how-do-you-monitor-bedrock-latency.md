# How do you monitor Bedrock latency?

## Short answer

I monitor the **latency of every Bedrock invocation** and track **P50, P95, and P99**. I use **CloudWatch** for metrics and alarms, and **distributed tracing** to identify whether the delay is from Bedrock, RAG, MCP, or another CWD component.

## Key points

### 1. Measure each Bedrock call

```text
Start time
    ↓
Bedrock API call
    ↓
Response
    ↓
End time
```

```text
Latency = End time - Start time
```

Example:

```text
Model call = 2.4 seconds
```

### 2. Monitor P50, P95, P99

```text
P50 → normal/typical latency
P95 → slower requests
P99 → tail/worst-case latency
```

Example:

```text
P50 = 1.5 sec
P95 = 3.8 sec
P99 = 6.5 sec
```

For production, **P95/P99 are important** because a good average can hide slow requests.

### 3. Correlate with CWD

I attach a `correlation_id`, `run_id`, and `Worker` to every model call.

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Bedrock
```

Example:

```text
CustomerBriefingWorker
    Model: Claude
    Input tokens: 4,000
    Latency: 3.2 sec
    Status: Success
```

### 4. Find the actual bottleneck

Suppose the complete request takes 8 seconds:

```text
Coordinator       0.5 sec
RAG               1.0 sec
MCP/ServiceNow    1.5 sec
Bedrock           4.2 sec
Other              0.8 sec
                  ───────
Total              8.0 sec
```

Now I know Bedrock is contributing most of the latency.

If Bedrock is only 1 second, I investigate **RAG, MCP, network, or orchestration** instead.

### 5. Check factors that increase latency

I correlate latency with:

* Input/output tokens
* Model
* Concurrent requests
* 429/throttling
* Retries
* Prompt/context size
* Number of parallel Workers

For example:

```text
Large context
     ↓
More tokens
     ↓
Higher latency
```

### 6. If latency increases

I follow:

**Detect → Trace → Identify → Optimize → Monitor**

Possible optimizations:

* Reduce unnecessary context
* Reduce RAG Top-K
* Summarize conversation history
* Reduce unnecessary LLM calls
* Use an appropriate faster model for simple tasks
* Control Worker concurrency
* Avoid excessive retries
* Cache repeated results where appropriate

# 🎯 Strong interview answer

> **“I monitor Bedrock latency for every model invocation and track P50, P95, and P99. I use CloudWatch for metrics, dashboards and alarms, and distributed tracing with correlation IDs to trace the call back to the CWD Worker and workflow. I also correlate latency with token count, model, concurrency, throttling and retries. If P95 latency increases, I use the trace to determine whether the bottleneck is Bedrock, RAG, MCP, or orchestration, and then optimize context size, model routing, concurrency, or unnecessary LLM calls.”**

## Easy memory trick

**Measure → Percentile → Trace → Find → Optimize**

> **“Measure the latency, trace the bottleneck, then optimize.”**
