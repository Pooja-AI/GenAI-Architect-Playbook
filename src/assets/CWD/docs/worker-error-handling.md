# Worker Agent: Failure Detection, Retry, Timeout, and Controlled Recovery

A Worker detects failures by classifying execution errors, applying bounded retry and timeout policies, capturing diagnostic context, and returning a structured failure result that allows the Delegator to decide whether to retry, use a fallback, continue with partial results, escalate, or stop.

> A Worker owns local failure handling. The Delegator owns domain-level recovery and coordination.

```
Worker Task
    |
    v
Execute Tool / API / Business Logic
    |
    v
Detect Failure
    |
    v
Classify Failure
    |
    +--> Transient
    +--> Permanent
    +--> Timeout
    +--> Authorization / Policy
    +--> Data / Validation
    |
    v
Apply Retry and Timeout Policy
    |
    +--> Retry locally
    +--> Fail immediately
    +--> Return partial result
    +--> Escalate approval
    |
    v
Capture Error and Trace Context
    |
    v
Return Controlled Result
    |
    v
Delegator Recovery Decision
```

# 1. Why Worker-level failure handling is necessary

Enterprise Workers depend on multiple systems:

* APIs

* Microservices

* Databases

* Enterprise search

* MCP tools

* File repositories

* LLM services

* Authentication services

* Message brokers

* Document renderers

* Storage systems

Any of these dependencies can fail.

For example:

```
Customer Briefing Worker
    |
    +--> CRM: Success
    +--> ERP: Success
    +--> Support API: Timeout
    +--> Document Renderer: Success
```

The Worker must not:

* Treat every failure as retryable

* Retry an unauthorized request

* Retry invalid input indefinitely

* Repeat a non-idempotent transaction

* Hide the failed dependency

* Return an empty result as if the task succeeded

* Claim the artifact was published when publication failed

Instead, it should return a controlled status with enough information for the Delegator to recover.

# 2. Failure categories

The first step is to classify the failure.

## 2.1 Transient failures

A transient failure is temporary and may succeed if the operation is attempted again.

Examples:

* Temporary network interruption

* Connection reset

* HTTP 408 timeout

* HTTP 429 rate limiting

* HTTP 502, 503, or 504

* Temporary service unavailability

* Database connection pool exhaustion

* Temporary message-broker failure

* LLM service overload

* Short-lived DNS or infrastructure issue

  Transient Failure
  |
  v
  Wait according to policy
  |
  v
  Retry if safe

A transient failure is not guaranteed to recover. It is only a candidate for retry.

## 2.2 Permanent failures

A permanent failure is unlikely to succeed without changing the request, configuration, data, or authorization.

Examples:

* Invalid customer ID

* Unsupported artifact type

* Malformed request

* Missing required field

* Unsupported API operation

* Resource does not exist

* Invalid schema

* Business rule violation

* Unresolvable data conflict

* Unsupported output format

* Permanently unavailable capability

  Permanent Failure
  |
  v
  Do not retry automatically
  |
  v
  Return controlled failure

## 2.3 Authorization and policy failures

These should generally fail immediately.

Examples:

* Access token expired and cannot be refreshed

* User lacks entitlement

* Worker lacks required permission

* Tool is not approved

* Requested data classification is prohibited

* Destination is not authorized

* Policy blocks the operation

  Authorization / Policy Failure
  |
  v
  Stop execution
  |
  v
  Return policy-specific failure

Retrying an unauthorized request does not make it authorized.

## 2.4 Data and validation failures

Examples:

* Missing source data

* Invalid source response

* Conflicting customer identity

* Stale data

* Schema validation failure

* Ungrounded generated claim

* Required section missing

* Business calculation mismatch

These may be:

* Retryable if the source is temporarily unavailable

* Repairable if the generated output is malformed

* Non-retryable if the underlying data or rule is invalid

# 3. Failure classification matrix

|
Failure type

|

Example

|

Retry automatically?

|

Typical action

|
| --- | --- | --- | --- |
|

Network reset

|

Connection closed unexpectedly

|

Yes, bounded

|

Retry with backoff

|
|

Rate limit

|

HTTP 429

|

Yes, after delay

|

Respect `Retry-After`

|
|

Service unavailable

|

HTTP 503

|

Yes, bounded

|

Retry or fallback

|
|

Gateway timeout

|

HTTP 504

