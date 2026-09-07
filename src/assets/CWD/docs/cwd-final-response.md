# Coordinator Response Synthesis in CWD

The Coordinator is responsible for turning validated domain results into one coherent, secure, user-facing response. It does not simply concatenate Delegator outputs or allow an LLM to invent a conclusion.

> The Delegators explain what happened in their domains; the Coordinator determines what the combined results mean for the user's overall request.

```
Delegator Results
       ↓
Coordinator Result Collection
       ↓
Correlation + Status Validation
       ↓
Completeness + Conflict Analysis
       ↓
Enterprise-Level Synthesis
       ↓
Response Generation
       ↓
Grounding + Security + Policy Validation
       ↓
Final Response Delivery
       ↓
User
```


## 1. What the Coordinator Receives

The Coordinator receives structured results from Delegators, not raw Worker outputs.

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "source_agent": "shipping-delegator",
  "target_agent": "coordinator",
  "status": "completed",
  "result": {
    "domain": "shipping",
    "shipment_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommended_action": "reroute"
  },
  "worker_summary": {
    "total": 3,
    "successful": 3,
    "failed": 0
  },
  "warnings": [],
  "errors": []
}
```

The Coordinator may receive several domain results:

```
Shipping Delegator  → Shipment delayed
Inventory Delegator → Replacement inventory available
Policy Delegator    → Rerouting requires approval
```

Its responsibility is to combine these into an enterprise-level conclusion.

## 2. The Complete Synthesis Lifecycle

```
Receive Delegator Results
        ↓
Correlate with Original Request
        ↓
Validate Result Identity and Schema
        ↓
Check Authorization and Scope
        ↓
Assess Completion and Failures
        ↓
Resolve Cross-Domain Conflicts
        ↓
Combine Validated Domain Results
        ↓
Determine Business Outcome
        ↓
Generate User-Facing Response
        ↓
Validate Grounding, Security, and Policy
        ↓
Return Response
```

Each stage prevents a different class of failure.

## 3. Correlating Results with the Original Request

The Coordinator must ensure that every result belongs to the correct workflow and request.

```
User Request
  correlation_id = CORR-7890
       ↓
Workflow WF-1001
       ↓
Delegator Tasks
       ↓
Worker Runs
       ↓
Delegator Results
       ↓
Coordinator Synthesis
```

Important identifiers include:

|
Identifier

|

Purpose

|
| --- | --- |
|

`correlation_id`

|

End-to-end business request

|
|

`workflow_id`

|

Workflow execution

|
|

`task_id`

|

Specific Delegator task

|
|

`parent_task_id`

|

Parent-child relationship

|
|

`run_id`

|

Execution attempt

|
|

`message_id`

|

Individual message

|

A result with the wrong correlation or parent task must not be included in the synthesis.

## 4. Validating Delegator Results

Before synthesis, the Coordinator validates:

* Result identity

* Expected domain

* Execution status

* Schema

* Required fields

* Authorization and tenant scope

* Business validity

* Provenance

* Completeness

* Errors and warnings

* Data freshness

Example:

Python

Run

```
def validate_delegator_result(result, workflow_id):
    if result["workflow_id"] != workflow_id:
        raise ValueError("Result belongs to another workflow")

    if result["status"] not in {
        "completed",
        "partial",
        "failed",
        "timeout"
    }:
        raise ValueError("Invalid result status")

    return result
```

The Coordinator should not assume that a Delegator result is correct merely because the Delegator reported success.

## 5. Assessing Completeness

The Coordinator compares the received results with the expected workflow plan.

```
Expected:
  Shipping result
  Inventory result
  Policy result

Received:
  Shipping result ✓
  Inventory result ✓
  Policy result ✗
