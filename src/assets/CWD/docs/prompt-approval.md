# Production Prompt Approval Workflow

**Core principle:** In an enterprise AI platform, a prompt should be treated as a **production-controlled artifact**, not simply a text string. Before a prompt can influence production decisions, it must pass technical validation, AI evaluation, security/policy review, business approval, and deployment gates—with every decision recorded in an audit trail.

```text
Author
  │
  ▼
Draft Prompt
  │
  ▼
Technical Validation
  │
  ▼
AI Evaluation / Regression Testing
  │
  ▼
Security & Responsible-AI Review
  │
  ▼
Business Owner Approval
  │
  ▼
Deployment Gate
  │
  ▼
DEV → TEST → UAT → PROD
  │
  ▼
Production Monitoring
  │
  ├── Healthy ──────► Continue
  │
  └── Failed ────────► Rollback
```

## 1. Why Production Prompt Approval Is Required

A prompt can change system behavior without changing application code.

For example:

```text
Prompt v1.4
"Analyze shipment delays and identify the probable root cause."

Prompt v1.5
"Analyze shipment delays and recommend the corrective action
that should be taken."
```

The second prompt has introduced a potentially higher-risk behavior.

Therefore:

```text
Prompt Change
     ↓
Behavior Change
     ↓
Business Impact
     ↓
Governance Required
```

A production prompt should therefore have:

* an owner
* immutable version
* business purpose
* classification
* model compatibility
* evaluation evidence
* security review
* approval record
* deployment history
* rollback target
* audit history

---

# 2. End-to-End Approval Lifecycle

A robust enterprise lifecycle is:

```text
CREATE
  ↓
AUTHOR
  ↓
VALIDATE
  ↓
EVALUATE
  ↓
SECURITY REVIEW
  ↓
BUSINESS APPROVAL
  ↓
DEPLOYMENT GATE
  ↓
PROMOTE
  ↓
MONITOR
  ↓
ROLLBACK / RETIRE
```

Each stage answers a different question.

| Stage             | Key Question                                      |
| ----------------- | ------------------------------------------------- |
| Authoring         | What behavior are we trying to create?            |
| Validation        | Is the prompt structurally and technically valid? |
| Evaluation        | Does it produce acceptable AI behavior?           |
| Security Review   | Is it safe and compliant?                         |
| Business Approval | Does the business owner accept the behavior?      |
| Deployment Gate   | Has every required control passed?                |
| Promotion         | Can this exact version move toward production?    |
| Monitoring        | Does it continue behaving correctly?              |
| Rollback          | What happens if production behavior degrades?     |

---

# 3. Stage 1 — Prompt Authoring

The process begins with a prompt author.

The author should **not directly modify the production prompt**.

Instead:

```text
Developer / Prompt Engineer
          │
          ▼
     Prompt Registry
          │
          ▼
       DRAFT v1
```

Example:

```json
{
  "prompt_id": "shipment-delay-analysis",
  "version": "2.3.0",
  "status": "draft",
  "owner": "AI Platform",
  "domain": "logistics",
  "purpose": "Analyze shipment events and identify probable delay causes."
}
```

The author creates a new version rather than modifying an existing production version.

### Important rule

```text
PROD v2.2.0
    │
    └── never edit

NEW CHANGE
    │
    ▼
PROD v2.3.0 candidate
```

This provides immutable version history.

---

# 4. Stage 2 — Technical Validation

Before evaluating AI behavior, validate the prompt technically.

Typical checks include:

### Syntax

Is the prompt properly structured?

### Variables

Are required variables defined?

```json
{
  "variables": [
    {
      "name": "shipment_id",
      "type": "string",
      "required": true
    },
    {
      "name": "tracking_events",
      "type": "array",
      "required": true
    }
  ]
}
```

### Model compatibility

Can the selected model support:

* required context length?
* structured output?
* tool calling?
* required modalities?
* required system instructions?

### Output contract

For example:

```json
{
  "root_cause": "string",
  "confidence": "number",
  "recommended_action": "string"
}
```

### Policy validation

Check whether the prompt contains:

* prohibited instructions
* unsafe behavior
* unauthorized data handling
* inappropriate system overrides
* secret exposure
* unapproved external instructions

---

# 5. Stage 3 — AI Evaluation

A technically valid prompt is **not automatically a good prompt**.

The candidate version should be tested against an evaluation dataset.

