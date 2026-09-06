# Enterprise Prompt Metadata

In an enterprise AI platform, **prompt metadata is the information that describes, governs, validates, deploys, and tracks a prompt independently of the prompt text itself**.

A useful mental model is:

```text
Prompt Content
      +
Prompt Metadata
      ↓
Governed Prompt Artifact
```

For CWD, this metadata allows the platform to answer:

> **What is this prompt, who owns it, why does it exist, where can it run, which models can use it, what inputs does it require, whether it is approved, how well has it performed, and where has it been used?**

---

# 1. Prompt Metadata Architecture

A production prompt can be represented as:

```text
                       ENTERPRISE PROMPT
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
          Identity        Governance       Runtime
              │               │                │
         Name/Version      Owner/Status     Model
         Purpose           Approval         Variables
         Domain            Classification   Environment
              │               │                │
              └───────────────┼────────────────┘
                              │
                              ▼
                         Evaluation
                              │
                              ▼
                         Usage History
```

So:

```text
Enterprise Prompt Metadata
=
Identity
+ Ownership
+ Purpose
+ Model Compatibility
+ Input Contract
+ Environment
+ Domain
+ Lifecycle Status
+ Evaluation
+ Approval
+ Usage
```

---

# 2. Prompt Name

The **prompt name** provides the logical identity of the prompt.

Example:

```text
shipment-delay-analysis
```

or:

```text
customer-support-response
```

The name should describe the business/technical purpose rather than the implementation.

Good:

```text
shipment-delay-analysis
```

Less useful:

```text
prompt_final_v7
```

The prompt name becomes the stable identifier while versions evolve underneath it.

```text
shipment-delay-analysis
       │
       ├── v1.0.0
       ├── v2.0.0
       ├── v2.1.0
       └── v2.2.0
```

---

# 3. Prompt Version

The version identifies the exact implementation.

```text
prompt_id:
shipment-delay-analysis

version:
2.2.0
```

This is essential for:

* reproducibility
* rollback
* comparison
* auditing
* deployment
* debugging

For example:

```text
Agent:
shipping-agent

Prompt:
shipment-delay-analysis

Version:
2.2.0
```

Now you know exactly which prompt was used.

---

# 4. Owner

Every enterprise prompt should have an accountable owner.

Example:

```json
{
  "owner": {
    "team": "AI Platform",
    "business_owner": "Logistics Operations",
    "technical_owner": "Agent Engineering"
  }
}
```

Ownership answers:

> Who is responsible for maintaining this prompt?

The owner may be responsible for:

* prompt quality
* updates
* testing
* documentation
* approval coordination
* retirement
* incident response

Without ownership, prompts become orphaned production assets.

---

# 5. Purpose

The purpose describes **why the prompt exists**.

Example:

```text
Purpose:
Analyze shipment tracking information and determine
the probable cause of a shipment delay.
```

This is important because two prompts may look similar but have different intended use.

For example:

```text
shipment-delay-analysis
```

versus:

```text
shipment-delay-customer-response
```

The first determines the cause.

The second converts the analysis into a customer-facing response.

---

# 6. Model Compatibility

Prompts should contain metadata describing which models they support.

Example:

```json
{
  "model_compatibility": {
    "supported_models": [
      "model-a",
      "model-b"
    ],
    "minimum_context_window": 32000,
    "structured_output_required": true
  }
}
```

Why?

Because:

```text
Prompt A + Model A
```

may work well while:

```text
Prompt A + Model B
```

may produce different results.

Compatibility can include:

* model family
* model version
* context window
* structured-output support
* tool-calling support
* multimodal requirements
* tokenizer considerations
* known limitations

---

# 7. Variables

Enterprise prompts frequently contain dynamic variables.

Example:

```text
Analyze shipment {{shipment_id}} using the following
tracking events:

{{tracking_events}}

Carrier status:

{{carrier_status}}
```

Metadata should define those variables.

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
    },
    {
      "name": "carrier_status",
      "type": "string",
      "required": false
    }
  ]
}
```

This creates a formal **prompt input contract**.

---

# 8. Variable Validation

The registry can enforce:

```text
Required?
Type?
Length?
Allowed values?
Classification?
Source?
```

For example:

```text
shipment_id
    │
    ├── required = true
    ├── type = string
    └── max_length = 50
```

The application should not blindly insert arbitrary data into the prompt.

Instead:

```text
Input
  ↓
Schema Validation
  ↓
Policy Validation
  ↓
Prompt Rendering
  ↓
