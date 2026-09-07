# Regression Testing for Agents and Prompts in CWD

**Core principle:**

> **Regression testing ensures that a change to an agent, prompt, model, tool, RAG configuration, or workflow does not unintentionally degrade behavior that previously worked correctly.**

In a CWD platform, regression testing is especially important because an apparently small change to a prompt or model can affect:

```text
Prompt
  ↓
Agent reasoning
  ↓
Tool selection
  ↓
RAG retrieval
  ↓
Delegation
  ↓
Workflow path
  ↓
Final answer
```

So regression testing must validate the **complete behavior**, not just whether the new prompt produces a good answer for one example.

---

## 1. What Is Regression Testing?

Suppose the production version is:

```text
Agent v1
Prompt v2.1
Model v4
RAG Index v10
```

You change the prompt:

```text
Prompt v2.2
```

You now run the same test cases against both versions.

```text
                Golden Dataset
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Current Version     New Version
          v2.1                v2.2
             │                 │
             ▼                 ▼
         Results A          Results B
             │                 │
             └────────┬────────┘
                      ▼
                  Compare
                      │
             ┌────────┼────────┐
             ▼        ▼        ▼
           Quality  Latency   Cost
```

The question is:

> **Did the new version improve the intended behavior without breaking existing behavior?**

---

# 2. Why Agent Regression Testing Is Harder

Traditional software often behaves deterministically:

```text
Input → Code → Output
```

Agentic AI is more complex:

```text
Input
 ↓
Prompt
 ↓
Model
 ↓
Reasoning
 ↓
Memory
 ↓
RAG
 ↓
Tool selection
 ↓
Tool execution
 ↓
Delegation
 ↓
Workflow
 ↓
Output
```

A change in one component can affect several others.

For example:

```text
Prompt change
    ↓
Different reasoning
    ↓
Different tool
    ↓
Different tool arguments
    ↓
Different data
    ↓
Different answer
```

Therefore:

> **Agent regression testing is behavior regression testing across the entire execution path.**

---

# 3. Prompt Regression vs Agent Regression

These are related but different.

### Prompt regression

Tests whether a **prompt change** affects expected behavior.

```text
Prompt v1
    vs
Prompt v2
```

### Agent regression

Tests whether a complete **agent change** affects expected behavior.

```text
Agent v1
    vs
Agent v2
```

Agent changes can include:

* prompt
* model
* tools
* MCP configuration
* RAG
* memory
* workflow
* policies
* routing
* business logic

---

# 4. What Can Cause Regression?

A CWD regression can be caused by:

```text
Agent change
Prompt change
Model change
Model configuration
Tool change
MCP change
RAG index change
Embedding model change
Chunking change
Memory change
Workflow change
LangGraph graph change
Agent Registry change
Policy change
Context construction change
```

Therefore the regression framework should record the complete execution configuration.

---

# 5. Golden Dataset Is the Foundation

Your previously defined **golden dataset** is the core of regression testing.

Example:

```json id="5l8q0x"
{
  "test_id": "TC-SHIP-001",
  "input": "Why is shipment SHIP123 delayed?",

  "expected": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ],
    "expected_tools": [
      "get_tracking_events",
      "get_carrier_status"
    ],
    "business_outcome": "carrier_capacity"
  }
}
```

The same test case is executed against multiple versions.

---

# 6. Baseline vs Candidate

Regression testing requires a baseline.

```text
Baseline
Agent v1
Prompt v2.1
Model v4
```

Candidate:

```text
Candidate
Agent v1
Prompt v2.2
Model v4
```

Then:

```text
Golden Dataset
      │
 ┌────┴────┐
 ▼         ▼
Baseline Candidate
 │         │
 ▼         ▼
Results   Results
 └────┬────┘
      ▼
   Compare
```

---

# 7. What Should Be Compared?

Don't compare only final text.

Compare:

```text
Intent
Domain
Planning
Agent selection
Delegation
Tool selection
Tool arguments
RAG retrieval
Security decisions
Workflow path
Intermediate results
Final answer
Latency
Tokens
Cost
Errors
Retries
Business outcome
```

This provides much stronger regression coverage.

---

# 8. Agent Regression Dimensions

A useful matrix:

| Dimension      | Regression Question               |
| -------------- | --------------------------------- |
| Intent         | Did intent classification change? |
| Domain         | Did domain detection change?      |
| Planning       | Did the plan change unexpectedly? |
| Routing        | Did selected agent change?        |
| Delegation     | Did task decomposition change?    |
| Tool selection | Did selected tool change?         |
| Arguments      | Did tool arguments change?        |
| RAG            | Did retrieved evidence change?    |
| Grounding      | Is answer still supported?        |
| Security       | Did access behavior change?       |
| Workflow       | Did execution path change?        |
| Accuracy       | Is result still correct?          |
| Consistency    | Is behavior still stable?         |
| Reliability    | Did failures increase?            |
| Latency        | Did execution become slower?      |
| Tokens         | Did token consumption increase?   |
| Cost           | Did cost increase?                |

---

# 9. Prompt Regression

Consider a prompt:

```text
Prompt v2.1
```

You modify it to:

```text
Prompt v2.2
```

The change might appear harmless:

```text
"Provide a concise explanation."
```

becomes:

```text
"Provide a concise explanation with supporting evidence."
```

But it may cause:

```text
More RAG retrieval
      ↓
More context
      ↓
More tokens
      ↓
Higher latency
      ↓
Higher cost
```

So prompt regression must test more than answer quality.

---

# 10. Prompt Regression Test

Example:

```json id="s5m9p2"
{
  "test_id": "TC-001",
  "prompt_id": "shipment-analysis",
  "baseline_version": "2.1.0",
  "candidate_version": "2.2.0",

  "expected": {
    "intent": "root_cause_analysis",
    "tool": "get_tracking_events",
    "grounded": true,
    "max_tokens": 6000,
    "max_latency_ms": 5000
  }
}
```

Then:

```text
Baseline:
Accuracy      = 94%
Tokens        = 4,800
Latency       = 3.2 sec

Candidate:
Accuracy      = 95%
Tokens        = 7,900
Latency       = 5.8 sec
```

The candidate improved accuracy but violated the latency/token budget.

That is a **regression in operational behavior** even though answer accuracy improved.

---

# 11. Exact Assertions

Some agent behaviors should be tested deterministically.

Examples:

```text
Expected intent = shipment_tracking
Expected domain = logistics
Expected tool = get_tracking_events
Expected schema = valid
Expected authorization = allowed
Expected tenant = tenant-a
```

Use:

```text
PASS / FAIL
```

for these.

---

# 12. Semantic Assertions

Natural-language responses should not usually require exact string matching.

Baseline:

```text
"The shipment is delayed because the carrier has insufficient capacity."
```

Candidate:

```text
"The carrier's capacity constraints caused the shipment delay."
```

Different wording.

Same meaning.

Therefore use semantic/rubric evaluation for:

* correctness
* relevance
* completeness
* groundedness
* reasoning outcome
* business conclusion

---

# 13. Structured Output Assertions

For agent decisions, structured output is extremely useful.

Example:

```json id="oyp4me"
{
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ]
}
```

Regression testing can compare fields directly.

This is much more reliable than parsing free-form reasoning.

---

# 14. Tool Regression

Suppose baseline:

```text id="w6v2ap"
Question
 ↓
get_tracking_events
```

Candidate:

```text id="0u2j3w"
Question
 ↓
get_carrier_status
```

The candidate may still produce an answer.

But if the golden test expects tracking events, this is a routing/tool-selection regression.

Track:

```text
Tool selection accuracy
Argument accuracy
Tool success
Result validity
Business outcome
```

---

# 15. RAG Regression

RAG changes can cause subtle regressions.

For example:

```text
Embedding model
Chunking
Top-K
Index
Metadata filtering
Reranking
```

can all change retrieval.

Compare:

```text
Baseline
Top-5 evidence
      vs
Candidate
Top-5 evidence
```

Metrics:

* Recall@K
* Precision@K
* MRR
* NDCG
* context relevance
* context precision
* context recall
* citation accuracy
* groundedness

---

# 16. Security Regression

This is a **hard regression gate**.

Example baseline:

```text
User A
 ↓
Document X
 ↓
AUTHORIZED
```

After a change:

```text
User A
 ↓
Document Y
 ↓
UNAUTHORIZED
```

If the model now sees Document Y:

> **Release must fail regardless of accuracy or cost.**

Security regression tests should include:

```text
Unauthorized document
Unauthorized tool
Cross-tenant data
Privilege escalation
Sensitive data
Prompt injection
Tool misuse
Policy bypass
```

---

# 17. Workflow Regression

Suppose baseline workflow:

```text
Coordinator
 ↓
Shipping Delegator
 ↓
Tracking Worker
 ↓
Carrier Worker
 ↓
Aggregate
```

