# Azure OpenAI Model Deployment & Quotas

This is an important **Solution Architect interview topic** because production Azure OpenAI is not just "call GPT." You need to understand **deployment → quota → TPM/RPM → scaling → throttling → fallback → reliability**.

> **Core idea:**
> **Model = what you use**
> **Deployment = how your application accesses the model**
> **Quota = how much traffic/capacity you are allowed to use**

Azure quota is allocated by **subscription, region, model, and deployment type**, primarily in TPM units. The RPM limit is associated with the allocated TPM according to model-specific ratios. ([Microsoft Learn][1])

---

## 1. What is a Model Deployment?

You don't normally have your application directly say:

```text
Call GPT-4.1
```

Instead, you deploy a model:

```text
Azure OpenAI Resource
        ↓
Model
   GPT-4.1
        ↓
Deployment
   "gpt41-prod"
        ↓
Endpoint
        ↓
Application
```

The **deployment** is the application-facing configuration for a particular model/version and deployment type.

### Example

You could have:

```text
Azure OpenAI Resource
│
├── gpt41-prod
│     └── GPT-4.1
│
├── gpt41-mini-prod
│     └── GPT-4.1-mini
│
└── embedding-prod
      └── text-embedding model
```

Your application can then route requests to the appropriate deployment.

---

# 2. Why Multiple Deployments?

This is very important for enterprise architecture.

Suppose CWD has:

```text
1000 users
```

and all requests go to one deployment:

```text
CWD
 ↓
GPT-4.1 deployment
 ↓
Quota exhausted
 ↓
429
```

Instead, you can design:

```text
                    ┌── GPT-4.1 deployment
                    │
CWD → AI Gateway ───┼── GPT-4.1-mini deployment
                    │
                    └── Backup deployment
```

This gives you:

* workload isolation
* better capacity management
* model routing
* fallback
* cost optimization
* better reliability

---

# 3. What is TPM?

**TPM = Tokens Per Minute**

It represents the token throughput capacity/rate limit associated with the deployment.

Example:

```text
Deployment:
GPT-4.1

TPM = 1,000,000
```

Conceptually:

```text
Maximum token capacity
        ↓
1 million tokens/minute
```

Tokens include the tokens consumed by the requests; exact quota/rate-limit behavior depends on the deployment/model configuration.

Azure's quota system assigns TPM to deployments, and the assigned TPM directly determines the token rate limit for inference requests. ([Microsoft Learn][1])

---

# 4. What is RPM?

**RPM = Requests Per Minute**

Example:

```text
RPM = 1,000
TPM = 1,000,000
```

means the deployment has both:

```text
Request limit
      +
Token limit
```

You must consider **both**.

For example:

```text
Request 1 → 500 tokens
Request 2 → 500 tokens
...
```

You could hit the **RPM limit** before consuming all available TPM.

Or:

```text
Large prompt
+
Large output
```

could exhaust **TPM** even though RPM is relatively low.

The RPM-to-TPM relationship is model-specific rather than a universal fixed ratio. ([Microsoft Learn][1])

---

# 5. TPM vs RPM — Simple Example

Suppose your deployment has:

```text
TPM = 1,000,000
RPM = 1,000
```

### Scenario A

100 requests/minute

Each request:

```text
2,000 tokens
```

Total:

```text
100 × 2,000
= 200,000 tokens
```

Both limits are fine.

### Scenario B

1,000 requests/minute

Each request:

```text
2,000 tokens
```

Total:

```text
1,000 × 2,000
= 2,000,000 tokens
```

RPM is okay.

But TPM is exceeded.

Therefore:

```text
RPM okay
TPM exceeded
→ throttling
```

---

# 6. What happens when quota is exceeded?

Typically your application can receive:

```text
HTTP 429
Too Many Requests
```

This means:

> **The service is throttling because the deployment cannot accept the request under its current rate/capacity constraints.**

For provisioned deployments, Microsoft documents immediate 429 responses when utilization reaches 100%, along with `retry-after` information. ([Microsoft Learn][2])