|

Yes, if operation is safe

|

Retry with timeout budget

|
|

Invalid input

|

Missing customer ID

|

No

|

Return validation failure

|
|

Unauthorized access

|

HTTP 403

|

No

|

Stop and report authorization failure

|
|

Authentication expiry

|

Expired token

|

Sometimes

|

Refresh once, then fail

|
|

Resource not found

|

Unknown account ID

|

Usually no

|

Return not-found result

|
|

Business rule violation

|

Credit limit exceeds policy

|

No

|

Return business failure

|
|

Schema failure

|

Invalid generated JSON

|

Yes, limited

|

Repair or regenerate

|
|

Data conflict

|

Conflicting account identity

|

Usually no

|

Apply policy or escalate

|
|

Non-idempotent write uncertainty

|

Timeout after payment request

|

No blind retry

|

Query operation status

|
|

Output grounding failure

|

Unsupported claim

|

No blind retry

|

Remove claim or reject

|

# 4. How Workers detect failures

Failure detection should occur at multiple layers.

```
Tool Invocation
    |
    +--> Transport status
    +--> Authentication status
    +--> Response schema
    +--> Business response status
    +--> Data quality
    +--> Policy compliance
    +--> Execution timeout
    +--> Output validation
```

## 4.1 Transport-level detection

The Worker checks:

* Connection errors

* DNS failures

* TLS failures

* HTTP status codes

* Response time

* Connection reset

* Request cancellation

Example:

Python

Run

```
if response.status_code in [408, 429, 502, 503, 504]:
    classify_as_transient()
```

## 4.2 Application-level detection

An HTTP 200 response may still contain a business failure.

JSON

```
{
  "status": "success",
  "business_result": {
    "operation_status": "rejected",
    "reason": "Credit limit exceeded"
  }
}
```

The Worker must inspect the application response rather than treating HTTP success as business success.

## 4.3 Schema-level detection

JSON

```
{
  "customer_id": "CUST-10245",
  "revenue": "unknown"
}
```

If revenue must be numeric, the Worker should classify this as a response-validation failure.

## 4.4 Semantic-level detection

The Worker may detect contradictions such as:

```
Summary: No critical issues exist.
Evidence: One critical issue is open.
```

This is a semantic or business consistency failure even though the JSON is valid.

# 5. Retry policy design

A retry policy should be defined per operation, not globally.

The policy should include:

* Maximum attempts

* Maximum elapsed time

* Retryable error types

* Backoff strategy

* Jitter

* Retry-After handling

* Idempotency requirements

* Cancellation behavior

* Fallback behavior

* Escalation behavior

### Example retry policy

JSON

```
{
  "policy_id": "support-api-read-v2",
  "max_attempts": 3,
  "max_elapsed_time_seconds": 20,
  "backoff": {
    "type": "exponential",
    "initial_delay_ms": 500,
    "maximum_delay_ms": 5000,
    "jitter": true
  },
  "retryable_errors": [
    "CONNECTION_RESET",
    "HTTP_429",
    "HTTP_503",
    "HTTP_504"
  ],
  "non_retryable_errors": [
    "HTTP_400",
    "HTTP_401",
    "HTTP_403",
    "HTTP_404"
  ],
  "requires_idempotency": true
}
```

# 6. Exponential backoff with jitter

A common retry strategy is exponential backoff.

Dn=min⁡(Dmax⁡,D0×2n−1)D_n = \min(D_{\max}, D_0 \times 2^{n-1})Dn=min(Dmax,D0×2n−1)

Where:

* DnD_nDn = delay before retry nnn

* D0D_0D0 = initial delay

* Dmax⁡D_{\max}Dmax = maximum delay

* nnn = retry attempt number

For example:

```
Attempt 1: Immediate
Attempt 2: 500 ms
Attempt 3: 1 second
Attempt 4: 2 seconds
```

Jitter adds a small random variation to prevent many Workers from retrying at the same time.

Dactual=Dn+random jitterD_{\text{actual}} = D_n + \text{random jitter}Dactual=Dn+random jitter

The Worker should also respect server-provided retry guidance such as `Retry-After`.

# 7. Retry only safe operations

Retry safety depends on whether repeating the operation can cause harm.

## 7.1 Usually safer to retry

* Read-only API calls

* Search requests

* Database reads

* Metadata retrieval

* Idempotent updates

