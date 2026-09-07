# User Request Entry and Preparation in CWD

Request intake is the first controlled stage of the CWD platform. Its purpose is to transform an external user message into a validated, authenticated, correlated, and policy-aware request that the Coordinator can safely interpret and route.

> A user message is not yet an executable task. It must first be captured, validated, enriched with trusted context, and prepared for downstream orchestration.

```
User
  ↓
Presentation Channel
  ↓
API Gateway
  ↓
Authentication + Request Validation
  ↓
Request Normalization
  ↓
Identity + Correlation Context
  ↓
Session / Conversation Lookup
  ↓
Prepared Request Envelope
  ↓
Coordinator
```


## 1. Request Intake Responsibilities

The intake layer should answer five questions:

1. Who submitted the request?

2. What did they request?

3. Is the request structurally valid?

4. What trusted context should accompany it?

5. Is it safe to forward for downstream processing?

It should not perform the entire business workflow.

## 2. Stage 1 — User Submits a Request

A request may originate from:

* Web application

* Microsoft Teams

* Mobile application

* Enterprise portal

* API client

* Internal application

Example:

> “Why is shipment SHIP123 delayed?”

At this point, the request contains natural language, but the platform does not yet know:

```
Intent
Domain
Required agents
Required tools
User permissions
Execution plan
```

Those are determined later.

## 3. Stage 2 — Gateway Receives the Request

The API Gateway is the controlled entry point into CWD.

```
User / Application
        ↓
API Gateway
        ├── TLS / Network Controls
        ├── Authentication
        ├── Token Validation
        ├── Request Schema Validation
        ├── Rate Limiting
        ├── Request Size Limits
        ├── Correlation ID
        └── Routing
```

The Gateway should reject malformed or unauthenticated requests before they reach the Coordinator.

### Example inbound request

JSON

```
{
  "message": "Why is shipment SHIP123 delayed?",
  "session_id": "S-1001",
  "channel": "web"
}
```

The client should not be trusted to supply authorization claims such as:

JSON

```
{
  "role": "admin",
  "allowed_data": "all"
}
```

Those values must come from trusted identity and policy systems.

## 4. Stage 3 — Authentication

Authentication establishes who the caller is.

For an enterprise Azure environment, this may involve:

```
User
 ↓
Microsoft Entra ID
 ↓
Access Token
 ↓
API Gateway
 ↓
Token Validation
```

The Gateway validates:

* Token signature

* Issuer

* Audience

* Expiration

* Required claims

* Tenant context

* Authentication method

Conceptually:

Authenticated=ValidIdentity∧ValidToken∧ValidAudienceAuthenticated = ValidIdentity \land ValidToken \land ValidAudienceAuthenticated=ValidIdentity∧ValidToken∧ValidAudience

Authentication does not mean the user is authorized to access every enterprise resource.

## 5. Stage 4 — Request Validation

The Gateway validates the structure and basic safety of the request.

### Validation examples

|
Validation

|

Example

|
| --- | --- |
|

Required fields

|

`message` must exist

|
|

Data type

|

`session_id` must be a string

|
|

Length

|

Message must not exceed configured limit

|
|

Format

|

IDs must follow accepted patterns

|
|

Content

|

Reject malformed or prohibited payloads

|
|

Rate

|

Prevent excessive requests

|
|

Size

|

Prevent oversized context or attachments

|

Example schema:

JSON

```
{
  "type": "object",
  "required": ["message"],
  "properties": {
    "message": {
      "type": "string",
      "minLength": 1,
      "maxLength": 10000
    },
    "session_id": {
      "type": "string"
    },
    "channel": {
      "type": "string"
    }
  }
}
```

### Important distinction

```
Schema Validation
        ≠
Business Validation
        ≠
Authorization
```

The Gateway checks whether the request is well-formed. The Coordinator and downstream components determine whether the requested operation is valid and permitted.

## 6. Stage 5 — Request Normalization

Different channels may send different request formats.

For example:

```
Teams Message
Web Chat Message
API JSON Request
```

The Gateway or intake service converts them into a canonical CWD request format.

### Before normalization

JSON

```
{
  "text": "Why is shipment SHIP123 delayed?",
  "conversation": "abc"
}
```

### After normalization

JSON