---

# 7. How do you manage Quota?

As an architect, don't simply allocate maximum quota to one deployment.

Think:

```text
Total subscription quota
          ↓
       Region
          ↓
       Model
          ↓
   Multiple deployments
```

For example:

```text
Total GPT-4.1 quota
       2M TPM
          │
     ┌────┴────┐
     ↓         ↓
1.5M TPM    500K TPM
Prod        Batch
```

Quota can be redistributed between deployments of the same model/model type, or additional quota can be requested when available/approved. ([Microsoft Learn][1])

---

# 8. Production Quota Strategy

For your CWD architecture, I would design:

```text
                    CWD
                     │
                     ↓
               Azure APIM
                     │
                     ↓
               AI Gateway
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      Primary     Secondary    Backup
      GPT-4.1     GPT-4.1      GPT-4.1-mini
          │          │          │
       High        High        Lower
       quality     capacity    cost
```

The gateway can implement:

* authentication
* rate limiting
* token budgeting
* model routing
* retries
* fallback
* monitoring
* cost controls

Microsoft's Azure architecture guidance also recommends a gateway pattern for centralized quota control, throttling, observability and routing across deployments. ([Microsoft Learn][3])

---

# 9. Model Selection

Don't always use the biggest model.

For CWD:

| Workload              | Model strategy         |
| --------------------- | ---------------------- |
| Simple classification | Smaller/cheaper model  |
| Intent routing        | Smaller model          |
| Summarization         | Smaller model          |
| Complex reasoning     | Strong reasoning model |
| Complex RCA           | Strong model           |
| Multimodal analysis   | Vision-capable model   |
| Embeddings            | Embedding model        |
| High-volume workloads | Cost-efficient model   |

Example:

```text
User Request
     ↓
Coordinator
     ↓
Is this complex?
   /       \
 No        Yes
 ↓          ↓
Mini      Strong model
```

This is called **model routing**.

---

# 10. Scaling Strategies

There are several ways to scale.

### Strategy 1 — Increase TPM

```text
500K TPM
   ↓
1M TPM
```

Good when you have sufficient quota.

---

### Strategy 2 — Multiple deployments

```text
Deployment A
      +
Deployment B
      +
Deployment C
```

Traffic can be distributed across them.

---

### Strategy 3 — Multiple regions

For appropriate deployment types and enterprise requirements:

```text
East US
   ↓
Azure OpenAI

West US
   ↓
Azure OpenAI
```

This can provide additional capacity/resilience, subject to model availability, quota, residency and architecture requirements. Quota is region-specific. ([Microsoft Learn][4])

---

### Strategy 4 — Provisioned Throughput

For predictable high-volume workloads:

```text
Standard deployment
      ↓
Variable demand

Provisioned deployment
      ↓
Reserved/predictable capacity
```

Provisioned deployments use **PTUs (Provisioned Throughput Units)** and provide allocated inference capacity. Utilization should be monitored to avoid sustained 100% utilization. ([Microsoft Learn][2])

---

# 11. Standard vs Provisioned

Think about it this way:

### Standard

```text
Pay/use based on requests/tokens
        ↓
Flexible
        ↓
Variable workload
```

### Provisioned

```text
Allocate capacity
        ↓
Predictable throughput
        ↓
High-volume predictable workload
```

For an enterprise CWD platform:

```text
Normal workloads
      ↓
Standard

Critical/high-volume predictable workloads
      ↓
Provisioned
```

---

# 12. Fallback Strategy

This is one of the **most important interview concepts**.

Suppose:

```text
CWD
 ↓
GPT-4.1 Primary
 ↓
429
```

Don't immediately fail the user.

Instead:

```text
GPT-4.1 Primary
      ↓
    429?
      ↓
 GPT-4.1 Secondary
      ↓
    still fail?
      ↓
 GPT-4.1-mini
      ↓
    Response
```

This is **model/deployment fallback**.

---

# 13. Retry Strategy

