# Worker Agent: Secure Interaction with Enterprise APIs and Microservices

In CWD, a Worker securely interacts with enterprise APIs and microservices to retrieve information, execute authorized business operations, and integrate with downstream systems.

The Worker does not receive unrestricted access to enterprise applications. It uses approved adapters, authenticated service connections, policy controls, and defined input/output contracts.

> The Worker executes a specific business operation through a governed integration boundary.

### Core formula

```text
Worker API Integration
=
Task Validation
+ Entitlement Check
+ Approved API Selection
+ Secure Authentication
+ Input Validation
+ Controlled Invocation
+ Response Validation
+ Error Handling
+ Structured Result
```

## 1. Where API Integration Fits in CWD

```text
User Request
    ↓
Coordinator
    ↓
Delegator
    ↓
Worker
    ↓
Policy + Authorization
    ↓
Approved API Adapter
    ↓
Enterprise API / Microservice
    ↓
Downstream System
    ↓
Worker Validation
    ↓
Delegator
```

### Example

```text
Opportunity Worker
    ↓
Salesforce API Adapter
    ↓
Salesforce
    ↓
Retrieve authorized open opportunities
    ↓
Structured opportunity result
```

The Worker owns the execution of the assigned API operation, while the Delegator owns domain-level coordination.

## 2. What Is an Enterprise API or Microservice?

An enterprise API exposes a controlled business or technical capability to other applications.

Examples include:

* Customer profile API
* Revenue service
* Inventory service
* Order management API
* Supplier information service
* Employee directory API
* Notification service
* Document management API
* Internal analytics microservice

A microservice may expose operations such as:

```text
GET    /customers/{customer_id}
GET    /customers/{customer_id}/revenue
GET    /opportunities?customer_id=...
POST   /notifications
PUT    /orders/{order_id}
```

The Worker should interact through the approved API contract, not through direct access to the underlying application database unless that access is explicitly governed.

## 3. Identify the Required API Capability

The Worker first determines which API operation is required for its assigned task.

### Example

Task:

> Retrieve the current inventory for product P-1001.

Required capability:

```text
retrieve_inventory
```

Approved integration:

```text
Inventory Worker
    ↓
Inventory API Adapter
    ↓
Inventory Microservice
```

The Worker should not call unrelated APIs simply because they are available.

## 4. Select an Approved API Adapter

The Worker should use a governed adapter or service client that encapsulates integration details.

### Adapter responsibilities

* API endpoint configuration
* Authentication
* Request construction
* Input mapping
* Timeout handling
* Retry behavior
* Rate-limit handling
* Response parsing
* Error mapping
* Logging and tracing
* API version compatibility

### Example

```text
Worker
    ↓
Customer API Adapter
    ↓
Customer Service
```

The Worker does not need to know every internal detail of the customer service. It uses the adapter's defined capability.

### Why adapters matter

They prevent every Worker from implementing its own:

* Authentication logic
* API contracts
* Retry strategy
* Error handling
* Security controls
* Connection management

This improves consistency and maintainability across CWD.

## 5. Authenticate Securely

Workers must authenticate to enterprise APIs using approved identity mechanisms.

Typical mechanisms include:

* Microsoft Entra ID
* Managed identities
* OAuth 2.0 access tokens
* Service principals
* Mutual TLS, where required
* API keys stored in approved secret-management systems

### Secure flow

```text
Worker
    ↓
Obtain authorized service token
    ↓
Call approved API
    ↓
API validates token and permissions
    ↓
API returns permitted response
```

### Important principles

* Do not hardcode credentials.
* Do not place secrets in prompts.
* Do not pass access tokens to the LLM.
* Do not log tokens or authorization headers.
* Use short-lived credentials where possible.
* Use the minimum required permissions.
* Separate development, UAT, and production identities.

The Worker identity and the user's identity may both matter. The integration must preserve the appropriate authorization context.

## 6. Enforce User Entitlements

A Worker must verify that the user is permitted to perform the requested operation.

### Example

A user may be allowed to:

```text
View customer profile
View open opportunities
```

but not:

```text
Modify customer credit limit
Delete customer records
Export restricted financial data
```

### Authorization flow

```text
User identity
    ↓
Worker task
    ↓
Policy and entitlement check
    ↓
Approved API operation
    ↓
Downstream authorization
```

Authorization may be enforced through:

* Gateway
* Coordinator
* Delegator
* Worker
* API adapter
* Downstream enterprise service

> A Worker must not assume that application access means unrestricted API access.

## 7. Validate API Inputs

