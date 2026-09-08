# CWD Dashboards and Alerting

**Dashboards and alerts are the operational control layer of CWD.**

Observability collects the telemetry, but dashboards turn that telemetry into **real-time operational visibility**, while alerts turn important metric changes into **actionable notifications**.

```text
CWD Services
    ↓
Telemetry
    ↓
Logs + Traces + Metrics + AI Evaluation
    ↓
┌─────────────────────────────┐
│       CWD Dashboards        │
│ Application                 │
│ Agents / Workflows          │
│ Infrastructure              │
│ LLM / AI                    │
│ Messaging                   │
│ Business                    │
└──────────────┬──────────────┘
               ↓
        Threshold / Anomaly
             Detection
               ↓
            Alerts
               ↓
     Investigation / Action
```

---

## 1. Why CWD needs dashboards

A CWD request can travel through:

```text
Gateway
   ↓
Coordinator
   ↓
Delegator
   ↓
Worker
   ↓
LLM
   ↓
MCP
   ↓
Enterprise Data
   ↓
Aggregation
```

One request can therefore produce dozens or hundreds of telemetry events.

A dashboard provides a **condensed operational view**.

Instead of searching individual logs, an operator can immediately see:

```text
Requests       → 12,450/min
Success Rate   → 98.7%
P95 Latency    → 3.2 sec
Queue Depth    → 420
LLM TTFT       → 850 ms
Token Usage    → 4.2M/hour
Tool Success   → 97.8%
Workflow Cost  → $0.18
```

This allows an operator to quickly answer:

> **Is CWD healthy right now?**

---

# 2. CWD dashboard hierarchy

A useful enterprise implementation should have multiple dashboards rather than one giant dashboard.

```text
                    CWD Monitoring
                         │
        ┌────────────────┼────────────────┐
        ↓                ↓                ↓
 Application          Agent/AI        Infrastructure
 Dashboard            Dashboard          Dashboard
        │                │                │
        ├────────────┬───┴────┬───────────┤
                     ↓
                Messaging
                 Dashboard
                     │
                     ↓
                Business
                 Dashboard
```

---

# 3. Application dashboard

The application dashboard focuses on the health of CWD services.

### Important metrics

* Request volume
* Requests/sec
* Throughput
* Success rate
* Error rate
* HTTP 4xx/5xx
* P50/P95/P99 latency
* Availability
* Active requests
* Dependency failures

Example:

```text
CWD APPLICATION HEALTH
────────────────────────────────
Request Rate       1,250 / sec
Success Rate       99.1%
Error Rate          0.9%
P95 Latency         2.4 sec
P99 Latency         5.8 sec
Availability       99.95%
```

### Questions answered

* Is the API healthy?
* Is traffic increasing?
* Are requests failing?
* Is latency degrading?
* Which service is responsible?

---

# 4. Agent dashboard

This dashboard focuses on Coordinator, Delegator, and Worker behavior.

```text
Agent Health
──────────────────────────────
Coordinator
  Success        99.5%
  P95             420 ms

Shipping Delegator
  Success        98.7%
  P95             1.8 sec

Tracking Worker
  Success        97.2%
  P95             2.9 sec

Finance Worker
  Success        99.4%
  P95             1.1 sec
```

### Important metrics

* Agent execution time
* Agent success rate
* Agent failure rate
* Retry rate
* Timeout rate
* Task completion
* Workflow completion
* Agent availability
* Worker utilization
* Agent selection frequency
* Failover frequency

### Why it matters

Suppose:

```text
Overall workflow success = 97%
```

The Agent dashboard might reveal:

```text
Coordinator = 99.9%
Delegator   = 99.5%
Worker A    = 99.2%
Worker B    = 87.4%   ← Problem
```

The problem can immediately be narrowed to Worker B.

---

# 5. LLM / AI dashboard

This is one of the most important dashboards for an agentic platform.

