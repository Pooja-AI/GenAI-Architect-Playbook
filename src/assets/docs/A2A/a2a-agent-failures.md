## How do you handle agent failures?

### Strong Interview Answer

> **“I handle agent failures using a combination of retries, timeouts, fallbacks, state management, error classification, and observability. In a multi-agent architecture, I don't allow one failed worker to bring down the entire workflow. The coordinator detects the failure, determines whether the error is transient or permanent, and either retries, routes the task to a fallback agent, or gracefully returns a partial result.”**

### In my CWD Multi-Agent Architecture

I would handle failures at **four levels**:

```text
User Request
     ↓
Coordinator Agent
     ↓
Delegator Agent
     ↓
Worker Agent
     ↓
Tool / LLM / API
```

If a worker fails:

```text
Worker Agent
     │
     ├── Success → Return result
     │
     └── Failure
          ↓
     Classify Error
          │
     ├── Transient?
     │      ↓
     │   Retry with backoff
     │
     ├── Agent unavailable?
     │      ↓
     │   Fallback Agent
     │
     └── Permanent?
            ↓
       Graceful failure
            ↓
       Coordinator
```

### 1. Retry transient failures

For temporary problems such as:

* LLM timeout
* Network failure
* Rate limit
* Temporary API unavailable

I use **bounded retries with exponential backoff**.

```text
Attempt 1 → wait 1 sec
Attempt 2 → wait 2 sec
Attempt 3 → wait 4 sec
             ↓
          Still failed
             ↓
         Fallback
```

I avoid unlimited retries because they can create cascading failures and unnecessary cost.

---

### 2. Timeout handling

Every agent and external tool call should have a timeout.

For example:

```text
Research Agent
     ↓
LLM/API call
     ↓
30-second timeout
     ↓
Failure
```

The coordinator can then decide whether to retry, use another agent, or continue with partial information.

---

### 3. Fallback agents

For critical capabilities, I can define a fallback.

```text
Primary:
Knowledge Retrieval Agent
        ↓ failure
Fallback:
Alternative Retrieval Agent
        ↓ failure
Coordinator
```

This is particularly useful when agents depend on external services.

---

### 4. Checkpointing and state recovery

In a LangGraph-based architecture, I maintain workflow state/checkpoints.

For example:

```text
Coordinator
    ↓
Delegator A ✓
    ↓
Worker A ✓
    ↓
Worker B ✗
```

I don't restart the entire workflow.

Instead:

```text
Restore checkpoint
       ↓
Retry Worker B
       ↓
Continue workflow
```

This reduces both execution time and cost.

---

### 5. Graceful degradation

Not every failure should terminate the entire request.

For example:

```text
Customer Request
       ↓
 ┌─────┼─────┐
 ↓     ↓     ↓
Agent A Agent B Agent C
 ✓       ✗      ✓
       ↓
   Partial result
       ↓
 Coordinator
       ↓
Final response
```

If Agent B provides non-critical information, I can continue with A and C and clearly indicate that some information could not be retrieved.

---

### 6. Circuit breaker

If an agent or downstream service repeatedly fails, I temporarily stop sending requests to it.

```text
Agent failures
     ↓
Threshold reached
     ↓
Circuit OPEN
     ↓
Stop requests
     ↓
Fallback Agent
     ↓
After recovery period
     ↓
Test request
     ↓
Circuit CLOSED
```

This prevents cascading failures across the multi-agent system.

---

### 7. Error classification

I don't treat every error the same way.

| Error                  | Action           |
| ---------------------- | ---------------- |
| Timeout                | Retry            |
| Rate limit             | Backoff + retry  |
| Network error          | Retry            |
| Agent unavailable      | Fallback         |
| Invalid input          | Don't retry      |
| Authentication failure | Escalate         |
| Tool/schema error      | Repair/re-route  |
| Repeated failure       | Circuit breaker  |
| Non-critical failure   | Partial response |

---

### 8. Observability

Every agent execution should generate telemetry such as:

```text
trace_id
agent_id
task_id
start_time
end_time
latency
status
retry_count
error_type
token_usage
model
tool_used
```

I would use tools such as **Langfuse / OpenTelemetry / centralized logging** to identify where the failure occurred.

---

## Enterprise-level answer

> **“At the enterprise level, I treat agent failure as an expected condition rather than an exceptional condition. I use timeouts, bounded retries with exponential backoff, error classification, circuit breakers, fallback agents, checkpointing, and graceful degradation. The coordinator maintains the workflow state and decides whether to retry, re-route, or terminate a failed task. I also use distributed tracing and metrics to monitor agent health, latency, failure rates, and retry patterns. This gives me a resilient multi-agent system without allowing a single agent failure to cascade through the entire workflow.”**

### One important interview point

If they ask **“What happens if the coordinator itself fails?”**, say:

> **“The coordinator is a critical component, so I make it stateless where possible, persist workflow state externally, and use checkpointing and service-level redundancy. If the coordinator instance fails, another instance can recover the workflow from the persisted state rather than starting from scratch.”**
