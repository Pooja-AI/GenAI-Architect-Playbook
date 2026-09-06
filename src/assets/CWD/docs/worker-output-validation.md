# Worker Agent: Validating Outputs Before Returning to the Delegator

A Worker validates its output through a multi-layer quality and governance pipeline before the result is accepted as a trusted domain response.

> A Worker must not return an output merely because the LLM produced valid JSON or because the downstream API returned HTTP 200. The output must be structurally valid, complete, authorized, business-compliant, data-quality checked, and grounded in approved evidence.

```text
Worker Task
    |
    v
Execute Task and Collect Evidence
    |
    v
Generate Candidate Output
    |
    v
Schema Validation
    |
    v
Completeness Validation
    |
    v
Business Rule Validation
    |
    v
Authorization and Security Validation
    |
    v
Data Quality Validation
    |
    v
Grounding and Provenance Validation
    |
    v
Final Output Decision
    |
    +--> Accepted
    +--> Accepted with Warnings
    +--> Retry / Repair
    +--> Partial Result
    +--> Rejected
    |
    v
Structured Result to Delegator
```

## 1. Why output validation is necessary

A Worker can produce an output that looks correct but is not trustworthy.

For example:

```json
{
  "customer_name": "ABC Semiconductor",
  "revenue": 4200000,
  "risk": "low",
  "recommendation": "Expand the account"
}
```

This output may still be invalid if:

* The customer name belongs to another account.
* Revenue is from the wrong reporting period.
* The risk level violates the risk policy.
* The recommendation is based on unauthorized data.
* A required source reference is missing.
* The revenue value is stale or incomplete.
* The output omits mandatory sections.
* The Worker was not authorized to make the recommendation.

Therefore:

> Valid JSON ≠ Valid Business Output

A trusted result must pass several independent validation gates.

## 2. Validation architecture inside the Worker

A production Worker can contain a dedicated validation layer.

```text
Artifact / Task Worker
│
├── Task Contract Validator
├── Output Schema Validator
├── Completeness Validator
├── Business Rules Validator
├── Authorization Validator
├── Data Quality Validator
├── Grounding Validator
├── Security and Sensitive Data Scanner
├── Quality and Consistency Validator
├── Approval Requirement Evaluator
└── Result Decision Engine
```

The validation layer should be separate from the LLM generation logic.

```text
LLM Generator
    |
    v
Candidate Output
    |
    v
Deterministic Validation Services
    |
    v
Validated Output
```

The LLM may assist with semantic checks, but critical validation should be enforced by deterministic code, policy services, schemas, and trusted source systems.

## 3. Validation begins with the Worker task contract

The Worker must validate the task requirements before validating the generated result.

### Example task contract

```json
{
  "task_id": "task-78421",
  "task_type": "customer_briefing",
  "required_fields": [
    "customer_overview",
    "key_metrics",
    "risks",
    "recommended_actions"
  ],
  "required_sources": [
    "crm",
    "erp",
    "support"
  ],
  "output_format": "json",
  "citation_required": true,
  "authorization_scope": {
    "customer_id": "CUST-10245",
    "data_classification": "internal"
  },
  "validation_policy": "customer-briefing-v3"
}
```

The Worker uses this contract as the validation baseline.

```text
Task Contract
    |
    +--> Required fields
    +--> Required sources
    +--> Allowed values
    +--> Authorization scope
    +--> Business rules
    +--> Output format
    +--> Approval requirements
```

If the contract itself is invalid, output generation should stop.

## 4. Schema correctness validation

Schema validation checks whether the output has the expected structure and data types.

### 4.1 What schema validation checks

* Required fields exist
* Field names are correct
* Data types are correct
* Nested objects follow the expected structure
* Arrays contain valid item types
* Enumerated values are allowed
* Dates use the required format
* Numeric values are within valid ranges
* No unexpected fields are present, when strict mode is required

### Example expected schema

```json
{
  "type": "object",
  "required": [
    "summary",
    "key_metrics",
    "risks",
    "recommendations"
  ],
  "properties": {
    "summary": {
      "type": "string"
    },
    "key_metrics": {
      "type": "array"
    },
    "risks": {
      "type": "array"
    },
    "recommendations": {
      "type": "array"
    }
  }
}
```