```text
Prompt v2.3
     │
     ▼
Evaluation Dataset
     │
     ├── Accuracy
     ├── Groundedness
     ├── Safety
     ├── Relevance
     ├── Schema Validity
     ├── Consistency
     ├── Latency
     └── Cost
```

Example:

```json
{
  "prompt_version": "2.3.0",
  "dataset": "shipment-regression-v5",
  "metrics": {
    "accuracy": 0.95,
    "groundedness": 0.97,
    "schema_validity": 0.99,
    "safety": 0.99
  },
  "result": "passed"
}
```

The important concept is:

> **Approval should be based on evidence, not simply on the author's confidence.**

---

# 6. Regression Testing

The new prompt should be compared against the currently approved version.

```text
              Evaluation Dataset
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
     Prompt v2.2             Prompt v2.3
          │                     │
          ▼                     ▼
      Results A              Results B
          │                     │
          └──────────┬──────────┘
                     ▼
              Compare Results
```

Example:

| Metric          | v2.2 | v2.3 |
| --------------- | ---: | ---: |
| Accuracy        |  94% |  95% |
| Groundedness    |  96% |  97% |
| Safety          |  99% |  99% |
| Schema validity |  98% |  99% |
| Latency         | 1.8s | 1.9s |

The organization can define promotion thresholds such as:

```text
Accuracy       >= 95%
Groundedness   >= 95%
Safety         >= 99%
Schema Validity >= 99%
```

---

# 7. Stage 4 — Security Review

AI evaluation answers:

> Does the prompt behave correctly?

Security review answers:

> Can this prompt introduce security, privacy, or governance risk?

Typical review areas:

### Data classification

```text
Public
Internal
Confidential
Restricted
```

### Prompt injection resistance

Can untrusted input manipulate the intended instructions?

### Sensitive information

Does the prompt expose or request:

* credentials?
* secrets?
* personal information?
* confidential business data?

### Tool interaction

If the prompt can trigger tools:

```text
LLM
 ↓
Tool recommendation
 ↓
Policy
 ↓
Authorization
 ↓
Tool execution
```

The prompt must **not bypass authorization**.

### Least privilege

A prompt should never be considered a security control by itself.

The architecture should enforce:

```text
Prompt
  ↓
LLM recommendation
  ↓
Policy / IAM
  ↓
Authorized execution
```

---

# 8. Stage 5 — Business Approval

Technical and security approval does not mean the prompt is automatically approved for business use.

The business owner must verify:

* Does the prompt represent the intended business process?
* Is the terminology correct?
* Are recommendations appropriate?
* Are business rules correctly represented?
* Is the risk level acceptable?
* Is human approval required?
* Is the output suitable for downstream processes?

Example:

```text
AI Platform Team
       │
       ▼
Technical Approval
       │
       ▼
Security Approval
       │
       ▼
Logistics Business Owner
       │
       ▼
Business Approval
```

This creates separation of duties.

---

# 9. Stage 6 — Deployment Gates

A deployment gate determines whether the prompt is actually eligible for promotion.

For example:

```python
def production_gate(prompt):
    return (
        prompt.validation_passed
        and prompt.evaluation_passed
        and prompt.security_approved
        and prompt.business_approved
        and prompt.model_compatible
    )
```

Conceptually:

```text
Validation ────────┐
Evaluation ────────┤
Security ──────────┤
Business Approval ─┤──► PROD Gate
Model Compatibility┘
```

If any mandatory control fails:

```text
                    ┌── PASS ──► Promotion
Deployment Gate ────┤
                    └── FAIL ──► STOP
```

The important point is that **the application cannot simply bypass the gate by changing a configuration value**.

---

# 10. Controlled Environment Promotion

Prompts should move through controlled environments.

```text
DEV
 │
 ▼
TEST
 │
 ▼
UAT
 │
 ▼
PROD
```

Each environment represents a controlled stage.

### DEV

Authoring and experimentation.

### TEST

Automated validation and evaluation.

### UAT

Business validation.

### PROD

Production-approved version only.

Example:

```text
shipment-delay-analysis

DEV
 └── v2.3.0

TEST
 └── v2.3.0

UAT
 └── v2.3.0

PROD
 └── v2.2.0
```

After approval:

```text
PROD
 └── v2.3.0
```

---

# 11. Promotion Should Be Version-Based

Do not promote:

```text
"whatever is currently in DEV"
```

Instead promote:

```text
prompt_id = shipment-delay-analysis
version   = 2.3.0
```

