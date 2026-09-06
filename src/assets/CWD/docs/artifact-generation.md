# Worker Agent: Generating Structured Business Artifacts

A Worker generates structured artifacts by transforming validated enterprise data, task instructions, retrieved evidence, and business rules into a governed output format such as a customer briefing, report, summary, recommendation, document, or decision package.

> A Worker does not simply ask an LLM to write text. It assembles evidence, applies business logic, generates content against a defined schema, validates the result, and publishes an auditable artifact.

## 1. What is a structured artifact?

A structured artifact is a business output with:

* A defined purpose
* A known audience
* A fixed or configurable format
* Required sections or fields
* Source-backed information
* Business rules and constraints
* Validation requirements
* Metadata and traceability

Examples include:

| Artifact | Typical structure |
| --- | --- |
| Customer briefing | Customer profile, recent activity, opportunities, risks, recommended actions |
| Executive report | Executive summary, KPIs, findings, trends, risks, decisions required |
| Meeting summary | Participants, discussion points, decisions, action items, owners, due dates |
| Recommendation | Objective, options, evaluation criteria, recommendation, rationale, risks |
| Business document | Title, purpose, background, analysis, conclusion, appendix |
| Incident report | Incident details, impact, timeline, root cause, remediation, prevention |
| Sales proposal | Customer needs, proposed solution, benefits, pricing assumptions, next steps |
| Compliance summary | Requirement, evidence, status, gaps, risk, remediation |
| Operational runbook | Preconditions, steps, validations, rollback, escalation |

The structure ensures that the output is consistent, machine-readable, reviewable, and reusable.

## 2. Where artifact generation fits in CWD

Within the CWD architecture, artifact generation normally occurs inside a specialized Worker.

```text
User Request
    |
    v
Coordinator
    |
    v
Delegator
    |
    v
Artifact Generation Worker
    |
    +--> Retrieve authorized enterprise data
    |
    +--> Retrieve approved templates
    |
    +--> Apply business rules
    |
    +--> Generate structured content
    |
    +--> Validate content and schema
    |
    +--> Render document or response
    |
    +--> Store or publish artifact
    |
    v
Structured Artifact
    |
    v
Delegator --> Coordinator --> User
```

For example:

```text
"Prepare a customer briefing for tomorrow's account review"
```

The Coordinator determines the overall intent. The relevant Delegator assigns the work to a Customer Briefing Worker.

The Worker then:

1. Retrieves the authorized customer profile.
2. Retrieves recent transactions, support cases, opportunities, and interactions.
3. Applies customer-data access policies.
4. Selects the approved customer briefing template.
5. Generates the briefing sections.
6. Validates all required fields.
7. Adds citations or source references.
8. Produces the final document or structured response.

## 3. Artifact generation is a controlled pipeline

A production-grade Worker should use a pipeline rather than a single generation step.

```text
Task Contract
    |
    v
Input Validation
    |
    v
Data and Evidence Collection
    |
    v
Evidence Normalization
    |
    v
Template and Schema Selection
    |
    v
Business Rule Application
    |
    v
Content Planning
    |
    v
LLM Content Generation
    |
    v
Schema and Quality Validation
    |
    v
Artifact Rendering
    |
    v
Storage, Delivery, and Audit
```

Each stage has a distinct responsibility.

## 4. Step 1: Receive a well-defined artifact task

The Worker should receive a structured task contract from the Delegator.

### Example task contract

```json
{
  "task_id": "task-78421",
  "artifact_type": "customer_briefing",
  "customer_id": "CUST-10245",
  "audience": "account_review_team",
  "purpose": "Prepare for quarterly customer review",
  "time_range": {
    "start": "2026-04-01",
    "end": "2026-06-30"
  },
  "required_sections": [
    "customer_overview",
    "recent_activity",
    "open_issues",
    "business_opportunities",
    "risks",
    "recommended_actions"
  ],
  "output_format": "docx",
  "template_id": "customer-briefing-v3",
  "citation_required": true,
  "language": "en-US",
  "authorized_by": "policy-decision-9821"
}
```

The task contract defines:

* What to generate
* For whom
* Why it is needed
* Which data may be used
* Which sections are required
* Which format is expected
* Which template and policy apply
* Whether citations or approval are required

