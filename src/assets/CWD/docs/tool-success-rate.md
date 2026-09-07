# Tool Execution Success Metrics in CWD

**Core principle:**

> **Tool execution success metrics measure whether an agent selected the correct tool, supplied valid arguments, executed the tool successfully, received a valid result, and correctly used that result to complete the intended business objective.**

For CWD, tool success is **more than an HTTP 200 response**.

```text
User Request
     ↓
Agent
     ↓
Tool Selection
     ↓
Argument Validation
     ↓
Authorization
     ↓
MCP / API
     ↓
Enterprise System
     ↓
Tool Result
     ↓
Result Validation
     ↓
Agent Interpretation
     ↓
Business Outcome
```

A tool can technically succeed while the agent still produces the wrong business result.

---

## 1. What Is Tool Execution Success?

A basic metric is:

$$
ToolSuccessRate =
\frac{SuccessfulToolExecutions}
{TotalToolExecutionAttempts}
\times 100
$$

Example:

```text
1,000 tool calls
950 successful
50 failed
```

$$
ToolSuccessRate = 95\%
$$

But enterprise CWD needs a much more granular measurement.

---

# 2. Tool Success Has Multiple Layers

A useful model is:

```text
                 TOOL EXECUTION QUALITY
                          │
       ┌──────────────────┼──────────────────┐
       ▼                  ▼                  ▼
   Selection           Execution           Result
       │                  │                  │
   Correct tool       API success       Valid result
   Correct capability  Timeout          Correct schema
   Correct purpose     Auth failure     Correct data
       │                  │                  │
       └──────────────────┼──────────────────┘
                          ▼
                  Business Outcome
```

Therefore:

> **Tool execution success = selection + authorization + valid execution + valid result + correct interpretation.**

---

# 3. Tool Selection Accuracy

First ask:

> Did the agent select the correct tool?

Suppose an agent needs shipment tracking.

Available tools:

```text
get_tracking_events
get_carrier_status
get_route_constraints
submit_reroute_request
```

The user asks:

```text
"Where is shipment SHIP123?"
```

Expected:

```text
get_tracking_events
```

If the agent chooses:

```text
submit_reroute_request
```

the tool execution may technically work, but the **tool selection was incorrect**.

Metric:

$$
ToolSelectionAccuracy =
\frac{CorrectToolSelections}
{TotalToolSelectionCases}
$$

---

# 4. Tool Invocation Success Rate

Once the correct tool is selected:

```text
Agent
 ↓
Tool
 ↓
Execution
```

measure whether invocation succeeds.

Example:

```text
10,000 invocations
9,700 successful
300 failed
```

$$
SuccessRate = 97\%
$$

Failures may include:

* timeout
* authentication failure
* authorization failure
* validation failure
* dependency failure
* rate limiting
* service unavailable
* malformed request
* business-rule rejection

---

# 5. Argument Accuracy

Selecting the right tool is not enough.

The agent must provide the correct arguments.

Example:

```json id="9r5f2k"
{
  "tool": "get_tracking_events",
  "arguments": {
    "shipment_id": "SHIP123"
  }
}
```

Correct.

Incorrect:

```json id="v1d6z4"
{
  "tool": "get_tracking_events",
  "arguments": {
    "shipment_id": "SHIP132"
  }
}
```

The tool may successfully execute—but retrieve the wrong shipment.

Therefore measure:

$$
ArgumentAccuracy =
\frac{CorrectToolArguments}
{TotalToolCalls}
$$

---

# 6. Argument Validation Success

Before execution:

```text
LLM Arguments
      ↓
Schema Validation
      ↓
Business Validation
      ↓
Authorization
      ↓
Tool Execution
```

Validate:

* required fields
* data types
* allowed values
* ranges
* object identifiers
* business constraints
* tenant
* environment
* permissions

Example:

```json id="0o7j5w"
{
  "shipment_id": "SHIP123",
  "region": "US",
  "include_history": true
}
```

The MCP/tool boundary should not blindly trust LLM-generated arguments.

---

# 7. Authorization Success

A tool call can be:

```text
Technically valid
```

but:

```text
Unauthorized
```

Example:

```text
Agent
 ↓
get_employee_salary
 ↓
Authorization
 ↓
DENIED
```

