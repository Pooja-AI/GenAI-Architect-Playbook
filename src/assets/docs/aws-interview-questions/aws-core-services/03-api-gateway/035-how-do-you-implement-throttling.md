# How do you implement throttling?

## Short answer
Throttle at account, stage, method and usage-plan levels.

## Key points
- Account default is a steady rate plus burst per region; override per stage or method.
- Usage plans give per-key rate, burst and quota (REST APIs); excess requests get 429.
- Add WAF rate-based rules for abusive clients.

## CWD context
Gateway throttling protects the backend; token quotas protect Bedrock.
# How do you implement throttling?

## Short answer

For CWD, I implement throttling at **multiple layers**, starting at **API Gateway** and then controlling concurrency for expensive downstream resources such as **Bedrock, MCP, Salesforce, and ServiceNow**.

The goal is to prevent traffic spikes from overwhelming the system.

```text id="j6w2kp"
User
 ↓
API Gateway
 ↓  ← Request throttling
CWD API
 ↓
Coordinator
 ↓
Delegator
 ↓
Workers
 ↓
┌───────────────┬──────────────┬──────────────┐
Bedrock        MCP           RAG/DB
 ↓              ↓               ↓
Token/          Connection/     Query
Concurrency     Rate limits     limits
```

---

## Key points

### 1. API Gateway throttling

At the external API boundary, I configure:

```text id="2xq4bn"
Requests per second
Burst capacity
Rate limits
Quotas
```

Example:

```text id="p8s3hm"
Normal rate = 100 requests/sec
Burst = 200
```

If traffic exceeds the configured limit:

```text id="c1v7dz"
Too many requests
      ↓
API Gateway
      ↓
429 Too Many Requests
```

This protects the CWD backend.

---

## 2. Throttle based on consumer where needed

For enterprise CWD, I may apply different limits based on:

```text id="g9k2rs"
User
Application
API key
Tenant
Endpoint
```

Example:

```text id="x4m8qa"
Application A → 100 req/sec
Application B → 50 req/sec
```

This prevents one client from consuming all available capacity.

---

# 3. Control Bedrock concurrency

API Gateway throttling alone isn't enough.

Suppose one request triggers:

```text id="w1f5jy"
Coordinator
    ↓
3 Delegators
    ↓
10 Workers
    ↓
10 Bedrock calls
```

100 user requests could potentially create:

```text
100 × 10 = 1,000
```

concurrent model calls.

So I also implement a **model concurrency limit**.

```text id="h3t7cv"
Workers
   ↓
Concurrency Controller
   ↓
Maximum 20 Bedrock calls
   ↓
Bedrock
```

Additional requests wait in a queue or are rejected gracefully.

---

# 4. Use SQS for asynchronous workloads

For workloads that don't need an immediate response:

```text id="a2k6pq"
CWD
 ↓
SQS
 ↓
Worker
 ↓
Bedrock / MCP
```

SQS acts as a buffer during traffic spikes.

Example:

```text id="r5y9uk"
Incoming work = 10,000
        ↓
      SQS
        ↓
Process at controlled rate
```

This prevents the downstream service from being overwhelmed.

---

# 5. Protect enterprise systems

CWD may call:

```text id="s7n2mc"
Salesforce
ServiceNow
SharePoint
Databases
```

These systems may have their own API limits.

So I apply per-system controls.

```text id="e8d4va"
Workers
   ↓
MCP
   ↓
Rate Limiter
   ↓
Salesforce
```

For example:

```text id="z3q6pw"
Salesforce limit
       ↓
MCP concurrency = 10
       ↓
Additional requests queued
```

This prevents CWD from overwhelming the enterprise API.

---

# 6. Token throttling for Bedrock

There are two different things to control:

### Request rate

```text
Requests / second
```

### Token rate

```text
Tokens / minute
```

For Bedrock, I monitor both because multiple CWD Workers can consume tokens concurrently.

```text id="v5h8jx"
Workers
   ↓
Token / Concurrency Controller
   ↓
Bedrock
```

---

# 7. Retry carefully after throttling

If Bedrock or another service returns `429`:

```text id="u2k9fw"
429
 ↓
Retry-After
 ↓
Exponential backoff
 ↓
Jitter
 ↓
Retry
```

I don't immediately retry thousands of requests because that can create a **retry storm**.

Example:

```text id="b6r1ty"
Request
 ↓
429
 ↓
wait
 ↓
retry
 ↓
still 429
 ↓
bounded retry
 ↓
fallback / fail gracefully
```

---

# 8. Use circuit breaker for persistent failures

If a downstream service remains overloaded:

```text id="q8m4ns"
Repeated failures
      ↓
Circuit breaker OPEN
      ↓
Stop sending traffic temporarily
      ↓
Protect system
      ↓
Health check
      ↓
Recover
```

This is especially useful for MCP → Salesforce/ServiceNow integrations.

---

# CWD throttling architecture

```text id="w7k3pz"
                 User
                   ↓
             API Gateway
                   ↓
          Request Throttling
                   ↓
               CWD API
                   ↓
             Coordinator
                   ↓
              Delegators
                   ↓
               Workers
              /    |     \
             /     |      \
        Bedrock   MCP     RAG
           ↓       ↓       ↓
      Concurrency Rate    Query
       control    limit   limit
           ↓       ↓       ↓
       AWS/Bedrock Enterprise Systems
```

---

# 🎯 Strong interview answer

> **“I implement throttling at multiple layers. At the API boundary, API Gateway controls request rate and burst traffic. Inside CWD, I control concurrency for expensive resources such as Bedrock and MCP calls, because one user request can fan out into multiple Workers. For asynchronous workloads, I use SQS to buffer traffic and process it at a controlled rate. I also enforce downstream limits for systems such as Salesforce and ServiceNow. When a service returns 429, I use bounded retries with exponential backoff and jitter, and for persistent failures I use a circuit breaker. This prevents traffic spikes and retry storms from cascading through the CWD architecture.”**

## Easy memory trick

**API → Concurrency → Queue → Downstream → Retry**

* **API** → throttle incoming requests
* **Concurrency** → limit parallel Workers/LLM calls
* **Queue** → absorb spikes
* **Downstream** → protect Salesforce/ServiceNow
* **Retry** → backoff instead of retry storms

### Key distinction

**Throttling** = control how much traffic enters or executes.

**Rate limiting** = enforce a request-rate limit.

**Concurrency limiting** = limit simultaneous operations.

**Queuing** = hold excess work until capacity is available.

**Circuit breaker** = stop calling a failing dependency temporarily.