LLM
```

---

# 9. Environment

A prompt needs to know where it is deployed.

Typical environments:

```text
DEV
TEST
UAT
PRODUCTION
```

Example:

```json
{
  "environment": "production"
}
```

But deployment metadata is often better represented separately:

```text
Prompt v2.2
 │
 ├── DEV        → active
 ├── TEST       → active
 ├── UAT        → active
 └── PROD       → active
```

This allows the same logical prompt to have controlled promotion across environments.

---

# 10. Domain

Domain identifies the business or technical area.

Examples:

```text
logistics
finance
customer-support
manufacturing
supply-chain
HR
IT
```

Example:

```json
{
  "domain": "logistics"
}
```

Domain metadata helps with:

* discovery
* ownership
* access control
* routing
* governance
* reporting

For example:

```text
Domain = logistics
        ↓
Allowed Agents
        ↓
Shipping Agent
        ↓
Allowed Prompt Namespace
        ↓
logistics/*
```

---

# 11. Status

Status describes the prompt's lifecycle state.

For example:

```text
DRAFT
IN_REVIEW
TESTING
APPROVED
DEPLOYED
ACTIVE
SUSPENDED
DEPRECATED
ROLLED_BACK
RETIRED
REJECTED
```

Example:

```json
{
  "status": "approved"
}
```

But in production, you may want separate statuses:

```text
Lifecycle Status:
ACTIVE

Approval Status:
APPROVED

Deployment Status:
PRODUCTION

Evaluation Status:
PASSED
```

This avoids putting too many meanings into one field.

---

# 12. Evaluation Results

Evaluation metadata answers:

> How well did this prompt perform?

Example:

```json
{
  "evaluation": {
    "dataset": "shipment-regression-v4",
    "accuracy": 0.95,
    "groundedness": 0.97,
    "safety": 0.99,
    "schema_validity": 0.99,
    "average_latency_ms": 1850,
    "status": "passed"
  }
}
```

This allows comparison:

```text
                 v2.1       v2.2

Accuracy          92%        95%
Groundedness      93%        97%
Safety            98%        99%
Schema validity   96%        99%
```

The important principle is:

> **Evaluation results belong to a specific prompt version.**

---

# 13. Evaluation Dataset

The metadata should identify which evaluation dataset produced the result.

```text
Prompt:
shipment-delay-analysis:v2.2

Evaluation Dataset:
shipment-regression-v4
```

Otherwise, this:

```text
Accuracy = 95%
```

doesn't mean much.

You need:

```text
95%
+
Dataset
+
Model
+
Evaluation Version
```

to make the result meaningful.

---

# 14. Approval Information

Approval metadata records governance decisions.

Example:

```json
{
  "approval": {
    "required": true,
    "status": "approved",
    "approved_by": "AI-Governance",
    "approved_at": "2026-09-06T14:30:00Z",
    "approval_id": "APR-90821"
  }
}
```

This answers:

* Who approved it?
* When?
* Which version?
* What approval record?
* Was approval required?

Approval must be tied to the **specific prompt version**.

---

# 15. Usage History

Usage history answers:

> Where and how has this prompt been used?

For example:

```text
shipment-delay-analysis:v2.2
        │
        ├── shipping-agent
        ├── delay-analysis-worker
        ├── production
        ├── 125,430 executions
        └── last used: 2026-09-06
```

Usage information can include:

```text
Agent
Workflow
Environment
Invocation count
Last used
Success rate
Failure rate
Latency
Token usage
Model
Tenant/business unit
```

Be careful with sensitive information in usage logs; usage metadata should follow enterprise privacy and retention policies.

---

# 16. Complete Prompt Metadata Example

A realistic conceptual record could look like:

```json
{
  "prompt_id": "shipment-delay-analysis",
  "name": "Shipment Delay Analysis",
  "version": "2.2.0",

  "purpose": "Analyze shipment events and determine probable delay cause.",

  "owner": {
    "team": "AI Platform",
    "business_owner": "Logistics Operations"
  },

  "domain": "logistics",

  "classification": {
    "data": "internal",
    "risk": "medium"
  },

  "model_compatibility": {
    "supported_models": [
      "model-a",
      "model-b"
    ],
    "structured_output": true
  },

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
    },
    {
      "name": "carrier_status",
      "type": "string",
      "required": false
    }
  ],

  "environment": "production",

  "status": "active",

  "evaluation": {
    "dataset": "shipment-regression-v4",
    "accuracy": 0.95,
    "groundedness": 0.97,
    "safety": 0.99,
    "schema_validity": 0.99,
    "status": "passed"
  },

  "approval": {
    "status": "approved",
    "approved_by": "AI-Governance",
    "approval_id": "APR-90821"
  },

  "usage": {
    "invocation_count": 125430,
    "last_used": "2026-09-06T15:10:00Z",
    "success_rate": 0.98
  }
}
```

---

# 17. Metadata Categories

For architecture purposes, I would group metadata into these categories:

| Category           | Examples                                  |
| ------------------ | ----------------------------------------- |
| **Identity**       | name, prompt_id, version                  |
| **Ownership**      | owner, team, business owner               |
| **Purpose**        | description, business use case            |
| **Classification** | data class, risk level                    |
| **Domain**         | logistics, finance, support               |
| **Model**          | supported model/version                   |
| **Input Contract** | variables, types, required fields         |
| **Environment**    | DEV, TEST, UAT, PROD                      |
| **Lifecycle**      | draft, approved, active, retired          |
| **Evaluation**     | accuracy, groundedness, safety            |
| **Approval**       | approver, timestamp, approval ID          |
| **Deployment**     | deployment version, strategy, timestamp   |
| **Usage**          | invocation count, agents, workflows       |
| **Audit**          | created/modified/deployed/rollback events |

---

# 18. Metadata in CWD

Now connect this to CWD.

```text
                       Prompt Registry
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
            ▼                 ▼                 ▼
        Identity          Governance         Runtime
            │                 │                 │
       Name/Version       Owner/Approval     Model
       Purpose            Classification     Variables
       Domain             Status             Environment
            │                 │                 │
            └─────────────────┼─────────────────┘
                              ▼
                         Evaluation
                              │
                              ▼
                         Usage History
                              │
                              ▼
                       CWD Runtime
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         Coordinator      Delegator         Worker
```

---

# 19. Metadata Used During Runtime

Not all metadata is only for governance.

Some metadata directly affects runtime decisions.

For example:

```text
Prompt Registry
      │
      ▼
Prompt Resolution
      │
      ├── Agent = shipping-agent
      ├── Domain = logistics
      ├── Environment = production
      ├── Model = compatible
      ├── Status = active
      └── Policy = allowed
      │
      ▼
Prompt v2.2
```

This prevents an agent from accidentally loading:

```text
DRAFT
```

or:

```text
RETIRED
```

or:

```text
UAT-only
```

prompt versions.

---

# 20. Metadata + Agent Registry

The two registries work together.

```text
Agent Registry
      │
      │
      └── "Which agent?"
              │
              ▼
       shipping-agent
              │
              ▼
Prompt Registry
              │
              │
              └── "Which prompt?"
                      │
                      ▼
             shipment-delay-analysis
                      │
                      ▼
                    v2.2
```

So:

```text
Agent Registry → Agent metadata
Prompt Registry → Prompt metadata
```

---

# 21. Metadata + Policy

Policy can use metadata for authorization.

For example:

```text
Prompt:
financial-risk-analysis

Domain:
finance

Classification:
restricted

Risk:
high

Environment:
production
```

Policy can evaluate:

```text
Is this agent allowed to use
a high-risk restricted finance prompt
in production?
```

Therefore:

```text
Prompt Metadata
       +
Agent Identity
       +
Context
       ↓
Policy
       ↓
ALLOW / DENY
```

---

# 22. Metadata + LangGraph

LangGraph can store prompt metadata in workflow state.

For example:

```python
state["prompt_id"] = "shipment-delay-analysis"
state["prompt_version"] = "2.2.0"
state["model"] = "model-a"
```

Then the workflow checkpoint contains the prompt identity.

This is valuable for:

* recovery
* debugging
* audit
* reproducibility

Example:

```text
Workflow WF-1001
       │
       ├── Agent: shipping-agent
       ├── Prompt: shipment-delay-analysis
       ├── Version: 2.2.0
       └── Model: model-a
```

---

# 23. Metadata + Observability

Your production logs can correlate:

```text
correlation_id
workflow_id
task_id
agent_id
prompt_id
prompt_version
model_id
environment
```

Example:

```text
CORR-7890
 │
 ├── Agent = shipping-agent
 ├── Workflow = WF-1001
 ├── Prompt = shipment-delay-analysis
 ├── Version = 2.2.0
 ├── Model = model-a
 └── Result = completed
```

This creates end-to-end traceability.

---

# 24. Static vs Dynamic Metadata

An important architect-level distinction is:

### Static metadata

Changes relatively infrequently:

```text
Name
Purpose
Owner
Domain
Classification
Variables
Model compatibility
```

### Dynamic metadata

Changes during runtime:

```text
Usage count
Current deployment
Health of dependent services
Latency
Success rate
Last used
Evaluation trend
```

Therefore you might architect:

```text
                 Prompt Registry
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       Metadata Store       Runtime Metrics
             │                   │
             │                   ▼
             │              Observability
             │
             ▼
       Prompt Resolution
```

Don't turn the registry into your entire observability platform.

---

# 25. Metadata Enables Reproducibility

Suppose a production incident occurs.

You have:

```text
Correlation ID = CORR-7890
```

Using metadata you find:

```text
Agent:
shipping-agent

Prompt:
shipment-delay-analysis

Version:
2.2.0

Model:
model-a

Environment:
production

Evaluation:
passed

Approval:
APR-90821
```

You can reconstruct the execution context much more reliably.

This is the enterprise meaning of **traceability**.

---

# 26. Metadata Enables Governance

Governance becomes queryable.

For example:

```text
Find all:

prompts
WHERE
domain = "finance"
AND risk_level = "high"
AND environment = "production"
AND approval_status != "approved"
```

Or:

```text
Find all:

prompts
WHERE
status = "deprecated"
AND usage_count > 0
```

This allows governance teams to identify problems proactively.

---

# 27. Metadata Enables Impact Analysis

Suppose:

```text
shipment-delay-analysis:v2.2
```

needs to be retired.

Usage metadata tells you:

```text
Used by:
 ├── shipping-agent
 ├── delay-worker
 ├── workflow-1001
 └── workflow-1007
```

You can then determine:

```text
Can I safely retire this prompt?
```

This is much safer than deleting a file from a repository.

---

# 28. Metadata Enables Controlled Model Migration

Suppose an organization wants to migrate:

```text
Model A → Model B
```

The registry can answer:

```text
Which prompts support Model B?
```

For example:

```text
Prompt A → Model A ✓ Model B ✓
Prompt B → Model A ✓ Model B ✗
Prompt C → Model A ✓ Model B ✓
```

Now model migration becomes an enterprise-managed process.

---

# 29. Most Important Mental Model

Think of prompt metadata in four layers:

```text
┌─────────────────────────────┐
│ 1. IDENTITY                 │
│ Name / Version / Purpose    │
├─────────────────────────────┤
│ 2. GOVERNANCE               │
│ Owner / Domain / Risk       │
│ Approval / Access / Status  │
├─────────────────────────────┤
│ 3. RUNTIME                  │
│ Model / Variables / Env     │
├─────────────────────────────┤
│ 4. EVIDENCE                 │
│ Evaluation / Usage / Audit  │
└─────────────────────────────┘
```

Together:

```text
Prompt Metadata
      ↓
Understand
      ↓
Control
      ↓
Execute
      ↓
Measure
      ↓
Govern
```

---

# 30. Interview-Ready Answer

> **Enterprise prompt metadata provides the structured information required to identify, govern, execute, evaluate, and audit a prompt independently of its actual instruction text. Core metadata includes the prompt name and immutable version for identity, owner and purpose for accountability, domain and classification for governance, model compatibility and variables for runtime validation, environment and status for deployment control, evaluation results for quality assessment, approval information for governance, and usage history for operational visibility and impact analysis.**
>
> **In CWD, the Prompt Registry maintains this metadata and uses it during prompt resolution. The runtime can verify that the prompt belongs to the correct domain, is approved and active, is compatible with the selected model, is authorized for the requesting agent and environment, and satisfies required input variables. LangGraph can record the prompt ID and version in workflow state, while observability records it alongside the agent, model, workflow, and correlation ID. This makes AI execution controlled, traceable, auditable, and reproducible.**

# Final Definition

> **Enterprise prompt metadata is the structured set of identity, ownership, purpose, classification, model compatibility, input, environment, lifecycle, evaluation, approval, deployment, and usage attributes associated with a prompt, enabling the AI platform to discover, validate, govern, deploy, monitor, audit, and reproduce prompt-driven behavior.**

### Core Formula

```text
Prompt Metadata
=
Identity
+ Ownership
+ Purpose
+ Classification
+ Domain
+ Model Compatibility
+ Variables
+ Environment
+ Lifecycle Status
+ Evaluation
+ Approval
+ Deployment
+ Usage History
+ Audit
```

### One-line architect view

> **The prompt is the AI instruction; the metadata is the enterprise control plane that tells CWD what that prompt is, who owns it, where it can run, whether it is approved, how well it performs, and where it has been used.**