This is **not a tool execution failure in the same sense as a timeout**.

It is a successful security control.

Therefore separate:

```text
Tool execution failure
```

from:

```text
Authorization rejection
```

Otherwise your success metrics can become misleading.

---

# 8. Tool Result Validity

Suppose:

```text
API returned HTTP 200
```

but response contains:

```json id="3f0g6c"
{
  "status": "success",
  "data": null
}
```

Technically:

```text
API success = TRUE
```

Business/tool result:

```text
usable result = FALSE
```

Therefore measure:

$$
ValidToolResultRate =
\frac{ValidToolResults}
{SuccessfulInvocations}
$$

---

# 9. Schema Validation

Tool output should be validated.

Expected:

```json id="3f3s0y"
{
  "shipment_id": "SHIP123",
  "status": "delayed",
  "location": "Dallas"
}
```

Actual:

```json id="m0d9x8"
{
  "shipment": "SHIP123",
  "state": 12345
}
```

The transport succeeded, but schema validation failed.

So:

```text
Transport Success
        ≠
Business Result Success
```

---

# 10. Tool Result Interpretation Accuracy

Even when the tool returns correct data, the agent can misunderstand it.

Example:

```text
Tool:
shipment_status = delayed
```

Agent response:

```text
"Shipment is on schedule."
```

Tool execution:

```text
SUCCESS
```

Agent interpretation:

```text
FAILURE
```

Therefore tool evaluation should continue beyond the tool boundary.

---

# 11. Business Outcome Success

The strongest measurement is:

> Did the tool call contribute to accomplishing the intended business objective?

Example:

```text
User:
"Why is shipment SHIP123 delayed?"

Agent
 ↓
get_tracking_events
 ↓
SUCCESS
 ↓
get_carrier_status
 ↓
SUCCESS
 ↓
Correct analysis
 ↓
Correct answer
```

This is stronger than merely saying:

```text
2 successful API calls
```

---

# 12. Tool Success Hierarchy

A useful CWD hierarchy:

```text id="3q8f7n"
Level 1
Tool Selected Correctly
        ↓
Level 2
Arguments Correct
        ↓
Level 3
Authorization Allowed
        ↓
Level 4
Invocation Successful
        ↓
Level 5
Result Schema Valid
        ↓
Level 6
Result Semantically Valid
        ↓
Level 7
Agent Interpreted Correctly
        ↓
Level 8
Business Objective Achieved
```

This gives you a much better evaluation framework.

---

# 13. Tool Execution Metrics

| Metric                         | Question                               |
| ------------------------------ | -------------------------------------- |
| Tool selection accuracy        | Did agent choose correct tool?         |
| Argument accuracy              | Were arguments correct?                |
| Invocation success rate        | Did tool execute successfully?         |
| Authorization success          | Was access correctly allowed/denied?   |
| Schema validation rate         | Was result structurally valid?         |
| Result validity                | Was returned data usable?              |
| Result interpretation accuracy | Did agent understand result correctly? |
| Tool latency                   | How long did tool execution take?      |
| Timeout rate                   | How often did tool exceed timeout?     |
| Retry rate                     | How often did tool need retry?         |
| Error rate                     | How often did execution fail?          |
| Idempotency success            | Were retries safe?                     |
| Business success               | Did tool help achieve objective?       |

---

# 14. Tool Execution Error Rate

Basic:

$$
ToolErrorRate =
\frac{FailedExecutions}
{TotalExecutions}
\times100
$$

Example:

```text
20,000 calls
500 failures
```

$$
ErrorRate = 2.5\%
$$

But classify failures.

```text
Tool Errors
│
├── Timeout
├── Authentication
├── Authorization
├── Validation
├── Rate Limit
├── Dependency Failure
├── Network
├── Server Error
└── Business Rejection
```

This makes the metric actionable.

---

# 15. Timeout Rate

$$
TimeoutRate =
\frac{TimedOutCalls}
{TotalCalls}
$$

Example:

```text
10,000 calls
100 timeouts
```

$$
TimeoutRate = 1\%
$$

High timeout rate can indicate:

* slow downstream APIs
* overloaded systems
* insufficient timeout configuration
* network issues
* dependency degradation

---

# 16. Retry Rate

$$
RetryRate =
\frac{CallsRequiringRetry}
{TotalCalls}
$$

