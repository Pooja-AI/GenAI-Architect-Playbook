## Golden Datasets and Test Cases in CWD Evaluation

**Core principle:**

> A **golden dataset** is a curated, version-controlled collection of representative requests with expected outcomes that provides a stable benchmark for evaluating agents and workflows. A **test case** is one individual scenario within that dataset, defining the input, expected behavior, expected result, and evaluation criteria.

```text
Golden Dataset
      │
      ├── Test Case 1
      ├── Test Case 2
      ├── Test Case 3
      ├── ...
      └── Test Case N
              │
              ▼
       CWD Evaluation
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    Quality Reliability Cost/Latency
       │      │      │
       └──────┼──────┘
              ▼
        Pass / Fail
```

---

# 1. What Is a Golden Dataset?

A golden dataset is the **trusted evaluation benchmark** for your CWD platform.

It contains representative inputs and the expected behavior or outcome against which actual execution is compared.

For example:

```text
Golden Dataset
│
├── Shipment delay investigation
├── Shipment tracking
├── Carrier analysis
├── Rerouting recommendation
├── Missing shipment ID
├── Unauthorized shipment
├── MCP failure
├── RAG failure
├── Ambiguous request
└── Multi-agent workflow
```

The goal is not to create thousands of random questions.

The goal is to create a **high-quality representative set of business scenarios**.

---

# 2. Why "Golden"?

"Golden" means the dataset represents an **approved reference standard**.

For example:

```text
User Query
    ↓
Expected Intent
    ↓
Expected Agent
    ↓
Expected Tools
    ↓
Expected Evidence
    ↓
Expected Business Outcome
```

The expected values become the benchmark.

If you change:

* LLM
* prompt
* Agent
* Delegator
* Coordinator
* RAG strategy
* embedding model
* MCP tool
* workflow
* routing logic

you can run the same golden dataset again.

That makes regression testing possible.

---

# 3. What Is a Test Case?

A test case is a **single executable evaluation scenario**.

For example:

```json
{
  "test_id": "TC-001",
  "category": "shipment_delay",

  "input": {
    "user_query": "Why is shipment SHIP123 delayed?"
  },

  "expected": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "required_capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ]
  }
}
```

This is one test case.

A golden dataset contains many such test cases.

---

# 4. Golden Dataset vs Test Case

| Golden Dataset               | Test Case                        |
| ---------------------------- | -------------------------------- |
| Collection of scenarios      | One scenario                     |
| Evaluation benchmark         | Individual evaluation            |
| Contains many cases          | One input/expected behavior      |
| Versioned                    | Usually versioned                |
| Used for regression          | Used to validate one behavior    |
| Represents business coverage | Represents one business scenario |

Think:

```text
Golden Dataset
      =
Test Case 1
+
Test Case 2
+
Test Case 3
+
...
+
Test Case N
```

---

# 5. What Should a CWD Test Case Contain?

A mature CWD test case should contain more than just:

```text
Input → Expected Answer
```

It should capture the **agentic execution contract**.

A useful structure is:

```text
Test Case
│
├── Identity
├── Input
├── Context
├── Expected Intent
├── Expected Domain
├── Expected Capability
├── Expected Agent
├── Expected Delegation
├── Expected Tools
├── Expected RAG Evidence
├── Expected Output
├── Expected Security Decision
├── Expected Workflow
├── Expected Error Handling
└── Evaluation Criteria
```

---

# 6. Example Enterprise CWD Test Case

Consider:

> "Why is shipment SHIP123 delayed?"

A detailed test case could be:

```json
{
  "test_id": "TC-SHIP-001",
  "version": "1.0",

  "input": {
    "query": "Why is shipment SHIP123 delayed?",
    "user": {
      "role": "logistics_employee",
      "scope": ["logistics"]
    }
  },

  "expected": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "query_type": "analytical",

    "required_capabilities": [
      "shipment_tracking",
      "delay_analysis"
    ],

    "expected_delegator": "shipping-delegator",

    "expected_workers": [
      "tracking-worker",
      "delay-analysis-worker"
    ],

    "expected_tools": [
      "get_tracking_events",
      "get_carrier_status"
    ],

    "security": {
      "authorization": "allowed"
    },

    "expected_outcome": {
      "status": "completed",
      "root_cause": "carrier_capacity",
      "recommendation": "reroute"
    }
  },

  "evaluation": {
    "intent_accuracy": true,
    "routing_accuracy": true,
    "tool_selection": true,
    "groundedness": true,
    "business_correctness": true
  }
}
```

Notice that we're evaluating the **whole workflow**, not just the final text.

---

# 7. Different Types of Test Cases

A strong golden dataset should contain multiple categories.

### 7.1 Normal Cases

Expected successful workflows.

```text
Query
 ↓
Correct intent
 ↓
Correct agent
 ↓
Correct tools
 ↓
Correct answer
```

---

### 7.2 Edge Cases

Unusual but valid requests.

Example:

```text
"Show me the status of shipment SHIP123456789999."
```

Test:

* long identifier
* database lookup
* validation
* response formatting

---

### 7.3 Ambiguous Cases

Example:

> "Check the shipment."

The system may need clarification.

Expected:

```text
status = needs_input
```

rather than hallucinating a shipment.

---

### 7.4 Security Cases

Example:

> "Show me shipment information for a restricted business unit."

Expected:

```text
Authorization → DENY
```

The correct result is **not** a useful-looking answer.

---

### 7.5 RAG Cases

Example:

> "What is the company's policy for delayed shipments?"

Expected:

```text
Query
 ↓
RAG
 ↓
Authorized documents
 ↓
Relevant chunks
 ↓
Grounded answer
```

Evaluate:

* retrieval relevance
* authorization filtering
* citation
* groundedness

---

### 7.6 Tool-Calling Cases

Example:

> "Get the latest carrier status."

Expected:

```text
Tool = get_carrier_status
Arguments = correct
```

Evaluate:

```text
Tool Selection
+
Argument Accuracy
+
Authorization
+
Execution
+
Result Interpretation
```

---

### 7.7 Multi-Agent Cases

Example:

```text
Coordinator
   ↓
Shipping Delegator
   ├── Tracking Worker
   ├── Carrier Worker
   └── Delay Analysis Worker
```

Evaluate:

* Coordinator routing
* Delegator decomposition
* Worker selection
* parallel execution
* aggregation
* final answer

---

### 7.8 Failure Cases

For example:

```text
MCP unavailable
```

Expected:

```text
Worker
 ↓
MCP timeout
 ↓
Retry
 ↓
Failure classification
 ↓
Recovery / alternate tool / escalation
```

The test case should verify the recovery behavior.

---

### 7.9 Long-Running Cases

Example:

```text
User request
      ↓
Delegator
      ↓
Long-running Worker
      ↓
Service Bus
      ↓
Execution
      ↓
Result
      ↓
Resume workflow
```

Verify:

* correlation ID
* task state
* run state
* checkpoint
* asynchronous result
* workflow resume

---

# 8. Golden Dataset Should Cover the Entire CWD

A mature dataset looks like:

```text
                  GOLDEN DATASET
                        │
     ┌──────────────────┼──────────────────┐
     ▼                  ▼                  ▼
 Coordinator        Delegator            Worker
 Tests              Tests                Tests
     │                  │                  │
     └──────────────────┼──────────────────┘
                        ▼
                   RAG / MCP
                     Tests
                        │
                        ▼
                Workflow Tests
                        │
                        ▼
             Security / Safety Tests
                        │
                        ▼
                Failure / Recovery
```

---

# 9. Evaluation Expected Output

Not every test case should require an exact textual answer.

This is important for LLM systems.

Instead, define different **assertion levels**.