### Invalid output

```json
{
  "summary": "Revenue increased.",
  "key_metrics": "Revenue increased by 13.5%"
}
```

The `key_metrics` field should be an array, not a string.

### Validation result

```json
{
  "status": "failed",
  "validation_type": "schema",
  "errors": [
    {
      "path": "$.key_metrics",
      "error": "Expected array but received string"
    }
  ]
}
```

## 5. Completeness validation

Schema correctness does not guarantee completeness.

An output may contain all required fields but still omit important information.

For example:

```json
{
  "summary": "Customer performance is positive.",
  "key_metrics": [],
  "risks": [],
  "recommendations": []
}
```

This may be structurally valid but incomplete if the task required actual metrics, risk analysis, and recommended actions.

### 5.1 Completeness checks

The Worker checks:

* All required sections are present
* All mandatory fields contain meaningful values
* Required evidence was retrieved
* Each required section has supporting evidence
* No required source was silently skipped
* Required calculations were completed
* Required decisions or actions are included
* Missing information is explicitly marked
* Partial results are clearly identified

### Example completeness matrix

| Required section | Evidence available | Output populated | Status |
| --- | --- | --- | --- |
| Customer overview | Yes | Yes | Pass |
| Revenue metrics | Yes | Yes | Pass |
| Open support cases | Yes | No | Fail |
| Risks | Partial | Yes | Warning |
| Recommendations | Yes | Yes | Pass |

### Example result

```json
{
  "status": "partial_success",
  "missing_sections": [
    "open_support_cases"
  ],
  "warnings": [
    "Support system did not respond within the execution window."
  ]
}
```

The Worker should never silently convert missing data into an empty or positive conclusion.

## 6. Business rule validation

Business rules determine whether the output is logically and operationally acceptable.

These rules should be defined outside the LLM wherever possible.

### 6.1 Examples of business rules

**Financial rule**

```text
Revenue growth must be calculated from the approved reporting period.
```

**Risk rule**

```text
If a critical support case is open, account risk cannot be classified as "low"
without an approved override.
```

**Recommendation rule**

```text
A recommendation must include:
- Rationale
- Supporting evidence
- Assumptions
- Risk or trade-off
```

**Approval rule**

```text
External customer communication requires business-owner approval.
```

**Data consistency rule**

```text
The customer ID in the output must match the customer ID in the task contract.
```

### Example business-rule validation

```json
{
  "customer_id": "CUST-10245",
  "open_critical_cases": 1,
  "generated_risk": "low"
}
```

Validation result:

```json
{
  "status": "failed",
  "validation_type": "business_rule",
  "rule_id": "RISK-CRITICAL-CASE-001",
  "message": "An account with an open critical case cannot be classified as low risk."
}
```

The Worker may:

* Recalculate the result
* Request an approved override
* Mark the output as requiring review
* Reject the output

It should not simply ask the LLM to justify an invalid result.

## 7. Authorization and security validation

Authorization validation confirms that the Worker was permitted to generate and return the output.

This is different from checking whether the output is syntactically valid.

### 7.1 Authorization checks

The Worker should verify:

* The requesting user is entitled to the data
* The Worker has the required capability
* The task is within the assigned authorization scope
* Retrieved records belong to the permitted customer or domain
* The output does not contain restricted fields
* The destination is authorized to receive the artifact
* Required approval has been obtained
* The output classification is compatible with the destination

```text
User Entitlement
  |
  v
Task Authorization
  |
  v
Data Access Authorization
  |
  v
Output Classification
  |
  v
Destination Authorization
```

### 7.2 Example

The Worker retrieves a customer record containing:

```json
{
  "customer_name": "ABC Semiconductor",
  "revenue": 4200000,
  "internal_margin": 0.27,
  "confidential_discount": 0.18
}
```

The user is authorized to view revenue but not confidential discount information.

The output validator should remove or block the restricted field:

```json
{
  "customer_name": "ABC Semiconductor",
  "revenue": 4200000,
  "internal_margin": 0.27,
  "confidential_discount": "[REDACTED]"
}
```

If the output is intended for an external customer, even internal margin may be prohibited.

### Important principle

> Authorization must be validated against the actual output, not only against the original data retrieval request.

