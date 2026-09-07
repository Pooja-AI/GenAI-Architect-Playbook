# Agent Consistency Evaluation in CWD

**Core principle:**

> **Agent consistency measures whether an agent behaves predictably and produces stable, policy-compliant results when given the same or equivalent inputs under the same operating conditions.**

Accuracy asks:

> **“Was the result correct?”**

Consistency asks:

> **“Does the agent behave reliably and predictably across repeated or equivalent executions?”**

These are related, but they are **not the same metric**.

---

## 1. Why Consistency Matters in Agentic AI

LLM-based agents are probabilistic.

The same request can sometimes produce:

```text
Run 1 → Shipping Delegator
Run 2 → Logistics Delegator
Run 3 → Shipping Delegator
Run 4 → Shipping Delegator
```

Even if all responses look reasonable, inconsistent routing can create problems in:

* workflow predictability
* tool usage
* cost
* latency
* compliance
* auditability
* user experience
* reproducibility

For enterprise CWD, we want:

```text
Same Input
    ↓
Same Context
    ↓
Same Policy
    ↓
Same Agent/Model Configuration
    ↓
Predictable Behavior
```

Not necessarily **byte-for-byte identical text**, but **stable behavior and decisions**.

---

# 2. Accuracy vs Consistency

This distinction is fundamental.

### Accuracy

```text
Expected Result
      ↓
Actual Result
      ↓
Correct?
```

### Consistency

```text
Same / Equivalent Input
          ↓
   Run Multiple Times
          ↓
   Compare Behaviors
          ↓
     Stable?
```

Example:

```text
Expected agent = shipping-delegator
```

Five runs:

```text
Run 1 → shipping-delegator ✓
Run 2 → shipping-delegator ✓
Run 3 → shipping-delegator ✓
Run 4 → shipping-delegator ✓
Run 5 → inventory-delegator ✗
```

Accuracy may be 80% for these runs, while consistency is also poor.

But consider:

```text
Run 1 → "Shipment is delayed because carrier capacity is limited."
Run 2 → "The delay is caused by insufficient carrier capacity."
Run 3 → "Carrier capacity constraints are responsible."
```

The wording differs, but the **semantic behavior is consistent**.

So consistency should generally be measured at multiple levels.

---

# 3. What Should Be Consistent?

For CWD, evaluate consistency across:

```text
Agent Consistency
│
├── Intent
├── Domain
├── Routing
├── Planning
├── Decomposition
├── Tool Selection
├── Tool Arguments
├── RAG Retrieval
├── Business Logic
├── Security Decisions
├── Workflow Path
├── Final Outcome
└── Response Semantics
```

Some dimensions require very high consistency.

For example:

```text
Authorization Decision → extremely high consistency
Tool Selection         → high consistency
Routing                → high consistency
Business Outcome       → high consistency
Natural-language style → more flexible
```

---

# 4. Deterministic vs Probabilistic Consistency

This is important when evaluating LLM agents.

### Deterministic behavior

Some decisions should ideally be deterministic.

Examples:

```text
Authorization
Tenant isolation
Security filtering
Permission checks
Tool allowlist
Schema validation
Policy enforcement
```

These should not depend on LLM randomness.

For example:

```text
Unauthorized user
      ↓
Policy Engine
      ↓
DENY
```

Repeated executions should consistently produce:

```text
DENY
DENY
DENY
DENY
DENY
```

---

### Probabilistic behavior

Some LLM behavior naturally has variation.

Examples:

```text
Natural-language explanation
Summarization
Response wording
Reasoning style
```

Variation is acceptable if the **meaning and business outcome remain stable**.

---

# 5. Agent Consistency Test

A simple consistency test is:

```text
Test Case
   ↓
Run 10 / 50 / 100 times
   ↓
Collect Outputs
   ↓
Normalize Outputs
   ↓
Compare
   ↓
Consistency Score
```

Example:

```text
Test Case: "Why is shipment SHIP123 delayed?"

Run 1 → carrier capacity
Run 2 → carrier capacity
Run 3 → carrier capacity
Run 4 → carrier capacity
Run 5 → carrier capacity
```

Stable.

But:

```text
Run 6 → warehouse issue
Run 7 → carrier capacity
Run 8 → inventory shortage
```

The agent is inconsistent.

---

# 6. Exact Consistency

For structured decisions, exact matching is appropriate.

Example:

```json
{
  "intent": "shipment_tracking",
  "domain": "logistics",
  "target_agent": "shipping-delegator"
}
```

Repeat it 20 times.

If all 20 produce:

```text
intent = shipment_tracking
domain = logistics
target_agent = shipping-delegator
```

