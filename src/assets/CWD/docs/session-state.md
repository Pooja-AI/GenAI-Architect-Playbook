# Session-Level State in CWD

Session-level state represents the overall user interaction across the CWD platform. It connects the user, conversation, active workflows, delegated tasks, execution history, and relevant context so that independently deployed Coordinator, Delegator, and Worker services can continue the interaction consistently.

> Session state answers: “Who is interacting, what conversation are we having, what workflows belong to this interaction, and where can I find their current execution state?”

It is broader than a single message and more stable than a single Worker’s temporary working memory.

## 1. Where session-level state fits

```
User
 │
 ▼
Gateway
 │
 ├── Authenticate user
 ├── Establish tenant and session
 └── Create correlation context
 │
 ▼
Session-Level State
 │
 ├── Identity context
 ├── Conversation history
 ├── Session metadata
 ├── Active workflows
 ├── Task references
 ├── Execution references
 └── Session lifecycle
 │
 ▼
Coordinator
 │
 ├── Reads session context
 ├── Starts or resumes workflows
 ├── Associates tasks with session
 └── Updates session state
 │
 ├───────────────┬────────────────┐
 ▼               ▼                ▼
Delegator      Worker           Async execution
 │               │                │
 └───────────────┴────────────────┘
                 │
                 ▼
       Durable task/workflow state
       Execution history
       Agent results
```

The session is the interaction-level grouping mechanism. It does not replace workflow state, task state, or persistent memory.

## 2. Session state versus related concepts

|
Concept

|

Main question

|

Scope

|

Typical lifetime

|
| --- | --- | --- | --- |
|

Session state

|

What is the overall user interaction?

|

User interaction

|

Minutes to days, depending on policy

|
|

Conversation history

|

What has been said?

|

Conversation

|

Session or longer

|
|

Execution state

|

What should the workflow do next?

|

One workflow

|

Until workflow completion and retention

|
|

Task state

|

What is happening with this task?

|

One task

|

Until task completion and retention

|
|

Short-term memory

|

What information is useful right now?

|

Current interaction/workflow

|

Temporary

|
|

Persistent memory

|

What should be remembered for future interactions?

|

User/project/business context

|

Governed long-term

|
|

Execution history

|

What happened during execution?

|

Historical record

|

Audit/operational retention

|

### Important distinction

```
Session State
    └── References workflows

Workflow State
    └── References tasks

Task State
    └── References execution results

Execution History
    └── Records what happened
```

A session should usually contain references to detailed workflow and task records rather than embedding every execution result inside one large session document.

## 3. Main components of session-level state

### 3.1 Identity context

Identity context establishes who is interacting and under which security boundary.

It may include:

* User or application subject identifier.

* Tenant or organization identifier.

* Session owner.

* Authentication method or identity provider reference.

* User roles and claims needed by the application.

* Effective authorization context or entitlement reference.

* Agent/application identity initiating downstream actions.

* Correlation ID.

* Security classification of the session.

Example:

JSON

```
{
  "identityContext": {
    "userId": "user-789",
    "tenantId": "tenant-a",
    "sessionOwner": "user-789",
    "identityProvider": "enterprise-idp",
    "roles": ["operations-analyst"],
    "entitlementReference": "ENT-456",
    "authenticated": true
  }
}
```

### Security rule

Do not treat session identity as permanent authorization. Entitlements may change during a session.

```
Session identity
    ↓
Current authorization / entitlement check
    ↓
Allowed operation
```

Avoid storing unnecessary access tokens, passwords, secrets, or sensitive claims in session state.

### 3.2 Conversation history

Conversation history provides continuity across multiple messages.

It may contain:

* Recent user and assistant messages.

* Conversation summary.

* Active topic.

* Resolved references.

* Important entities.

* User corrections.

* Pending questions.

* References to previous answers or artifacts.

Example:

JSON

```
{
  "conversation": {
    "conversationId": "conversation-456",
    "activeTopic": "shipment investigation",
    "summary": "The user is investigating a delayed shipment.",
    "recentMessages": [
      {
        "role": "user",
        "content": "Investigate shipment SHIP123."
      },
      {
        "role": "assistant",
        "content": "The investigation has started."
      }
    ],
    "entities": {
      "shipmentId": "SHIP123"
    }
  }
}
```

For long conversations, store the full transcript in a suitable durable conversation store and retain only a bounded summary plus relevant references in the active session.

### 3.3 Session metadata

Session metadata describes the lifecycle and operational characteristics of the interaction.

Typical fields include:

|
Field

|

Purpose

