Absolutely. This is the next step after regression testing: **version comparison tells us exactly how two agent or prompt versions differ and whether the newer version is actually better.**

# Comparison of Different Agent or Prompt Versions in CWD

## 1. Core Principle

**Version comparison** is the systematic evaluation of two or more versions of an agent or prompt to determine how their behavior, quality, reliability, performance, cost, security, and business outcomes differ.

For example:

```text
Agent v1.0
Prompt v2.1
Model v4
       │
       │  Golden Dataset
       ▼
   Baseline Results
       
       COMPARE

Agent v1.1
Prompt v2.2
Model v4
       │
       ▼
   Candidate Results
```

The fundamental question is:

> **Is the new version better, equivalent, or worse than the existing version—and in what dimensions?**

---

# 2. Why Version Comparison Is Required

An agent can improve in one dimension while becoming worse in another.

Example:

| Metric        | Version A | Version B |   Change |
| ------------- | --------: | --------: | -------: |
| Accuracy      |       91% |       95% |      +4% |
| Consistency   |       96% |       94% |      -2% |
| P95 Latency   |   3.5 sec |   5.2 sec | +1.7 sec |
| Tokens        |        6K |       11K |      +5K |
| Cost/workflow |     $0.22 |     $0.38 |   +$0.16 |
| Tool success  |       97% |       98% |      +1% |

Version B has better accuracy and tool success, but worse latency and cost.

Therefore:

> **Version comparison is a multi-dimensional decision, not simply “new version accuracy > old version accuracy.”**

---

# 3. What Can Be Compared?

You can compare:

### Agent versions

```text
Agent v1.0
Agent v1.1
Agent v2.0
```

### Prompt versions

```text
Prompt v2.1
Prompt v2.2
Prompt v3.0
```

### Model versions

```text
Model A
Model B
```

### Workflow versions

```text
Workflow v5.1
Workflow v5.2
```

### RAG configurations

```text
Embedding v1
Embedding v2

Chunking v1
Chunking v2

Top-K = 5
Top-K = 10
```

### Tool/MCP versions

```text
Tool v1
Tool v2

MCP Server v1
MCP Server v2
```

In production, these should ideally be compared as **versioned configurations**, because an agent's behavior depends on multiple components.

---

# 4. Agent Version vs Prompt Version

These should not be confused.

### Prompt comparison

```text
Same Agent
Same Model
Same Tools
Same RAG

Prompt v1
   vs
Prompt v2
```

This isolates the effect of the prompt.

### Agent comparison

```text
Agent v1
   vs
Agent v2
```

The agent may have changed:

* prompt
* model
* tools
* RAG
* memory
* workflow
* policies
* business logic

Therefore agent comparison is broader.

---

# 5. Establish the Baseline

The first step is selecting the baseline.

Example:

```json
{
  "agent_id": "shipping-agent",
  "agent_version": "3.1.0",
  "prompt_id": "shipment-analysis",
  "prompt_version": "2.4.0",
  "model": "approved-model",
  "model_version": "4",
  "workflow_version": "5.2.0",
  "rag_index_version": "2026-08-20",
  "evaluation_dataset": "golden-v12"
}
```

This becomes the reference configuration.

---

# 6. Define the Candidate

The new version is represented using the same metadata.

```json
{
  "agent_id": "shipping-agent",
  "agent_version": "3.2.0",
  "prompt_id": "shipment-analysis",
  "prompt_version": "2.5.0",
  "model": "approved-model",
  "model_version": "4",
  "workflow_version": "5.2.0",
  "rag_index_version": "2026-08-20",
  "evaluation_dataset": "golden-v12"
}
```

Now the evaluation system knows exactly what changed.

---

# 7. Control the Experimental Conditions

For meaningful comparison, keep as many variables constant as possible.

For a prompt comparison:

```text
Same:
  Golden dataset
  Model
  Model parameters
  Tools
  RAG index
  Embedding model
  Workflow
  Policies
  Memory conditions
```

Change only:

```text
Prompt version
```

This gives you a much stronger attribution of observed differences.

---

# 8. Golden Dataset Comparison

Run the same dataset against both versions.

```text
             Golden Dataset
                   │
          ┌────────┴────────┐
          ▼                 ▼
      Version A          Version B
          │                 │
          ▼                 ▼
       Results A         Results B
          │                 │
          └────────┬────────┘
                   ▼
               Evaluator
                   │
                   ▼
               Comparison
```

For example:

```text
5,000 test cases
```

Version A:

```text
Accuracy = 92.4%
```

Version B:

```text
Accuracy = 94.1%
```