then:

```text
Exact Consistency = 100%
```

---

# 7. Semantic Consistency

For natural-language responses, exact matching is too strict.

Example:

**Run 1**

> Shipment is delayed because of carrier capacity constraints.

**Run 2**

> The carrier has insufficient capacity, causing the shipment delay.

**Run 3**

> Carrier capacity limitations are responsible for the delay.

Different wording.

Same meaning.

Therefore:

```text
Semantic Consistency = HIGH
```

The evaluator should compare:

```text
Intent
Facts
Entities
Business conclusion
Recommendation
Evidence
```

rather than exact text.

---

# 8. Consistency of Agent Routing

This is especially important for your CWD architecture.

Suppose:

```text
User Request
      ↓
Coordinator
      ↓
Agent Registry
      ↓
Routing
```

Run 10 times:

```text
8 → shipping-delegator
2 → inventory-delegator
```

Even if the inventory agent can sometimes answer the request, this indicates unstable routing.

You can calculate:

$$
RoutingConsistency =
\frac{MostFrequentRoutingDecision}
{TotalRuns}
$$

So:

$$
RoutingConsistency = \frac{8}{10}=80\%
$$

For critical workflows, you'd normally want a much stronger target.

---

# 9. Consistency of Tool Selection

Suppose the Worker needs shipment tracking.

Expected tool:

```text
get_tracking_events
```

Repeated runs:

```text
Run 1 → get_tracking_events
Run 2 → get_tracking_events
Run 3 → get_tracking_events
Run 4 → get_carrier_status
Run 5 → get_tracking_events
```

Tool-selection consistency:

$$
\frac{4}{5}=80\%
$$

This might indicate:

* ambiguous tool descriptions
* poor prompt
* overlapping tool capabilities
* excessive LLM temperature
* insufficient routing logic
* poor tool metadata

---

# 10. Tool Argument Consistency

Even if the same tool is selected, arguments may vary.

Expected:

```json
{
  "shipment_id": "SHIP123"
}
```

Repeated runs should not produce:

```text
SHIP123
SHIP132
SHIP1234
SHIP-123
```

unless those variations are semantically valid.

For structured tool arguments, use exact/schema/business-rule validation.

---

# 11. RAG Consistency

RAG introduces another dimension.

Repeated queries might retrieve:

```text
Run 1 → Doc A, B, C
Run 2 → Doc A, B, C
Run 3 → Doc A, C, D
```

Some variation can be acceptable if:

```text
Relevant evidence remains present
```

But if the retrieved evidence changes dramatically:

```text
Run 1 → correct policy
Run 2 → obsolete policy
Run 3 → unrelated document
```

then retrieval consistency is poor.

Measure:

* top-K overlap
* relevant-document stability
* ranking stability
* citation stability
* groundedness stability

---

# 12. Workflow Consistency

This is broader than individual agent consistency.

Suppose the intended workflow is:

```text
Coordinator
   ↓
Shipping Delegator
   ↓
Tracking Worker
   ↓
Carrier Worker
   ↓
Aggregation
   ↓
Response
```

Repeated executions should not randomly produce:

```text
Run 1 → expected workflow
Run 2 → expected workflow
Run 3 → expected workflow
Run 4 → Tracking → Inventory → Tracking → Response
```

unless conditional routing legitimately requires it.

So evaluate:

```text
Workflow Path Consistency
Task Ordering Consistency
Agent Selection Consistency
Tool Sequence Consistency
Recovery Path Consistency
```

---

# 13. Business Outcome Consistency

The most important question is:

> **Does the agent consistently reach the same correct business conclusion?**

Example:

```text
Expected:
Root cause = carrier capacity
```

20 executions:

```text
18 → carrier capacity
 1 → warehouse delay
 1 → unknown
```

Business outcome consistency:

$$
18/20 = 90\%
$$

This is more meaningful than comparing exact wording.

---

# 14. Security Consistency

Security decisions require especially strong consistency.

Example:

```text
Unauthorized request
       ↓
Policy
       ↓
DENY
```

If repeated executions produce:

```text
DENY
DENY
ALLOW
DENY
ALLOW
```

that is a **critical failure**, even if the average accuracy is high.

Therefore:

> **Security consistency should generally be treated as a hard gate rather than merely a weighted score.**

---

# 15. Consistency Across Equivalent Inputs

Consistency does not only mean identical inputs.

Consider:

```text
"Why is shipment SHIP123 delayed?"

"What's causing the delay for SHIP123?"

"Why hasn't SHIP123 arrived?"
```

These may represent the same underlying intent.

The agent should ideally produce equivalent:

```text
Intent
Domain
Routing
Required capabilities
Business conclusion
```

This is called **semantic consistency across paraphrases**.

---

# 16. Metamorphic Testing

A powerful technique for agent consistency is **metamorphic testing**.

Instead of only testing:

```text
Input A → Expected A
```

create equivalent variations:

```text
Input A
Input A'
Input A''
Input A'''
```

Example:

```text
A:
Why is shipment SHIP123 delayed?

A':
What caused the delay for SHIP123?

A'':
Can you explain why SHIP123 hasn't arrived?
```

Expected:

```text
Same underlying intent
Same domain
Same authorized data
Same appropriate agent
Same business conclusion
```

The wording can vary.

---

# 17. Consistency Across Sessions

Enterprise agents also need to behave consistently across sessions.

Example:

```text
Session 1
User → shipment SHIP123
Agent → identifies logistics domain

Session 2
User → shipment SHIP123
Agent → identifies unrelated domain
```

Potential causes:

* inconsistent memory retrieval
* missing session context
* incorrect persistent memory
* stale context
* different authorization state

Therefore evaluate consistency of:

```text
Session Context
Memory Retrieval
Identity
Entitlements
Business Context
```

---

# 18. Consistency Across Agent Versions

When you deploy:

```text
Agent v1 → Agent v2
```

run the same golden dataset.

Compare:

```text
v1 behavior
      vs
v2 behavior
```

Measure:

```text
Accuracy Change
Consistency Change
Routing Change
Tool Change
Latency Change
Cost Change
Safety Change
```

Example:

| Metric              |  v1 |  v2 |
| ------------------- | --: | --: |
| Intent accuracy     | 96% | 97% |
| Routing consistency | 98% | 91% |
| Tool consistency    | 97% | 93% |
| Groundedness        | 95% | 96% |

Although accuracy improved, routing consistency deteriorated.

That should trigger investigation.

---

# 19. Sources of Agent Inconsistency

Common causes include:

```text
LLM randomness
      +
High temperature
      +
Ambiguous prompts
      +
Ambiguous tool descriptions
      +
Overlapping agent capabilities
      +
Changing RAG results
      +
Changing enterprise data
      +
Dynamic agent availability
      +
Memory differences
      +
Context ordering
      +
Model version changes
      +
Prompt version changes
```

Not all variability is bad.

The goal is **controlled variability**.

---

# 20. How to Improve Consistency

### 1. Use deterministic logic where possible

Don't ask the LLM to decide something that Policy/IAM can decide deterministically.

```text
Bad:
LLM decides authorization

Better:
Policy/IAM decides authorization
```

---

### 2. Lower randomness for decision tasks

For critical routing/classification tasks, use appropriately constrained generation/configuration.

---

### 3. Structured outputs

Use schemas:

```json
{
  "intent": "...",
  "domain": "...",
  "target_agent": "..."
}
```

rather than free-form routing instructions.

---

### 4. Clear tool descriptions

Avoid overlapping tool capabilities.

---

### 5. Stable context construction

Control:

```text
prompt
memory
RAG evidence
tool definitions
system instructions
```

---

### 6. Version everything

Track:

```text
Agent
Prompt
Model
Workflow
RAG index
Embedding
Tool
```

---

# 21. Consistency Test Matrix

A practical CWD test suite:

| Test                     | What it checks          |
| ------------------------ | ----------------------- |
| Repeated same-input      | Stability               |
| Paraphrase               | Semantic consistency    |
| Different session        | Context consistency     |
| Different agent instance | Distributed consistency |
| Different Worker         | Execution consistency   |
| Model version change     | Version consistency     |
| Prompt version change    | Prompt regression       |
| RAG variation            | Retrieval stability     |
| Tool failure             | Recovery consistency    |
| Authorization case       | Security consistency    |

---

# 22. Consistency Evaluation Pipeline

```text
                 TEST CASE
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
        Run 1      Run 2      Run N
          │          │          │
          └──────────┼──────────┘
                     ▼
              Normalize Results
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
       Decisions    Tools     Outcomes
          │          │          │
          └──────────┼──────────┘
                     ▼
                  Compare
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
      Consistent             Inconsistent
          │                     │
          ▼                     ▼
        PASS               Root Cause
```

---

# 23. Agent Consistency Scorecard

A useful dashboard could be:

| Dimension         | Consistency |
| ----------------- | ----------: |
| Intent            |         99% |
| Domain            |         99% |
| Routing           |         98% |
| Decomposition     |         95% |
| Worker selection  |         97% |
| Tool selection    |         96% |
| Tool arguments    |         99% |
| RAG evidence      |         94% |
| Business outcome  |         97% |
| Security decision |        100% |