Example:

```text
10,000 calls
400 required retry
```

$$
RetryRate=4\%
$$

Track retry count as well:

```text
Average retries/call
P95 retries
Maximum retries
Retry success rate
```

---

# 17. Retry Success Rate

Suppose:

```text
500 calls initially failed
300 succeeded after retry
200 remained failed
```

Then:

$$
RetryRecoveryRate =
\frac{300}{500}
=60\%
$$

This is useful for evaluating whether retry policies actually recover transient failures.

---

# 18. Tool Availability

A tool may be:

```text
REGISTERED
HEALTHY
READY
AVAILABLE
```

or:

```text
DEGRADED
UNAVAILABLE
DISABLED
```

Connect this with the Agent Registry:

```text
Agent Registry
      ↓
Tool/MCP metadata
      ↓
Health
      ↓
Availability
      ↓
Agent selects tool
```

The agent should not repeatedly attempt a known unavailable tool.

---

# 19. MCP Tool Success

In your CWD architecture:

```text id="4h6v5m"
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Tool
  ↓
Enterprise System
```

Measure separately:

```text
MCP connection success
MCP request success
Tool execution success
Backend API success
Result validation success
```

For example:

```text
MCP request         PASS
Tool invocation     PASS
Enterprise API      FAIL
```

The root cause is different from an MCP transport failure.

---

# 20. Tool Success and Latency

You should correlate:

```text
Tool Success
+
Tool Latency
```

Example:

| Tool              | Success | P95 Latency |
| ----------------- | ------: | ----------: |
| Tracking          |   99.2% |      800 ms |
| Carrier status    |   97.5% |       1.8 s |
| Route constraints |   99.8% |      400 ms |

A tool with 99.8% success but 10-second P95 latency may still violate workflow SLAs.

---

# 21. Tool Success and Cost

Tool execution can have cost.

For example:

```text
Agent
 ↓
External API
 ↓
Paid API
```

Track:

```text
Tool calls
Successful calls
Failed calls
Retries
Cost/call
Cost/successful call
```

A repeated failed call can increase both:

```text
Latency
+
Cost
```

---

# 22. Tool Execution Evaluation Using Golden Dataset

Your golden dataset can define expected tool behavior.

Example:

```json id="y6v8x3"
{
  "test_id": "TC-SHIP-001",

  "input": "Where is shipment SHIP123?",

  "expected": {
    "tool": "get_tracking_events",
    "arguments": {
      "shipment_id": "SHIP123"
    }
  },

  "evaluation": {
    "tool_selection": "PASS",
    "argument_accuracy": "PASS",
    "authorization": "PASS",
    "execution": "PASS",
    "result_validation": "PASS"
  }
}
```

---

# 23. Multiple Tool Calls

A complex Worker may execute:

```text
get_tracking_events
        ↓
get_carrier_status
        ↓
get_route_constraints
        ↓
analyze_delay
```

Evaluate each individually:

```text
Tool 1 → PASS
Tool 2 → PASS
Tool 3 → FAIL
Tool 4 → SKIPPED
```

And evaluate the overall task:

```text
Task → PARTIAL
```

This is better than simply marking the entire workflow `FAILED`.

---

# 24. Tool Dependency Chains

Consider:

```text
Tool A
  ↓
Tool B
  ↓
Tool C
```

If A fails:

```text
B cannot execute
C cannot execute
```

These should not automatically be counted as independent tool failures.

You should distinguish:

```text
Root failure
```

from:

```text
Dependency skipped
```

Otherwise your error rate becomes inflated.

---

# 25. Parallel Tool Execution

CWD may execute tools in parallel:

```text
               Worker
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
      Tool A   Tool B   Tool C
       1s       2s       1.5s
        │        │        │
        └────────┼────────┘
                 ▼
              Aggregate
```

Measure:

```text
Individual success
Critical-path latency
Aggregate success
Partial success
```

The overall execution may be:

```text
PARTIAL
```

if A and C succeed but B fails.

---

# 26. Tool Result Quality

Don't only measure whether data exists.

Evaluate:

```text
Correctness
Completeness
Freshness
Schema validity
Business validity
Authorization
Provenance
```

For example:

```json id="2t0r1f"
{
  "status": "success",
  "data_quality": {
    "correct": true,
    "complete": true,
    "fresh": true,
    "authorized": true
  }
}
```

---

# 27. Security Success Metrics

Tool evaluation should include security.

Important metrics:

```text
Unauthorized tool-call attempts
Authorization rejection accuracy
Cross-tenant access attempts
Privilege escalation attempts
Invalid argument rejection
Sensitive-data exposure
Policy violations
```

For security:

> **A rejected unauthorized call is often a successful security outcome.**

Therefore don't define:

```text
"every denied call = failure"
```

---

# 28. Idempotency

Retries create a major risk for write operations.

Example:

```text
submit_reroute_request
```

If the Worker retries:

```text
Attempt 1 → succeeds
Network response lost
Attempt 2 → executes again
```

You may create duplicate business actions.

Therefore measure:

```text
Duplicate execution rate
Idempotency-key success
Duplicate prevention rate
```

For write operations:

```text
task_id / idempotency_key
        ↓
enterprise system
        ↓
deduplicate
```

---

# 29. Tool Execution Success vs Agent Success

These are different.

Example:

```text
Tool call = SUCCESS
Agent outcome = FAILURE
```

because the agent misunderstood the result.

Or:

```text
Tool call = FAILURE
Agent outcome = SUCCESS
```

because the agent correctly used an alternate tool.

Therefore:

```text
Tool Success ≠ Agent Success
```

and:

```text
Agent Success ≠ Workflow Success
```

---

# 30. Tool Fallback

Suppose:

```text
Primary Tool
     ↓
Unavailable
     ↓
Fallback Tool
     ↓
Success
```

Track:

```text
Primary failure
Fallback selection
Fallback success
Final business outcome
```

Example:

```text
Primary API → timeout
Fallback API → success
Business task → success
```

The workflow may be successful even though the first tool failed.

---

# 31. Tool Success Telemetry

A CWD tool execution event could look like:

```json id="7f4w1n"
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "run_id": "RUN-003",
  "step_id": "STEP-006",

  "agent_id": "tracking-worker",

  "mcp_server": "shipping-mcp",
  "tool": "get_tracking_events",

  "selection": {
    "expected_tool": "get_tracking_events",
    "selected_tool": "get_tracking_events",
    "correct": true
  },

  "arguments": {
    "valid": true,
    "correct": true
  },

  "authorization": {
    "allowed": true
  },

  "execution": {
    "status": "success",
    "latency_ms": 820
  },

  "result": {
    "schema_valid": true,
    "business_valid": true
  },

  "retry_count": 0,

  "business_outcome": "success"
}
```

This is much more valuable than:

```text
tool_call = success
```

---

# 32. Tool Execution Scorecard

A useful evaluation table:

| Dimension      | Metric                                  |
| -------------- | --------------------------------------- |
| Selection      | Tool Selection Accuracy                 |
| Arguments      | Argument Accuracy                       |
| Authorization  | Correct Allow/Deny                      |
| Execution      | Invocation Success Rate                 |
| Reliability    | Retry / Timeout Rate                    |
| Result         | Result Validity                         |
| Schema         | Schema Validation Rate                  |
| Interpretation | Result Interpretation Accuracy          |
| Latency        | P50/P95/P99                             |
| Recovery       | Retry/Fallback Success                  |
| Security       | Unauthorized Attempt / Policy Violation |
| Business       | Business Outcome Success                |

---

# 33. Example End-to-End Evaluation

Suppose 1,000 tool-call scenarios:

```text
Correct tool selection      970
Correct arguments           950
Authorized                  960
Execution success           940
Valid results               925
Correct interpretation      915
Business success            900
```

You now have:

```text
Selection accuracy = 97.0%

Argument accuracy = 95.0%

Execution success = 94.0%

Valid result rate = 92.5%

Interpretation accuracy = 91.5%

Business success = 90.0%
```

This tells you **where quality is being lost**.

---

# 34. Tool Execution Evaluation Pipeline

```text id="k7b1e5"
Golden Dataset
      ↓
Agent
      ↓
Tool Selection
      ↓
Evaluate Selection
      ↓
Argument Validation
      ↓
Authorization
      ↓
Tool Execution
      ↓
Result Validation
      ↓
Result Interpretation
      ↓
Business Outcome
      ↓
Metrics
      ↓
Regression Analysis
```

