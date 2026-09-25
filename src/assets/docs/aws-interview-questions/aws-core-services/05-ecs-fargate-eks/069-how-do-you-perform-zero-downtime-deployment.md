# How do you perform zero-downtime deployment?

## Short answer

For CWD on **ECS/Fargate**, I would use a **rolling deployment or blue-green deployment** so the old version continues serving traffic while the new version is started and health-checked.

For a critical CWD release, I would typically prefer **blue-green or canary deployment** when I need stronger control over risk.

---

## CWD deployment flow

```text
                API Gateway
                     ↓
                    ALB
                     ↓
              ECS/Fargate
                /       \
               /         \
        Old Version    New Version
          v1.4           v1.5
            ↓              ↓
        Healthy          Healthy
               \          /
                \        /
                 Traffic
```

The key principle is:

> **Never remove the healthy old version before the new version is ready.**

---

# 1. Build the new version

For example:

```text
CWD v1.4 → current production
CWD v1.5 → new release
```

Build Docker image:

```text
Docker
  ↓
cwd-coordinator:1.5
  ↓
Amazon ECR
```

I use an immutable version/tag rather than relying only on `latest`.

---

# 2. Start new ECS tasks

ECS starts tasks using version `1.5`:

```text
Before:

v1.4
v1.4
v1.4


During deployment:

v1.4
v1.4
v1.4
v1.5
v1.5
```

The old tasks continue serving traffic.

---

# 3. Perform health checks

The new tasks must pass:

```text
Container health check
       ↓
Readiness check
       ↓
ALB target health check
```

Only healthy tasks receive traffic.

```text
v1.5 Task 1 → Healthy ✓
v1.5 Task 2 → Healthy ✓
```

Then traffic can gradually move to the new version.

---

# 4. Remove old tasks gradually

Once the new version is healthy:

```text
v1.4 + v1.5
      ↓
Traffic moves to v1.5
      ↓
v1.4 tasks drained
      ↓
v1.4 stopped
```

This prevents a gap where no healthy application instances exist.

---

# Blue-Green deployment

For a stronger deployment strategy:

```text
             ALB
              ↓
       ┌──────┴──────┐
       ↓             ↓
    Blue            Green
    v1.4             v1.5
  Production        New
       ↓             ↓
    Traffic       Health test
```

Initially:

```text
100% → Blue
```

After Green is validated:

```text
0% → Blue
100% → Green
```

If there is a problem:

```text
100% → Blue
```

This makes rollback very fast.

---

# Canary deployment

For CWD, I can also use a canary:

```text
v1.4 → 95% traffic
v1.5 → 5% traffic
```

Monitor:

* Error rate
* P95/P99 latency
* Bedrock errors
* MCP failures
* Worker failures
* Token usage
* Cost
* LLM evaluation metrics
* Business success rate

If healthy:

```text
5% → 25% → 50% → 100%
```

If unhealthy:

```text
v1.5 → 0%
v1.4 → 100%
```

---

# 5. Important for CWD: AI components

Zero-downtime deployment isn't only about the Docker container.

CWD also has:

```text
Coordinator
Delegators
Workers
Prompts
Models
MCP tools
RAG configuration
```

Suppose I deploy:

```text
Coordinator v2
```

but accidentally change the prompt or model configuration.

The application may remain technically **healthy**, but answer quality could degrade.

So I would monitor both:

### Infrastructure health

```text
CPU
Memory
5xx
Latency
Task health
```

### AI quality

```text
Groundedness
Answer relevance
Tool success
Hallucination rate
LLM evaluation score
Token usage
Cost
```

---

# 6. Database/state compatibility

This is another important interview point.

Suppose:

```text
v1 → old schema
v2 → new schema
```

During deployment, both versions may temporarily run together.

Therefore, I prefer **backward-compatible schema changes**:

```text
Step 1 → Add new field
Step 2 → Deploy v2
Step 3 → Migrate data
Step 4 → Remove old field later
```

This avoids breaking the old version while it is still serving traffic.

---

# 7. Example CWD deployment

Suppose production has:

```text
Coordinator v1.4
Sales Delegator v1.4
Customer Worker v1.4
```

I release:

```text
Coordinator v1.5
Sales Delegator v1.5
Customer Worker v1.5
```

Deployment:

```text
Build
  ↓
Test
  ↓
LLM Evaluation
  ↓
Push images to ECR
  ↓
Deploy new ECS tasks
  ↓
Health checks
  ↓
Canary/Blue-Green
  ↓
Monitor
  ↓
100% traffic
  ↓
Remove old version
```

---

# 🎯 Strong interview answer

> **“For zero-downtime deployment of CWD on ECS/Fargate, I would use rolling, blue-green, or canary deployment. I build an immutable versioned Docker image, push it to ECR, and start new ECS tasks while the old version continues serving traffic. The new tasks must pass container and ALB health checks before receiving traffic. For critical releases, I can shift traffic gradually using canary or blue-green deployment and monitor infrastructure metrics as well as AI-specific metrics such as groundedness, tool success, latency, cost and error rate. If the new version fails, I immediately route traffic back to the previous version.”**

## Easy memory trick

**Build → Start → Health Check → Shift → Monitor → Rollback**

```text
v1.4
 ↓
Build v1.5
 ↓
Start v1.5
 ↓
Health check
 ↓
Canary / Blue-Green
 ↓
Monitor
 ↓
100% v1.5
```

### Key distinction

**Rolling:** gradually replace old tasks.

**Blue-Green:** keep two environments and switch traffic.

**Canary:** send a small percentage of traffic to the new version first.

For CWD interviews, a strong line is:

> **“For normal releases I can use rolling deployment; for high-risk AI changes I prefer canary or blue-green because they give me controlled traffic shifting and fast rollback.”**