## 8. Data quality validation

Data quality validation checks whether the source information used in the output is reliable enough for the requested purpose.

### 8.1 Data quality dimensions

| Dimension | Validation question |
| --- | --- |
| Accuracy | Does the value match the source system? |
| Completeness | Are required source fields available? |
| Freshness | Is the data recent enough? |
| Consistency | Do multiple sources agree? |
| Validity | Does the value follow the expected format and range? |
| Uniqueness | Are duplicate records removed? |
| Timeliness | Was the data retrieved within the required window? |
| Lineage | Can the value be traced to its source? |

### Example data-quality issue

```json
{
  "metric": "revenue",
  "value": 4200000,
  "source": "ERP",
  "last_updated": "2025-01-01"
}
```

If the task requests a current-quarter briefing, the Worker should not treat this stale value as current.

```json
{
  "status": "warning",
  "validation_type": "data_quality",
  "field": "revenue",
  "issue": "Source data is older than the permitted freshness threshold.",
  "action": "Mark metric as stale and require review."
}
```

### 8.2 Conflicting data

```text
CRM revenue: 4.2M
ERP revenue: 4.0M
Data warehouse revenue: 4.2M
```

The Worker should apply a defined source-precedence policy.

```json
{
  "metric": "revenue",
  "selected_value": 4200000,
  "selected_source": "ERP",
  "conflicting_sources": [
    {
      "source": "CRM",
      "value": 4200000
    },
    {
      "source": "Data Warehouse",
      "value": 4200000
    }
  ],
  "resolution_policy": "approved-financial-source-precedence"
}
```

If no approved resolution exists, the Worker should flag the conflict rather than inventing a value.

## 9. Grounding and provenance validation

Grounding validation checks whether the output is supported by the evidence retrieved by the Worker.

This is especially important for:

* Customer briefings
* Reports
* Recommendations
* Summaries
* Compliance documents
* Financial analysis
* Operational decisions

### 9.1 Grounding means

Every material claim should be traceable to:

* A source record
* A document section
* An API response
* A database query
* A calculation
* An approved business rule

### Example claim

> Revenue increased by 13.5% during the reporting period.

The Worker should be able to trace it to:

```json
{
  "claim": "Revenue increased by 13.5%.",
  "evidence": [
    {
      "source": "ERP",
      "record_id": "erp-221",
      "field": "current_revenue",
      "value": 4200000
    },
    {
      "source": "ERP",
      "record_id": "erp-221",
      "field": "previous_revenue",
      "value": 3700000
    }
  ],
  "calculation": "(4200000 - 3700000) / 3700000 * 100",
  "result": 13.51
}
```

### 9.2 Grounding checks

The Worker checks:

* Does the claim appear in the retrieved evidence?
* Are names, dates, and amounts accurate?
* Are claims supported by the correct source?
* Are recommendations linked to findings?
* Are citations valid?
* Are calculations reproducible?
* Are unsupported claims marked as assumptions?
* Has the LLM introduced facts not present in the evidence?

### Ungrounded output

```json
{
  "summary": "The customer is planning a major expansion next year."
}
```

If no retrieved evidence supports that statement, the Worker should reject or revise it:

```json
{
  "summary": "No confirmed expansion plan was found in the retrieved sources.",
  "status": "grounded"
}
```

## 10. Semantic and consistency validation

Some errors are not captured by JSON Schema or simple business rules.

For example:

```json
{
  "summary": "The account has no open issues.",
  "open_issues": [
    {
      "case_id": "CASE-991",
      "severity": "critical",
      "status": "open"
    }
  ]
}
```

The structure is valid, but the content is contradictory.

The Worker can use:

* Deterministic consistency checks
* Rule-based contradiction detection
* Controlled LLM critique
* Cross-field validation
* Source comparison

### Example consistency rules

```text
If open_issues.length > 0:
    summary must not state "no open issues"

If approval_required = true:
    publication_status cannot be "published"

If data_status = "unavailable":
    the corresponding metric cannot contain a fabricated value
```

## 11. Validation of recommendations

Recommendations require stronger validation than ordinary summaries because they may influence decisions.

The Worker should validate:

* The recommendation addresses the requested objective
* The recommendation is supported by evidence
* The recommendation follows business constraints
* Alternatives were considered when required
* Risks and assumptions are included
* The recommendation does not exceed the Worker's authority
* Required human approval is identified
* The recommendation is not presented as a confirmed decision

### Example

```json
{
  "recommendation": "Increase customer credit limit to $5 million.",
  "rationale": "The customer has strong growth."
}
```

This may be invalid if the Worker is only authorized to recommend, not approve credit-limit changes.

The corrected output should be:

```json
{
  "recommendation": {
    "action": "Consider increasing the customer credit limit to $5 million.",
    "rationale": "Customer revenue growth supports further review.",
    "approval_required": true,
    "decision_owner": "Credit Risk Team",
    "status": "recommendation_only"
  }
}
```

## 12. Validation decision engine

After all checks, the Worker combines the results into a final decision.

```text
Validation Results
    |
    v
Decision Engine
    |
    +--> All critical checks pass
    |       |
    |       v
    |    ACCEPT
    |
    +--> Non-critical warnings only
    |       |
    |       v
    |    ACCEPT WITH WARNINGS
    |
    +--> Repairable failure
    |       |
    |       v
    |    REPAIR / REGENERATE
    |
    +--> Missing source data
    |       |
    |       v
    |    PARTIAL RESULT
    |
    +--> Authorization or security failure
    |       |
    |       v
    |    REJECT
    |
    +--> Critical business or grounding failure
            |
            v
         REJECT
```

### Example validation summary

```json
{
  "validation_summary": {
    "schema": "passed",
    "completeness": "passed",
    "business_rules": "passed",
    "authorization": "passed",
    "data_quality": "warning",
    "grounding": "passed",
    "security": "passed"
  },
  "final_status": "accepted_with_warnings",
  "warnings": [
    "Customer satisfaction score is unavailable."
  ]
}
```

## 13. Repair and retry strategy

Not every validation failure requires complete task failure.

### 13.1 Repairable failures

Examples:

* Invalid JSON syntax
* Missing optional field
* Incorrect date format
* Wrong enum value
* Missing citation
* Inconsistent section heading
* Formatting issue

The Worker may repair the output using a constrained retry.

```text
Candidate Output
    |
    v
Validation Failure
    |
    v
Create Structured Repair Request
    |
    v
LLM or Deterministic Repair
    |
    v
Validate Again
```

### 13.2 Non-repairable failures

Examples:

* Unauthorized data
* Unsupported financial claim
* Missing critical source
* Policy violation
* Unresolved identity mismatch
* Invalid business decision
* Restricted output destination

These should not be repaired by asking the LLM to rewrite the same unsupported content.

The Worker should stop, redact, request approval, or return a failure.

## 14. Bounded retry policy

Retries must be controlled.

```json
{
  "retry_policy": {
    "max_attempts": 2,
    "retryable_errors": [
      "SCHEMA_VALIDATION_FAILED",
      "MISSING_REQUIRED_FIELD",
      "INVALID_FORMAT"
    ],
    "non_retryable_errors": [
      "UNAUTHORIZED_DATA",
      "POLICY_VIOLATION",
      "UNSUPPORTED_CLAIM"
    ]
  }
}
```

A Worker should not repeatedly regenerate an output that fails grounding or authorization validation.

## 15. Structured result returned to the Delegator

The Worker should return both:

1. The business result
2. The validation metadata

### Example accepted result

```json
{
  "task_id": "task-78421",
  "worker_id": "customer-briefing-worker",
  "status": "success",
  "result": {
    "artifact_type": "customer_briefing",
    "customer_id": "CUST-10245",
    "summary": "Revenue increased during the reporting period.",
    "key_metrics": [
      {
        "name": "Revenue Growth",
        "value": 13.51,
        "unit": "percent",
        "source": "erp-221"
      }
    ],
    "risks": [
      {
        "description": "One critical support case remains open.",
        "severity": "high",
        "source": "support-case-778"
      }
    ]
  },
  "validation": {
    "schema": "passed",
    "completeness": "passed",
    "business_rules": "passed",
    "authorization": "passed",
    "data_quality": "passed",
    "grounding": "passed",
    "security": "passed"
  },
  "provenance": {
    "source_count": 4,
    "template_version": "customer-briefing-v3",
    "prompt_version": "customer-briefing-prompt-v5"
  },
  "warnings": [],
  "requires_approval": false
}
```