|
| --- | --- |
|

`sessionId`

|

Unique session identifier

|
|

`conversationId`

|

Conversation grouping

|
|

`userId`

|

Session owner reference

|
|

`tenantId`

|

Tenant isolation

|
|

`correlationId`

|

End-to-end request tracking

|
|

`createdAt`

|

Session creation time

|
|

`lastActivityAt`

|

Last interaction time

|
|

`status`

|

Active, idle, completed, expired, cancelled

|
|

`channel`

|

Web, Teams, API, application

|
|

`activeTopic`

|

Current subject

|
|

`activeWorkflowIds`

|

Running workflow references

|
|

`taskReferences`

|

Associated task references

|
|

`executionReferences`

|

Historical execution references

|
|

`retentionPolicy`

|

Expiration and archival behavior

|
|

`stateVersion`

|

Concurrency control

|
|

`securityClassification`

|

Data handling requirements

|

### 3.4 Active workflows

A session may have one or more active workflows.

For example:

```
Session S-1001
    │
    ├── Workflow WF-1001: Shipment investigation
    │       ├── Task WT-1001: Tracking lookup
    │       ├── Task WT-1002: Carrier status
    │       └── Task WT-1003: Historical incidents
    │
    └── Workflow WF-1002: Rerouting recommendation
            ├── Task WT-1010: Route constraints
            └── Task WT-1011: Capacity analysis
```

The session document should store workflow references:

JSON

```
{
  "activeWorkflows": [
    {
      "workflowId": "WF-1001",
      "workflowType": "shipment-investigation",
      "status": "running",
      "startedAt": "2026-09-06T15:00:00Z"
    },
    {
      "workflowId": "WF-1002",
      "workflowType": "rerouting-recommendation",
      "status": "waiting_for_approval",
      "startedAt": "2026-09-06T15:05:00Z"
    }
  ]
}
```

The detailed state remains in the workflow store.

### 3.5 Task references

A session may have many tasks created by different Delegators and Workers.

Instead of embedding complete task documents, store references such as:

JSON

```
{
  "taskReferences": [
    {
      "taskId": "WT-1001",
      "workflowId": "WF-1001",
      "taskType": "tracking_lookup",
      "status": "completed"
    },
    {
      "taskId": "WT-1002",
      "workflowId": "WF-1001",
      "taskType": "carrier_status",
      "status": "working"
    }
  ]
}
```

This allows the Coordinator to answer:

* Which tasks belong to this session?

* Which tasks are still running?

* Which workflow created a task?

* Which result should be displayed to the user?

* Which tasks require cancellation or follow-up?

The authoritative task status should still be read from the task store when accuracy is important.

### 3.6 Execution references

Execution references connect the session to historical activity.

JSON

```
{
  "executionReferences": [
    {
      "workflowId": "WF-1001",
      "executionId": "EXEC-1001",
      "status": "completed",
      "completedAt": "2026-09-06T15:10:00Z"
    },
    {
      "workflowId": "WF-0998",
      "executionId": "EXEC-0998",
      "status": "failed",
      "completedAt": "2026-09-05T12:00:00Z"
    }
  ]
}
```

Execution references support:

* “What happened earlier?”

* “Show the previous investigation.”

* “Resume the pending workflow.”

* “Compare the current result with a previous execution.”

* “Retrieve the execution audit trail.”

## 4. Example complete session document

JSON

```
{
  "id": "session-S-1001",
  "documentType": "session",
  "tenantId": "tenant-a",
  "sessionId": "S-1001",
  "userId": "user-789",
  "conversationId": "conversation-456",
  "correlationId": "CORR-7890",

  "identityContext": {
    "authenticated": true,
    "identityProvider": "enterprise-idp",
    "roles": ["operations-analyst"],
    "entitlementReference": "ENT-456"
  },

  "conversation": {
    "activeTopic": "shipment investigation",
    "summary": "Investigating delayed shipment SHIP123.",
    "entities": {
      "shipmentId": "SHIP123"
    },
    "recentMessageReferences": [
      "message-001",
      "message-002"
    ]
  },

  "activeWorkflows": [
    {
      "workflowId": "WF-1001",
      "workflowType": "shipment-investigation",
      "status": "running"
    }
  ],

  "taskReferences": [
    {
      "taskId": "WT-1001",
      "workflowId": "WF-1001",
      "status": "completed"
    },
    {
      "taskId": "WT-1002",
      "workflowId": "WF-1001",
      "status": "working"
    }
  ],

  "executionReferences": [
    {
      "executionId": "EXEC-1001",
      "workflowId": "WF-1001",
      "status": "running"
    }
  ],

  "sessionMetadata": {
    "channel": "web",
    "status": "active",
    "createdAt": "2026-09-06T15:00:00Z",
    "lastActivityAt": "2026-09-06T15:04:00Z",
    "stateVersion": 4
  },

  "retention": {
    "expiresAt": "2026-09-07T15:00:00Z",
    "classification": "internal"
  }
}
```