Without a clear contract, the Worker may generate a visually attractive but incomplete or unauthorized document.

## 5. Step 2: Validate task inputs

Before retrieving data or generating content, the Worker validates:

| Validation | Example |
| --- | --- |
| Artifact type | Is `customer_briefing` supported? |
| Required identifiers | Is the customer ID present and valid? |
| Time range | Is the reporting period valid? |
| Audience | Is the intended audience known? |
| Output format | Is DOCX, PDF, HTML, Markdown, or JSON supported? |
| Template | Does the requested template exist and is it approved? |
| Authorization | Is the Worker allowed to access this customer data? |
| Required sections | Are all requested sections supported? |
| Data availability | Are required source systems available? |
| Policy restrictions | Are there prohibited fields or sensitive data constraints? |

If validation fails, the Worker should return a structured failure instead of generating a partial or misleading artifact.

```json
{
  "status": "failed",
  "error_code": "INVALID_TASK_CONTRACT",
  "message": "The customer_id field is missing.",
  "retryable": false
}
```

## 6. Step 3: Collect authorized enterprise evidence

The Worker retrieves the information needed for the artifact through approved enterprise interfaces.

Possible sources include:

* CRM systems
* ERP systems
* Customer support platforms
* Data warehouses
* Data lakes
* Enterprise search
* Document repositories
* Email or meeting systems
* Business APIs
* Knowledge bases
* Databases
* Other Workers through approved agent-to-agent contracts

```text
Customer Briefing Worker
  |
  +--> CRM Adapter
  |      +--> Customer profile
  |      +--> Account owner
  |      +--> Opportunities
  |
  +--> Support Adapter
  |      +--> Open cases
  |      +--> Escalations
  |
  +--> ERP Adapter
  |      +--> Orders
  |      +--> Revenue
  |      +--> Delivery status
  |
  +--> Enterprise Search
  +--> Contracts
  +--> Meeting notes
  +--> Account documents
```

The Worker must not retrieve everything available. It should retrieve only the information required for the artifact and permitted by the user's entitlements.

### Important principle

```text
Authorized Data Access
    ≠
Unrestricted Data Access
```

The Worker should apply:

* Identity-based access
* Role-based access control
* Customer or account-level entitlement
* Row-level or document-level security
* Data classification rules
* Purpose limitation
* Data minimization
* Sensitive-data masking where required

## 7. Step 4: Normalize and organize the evidence

Enterprise data is usually inconsistent. The Worker must normalize it before using it for generation.

For example:

```text
CRM:
  customer_name = "ABC Semiconductor"

ERP:
  account_name = "ABC Semi"

Support:
  organization = "ABC Semiconductor Inc."

Contract:
  legal_entity = "ABC Semiconductor Incorporated"
```

The Worker may resolve these records to a common internal identity:

```json
{
  "canonical_customer_id": "CUST-10245",
  "canonical_name": "ABC Semiconductor",
  "source_records": [
    "crm:account-901",
    "erp:account-221",
    "support:org-778",
    "contract:document-445"
  ]
}
```

Normalization may include:

* Entity resolution
* Date standardization
* Currency normalization
* Duplicate removal
* Status mapping
* Metric aggregation
* Field-name mapping
* Missing-value handling
* Source confidence assignment

### Example normalized evidence

```json
{
  "customer": {
    "id": "CUST-10245",
    "name": "ABC Semiconductor",
    "industry": "Semiconductor Manufacturing"
  },
  "financials": {
    "revenue_current_period": 4200000,
    "revenue_previous_period": 3700000,
    "currency": "USD"
  },
  "support": {
    "open_cases": 4,
    "critical_cases": 1
  },
  "opportunities": [
    {
      "name": "Expansion Program",
      "stage": "Proposal",
      "estimated_value": 850000
    }
  ]
}
```

The LLM should receive this normalized evidence rather than raw, contradictory system responses whenever possible.

## 8. Step 5: Select an approved template and schema

A Worker should not generate every artifact from an empty prompt.

It should select an approved:

* Template
* Output schema
* Section definition
* Formatting policy
* Tone and audience profile
* Citation policy
* Validation rule set