Again, the values are illustrative.

---

# 24. Consistency vs Reliability

These are also different.

### Consistency

```text
Does it behave similarly across equivalent executions?
```

### Reliability

```text
Does it successfully execute and recover from failures?
```

Example:

```text
10 executions
9 produce the same correct result
1 produces a different result
```

The system may be:

```text
Highly reliable
but not perfectly consistent.
```

Or:

```text
Consistent failure
```

is possible:

```text
10/10 executions
→ same incorrect result
```

That gives:

```text
Consistency = 100%
Accuracy = 0%
```

This is an excellent example of why these metrics must remain separate.

---

# 25. Accuracy + Consistency

The ideal agent is:

```text
                 AGENT QUALITY
                      │
             ┌────────┴────────┐
             ▼                 ▼
          ACCURACY        CONSISTENCY
             │                 │
       Correct result     Stable behavior
             │                 │
             └────────┬────────┘
                      ▼
              Reliable Agent
```

You want:

```text
High Accuracy
+
High Consistency
```

not just one or the other.

---

# 26. CWD Example

Suppose you execute this test case 10 times:

> **"Why is shipment SHIP123 delayed?"**

Expected:

```text
Intent = root_cause_analysis
Domain = logistics
Delegator = shipping-delegator
Worker = delay-analysis-worker
Root cause = carrier_capacity
```

Results:

```text
Run 1 → ✓ ✓ ✓ ✓ ✓
Run 2 → ✓ ✓ ✓ ✓ ✓
Run 3 → ✓ ✓ ✓ ✓ ✓
Run 4 → ✓ ✓ ✓ ✓ ✓
Run 5 → ✓ ✓ ✓ ✓ ✓
Run 6 → ✓ ✓ ✓ ✓ ✓
Run 7 → ✓ ✓ ✓ ✓ ✓
Run 8 → ✓ ✓ ✓ ✓ ✓
Run 9 → ✓ ✓ ✓ ✓ ✓
Run 10 → ✓ ✓ ✓ ✓ ✗
```

You could report:

```text
Intent consistency          = 100%
Domain consistency          = 100%
Routing consistency         = 100%
Worker consistency          = 100%
Business outcome consistency = 90%
```

That immediately tells you where the instability is.

---

# 27. Where Consistency Fits in the CWD Evaluation Framework

```text
                         CWD EVALUATION
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
     QUALITY               RELIABILITY              LATENCY
       │                       │                       │
       ├── Accuracy            ├── Success             ├── P50
       ├── Consistency         ├── Recovery            ├── P95
       ├── Groundedness        ├── Retry               └── P99
       └── Relevance           └── Failure
       │
       ▼
      COST
       │
       ▼
 SAFETY / SECURITY
```

So **agent consistency is primarily a quality/stability dimension**, while security consistency can be a mandatory governance gate.

---

# 28. Final Formula

### Basic consistency

$$
Consistency =
\frac{Stable\ / \ Equivalent\ Outcomes}
{Total\ Repeated\ Evaluations}
$$

### Example

$$
Consistency = \frac{95}{100}=95\%
$$

### Enterprise Agent Consistency

```text
Agent Consistency
=
Decision Stability
+
Routing Stability
+
Task/Decomposition Stability
+
Tool-Selection Stability
+
Retrieval Stability
+
Business-Outcome Stability
+
Security-Decision Stability
```

These should be measured separately rather than blindly averaged.

---

# 29. Final Definition

> **Agent consistency evaluation in CWD is the systematic measurement of whether an agent produces stable, predictable, and policy-compliant decisions, execution paths, tool interactions, retrieved evidence, and business outcomes across repeated or semantically equivalent inputs under controlled conditions. Deterministic decisions such as authorization, routing constraints, and structured tool selection should have very high consistency, while natural-language responses may vary in wording as long as their semantic meaning, evidence, and business outcome remain stable. Consistency testing uses repeated executions, paraphrase testing, metamorphic testing, cross-version comparisons, and production monitoring to identify behavioral instability and regressions.**

### Interview-ready answer

> **“Agent consistency measures whether an agent behaves predictably across repeated or equivalent requests. In CWD, we evaluate consistency at multiple levels—intent, routing, decomposition, Worker selection, tool calls, RAG retrieval, security decisions, workflow paths, and business outcomes. We use exact comparison for structured decisions and semantic comparison for natural-language responses. Accuracy tells us whether the agent is correct, while consistency tells us whether it behaves predictably. A production agent needs both high accuracy and high consistency, with security and authorization decisions treated as hard consistency gates.”**