Improvement:

```text
+1.7 percentage points
```

---

# 9. Compare Behavior, Not Just Final Answers

A powerful enterprise comparison examines the entire execution.

```text
User Request
     │
     ├── Intent
     ├── Domain
     ├── Planning
     ├── Agent Selection
     ├── Delegation
     ├── Tool Selection
     ├── Tool Arguments
     ├── RAG Retrieval
     ├── Workflow Path
     ├── Validation
     └── Final Answer
```

Compare every important stage.

---

# 10. Intent Comparison

Example:

```text
Input:
"Why is shipment SHIP123 delayed?"
```

Version A:

```json
{
  "intent": "root_cause_analysis"
}
```

Version B:

```json
{
  "intent": "shipment_tracking"
}
```

If the expected intent is `root_cause_analysis`, Version B has a regression.

---

# 11. Routing Comparison

Version A:

```text
Coordinator
    ↓
Shipping Delegator
```

Version B:

```text
Coordinator
    ↓
General Support Agent
```

Even if both eventually produce an answer, the routing behavior changed.

Track:

```text
routing_accuracy
selected_agent
candidate_agents
exclusion_reasons
routing_reason
```

---

# 12. Tool Selection Comparison

Example:

```text
Expected:
get_tracking_events
```

Version A:

```text
get_tracking_events
```

Version B:

```text
get_carrier_status
```

If both tools can answer the question, the difference may be acceptable.

If only one provides the required evidence, it is a functional regression.

Therefore compare:

```text
Expected Tool
Selected Tool
Tool Selection Accuracy
Argument Accuracy
Execution Success
Result Validity
Business Outcome
```

---

# 13. RAG Comparison

Compare the evidence retrieved by each version.

```text
Version A
Top 5 chunks
    ↓
Documents A

Version B
Top 5 chunks
    ↓
Documents B
```

Metrics include:

* Recall@K
* Precision@K
* MRR
* NDCG
* context relevance
* context precision
* context recall
* citation accuracy
* groundedness

The final answer may be identical even though the evidence changed, so retrieval comparison is important.

---

# 14. Workflow Comparison

For CWD, compare the execution path.

Version A:

```text
START
 ↓
Intent
 ↓
Authorization
 ↓
Agent Discovery
 ↓
Delegation
 ↓
Worker
 ↓
Validation
 ↓
Response
```

Version B:

```text
START
 ↓
Intent
 ↓
Authorization
 ↓
Agent Discovery
 ↓
Delegation
 ↓
Worker
 ↓
Reviewer
 ↓
Validation
 ↓
Response
```

Version B introduced another agent/step.

Potential impact:

```text
Quality ↑
Latency ↑
Tokens ↑
Cost ↑
```

This is why workflow comparison matters.

---

# 15. Final Answer Comparison

For natural language, don't blindly compare strings.

Version A:

```text
"The shipment is delayed because the carrier has a capacity constraint."
```

Version B:

```text
"The carrier's capacity limitations are responsible for the shipment delay."
```

These are semantically equivalent.

Evaluate:

```text
Correctness
Relevance
Completeness
Groundedness
Citation Accuracy
Business Outcome
```

---

# 16. Exact vs Semantic Comparison

Use **exact comparison** for:

```text
Intent
Domain
Agent ID
Tool name
Tool arguments
Authorization decision
Schema
Status
Policy decision
```

Use **semantic comparison** for:

```text
Final answer
Explanation
Summary
Reasoning outcome
Recommendations
Natural-language response
```

---

# 17. Accuracy Comparison

Basic comparison:

$$
\Delta Accuracy =
Accuracy_{candidate} - Accuracy_{baseline}
$$

Example:

```text
Baseline = 92%
Candidate = 95%
```

Therefore:

$$
\Delta Accuracy = +3\%
$$

But distinguish:

```text
+3 percentage points
```

from:

```text
3% relative improvement
```

The first is usually clearer for evaluation dashboards.

---

# 18. Consistency Comparison

Suppose:

```text
Baseline consistency = 97%
Candidate consistency = 91%
```

The candidate is less predictable.

This matters particularly for:

```text
Routing
Tool selection
Security decisions
Workflow paths
Structured outputs
```

For security decisions, consistency should normally be treated as a hard requirement.

---

# 19. Reliability Comparison

Compare:

```text
Success rate
Failure rate
Timeout rate
Retry rate
Recovery rate
Tool failure rate
Workflow failure rate
```

Example:

```text
Baseline:
Success = 98.5%

Candidate:
Success = 97.1%
```

This is a reliability regression.

---