This document is a session projection: it provides a convenient view of the interaction while detailed state remains in specialized stores.

## 5. Session lifecycle

```
NEW SESSION
    ↓
AUTHENTICATED
    ↓
ACTIVE
    ↓
WORKFLOW STARTED
    ↓
TASKS EXECUTING
    ↓
WAITING / IDLE / HUMAN APPROVAL
    ↓
WORKFLOW COMPLETED
    ↓
SESSION CONTINUES OR BECOMES IDLE
    ↓
EXPIRED / CLOSED / ARCHIVED
```

Possible session statuses:

```
created
active
idle
waiting_for_workflow
waiting_for_approval
completed
cancelled
expired
closed
```

A completed workflow does not necessarily mean the session is closed. The user may ask a follow-up question in the same conversation.

## 6. Session state across CWD components

### Gateway

The Gateway:

* Authenticates the incoming request.

* Establishes or resolves the session.

* Creates or propagates correlation IDs.

* Associates the request with a tenant and user.

* Passes trusted identity context to the Coordinator.

### Coordinator

The Coordinator:

* Loads session state.

* Determines the current interaction context.

* Starts, resumes, or updates workflows.

* Associates workflows with the session.

* Tracks active task and execution references.

* Controls enterprise-level context propagation.

### Delegator

The Delegator:

* Receives a scoped projection of session context.

* Uses relevant domain information.

* Creates domain tasks.

* Returns domain results.

* Does not need the entire conversation or session document.

### Worker

The Worker:

* Receives only task-relevant context.

* Uses the authorized business object and constraints.

* Returns validated results.

* Does not normally read the entire session directly.

### LangGraph

LangGraph:

* Carries session and workflow identifiers in state.

* Uses session context to resume the appropriate interaction.

* Persists workflow checkpoints through a durable store.

* Does not replace the session repository.

### Cosmos DB

Cosmos DB can persist:

* Session document.

* Workflow references.

* Task references.

* Execution references.

* Session lifecycle.

* Session version and retention metadata.

### Redis

Redis can cache:

* Active session context.

* Recent messages.

* Session lookup results.

* Short-lived session locks.

* Frequently accessed workflow references.

## 7. Context propagation

The complete session should not be copied to every downstream component.

Instead, CWD creates a context projection.

### Coordinator context

JSON

```
{
  "sessionId": "S-1001",
  "conversationId": "conversation-456",
  "userId": "user-789",
  "tenantId": "tenant-a",
  "correlationId": "CORR-7890",
  "activeTopic": "shipment investigation",
  "workflowId": "WF-1001",
  "businessObject": {
    "shipmentId": "SHIP123"
  }
}
```

### Delegator context

JSON

```
{
  "sessionId": "S-1001",
  "workflowId": "WF-1001",
  "correlationId": "CORR-7890",
  "domain": "logistics",
  "businessObject": {
    "shipmentId": "SHIP123"
  },
  "taskObjective": "Determine probable shipment delay cause"
}
```

### Worker context

JSON

```
{
  "sessionId": "S-1001",
  "workflowId": "WF-1001",
  "taskId": "WT-1001",
  "correlationId": "CORR-7890",
  "capability": "shipment_tracking",
  "input": {
    "shipmentId": "SHIP123"
  }
}
```

### Context propagation rule

> Propagate the minimum relevant, authorized, and validated context required for the next component to perform its responsibility.

This reduces token usage, data exposure, coupling, and accidental leakage.

## 8. Session-level state and correlation IDs

A session can contain multiple requests and workflows, while each request has its own correlation ID.

```
Session ID: S-1001
    │
    ├── Correlation ID: CORR-7890
    │      └── Workflow WF-1001
    │             ├── Task WT-1001
    │             └── Task WT-1002
    │
    └── Correlation ID: CORR-7891
           └── Workflow WF-1002
                  └── Task WT-1010
```

Use the identifiers distinctly:

|
Identifier

|

Meaning

|
| --- | --- |
|

`sessionId`

|

Overall user interaction

|
|

`conversationId`

|

Conversation or message thread

|
|

`correlationId`

|

One end-to-end business request

|
|

