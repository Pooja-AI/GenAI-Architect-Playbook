## How many concurrent users can CWD support?

There is **no fixed number** I would claim without load-testing the actual CWD deployment. Capacity depends on the Coordinator instances, Worker concurrency, LLM limits, MCP/enterprise API limits, database throughput, and request complexity.

For an interview, I would answer with a **capacity model**, not an arbitrary number.

### CWD capacity model

```text
Users
  ↓
API Gateway / APIM
  ↓
Load Balancer
  ↓
Multiple Coordinator instances
  ↓
┌───────────────┬────────────────┐
Sales Delegator IT Delegator
  ↓                 ↓
Workers           Workers
  ↓                 ↓
MCP               MCP
  ↓                 ↓
Salesforce       ServiceNow
```

### Example

Suppose our tested deployment supports:

* **10 Coordinator instances**
* Each Coordinator safely handles **20 concurrent active workflows**
* Therefore:

```text
10 × 20 = 200 concurrent workflows
```

If each user normally has one active workflow, that's approximately:

**200 concurrent active users.**

But this is only an **illustrative capacity**, not a production claim.

---

## What actually limits CWD?

The biggest bottleneck may not be the Coordinator.

For example:

```text
Coordinator       → 500 concurrent
Delegators        → 500 concurrent
Workers           → 300 concurrent
Azure OpenAI      → rate/token limits
Salesforce        → API/concurrency limits
ServiceNow        → API limits
Database          → throughput limits
MCP               → connection/tool limits
```

If ServiceNow can safely handle only 100 concurrent requests, then sending 500 requests toward it can create cascading failures.

So I would design:

```text
500 users
   ↓
CWD
   ↓
Concurrency control
   ↓
100 ServiceNow calls
   ↓
Queue remaining requests
```

---

## How would I determine the real number?

I would run **load testing** with realistic CWD workflows.

Measure:

* Concurrent users
* Requests/second
* End-to-end P95/P99 latency
* Coordinator CPU/memory
* Worker concurrency
* A2A latency
* MCP latency
* LLM token throughput
* LLM rate-limit/429 rate
* Salesforce/ServiceNow API limits
* Database throughput
* Queue depth
* Error rate
* Task completion rate
* Cost per workflow

Then gradually increase:

```text
50 users
   ↓
100
   ↓
200
   ↓
500
   ↓
1000
```

until we hit the defined SLO or a dependency limit.

### Important distinction

**Concurrent users ≠ requests per second.**

For example:

```text
200 concurrent users
       ↓
Each workflow takes 20 seconds
       ↓
Approximate throughput ≈ 10 workflows/sec
```

The actual relationship depends on traffic patterns and workflow duration.

### Interview-ready answer

> **“I wouldn't give an arbitrary concurrent-user number for CWD without load testing. I would calculate capacity based on Coordinator and Worker concurrency, LLM token and request limits, MCP and downstream API limits, database throughput, and target latency. For example, if 10 Coordinator instances safely handle 20 active workflows each, the tested capacity would be around 200 concurrent workflows. I would then validate that number through load testing and identify the actual bottleneck, because downstream systems like Salesforce, ServiceNow, or the LLM provider can become the limiting factor before the Coordinator does.”**

### Strong interview line

> **“CWD capacity is determined by the bottleneck in the end-to-end system, not simply by how many Coordinator instances I deploy.”**