### Exact assertion

Useful for:

```text
Intent
Status
Tool name
Agent ID
Policy decision
Structured JSON
```

Example:

```text
expected_tool = "get_tracking_events"
```

---

### Semantic assertion

Useful for natural-language responses.

Instead of:

```text
Expected:
"The shipment is delayed because..."
```

evaluate:

```text
Correct root cause?
Relevant?
Grounded?
Complete?
```

---

### Structural assertion

Example:

```json
{
  "status": "completed",
  "root_cause": "...",
  "recommendation": "..."
}
```

Validate schema.

---

### Policy assertion

Example:

```text
Unauthorized request
        ↓
Expected = DENY
```

This should be deterministic.

---

# 10. Golden Dataset Categories

A practical enterprise dataset could be organized as:

| Category     | Purpose                     |
| ------------ | --------------------------- |
| Happy path   | Normal successful workflows |
| Edge cases   | Boundary conditions         |
| Ambiguous    | Clarification behavior      |
| RAG          | Retrieval and grounding     |
| Tool calling | MCP/API behavior            |
| Multi-agent  | Agent coordination          |
| Security     | Authorization               |
| Safety       | Unsafe requests             |
| Failure      | Error handling              |
| Recovery     | Retry/failover              |
| Async        | Long-running workflows      |
| Performance  | Latency/load                |
| Cost         | Token/cost behavior         |
| Regression   | Previously failed cases     |

---

# 11. Golden Dataset Versioning

Treat the dataset like production code.

```text
golden-dataset
│
├── v1.0
├── v1.1
├── v1.2
└── v2.0
```

Each version should have:

```text
Dataset ID
Version
Owner
Domain
Creation Date
Change Reason
Approval
Test Cases
Expected Results
Evaluation Metrics
```

For example:

```json
{
  "dataset_id": "cwd-logistics-golden",
  "version": "2.1.0",
  "owner": "AI-Platform-Team",
  "approved": true,
  "test_case_count": 1250
}
```

---

# 12. Golden Dataset Lifecycle

```text
Business Scenarios
       ↓
Collect Real Examples
       ↓
Remove / Protect Sensitive Data
       ↓
Create Test Cases
       ↓
Define Expected Behavior
       ↓
Expert Review
       ↓
Validate
       ↓
Version
       ↓
Approve
       ↓
Run Evaluation
       ↓
Analyze Failures
       ↓
Improve Agent
       ↓
Re-run Dataset
```

---

# 13. How CWD Uses the Golden Dataset

Suppose you introduce:

```text
New Prompt
```

Evaluation becomes:

```text
Prompt v1
    ↓
Golden Dataset
    ↓
Run 1,000 cases
    ↓
Metrics
```

Then:

```text
Prompt v2
    ↓
Same Golden Dataset
    ↓
Run 1,000 cases
    ↓
Compare
```

Example:

| Metric           |    v1 |    v2 |
| ---------------- | ----: | ----: |
| Intent accuracy  |   94% |   97% |
| Tool accuracy    |   91% |   96% |
| Groundedness     |   93% |   95% |
| Workflow success |   90% |   95% |
| P95 latency      |  4.2s |  4.6s |
| Cost/workflow    | $0.21 | $0.25 |

Now you have an objective basis for deciding whether v2 is better.

---

# 14. Golden Dataset + Agent Evaluation

```text
Golden Dataset
      ↓
Coordinator
      ↓
Evaluate
      ├── Intent
      ├── Planning
      └── Routing
```

Then:

```text
Golden Dataset
      ↓
Delegator
      ↓
Evaluate
      ├── Decomposition
      ├── Worker selection
      └── Aggregation
```

Then:

```text
Golden Dataset
      ↓
Worker
      ↓
Evaluate
      ├── Tool
      ├── RAG
      ├── Business logic
      └── Output
```

---

# 15. Golden Dataset + Workflow Evaluation