`workflowId`

|

One workflow execution

|
|

`taskId`

|

One delegated task

|
|

`executionId`

|

One execution attempt or run

|
|

`messageId`

|

One communication message

|
|

`parentTaskId`

|

Parent-child task relationship

|

This hierarchy allows CWD to trace both the overall session and individual executions.

## 9. Session state and Cosmos DB

A practical storage pattern is:

```
Cosmos DB
├── sessions
│   └── Session metadata + active references
│
├── workflows
│   └── Durable workflow state + checkpoints
│
├── tasks
│   └── Task lifecycle + assignments
│
├── agent-results
│   └── Validated Worker/Delegator results
│
└── execution-events
    └── Historical execution events
```

The session document may use a tenant partition key:

```
Partition key: /tenantId
```

This supports common tenant-scoped access patterns, but the final partition strategy should be based on expected tenant size, query patterns, and workload distribution.

### Atomicity consideration

Updating a session and creating a workflow may require coordination.

Possible approaches:

1. Create the workflow first, then update the session reference.

2. Use a transactional batch when all documents share a supported logical partition.

3. Use an outbox/eventual-consistency pattern across containers.

4. Reconcile incomplete references asynchronously.

Do not assume that updates across arbitrary containers are automatically atomic.

## 10. Session state and short-term memory

Session state and short-term memory overlap, but they are not identical.

```
Session State
    ├── Identity
    ├── Session metadata
    ├── Workflow references
    ├── Task references
    └── Conversation references

Short-Term Memory
    ├── Recent messages
    ├── Intermediate results
    ├── Tool outputs
    ├── Decisions
    └── Relevant temporary context
```

The session may point to short-term context stored in Redis or a conversation store.

For example:

JSON

```
{
  "sessionId": "S-1001",
  "workingContextReference": "redis:session:S-1001"
}
```

The reference itself is durable, while the working context may be temporary.

## 11. Session state and persistent memory

Persistent memory contains information intentionally retained for future interactions, such as:

* Approved user preferences.

* Validated project context.

* Historical decisions.

* Explicitly saved business information.

Session state contains information about the current interaction.

```
Session State
    → What is happening in this interaction?

Persistent Memory
    → What should be remembered for future interactions?
```

A session may reference persistent memory, but it should not automatically convert every session message or workflow result into long-term memory.

## 12. Failure and recovery

|
Failure

|

Session-level behavior

|
| --- | --- |
|

Gateway restart

|

Reload session metadata from durable storage

|
|

Coordinator restart

|

Resolve session and resume or reconnect to workflow

|
|

Delegator restart

|

Session remains intact; task state is recovered separately

|
|

Worker failure

|

Task status and result references remain associated with session

|
|

Async completion

|

Match result using workflow/task/correlation references

|
|

Human approval wait

|

Session status can show `waiting_for_approval`

|
|

Duplicate request

|

Use request or idempotency identifiers to avoid duplicate workflow creation

|
|

Session expiration

|

Apply retention policy and close or archive references

|

### Example recovery flow

```
User returns to session S-1001
        ↓
Coordinator loads session document
        ↓
Finds workflow WF-1001 = waiting_for_approval
        ↓
Loads workflow checkpoint
        ↓
Checks approval status
        ↓
Resumes LangGraph workflow
        ↓
Returns current progress to user
```

The session identifies the interaction; the workflow checkpoint determines how execution resumes.

## 13. Security and governance

Session state can contain sensitive information even when it is only metadata.

Required controls include:

* Authenticate the session owner.

* Enforce tenant isolation.

* Validate authorization on every sensitive read.

* Avoid storing raw access tokens or secrets.

* Minimize identity claims.

* Classify session data.

* Encrypt data in transit and at rest.

* Apply retention and expiration policies.

* Restrict access to conversation history and execution references.

* Redact sensitive content from logs.

* Audit session creation, access, updates, and closure.

* Prevent session context from being treated as tool authorization.

* Revalidate entitlements for high-risk actions.

### Critical principle

> A session establishes interaction continuity; it does not grant permission to access enterprise data or execute tools.

## 14. Example session repository

Python

Run