```
{
  "request_id": "REQ-1001",
  "message": "Why is shipment SHIP123 delayed?",
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "channel": "web"
}
```

Normalization may include:

* Standard field names

* Message extraction

* Identifier normalization

* Timestamp normalization

* Language metadata

* Attachment references

* Channel metadata

The goal is that the Coordinator receives one consistent request contract, regardless of the originating channel.

## 7. Stage 6 — Establish Correlation and Request Identity

The intake layer creates or propagates identifiers.

```
Request
   │
   ├── request_id
   ├── correlation_id
   ├── session_id
   ├── conversation_id
   └── message_id
```

Example:

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "message_id": "MSG-2001"
}
```

### Why correlation matters

The same correlation ID should follow the request through:

```
Gateway
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker
  ↓
MCP / RAG / API
  ↓
Final Response
```

This enables:

* End-to-end tracing

* Troubleshooting

* Auditability

* Cost attribution

* Latency measurement

* Failure recovery

The correlation ID should be opaque and non-sensitive.

## 8. Stage 7 — Establish Session and Conversation Context

The intake layer identifies the active session and conversation.

```
Session
   ↓
Conversation
   ↓
Current Turn
   ↓
New Request
```

Example:

JSON

```
{
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "turn_id": "TURN-002",
  "previous_turns": [
    "TURN-001"
  ]
}
```

The system may retrieve relevant session context, such as:

* Active topic

* Current business object

* Relevant previous turn references

* Language preference

* Active workflow references

It should not automatically send the entire conversation or all stored memory to every downstream agent.

> Session context provides continuity; it does not grant authorization.

## 9. Stage 8 — Build the Trusted Identity Context

The request is enriched with identity information obtained from trusted sources.

```
Authenticated User
        ↓
Identity Context
        ↓
Coordinator
```

Example:

JSON

```
{
  "identity_context": {
    "user_id": "user-reference",
    "tenant_id": "tenant-a",
    "roles": ["employee"],
    "scopes": ["logistics"],
    "claims_reference": "claims-001"
  }
}
```

The actual identity and entitlement data should come from the identity and policy systems, not from arbitrary user input.

The intake layer may pass:

* User identity reference

* Tenant

* Authentication context

* Session ownership

* Correlation information

Detailed authorization decisions happen later.

## 10. Stage 9 — Attach Request Metadata

The platform may add metadata needed for downstream processing.

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "message_id": "MSG-2001",
  "user_message": "Why is shipment SHIP123 delayed?",
  "channel": "web",
  "language": "en",
  "received_at": "2026-09-07T16:00:00Z",
  "identity_context": {
    "user_id": "user-reference",
    "tenant_id": "tenant-a"
  },
  "metadata": {
    "request_version": "1.0",
    "source": "web"
  }
}
```

Metadata should be:

* Minimal

* Trusted

* Structured

* Non-sensitive where possible

* Useful for routing and observability

## 11. Stage 10 — Session and Request Persistence

Depending on the architecture, the intake layer may persist the request or create a turn record.

```
Gateway
   ↓
Request Accepted
   ↓
Conversation / Turn Store
   ↓
Coordinator
```

Possible storage responsibilities:

|
Store

|

Purpose

|
| --- | --- |
|

Redis

|

Active session context and short-lived working data

|
|

Cosmos DB

|

Durable request, conversation, and turn metadata

|
|

Service Bus

|

Asynchronous task delivery

|
|

Object Storage

|

Large attachments or artifacts

|

The intake layer should not store every large payload indefinitely.

Sensitive content should be:

* Classified

* Minimized

* Protected

* Retained according to policy

* Referenced rather than unnecessarily copied

## 12. Stage 11 — Prepare the Canonical Request Envelope

After validation and enrichment, the Gateway or intake service creates a canonical request envelope.

### Example

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "session_id": "S-1001",
  "conversation_id": "CONV-1001",
  "turn_id": "TURN-002",
  "message_id": "MSG-2001",

  "identity": {
    "user_id": "user-reference",
    "tenant_id": "tenant-a",
    "authentication_status": "authenticated",
    "claims_reference": "claims-001"
  },

  "request": {
    "message": "Why is shipment SHIP123 delayed?",
    "channel": "web",
    "language": "en"
  },

  "context": {
    "active_topic": null,
    "business_object": null,
    "relevant_turn_references": []
  },

  "constraints": {
    "priority": "normal",
    "deadline_ms": 30000
  },

  "metadata": {
    "request_version": "1.0",
    "received_at": "2026-09-07T16:00:00Z"
  }
}
```

This envelope becomes the input contract for the Coordinator.

## 13. Stage 12 — Forward to the Coordinator

The Gateway forwards the prepared request.

```
Prepared Request Envelope
        ↓