This is where the strategy becomes powerful.

```text
Test Case
   ↓
Coordinator
   ↓
Delegator
   ↓
Workers
   ↓
MCP / RAG
   ↓
Aggregation
   ↓
Final Response
   ↓
Evaluation
```

You can evaluate:

```text
Did the workflow select the right path?
Did it complete the business objective?
Did it recover from failures?
Did it stay within the SLA?
Did it stay within budget?
Was the result authorized and safe?
```

---

# 16. Test Case Execution Record

When a test runs, create an evaluation result:

```json
{
  "test_id": "TC-SHIP-001",
  "execution_id": "EVAL-1001",

  "actual": {
    "intent": "root_cause_analysis",
    "delegator": "shipping-delegator",
    "workers": [
      "tracking-worker",
      "delay-analysis-worker"
    ],
    "tools": [
      "get_tracking_events",
      "get_carrier_status"
    ],
    "status": "completed",
    "root_cause": "carrier_capacity"
  },

  "metrics": {
    "intent_accuracy": 1.0,
    "routing_accuracy": 1.0,
    "tool_accuracy": 1.0,
    "business_correctness": 1.0,
    "latency_ms": 4200,
    "cost_usd": 0.24
  },

  "result": "PASS"
}
```

---

# 17. Evaluation Pipeline

Your CWD evaluation pipeline can therefore be:

```text
             GOLDEN DATASET
                    │
                    ▼
              TEST EXECUTOR
                    │
                    ▼
              CWD WORKFLOW
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
 Coordinator    Delegator      Workers
       │            │            │
       └────────────┼────────────┘
                    ▼
             ACTUAL RESULTS
                    │
                    ▼
             EVALUATION ENGINE
                    │
       ┌────────────┼────────────┐
       ▼            ▼            ▼
     Quality    Reliability    Performance
       │            │            │
       └────────────┼────────────┘
                    ▼
              COMPARE WITH
              EXPECTED RESULT
                    │
              ┌─────┴─────┐
              ▼           ▼
            PASS         FAIL
              │           │
              ▼           ▼
           Release      Analyze
                         Failure
```

---

# 18. Golden Dataset + Regression Testing

This is one of the most important uses.

Imagine production discovers:

> Agent selected the wrong Worker.

Create a regression test:

```text
TC-REG-023
```

Add it permanently to the golden dataset.

Now every future release must pass it.

```text
Production Failure
       ↓
Create Test Case
       ↓
Add to Golden Dataset
       ↓
Fix Agent
       ↓
Evaluate
       ↓
Pass
       ↓
Future releases cannot regress
```

This creates a **learning evaluation system**.

---

# 19. Golden Dataset Quality Matters

A bad golden dataset produces bad evaluation.

It should have:

### Diversity

Different users, intents, domains, complexity levels.

### Coverage

Cover important workflows and failure paths.

### Accuracy

Expected results reviewed by domain experts.

### Security

Include authorization boundaries.

### Freshness

Update when policies/business processes change.

### Balance

Don't have 95% easy cases and 5% difficult cases.

### Production relevance

Include real-world patterns, safely anonymized where necessary.

---

# 20. Golden Dataset vs Production Data

Don't simply copy production conversations into the dataset.

Instead:

```text
Production Data
      ↓
Identify Representative Cases
      ↓
Remove / Protect Sensitive Information
      ↓
Expert Validation
      ↓
Expected Outcome Definition
      ↓
Golden Dataset
```

This creates a controlled benchmark.

---

# 21. Evaluation Metrics from Test Cases

Each test case can generate multiple metrics.

```text
Test Case
   │
   ├── Intent Accuracy
   ├── Routing Accuracy
   ├── Tool Accuracy
   ├── RAG Relevance
   ├── Groundedness
   ├── Business Correctness
   ├── Reliability
   ├── Latency
   ├── Token Usage
   ├── Cost
   └── Safety/Security
```

