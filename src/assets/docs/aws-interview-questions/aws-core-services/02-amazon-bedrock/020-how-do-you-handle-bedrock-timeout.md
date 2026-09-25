# How do you handle Bedrock timeout?

## Short answer

A **Bedrock timeout** means our request did not complete within the configured time limit.

In CWD, I handle it using:

**Timeout → Retry → Backoff → Reduce → Fallback → Partial Response → Monitor**

The key is **not to blindly retry**, because a slow dependency can become even more overloaded.

---

## Key points

### 1. Set a timeout

I configure a maximum time for each Bedrock call.

For example:

```text
Worker
  ↓
Bedrock
  ↓
Timeout = 10 seconds
```

If Bedrock doesn't respond within the allowed time:

```text
Bedrock
   ↓
Timeout
   ↓
Worker handles failure
```

The actual timeout depends on the CWD SLA and model/workload.

---

### 2. Retry transient failures

If the timeout appears transient, retry with:

**Exponential backoff + jitter**

```text
Attempt 1
   ↓
Timeout
   ↓
Wait
   ↓
Attempt 2
   ↓
Timeout
   ↓
Longer wait
   ↓
Attempt 3
```

Don't retry indefinitely.

For example:

```text
max_retries = 2 or 3
```

The exact number should be based on the latency SLA and workload.

---

### 3. Don't retry everything

I distinguish between:

```text
Transient timeout
      ↓
Retry
```

and

```text
Persistent timeout
      ↓
Don't keep retrying
      ↓
Fallback / failure handling
```

Otherwise:

```text
Timeout
 ↓
Retry
 ↓
Timeout
 ↓
Retry
 ↓
Timeout
 ↓
System becomes slower
```

---

### 4. Reduce the request size

Sometimes the model is slow because we're sending too much context.

For CWD I can reduce:

* Conversation history
* RAG Top-K
* Duplicate documents
* Prompt size
* Output token limit
* Unnecessary tool results

Example:

```text
50 retrieved chunks
       ↓
Reranking
       ↓
Top 5–10 chunks
       ↓
Bedrock
```

This can reduce both **latency and cost**.

---

### 5. Use model routing

If a task doesn't require a high-capability model:

```text
Complex model
      ↓
Timeout / high latency
```

I can route appropriate workloads to a faster approved model.

```text
Simple task → faster/smaller model
Complex task → higher-capability model
```

The fallback should only be used if it still meets the required quality.

---

### 6. Handle Worker timeout separately

Suppose CWD has:

```text
Sales Worker       → Success
ServiceNow Worker  → Success
Knowledge Worker   → Bedrock timeout
```

The Delegator shouldn't necessarily fail everything.

If the Knowledge Worker is optional:

```text
Worker timeout
     ↓
Delegator
     ↓
Partial result
     ↓
Coordinator
     ↓
Final response
```

The response can say that knowledge retrieval was temporarily unavailable rather than inventing information.

---

### 7. Use circuit breaker

If Bedrock repeatedly times out:

```text
Bedrock
  ↓
Timeout
  ↓
Timeout
  ↓
Timeout
  ↓
Circuit breaker OPEN
```

Temporarily stop sending requests and allow the dependency to recover.

Then gradually allow requests again.

---

### 8. Monitor timeout patterns

I monitor:

* Bedrock timeout rate
* P50/P95/P99 latency
* Model latency
* Input/output tokens
* Concurrent requests
* Retry count
* Queue depth
* Worker latency
* End-to-end CWD latency

For example:

```text
Bedrock P95 = 4 sec
CWD P95      = 6 sec
```

If Bedrock P95 suddenly becomes:

```text
15 sec
```

I investigate model load, prompt size, token generation, concurrency, and downstream architecture.

---

# CWD timeout flow

```text
Worker
   ↓
Bedrock
   ↓
Response?
 ┌───────┴────────┐
Yes               No
 ↓                 ↓
Success          Timeout
                   ↓
             Retry allowed?
              ┌────┴────┐
             Yes         No
              ↓           ↓
        Backoff +      Fallback /
          Retry        Partial result
              ↓           ↓
          Bedrock      Delegator
                          ↓
                     Coordinator
```

---

# Example

Suppose the Customer Briefing Worker calls Bedrock:

```text
Worker
  ↓
Bedrock
  ↓
10-second timeout
```

It times out.

I would do:

```text
1. Record timeout + correlation ID
2. Check whether retry is appropriate
3. Retry with exponential backoff + jitter
4. Limit retries
5. If still failing, use approved fallback or return partial result
6. Do not fabricate missing information
7. Record metrics for investigation
```

---

# 🎯 Strong interview answer

> **“For Bedrock timeouts, I first configure a timeout based on our end-to-end SLA. If the timeout is transient, I use a bounded retry policy with exponential backoff and jitter rather than retrying indefinitely. I also reduce latency by controlling prompt size, RAG Top-K, output tokens and unnecessary model calls. If appropriate, I can route the workload to an approved faster model. In our multi-agent CWD architecture, I handle the failure at the Worker and Delegator level, so an optional Worker timeout doesn't necessarily fail the entire request. I can return a partial response or controlled fallback while clearly indicating unavailable information. I also monitor P95/P99 latency, timeout rate, retries and token usage to identify the root cause.”**

## Easy memory trick

**T → R → B → R → F → M**

* **T** = Timeout
* **R** = Retry decision
* **B** = Backoff
* **R** = Reduce workload
* **F** = Fallback / partial result
* **M** = Monitor

### Key distinction

**429 / throttling:**

> “We're sending too much capacity.”

**Timeout:**

> “The request didn't complete within the allowed time.”

Both need controlled retries, but the root-cause investigation is different.