Before invoking an API, the Worker validates the request.

### Input validation includes

* Required parameters
* Data types
* Identifier formats
* Allowed operation values
* Date ranges
* Numeric limits
* Pagination limits
* Maximum payload size
* Business rules
* Authorization scope

### Example

```json
{
  "product_id": "P-1001",
  "location": "Austin",
  "quantity": 10
}
```

The Worker should reject:

```json
{
  "product_id": "",
  "location": null,
  "quantity": -100
}
```

Validation should occur before the request reaches the downstream system.

## 8. Retrieve Information from APIs

For read operations, the Worker retrieves only the data required by the task.

### Example

```text
Task:
    Retrieve open opportunities for CUST-1001

Worker:
    1. Validate customer ID
    2. Check entitlement
    3. Select Salesforce adapter
    4. Call approved opportunity API
    5. Apply permitted filters
    6. Validate response
    7. Return structured opportunity list
```

### Retrieval controls

* Authorized endpoint
* Approved query parameters
* Pagination limits
* Field filtering
* Data classification checks
* Response-size limits
* Source-system permissions
* Audit metadata

The Worker should not retrieve all customer records and filter them locally unless that pattern is explicitly approved.

## 9. Execute Business Operations

Workers may also invoke APIs that perform business actions.

Examples include:

* Create a service ticket
* Update an approved CRM field
* Submit an order
* Trigger a notification
* Create a purchase request
* Update inventory status
* Start a downstream workflow

### Example

```text
Notification Worker
    ↓
Validate recipient and message
    ↓
Check notification permission
    ↓
Call approved notification API
    ↓
Receive delivery status
    ↓
Return structured result
```

### Write operations require additional controls

* Explicit operation authorization
* Input validation
* Idempotency
* Approval, when required
* Audit logging
* Transaction status
* Compensation or rollback strategy, where supported

A Worker should not execute a write operation merely because the LLM suggested it.

## 10. Use Idempotency for Business Operations

Some API operations can create duplicate effects if retried.

For example:

```text
Create purchase order
Send notification
Submit payment request
Create service ticket
```

The Worker should use an idempotency key or equivalent mechanism where supported.

```text
Task ID
    ↓
Idempotency key
    ↓
API request
    ↓
Safe retry without duplicate business action
```

### Example

```json
{
  "task_id": "task-501",
  "operation": "create_service_ticket",
  "idempotency_key": "corr-789-task-501"
}
```

This is especially important when a timeout occurs after the downstream system may already have completed the operation.

## 11. Validate API Responses

The Worker must validate the response before returning it to the Delegator.

### Technical validation

* HTTP status
* Response schema
* Required fields
* Data types
* Response completeness
* Error payloads

### Business validation

* Correct customer or entity
* Correct operation status
* Valid business values
* Expected transaction identifier
* Correct currency or date
* No unexpected state transition

### Example

```text
API response received
    ↓
Validate schema
    ↓
Check operation status
    ↓
Verify returned entity
    ↓
Check required fields
    ↓
Return structured result
```

A successful HTTP response does not always mean the business operation succeeded. The Worker must inspect the business response.

## 12. Handle API and Microservice Failures

Workers should classify failures and apply controlled recovery.

| Failure | Example | Worker response |
| --- | --- | --- |
| Authentication failure | Expired token | Refresh through approved mechanism |
| Authorization failure | Insufficient permission | Return access-denied result |
| Bad request | Invalid parameter | Reject or correct validated input |
| Not found | Customer does not exist | Return controlled business error |
| Rate limit | API quota exceeded | Backoff or return throttling status |
| Timeout | Service did not respond | Retry if safe |
| Server error | HTTP 500 | Retry according to policy |
| Dependency unavailable | Microservice offline | Return dependency failure |
| Invalid response | Malformed payload | Reject response |
| Duplicate operation risk | Unknown write status | Check idempotency or operation status |

### Retry rules

Retries should be:

* Limited
* Policy-controlled
* Backoff-based
* Safe for the operation
* Protected by idempotency
* Recorded in telemetry

The Worker should not retry indefinitely.

## 13. Integrate with Downstream Systems

A Worker may act as a controlled bridge between CWD and downstream enterprise systems.

### Example: Order Processing

```text
Order Delegator
    ↓
Order Worker
    ↓
Order API Adapter
    ↓
Order Management Microservice
    ↓
Inventory Service
    ↓
Shipping Service
```

The Worker may invoke one downstream operation, while the downstream service handles its own internal business workflow.

### Important boundary