* Artifact validation

* LLM generation with no external side effect

## 7.2 Requires special handling

* Create customer

* Submit order

* Send email

* Create ticket

* Trigger payment

* Update CRM record

* Start deployment

* Execute workflow

* Delete resource

A timeout does not prove that the operation failed.

```
Worker sends "Create Ticket"
    |
    v
Network timeout
    |
    v
Did the ticket get created?
    |
    +--> Unknown
```

The Worker must not blindly retry. It should use:

* Idempotency keys

* Operation-status lookup

* Transaction identifiers

* Safe reconciliation

* Exactly-once or effectively-once patterns where supported

# 8. Idempotency for downstream operations

An idempotency key allows repeated requests to produce one logical operation.

JSON

```
{
  "operation": "create_support_case",
  "idempotency_key": "task-78421-create-case",
  "customer_id": "CUST-10245",
  "issue": "Critical support escalation"
}
```

If the request times out, the Worker can query the operation status using the same key.

```
Create Request
    |
    v
Timeout
    |
    v
Query by Idempotency Key
    |
    +--> Created: return existing result
    +--> Not Created: retry safely
    +--> Unknown: escalate for reconciliation
```

# 9. Timeout policies

Timeouts prevent a Worker from waiting indefinitely for a dependency.

A production Worker should use multiple timeout layers.

```
Overall Task Timeout
    |
    +--> Tool Connection Timeout
    +--> Tool Read Timeout
    +--> Database Query Timeout
    +--> LLM Generation Timeout
    +--> Rendering Timeout
    +--> Storage Timeout
```

## 9.1 Timeout types

|
Timeout

|

Meaning

|
| --- | --- |
|

Connection timeout

|

Time allowed to establish connection

|
|

Read timeout

|

Time allowed to receive response data

|
|

Operation timeout

|

Time allowed for one tool operation

|
|

Retry timeout

|

Maximum time spent across retries

|
|

Worker task timeout

|

Maximum time for the entire Worker task

|
|

Delegator deadline

|

Overall deadline imposed by the Delegator

|

The Worker must honor the smallest applicable deadline.

Teffective=min⁡(TWorker,TDelegator,TTool,TPolicy)T_{\text{effective}} = \min( T_{\text{Worker}}, T_{\text{Delegator}}, T_{\text{Tool}}, T_{\text{Policy}} )Teffective=min(TWorker,TDelegator,TTool,TPolicy)

### Example

```
Delegator deadline: 60 seconds
Worker task timeout: 45 seconds
ERP API timeout: 15 seconds

Effective Worker deadline: 45 seconds
ERP operation deadline: 15 seconds
```

# 10. Deadline propagation

The Delegator should pass a deadline or remaining time budget to the Worker.

JSON

```
{
  "task_id": "task-78421",
  "deadline": "2026-09-06T12:05:00Z",
  "timeout_budget_seconds": 45
}
```

The Worker propagates the remaining budget to downstream calls.

```
Delegator
    |
    | 45-second deadline
    v
Worker
    |
    | 15-second sub-deadline
    v
ERP API
```

This prevents a Worker from spending the entire task budget on one dependency and leaving no time for validation or response delivery.

# 11. Timeout handling

When a timeout occurs, the Worker should determine whether the operation is:

* Safe to retry

* Still running remotely

* Cancelable

* Partially completed

* In an unknown state

### Example timeout result

JSON

```
{
  "status": "failed",
  "error_code": "DEPENDENCY_TIMEOUT",
  "dependency": "support-api",
  "operation": "get_open_cases",
  "retryable": true,
  "attempts": 2,
  "elapsed_time_ms": 18000,
  "partial_result_available": false
}
```

For an unknown-state write:

JSON

```
{
  "status": "unknown",
  "error_code": "OPERATION_STATUS_UNKNOWN",
  "dependency": "crm-api",
  "operation": "create_opportunity",
  "retryable": false,
  "reconciliation_required": true,
  "idempotency_key": "task-78421-create-opportunity"
}
```

# 12. Error capture and diagnostic context

The Worker should capture enough information to diagnose the failure without exposing sensitive data.

## 12.1 Recommended error fields

* Correlation ID

* Task ID

* Worker ID

* Delegator ID

* Operation name

* Dependency name

* Error category

* Error code

* HTTP status, if applicable

* Attempt number

* Retryable flag