### Example schema

```json
{
  "title": "Customer Briefing",
  "customer_overview": {
    "type": "string",
    "required": true
  },
  "recent_activity": {
    "type": "array",
    "required": true
  },
  "open_issues": {
    "type": "array",
    "required": true
  },
  "risks": {
    "type": "array",
    "required": true
  },
  "recommended_actions": {
    "type": "array",
    "required": true
  }
}
```

A schema provides:

* Predictable output
* Consistent downstream processing
* Easier validation
* Easier rendering
* Better version control
* Reduced hallucination risk
* Reusability across channels

## 9. Step 6: Apply business rules and calculations

The Worker should use deterministic code for calculations and business rules whenever possible.

For example, revenue growth should be calculated by code:

Revenue Growth % = ((Current Revenue − Previous Revenue) / Previous Revenue) × 100

Example: (4,200,000 − 3,700,000) / 3,700,000 × 100 = 13.51%

The Worker may provide the calculated result to the LLM:

```json
{
  "metric": "revenue_growth",
  "current_value": 4200000,
  "previous_value": 3700000,
  "growth_percentage": 13.51,
  "calculation_method": "deterministic"
}
```

The LLM can then explain the result:

> Revenue increased by approximately 13.5% compared with the previous period.

The LLM should not be responsible for performing critical calculations that can be done deterministically.

Other business rules may include:

* Flagging overdue cases
* Classifying account health
* Determining risk thresholds
* Ranking opportunities
* Checking policy compliance
* Applying approval thresholds
* Selecting recommendation criteria
* Identifying missing required information

## 10. Step 7: Build a content plan

Before generating the final artifact, the Worker may create an intermediate content plan.

```json
{
  "sections": [
    {
      "name": "customer_overview",
      "purpose": "Explain customer context",
      "evidence_ids": [
        "crm-901",
        "contract-445"
      ]
    },
    {
      "name": "recent_activity",
      "purpose": "Summarize recent business activity",
      "evidence_ids": [
        "erp-221",
        "crm-opportunity-88"
      ]
    },
    {
      "name": "risks",
      "purpose": "Identify material concerns",
      "evidence_ids": [
        "support-case-778",
        "delivery-report-991"
      ]
    }
  ]
}
```

This intermediate plan helps the Worker ensure that:

* Every required section has evidence
* No section is accidentally omitted
* Recommendations are connected to findings
* Sources are traceable
* The document follows the requested purpose

## 11. Step 8: Generate content using the LLM

The LLM generates the language, but the Worker controls the context and constraints.

### Conceptual prompt structure

```text
System instructions:
  You are generating an enterprise customer briefing.
  Use only the supplied evidence.
  Do not invent metrics, names, dates, or commitments.
  Mark unavailable information as "Not available".
  Follow the provided JSON schema.
  Every material claim must include a source reference.

Artifact instructions:
  Audience: Account review team
  Tone: Executive and concise
  Required sections: ...

Evidence:
  Customer profile: ...
  Revenue metrics: ...
  Support cases: ...
  Opportunities: ...

Output schema:
  ...
```

The Worker may use different generation strategies:

| Strategy | Use case |
| --- | --- |
| Single-pass generation | Small, simple summaries |
| Section-by-section generation | Long reports or complex documents |
| Retrieval-augmented generation | Evidence-based business outputs |
| Template filling | Standardized forms and briefings |
| Multi-stage generation | Reports requiring analysis, review, and rendering |
| Critique and revision | High-value or high-risk documents |
| Human-in-the-loop | External communication or sensitive decisions |

## 12. Step 9: Generate structured data before formatted text

A reliable pattern is:

```text
Enterprise Evidence
    |
    v
Structured JSON Artifact
    |
    v
Validation
    |
    v
Markdown / HTML / DOCX / PDF Rendering
```

For example, the Worker first generates:

```json
{
  "artifact_type": "customer_briefing",
  "title": "ABC Semiconductor Quarterly Briefing",
  "executive_summary": "Revenue increased during the reporting period...",
  "customer_overview": {
    "industry": "Semiconductor Manufacturing",
    "account_owner": "Account Team"
  },
  "key_metrics": [
    {
      "name": "Revenue",
      "value": 4200000,
      "unit": "USD",
      "period": "Q2 2026",
      "source": "erp-221"
    }
  ],
  "risks": [
    {
      "description": "One critical support case remains open.",
      "severity": "high",
      "source": "support-case-778"
    }
  ],
  "recommended_actions": [
    {
      "action": "Review the critical support case with the customer.",
      "priority": "high",
      "owner": "Support Leadership"
    }
  ]
}
```

Only after this structure is validated does the Worker render it into a document.

This separation makes it easier to:

* Validate content
* Reuse the same artifact in Teams, email, PDF, and dashboards
* Update one section without regenerating everything
* Track source references
* Compare artifact versions
* Automate downstream workflows

## 13. Step 10: Validate the generated artifact

Validation should happen at multiple levels.

### 13.1 Schema validation

Check whether the output conforms to the required structure.

```text
Are all required fields present?
Are field types correct?
Are arrays actually arrays?
Are dates valid?
Are enumerated values allowed?
```

### 13.2 Evidence validation

Check whether claims are supported by retrieved evidence.

```text
Does the revenue value match the source?
Does the report mention only retrieved customers?
Does every recommendation have a rationale?
Are unsupported claims marked as unavailable?
```

### 13.3 Business validation

Check business rules.

```text
Are percentages calculated correctly?
Are risk levels within allowed values?
Are recommendations consistent with policy?
Are required approvals identified?
```

### 13.4 Quality validation

Check:

* Completeness
* Relevance
* Clarity
* Consistency
* Tone
* Duplication
* Readability
* Contradictions
* Missing sections
* Unsupported conclusions

### 13.5 Security validation

Check:

* No unauthorized customer data
* No secrets or credentials
* No restricted information in the output
* No sensitive information in logs
* Correct audience classification
* Correct sharing permissions

## 14. Step 11: Add citations, provenance, and metadata

Enterprise artifacts should preserve traceability.

Each important claim may include:

* Source system
* Source record ID
* Retrieval timestamp
* Evidence reference
* Data freshness
* Confidence or validation status

### Example provenance

```json
{
  "claim": "Revenue increased by 13.5%.",
  "source": {
    "system": "ERP",
    "record_id": "erp-221",
    "retrieved_at": "2026-09-06T12:00:00Z"
  },
  "calculation": {
    "current_revenue": 4200000,
    "previous_revenue": 3700000,
    "formula": "(current - previous) / previous * 100"
  },
  "validated": true
}
```

Provenance enables:

* Auditability
* Fact verification
* Compliance review
* User trust
* Debugging
* Reproducibility
* Artifact regeneration

## 15. Step 12: Render the artifact into the requested format

After validation, the Worker renders the structured content.

Possible output formats include:

| Format | Purpose |
| --- | --- |
| JSON | System-to-system integration |
| Markdown | Chat, knowledge base, developer workflows |
| HTML | Web presentation |
| DOCX | Editable business document |
| PDF | Formal distribution |
| XLSX | Structured tabular analysis |
| PPTX | Executive presentation |
| Email | Communication workflow |
| Teams message | Operational collaboration |
| Dashboard payload | Visualization or reporting system |

The rendering layer should be separate from content generation.

```text
Validated Artifact JSON
    |
    +--> Markdown Renderer
    +--> DOCX Renderer
    +--> PDF Renderer
    +--> HTML Renderer
    +--> Email Renderer
    +--> Teams Renderer
```

This allows the same business content to be delivered through multiple channels.

## 16. Example: Customer briefing generation

### Input

```text
Create a customer briefing for ABC Semiconductor's quarterly review.
```

### Worker execution

```text
1. Validate customer ID and reporting period.
2. Check user entitlement for the customer account.
3. Retrieve CRM, ERP, support, and contract information.
4. Normalize customer identity and metrics.
5. Calculate revenue growth and open-case counts.
6. Select the approved customer briefing template.
7. Map evidence to required sections.
8. Generate structured briefing JSON.
9. Validate schema and source references.
10. Render DOCX and Markdown versions.
11. Store the artifact with access controls.
12. Return artifact metadata and summary.
```

### Output structure