Aggregate them:

```text
1,000 Test Cases
       ↓
Evaluation Engine
       ↓
95% Intent Accuracy
97% Tool Accuracy
94% Groundedness
98% Workflow Reliability
P95 = 4.8 sec
$0.23 / successful workflow
```

---

# 22. Golden Dataset and Release Gates

The final connection is:

```text
                    CODE CHANGE
                         ↓
                  GOLDEN DATASET
                         ↓
                    EVALUATION
                         ↓
       ┌─────────────────┼─────────────────┐
       ▼                 ▼                 ▼
     QUALITY         RELIABILITY         LATENCY
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ▼
                        COST
                         │
                         ▼
                  SAFETY / SECURITY
                         │
                         ▼
                    RELEASE GATE
                    ┌────┴────┐
                    ▼         ▼
                  PASS       FAIL
                    │         │
                    ▼         ▼
                  CANARY    BLOCK
```

---

# 23. Golden Dataset in the CWD Architecture

```text
                       CWD
                        │
                 ┌──────┴──────┐
                 │             │
            Coordinator     Delegator
                 │             │
                 └──────┬──────┘
                        │
                     Workers
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
             RAG                 MCP
              │                   │
              └─────────┬─────────┘
                        │
                   EXECUTION
                        │
                        ▼
                OBSERVABILITY
                        │
                        ▼
               EVALUATION ENGINE
                        ▲
                        │
                 GOLDEN DATASET
                        │
                  TEST CASES
```

The **golden dataset defines what should happen**.

The **CWD execution produces what actually happened**.

The **evaluation engine compares the two**.

---

# 24. The Key Relationship

A very useful mental model is:

```text
Golden Dataset
       ↓
"What should happen?"
       │
       │ compare
       ▼
Actual CWD Execution
       ↓
"What actually happened?"
       │
       ▼
Evaluation
       ↓
"Was it good enough?"
```

And:

```text
Test Case = One scenario
Golden Dataset = Collection of trusted scenarios
Evaluation = Comparison of expected vs actual
Regression = Repeat evaluation after changes
Release Gate = Decision based on evaluation
```

---

# 25. Final Formula

### Golden Dataset

```text
Golden Dataset
=
Representative Business Scenarios
+
Validated Test Cases
+
Expected Behavior
+
Expected Outcomes
+
Evaluation Criteria
+
Versioning
+
Governance
```

### Test Case

```text
Test Case
=
Input
+
Context
+
Expected Intent
+
Expected Agent/Workflow
+
Expected Tools/Evidence
+
Expected Outcome
+
Security Expectations
+
Evaluation Criteria
```

### Overall strategy

```text
Golden Dataset
      +
CWD Execution
      +
Expected vs Actual Comparison
      +
Quality/Reliability/Latency/Cost/Safety Evaluation
      =
Objective Agent & Workflow Evaluation
```

## Final definition

> **A golden dataset in CWD is a governed, version-controlled collection of representative and expert-validated test cases that defines expected agent behavior, workflow execution, business outcomes, security decisions, and evaluation criteria. Each test case represents a specific scenario and is executed against the Coordinator, Delegator, Workers, RAG, MCP, and supporting workflow components. The actual execution is compared with the expected behavior to measure quality, reliability, latency, cost, safety, and business success. The same golden dataset is reused for offline evaluation, regression testing, model/prompt/agent changes, canary validation, and production continuous evaluation.**

### Interview-ready answer

> **“We use golden datasets as the trusted benchmark for CWD evaluation. Each test case represents a realistic business scenario with expected intent, routing, agent selection, tools, evidence, security decision, and business outcome. We execute those cases against the complete Coordinator–Delegator–Worker workflow and compare actual versus expected behavior across quality, reliability, latency, cost, and safety. Whenever we discover a production failure, we convert it into a regression test and add it to the golden dataset, creating a continuous improvement loop.”**