* Timeout information

* Elapsed time

* Policy ID

* Idempotency key, if applicable

* Sanitized error message

* Stack trace in secure internal logs

* Recovery recommendation

### Example internal error record

JSON

```
{
  "correlation_id": "corr-78421",
  "task_id": "task-78421",
  "worker_id": "customer-briefing-worker",
  "operation": "retrieve_support_cases",
  "dependency": "support-api",
  "error_category": "transient",
  "error_code": "HTTP_503",
  "attempt": 2,
  "max_attempts": 3,
  "retryable": true,
  "timeout_budget_remaining_ms": 7200,
  "policy_id": "support-api-read-v2",
  "recovery_action": "retry_with_backoff"
}
```

## 12.2 Do not log

* Access tokens

* Passwords

* API keys

* Full confidential documents

* Unmasked personal information

* Sensitive customer data

* Complete prompts containing restricted data

* Raw authorization headers

Use redaction and structured logging.

# 13. Error taxonomy

A consistent error taxonomy allows the Delegator to make predictable decisions.

```
WORKER_ERROR
├── VALIDATION_ERROR
├── AUTHENTICATION_ERROR
├── AUTHORIZATION_ERROR
├── POLICY_VIOLATION
├── DEPENDENCY_ERROR
│   ├── TRANSIENT
│   ├── PERMANENT
│   └── UNKNOWN_STATE
├── TIMEOUT_ERROR
├── DATA_QUALITY_ERROR
├── BUSINESS_RULE_ERROR
├── SCHEMA_ERROR
├── GROUNDING_ERROR
├── RENDERING_ERROR
├── STORAGE_ERROR
└── INTERNAL_ERROR
```

Example:

JSON

```
{
  "error_code": "DATA_QUALITY_ERROR",
  "error_subcode": "STALE_SOURCE_DATA"
}
```

The Delegator can then apply the correct recovery strategy without interpreting free-form text.

# 14. Controlled failure response contract

The Worker should return a standard response envelope for both success and failure.

## 14.1 Response envelope

JSON

```
{
  "task_id": "task-78421",
  "worker_id": "customer-briefing-worker",
  "status": "failed",
  "result": null,
  "error": {
    "code": "DEPENDENCY_TIMEOUT",
    "category": "transient",
    "message": "The support system did not respond within the allowed time.",
    "dependency": "support-api",
    "operation": "get_open_cases",
    "retryable": true,
    "retry_after_ms": 2000,
    "attempts": 2,
    "partial_result_available": false,
    "reconciliation_required": false
  },
  "validation": {
    "schema": "not_run",
    "completeness": "failed",
    "authorization": "passed",
    "grounding": "not_run"
  },
  "recovery": {
    "recommended_action": "retry_worker_task",
    "fallback_available": true,
    "escalation_required": false
  },
  "trace": {
    "correlation_id": "corr-78421"
  }
}
```

This response gives the Delegator actionable information.

# 15. Partial results

A Worker may return a partial result when the task can safely produce useful information despite one failed dependency.

Example:

```
CRM: Success
ERP: Success
Support: Timeout
```

The Worker may return:

JSON

```
{
  "status": "partial_success",
  "result": {
    "customer_overview": {},
    "financial_metrics": {},
    "support_issues": null
  },
  "warnings": [
    "Support information could not be retrieved."
  ],
  "missing_sections": [
    "support_issues"
  ],
  "recovery": {
    "recommended_action": "retry_missing_dependency"
  }
}
```

The Worker must not present the partial result as complete.

The Delegator decides whether to:

* Return the partial result

* Retry only the failed section

* Invoke a fallback source

* Wait for recovery

* Escalate to a human

# 16. Fallback strategies

Fallbacks should be explicit and policy-approved.

Examples:

|
Primary dependency

|

Possible fallback

|
| --- | --- |
|

Live CRM API

|

Read-only cache

|
|

Enterprise search

|

Approved secondary index

|
|

LLM provider

|

Approved backup model

|
|

Document renderer

|

Return validated JSON or Markdown

|
|

Support API

|

Cached case snapshot

|
|

Notification service

|

Queue message for later delivery

|
|

Primary database

|

Read replica

|

A fallback must preserve data-quality status.

JSON

```
{
  "status": "success_with_warnings",
  "data_source": "support-cache",
  "data_freshness": "stale",
  "warning": "Live support data was unavailable."
}
```