```text
CWD Worker:
    Executes the assigned integration task

Downstream microservice:
    Owns its internal business process and data
```

The Worker should not duplicate the entire downstream application's business logic.

## 14. Preserve Traceability

Every API interaction should be traceable to the original user request.

### Correlation hierarchy

```text
User Request ID
    ↓
Workflow ID
    ↓
Delegator Execution ID
    ↓
Worker Task ID
    ↓
API Invocation ID
    ↓
Downstream Transaction ID
```

### Useful telemetry

* API name
* Operation name
* Worker ID
* Task ID
* Correlation ID
* Request timestamp
* Response timestamp
* Latency
* Status code
* Retry count
* Policy decision
* Downstream transaction ID
* Error code

Sensitive payloads should not be logged unless explicitly approved.

## 15. Structured API Result

The Worker should return a consistent result to the Delegator.

### Example: Successful retrieval

```json
{
  "task_id": "task-301",
  "worker_id": "opportunity-worker",
  "status": "completed",
  "result": {
    "customer_id": "CUST-1001",
    "opportunities": [
      {
        "opportunity_id": "OPP-101",
        "name": "Enterprise Expansion",
        "stage": "Negotiation",
        "amount": 250000
      }
    ]
  },
  "integration": {
    "system": "Salesforce",
    "operation": "retrieve_open_opportunities",
    "status": "success"
  },
  "authorization": {
    "status": "allowed"
  },
  "correlation_id": "corr-789"
}
```

### Example: Successful business operation

```json
{
  "task_id": "task-501",
  "worker_id": "notification-worker",
  "status": "completed",
  "result": {
    "notification_id": "NOTIF-1001",
    "delivery_status": "accepted"
  },
  "integration": {
    "system": "Notification Service",
    "operation": "send_notification",
    "status": "success"
  },
  "correlation_id": "corr-789"
}
```

The Delegator can use the result without parsing unpredictable natural-language output.

## 16. Example: Customer Opportunity Retrieval

### Assigned task

> Retrieve open opportunities for customer `CUST-1001`.

### Execution flow

```text
1. Worker receives structured task
        ↓
2. Validate customer_id
        ↓
3. Check user entitlement
        ↓
4. Select approved Salesforce adapter
        ↓
5. Acquire authorized access token
        ↓
6. Build validated API request
        ↓
7. Invoke Salesforce API
        ↓
8. Validate response schema
        ↓
9. Verify customer and opportunity scope
        ↓
10. Normalize opportunity records
        ↓
11. Preserve source references
        ↓
12. Return structured result
        ↓
13. Record telemetry and audit information
```

The Delegator may combine this result with revenue and customer-profile results to create a customer briefing.

## 17. Worker vs. Delegator Responsibilities

| Responsibility | Delegator | Worker |
| --- | --- | --- |
| Identify domain-level integration need | Yes | No |
| Decompose business workflow | Yes | No |
| Select appropriate Worker | Yes | No |
| Select approved API capability | Oversees | Yes |
| Validate API inputs | Oversees | Yes |
| Authenticate API call | Governs | Executes through adapter |
| Enforce task-level authorization | Oversees | Yes |
| Invoke enterprise API | No | Yes |
| Execute assigned business operation | Coordinates | Yes |
| Validate API response | Aggregates | Yes |
| Handle local API failures | Coordinates | Yes |
| Aggregate multiple API results | Yes | No |
| Decide cross-domain workflow | Yes | No |

## 18. What the Worker Must Not Do

The Worker must not:

* Call arbitrary APIs or URLs.
* Hardcode credentials or tokens.
* Bypass user entitlements.
* Use unrestricted database access instead of approved APIs.
* Execute unauthorized write operations.
* Send sensitive data unnecessarily.
* Ignore API input or output schemas.
* Retry unsafe operations without idempotency.
* Treat HTTP success as guaranteed business success.
* Expose secrets in logs or prompts.
* Duplicate the entire downstream microservice's business logic.
* Decide the complete enterprise workflow.

## Final Definition

> A Worker securely integrates with enterprise APIs and microservices by selecting an approved capability, authenticating through governed service identities, enforcing user and agent entitlements, validating inputs, invoking controlled API operations, validating responses, handling failures safely, preserving transaction traceability, and returning structured results to the Delegator.

### Core formula

```text
Secure API Integration
=
Authorized Capability
+ Secure Authentication
+ Entitlement Check
+ Input Validation
+ Approved Adapter
+ Controlled API Invocation
+ Business Operation
+ Response Validation
+ Error Handling
+ Idempotency
+ Traceability
+ Structured Result
```