Candidate unexpectedly does:

```text
Coordinator
 ↓
Shipping Delegator
 ↓
Tracking Worker
 ↓
Tracking Worker
 ↓
Final Response
```

The final answer may look correct.

But workflow behavior changed.

This could introduce:

* unnecessary latency
* additional cost
* duplicate execution
* missing evidence
* reliability problems

Therefore workflow path should be part of regression testing.

---

# 18. Agent Consistency Regression

Connect this with the previous topic.

Suppose baseline:

```text
Tool selection consistency = 98%
```

Candidate:

```text
Tool selection consistency = 88%
```

Even if average accuracy is unchanged, the new version may be less predictable.

Therefore track:

```text
Accuracy
+
Consistency
```

---

# 19. Latency Regression

Suppose:

```text
Baseline P95 = 4.0 sec
Candidate P95 = 6.2 sec
```

If SLA:

```text
P95 ≤ 5 sec
```

then:

```text
REGRESSION
```

even if accuracy improved.

---

# 20. Token Regression

Example:

```text
Baseline:
P95 tokens = 8K

Candidate:
P95 tokens = 15K
```

Potential causes:

```text
Larger prompt
More RAG context
More memory
More tool output
More LLM calls
Longer response
More retries
```

Token regression can become cost and latency regression.

---

# 21. Cost Regression

Example:

```text
Baseline:
$0.25 / successful workflow

Candidate:
$0.41 / successful workflow
```

If quality improvement is negligible:

```text
Cost Regression
```

The release process should require justification or optimization.

---

# 22. Reliability Regression

Track:

```text
Success rate
Failure rate
Timeout rate
Retry rate
Recovery rate
Tool failures
Workflow failures
```

Example:

```text
Baseline:
Success = 98.5%

Candidate:
Success = 96.8%
```

This should trigger investigation.

---

# 23. Regression Categories

A strong test suite should include:

```text
Regression Tests
│
├── Functional
├── Quality
├── Tool
├── RAG
├── Security
├── Safety
├── Workflow
├── Consistency
├── Reliability
├── Latency
├── Token
├── Cost
└── Business Outcome
```

---

# 24. Test Case Categories

Your golden dataset should contain:

### Normal

```text
Expected business request
```

### Edge

```text
Unusual but valid request
```

### Ambiguous

```text
Request requiring clarification
```

### Security

```text
Unauthorized access
```

### Tool failure

```text
API unavailable
```

### RAG failure

```text
Evidence unavailable
```

### Multi-agent

```text
Multiple Delegators/Workers
```

### Long-running

```text
Async task
```

### HITL

```text
Human approval required
```

### Adversarial

```text
Prompt injection
Tool manipulation
Policy bypass
```

---

# 25. Regression Test Matrix

A useful enterprise matrix:

| Test           | Baseline | Candidate | Regression? |
| -------------- | -------- | --------- | ----------- |
| Intent         | PASS     | PASS      | No          |
| Routing        | PASS     | PASS      | No          |
| Tool selection | PASS     | FAIL      | **Yes**     |
| RAG            | PASS     | PASS      | No          |
| Security       | PASS     | PASS      | No          |
| Accuracy       | 94%      | 95%       | No          |
| P95 latency    | 4.0s     | 5.8s      | **Yes**     |
| P95 tokens     | 8K       | 14K       | **Yes**     |
| Cost/workflow  | $0.25    | $0.40     | **Yes**     |

This gives a much more complete release picture.

---

# 26. Regression Gates

A production release should not be based on one composite score alone.

Use mandatory gates:

```text
Security ───────── PASS
Safety ─────────── PASS
Authorization ──── PASS
Schema ─────────── PASS
Compliance ─────── PASS
```

Then thresholds:

```text
Accuracy ≥ target
Reliability ≥ target
P95 latency ≤ SLA
Token usage ≤ budget
Cost/workflow ≤ budget
```

Conceptually:

$$
Release =
SecurityPass
\land SafetyPass
\land QualityPass
\land ReliabilityPass
\land PerformancePass
\land CostPass
$$

---

# 27. Regression Pipeline

```text
Developer Change
      ↓
Prompt / Agent / Model Change
      ↓
Version Artifact
      ↓
Run Unit Tests
      ↓
Run Golden Dataset
      ↓
Run Agent Tests
      ↓
Run Workflow Tests
      ↓
Run Security/Safety Tests
      ↓
Compare Baseline
      ↓
Evaluate
      ↓
Release Gates
      │
 ┌────┴────┐
 ▼         ▼
PASS      FAIL
 │          │
 ▼          ▼
Canary    Reject
 │
 ▼
Production
 │
 ▼
Monitor
```