```

The Coordinator must determine whether:

* All required tasks completed

* Optional tasks failed

* A required dependency is missing

* Results are partial

* The workflow timed out

* Additional execution is needed

* Human approval is required

Example:

JSON

```
{
  "workflow_id": "WF-1001",
  "status": "partial",
  "completed_domains": [
    "shipping",
    "inventory"
  ],
  "missing_domains": [
    "policy"
  ],
  "next_action": "request_approval"
}
```

A final response must not claim complete certainty when required evidence is missing.

## 6. Resolving Cross-Domain Conflicts

Different Delegators may return conflicting conclusions.

```
Shipping Delegator:
"Rerouting is recommended."

Policy Delegator:
"Rerouting is not permitted without approval."
```

The Coordinator must apply:

* Enterprise policy

* Source authority

* Business rules

* Data freshness

* Workflow dependencies

* Risk classification

* Human approval requirements

The LLM may explain the conflict, but it must not override enterprise policy.

```
Domain Results
      ↓
Policy and Business Rules
      ↓
Conflict Resolution
      ↓
Validated Enterprise Decision
```

If the conflict cannot be resolved safely, the Coordinator should return an uncertainty or escalation outcome.

## 7. Combining Results into an Enterprise Outcome

The Coordinator combines validated domain results into a common enterprise model.

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "status": "needs_approval",
  "business_outcome": {
    "shipment_id": "SHIP123",
    "current_status": "delayed",
    "root_cause": "carrier_capacity",
    "recommended_action": "reroute",
    "approval_required": true
  },
  "domain_results": {
    "shipping": "validated-result-001",
    "inventory": "validated-result-002",
    "policy": "validated-result-003"
  }
}
```

The Coordinator should preserve the distinction between:

```
Domain Result
      +
Enterprise Decision
      +
User-Facing Explanation
```

These are related but not identical.

## 8. Generating the Final Response

The Coordinator may use an LLM to convert the validated enterprise outcome into a natural-language response.

```
Validated Enterprise Result
        ↓
Relevant Context
        ↓
Approved Prompt Version
        ↓
LLM
        ↓
Draft Response
```

Example:

```
"Shipment SHIP123 is delayed because of a carrier capacity
constraint. Rerouting is recommended, but approval is required
before the change can be submitted."
```

The LLM should receive:

* Original user request

* Relevant validated domain results

* Approved business context

* Required response format

* Relevant provenance

* Governed prompt instructions

It should not receive unrestricted raw system data or unrelated workflow state.

## 9. Grounding and Response Validation

Before returning the response, the Coordinator validates:

### Factual grounding

Does the response match the validated results?

### Completeness

Does it address the user's actual question?

### Consistency

Does it contradict any authoritative domain result?

### Security

Does it expose restricted information?

### Policy compliance

Does it recommend or imply an unauthorized action?

### Schema

Does it satisfy the required response contract?

```
Draft Response
      ↓
Schema Validation
      ↓
Business Validation
      ↓
Grounding Check
      ↓
Security / Data Leakage Check
      ↓
Policy Check
      ↓
Approved Response
```

If validation fails, the Coordinator may revise the response, request additional evidence, or return a controlled failure.

## 10. Provenance and Explainability

The Coordinator should be able to explain where the response came from.

```
Final Response
   ├── Shipping result
   ├── Inventory result
   └── Policy result
```

A response may include concise source references or evidence summaries when appropriate.

Example:

JSON

```
{
  "response": "Shipment is delayed because of carrier capacity.",
  "evidence": [
    {
      "domain": "shipping",
      "source_reference": "result-001"
    }
  ]
}
```

The system should retain detailed provenance for audit and troubleshooting, even when the user-facing response is concise.

## 11. Secure Return to the User

Returning the response is another controlled boundary.

```
Validated Response
       ↓
Response Policy Check
       ↓
Sensitive Data Filtering
       ↓
Tenant / User Scope Check
       ↓
Format for Channel
       ↓
Gateway
       ↓
User
```

The Coordinator should ensure that the response:

* Belongs to the correct user and session

* Does not cross tenant boundaries

* Does not expose restricted fields

* Does not include credentials or internal secrets

* Does not reveal hidden prompts or internal implementation details

* Does not claim an action was completed when it was only recommended

* Uses the appropriate response format for the channel

