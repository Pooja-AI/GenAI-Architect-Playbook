# How do you monitor Bedrock usage?

## Short answer

I monitor Bedrock usage at **request, Worker, model, and CWD workflow levels**.

I capture:

**Requests + tokens + latency + errors + throttling + cost + model usage**

Then I send the metrics/logs to **CloudWatch** and use application tracing/observability to correlate them with the CWD workflow.

---

## Key points

### 1. Track every Bedrock call

For each call, capture:

```text
request_id
correlation_id
session_id
run_id
Worker
model
input tokens
output tokens
total tokens
latency
status
error
retry count
```

Example:

```text id="6p4gqa"
Run: RUN123
Worker: CustomerBriefingWorker
Model: Claude Sonnet
Input tokens: 4,200
Output tokens: 800
Latency: 2.8 sec
Status: Success
```

---

## 2. Monitor token usage

I track:

```text id="nq7l0m"
Input tokens
Output tokens
Total tokens
Tokens/request
Tokens/Worker
Tokens/workflow
Tokens/minute
```

This helps identify expensive or inefficient Workers.

For example:

```text id="1t4jvn"
Customer Worker     → 2K tokens
ServiceNow Worker   → 3K tokens
RAG Worker          → 5K tokens
Final Synthesis     → 8K tokens  ← investigate
```

---

## 3. Monitor latency

I monitor:

* P50
* P95
* P99
* Average latency
* Time to first response where applicable

Example:

```text id="t5r9xx"
Bedrock P50 → 1.5 sec
Bedrock P95 → 4 sec
Bedrock P99 → 8 sec
```

P95/P99 are especially useful because average latency can hide slow requests.

---

## 4. Monitor throttling

I track:

```text id="3q8yhw"
429 / throttling errors
Requests per minute
Token consumption
Concurrency
Retry count
```

If throttling increases:

```text id="y7f3pu"
Throttling ↑
     ↓
Check concurrency
     ↓
Check token usage
     ↓
Check request volume
     ↓
Adjust limits / routing / capacity
```

---

## 5. Monitor model distribution

Because CWD can use model routing, I want to know which models are being used.

```text id="2w8l0n"
Model A → 60%
Model B → 30%
Model C → 10%
```

This helps answer:

> Are we unnecessarily using the expensive model?

---

## 6. Monitor cost

I calculate/track:

```text id="t2o4hz"
Cost/request
Cost/Worker
Cost/run
Cost/successful task
Daily cost
Monthly cost
```

Conceptually:

```text
Cost =
Input tokens × input price
+
Output tokens × output price
```

Actual pricing depends on the selected Bedrock model and pricing structure.

---

# 7. Correlate Bedrock with CWD

This is very important for an **agentic architecture**.

I don't want a dashboard that only says:

> Bedrock used 1 million tokens.

I want to know:

> Which CWD workflow and Worker consumed those tokens?

So I propagate:

```text id="w5j6ks"
Correlation ID
      ↓
API Gateway
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

```text id="f0i9ac"
RUN123
 ├── Intent Worker       → 500 tokens
 ├── Sales Worker        → 2K tokens
 ├── Service Worker      → 3K tokens
 └── Final Synthesis     → 6K tokens
```

Now I can identify the expensive step.

---

# 8. CloudWatch monitoring

For AWS CWD, I would use **Amazon CloudWatch** for operational monitoring.

Typical dashboard:

```text id="k0xq8m"
CWD Bedrock Dashboard
────────────────────────────
Requests/min       1,200
Success rate       99.2%
429 rate             0.4%
P95 latency         3.8 sec
Input tokens       2.4M
Output tokens      0.5M
Retries              120
Estimated cost       $XX
```

I can configure alarms for thresholds such as:

```text
429 rate > threshold
P95 latency > SLA
Token usage > budget
Error rate > threshold
Daily cost > budget
```

---

# 9. Distributed tracing

For deeper troubleshooting, I use **OpenTelemetry/X-Ray and application tracing**, and tools such as **Langfuse** where appropriate.

Example:

```text id="7j0jfi"
Request
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Sales Worker
 ↓
MCP → Salesforce
 ↓
Bedrock
```

The trace shows where the time and model usage occurred.

---

# 10. Quality + usage together

I don't monitor cost in isolation.

For example:

```text id="8e3pnd"
Model A
Cost      ↓
Latency   ↓
Quality   91%

Model B
Cost      ↑
Latency   ↑
Quality   94%
```

The architecture decision should consider the required quality and SLA, not just whichever model is cheapest.

---

# CWD monitoring architecture

```text id="0w7z1x"
                 CWD
                  ↓
             Bedrock Calls
                  ↓
        ┌────────────────────┐
        │ Usage Metadata     │
        │                    │
        │ Tokens             │
        │ Latency            │
        │ Model              │
        │ Errors             │
        │ Retries            │
        │ Correlation ID     │
        └─────────┬──────────┘
                  ↓
       CloudWatch / Tracing
                  ↓
             Dashboards
                  ↓
              Alarms
                  ↓
       Optimize / Troubleshoot
```

---

# 🎯 Strong interview answer

> **“I monitor Bedrock at multiple levels: request, model, Worker and complete CWD workflow. For every call, I capture the model, input and output tokens, latency, status, errors, retries and correlation ID. I use CloudWatch for operational metrics, dashboards and alarms, and distributed tracing such as OpenTelemetry/X-Ray or Langfuse to correlate model calls back to the Coordinator, Delegator and Worker. I also monitor throttling, P95/P99 latency, token consumption, model distribution and cost per successful workflow. This lets me identify expensive Workers, troubleshoot latency or throttling, and optimize the model-routing and token strategy without sacrificing quality.”**

## Easy memory trick

**T → L → E → C → T**

* **T** = Tokens
* **L** = Latency
* **E** = Errors
* **C** = Cost
* **T** = Trace

> **“Measure the Bedrock call, then trace it back to the CWD workflow.”**