This creates deterministic deployment.

```text
DEV artifact
     │
     ▼
Prompt v2.3.0
     │
     ├── Tests
     ├── Evaluation
     ├── Security
     └── Approval
            │
            ▼
       TEST/UAT
            │
            ▼
           PROD
```

The exact artifact that was evaluated should be the artifact that is promoted.

---

# 12. Prompt Registry as the Control Plane

The Prompt Registry becomes the authoritative source.

```text
                 ┌──────────────────────┐
                 │    Prompt Registry   │
                 ├──────────────────────┤
                 │ ID                   │
                 │ Version              │
                 │ Content              │
                 │ Owner                │
                 │ Classification       │
                 │ Model Compatibility  │
                 │ Evaluation           │
                 │ Approval             │
                 │ Deployment           │
                 │ Status               │
                 └──────────┬───────────┘
                            │
                 ┌──────────┴───────────┐
                 ▼                      ▼
              CWD Agent              Evaluation
                 │
                 ▼
             LangGraph
                 │
                 ▼
                LLM
```

The application should reference:

```python
prompt_id = "shipment-delay-analysis"
```

rather than embedding:

```python
prompt = """
very long production prompt...
"""
```

inside application code.

---

# 13. Prompt + CWD Integration

This becomes particularly important in your CWD architecture.

```text
User
 │
 ▼
Coordinator
 │
 ▼
LangGraph
 │
 ▼
Delegator
 │
 ▼
Worker
 │
 ▼
Prompt Registry
 │
 ├── prompt_id
 ├── approved version
 ├── model compatibility
 ├── policy metadata
 └── environment
 │
 ▼
LLM
```

The Worker does not simply retrieve any prompt.

It requests an eligible prompt:

```text
Worker
  │
  ▼
Prompt Registry
  │
  ├── Prompt ID
  ├── Environment = PROD
  ├── Status = ACTIVE
  ├── Approved = TRUE
  ├── Model compatible = TRUE
  └── Policy compatible = TRUE
          │
          ▼
       Prompt v2.3.0
```

---

# 14. LangGraph and Prompt Approval

LangGraph manages the **workflow**, while the Prompt Registry manages the **prompt artifact**.

For example:

```text
START
  │
  ▼
Resolve Prompt
  │
  ▼
Validate Prompt
  │
  ▼
Execute LLM
  │
  ▼
Validate Output
  │
  ├──── success ───► Continue
  │
  └──── failure ───► Recovery
```

LangGraph state can record:

```python
state["prompt_id"] = "shipment-delay-analysis"
state["prompt_version"] = "2.3.0"
state["model"] = "approved-model"
```

This is important for reproducibility.

If a workflow fails three hours later, you know:

```text
Which prompt?
Which version?
Which model?
Which workflow?
Which agent?
Which task?
```

---

# 15. Audit Trail

Every important prompt lifecycle event should be recorded.

Example:

```json
{
  "prompt_id": "shipment-delay-analysis",
  "version": "2.3.0",
  "events": [
    {
      "event": "created",
      "actor": "prompt-engineer",
      "timestamp": "2026-09-01T10:00:00Z"
    },
    {
      "event": "evaluation_passed",
      "actor": "evaluation-pipeline",
      "timestamp": "2026-09-01T11:30:00Z"
    },
    {
      "event": "security_approved",
      "actor": "security-team",
      "timestamp": "2026-09-02T09:00:00Z"
    },
    {
      "event": "business_approved",
      "actor": "logistics-owner",
      "timestamp": "2026-09-02T14:00:00Z"
    },
    {
      "event": "deployed",
      "environment": "production",
      "timestamp": "2026-09-03T08:00:00Z"
    }
  ]
}
```

This allows questions such as:

> Who approved this prompt?

> Which evaluation was used?

> When did it enter production?

> Which version was active yesterday?

> Why was this version deployed?

> Who rolled it back?

---

# 16. Audit Trail vs Observability

These are related but different.

| Audit                       | Observability                |
| --------------------------- | ---------------------------- |
| Who approved?               | How long did execution take? |
| What version was deployed?  | How many tokens were used?   |
| Who changed the prompt?     | What was the latency?        |
| Which approval gate passed? | How often did it fail?       |
| Why was it rolled back?     | Which node was slow?         |

Therefore:

```text
Prompt Registry
     │
     ├── Governance / Audit
     │
     └── Deployment metadata

Observability Platform
     │
     ├── Logs
     ├── Metrics
     ├── Traces
     └── Runtime performance
```

