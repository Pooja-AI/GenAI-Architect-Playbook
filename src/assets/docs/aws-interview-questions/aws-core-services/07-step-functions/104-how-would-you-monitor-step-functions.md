# How would you monitor Step Functions?

In CWD, I would monitor Step Functions at **three levels: workflow health, performance, and failures**.

```text id="4kq8zn"
              Step Functions
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    Workflow     Performance   Failures
      Health        Metrics      & Errors
        │           │             │
        └───────────┼─────────────┘
                    ▼
               CloudWatch
                    ↓
                 Alarms
                    ↓
              SNS / Alerting
```

## 1. Monitor workflow status

Track:

* **ExecutionsStarted**
* **ExecutionsSucceeded**
* **ExecutionsFailed**
* **ExecutionsTimedOut**
* **ExecutionsAborted**

For example:

```text id="m2x8qd"
Started     = 10,000
Succeeded   = 9,850
Failed      = 100
Timed out   = 50
```

A sudden increase in failures or timeouts is an operational signal.

---

## 2. Monitor execution duration

Track how long workflows take.

```text id="v6d3xa"
P50 = 5 sec
P95 = 12 sec
P99 = 30 sec
```

If P95/P99 suddenly increases:

```text id="r4h7sp"
Step Functions
      ↓
Workflow slower
      ↓
Check which Worker/state is slow
      ↓
MCP / Salesforce / ServiceNow / Bedrock
```

---

## 3. Monitor individual states

For CWD, I would identify:

```text id="9z5r7k"
Coordinator
   ↓
Sales Worker       ← 2 sec
Customer Worker    ← 1 sec
Incident Worker    ← 15 sec ⚠️
```

This helps identify the **slowest or failing Worker**.

---

## 4. Monitor retries

A high retry count can indicate:

* Downstream throttling
* Timeouts
* Network problems
* Service instability
* Bedrock 429s

Example:

```text id="f1w5qk"
Incident Worker
     ↓
Retry 1
     ↓
Retry 2
     ↓
Retry 3
     ↓
Catch
```

A growing retry rate is often an early warning before complete workflow failures.

---

## 5. Monitor errors

Track errors by category:

```text id="b8j2vd"
Timeout
429
5xx
Authorization
Validation
MCP failure
Downstream failure
```

Don't just monitor **"workflow failed."**

I want to know **why it failed**.

---

## 6. CloudWatch alarms

Examples:

```text id="z4q6ns"
Failure rate > threshold
        ↓
CloudWatch Alarm
        ↓
SNS / Incident System
```

Other useful alarms:

* Workflow failure rate
* Timeout rate
* Execution duration/P95
* Retry rate
* Aborted executions
* Backlog/queue age when SQS is involved

---

## 7. Distributed tracing

For deeper troubleshooting:

```text id="0m3x7p"
User
 ↓
API Gateway
 ↓
Coordinator
 ↓
Step Functions
 ↓
Sales Worker
 ↓
MCP
 ↓
Salesforce
```

Use a common **correlation ID / execution ID** so I can follow the request across services.

For CWD, I would combine:

* **CloudWatch** → metrics/logs/alarms
* **X-Ray / OpenTelemetry** → distributed tracing
* **Langfuse** → LLM/agent-level tracing and token/cost/quality information

---

## 🎯 Strong interview answer

> **“I monitor Step Functions through CloudWatch by tracking execution success, failure, timeout, and abort rates, along with execution duration and retry behavior. At the state level, I identify which Worker or downstream dependency is slow or failing. I configure alarms for abnormal failure, timeout, latency, and retry rates. For troubleshooting, I correlate the Step Functions execution with CWD correlation IDs and use distributed tracing to follow the request through Coordinator, Delegators, Workers, MCP, and downstream systems. For AI-specific behavior, I use Langfuse to monitor model latency, tokens, cost, and quality.”**

### Easy memory trick

**Status → Duration → Retry → Error → Trace → Alert**

### Key distinction

**CloudWatch tells me *that* the workflow has a problem.**

**Distributed tracing helps me find *where and why* the problem occurred.**