---

# 35. Production Monitoring

In production, monitor:

```text
Tool success rate
Tool error rate
Tool timeout rate
Tool latency
Retry rate
Fallback rate
Authorization rejection
Invalid argument rate
Invalid result rate
Duplicate execution
Business success
```

Break down by:

```text
Tool
MCP server
Agent
Agent version
Environment
Tenant
Region
Model
Prompt version
Workflow
```

---

# 36. Tool Regression Testing

Suppose a new prompt version changes behavior.

Before:

```text
Tool selection accuracy = 97%
```

After:

```text
Tool selection accuracy = 89%
```

Even if final answer quality looks acceptable for a few samples, this should trigger investigation.

Similarly:

```text
Argument accuracy
97% → 90%
```

could indicate a prompt/tool-schema regression.

---

# 37. Tool Evaluation and Agent Consistency

This connects directly with your previous **agent-consistency evaluation**.

Run the same scenario 20 times:

```text
Expected:
get_tracking_events
```

Results:

```text
18 → get_tracking_events
2  → get_carrier_status
```

Then:

$$
ToolSelectionConsistency =
\frac{18}{20}
=90\%
$$

But perhaps both tools can answer the question.

Then evaluate **semantic equivalence**, rather than requiring identical tool selection.

This is important for LLM agents.

---

# 38. Tool Evaluation and Latency

You also just covered agent latency.

Tool latency contributes to Worker latency:

$$
WorkerLatency =
Validation +
RAG +
ToolLatency +
LLM +
BusinessLogic +
Validation
$$

Therefore:

```text
Tool execution metrics
        ↓
Agent latency metrics
        ↓
Workflow latency
```

---

# 39. Tool Evaluation and Cost

Similarly:

```text
Tool calls
   ↓
External/API cost
   ↓
Workflow cost
```

And:

```text
Failed tool
   ↓
Retry
   ↓
Additional LLM reasoning
   ↓
Additional tokens
   ↓
Higher cost
```

So tool reliability has downstream cost implications.

---

# 40. Recommended CWD Tool-Success Formula

A practical conceptual formula is:

$$
ToolExecutionSuccess =
CorrectSelection
\land CorrectArguments
\land AuthorizationAllowed
\land InvocationSuccessful
\land ValidResult
\land CorrectInterpretation
$$

For overall business success:

$$
ToolBusinessSuccess =
ToolExecutionSuccess
\land BusinessObjectiveAchieved
$$

---

# 41. Final Architecture View

```text id="3k7w2q"
                    CWD TOOL EVALUATION
                           │
                           ▼
                    Tool Selection
                           │
                           ▼
                    Argument Accuracy
                           │
                           ▼
                      Authorization
                           │
                           ▼
                       MCP/API
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                 Success        Failure
                    │             │
                    ▼             ▼
              Result Valid    Retry/Fallback
                    │             │
                    ▼             ▼
              Interpretation   Recovery
                    │             │
                    └──────┬──────┘
                           ▼
                   Business Outcome
                           │
                           ▼
                    CWD Evaluation
```

---

# 42. Final Definition

> **Tool execution success metrics in CWD are the systematic measurements used to determine whether an agent selected the appropriate tool, generated correct arguments, passed authorization and policy checks, successfully executed the tool through MCP or another approved interface, received a valid and usable result, correctly interpreted that result, and ultimately contributed to the intended business outcome. These metrics include tool-selection accuracy, argument accuracy, invocation success, authorization outcomes, schema and result validity, timeout/error/retry rates, fallback recovery, latency, duplicate prevention, security violations, and business-task success.**

### Interview-ready answer

> **“For CWD, I don't define tool success simply as an API returning HTTP 200. I evaluate the complete tool lifecycle: correct tool selection, correct arguments, authorization, successful invocation, valid result, correct result interpretation, and business outcome. At the platform level, I track selection accuracy, argument accuracy, success and error rates, timeout and retry rates, fallback recovery, latency, schema validity, and security violations. For MCP-based Workers, I also separate MCP transport failures from backend tool failures. All tool events are correlated with workflow, task, run, step, agent, and tool identifiers, allowing us to perform production monitoring and regression evaluation.”**