For transient throttling:

```text
Request
   ↓
429
   ↓
Wait
   ↓
Retry
```

Use:

**exponential backoff + jitter**

Example:

```text
Retry 1 → 500 ms
Retry 2 → 1 sec
Retry 3 → 2 sec
Retry 4 → 4 sec
```

But don't retry forever.

Use:

```text
max retries
+
timeout
+
fallback
```

Azure's SDK retry behavior can honor `retry-after` information, and Microsoft recommends using that signal when retrying throttled requests. ([Microsoft Learn][2])

---

# 14. Retry vs Fallback

This distinction is excellent for interviews.

### Retry

Same deployment:

```text
GPT-4.1
 ↓
429
 ↓
wait
 ↓
GPT-4.1
```

Use when the throttling is temporary.

### Fallback

Different deployment/model:

```text
GPT-4.1
 ↓
429
 ↓
GPT-4.1 secondary
```

Use when:

* sustained throttling
* regional capacity issue
* deployment outage
* latency too high
* business-critical request

---

# 15. Production Reliability Pattern

For your CWD project:

```text
                 CWD
                  │
                  ↓
             Azure APIM
                  │
                  ↓
             AI Gateway
                  │
          ┌───────┴────────┐
          ↓                ↓
     Rate Limiter       Token Budget
          │                │
          └───────┬────────┘
                  ↓
             Model Router
                  │
       ┌──────────┼───────────┐
       ↓          ↓           ↓
   Primary     Secondary     Fallback
   GPT-4.1     GPT-4.1       GPT-4.1-mini
       │
       ↓
 Azure OpenAI
       │
       ↓
 Response
       │
       ↓
Monitoring / App Insights
```

---

# 16. What Should You Monitor?

For production:

```text
TPM utilization
RPM utilization
429 rate
P50 latency
P95 latency
P99 latency
TTFT
Tokens/sec
Input tokens
Output tokens
Error rate
Cost
Deployment availability
Fallback rate
```

Azure Monitor can be used to monitor deployment metrics; for provisioned deployments, Microsoft specifically exposes **Provisioned-managed utilization V2**. ([Microsoft Learn][2])

---

# 17. Important Architect-Level Concept: Quota ≠ Actual Throughput

This is a subtle interview point.

Don't say:

> "If I have 1M TPM quota, my application will always process exactly 1M tokens per minute."

That's not necessarily true.

Actual throughput depends on:

* model
* prompt size
* output size
* concurrency
* latency
* workload shape
* caching
* deployment type

Microsoft explicitly notes that assigned quota determines admission/rate-limit behavior for standard deployments, but actual achievable throughput can be lower because of per-call latency variations. ([Microsoft Learn][5])

---

# 18. CWD Example

Suppose CWD receives:

```text
10,000 requests/hour
```

We estimate:

```text
Average input = 2,000 tokens
Average output = 500 tokens
```

Approximate token consumption:

```text
10,000 × 2,500
= 25M tokens/hour
```

Therefore:

```text
25M / 60
≈ 416K tokens/minute
```

Now I would design capacity around:

```text
~416K TPM baseline
+
peak traffic
+
safety margin
```

Then distribute capacity across deployments rather than putting everything into one endpoint.

---

# 19. Strong Interview Answer

> **"For Azure OpenAI production deployments, I start with workload characterization—request volume, input/output token size, concurrency, latency and peak traffic. I select the appropriate model based on quality, latency and cost, then create model deployments and allocate quota in TPM. I monitor both TPM and RPM because a workload can hit either limit. For reliability, I implement rate limiting, exponential backoff with jitter, timeout controls and deployment/model fallback. For higher predictable workloads, I evaluate provisioned throughput. I also distribute workloads across deployments or regions where appropriate, and monitor 429s, token utilization, latency, throughput, errors, cost and fallback rate through Azure Monitor/Application Insights. In my CWD architecture, I would place APIM or an AI gateway in front of Azure OpenAI to centralize quota management, routing, throttling, security and observability."**