# 20. Latency Comparison

Use percentiles.

```text
Baseline:
P50 = 1.8 sec
P95 = 4.0 sec
P99 = 6.1 sec

Candidate:
P50 = 2.1 sec
P95 = 4.8 sec
P99 = 7.5 sec
```

The candidate is slower.

A useful comparison is:

$$
\Delta P95 =
P95_{candidate} - P95_{baseline}
$$

---

# 21. Cost Comparison

Compare:

```text
LLM cost
Embedding cost
RAG/search cost
Compute
Cosmos DB
Redis
Service Bus
Observability
External APIs
```

At the workflow level:

$$
CostPerSuccessfulWorkflow =
\frac{TotalCost}{SuccessfulWorkflows}
$$

Example:

```text
Version A = $0.25
Version B = $0.29
```

The candidate costs:

```text
+$0.04/workflow
```

If the candidate improves accuracy substantially, the additional cost may be justified.

---

# 22. Token Comparison

Compare:

```text
Input tokens
Output tokens
Total tokens
LLM calls
RAG context tokens
Tool-result tokens
```

Example:

```text
Baseline = 7,000 tokens
Candidate = 9,500 tokens
```

Increase:

```text
+2,500 tokens
```

Investigate whether this came from:

```text
Larger prompt
More context
More retrieved chunks
More tool calls
Longer responses
Additional agent hops
Retries
```

---

# 23. Security Comparison

Security comparison should be a mandatory gate.

Example:

```text
Version A:
Unauthorized document → DENY

Version B:
Unauthorized document → ALLOW
```

Regardless of other metrics:

```text
RELEASE = FAIL
```

Compare:

```text
Authorization
ACL filtering
Tenant isolation
Tool permissions
Policy decisions
Sensitive-data handling
Prompt injection resistance
Privilege boundaries
```

---

# 24. Business Outcome Comparison

This is often the most important comparison.

Suppose:

```text
Version A:
Business success = 89%

Version B:
Business success = 94%
```

Version B may be preferable even if:

```text
Latency +10%
Cost +15%
```

provided those increases remain within approved limits.

The objective is:

> **Optimize business value subject to security, quality, reliability, performance, and cost constraints.**

---

# 25. Version Comparison Scorecard

A useful enterprise dashboard:

| Dimension        | Baseline | Candidate |  Delta | Result |
| ---------------- | -------: | --------: | -----: | ------ |
| Accuracy         |      92% |       95% |    +3% | ✅      |
| Consistency      |      97% |       96% |    -1% | ⚠️     |
| Tool success     |      97% |       98% |    +1% | ✅      |
| Groundedness     |      94% |       96% |    +2% | ✅      |
| Reliability      |    98.5% |     98.2% |  -0.3% | ⚠️     |
| P95 latency      |     4.0s |      4.6s |  +0.6s | ⚠️     |
| Tokens           |       7K |      8.5K |  +1.5K | ⚠️     |
| Cost/workflow    |    $0.25 |     $0.29 | +$0.04 | ⚠️     |
| Security         |     PASS |      PASS |      — | ✅      |
| Business success |      89% |       94% |    +5% | ✅      |

The release decision depends on predefined thresholds.

---

# 26. Don't Hide Trade-Offs in One Score

You can calculate a conceptual score:

$$
Score =
w_qQ +
w_rR +
w_pP +
w_cC
$$

where:

* \(Q\) = quality
* \(R\) = reliability
* \(P\) = performance
* \(C\) = cost efficiency

However, do **not** allow a high quality score to compensate for a security failure.

Use:

```text
Hard Gates
   +
Weighted Optimization
```

For example:

```text
Security = PASS
Safety = PASS
Authorization = PASS
Compliance = PASS

AND

Quality ≥ threshold
Reliability ≥ threshold
Latency ≤ SLA
Cost ≤ budget
```

---

# 27. Per-Test Comparison

Don't only compare aggregate metrics.

Consider:

```text
5,000 cases
```

Suppose:

```text
Version A passes: 4,600
Version B passes: 4,700
```

That's useful, but also identify **which cases changed**.

```text
             5,000 Cases
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
   Same Behavior       Changed Behavior
                            │
                 ┌──────────┼──────────┐
                 ▼          ▼          ▼
              Improved   Regressed   Neutral
```

This is where regression analysis becomes powerful.

---

# 28. Improved / Regressed / Neutral

For every test case:

```text
Baseline Result
Candidate Result
Comparison
```

Classify it:

### Improved

```text
Baseline = FAIL
Candidate = PASS
```

### Regressed

