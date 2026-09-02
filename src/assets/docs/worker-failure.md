# How Do You Handle Failure of a Worker Agent?

## Interview Question

**“How do you handle failure of a Worker Agent in your multi-agent architecture?”**

---

# Strong Interview Answer

I treat Worker failure as an **expected distributed-system condition**, not an exceptional situation.

When a Worker fails, the Delegator first determines the type of failure—such as timeout, transient infrastructure error, model failure, invalid response, or business-level failure.

Based on the failure type, we apply a controlled recovery strategy:

**Timeout → Retry → Fallback → Partial Result / Human Intervention → Fail Gracefully**

The workflow state is persisted, so we don't necessarily restart the entire workflow.

For example, if the Vision Worker fails while analyzing a manufacturing defect:

```text
Delegator
    ↓
Vision Worker
    ↓
Failure
    ↓
Classify Failure
    ↓
 ┌──────────────┬──────────────┬──────────────┐
 ↓              ↓              ↓
Retry         Fallback       Non-critical?
 ↓              ↓              ↓
Success       Worker          Continue
                ↓
             Success
```

The important principle is:

> **A failure of one Worker should not automatically become a failure of the entire workflow.**

---

# Functional Flow

```text
                    Delegator
                        ↓
                  Select Worker
                        ↓
                 Execute Worker
                        ↓
                  Worker Result
                        ↓
                    Success?
                   /        \
                 Yes         No
                 ↓            ↓
            Continue     Classify Failure
                              ↓
                  ┌───────────┼───────────┐
                  ↓           ↓           ↓
               Retry       Fallback     Optional
                  ↓           ↓           ↓
               Success     Worker       Skip
                  │           │           │
                  └───────────┼───────────┘
                              ↓
                       Continue Workflow
```

---

# Step 1 — Detect the Failure

I monitor each Worker invocation for:

* Timeout
* Connection failure
* HTTP/service error
* Authentication failure
* Model/API failure
* Invalid response
* Schema validation failure
* Tool failure
* Business-rule failure
* Resource exhaustion

For example:

```text
Vision Worker
     ↓
Request sent
     ↓
No response within 10 seconds
     ↓
Timeout detected
```

The Delegator should not wait indefinitely.

---

# Step 2 — Classify the Failure

Not every failure should be handled with the same strategy.

### Transient Failure

Examples:

```text
Network timeout
Temporary service unavailable
Rate limit
Temporary model endpoint failure
```

Action:

```text
Retry
```

---

### Persistent Failure

Examples:

```text
Worker deployment unavailable
Invalid configuration
Authentication problem
Repeated model failure
```

Action:

```text
Fallback Worker
or
Fail the task
```

---

### Business Failure

Example:

> “Insufficient information to determine the root cause.”

This isn't necessarily a technical failure.

The Worker successfully executed but couldn't produce a reliable answer.

Action:

```text
Return structured business failure
→ Ask for additional information
→ Continue with available evidence
→ Human review
```

---

# Step 3 — Retry

For transient failures, I use controlled retries.

```text
Worker
  ↓
Failure
  ↓
Retry #1
  ↓
Failure
  ↓
Retry #2
  ↓
Failure
  ↓
Fallback
```

I don't retry indefinitely.

Typical controls include:

```text
max_retries
timeout
backoff
retryable_errors
```

For example:

```text
Retry Policy:

Maximum retries = 2
Timeout = 10 seconds
Backoff = exponential
```

The exact values depend on the workload.

---

# Why Exponential Backoff?

Suppose the Worker is temporarily overloaded.

If 1,000 requests immediately retry at the same time, we can make the problem worse.

Instead:

```text
Retry 1 → short delay
Retry 2 → longer delay
Retry 3 → longer delay
```

This reduces the risk of a retry storm.

---

# Step 4 — Fallback Worker

If the primary Worker is unavailable, the Delegator can select a fallback Worker with the same or compatible capability.

Example:

```text
Primary:
Vision Worker A
       ↓
    Failure
       ↓
Fallback:
Vision Worker B
```