---

# 28. Version Everything

For reproducible regression testing, record:

```text
Agent version
Prompt ID
Prompt version
Model
Model version
Model parameters
Workflow version
LangGraph graph version
RAG index version
Embedding model version
Tool version
MCP server version
Policy version
Evaluation dataset version
```

For example:

```json id="r7m5k1"
{
  "agent_version": "3.4.0",
  "prompt_id": "shipment-analysis",
  "prompt_version": "2.2.0",
  "model": "approved-model",
  "model_version": "v4",
  "workflow_version": "5.1.0",
  "rag_index_version": "2026-09-01",
  "evaluation_dataset": "golden-v12"
}
```

This is essential for debugging regressions.

---

# 29. Regression Result Record

A useful result:

```json id="k6x1y9"
{
  "test_id": "TC-SHIP-001",

  "baseline": {
    "accuracy": 0.94,
    "latency_ms": 3200,
    "tokens": 4800,
    "cost": 0.25
  },

  "candidate": {
    "accuracy": 0.95,
    "latency_ms": 5800,
    "tokens": 7900,
    "cost": 0.40
  },

  "comparison": {
    "accuracy_delta": 0.01,
    "latency_delta_ms": 2600,
    "token_delta": 3100,
    "cost_delta": 0.15
  },

  "release": {
    "status": "FAIL",
    "reason": [
      "latency_sla_exceeded",
      "cost_budget_exceeded"
    ]
  }
}
```

---

# 30. Regression Delta

For quantitative metrics:

$$
\Delta Metric =
Candidate - Baseline
$$

For example:

$$
\Delta Accuracy = 95\%-94\%=+1\%
$$

$$
\Delta Latency = 5.8-3.2=+2.6s
$$

$$
\Delta Cost = \$0.40-\$0.25=\$0.15
$$

The direction matters by metric.

For accuracy:

```text
Higher = generally better
```

For latency/cost:

```text
Lower = generally better
```

---

# 31. Regression Severity

Not every change is equally serious.

A useful classification:

```text
CRITICAL
Security / authorization / cross-tenant violation

HIGH
Business correctness
Tool misuse
Major workflow failure

MEDIUM
Latency SLA
Reliability degradation
RAG quality degradation

LOW
Minor token increase
Minor wording variation
Non-critical formatting
```

Security and compliance failures should normally be release blockers.

---

# 32. Prompt Regression in CI/CD

A production pattern:

```text
Git Commit
   ↓
Prompt Version
   ↓
CI Pipeline
   ↓
Golden Dataset
   ↓
Evaluation
   ↓
Regression Comparison
   ↓
Security Tests
   ↓
Release Gate
```

Example:

```text
Prompt v2.3
      ↓
5,000 golden cases
      ↓
4,850 PASS
150 FAIL
      ↓
Compare v2.2
      ↓
Regression detected
```

---

# 33. Canary Testing

Even after offline regression tests pass:

```text
Deploy Candidate
       ↓
5% production traffic
       ↓
Monitor
       ↓
Compare against baseline
       ↓
25%
       ↓
50%
       ↓
100%
```

Monitor:

```text
Quality
Errors
Latency
Tokens
Cost
Tool failures
Security events
Business outcomes
```

If regression appears:

```text
Rollback
```

---

# 34. Production Regression

Not every regression can be predicted offline.

Suppose users encounter:

```text
Previously unseen request
```

and the agent fails.

Capture it:

```text
Production Failure
      ↓
Analyze
      ↓
Remove sensitive information
      ↓
Create Golden Test Case
      ↓
Add to Regression Dataset
      ↓
Fix
      ↓
Re-run
```

This creates a continuously improving test suite.

---

# 35. Regression Testing With Prompt Registry

Your Prompt Registry becomes central:

```text
Prompt Registry
      │
      ├── Prompt v1
      ├── Prompt v2
      └── Prompt v3
             │
             ▼
       Evaluation Engine
             │
       ┌─────┴─────┐
       ▼           ▼
   Baseline     Candidate
       │           │
       └─────┬─────┘
             ▼
         Comparison
             ↓
         Release Gate
```

Only an approved prompt version should move toward production.

---