```text
Baseline = PASS
Candidate = FAIL
```

### Unchanged

```text
Baseline = PASS
Candidate = PASS
```

### Changed but equivalent

```text
Different wording
Same business outcome
```

This prevents false regression alarms.

---

# 29. Version Comparison Record

A useful representation:

```json
{
  "comparison_id": "CMP-2026-001",

  "baseline": {
    "agent_version": "3.1.0",
    "prompt_version": "2.4.0"
  },

  "candidate": {
    "agent_version": "3.2.0",
    "prompt_version": "2.5.0"
  },

  "dataset": "golden-v12",

  "metrics": {
    "accuracy": {
      "baseline": 0.92,
      "candidate": 0.95,
      "delta": 0.03
    },
    "reliability": {
      "baseline": 0.985,
      "candidate": 0.982,
      "delta": -0.003
    },
    "p95_latency_ms": {
      "baseline": 4000,
      "candidate": 4600,
      "delta": 600
    },
    "cost_per_workflow": {
      "baseline": 0.25,
      "candidate": 0.29,
      "delta": 0.04
    }
  },

  "security": {
    "baseline": "PASS",
    "candidate": "PASS"
  },

  "release_decision": "PASS_WITH_MONITORING"
}
```

---

# 30. Pairwise Comparison

The simplest comparison is:

```text
A vs B
```

Example:

```text
Prompt v2.1
     vs
Prompt v2.2
```

This is useful when testing a single change.

---

# 31. Multi-Version Comparison

You can also compare:

```text
Prompt v2.1
Prompt v2.2
Prompt v2.3
Prompt v2.4
```

against the same dataset.

Example:

| Version | Accuracy |  P95 |  Cost |
| ------- | -------: | ---: | ----: |
| v2.1    |      91% | 3.8s | $0.22 |
| v2.2    |      93% | 4.0s | $0.24 |
| v2.3    |      95% | 4.5s | $0.28 |
| v2.4    |      94% | 5.4s | $0.35 |

You can see that v2.3 may provide the best balance.

---

# 32. A/B Testing

After offline evaluation, production comparison can be performed using controlled traffic.

```text
Production Traffic
       │
       ├──────────────┐
       ▼              ▼
   Version A       Version B
      90%             10%
       │               │
       └──────┬────────┘
              ▼
          Compare
```

Track:

```text
Quality
Business outcome
Latency
Cost
Errors
Security
User satisfaction
```

This is particularly useful because offline data cannot represent every production scenario.

---

# 33. Champion vs Challenger

A useful production pattern is:

```text
Champion
   │
   └── Current production version

Challenger
   │
   └── New candidate version
```

Example:

```text
Champion:
Agent v3.1

Challenger:
Agent v3.2
```

The challenger is evaluated against the champion.

If it consistently performs better:

```text
Challenger → Champion
```

Otherwise:

```text
Challenger → Rejected
```

---

# 34. Comparison With Prompt Registry

The Prompt Registry provides version lineage:

```text
shipment-analysis
       │
       ├── v2.1
       ├── v2.2
       ├── v2.3
       └── v2.4
```

Each version can have:

```text
Owner
Approval
Evaluation Results
Model Compatibility
Deployment Status
Metrics
Rollback Information
```

This enables:

```text
Prompt Version
      ↓
Evaluation
      ↓
Baseline Comparison
      ↓
Approval
      ↓
Deployment
```

---

# 35. Comparison With CWD

In your CWD architecture:

```text
                    CWD
                     │
             ┌───────┴───────┐
             ▼               ▼
        Baseline          Candidate
             │               │
             ▼               ▼
        Coordinator       Coordinator
             │               │
        Delegators         Delegators
             │               │
         Workers           Workers
             │               │
          RAG/MCP           RAG/MCP
             │               │
             └───────┬───────┘
                     ▼
                Evaluator
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
     Quality     Performance      Cost
       │             │             │
       └─────────────┼─────────────┘
                     ▼
                Release Gate
```

---

# 36. Version Lineage

Every production result should be traceable.

```text
Session
  ↓
Turn
  ↓
Workflow
  ↓
Task
  ↓
Run
  ↓
Step
  ↓
Agent Version
  ↓
Prompt Version
  ↓
Model Version
  ↓
Tool/MCP Version
  ↓
RAG Index Version
```

This allows you to answer:

> **Which exact versions produced this response?**

That is critical for debugging and auditability.

---

# 37. Change Attribution

Suppose:

```text
Agent v3.1 → v3.2
Prompt v2.4 → v2.5
Model unchanged
RAG unchanged
Tools unchanged
```

