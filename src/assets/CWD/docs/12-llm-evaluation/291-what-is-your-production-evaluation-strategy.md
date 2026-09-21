## What is your production evaluation strategy?

**My production evaluation strategy is continuous evaluation of real CWD traffic to make sure the system remains accurate, reliable, safe, fast, and cost-effective after deployment.**

In simple terms:

> **“Offline testing tells me whether the system is ready; production evaluation tells me whether it continues to work correctly with real users and real data.”**

### CWD production evaluation flow

```text id="r7m3kx"
Real User Request
       ↓
      CWD
       ↓
Coordinator
       ↓
Delegators
       ↓
Workers
       ↓
RAG / MCP / Enterprise Systems
       ↓
Final Answer
       ↓
Telemetry + Traces
       ↓
Production Evaluation
       ↓
Quality Dashboard
       ↓
Alerts / Investigation / Improvement
```

---

# 1. Capture the complete production trajectory

I don't capture only the final answer.

For every request, I track:

```text id="p4n8vq"
correlation_id
task_id
user/request metadata
intent
selected Delegators
selected Workers
MCP tools
tool parameters
retrieved documents
LLM/model
latency
tokens
cost
errors/retries
final response
```

For example:

```text id="x6k2md"
C789
 ↓
Coordinator
 ↓ A2A
IT Delegator
 ↓
Incident Worker
 ↓ MCP
get_incidents(C12345)
 ↓
ServiceNow
 ↓
Final Answer
```

This allows me to evaluate the **entire trajectory**.

---

# 2. Monitor production quality

I continuously measure:

### Answer quality

* Factual accuracy
* Faithfulness
* Groundedness
* Answer relevance
* Completeness
* Citation correctness
* Hallucination/unsupported claim rate
* Abstention accuracy

### Agent behavior

* Intent accuracy
* Delegator routing accuracy
* Worker selection accuracy
* MCP tool-selection accuracy
* Invalid tool calls
* Loop rate
* Task completion rate

### RAG

* Retrieval relevance
* Context precision
* Context recall
* No-result rate
* Retrieval latency
* Data freshness

### Reliability

* Failure rate
* Timeout rate
* Retry rate
* DLQ rate
* Recovery/resume success
* Partial completion

### Performance/cost

* p50/p95/p99 latency
* Tokens/request
* Cost/request
* Cost by agent/use case

### Security

* Unauthorized requests
* ACL violations
* Prompt injection attempts
* Sensitive-data leakage
* Unsafe tool calls

---

# 3. Use sampled production conversations for deeper evaluation

I don't necessarily run expensive LLM evaluation on **every request**.

Instead:

```text id="q5v9cs"
Production Traffic
       ↓
Sampling
       ↓
Representative Requests
       ↓
Deep Evaluation
```

For example, I can sample:

* Random traffic
* New use cases
* Failed requests
* Low-confidence responses
* High-cost requests
* High-latency requests
* User-negative-feedback cases
* Security-sensitive cases

This keeps evaluation cost manageable.

---

# 4. Use automated evaluation

For sampled production responses, I can automatically evaluate:

```text id="k8m4pz"
Question
   +
Retrieved Evidence
   +
Final Answer
       ↓
Evaluator
       ↓
Groundedness
Faithfulness
Relevance
Completeness
Citation correctness
```

For critical enterprise facts, I prefer deterministic validation against the **system of record**.

For example:

```text id="d3r7xq"
ServiceNow:
INC1001 = Open

CWD answer:
INC1001 = Open

→ Correct ✅
```

---

# 5. Track user feedback

Production evaluation should also include the user's experience.

I can capture:

* 👍 / 👎 feedback
* Rephrase/follow-up rate
* Escalation rate
* Human handoff
* Task completion
* User corrections
* Support tickets

For example:

```text id="s2w6kp"
High negative feedback
       ↓
Find trace
       ↓
Find root cause
       ↓
Add scenario to golden dataset
       ↓
Fix
       ↓
Regression test
```

This creates a feedback loop.

---

# 6. Detect production drift

Production traffic changes over time.

For example:

```text id="v8q3mn"
Initial traffic:
Customer Briefing

Later:
Incident investigation
Manufacturing failures
New document formats
New customer types
```

I monitor for:

* Query distribution changes
* Retrieval-quality degradation
* Data freshness problems
* Model behavior changes
* Token/cost increases
* New failure patterns
* New prompt-injection patterns

When I detect meaningful drift, I add representative cases to the evaluation dataset and retest the system.

---

# 7. Compare production against baseline

I maintain a baseline from the validated production version.

Example:

```text id="h4m8qs"
                    Baseline    Current
Groundedness          96%         94%  ⚠️
Task completion       97%         95%
Routing accuracy      98%         97%
Hallucination rate    1.2%        2.1% ⚠️
p95 latency           4.5s        6.2s ⚠️
Cost/request          $0.02       $0.025
```

This helps identify gradual degradation instead of waiting for users to report problems.

---

# 8. Use alerts and investigation

Suppose hallucination rate suddenly increases.

```text id="n6p2fw"
Metric crosses threshold
        ↓
Alert
        ↓
Find affected use cases
        ↓
Trace affected requests
        ↓
Check:
  RAG?
  Model?
  Prompt?
  MCP?
  Data freshness?
  Routing?
        ↓
Root cause
        ↓
Fix
        ↓
Regression test
        ↓
Deploy
```

---

# 9. Feed production failures back into offline evaluation

This is one of the most important parts of my strategy.

```text id="m9v4xc"
Production
   ↓
Failure / feedback
   ↓
Root cause
   ↓
Golden test case
   ↓
Offline regression suite
   ↓
CI/CD quality gate
   ↓
Production
```

So my evaluation system becomes stronger over time.

---

## Offline vs Production Evaluation

| Offline evaluation      | Production evaluation            |
| ----------------------- | -------------------------------- |
| Golden dataset          | Real traffic                     |
| Before deployment       | After deployment                 |
| Controlled environment  | Real environment                 |
| Regression testing      | Continuous monitoring/evaluation |
| Known scenarios         | New/unexpected scenarios         |
| Model/prompt comparison | Drift and degradation detection  |

The two work together:

```text id="c3k7sa"
Offline Evaluation
       ↓
Production Deployment
       ↓
Online Evaluation
       ↓
Production Failures
       ↓
Golden Dataset
       ↓
Offline Regression
       ↓
Next Deployment
```

---

## Interview-ready answer

> **“My production evaluation strategy is continuous evaluation using real CWD traffic and production telemetry. I capture the complete agent trajectory using correlation IDs, including Coordinator routing, Delegators, Workers, MCP calls, RAG retrieval, LLM calls, latency, tokens, cost, errors, and the final response. I continuously monitor quality metrics such as groundedness, factual accuracy, hallucination rate, routing and tool-selection accuracy, task completion, latency, cost, reliability, and security. For deeper evaluation, I sample representative and high-risk production requests and use automated evaluators, deterministic source-of-truth validation, and user feedback. I compare metrics against a production baseline, alert on degradation, investigate traces, and convert production failures into new golden regression tests. This creates a continuous loop from production → evaluation → improvement → regression testing → production.”**

### Easy memory

**Real traffic → Trace → Evaluate → Detect drift → Fix → Add regression test → Improve.**