### LLM metrics

* LLM request volume
* LLM success rate
* LLM latency
* P50/P95/P99
* TTFT
* Input tokens
* Output tokens
* Total tokens
* Model usage
* Model errors
* Timeout rate
* Retry rate
* Cost
* Model distribution

Example:

```text
LLM HEALTH
────────────────────────────
Requests       85,000/hour
P95 latency       2.1 sec
TTFT              650 ms
Input tokens      240M
Output tokens      52M
Error rate         0.7%
Cost             $182/hour
```

### AI-quality metrics

Operational LLM metrics aren't enough.

The dashboard can also include:

* Agent accuracy
* Tool-selection accuracy
* Groundedness
* Response relevance
* Citation accuracy
* Retrieval Recall@K
* Retrieval Precision@K
* Workflow success
* Consistency

This gives two views:

```text
LLM PERFORMANCE
       +
AI QUALITY
       ↓
AI PRODUCTION HEALTH
```

---

# 6. Messaging dashboard

CWD may use Azure Service Bus or Kafka depending on the communication pattern.

The messaging dashboard monitors the asynchronous execution layer.

### Important metrics

* Queue depth
* Message rate
* Processing rate
* Message age
* Queue wait time
* Consumer lag
* Delivery count
* Retry count
* Dead-letter count
* Consumer availability
* Processing failures

Example:

```text
SERVICE BUS
────────────────────────────
Queue Depth       2,450
Oldest Message      18 sec
Incoming Rate     1,200/sec
Processing Rate    1,050/sec
Retries              85
DLQ                  12
```

### Important signal

If:

```text
Incoming Rate > Processing Rate
```

then backlog will grow.

```text
Traffic
  ↓
Queue Depth ↑
  ↓
Queue Wait ↑
  ↓
Task Latency ↑
  ↓
Timeouts ↑
```

The dashboard allows operators to detect this before it becomes a major outage.

---

# 7. Infrastructure dashboard

This dashboard focuses on the underlying platform.

```text
Infrastructure
────────────────────────────
Coordinator Instances     6
Worker Instances         42
CPU                      64%
Memory                   71%
Restarts                   2
Cosmos Latency           18 ms
Redis Latency              4 ms
Search Latency            95 ms
Service Bus Depth        420
```

### Typical components

* Container Apps / AKS
* Cosmos DB
* Redis
* Azure AI Search
* Service Bus
* Storage
* Network
* API Gateway
* Compute
* LLM endpoints

### Why it matters

An agent may appear slow when the actual problem is:

```text
Worker
   ↓
Cosmos DB
   ↓
Throttling
```

Infrastructure dashboards expose that dependency problem.

---

# 8. Business dashboard

This is where technical observability connects to business value.

### Metrics

* Successful workflows
* Business task completion
* Cases resolved
* Orders processed
* Recommendations generated
* Human escalations
* Approval rates
* User satisfaction
* Cost per successful workflow
* Business SLA compliance

Example:

```text
BUSINESS HEALTH
────────────────────────────
Workflows completed       98.2%
Business success          94.7%
Human escalation           3.1%
SLA compliance            97.8%
Cost / successful task     $0.21
```

This answers the most important question:

> **Is the CWD platform actually delivering business value?**

---

# 9. Alerting

A dashboard is primarily for **visibility**.

An alert is for **action**.

```text
Metric
  ↓
Threshold / Anomaly Detection
  ↓
Alert
  ↓
Notification
  ↓
Investigation
  ↓
Remediation
```

For example:

```text
P95 latency
     ↓
> 5 seconds for 5 minutes
     ↓
Alert
     ↓
On-call engineer
```

---

# 10. Failure alerts

CWD should alert on abnormal failures such as:

```text
Error rate ↑
Worker failures ↑
LLM failures ↑
MCP failures ↑
Database failures ↑
Authentication failures ↑
Workflow failures ↑
Dead-letter messages ↑
```