---

# 17. Controlled Promotion with Canary Release

For high-risk prompts, don't necessarily move:

```text
100% PROD
```

immediately.

Use:

```text
             PROD
              │
       ┌──────┴──────┐
       ▼             ▼
   v2.2.0          v2.3.0
    95%              5%
```

Monitor:

* error rate
* quality
* safety
* latency
* cost
* business KPIs

If healthy:

```text
5% → 25% → 50% → 100%
```

If unhealthy:

```text
v2.3.0
   ↓
rollback
   ↓
v2.2.0
```

This makes prompt deployment closer to **software release engineering**.

---

# 18. Rollback

Every production deployment should have a known-good version.

```text
Current
  v2.3.0
     │
     │ failure
     ▼
Rollback
     │
     ▼
Stable
  v2.2.0
```

Rollback should reference an immutable version:

```json
{
  "prompt_id": "shipment-delay-analysis",
  "rollback_from": "2.3.0",
  "rollback_to": "2.2.0",
  "reason": "Production regression",
  "approved_by": "AI-Governance"
}
```

Never recreate an old prompt from memory.

Restore the exact registered artifact.

---

# 19. Separation of Responsibilities

A strong enterprise workflow separates responsibilities.

| Responsibility       | Owner                            |
| -------------------- | -------------------------------- |
| Prompt authoring     | Prompt Engineer / Developer      |
| Technical validation | AI Platform                      |
| Evaluation           | AI Evaluation Pipeline           |
| Security review      | Security / Responsible AI        |
| Business approval    | Business Owner                   |
| Deployment           | Platform / DevOps                |
| Governance           | AI Governance                    |
| Runtime execution    | CWD / Agents                     |
| Monitoring           | Platform / SRE                   |
| Rollback decision    | Authorized Operations/Governance |

This prevents:

```text
Developer creates prompt
       ↓
Developer approves prompt
       ↓
Developer deploys prompt
```

from becoming the only control path.

Instead:

```text
Author
  ↓
Validate
  ↓
Evaluate
  ↓
Security
  ↓
Business
  ↓
Deployment
```

---

# 20. Complete Enterprise Workflow

Putting everything together:

```text
┌───────────────────────────────┐
│         PROMPT AUTHOR         │
└───────────────┬───────────────┘
                │
                ▼
       ┌─────────────────┐
       │ Prompt Registry │
       │    DRAFT vX     │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Technical       │
       │ Validation      │
       └────────┬────────┘
                │ PASS
                ▼
       ┌─────────────────┐
       │ AI Evaluation   │
       │ + Regression    │
       └────────┬────────┘
                │ PASS
                ▼
       ┌─────────────────┐
       │ Security /      │
       │ Policy Review   │
       └────────┬────────┘
                │ APPROVED
                ▼
       ┌─────────────────┐
       │ Business Owner  │
       │ Approval        │
       └────────┬────────┘
                │ APPROVED
                ▼
       ┌─────────────────┐
       │ Deployment Gate │
       └────────┬────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
       UAT               PROD
        │                 │
        ▼                 ▼
    Validation       Canary/Release
                          │
                          ▼
                    Monitoring
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                  Healthy     Failure
                    │           │
                    ▼           ▼
                 Continue     Rollback
```

---

# 21. Example Prompt Approval Record

A production-ready record might look like:

```json
{
  "prompt_id": "shipment-delay-analysis",
  "version": "2.3.0",

  "content_hash": "sha256:abc123",

  "owner": {
    "team": "AI Platform",
    "business_owner": "Logistics Operations"
  },

  "classification": {
    "data": "internal",
    "risk": "medium"
  },

  "model_compatibility": {
    "models": [
      "approved-model-v1"
    ],
    "structured_output": true
  },

  "validation": {
    "status": "passed"
  },

  "evaluation": {
    "dataset": "shipment-regression-v5",
    "accuracy": 0.95,
    "groundedness": 0.97,
    "safety": 0.99,
    "schema_validity": 0.99,
    "status": "passed"
  },

  "security_review": {
    "status": "approved",
    "approval_id": "SEC-9081"
  },

  "business_approval": {
    "status": "approved",
    "approval_id": "BUS-7712"
  },

  "deployment": {
    "environment": "production",
    "strategy": "canary",
    "status": "active"
  },

  "rollback": {
    "previous_version": "2.2.0"
  }
}
```