Coordinator
```

The Coordinator now performs higher-level processing:

```
Intent Classification
        ↓
Domain Identification
        ↓
Query-Type Analysis
        ↓
Authorization
        ↓
Planning
        ↓
Agent Discovery
        ↓
Delegation
```

The intake layer should not independently decide which Worker or MCP tool to execute.

# 14. What Happens Inside the Coordinator After Intake?

The Coordinator receives the validated request and begins enterprise orchestration.

```
Gateway
   ↓
Coordinator
   ├── Understand Intent
   ├── Identify Domain
   ├── Determine Query Type
   ├── Evaluate Authorization
   ├── Build Plan
   ├── Discover Agents
   └── Delegate
```

For the shipment example:

JSON

```
{
  "intent": "root_cause_analysis",
  "domain": "logistics",
  "query_type": "analytical",
  "business_object": {
    "type": "shipment",
    "id": "SHIP123"
  },
  "required_capabilities": [
    "shipment_tracking",
    "delay_analysis"
  ]
}
```

This is downstream interpretation, not intake validation.

# 15. Request Intake vs Coordinator Responsibilities

|
Responsibility

|

Gateway / Intake

|

Coordinator

|
| --- | --- | --- |
|

Receive external request

|

✓

|  |
|

Authenticate caller

|

✓

|  |
|

Validate request schema

|

✓

|  |
|

Rate limiting

|

✓

|  |
|

Create correlation ID

|

✓

|  |
|

Normalize channel format

|

✓

|  |
|

Establish session context

|

✓

|  |
|

Basic input validation

|

✓

|  |
|

Interpret business intent

|  |

✓

|
|

Identify domain

|  |

✓

|
|

Create enterprise plan

|  |

✓

|
|

Discover agents

|  |

✓

|
|

Select Delegator

|  |

✓

|
|

Coordinate workflow

|  |

✓

|
|

Aggregate domain results

|  |

✓

|
|

Generate final response

|  |

✓

|

# 16. Request Intake Failure Scenarios

```
Request
   ↓
Gateway Validation
   │
   ├── Invalid Token → Reject
   ├── Invalid Schema → Reject
   ├── Rate Limit Exceeded → Throttle / Reject
   ├── Oversized Request → Reject
   ├── Invalid Session → Reject / Re-authenticate
   └── Valid → Forward
```

### Example error response

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "status": "rejected",
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request message is required."
  }
}
```

The Gateway should not expose internal implementation details or sensitive policy information in error messages.

# 17. Request Intake Security Principles

### 1. Never trust client-supplied authorization

```
Client Claims ≠ Trusted Authorization
```

### 2. Authenticate before downstream access

```
No Valid Identity → No Protected Processing
```

### 3. Validate before forwarding

```
Malformed Request → Reject Early
```

### 4. Minimize context

```
Only Required Context → Downstream Agents
```

### 5. Preserve tenant isolation

```
Tenant A Request ≠ Tenant B Context
```

### 6. Protect sensitive data

```
No Unnecessary Secrets / PII / Restricted Data
```

### 7. Establish traceability

```
Every Request → Correlation ID
```

### 8. Apply rate and resource controls

```
Unbounded Requests → Platform Overload
```

# 18. Request Intake and LangGraph

LangGraph generally begins after the request has entered the Coordinator, although the Coordinator can initialize its workflow state from the intake envelope.

```
Gateway
   ↓
Validated Request
   ↓
Coordinator
   ↓
LangGraph START
   ↓
Intent
   ↓
Authorization
   ↓
Planning
```

LangGraph may store:

Python

Run

```
state = {
    "request_id": "REQ-1001",
    "correlation_id": "CORR-7890",
    "session_id": "S-1001",
    "conversation_id": "CONV-1001",
    "user_message": "Why is shipment SHIP123 delayed?",
    "identity_context": {},
    "intent": None,
    "domain": None,
    "plan": None,
    "tasks": [],
    "results": [],
    "status": "received"
}
```