For example:

```
Recommended:
"Rerouting is recommended."

Not equivalent to:
"Rerouting has been completed."
```

The response must accurately distinguish recommendation, approval, submission, and completed execution.

## 12. Gateway and Coordinator Responsibilities

|
Responsibility

|

Gateway

|

Coordinator

|
| --- | --- | --- |
|

Authenticate incoming user

|

✓

|  |
|

Validate request envelope

|

✓

|  |
|

Establish correlation

|

✓

|  |
|

Interpret intent

|  |

✓

|
|

Plan workflow

|  |

✓

|
|

Collect Delegator results

|  |

✓

|
|

Resolve enterprise-level conflicts

|  |

✓

|
|

Generate final response

|  |

✓

|
|

Validate response content

|  |

✓

|
|

Enforce ingress limits

|

✓

|  |
|

Apply response delivery controls

|

✓

|

✓

|
|

Return response to channel

|

✓

|

✓

|

The Gateway controls secure entry and exit. The Coordinator controls enterprise reasoning, synthesis, and workflow completion.

## 13. Coordinator Synthesis with LangGraph

LangGraph can manage the final synthesis workflow.

```
START
  ↓
Receive Delegator Results
  ↓
Validate Results
  ↓
Check Completeness
  ↓
{All Required Results Available?}
  ├── No → Wait / Retry / Recover
  └── Yes
        ↓
Resolve Conflicts
        ↓
Aggregate Enterprise Outcome
        ↓
Generate Response
        ↓
Validate Response
        ↓
{Response Valid?}
  ├── No → Revise / Escalate
  └── Yes → Return Response
```

LangGraph manages:

* State transitions

* Conditional routing

* Checkpointing

* Waiting for asynchronous results

* Retry and recovery

* Human approval pauses

* Response-generation flow

It does not replace the policy engine, identity system, or response-security controls.

## 14. Handling Partial and Failed Results

The Coordinator must preserve failure information.

### Example

```
Shipping Delegator  → Completed
Inventory Delegator → Completed
Policy Delegator    → Failed
```

Possible responses:

```
"Shipment SHIP123 is delayed because of carrier capacity.
Inventory is available for a replacement. Approval status could
not be verified because the policy service is unavailable."
```

The Coordinator may:

* Retry the failed Delegator

* Rediscover an alternate agent

* Request additional information

* Wait for a long-running task

* Escalate to a human

* Return a partial response

* Stop execution if the missing result is mandatory

It should never silently ignore a required failure.

## 15. Human Approval and High-Risk Actions

Some workflows require approval before the final response can authorize or trigger an action.

```
Validated Recommendation
        ↓
Risk Assessment
        ↓
Human Approval Required?
        ├── No → Continue
        └── Yes
              ↓
        Pause and Checkpoint
              ↓
        Authorized Human Decision
              ↓
        Resume Workflow
              ↓
        Final Response
```

Example:

```
"The system recommends rerouting shipment SHIP123.
Approval is required before the reroute can be submitted."
```

The Coordinator must not represent a recommendation as an approved action.

## 16. Example: Coordinator Synthesis Code

Python

Run

```
def synthesize_results(request, delegator_results):
    # 1. Validate and correlate results
    validated = [
        validate_delegator_result(
            result,
            workflow_id=request["workflow_id"]
        )
        for result in delegator_results
    ]

    # 2. Check required domain results
    required_domains = {
        "shipping",
        "inventory",
        "policy"
    }

    received_domains = {
        result["result"]["domain"]
        for result in validated
        if result["status"] == "completed"
    }

    missing_domains = required_domains - received_domains

    if missing_domains:
        return {
            "status": "partial",
            "missing_domains": list(missing_domains),
            "message": "Required domain results are incomplete."
        }

    # 3. Combine validated domain results
    enterprise_result = combine_domain_results(validated)

    # 4. Apply enterprise business and policy rules
    enterprise_result = apply_enterprise_policy(
        enterprise_result
    )

    # 5. Generate a bounded response
    draft = generate_response(
        request=request,
        validated_result=enterprise_result
    )

    # 6. Validate final response
    return validate_final_response(
        draft,
        enterprise_result
    )
```