---

# 22. What Happens When a Prompt Fails?

Suppose evaluation gives:

```text
v2.3.0

Accuracy:       91%
Required:       95%

Result: FAILED
```

The workflow should be:

```text
Evaluation Failed
       │
       ▼
Deployment BLOCKED
       │
       ▼
Prompt returned to Author
       │
       ▼
Create v2.3.1
       │
       ▼
Evaluate again
```

It should **not** be:

```text
Evaluation Failed
       ↓
Developer deploys anyway
```

---

# 23. Prompt Approval State Machine

A useful state model is:

```text
DRAFT
  │
  ▼
VALIDATING
  │
  ▼
TESTING
  │
  ▼
IN_REVIEW
  │
  ├── rejected ──► DRAFT
  │
  ▼
APPROVED
  │
  ▼
DEPLOYING
  │
  ▼
ACTIVE
  │
  ├── issue ─────► ROLLED_BACK
  │
  ▼
DEPRECATED
  │
  ▼
RETIRED
```

This gives the Prompt Registry explicit lifecycle control.

---

# 24. Critical Enterprise Rules

### Rule 1 — Never edit production prompts in place

```text
v2.2.0 → immutable
v2.3.0 → new version
```

### Rule 2 — Approval belongs to a specific version

Not:

```text
"Shipment prompt is approved."
```

Instead:

```text
shipment-delay-analysis v2.3.0 is approved.
```

### Rule 3 — Evaluation evidence must accompany approval

```text
Approval
   +
Evaluation evidence
   +
Security review
```

### Rule 4 — Promotion must be controlled

```text
DEV → TEST → UAT → PROD
```

### Rule 5 — Production must have rollback

```text
Current Version → Known Good Version
```

### Rule 6 — Record the exact runtime version

For reproducibility:

```text
Prompt ID
+
Prompt Version
+
Model Version
+
Workflow Version
+
Relevant Context
```

### Rule 7 — LLM cannot approve its own prompt

LLMs can assist evaluation, but governance controls should remain outside the model's own generated response.

---

# 25. How This Fits the Overall CWD Control Plane

Your enterprise architecture can be viewed as:

```text
                  ┌─────────────────────┐
                  │      CWD            │
                  │ Coordinator         │
                  │ Delegator           │
                  │ Worker              │
                  └──────────┬──────────┘
                             │
       ┌─────────────────────┼─────────────────────┐
       │                     │                     │
       ▼                     ▼                     ▼
 Agent Registry        Prompt Registry       Policy / IAM
 "Who can do it?"      "What prompt?"        "Is it allowed?"
       │                     │                     │
       └─────────────────────┼─────────────────────┘
                             │
                             ▼
                       LangGraph
                    Workflow / State
                             │
                             ▼
                            LLM
                             │
                             ▼
                       MCP / Tools
```

This creates a clean separation:

```text
Agent Registry
     ↓
WHO can perform the task?

Prompt Registry
     ↓
WHAT governed AI instruction should be used?

Policy / IAM
     ↓
IS the operation allowed?

LangGraph
     ↓
WHAT HAPPENS NEXT?

MCP
     ↓
HOW does the Worker interact with enterprise capabilities?
```

---

# 26. Architect-Level Formula

The entire production approval process can be summarized as:

```text
Production Prompt Governance
=
Authoring
+ Versioning
+ Technical Validation
+ Evaluation
+ Regression Testing
+ Security Review
+ Business Approval
+ Deployment Gates
+ Controlled Promotion
+ Audit Trail
+ Monitoring
+ Rollback
```

### Final definition

> **Production prompt approval is the governed lifecycle through which an enterprise AI platform authors, validates, evaluates, security-reviews, business-approves, deploys, audits, monitors, and—when necessary—rolls back an immutable prompt version before and after it is allowed to influence production AI behavior.**

### Interview-ready answer

> “In an enterprise platform, prompts are treated as versioned production artifacts. A new prompt starts in the Prompt Registry as a draft, passes technical validation and automated AI evaluation/regression testing, undergoes security and policy review, and then requires business-owner approval. A deployment gate verifies that all mandatory controls have passed before the exact immutable version is promoted through DEV, TEST, UAT, and PROD. Every lifecycle event is recorded for auditability, and production releases use controlled rollout and a known-good rollback version. CWD and LangGraph execute the approved prompt, while the Prompt Registry remains responsible for prompt lifecycle and governance.”