The Gateway is responsible for request acceptance. LangGraph is responsible for workflow execution.

# 19. Request Intake and Asynchronous Processing

For long-running requests, the Gateway may accept the request and submit it for asynchronous processing.

```
User
 ↓
Gateway
 ↓
Validate + Authenticate
 ↓
Create Request / Correlation ID
 ↓
Service Bus
 ↓
Coordinator
```

The Gateway can return:

JSON

```
{
  "request_id": "REQ-1001",
  "correlation_id": "CORR-7890",
  "status": "accepted",
  "workflow_id": "WF-1001"
}
```

The request is accepted, but execution may still be in progress.

Possible lifecycle:

```
RECEIVED
   ↓
VALIDATED
   ↓
ACCEPTED
   ↓
QUEUED
   ↓
PROCESSING
   ↓
COMPLETED / FAILED
```

Accepted does not mean completed.

# 20. Complete Request Entry Example

```
User:
"Why is shipment SHIP123 delayed?"
        │
        ▼
Web / Teams / API
        │
        ▼
API Gateway
        │
        ├── Validate Token
        ├── Validate Schema
        ├── Apply Rate Limits
        ├── Create Correlation ID
        └── Normalize Request
        │
        ▼
Session / Conversation Context
        │
        ▼
Canonical Request Envelope
        │
        ▼
Coordinator
        │
        ├── Intent: root_cause_analysis
        ├── Domain: logistics
        ├── Query Type: analytical
        └── Required Capabilities
        │
        ▼
Authorization + Planning
        │
        ▼
Delegator
```

# 21. Core Request Intake Formula

RequestPreparation=Capture+Authentication+SchemaValidation+Normalization+IdentityContext+Correlation+SessionContext+Metadata+PolicyPreChecks+SecureForwarding\boxed{ RequestPreparation = Capture + Authentication + SchemaValidation + Normalization + IdentityContext + Correlation + SessionContext + Metadata + PolicyPreChecks + SecureForwarding }RequestPreparation=Capture+Authentication+SchemaValidation+Normalization+IdentityContext+Correlation+SessionContext+Metadata+PolicyPreChecks+SecureForwarding

A more complete form:

PreparedRequest=ValidInput+TrustedIdentity+SessionContext+Correlation+RequestMetadata+SecurityContext+ExecutionConstraints\boxed{ PreparedRequest = ValidInput + TrustedIdentity + SessionContext + Correlation + RequestMetadata + SecurityContext + ExecutionConstraints }PreparedRequest=ValidInput+TrustedIdentity+SessionContext+Correlation+RequestMetadata+SecurityContext+ExecutionConstraints

# 22. Interview-Ready Answer

> “In CWD, a user request first enters through the API Gateway, which acts as the controlled ingress point. The Gateway authenticates the caller, validates the access token, checks the request schema and size, applies rate limits, and establishes a correlation ID. It then normalizes the channel-specific payload into a canonical request envelope containing the request, session, conversation, identity reference, metadata, and execution constraints. Relevant session context may be retrieved, but the system does not treat memory or client-supplied claims as authorization. The prepared request is persisted or queued when required and forwarded to the Coordinator. The Coordinator then interprets the intent, identifies the domain and query type, evaluates authorization and risk, creates an execution plan, discovers eligible agents, and delegates the work. The Gateway is responsible for secure request acceptance and preparation; the Coordinator is responsible for enterprise-level orchestration.”

## Final Mental Model

```
                 USER REQUEST
                      │
                      ▼
                API GATEWAY
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
 Authentication   Validation     Rate Limits
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              NORMALIZATION
                      │
                      ▼
          IDENTITY + CORRELATION
                      │
                      ▼
          SESSION / CONTEXT LOOKUP
                      │
                      ▼
          CANONICAL REQUEST ENVELOPE
                      │
                      ▼
                 COORDINATOR
                      │
          Intent + Authorization
          Planning + Discovery
                      │
                      ▼
                  DELEGATOR
```

In one sentence: Request intake in CWD is the governed process of capturing an external user request, authenticating and validating it, normalizing its format, attaching trusted identity and correlation context, retrieving only appropriate session information, applying ingress controls, and forwarding a canonical request envelope to the Coordinator for enterprise orchestration.