Example:

```text
ALERT

Worker failure rate
Current: 8.2%
Baseline: 1.1%

Severity: HIGH
```

---

# 11. Latency degradation alerts

Latency should generally use percentiles rather than only averages.

For example:

```text
P50 = 0.8 sec
P95 = 3.2 sec
P99 = 8.5 sec
```

An alert might detect:

```text
P95 workflow latency > SLA
for 5 consecutive minutes
```

This is more meaningful than:

```text
Average latency = 1.2 sec
```

because tail latency can affect a significant subset of users.

---

# 12. Unusual traffic alerts

CWD should detect unexpected traffic patterns.

Examples:

```text
Normal:
1,000 requests/min

Current:
8,000 requests/min
```

Potential causes:

* Traffic spike
* Client retry storm
* Bot activity
* Misconfigured application
* Runaway agent
* Recursive workflow
* Denial-of-service behavior

### Agent-specific anomaly

```text
Normal:
4 tool calls/request

Current:
35 tool calls/request
```

This may indicate:

* Poor agent planning
* Tool loop
* Prompt injection
* Retry storm
* Unexpected workflow behavior

---

# 13. Cost spike alerts

AI systems can create unexpected costs very quickly.

For example:

```text
Normal LLM cost:
$100/hour

Current:
$450/hour
```

The alert should trigger investigation.

Potential causes:

```text
Token consumption ↑
LLM calls/request ↑
Retries ↑
Context size ↑
Expensive model usage ↑
Workflow fan-out ↑
Tool loops ↑
```

A useful metric is:

$$
\text{Cost Per Successful Workflow}
=
\frac{\text{Total CWD Cost}}
{\text{Successful Workflows}}
$$

This is often more meaningful than total spend alone.

---

# 14. Service-health alerts

Service health combines several signals.

```text
Availability
     +
Reliability
     +
Latency
     +
Dependency Health
     +
Capacity
     +
Error Rate
```

Conceptually:

$$
\text{Service Health}
=
f(
Availability,
Reliability,
Performance,
Dependencies,
Capacity,
Errors
)
$$

Example:

```text
Worker Service
────────────────────
Availability    ✓
Error Rate      ✓
CPU             ✓
Memory          ✓
LLM             ✓
MCP             ✕
Database        ✓
```

The Worker itself may be healthy, but one dependency is degraded.

---

# 15. Alert severity

Not every alert should page an engineer.

A useful model is:

| Severity          | Example                                    |
| ----------------- | ------------------------------------------ |
| **Critical**      | Production service unavailable             |
| **High**          | Major workflow failure / security incident |
| **Medium**        | P95 latency degradation                    |
| **Low**           | Capacity approaching threshold             |
| **Informational** | Version deployment completed               |

This prevents **alert fatigue**.

---

# 16. Alert correlation

The best CWD alerting architecture correlates alerts with:

```text
Correlation ID
Workflow ID
Task ID
Run ID
Step ID
Agent ID
Agent Version
Prompt Version
Model
Tool
MCP Server
Dependency
Environment
Tenant
```

Suppose the alert says:

> Worker latency increased.

The operator should be able to trace:

```text
Worker
   ↓
LLM
   ↓
MCP Tool
   ↓
Enterprise API
   ↓
API latency increased
```

This turns an alert into an investigation starting point.

---

# 17. Dashboard + Trace + Log + Alert

These four capabilities work together.

```text
Dashboard
   │
   │ detects
   ↓
Alert
   │
   │ identifies
   ↓
Trace
   │
   │ shows execution path
   ↓
Logs
   │
   │ explain detailed event
   ↓
Root Cause
```

### Example

**Dashboard**

```text
P95 Workflow Latency = 7.2 sec
```

**Alert**

```text
Workflow latency SLA breached
```

**Trace**

```text
Worker
  ↓
MCP
  ↓
Enterprise API = 5.8 sec
```