### Example rejected result

```json
{
  "task_id": "task-78421",
  "worker_id": "customer-briefing-worker",
  "status": "failed",
  "error_code": "GROUNDING_VALIDATION_FAILED",
  "message": "The generated expansion claim is not supported by retrieved evidence.",
  "validation": {
    "schema": "passed",
    "completeness": "passed",
    "business_rules": "passed",
    "authorization": "passed",
    "data_quality": "passed",
    "grounding": "failed",
    "security": "passed"
  },
  "retryable": false
}
```

## 16. How the Delegator uses the validation result

The Delegator should not treat every Worker response as equally reliable.

```text
Worker Result
    |
    v
Delegator
    |
    +--> status = success
    |       |
    |       v
    |    Include in domain result
    |
    +--> status = accepted_with_warnings
    |       |
    |       v
    |    Include with warnings
    |
    +--> status = partial_success
    |       |
    |       v
    |    Decide whether to continue or request missing data
    |
    +--> status = pending_approval
    |       |
    |       v
    |    Route to approval workflow
    |
    +--> status = failed
            |
            v
         Retry, fallback, escalate, or stop
```

The Delegator should use the Worker's explicit status and validation metadata rather than trying to infer reliability from the text.

## 17. Validation layers and ownership

| Validation layer | Primary mechanism | Owner |
| --- | --- | --- |
| Schema correctness | JSON Schema, typed models, contract validation | Worker runtime |
| Completeness | Required-field and evidence coverage checks | Worker |
| Business rules | Rules engine, deterministic calculations, policy service | Worker and domain policy |
| Authorization | Identity, RBAC, ABAC, entitlement service | Gateway, Worker, policy service |
| Data quality | Source metadata, freshness, consistency, validation rules | Worker and source systems |
| Grounding | Evidence mapping, citations, provenance checks | Worker |
| Security | Data classification, DLP, sensitive-data scanning | Worker and security services |
| Semantic quality | Consistency checks, controlled LLM critique | Worker |
| Approval | Human approval workflow | Business owner or authorized approver |

## 18. Example end-to-end validation flow

```text
Task:
"Generate a quarterly customer briefing"
    |
    v
Worker retrieves CRM, ERP, and support data
    |
    v
Worker generates candidate JSON
    |
    v
Schema check
    |
    +--> Pass
    |
    v
Completeness check
    |
    +--> All required sections present
    |
    v
Business rule check
    |
    +--> Revenue growth calculated deterministically
    +--> Critical case correctly reflected in risk
    |
    v
Authorization check
    |
    +--> Customer and fields are permitted
    |
    v
Data quality check
    |
    +--> ERP data is current
    +--> No unresolved critical conflict
    |
    v
Grounding check
    |
    +--> Every material claim has evidence
    |
    v
Security check
    |
    +--> No restricted fields in output
    |
    v
Final result:
"accepted_with_warnings"
    |
    v
Return structured result to Delegator
```

## 19. Core validation formula

```text
Trusted Worker Output
=
Schema Correctness
+ Completeness
+ Business Rule Compliance
+ Authorization
+ Data Quality
+ Grounding
+ Security
+ Traceability
```

A stricter acceptance condition can be expressed as:

**Accept ⟺ Schema ∧ Completeness ∧ Business Rules ∧ Authorization ∧ Data Quality ∧ Grounding ∧ Security**

Non-critical warnings may be permitted, but critical authorization, security, business-rule, or grounding failures should block acceptance.

## Final Definition

A Worker validates its output before returning it to the Delegator by checking the result against the task contract, enforcing schema correctness, verifying required content and evidence coverage, applying deterministic business rules, confirming authorization and security constraints, assessing source-data quality, validating grounding and provenance, detecting contradictions, and deciding whether to accept, repair, return partially, escalate, or reject the result.

In the CWD architecture:

> The Worker is responsible for proving that its result is structurally valid, complete, authorized, business-compliant, data-quality aware, and evidence-grounded before the Delegator is allowed to use it in the domain-level response.