```text
Customer Briefing
├── Customer Overview
├── Executive Summary
├── Recent Business Activity
├── Key Metrics
├── Open Support Issues
├── Opportunities
├── Risks and Dependencies
├── Recommended Actions
├── Decisions Required
└── Sources and Notes
```

## 17. Example: Report generation

A report Worker may follow this flow:

```text
Request:
"Generate a monthly operations report."

    |
    v
Retrieve operational metrics
    |
    v
Validate time period and data completeness
    |
    v
Calculate KPIs and trends
    |
    v
Identify threshold breaches
    |
    v
Generate findings
    |
    v
Generate recommendations
    |
    v
Validate numbers and source references
    |
    v
Render report
```

A report should distinguish between:

* Measured facts
* Calculated metrics
* Observed trends
* LLM-generated interpretation
* Recommendations
* Assumptions
* Missing data

For example:

```json
{
  "finding": "Average resolution time increased by 8%.",
  "type": "calculated_finding",
  "source": "support_metrics_2026_08",
  "recommendation": "Review the highest-volume support categories."
}
```

## 18. Example: Recommendation generation

Recommendations require additional controls because they may influence business decisions.

The Worker should use an explicit recommendation framework:

```text
Objective
    |
    v
Available Options
    |
    v
Evaluation Criteria
    |
    v
Evidence and Constraints
    |
    v
Option Scoring
    |
    v
Trade-off Analysis
    |
    v
Recommendation
    |
    v
Risks and Assumptions
    |
    v
Human Approval, if required
```

### Example recommendation structure

```json
{
  "objective": "Reduce customer support resolution time",
  "options": [
    {
      "name": "Increase support staffing",
      "benefits": [
        "Higher support capacity"
      ],
      "risks": [
        "Higher operating cost"
      ],
      "score": 78
    },
    {
      "name": "Automate repetitive support requests",
      "benefits": [
        "Lower manual workload"
      ],
      "risks": [
        "Initial implementation effort"
      ],
      "score": 86
    }
  ],
  "recommendation": {
    "selected_option": "Automate repetitive support requests",
    "rationale": [
      "High volume of repetitive cases",
      "Lower long-term operational cost"
    ],
    "assumptions": [
      "Knowledge base content is sufficiently complete"
    ],
    "approval_required": true
  }
}
```

The Worker should not present a recommendation as an unquestionable decision. It should expose:

* Evidence
* Criteria
* Assumptions
* Trade-offs
* Confidence
* Risks
* Approval requirements

## 19. Example: Meeting summary generation

A meeting-summary Worker may produce:

```json
{
  "meeting_title": "Quarterly Account Review",
  "meeting_date": "2026-09-05",
  "participants": [
    "Account Team",
    "Customer Success",
    "Support Leadership"
  ],
  "summary": "The team reviewed customer performance and open issues.",
  "decisions": [
    {
      "decision": "Escalate the critical support case.",
      "source_segment": "meeting-transcript-12"
    }
  ],
  "action_items": [
    {
      "action": "Schedule a technical review",
      "owner": "Customer Success",
      "due_date": "2026-09-10",
      "status": "open"
    }
  ],
  "unresolved_questions": [
    "What is the expected delivery date for the expansion program?"
  ]
}
```

The Worker should distinguish between:

* What was explicitly stated
* What was inferred
* What was decided
* What remains unresolved

It should never convert a suggestion into a confirmed decision without evidence.

## 20. Artifact generation with human review

Some artifacts may be automatically delivered. Others require review.

### Low-risk artifacts

Examples:

* Internal meeting summaries
* Non-sensitive operational summaries
* Draft knowledge articles

Possible flow:

```text
Generate → Validate → Publish
```

### Medium-risk artifacts

Examples:

* Customer briefings
* Internal recommendations
* Management reports

Possible flow:

```text
Generate → Validate → Human Review → Publish
```

### High-risk artifacts

Examples:

* External customer communication
* Compliance reports
* Financial recommendations
* Legal or contractual documents
* Artifacts containing sensitive information

Possible flow:

```text
Generate → Validate → Approval → Publish → Audit
```

The Worker should identify the required review state in the artifact metadata.

```json
{
  "approval": {
    "required": true,
    "status": "pending",
    "approval_role": "business_owner"
  }
}
```