A stale cache should never be presented as live data.

# 17. Delegator-level recovery

The Worker handles local recovery. The Delegator handles the broader domain workflow.

```
Worker Failure
    |
    v
Delegator
    |
    +--> Retry same Worker
    +--> Retry only failed subtask
    +--> Invoke fallback Worker
    +--> Re-plan dependent tasks
    +--> Continue with partial result
    +--> Request human intervention
    +--> Cancel downstream tasks
    +--> Return domain failure
```

## Example

```
Delegator: Customer Review
    |
    +--> Worker A: Customer Profile      SUCCESS
    +--> Worker B: Financial Summary     SUCCESS
    +--> Worker C: Support Summary      TIMEOUT
    |
    v
Delegator evaluates Worker C failure
    |
    +--> Retry Worker C once
    |
    +--> If still unavailable:
            |
            +--> Use approved cache
            +--> Mark support section as stale
            +--> Continue report generation
```

The Delegator should use the Worker’s structured error code and recovery hints, not retry blindly.

# 18. Dependency-aware recovery

Some tasks depend on other tasks.

```
Retrieve Customer
    |
    v
Generate Customer Briefing
    |
    v
Publish Document
```

If customer retrieval fails, document generation should not continue.

Other tasks may be independent:

```
Retrieve CRM Data ─────┐
                       ├──> Generate Briefing
Retrieve ERP Data ─────┤
                       │
Retrieve Support Data ─┘
```

If support retrieval fails but the artifact policy permits partial output, the Delegator may continue with a warning.

The Worker should identify:

* Whether the result is usable

* Which sections are missing

* Which downstream tasks are blocked

* Whether the failure is safe to retry

* Whether human approval is required

# 19. Circuit breakers and repeated failures

If a dependency repeatedly fails, Workers should avoid continuously sending requests to it.

A circuit breaker typically has three states:

```
CLOSED
  |
  | Repeated failures
  v
OPEN
  |
  | Wait for recovery interval
  v
HALF-OPEN
  |
  +--> Success: CLOSED
  |
  +--> Failure: OPEN
```

This protects:

* The failing dependency

* Worker capacity

* Overall platform latency

* Other users and tasks

* The CWD execution chain

The Delegator may then select a fallback or return a controlled unavailable status.

# 20. Error handling for LLM generation

LLM failures include:

* Provider timeout

* Rate limit

* Invalid structured output

* Context-length overflow

* Content-policy refusal

* Unsupported claim

* Grounding failure

* Repeated malformed response

The Worker should distinguish between:

```
LLM Service Failure
    |
    +--> Retryable provider issue
    |
    +--> Output-format issue
    |
    +--> Grounding issue
    |
    +--> Policy refusal
```

For example:

JSON

```
{
  "error_code": "LLM_OUTPUT_SCHEMA_INVALID",
  "retryable": true,
  "max_repair_attempts": 1,
  "recovery_action": "repair_structured_output"
}
```

But:

JSON

```
{
  "error_code": "GROUNDING_VALIDATION_FAILED",
  "retryable": false,
  "recovery_action": "remove_unsupported_claim_or_escalate"
}
```

The Worker should not repeatedly regenerate unsupported facts until one happens to pass.

# 21. Example Worker execution pseudocode

Python

Run

```
def execute_worker_task(task, context):
    deadline = create_deadline(
        task_deadline=task["deadline"],
        worker_timeout=task["timeout_budget_seconds"]
    )

    try:
        validate_task(task)
        authorize_task(task, context)

        result = execute_with_policy(
            operation=task["operation"],
            deadline=deadline,
            retry_policy=task["retry_policy"],
            idempotency_key=task.get("idempotency_key")
        )

        validate_output(result, task["output_schema"])
        validate_business_rules(result, task["business_rules"])
        validate_grounding(result, task.get("evidence"))

        return success_response(
            task=task,
            result=result
        )

    except RetryableDependencyError as error:
        return controlled_failure(
            task=task,
            code=error.code,
            category="transient",
            retryable=True,
            recovery_action="retry_or_fallback",
            error=error
        )

    except AuthorizationError as error:
        return controlled_failure(
            task=task,
            code="AUTHORIZATION_FAILED",
            category="authorization",
            retryable=False,
            recovery_action="stop_and_escalate",
            error=error
        )

    except BusinessRuleError as error:
        return controlled_failure(
            task=task,
            code="BUSINESS_RULE_VIOLATION",
            category="business",
            retryable=False,
            recovery_action="review_or_replan",
            error=error
        )

    except TimeoutError as error:
        return controlled_failure(
            task=task,
            code="WORKER_TIMEOUT",
            category="timeout",
            retryable=operation_is_safe_to_retry(task),
            recovery_action="retry_or_return_partial",
            error=error
        )
```