The Worker Registry can maintain capability information such as:

```text
Vision Worker A
Capabilities:
    image_analysis
    defect_detection

Vision Worker B
Capabilities:
    image_analysis
    defect_detection
```

The Delegator can therefore select Worker B.

---

# Step 5 — Continue With Partial Results

This is very important for multi-agent systems.

Suppose the Delegator invokes:

```text
Vision Worker
RAG Worker
Analytics Worker
```

and Vision fails.

If Vision is not mandatory:

```text
Vision → FAILED
RAG → SUCCESS
Analytics → SUCCESS
```

The workflow can continue:

```text
                 Delegator
                 /   |    \
                ↓    ↓     ↓
            Vision   RAG  Analytics
              ❌      ✓      ✓
                      \     /
                       ↓   ↓
                   Aggregator
                       ↓
                 Partial Result
```

The final response should explicitly indicate that the Vision analysis was unavailable rather than pretending the result is complete.

---

# Step 6 — Critical vs Non-Critical Worker

I classify Workers based on whether their output is mandatory.

### Critical Worker

If RCA requires defect detection:

```text
Vision Worker
      ↓
Failure
      ↓
Cannot perform reliable RCA
      ↓
Stop / Fallback / Human Review
```

### Non-Critical Worker

If analytics is only supplementary:

```text
Analytics Worker
      ↓
Failure
      ↓
Continue without analytics
```

So the failure policy is **business-aware**, not just technical.

---

# Step 7 — Circuit Breaker

If a Worker repeatedly fails, I don't keep sending traffic to it.

For example:

```text
Vision Worker
     ↓
Failure
     ↓
Failure
     ↓
Failure
     ↓
Circuit OPEN
     ↓
Stop invoking Worker
     ↓
Use fallback
```

The circuit breaker can have states:

```text
CLOSED
   ↓
Failures exceed threshold
   ↓
OPEN
   ↓
Wait
   ↓
HALF-OPEN
   ↓
Test Worker
   ↓
Success → CLOSED
Failure → OPEN
```

This protects the overall system from cascading failures.

---

# Step 8 — Persist Workflow State

Because the workflow state is persisted, we can recover from a Worker failure without losing the entire execution context.

For example:

```text
Coordinator
    ↓
Delegator
    ↓
Vision Worker
    ↓
Checkpoint
    ↓
Failure
    ↓
Retry / Fallback
    ↓
Resume
```

Instead of:

```text
Restart entire workflow
      ↓
Repeat every LLM call
      ↓
Increase cost + latency
```

We resume from the appropriate checkpoint/state.

---

# Step 9 — Observability

Every Worker invocation should be observable.

I would capture:

```text
request_id
correlation_id
task_id
agent_id
worker_id
workflow_id
start_time
end_time
latency
status
error_type
retry_count
model
token_usage
```

For example:

```text
REQ-12345
   ↓
Coordinator
   ↓
Manufacturing Delegator
   ↓
Vision Worker
   ↓
Timeout
   ↓
Retry #1
   ↓
Success
```

This allows the engineering team to trace the failure across the complete agent workflow.

---

# How This Fits With LangGraph

LangGraph manages the workflow execution and state transitions.

Conceptually:

```text
START
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
Success?
 /    \
Yes    No
 ↓      ↓
Next   Retry
       ↓
    Fallback
       ↓
    Continue
```

The graph can explicitly model these conditional paths rather than burying all failure handling inside prompts.

This is important:

> **Failure handling should be implemented as deterministic workflow logic wherever possible, not left entirely to the LLM.**

---

# How A2A Fits

If the Worker is an independently deployed agent, the Delegator may communicate with it using A2A.

```text
Delegator
    │
    │ A2A
    ↓
Vision Agent
    │
    X
 Failure
    ↓
Delegator
    │
    ├── Retry
    │
    ├── Fallback
    │
    └── Partial Result
```

A2A handles the **agent-to-agent interaction**.

The Delegator/orchestration layer handles the **failure policy**.

---

# What About MCP Failures?