## 21. Storage and publication

After generation, the Worker may store the artifact in an approved repository.

Possible destinations include:

* Document management system
* Enterprise content repository
* Object storage
* Knowledge base
* CRM record
* Case-management system
* Collaboration platform
* Workflow system

The Worker should store:

```json
{
  "artifact_id": "artifact-78421",
  "artifact_type": "customer_briefing",
  "version": "1.0",
  "format": "docx",
  "location": "approved-document-repository",
  "classification": "internal",
  "created_by": "customer-briefing-worker",
  "created_at": "2026-09-06T12:00:00Z",
  "source_task_id": "task-78421",
  "approval_status": "approved",
  "checksum": "content-integrity-hash"
}
```

Publication must preserve:

* Access permissions
* Data classification
* Retention policy
* Version history
* Ownership
* Audit trail

## 22. Handling incomplete or conflicting data

A Worker should not hide data quality problems.

### Missing data

```json
{
  "section": "customer_revenue",
  "status": "not_available",
  "reason": "ERP data was unavailable for the requested period."
}
```

### Conflicting data

```json
{
  "section": "customer_name",
  "status": "conflict",
  "values": [
    {
      "source": "CRM",
      "value": "ABC Semiconductor"
    },
    {
      "source": "ERP",
      "value": "ABC Semi"
    }
  ],
  "resolution": "CRM value selected according to canonical account policy."
}
```

### Low-confidence recommendation

```json
{
  "recommendation": "Consider expanding automated support triage.",
  "confidence": "medium",
  "reason": "Support-volume data is available, but cost-benefit data is incomplete."
}
```

The Worker should explicitly communicate uncertainty rather than generating false precision.

## 23. Error handling

| Failure | Worker response |
| --- | --- |
| Missing customer ID | Reject task as invalid |
| Unauthorized data access | Stop execution and return authorization failure |
| Source system unavailable | Retry if safe, otherwise return partial-data status |
| Template unavailable | Use approved fallback or fail |
| LLM output invalid | Repair or regenerate within limits |
| Unsupported output format | Return supported-format error |
| Conflicting source data | Apply resolution policy or flag conflict |
| Rendering failure | Preserve structured artifact and retry rendering |
| Storage failure | Return artifact-ready status without claiming publication |
| Approval required | Mark artifact as pending approval |
| Sensitive data detected | Mask, remove, or block publication |

A structured result should distinguish between success, partial success, failure, and pending approval.

```json
{
  "status": "partial_success",
  "artifact_id": "artifact-78421",
  "warnings": [
    "Customer satisfaction score was unavailable."
  ],
  "published": false,
  "approval_required": true
}
```

## 24. Observability and auditability

Artifact generation should be traceable across the CWD execution chain.

```text
correlation_id
    |
    +--> Coordinator task
    +--> Delegator task
    +--> Worker execution
    +--> Data retrieval calls
    +--> LLM generation
    +--> Validation
    +--> Rendering
    +--> Publication
```

Important telemetry includes:

* Task ID
* Artifact ID
* Template version
* Prompt version
* Model version
* Source systems accessed
* Tool calls
* Validation results
* Generation duration
* Token usage
* Retry count
* Approval status
* Publication status
* Error codes
* Data classification

The Worker should log metadata and decisions, not unrestricted sensitive content.

## 25. Worker responsibilities versus LLM responsibilities

| Responsibility | Worker/runtime | LLM |
| --- | --- | --- |
| Validate task contract | Yes | No |
| Check authorization | Yes | No |
| Retrieve enterprise data | Yes, through approved tools | May recommend needed data |
| Calculate financial metrics | Prefer deterministic code | Explain results |
| Select approved template | Yes | May suggest template |
| Generate natural language | No | Yes |
| Follow output schema | Enforced by Worker | Attempts to follow |
| Validate source grounding | Yes | May provide citations |
| Detect unsupported claims | Yes, with validation | Can assist |
| Render DOCX/PDF | Yes | No |
| Publish artifact | Yes, with policy checks | No |
| Approve high-risk content | Authorized human or workflow | No |

The key principle is:

> The LLM generates language; the Worker controls execution, evidence, validation, formatting, and publication.

