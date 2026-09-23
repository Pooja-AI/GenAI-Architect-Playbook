### Interview answer

> **To support 10× traffic, I would avoid simply adding 10× compute. I would first identify the bottlenecks—LLM calls, Coordinator orchestration, MCP calls, databases, vector search, and downstream enterprise APIs—and then scale each layer independently.**
>
> **First, I would horizontally scale the API, Coordinator, Delegators, and Workers.** These services should be stateless so multiple instances can run behind a load balancer.
>
> **Second, I would introduce asynchronous processing for long-running workloads.** SQS/EventBridge in AWS, Service Bus/Event Grid in Azure, or Pub/Sub in GCP can absorb traffic spikes and allow Workers to process requests based on available capacity.
>
> **Third, I would scale the LLM layer carefully.** Ten times the traffic can mean ten times the token consumption. I would use model routing, prompt/context optimization, caching, batching where supported, and rate-limit management rather than blindly increasing model calls.
>
> **Fourth, I would scale RAG independently.** I would use partitioning/sharding, replicas, metadata filtering, caching, and optimized Top-K retrieval so vector search doesn't become the bottleneck.
>
> **Fifth, I would protect downstream systems.** Salesforce, ServiceNow, and other enterprise APIs may not scale 10× with us. I would use connection pooling, queues, rate limits, circuit breakers, caching, and backpressure to prevent overwhelming them.
>
> **Finally, I would load-test the complete CWD workflow before production and establish SLOs for latency, throughput, error rate, and cost per successful request.**

### 10× CWD architecture

```text
                         Users
                           |
                           v
                 Global Load Balancer
                           |
                    +------+------+
                    |             |
                    v             v
                 API x N       API x N
                    |             |
                    +------+------+
                           |
                    Coordinator x N
                           |
                +----------+----------+
                |                     |
                v                     v
         Sales Delegators       IT Delegators
             x N                    x N
                |                     |
                v                     v
          Workers x N             Workers x N
                |                     |
                +----------+----------+
                           |
                      MCP Gateway
                           |
                    +------+------+
                    |             |
                 Queue          Queue
                    |             |
               Enterprise APIs / Systems
```

### The important scaling techniques

| Bottleneck            | 10× strategy                          |
| --------------------- | ------------------------------------- |
| API                   | Horizontal scaling + load balancing   |
| Coordinator           | Stateless replicas                    |
| Delegators            | Horizontal scaling                    |
| Workers               | Independent autoscaling               |
| Long workflows        | Queue/event-driven processing         |
| LLM                   | Model routing + token optimization    |
| RAG                   | Replicas + partitioning + caching     |
| Redis/cache           | Cluster + appropriate TTLs            |
| Database              | Read replicas/partitioning            |
| MCP                   | Horizontally scaled gateway/servers   |
| Salesforce/ServiceNow | Rate limiting + queues + backpressure |
| Traffic spikes        | Queue buffering                       |
| Failures              | Circuit breakers + retries + DLQ      |
| Cost                  | Per-workflow cost monitoring          |

### A critical point: backpressure

Imagine traffic suddenly goes from:

```text
100 requests/sec
        ↓
1,000 requests/sec
```

But ServiceNow can only safely handle:

```text
200 requests/sec
```

If we simply scale Workers to 1,000 requests/sec, we may overwhelm ServiceNow.

Instead:

```text
1,000 req/s
     ↓
CWD
     ↓
Queue
     ↓
Workers process at 200 req/s
     ↓
ServiceNow
```

The queue absorbs the spike.

This is **backpressure**: the system controls downstream execution rather than allowing upstream traffic to cascade into failures.

### I would also separate scaling dimensions

A particularly strong architectural point is:

> **“I wouldn't scale the entire CWD stack uniformly.”**

For example:

```text
Traffic increase
      |
      +---- API:       10x
      |
      +---- Coordinator: 5x
      |
      +---- Sales Workers: 8x
      |
      +---- IT Workers:    3x
      |
      +---- RAG:           6x
      |
      +---- LLM:           capacity-controlled
```

Each component gets an autoscaling policy based on its actual bottleneck.

### How I would prove it

Before claiming that CWD supports 10× traffic, I would run:

1. **Load testing** — sustained 10× expected traffic.
2. **Spike testing** — sudden 10× increase.
3. **Stress testing** — continue beyond 10× until failure.
4. **Soak testing** — sustained traffic for hours.
5. **Failure testing** — Worker, queue, database, MCP, and model failures during high load.

I would monitor:

```text
Throughput
p50 / p95 / p99 latency
Error rate
Queue depth
Worker utilization
LLM latency
LLM token consumption
MCP latency
Database latency
Downstream API throttling
Cost/request
```

### Strong closing answer

> **“For 10× traffic, I would horizontally scale stateless CWD components, introduce queues and backpressure for asynchronous workloads, independently scale Workers and RAG, use caching and model/token optimization, protect downstream enterprise systems with rate limits and circuit breakers, and use autoscaling based on real bottlenecks. Most importantly, I would validate the architecture through load, spike, stress, soak, and failure testing rather than assuming 10× scalability from infrastructure size alone.”**