This illustrates:

```
Validate → Correlate → Check Completeness → Combine
→ Apply Policy → Generate → Validate → Return
```

## 17. Common Anti-Patterns

### 1. Concatenating Delegator responses

Problem: The user receives disconnected domain outputs.

Better: Create one coherent enterprise outcome.

### 2. Letting the LLM invent missing results

Problem: The final answer may appear complete even when required tasks failed.

Better: Track completeness and explicitly report uncertainty.

### 3. Allowing the LLM to override policy

Problem: The model may recommend unauthorized actions.

Better: Enforce policy outside the LLM.

### 4. Returning raw internal data

Problem: Sensitive information or implementation details may leak.

Better: Apply response filtering and data minimization.

### 5. Claiming execution when only a recommendation exists

Problem: Misleads the user and can create operational risk.

Better: Distinguish recommended, approved, submitted, and completed states.

### 6. Losing provenance

Problem: The system cannot explain the basis of its answer.

Better: Preserve domain, task, source, and evidence references.

### 7. Ignoring partial failures

Problem: The Coordinator may produce an unjustifiably confident answer.

Better: Return partial status, missing information, or escalation.

## 18. Core Synthesis Formula

CoordinatorSynthesis=ResultCollection+Correlation+Validation+CompletenessAssessment+ConflictResolution+EnterpriseAggregation+PolicyApplication+ResponseGeneration+ResponseValidation+SecureDelivery\boxed{ CoordinatorSynthesis = ResultCollection + Correlation + Validation + CompletenessAssessment + ConflictResolution + EnterpriseAggregation + PolicyApplication + ResponseGeneration + ResponseValidation + SecureDelivery }CoordinatorSynthesis=ResultCollection+Correlation+Validation+CompletenessAssessment+ConflictResolution+EnterpriseAggregation+PolicyApplication+ResponseGeneration+ResponseValidation+SecureDelivery

A more precise conceptual formula is:

FinalResponse=ValidatedDomainResults+EnterpriseBusinessRules+AuthorizedContext+GovernedPrompt−InvalidResults−UnauthorizedData−UnsupportedClaims\boxed{ FinalResponse = ValidatedDomainResults + EnterpriseBusinessRules + AuthorizedContext + GovernedPrompt - InvalidResults - UnauthorizedData - UnsupportedClaims }FinalResponse=ValidatedDomainResults+EnterpriseBusinessRules+AuthorizedContext+GovernedPrompt−InvalidResults−UnauthorizedData−UnsupportedClaims

Subject to:

```
User Intent + Workflow State + Policy + Security Scope + Output Contract
```

## Interview-Ready Answer

> “In CWD, the Coordinator synthesizes completed Delegator results into a final enterprise response. It first correlates every result with the original request, workflow, and parent task, then validates schema, execution status, authorization, scope, provenance, and completeness. It checks whether required domain results are available and handles partial failures, timeouts, and conflicts explicitly. The Coordinator combines validated domain results using enterprise business rules and policy constraints. An LLM may generate a natural-language explanation, but it cannot invent missing results, override authorization, or claim that an action was completed when it was only recommended. The generated response is then validated for grounding, completeness, schema, sensitive-data leakage, and policy compliance. Finally, the Coordinator returns a structured, secure response through the Gateway, preserving correlation and audit information.”

## Final Definition

Coordinator response synthesis in CWD is the governed process through which the Coordinator collects correlated Delegator results, validates their status, schema, authorization, provenance, and completeness, resolves cross-domain conflicts, combines validated outcomes using enterprise business rules, generates a grounded user-facing response, validates that response for security and policy compliance, and returns it securely through the Gateway.

Mental model: Delegator Results → Correlate → Validate → Check Completeness → Resolve Conflicts → Enterprise Synthesis → Generate → Validate → Secure Delivery.
