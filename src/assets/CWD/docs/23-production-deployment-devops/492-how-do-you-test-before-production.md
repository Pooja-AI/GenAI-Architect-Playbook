## How do you test before production?

For **CWD Agentic AI**, I don't rely only on unit testing. Before production, I test **code, integrations, security, Agent behavior, RAG quality, performance, and failure scenarios**.

### Overall flow

```text
Code Change
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
API / Contract Tests
    ↓
Security Tests
    ↓
Agent / LLM Evaluation
    ↓
RAG Evaluation
    ↓
Failure & Resilience Tests
    ↓
Performance / Load Tests
    ↓
Staging / End-to-End Tests
    ↓
Approval
    ↓
Canary Production
```

### 1. Unit testing

I test individual components independently.

For example:

```text
Coordinator
 ├── Intent extraction
 ├── Delegator routing
 └── Result aggregation

Delegator
 └── Worker selection

Worker
 ├── Input validation
 ├── MCP tool selection
 └── Response validation
```

Example:

```python
def test_customer_briefing_routes_to_sales():
    result = coordinator.route(
        intent="customer_briefing",
        customer_id="C12345"
    )

    assert "sales_delegator" in result
```

---

### 2. Integration testing

I test the actual component interactions:

```text
Coordinator
    ↓ A2A
Sales Delegator
    ↓
Customer Worker
    ↓ MCP
Salesforce MCP Server
    ↓
Salesforce
```

I verify:

* A2A communication
* MCP tool calls
* authentication
* authorization
* request/response schemas
* retries/timeouts
* error handling

For external systems, I can use test/sandbox environments rather than production data.

---

### 3. API and contract testing

For FastAPI:

```text
POST /api/v1/customer-briefing
GET  /api/v1/workflows/{workflow_id}
```

I test:

* valid request
* missing `customer_id`
* invalid data types
* unauthorized user
* invalid token
* 404 workflow
* 429 rate limit
* 500/503/504 scenarios
* response schema

I also test contracts between:

```text
Coordinator ↔ Delegator
Delegator ↔ Worker
Worker ↔ MCP
MCP ↔ Enterprise API
```

---

### 4. Security testing

I test:

```text
Authentication
Authorization
Tenant isolation
RBAC
Tool allowlists
Prompt injection
Data exfiltration
Secrets exposure
PII leakage
```

For example, if a user is not authorized for `customer_id=C12345`, the Worker must not retrieve Salesforce data simply because the LLM requested it.

---

### 5. LLM / Agent evaluation

This is especially important for CWD.

I maintain a **golden evaluation dataset** containing:

```text
Normal requests
Edge cases
Ambiguous requests
No-data scenarios
Hallucination cases
Tool failure cases
Authorization cases
Prompt-injection cases
Multi-worker workflows
```

For each case, I evaluate:

```text
Intent accuracy
Delegator routing
Worker selection
Tool-call accuracy
Task completion
Groundedness
Answer relevance
Hallucination
Safety
Latency
Token usage
Cost
```

Example:

```text
Input:
"Give me a complete briefing for customer C12345"

Expected:
Sales Delegator ✓
IT Delegator ✓
Customer Worker ✓
Incident Worker ✓
Correct customer_id ✓
Grounded response ✓
```

---

### 6. RAG testing

For the SharePoint/RAG portion, I test:

```text
Retrieval relevance
Context precision
Context recall
Groundedness
ACL filtering
Tenant filtering
No-result behavior
Index freshness
```

I specifically verify that a user cannot retrieve documents belonging to another tenant or unauthorized customer.

---

### 7. Failure and resilience testing

I deliberately simulate failures.

For example:

```text
Salesforce → timeout
ServiceNow → 503
MCP Server → unavailable
LLM → 429
Worker → failure
Redis → unavailable
Queue → delayed
```

Then verify:

```text
Retry
   ↓
Backoff
   ↓
Circuit breaker
   ↓
Structured error
   ↓
Partial result / resume / HITL
```

For example:

```text
Customer Worker ✓
Opportunity Worker ✓
Incident Worker ✗
        ↓
Checkpoint
        ↓
Retry Incident Worker
        ↓
Aggregate
```

---

### 8. Performance/load testing

I test realistic concurrency before production.

I measure:

```text
Requests/sec
Concurrent workflows
P50/P95/P99 latency
CPU/memory
Queue depth
MCP latency
LLM latency
Token consumption
Error rate
```

I also test downstream limits because CWD may be healthy while Salesforce, ServiceNow, or the model endpoint becomes the bottleneck.

---

### 9. End-to-end staging test

Finally, I run the complete workflow in a production-like environment:

```text
User
 ↓
APIM
 ↓
FastAPI
 ↓
Coordinator
 ↓ A2A
Delegators
 ↓
Workers
 ↓ MCP
Enterprise Systems
 ↓
Validation
 ↓
Aggregation
 ↓
Final Response
```

I verify the complete trace using:

```text
request_id
workflow_id
task_id
trace_id
```

---

### 10. Production approval

Only after the tests pass do I promote the release.

```text
DEV
 ↓
QA
 ↓
STAGING
 ↓
Evaluation Gate
 ↓
Approval
 ↓
Canary
 ↓
Gradual rollout
```

For a **new model or prompt**, I compare it against the current production version using the same golden dataset before allowing production traffic.

---

## Interview-ready answer

> **“Before production, I use multiple testing layers. I start with unit tests for Coordinator, Delegator and Worker logic, followed by integration and contract testing for A2A, MCP and enterprise APIs. Then I perform security testing, RAG evaluation, Agent and LLM evaluation using a golden dataset, and resilience testing for timeouts, 429s, MCP failures and downstream outages. I also run load and performance tests and complete end-to-end tests in a production-like staging environment. For model, prompt or Agent changes, I compare the new version against the approved version on the same evaluation dataset. Only after these gates pass do I deploy through canary and monitor it.”**

### Easy memory

**Code → Integration → Security → AI Eval → RAG → Failure → Performance → E2E → Canary**

### Strong interview line

> **“For Agentic AI, passing unit tests is not enough. I need to prove that the Agent makes the right decisions, selects the right tools, produces grounded results, and behaves safely under failure conditions before I expose it to production.”**