If quality changes, you can reasonably investigate the agent/prompt changes first.

But if everything changed:

```text
Agent
Prompt
Model
RAG
Tools
Workflow
```

then attribution becomes much harder.

Therefore:

> **Controlled version comparison is also a change-attribution mechanism.**

---

# 38. Regression vs Comparison

These concepts are related but different.

### Version comparison

Asks:

> **How are Version A and Version B different?**

### Regression testing

Asks:

> **Did Version B break anything that Version A handled correctly?**

### Evaluation

Asks:

> **How good is Version B?**

Together:

```text
Comparison
    ↓
Difference Detection
    ↓
Regression Analysis
    ↓
Quality Evaluation
    ↓
Release Decision
```

---

# 39. Recommended CWD Evaluation Lifecycle

```text
Create New Agent/Prompt Version
             ↓
Freeze Configuration
             ↓
Select Baseline
             ↓
Select Golden Dataset
             ↓
Run Baseline
             ↓
Run Candidate
             ↓
Compare Per-Test Results
             ↓
Compare Aggregate Metrics
             ↓
Security/Safety Gates
             ↓
Regression Analysis
             ↓
Latency / Cost Analysis
             ↓
Business Outcome Analysis
             ↓
Release Decision
        │
   ┌────┴────┐
   ▼         ▼
 APPROVE    REJECT
   │
   ▼
 Canary
   │
   ▼
 Production Monitoring
```

---

# 40. Most Important Metrics

For an enterprise agent platform, compare at least:

```text
Quality
├── Accuracy
├── Groundedness
├── Completeness
└── Business outcome

Behavior
├── Intent
├── Routing
├── Delegation
├── Tool selection
└── Workflow path

Reliability
├── Success
├── Failure
├── Timeout
├── Retry
└── Recovery

Performance
├── P50
├── P95
└── P99

Efficiency
├── Tokens
├── LLM calls
└── Cost

Security
├── Authorization
├── Tenant isolation
├── Tool permissions
└── Data leakage
```

---

# 41. The Key Enterprise Rule

The best version is **not necessarily the version with the highest accuracy**.

A production version should satisfy:

```text
High Quality
+
High Reliability
+
Acceptable Latency
+
Acceptable Cost
+
Stable Behavior
+
Strong Security
+
Business Success
```

subject to mandatory security and compliance gates.

---

# 42. Final Formula

A useful conceptual model is:

$$
VersionComparison =
Evaluate(Baseline, Candidate, GoldenDataset)
$$

with:

$$
\Delta Metric =
Metric_{Candidate} - Metric_{Baseline}
$$

and:

$$
ReleaseDecision =
Security
\land Safety
\land Quality
\land Reliability
\land Performance
\land Cost
$$

where each dimension is evaluated against its own threshold.

---

# 43. Final Definition

> **Comparison of different agent or prompt versions in CWD is the controlled evaluation of a baseline version against one or more candidate versions using the same governed test conditions and golden datasets. The comparison examines not only final-answer quality but also intent classification, routing, delegation, tool selection, tool arguments, RAG retrieval, workflow paths, security decisions, consistency, reliability, latency, token consumption, cost, and business outcomes. Version metadata for the agent, prompt, model, workflow, tools, MCP servers, RAG index, and evaluation dataset is captured to provide reproducibility and change attribution. The comparison results are then used for regression detection, release gating, canary deployment, rollback, and continuous improvement.**

### Interview-ready answer

> **“In CWD, I compare agent and prompt versions using a controlled baseline-versus-candidate evaluation. I run the same versioned golden dataset against both versions and compare behavior at multiple levels: intent, routing, delegation, tool selection and arguments, RAG evidence, workflow path, final answer, security decisions, accuracy, consistency, reliability, P95 latency, tokens, and cost. I classify each test as improved, regressed, unchanged, or semantically equivalent. Security, safety, authorization, and compliance are hard gates, while quality, reliability, latency, and cost are evaluated against defined thresholds. For production changes, I follow offline comparison with champion/challenger or canary testing and maintain complete version lineage so every result can be traced back to the exact agent, prompt, model, workflow, tool, and RAG versions.”**

**Mental model:**

```text
Baseline Version
       +
Candidate Version
       +
Same Golden Dataset
       ↓
   Compare Behavior
       ↓
Improved / Regressed / Equivalent
       ↓
Quality + Reliability + Latency + Cost + Security
       ↓
Release / Reject / Rollback
```

If you want, the natural next topic is **“Understand A/B testing and champion–challenger evaluation for agents and prompts”**, which extends this comparison from offline testing into production traffic.
