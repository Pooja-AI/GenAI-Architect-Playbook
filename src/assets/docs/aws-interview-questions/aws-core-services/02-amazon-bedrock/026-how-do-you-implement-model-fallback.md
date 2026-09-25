# How do you implement model fallback?

## Short answer

I implement **model fallback in the Model Router**.

If the primary Bedrock model fails because of a **transient error, throttling, timeout, or availability issue**, the router can send the request to an **approved fallback model**.

```text
Worker
   ↓
Model Router
   ↓
Primary Model
   ↓
Failure?
   ├── No → Response
   │
   └── Yes
        ↓
   Retry / Backoff
        ↓
   Fallback Model
        ↓
     Response
```

## Key points

### 1. Define primary and fallback models

Example:

```text
Customer Briefing
        ↓
Primary: Claude Sonnet-class
        ↓
Fallback: Amazon Nova Pro-class
```

For a simple classification task:

```text
Primary: Nova Micro
Fallback: Nova Lite
```

The exact model choices depend on **current Bedrock availability, region, quality requirements, and evaluation results**.

---

### 2. Don't fallback for every error

I classify the error first.

**Fallback candidates:**

* Throttling / 429
* Temporary service unavailable
* Timeout
* Transient infrastructure/network failure

**Usually don't fallback:**

* Invalid request
* Invalid parameters
* Authentication/authorization failure
* Bad prompt/request format
* Application validation error

For example:

```text
429
 ↓
Retry with backoff
 ↓
Still failing?
 ↓
Fallback model
```

---

### 3. Use retry before fallback

I don't immediately switch models after one failure.

```text
Primary model
     ↓
Transient failure
     ↓
Retry + exponential backoff + jitter
     ↓
Still failing?
     ↓
Fallback model
```

Example:

```text
Attempt 1 → Primary → 429
Attempt 2 → Primary → 429
Attempt 3 → Primary → Timeout
                         ↓
                   Fallback model
```

I keep the retry count and total retry duration bounded.

---

## 4. Model Router controls fallback

The architecture can look like:

```text
                    Worker
                       ↓
                 Model Router
                       ↓
              ┌────────────────┐
              │ Primary Model  │
              └───────┬────────┘
                      ↓
                Success?
               /         \
             Yes          No
              ↓            ↓
          Response    Error Classifier
                           ↓
                    Retry / Backoff
                           ↓
                      Still failing?
                       /        \
                     No          Yes
                     ↓            ↓
                 Response    Fallback Model
                                  ↓
                               Response
```

The **Worker should not randomly choose another model**. The routing policy should be centralized.

---

## 5. Preserve the same task requirements

This is important.

Suppose the Worker requires:

```text
Tool calling
Structured JSON
8K context
Good reasoning
```

The fallback model must support those requirements.

So I don't simply say:

> "Any available model is okay."

I maintain a **model capability registry**.

```text
Model
 ├── Context size
 ├── Tool calling
 ├── Structured output
 ├── Multimodal capability
 ├── Latency
 ├── Cost
 └── Quality evaluation
```

The fallback must satisfy the minimum capability requirements.

---

## 6. Use circuit breaker for repeated failures

If the primary model repeatedly fails:

```text
Primary failures ↑
       ↓
Circuit breaker OPEN
       ↓
Stop sending traffic temporarily
       ↓
Use fallback
       ↓
Periodic health check
       ↓
Primary healthy?
       ↓
Restore traffic
```

This prevents repeatedly sending requests to a failing primary model.

---

## 7. Monitor fallback usage

I track:

```text
Primary success rate
Fallback rate
Fallback success rate
Fallback latency
Fallback cost
Reason for fallback
Quality difference
```

Example:

```text
Primary calls       10,000
Primary failures       80
Fallback calls         80
Fallback success       77
Fallback failure        3
```

If fallback usage suddenly increases from 1% to 20%, that is an operational signal that needs investigation.

---

# CWD example

Suppose the **Customer Briefing Worker** needs to generate a final summary.

```text
Coordinator
    ↓
Sales Delegator
    ↓
Customer Briefing Worker
    ↓
Model Router
    ↓
Claude Sonnet-class model
```

The primary model times out.

```text
Primary timeout
      ↓
Retry + backoff
      ↓
Still timeout
      ↓
Fallback model
      ↓
Generate summary
      ↓
Sales Delegator
      ↓
Coordinator
      ↓
User
```

If the fallback cannot meet the required quality or tool/structured-output contract, I would **fail safely or return a partial response rather than silently producing a lower-quality answer**.

---

# 🎯 Strong interview answer

> **“I implement model fallback centrally in the Model Router. Each task has a primary model and one or more approved fallback models based on capability, quality, latency and cost. When a transient failure such as throttling, timeout or temporary service unavailability occurs, I first use bounded retries with exponential backoff and jitter. If the primary still fails, the router switches to a compatible fallback model. I also use a circuit breaker for repeated primary failures and monitor fallback rate, latency, success rate and quality. The fallback must satisfy the same minimum capabilities, such as context size, tool calling and structured output.”**

## Easy memory trick

**Detect → Retry → Fallback → Monitor**

```text
Failure
  ↓
Retry
  ↓
Still failing?
  ↓
Fallback
  ↓
Monitor
```

### Key distinction

**Model routing** decides **which model to use**.

**Model fallback** decides **what to use when the selected model fails**.

**Circuit breaker** decides **when to temporarily stop calling a failing model**.