# 36. Regression Testing With LangGraph

LangGraph execution provides a useful workflow boundary.

You can compare:

```text
Baseline Graph
      vs
Candidate Graph
```

at:

```text
Node path
Node outputs
Conditional routing
Parallel execution
Retries
Checkpoints
Human approval
Final result
```

Example:

```text
Baseline:
Intent → Auth → Retrieval → Worker → Aggregate

Candidate:
Intent → Auth → Retrieval → Worker → Reviewer → Aggregate
```

The additional Reviewer may improve quality but also increase:

```text
Latency
Tokens
Cost
```

Regression testing exposes this tradeoff.

---

# 37. Regression Testing in CWD

The complete architecture:

```text
                  CWD
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
  Coordinator  Delegators   Workers
        │          │          │
        └──────────┼──────────┘
                   ▼
              Test Harness
                   │
          ┌────────┼────────┐
          ▼        ▼        ▼
       Golden   Baseline  Candidate
       Dataset    Run       Run
          │        │         │
          └────────┼─────────┘
                   ▼
             Evaluation Engine
                   │
       ┌───────────┼────────────┐
       ▼           ▼            ▼
     Quality    Performance    Cost
       │           │            │
       └───────────┼────────────┘
                   ▼
             Release Gates
                   │
             ┌─────┴─────┐
             ▼           ▼
           PASS         FAIL
             │           │
          Canary       Reject
```

---

# 38. What Should Never Be Ignored?

### Security regression

```text
Unauthorized access
```

must be a hard failure.

### Tool regression

```text
Wrong tool
Wrong arguments
```

can cause real business actions.

### RAG regression

```text
Correct answer from unauthorized evidence
```

is still a failure.

### Workflow regression

```text
Correct final answer
```

doesn't necessarily mean the workflow is healthy.

### Cost regression

```text
Same quality
2× cost
```

should trigger optimization.

### Latency regression

```text
Correct answer
but SLA violation
```

is still a production failure.

---

# 39. Key Relationship With Your Previous Evaluation Topics

You have now covered:

```text
Accuracy
   ↓
Consistency
   ↓
Latency
   ↓
Token Usage
   ↓
Cost
   ↓
Tool Execution Success
```

Regression testing ties them together.

```text
                 REGRESSION TESTING
                        │
       ┌────────────────┼────────────────┐
       ▼                ▼                ▼
    Quality        Reliability       Performance
       │                │                │
 Accuracy          Success Rate       Latency
 Consistency       Retry Rate         Tokens
 Groundedness      Recovery           Cost
       │                │                │
       └────────────────┼────────────────┘
                        ▼
                  Business Outcome
```

The key question becomes:

> **Did the new version improve the intended metric without causing unacceptable degradation elsewhere?**

---

# 40. Final Regression Formula

A useful conceptual model is:

$$
Regression =
Compare(Candidate, Baseline, GoldenDataset)
$$

with:

$$
RegressionDimensions =
Quality + Reliability + Security + Safety + Latency + Tokens + Cost + BusinessOutcome
$$

And the release decision:

$$
Release =
MandatoryGates
\land
QualityThreshold
\land
ReliabilityThreshold
\land
LatencySLA
\land
CostBudget
$$

---

# 41. Final Definition

> **Regression testing for agents and prompts in CWD is the systematic comparison of a new agent, prompt, model, workflow, RAG, tool, or configuration version against a validated baseline using a versioned golden dataset. It verifies that existing capabilities, decisions, tool interactions, retrieval behavior, security controls, workflow paths, business outcomes, reliability, latency, token consumption, and cost have not degraded unexpectedly. Regression testing combines deterministic assertions for structured behavior, semantic evaluation for natural-language outcomes, security and safety hard gates, quantitative performance comparisons, production canary validation, and continuous incorporation of real production failures into the regression dataset.**

### Interview-ready answer

> **“For CWD, regression testing ensures that changes to prompts, agents, models, workflows, RAG, tools, or policies don't unintentionally break existing behavior. I maintain a versioned golden dataset and execute it against both the baseline and candidate versions. I compare intent, routing, delegation, tool selection and arguments, RAG evidence, security decisions, workflow paths, final business outcomes, accuracy, consistency, reliability, P95 latency, token usage, and cost. Security, safety, authorization, and compliance are hard release gates, while quality, latency, reliability, and cost have defined thresholds. After offline regression passes, I use canary deployment and production monitoring, and convert significant production failures into new regression test cases.”**