**Logs**

```text
Enterprise API timeout
Retry attempt = 1
```

**Root cause**

```text
Enterprise API degradation
```

---

# 18. CWD operational investigation

When an alert occurs, the investigation flow should be:

```text
ALERT
  ↓
Identify affected service
  ↓
Check dashboard
  ↓
Find correlation / trace
  ↓
Inspect distributed trace
  ↓
Inspect related logs
  ↓
Check dependencies
  ↓
Check infrastructure
  ↓
Check recent deployments/configuration
  ↓
Determine root cause
  ↓
Recover / rollback / scale / failover
  ↓
Verify metrics return to normal
```

---

# 19. Real-time CWD dashboard architecture

```text
                         CWD
                          │
       ┌──────────────────┼──────────────────┐
       ↓                  ↓                  ↓
   Application         Agent/AI        Infrastructure
    Metrics             Metrics            Metrics
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ↓
                    Telemetry Layer
                          │
             ┌────────────┼────────────┐
             ↓            ↓            ↓
           Logs         Traces       Metrics
             │            │            │
             └────────────┼────────────┘
                          ↓
                  Monitoring Platform
                          │
             ┌────────────┴────────────┐
             ↓                         ↓
        Dashboards                   Alerts
             │                         │
             ↓                         ↓
      Human Investigation       Automated Action
```

---

# 20. What should be on the main CWD dashboard?

A useful executive/operations dashboard could look like:

```text
┌──────────────────────────────────────────────────────┐
│                 CWD PLATFORM HEALTH                  │
├──────────────┬──────────────┬──────────────┬─────────┤
│ Requests     │ Success      │ P95 Latency  │ Errors  │
│ 12.4K/min    │ 98.9%        │ 2.8 sec      │ 1.1%    │
├──────────────┼──────────────┼──────────────┼─────────┤
│ Workflows    │ Queue Depth  │ LLM TTFT     │ Cost    │
│ 8.2K/min     │ 320          │ 650 ms       │ $120/hr │
├──────────────┴──────────────┴──────────────┴─────────┤
│                                                      │
│ Agent Health     ✓                                   │
│ Worker Health    ✓                                   │
│ LLM Health       ✓                                   │
│ MCP Health       ⚠                                   │
│ RAG Health       ✓                                   │
│ Service Bus      ✓                                   │
│ Cosmos DB        ✓                                   │
│ Redis            ✓                                   │
│                                                      │
├──────────────────────────────────────────────────────┤
│ Active Alerts: 2                                    │
│ High: MCP latency degradation                        │
│ Medium: Worker capacity approaching threshold        │
└──────────────────────────────────────────────────────┘
```

---

# 21. Dashboards should support different audiences

### Executive

Focus on:

* Business success
* Availability
* SLA
* Cost
* Adoption
* Major incidents

### Operations / SRE

Focus on:

* P95/P99
* Error rates
* Queue depth
* Dependencies
* Infrastructure
* Availability
* Capacity

### AI/ML team

Focus on:

* Model latency
* TTFT
* Tokens
* Model errors
* Accuracy
* Groundedness
* Retrieval quality
* Cost

### Agent engineering team

Focus on:

* Agent execution
* Routing
* Worker success
* Tool calls
* Workflow paths
* Retries
* Failover

---

# 22. Important CWD alert categories

```text
APPLICATION
 ├── Error-rate spike
 ├── Request failure
 └── Availability degradation

AGENT
 ├── Worker failure
 ├── Agent timeout
 ├── Excessive retries
 └── Routing failure

LLM
 ├── Latency increase
 ├── TTFT degradation
 ├── Token spike
 ├── Model errors
 └── Cost spike

MESSAGING
 ├── Queue depth
 ├── Message age
 ├── Consumer lag
 └── DLQ growth

DEPENDENCIES
 ├── MCP failure
 ├── API latency
 ├── Database throttling
 └── Search degradation

SECURITY
 ├── Unauthorized access
 ├── DLP violation
 ├── Prompt injection
 └── Cross-tenant attempt

BUSINESS
 ├── Workflow success degradation
 ├── SLA breach
 └── Cost per successful workflow increase
```

