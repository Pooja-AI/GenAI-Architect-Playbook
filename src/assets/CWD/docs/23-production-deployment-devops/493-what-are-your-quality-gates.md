## What are your quality gates?

For **CWD**, quality gates are checkpoints in the CI/CD pipeline that must pass before a release can move to the next environment.

I use gates across **code quality, security, APIs, Agent behavior, RAG, performance, and production readiness**.

### CWD quality-gate flow

```text
Developer
   ↓
Code Quality Gate
   ↓
Unit Test Gate
   ↓
Security Gate
   ↓
API / Contract Gate
   ↓
Integration Gate
   ↓
Agent / LLM Evaluation Gate
   ↓
RAG Quality Gate
   ↓
Performance Gate
   ↓
Resilience Gate
   ↓
Staging / E2E Gate
   ↓
Approval Gate
   ↓
Canary
```

### 1. Code quality gate

Before merging:

```text
✓ Linting
✓ Formatting
✓ Type checking
✓ Code coverage
✓ Static analysis
```

For Python, tools could include:

```text
Ruff
Pyright / mypy
pytest
```

I don't use a single universal coverage number; the threshold is defined by the project's risk and testing policy.

---

### 2. Unit-test gate

I verify:

```text
Coordinator routing
Delegator selection
Worker logic
Validation
Reducers
Error handling
Retry logic
```

Example:

```text
Customer Briefing
       ↓
Sales Delegator ✓
IT Delegator ✓
```

If the routing logic fails → **pipeline stops**.

---

### 3. Security gate

I check:

```text
✓ Dependency vulnerabilities
✓ Container vulnerabilities
✓ Secret scanning
✓ SAST
✓ Authentication
✓ Authorization
✓ RBAC
✓ Tenant isolation
✓ MCP tool permissions
```

For example, a Worker attempting to call an unauthorized MCP tool must fail the test.

---

### 4. API / contract gate

I verify that contracts haven't unexpectedly changed:

```text
FastAPI ↔ Client
Coordinator ↔ Delegator
Delegator ↔ Worker
Worker ↔ MCP
MCP ↔ Enterprise API
```

I validate:

* request schemas
* response schemas
* required fields
* error codes
* backward compatibility

---

### 5. Integration gate

I test the actual CWD flow:

```text
Coordinator
    ↓ A2A
Delegator
    ↓
Worker
    ↓ MCP
Salesforce / ServiceNow / Snowflake / SharePoint
```

Authentication, authorization, timeout, retry and response normalization must work.

---

## 6. Agent / LLM quality gate

This is one of my most important gates.

I run the **golden dataset** against the new Agent/prompt/model version.

I measure:

```text
Intent accuracy
Delegator routing
Worker selection
Tool-call accuracy
Task completion
Groundedness
Hallucination
Safety
```

For example:

```text
Current model → 94% task completion
New model     → 82%
```

If the new version violates the project's approved quality threshold, **it does not move to production**.

---

## 7. RAG quality gate

For CWD's SharePoint/RAG workflows:

```text
Retrieval relevance
Context precision
Context recall
Groundedness
ACL filtering
Tenant filtering
No-result handling
Index freshness
```

A retrieval regression can block the release even if the API and code tests pass.

---

## 8. Performance gate

I verify:

```text
P95/P99 latency
Throughput
Concurrent workflows
LLM latency
MCP latency
Queue depth
Token consumption
Cost
```

I compare against the application's agreed SLOs/budgets rather than using arbitrary universal numbers.

---

## 9. Resilience gate

I intentionally test failures:

```text
LLM → 429
MCP → timeout
Salesforce → 503
ServiceNow → unavailable
Worker → failure
Queue → delay
```

Expected behavior:

```text
Retry → Backoff → Circuit breaker
              ↓
       Partial result /
       Resume / HITL
```

No uncontrolled retry loops and no hallucinated fallback data.

---

## 10. End-to-end gate

I execute a complete Customer Briefing:

```text
User
 ↓
APIM
 ↓
FastAPI
 ↓
Coordinator
 ↓ A2A
Sales Delegator + IT Delegator
 ↓
Workers
 ↓ MCP
Salesforce + ServiceNow
 ↓
Validation
 ↓
Aggregation
 ↓
Final Response
```

I verify the complete trace and workflow state.

---

## 11. Production-readiness gate

Before production, I also verify:

```text
✓ Monitoring configured
✓ Alerts configured
✓ Dashboards available
✓ Logs/traces available
✓ Rollback tested
✓ Secrets configured
✓ Autoscaling configured
✓ Health/readiness probes
✓ Runbooks available
✓ Disaster-recovery considerations
```

---

## What actually blocks deployment?

A useful interview distinction:

| Gate                 | Example failure                 | Action |
| -------------------- | ------------------------------- | ------ |
| Code                 | Type/test failure               | Block  |
| Security             | Critical vulnerability          | Block  |
| Contract             | Breaking API change             | Block  |
| Integration          | MCP failure                     | Block  |
| Agent quality        | Routing/task-quality regression | Block  |
| RAG                  | ACL/retrieval regression        | Block  |
| Performance          | SLO violation                   | Block  |
| Resilience           | Unhandled dependency failure    | Block  |
| E2E                  | Customer Briefing fails         | Block  |
| Production readiness | No rollback/monitoring          | Block  |

Not every metric must be perfect, but **predefined release criteria must be satisfied**.

### Interview-ready answer

> **“My quality gates are layered. I start with code quality and unit tests, then security and API contract tests, followed by integration testing for A2A, MCP and enterprise systems. For Agentic AI, I have additional gates for Agent routing, tool selection, task completion, groundedness, hallucination and safety using a golden evaluation dataset. I also gate RAG quality, performance, resilience and end-to-end behavior. Finally, I verify observability, alerting and rollback readiness. If a release violates a predefined critical threshold, the pipeline stops and it doesn't reach production.”**

### Strong interview line

> **“For CWD, quality gates validate not just whether the code works, but whether the Agent behaves correctly, safely, reliably and within its production SLOs.”**