# 22. What the Worker must never do

A Worker must not:

* Retry indefinitely

* Retry every HTTP error

* Retry unauthorized requests

* Retry invalid input

* Blindly retry non-idempotent writes

* Ignore the Delegator deadline

* Return an empty result as success

* Hide missing data

* Expose secrets in errors

* Return raw stack traces to users

* Claim an operation succeeded after an unknown-state timeout

* Continue dependent tasks after a critical prerequisite failure

* Convert a policy violation into a generic transient error

* Lose the correlation ID

* Return free-form errors without machine-readable codes

# 23. Example controlled failure scenarios

## Scenario A: Transient API failure

```
Support API returns HTTP 503
    |
    v
Worker classifies as transient
    |
    v
Retry after exponential backoff
    |
    v
Second attempt succeeds
    |
    v
Worker returns success
```

## Scenario B: Permanent validation failure

```
Customer ID is missing
    |
    v
Worker rejects task
    |
    v
No retry
    |
    v
Delegator requests corrected input
```

## Scenario C: Timeout after a write

```
Worker submits CRM update
    |
    v
Request times out
    |
    v
Operation state is unknown
    |
    v
Worker queries by idempotency key
    |
    v
Delegator receives reconciliation-required result
```

## Scenario D: Partial result

```
CRM and ERP succeed
Support API fails
    |
    v
Worker generates partial briefing
    |
    v
Support section marked unavailable
    |
    v
Delegator decides whether to continue
```

## Scenario E: Authorization failure

```
Worker requests restricted customer data
    |
    v
Policy service denies access
    |
    v
Worker stops execution
    |
    v
Delegator receives authorization failure
```

# 24. Recommended failure response statuses

|
Status

|

Meaning

|
| --- | --- |
|

`success`

|

Task completed and validated

|
|

`success_with_warnings`

|

Completed with non-critical warnings

|
|

`partial_success`

|

Useful result returned, but required information is missing

|
|

`retrying`

|

Worker is performing a bounded local retry

|
|

`pending_reconciliation`

|

Operation state is unknown after a timeout

|
|

`pending_approval`

|

Result requires authorized review

|
|

`failed`

|

Task could not be completed

|
|

`rejected`

|

Task blocked by authorization, policy, or validation

|
|

`cancelled`

|

Task stopped because its deadline or parent workflow ended

|

# 25. Core failure-handling formula

Controlled Failure Handling=Failure Detection+Classification+Timeout Enforcement+Bounded Retry+Idempotency+Error Capture+Fallback or Partial Result+Structured Failure Contract+Delegator Recovery Hint\text{Controlled Failure Handling} = \text{Failure Detection} + \text{Classification} + \text{Timeout Enforcement} + \text{Bounded Retry} + \text{Idempotency} + \text{Error Capture} + \text{Fallback or Partial Result} + \text{Structured Failure Contract} + \text{Delegator Recovery Hint}Controlled Failure Handling=Failure Detection+Classification+Timeout Enforcement+Bounded Retry+Idempotency+Error Capture+Fallback or Partial Result+Structured Failure Contract+Delegator Recovery Hint

A Worker’s failure response should answer five questions:

1. What failed?

2. Why did it fail?

3. Can it be retried safely?

4. What result, if any, is still usable?

5. What should the Delegator do next?

# Final Definition

A Worker detects and handles failures by monitoring transport, application, validation, policy, data, and execution conditions; classifying failures as transient, permanent, timeout, authorization, or business-related; applying bounded retry and timeout policies; protecting non-idempotent operations with idempotency and reconciliation; capturing sanitized diagnostic information; and returning a machine-readable result that describes the failure, retryability, partial-result state, and recommended recovery action.

In the CWD architecture:

> The Worker performs local recovery within its execution boundary, while the Delegator uses the Worker’s controlled success, partial-success, pending, or failure response to make domain-level recovery decisions.