---

# 23. The key architecture separation

Do not make dashboards responsible for executing business decisions.

```text
Dashboard
   ↓
Visibility

Alert
   ↓
Detection

Policy
   ↓
Authorization

LangGraph
   ↓
Workflow control

Service Bus
   ↓
Message delivery

Agent Registry
   ↓
Agent discovery

Application Insights / Monitoring
   ↓
Telemetry
```

For example, a dashboard may show:

> Worker authorization failures increased.

But the dashboard does **not** authorize the Worker.

**Policy/IAM remains the security decision point.**

---

# 24. Final formula

$$
\boxed{
\text{CWD Operational Monitoring}
=
\text{Telemetry}
+
\text{Dashboards}
+
\text{Alerts}
+
\text{Investigation}
+
\text{Remediation}
}
$$

More specifically:

$$
\boxed{
\text{CWD Dashboards}
=
\text{Application}
+
\text{Agent}
+
\text{LLM}
+
\text{Infrastructure}
+
\text{Messaging}
+
\text{Business}
}
$$

And:

$$
\boxed{
\text{CWD Alerting}
=
\text{Failure Detection}
+
\text{Latency Detection}
+
\text{Traffic Anomaly Detection}
+
\text{Cost Anomaly Detection}
+
\text{Capacity Detection}
+
\text{Service Health Detection}
+
\text{Security Detection}
}
$$

---

# Final definition

**CWD dashboards and alerting provide the operational control layer for the enterprise multi-agent platform. Dashboards aggregate real-time application, Coordinator, Delegator, Worker, LLM, RAG, MCP, messaging, infrastructure, security, and business metrics into role-specific views that show system health, performance, reliability, capacity, AI behavior, and cost. Alerts continuously evaluate these signals against thresholds, SLAs, baselines, or anomaly patterns to detect failures, latency degradation, unusual traffic, queue buildup, dependency problems, cost spikes, capacity constraints, and security issues. When combined with distributed tracing and centralized logs, dashboards and alerts allow operators to move from detection → trace → investigation → root cause → remediation → verification.**

### Interview-ready answer

> **“In CWD, dashboards provide real-time visibility across the entire multi-agent execution platform. I separate them into application, agent, LLM/AI, infrastructure, messaging, security, and business views. Application dashboards monitor request volume, throughput, error rate, availability, and P95/P99 latency. Agent dashboards monitor Coordinator, Delegator, and Worker execution, success, retries, and failures. LLM dashboards track model latency, TTFT, tokens, errors, and cost, while AI dashboards track quality metrics such as groundedness and retrieval performance. Messaging dashboards monitor queue depth, message age, consumer throughput, retries, and DLQ. Infrastructure dashboards monitor compute, Cosmos, Redis, Search, and dependency health. On top of these metrics, alerting detects SLA violations, failure spikes, latency degradation, unusual traffic, retry storms, queue buildup, cost anomalies, and service-health issues. When an alert fires, we correlate it with trace and log information using correlation, workflow, task, run, and step identifiers to identify the root cause and take corrective action.”**

### Mental model

```text
              CWD TELEMETRY
                    │
       ┌────────────┼────────────┐
       ↓            ↓            ↓
     Logs         Traces       Metrics
       │            │            │
       └────────────┼────────────┘
                    ↓
              DASHBOARDS
                    │
        "What is happening?"
                    ↓
                 ALERTS
                    │
        "What needs attention?"
                    ↓
              INVESTIGATION
                    │
        "Why did it happen?"
                    ↓
               REMEDIATION
                    │
              "Fix + verify"
```