```
from datetime import datetime, timezone
from typing import Any


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


class SessionRepository:
    def __init__(self, cosmos_container):
        self.container = cosmos_container

    def create_session(
        self,
        session_id: str,
        user_id: str,
        tenant_id: str,
        conversation_id: str,
        correlation_id: str,
    ) -> dict[str, Any]:
        session = {
            "id": session_id,
            "documentType": "session",
            "tenantId": tenant_id,
            "sessionId": session_id,
            "userId": user_id,
            "conversationId": conversation_id,
            "correlationId": correlation_id,
            "identityContext": {
                "authenticated": True
            },
            "conversation": {
                "activeTopic": None,
                "summary": None,
                "recentMessageReferences": []
            },
            "activeWorkflows": [],
            "taskReferences": [],
            "executionReferences": [],
            "sessionMetadata": {
                "status": "active",
                "createdAt": utc_now(),
                "lastActivityAt": utc_now(),
                "stateVersion": 1
            }
        }

        return self.container.create_item(body=session)

    def add_workflow_reference(
        self,
        session: dict[str, Any],
        workflow_id: str,
        workflow_type: str,
    ) -> dict[str, Any]:
        session["activeWorkflows"].append({
            "workflowId": workflow_id,
            "workflowType": workflow_type,
            "status": "running"
        })

        session["sessionMetadata"]["lastActivityAt"] = utc_now()
        session["sessionMetadata"]["stateVersion"] += 1

        return self.container.replace_item(
            item=session["id"],
            body=session
        )

    def update_activity(
        self,
        session: dict[str, Any],
        active_topic: str | None = None,
    ) -> dict[str, Any]:
        if active_topic is not None:
            session["conversation"]["activeTopic"] = active_topic

        session["sessionMetadata"]["lastActivityAt"] = utc_now()
        session["sessionMetadata"]["stateVersion"] += 1

        return self.container.replace_item(
            item=session["id"],
            body=session
        )
```

For production use, add:

* Tenant-aware partition keys.

* ETag-based optimistic concurrency.

* Explicit Cosmos exceptions.

* Schema validation.

* Authorization checks.

* Idempotent reference updates.

* Session expiration.

* Audit events.

* Controlled message-history storage.

* Avoidance of unbounded arrays.

## 15. Recommended design principles

1. Keep session state lightweight. Store references to detailed records.

2. Separate session state from workflow state.

3. Use trusted identity context, not user-supplied claims.

4. Propagate scoped context, not the entire session.

5. Use correlation IDs across every downstream operation.

6. Keep active references synchronized with authoritative task/workflow records.

7. Use optimistic concurrency for concurrent session updates.

8. Apply TTL and retention policies according to data type.

9. Do not use session state as an authorization mechanism.

10. Do not automatically turn session content into persistent memory.

11. Protect conversation history and metadata as potentially sensitive data.

12. Use Redis for fast active context and Cosmos DB for durable session state.

## 16. Architect-level mental model

```
                    SESSION
                       │
       ┌───────────────┼────────────────┐
       ▼               ▼                ▼
   Identity        Conversation     Session Metadata
   Context          History              │
       │               │                 │
       └───────────────┼─────────────────┘
                       │
                       ▼
              Active Workflow References
                       │
                       ▼
                 Task References
                       │
                       ▼
              Execution References
                       │
                       ▼
             Durable CWD State Stores
```

### Core formula

Session-Level State=Identity Context+Conversation Context+Session Metadata+Active Workflow References+Task References+Execution References+Lifecycle+Correlation+Security\text{Session-Level State} = \text{Identity Context} + \text{Conversation Context} + \text{Session Metadata} + \text{Active Workflow References} + \text{Task References} + \text{Execution References} + \text{Lifecycle} + \text{Correlation} + \text{Security}Session-Level State=Identity Context+Conversation Context+Session Metadata+Active Workflow References+Task References+Execution References+Lifecycle+Correlation+Security

## Interview-ready answer

> In CWD, session-level state represents the overall user interaction across the platform. It contains trusted identity context, conversation metadata and history references, session lifecycle information, active workflow references, task references, and execution references. The Gateway establishes the session and identity, the Coordinator uses the session to start or resume workflows, Delegators and Workers receive only scoped context, and Cosmos DB provides durable session metadata that survives service restarts and distributed execution. Detailed workflow state, task state, and execution history are stored separately and linked through session, workflow, task, and correlation IDs. Redis may cache active session context, while LangGraph manages workflow transitions and checkpoints. Session state provides continuity, but authorization is still enforced independently through IAM and policy services.

## Final definition

Session-level state in CWD is the durable interaction-level representation that associates a user and tenant identity with a conversation, session metadata, active workflows, delegated tasks, and historical executions. It enables distributed CWD services to maintain continuity, resume interactions, correlate asynchronous work, and present consistent progress across independently deployed components. The session stores lightweight context and references, while detailed workflow, task, result, and execution state remain in their respective durable stores under separate authorization, lifecycle, and governance controls.