## 26. Recommended internal Worker architecture

```text
Artifact Generation Worker
│
├── Task Contract Validator
│
├── Authorization and Policy Guard
│
├── Data Retrieval Orchestrator
│   ├── CRM Adapter
│   ├── ERP Adapter
│   ├── Support Adapter
│   ├── Enterprise Search Adapter
│   └── Document Repository Adapter
│
├── Evidence Normalizer
│
├── Business Rules Engine
│
├── Template and Schema Registry Client
│
├── Content Planner
│
├── LLM Generation Service
│
├── Output Validator
│   ├── Schema Validator
│   ├── Evidence Validator
│   ├── Business Validator
│   ├── Security Validator
│   └── Quality Validator
│
├── Artifact Renderer
│   ├── JSON
│   ├── Markdown
│   ├── DOCX
│   ├── PDF
│   └── HTML
│
├── Approval Workflow Adapter
│
├── Artifact Storage Adapter
│
└── Audit and Observability Module
```

## 27. Example end-to-end pseudocode

```python
def generate_artifact(task, user_context):
    validate_task_contract(task)

    authorize(
        user_context=user_context,
        artifact_type=task["artifact_type"],
        customer_id=task.get("customer_id")
    )

    template = template_registry.get_approved_template(
        template_id=task["template_id"]
    )

    evidence = retrieve_required_evidence(
        customer_id=task.get("customer_id"),
        time_range=task.get("time_range"),
        required_sections=task["required_sections"]
    )

    normalized_evidence = normalize_evidence(evidence)

    calculated_metrics = calculate_business_metrics(
        normalized_evidence
    )

    content_plan = build_content_plan(
        template=template,
        evidence=normalized_evidence,
        metrics=calculated_metrics,
        required_sections=task["required_sections"]
    )

    structured_artifact = llm_generate(
        template=template,
        content_plan=content_plan,
        evidence=normalized_evidence,
        metrics=calculated_metrics,
        output_schema=template["schema"]
    )

    validate_schema(structured_artifact, template["schema"])
    validate_evidence_grounding(structured_artifact, normalized_evidence)
    validate_business_rules(structured_artifact, calculated_metrics)
    validate_security(structured_artifact, user_context)

    rendered_artifact = render(
        structured_artifact,
        output_format=task["output_format"],
        template=template
    )

    approval_status = determine_approval_requirement(
        artifact=structured_artifact,
        task=task
    )

    artifact_metadata = store_or_stage_artifact(
        rendered_artifact,
        approval_status=approval_status,
        source_task_id=task["task_id"]
    )

    return {
        "status": "success",
        "artifact": artifact_metadata,
        "structured_content": structured_artifact,
        "approval_status": approval_status
    }
```

## 28. Common anti-patterns

A production Worker should not:

* Generate a document directly from an unvalidated user prompt
* Retrieve unrestricted enterprise data
* Allow the LLM to call arbitrary APIs
* Use unsupported or invented facts
* Hide missing information
* Treat recommendations as confirmed decisions
* Perform critical calculations only through free-form generation
* Skip schema validation
* Publish sensitive content without classification checks
* Claim a document was stored when storage failed
* Generate different facts for different output formats
* Lose source references during rendering
* Retry unsafe downstream operations without idempotency
* Use an unapproved template
* Put secrets or sensitive data into prompts and logs

## 29. Core formula

```text
Structured Artifact Generation
=
Validated Task
+ Authorized Evidence
+ Normalization
+ Approved Template
+ Business Rules
+ LLM Content Generation
+ Schema Validation
+ Evidence Validation
+ Rendering
+ Governed Publication
+ Auditability
```

## Final Definition

A Worker generates structured business artifacts by receiving a well-defined task, retrieving authorized enterprise information, normalizing and validating the evidence, selecting an approved template and schema, applying deterministic business rules, using an LLM to generate the narrative content, validating the result for structure, accuracy, security, and completeness, and finally rendering, storing, publishing, or routing the artifact through the appropriate approval workflow.

In the CWD architecture:

> The Coordinator determines the overall intent, the Delegator assigns the artifact-generation task, and the Worker produces the evidence-backed business output in a controlled, validated, and reusable format.