Suppose the Worker itself is healthy but the MCP-connected tool fails.

For example:

```text
RCA Worker
    ↓
MCP
    ↓
Manufacturing Database
    X
  Failure
```

The Worker should distinguish:

```text
Worker failure
vs
Tool failure
```

The recovery strategy could be:

```text
Tool Failure
   ↓
Retry Tool
   ↓
Fallback Data Source
   ↓
Continue
```

or:

```text
Tool Failure
   ↓
Cannot obtain required evidence
   ↓
Return insufficient-data result
```

So failure handling exists at multiple layers.

---

# Failure Handling by Layer

| Layer          | Example Failure    | Response                  |
| -------------- | ------------------ | ------------------------- |
| Coordinator    | Routing failure    | Retry / fallback routing  |
| Delegator      | Planning failure   | Re-plan / fallback        |
| Worker         | Agent unavailable  | Retry / fallback Worker   |
| LLM            | Timeout/rate limit | Retry / model fallback    |
| MCP            | Tool unavailable   | Retry / alternate tool    |
| Database       | Query failure      | Retry / alternate source  |
| Network        | Timeout            | Retry with backoff        |
| Business logic | Invalid result     | Validation / human review |

---

# Important: Validate Worker Output

A Worker can be technically successful but still return a bad result.

Therefore, I don't treat:

```text
HTTP 200
```

as equivalent to:

```text
Successful business result
```

I validate:

* Output schema
* Required fields
* Confidence
* Business constraints
* Safety policies
* Evidence/citations where required

For example:

```text
Worker Response
      ↓
Schema Validation
      ↓
Business Validation
      ↓
Confidence Check
      ↓
Accept / Retry / Escalate
```

---

# Architect-Level Answer

> “I design Worker failures as expected distributed-system conditions. When a Worker fails, the Delegator classifies the failure and applies a policy based on whether it's transient, persistent, or business-level. Transient failures use bounded retries with timeout and exponential backoff. Persistent failures can trigger a fallback Worker with the same capability. For non-critical Workers, we can continue with partial results, while critical Worker failures may stop the workflow or trigger human intervention. I also use circuit breakers to prevent repeated calls to unhealthy Workers and persist workflow state so we can resume from the last checkpoint. Every invocation is correlated and traced for observability. The key is that failure handling is deterministic and policy-driven rather than relying on the LLM to decide how to recover.”

---

# 30-Second Interview Answer

> “I treat Worker failure as an expected distributed-system condition. First, I classify the failure. For transient failures, I use bounded retries with timeout and exponential backoff. If the Worker remains unavailable, the Delegator can route to a fallback Worker with the same capability. For non-critical Workers, I allow partial results, while critical failures can stop the workflow or trigger human intervention. I persist workflow state so the system can resume rather than restart the entire workflow, and I use circuit breakers and distributed tracing to prevent cascading failures and support troubleshooting.”

---

# Example Interview Scenario

### Interviewer:

**“Your Vision Worker is down. What happens?”**

### Answer:

> “The Delegator detects the failure through timeout or service-health information. If the error is transient, I retry with bounded exponential backoff. If the Worker remains unavailable, I check the capability registry for a healthy fallback Vision Worker. If no fallback exists, I determine whether image analysis is mandatory for the workflow. If it is mandatory, I stop or escalate the workflow rather than generating an unsupported RCA. If it is optional, I continue with the available RAG and analytics results and clearly mark the response as partial. The workflow state and correlation ID allow us to recover and trace the execution.”

---

# Golden Architecture Principle

> **“Fail locally, recover intelligently, and prevent failure from propagating across the entire agent workflow.”**

### Memory Trick

```text
WORKER FAILURE
      ↓
DETECT
      ↓
CLASSIFY
      ↓
RETRY
      ↓
FALLBACK
      ↓
PARTIAL RESULT / ESCALATE
      ↓
RECOVER
      ↓
TRACE
```

### Remember: **D-C-R-F-P-R-T**

**D**etect
**C**lassify
**R**etry
**F**allback
**P**artial result / Policy
**R**ecover
**T**race
