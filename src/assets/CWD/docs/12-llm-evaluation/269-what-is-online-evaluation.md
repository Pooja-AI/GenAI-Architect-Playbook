## What is Online Evaluation?

**Online evaluation means evaluating the CWD system while it is running in production with real user requests and real workloads.**

Unlike offline evaluation, we don't use only a fixed golden dataset. We continuously collect **production telemetry, traces, user feedback, and quality signals**.

### CWD flow

```text
Real User
   ↓
Coordinator
   ↓
Delegators
   ↓
Workers
   ↓
RAG / MCP
   ↓
Final Response
   ↓
Production Telemetry
   ↓
Evaluation & Monitoring
```

### What do I evaluate online?

| Area             | Example metrics                     |
| ---------------- | ----------------------------------- |
| Response quality | Groundedness, relevance             |
| Accuracy         | Factual/citation correctness        |
| Agent workflow   | Task completion rate                |
| Routing          | Correct Delegator/Worker selection  |
| RAG              | Retrieval relevance, no-result rate |
| MCP              | Tool success/failure rate           |
| Reliability      | Error rate, timeout rate            |
| Performance      | p50/p95/p99 latency                 |
| Cost             | Tokens and cost/request             |
| User experience  | Feedback, correction rate           |
| Safety           | Prompt injection, policy violations |

### CWD example

A real user asks:

> "Give me a customer briefing for C12345."

CWD executes:

```text
Coordinator
   ↓
Sales Delegator ──→ Salesforce
   ↓
IT Delegator ─────→ ServiceNow
   ↓
Coordinator aggregates
   ↓
Final response
```

We then record:

```text
Correlation ID: C789
Latency: 3.2 sec
Delegators: 2
Workers: 3
MCP calls: 4
LLM tokens: 2,850
Cost: $0.04
Groundedness: Pass
Task completion: Success
User feedback: Positive
```

If we notice that **ServiceNow MCP calls are timing out frequently**, online evaluation reveals a production problem that may not have appeared in our offline test set.

### How do I implement it?

In CWD, I would use:

```text
Application logs
       +
OpenTelemetry
       +
Application Insights / CloudWatch
       +
Langfuse
       +
User feedback
       ↓
Evaluation Dashboard
```

For every request, I capture things such as:

```text
correlation_id
task_id
agent_id
worker_id
tool_name
retrieval results
LLM latency
token usage
errors
final response
```

Then I continuously calculate quality and operational metrics.

### Online evaluation vs monitoring

They are related but not exactly the same.

**Monitoring:**

> "Is the system healthy?"

Example: CPU, latency, errors, MCP timeout rate.

**Online evaluation:**

> "Is the AI system producing good results?"

Example: Is the response grounded? Did the Worker choose the correct tool? Did the answer contain unsupported claims?

### Online vs Offline

| Offline                   | Online                             |
| ------------------------- | ---------------------------------- |
| Fixed golden dataset      | Real production traffic            |
| Before deployment         | During production                  |
| Controlled environment    | Real-world conditions              |
| Regression testing        | Continuous evaluation              |
| Known expected answers    | Often requires evaluators/feedback |
| Example: 1,000 test cases | Example: 50,000 real requests      |

### Interview-ready answer

> **“Online evaluation is continuous evaluation of CWD using real production traffic. I collect traces, user feedback, tool results, retrieval information, latency, token usage, errors, and response-quality signals. I evaluate metrics such as task completion, groundedness, factual accuracy, retrieval quality, tool success, latency, cost, and failure rate. For example, if production users frequently correct a customer briefing or if MCP calls are failing, online evaluation helps us detect that and improve the system. Offline evaluation tells us whether a new version performs well before deployment; online evaluation tells us how it performs with real users.”**

### Easy memory

**Offline = Test before production.**

**Online = Continuously evaluate in production.**
