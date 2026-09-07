# Conversation-Turn State in CWD

Conversation-turn state represents one user request and the corresponding agent processing and response within a conversation. It captures the messages, relevant context, decisions, tool interactions, intermediate outputs, and final result associated with that single turn.

> Conversation-turn state answers: “What did the user ask, what context did the agents use, what actions did they take, and what response did they produce for this turn?”

It is the bridge between conversation continuity and distributed agent execution.

```
Session
   └── Conversation
         ├── Turn 1
         ├── Turn 2
         └── Turn 3
                │
                ├── User message
                ├── Context
                ├── Agent decisions
                ├── Tool interactions
                ├── Task/workflow references
                └── Final response
```

## 1. Where conversation-turn state fits

```
Session
   │
   ▼
Conversation
   │
   ▼
Conversation Turn
   │
   ├── User Request
   ├── Context Selection
   ├── Intent / Domain
   ├── Agent Decisions
   ├── Tool Calls
   ├── Task / Workflow References
   ├── Intermediate Results
   └── Agent Response
```

A turn is not the same as a task or a run.

|
State

|

Represents

|

Example

|
| --- | --- | --- |
|

Session state

|

Overall user interaction

|

User investigating shipment delays

|
|

Conversation-turn state

|

One request and response

|

“Why was shipment SHIP123 delayed?”

|
|

Workflow state

|

Overall execution process

|

Investigate → analyze → recommend

|
|

Task state

|

One objective

|

Retrieve carrier status

|
|

Run state

|

One execution attempt

|

Attempt 2 of carrier lookup

|
|

Short-term memory

|

Relevant working context

|

Recent messages and temporary results

|
|

Persistent memory

|

Retained information for future use

|

Approved project preference

|

### Example

```
Session S-1001
   │
   ├── Turn T-001
   │     User: "Track shipment SHIP123"
   │     Response: "Shipment is delayed."
   │
   └── Turn T-002
         User: "Why is it delayed?"
         Response: "Carrier capacity constraint."
```

Each turn has its own request, context, decisions, tool activity, and response.

## 2. Core components of a conversation turn

### 2.1 Turn identity

A turn requires a unique identifier and references to its surrounding conversation and execution.

JSON

```
{
  "turnId": "TURN-002",
  "sessionId": "S-1001",
  "conversationId": "CONV-1001",
  "correlationId": "CORR-7890",
  "workflowId": "WF-1001",
  "parentTurnId": "TURN-001"
}
```

|
Identifier

|

Purpose

|
| --- | --- |
|

`turnId`

|

Unique identity of the conversational turn

|
|

`sessionId`

|

User interaction containing the turn

|
|

`conversationId`

|

Conversation containing the turn

|
|

`correlationId`

|

End-to-end request tracking

|
|

`workflowId`

|

Workflow started by the turn

|
|

`parentTurnId`

|

Previous turn that established context

|
|

`messageId`

|

Individual message identity

|

A single turn may create one or more workflows and tasks.

### 2.2 User message

The user message is the original request that initiated the turn.

JSON

```
{
  "userMessage": {
    "messageId": "MSG-2001",
    "role": "user",
    "content": "Why is shipment SHIP123 delayed?",
    "timestamp": "2026-09-06T15:00:00Z",
    "language": "en"
  }
}
```

The message may also contain:

* Attachments.

* Structured input.

* References to previous turns.

* Business identifiers.

* User-selected options.

* Explicit constraints.

* Requested output format.

The original request should be preserved separately from any rewritten or normalized query.

### 2.3 Context used during the turn

The agent may need more than the current message.

JSON

```
{
  "context": {
    "activeTopic": "shipment investigation",
    "conversationSummary": "User is investigating shipment SHIP123.",
    "relevantPreviousTurns": [
      "TURN-001"
    ],
    "businessObject": {
      "type": "shipment",
      "id": "SHIP123"
    },
    "taskContext": {
      "domain": "logistics",
      "priority": "high"
    }
  }
}
```

Context can include:

* Recent conversation messages.

* Relevant previous-turn references.

* Session metadata.

* Active business object.

* User-provided constraints.

* Approved persistent memory.

* Current workflow state.

* Authorized RAG evidence.

* Previous tool results.

### Important rule

> The entire session should not automatically be passed to every agent.

The Coordinator should select relevant context, and each Delegator or Worker should receive only the context required for its task.

### 2.4 Intent and domain interpretation

The turn should record the interpreted purpose of the request.

JSON

```
{
  "interpretation": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "queryType": "analytical",
    "entities": {
      "shipmentId": "SHIP123"
    },
    "confidence": 0.94
  }
}
```

This helps CWD determine:

* Which Delegator should receive the request.

* Which capabilities are required.

* Whether RAG or live tools are needed.

* Which policies apply.

* What type of response should be generated.

The original user message remains authoritative as the user’s request; the interpretation is an agent-generated working representation.

## 3. Agent decisions during the turn

A turn may involve several decisions.

```
User Request
    ↓
Intent Classification
    ↓
Domain Selection
    ↓
Risk Assessment
    ↓
Delegator Selection
    ↓
Task Planning
    ↓
Tool / RAG Selection
    ↓
Response Strategy
```

Example:

JSON

```
{
  "decisions": [
    {
      "decisionId": "DEC-001",
      "agentId": "coordinator",
      "type": "intent_classification",
      "decision": "root_cause_analysis",
      "reason": "User asks why the shipment is delayed.",
      "timestamp": "2026-09-06T15:00:01Z"
    },
    {
      "decisionId": "DEC-002",
      "agentId": "coordinator",
      "type": "delegation",
      "decision": "shipping-delegator",
      "reason": "Logistics domain capability match.",
      "timestamp": "2026-09-06T15:00:02Z"
    }
  ]
}
```

Decisions are useful for:

* Debugging.

* Explaining execution behavior.

* Evaluating agent quality.

* Reproducing a response.

* Auditing routing and policy decisions.

However, a decision record is not automatically a permanent business decision. It may be temporary reasoning used for the current turn.

## 4. Tool interactions

Tool interactions record which external capabilities were invoked during the turn.

```
Turn
  │
  ├── MCP Tool: get_tracking_events
  ├── MCP Tool: get_carrier_status
  └── RAG Search: logistics knowledge
```

Example:

JSON

```
{
  "toolInteractions": [
    {
      "toolCallId": "TOOL-001",
      "agentId": "tracking-worker",
      "toolName": "get_tracking_events",
      "protocol": "MCP",
      "status": "completed",
      "inputReference": "input-001",
      "outputReference": "output-001",
      "durationMs": 420
    },
    {
      "toolCallId": "TOOL-002",
      "agentId": "tracking-worker",
      "toolName": "get_carrier_status",
      "protocol": "MCP",
      "status": "completed",
      "inputReference": "input-002",
      "outputReference": "output-002",
      "durationMs": 310
    }
  ]
}
```

The turn record should generally store references and summaries, not unrestricted raw tool payloads.

### Why?

* Tool outputs may contain sensitive data.

* Large payloads increase storage cost.

* Raw outputs may be unnecessary after validation.

* References support traceability without exposing all data.

* Tool calls may need separate audit and telemetry records.

## 5. Intermediate results

A turn may produce results before the final response is generated.

```
User Request
    ↓
Intent Result
    ↓
Delegator Result
    ↓
Worker Result
    ↓
RAG Evidence
    ↓
Response Draft
    ↓
Final Response
```

Example:

JSON

```
{
  "intermediateResults": [
    {
      "step": "intent_classification",
      "status": "completed",
      "reference": "result-intent-001"
    },
    {
      "step": "shipment_lookup",
      "status": "completed",
      "reference": "result-shipment-001"
    },
    {
      "step": "delay_analysis",
      "status": "completed",
      "reference": "result-analysis-001"
    }
  ]
}
```

Intermediate results can be:

* Structured Worker outputs.

* Retrieved document references.

* Tool results.

* Validation results.

* Partial responses.

* Approval information.

* Error recovery results.

They should be validated before becoming part of the final response context.

## 6. Task and workflow references

A conversation turn may initiate several tasks.

```
Turn T-002
   │
   └── Workflow WF-1001
         │
         ├── Task WT-1001: Retrieve tracking events
         ├── Task WT-1002: Retrieve carrier status
         └── Task WT-1003: Analyze delay
```

The turn can reference these executions:

JSON

```
{
  "executionReferences": {
    "workflowId": "WF-1001",
    "taskIds": [
      "WT-1001",
      "WT-1002",
      "WT-1003"
    ],
    "runIds": [
      "RUN-001",
      "RUN-002",
      "RUN-003"
    ]
  }
}
```

This allows the conversation layer to answer:

* Which workflow was started by this request?

* Which tasks were executed?

* Which task failed?

* Which run produced the result?

* Is the response complete or partial?

* Can the user ask a follow-up question about the same execution?

## 7. Agent response

The final response is the output presented to the user.

JSON

```
{
  "agentResponse": {
    "messageId": "MSG-2002",
    "role": "assistant",
    "content": "The shipment is delayed because of a carrier capacity constraint.",
    "responseType": "final",
    "timestamp": "2026-09-06T15:03:00Z"
  }
}
```

The response may include:

* Text.

* Structured JSON.

* Tables.

* Citations.

* Attachments.

* Action recommendations.

* Clarifying questions.

* Approval requests.

* Partial-result indicators.

* Error explanations.

### Response status

|
Status

|

Meaning

|
| --- | --- |
|

`draft`

|

Response is being prepared

|
|

`partial`

|

Some results are available

|
|

`awaiting_input`

|

User clarification required

|
|

`awaiting_approval`

|

Approval required

|
|

`completed`

|

Final response generated

|
|

`failed`

|

Response could not be generated

|
|

`cancelled`

|

Turn was cancelled

|

# 8. Conversation-turn lifecycle

```
USER MESSAGE
     ↓
Turn Created
     ↓
Load Session Context
     ↓
Resolve Identity and Entitlements
     ↓
Interpret Intent and Domain
     ↓
Plan / Route
     ↓
Create Workflow and Tasks
     ↓
Execute Agents and Tools
     ↓
Collect Intermediate Results
     ↓
Validate Results
     ↓
Generate Response
     ↓
Store Turn Completion
     ↓
Return Response to User
```

### Failure path

```
Tool / Worker Failure
        ↓
Update Turn State
        ↓
Retry / Recovery / Clarification
        ↓
Continue Turn
        ↓
Final Response
```

A turn may remain open while the workflow is waiting for an asynchronous task or human approval.

# 9. Conversation turn and CWD components

|
CWD component

|

Responsibility for turn state

|
| --- | --- |
|

Gateway

|

Receives message, authenticates user, creates request context

|
|

Coordinator

|

Creates turn, interprets intent, manages enterprise-level context

|
|

Delegator

|

Executes domain tasks associated with the turn

|
|

Worker

|

Produces specialized results and tool outputs

|
|

LangGraph

|

Orchestrates turn-related workflow transitions

|
|

Service Bus

|

Transports asynchronous task and result messages

|
|

Session store

|

Maintains active session information

|
|

Cosmos DB

|

Persists durable turn metadata and references

|
|

RAG layer

|

Supplies authorized evidence

|
|

Prompt Registry

|

Resolves the approved prompt version

|
|

Policy/IAM

|

Controls identity, access, and risk

|
|

Observability

|

Captures detailed runtime telemetry

|
|

Audit system

|

Records governed actions and decisions

|

# 10. Conversation-turn state and memory

Conversation-turn state is closely related to short-term memory, but they are not identical.

|
Conversation-turn state

|

Short-term memory

|
| --- | --- |
|

Records the complete structure of one turn

|

Stores selected information useful during execution

|
|

Includes request and response

|

Includes relevant messages and temporary context

|
|

Includes decisions and tool references

|

Includes working information

|
|

Includes execution references

|

May include intermediate results

|
|

Usually retained as conversation history

|

Usually bounded and temporary

|

### Example

```
Turn State
    ├── User message
    ├── Agent response
    ├── Tool references
    ├── Workflow ID
    └── Decisions

Short-Term Memory
    ├── Active shipment ID
    ├── Latest tracking status
    └── Relevant current context
```

A turn can become part of future conversational memory, but that should be a governed decision rather than an automatic assumption.

# 11. Conversation-turn state and persistent memory

After a turn completes, selected information may be proposed for persistent storage.

```
Completed Turn
     ↓
Memory Candidate Extraction
     ↓
Validation
     ↓
Classification
     ↓
Policy / Approval
     ↓
Persistent Memory
```

Example:

```
Turn:
"Use the logistics summary format for future reports."

Potential persistent memory:
"Preferred report format = logistics summary."
```

But the system should not automatically persist:

* Every user message.

* Temporary tool outputs.

* Unverified assumptions.

* Sensitive information without a valid purpose.

* Instructions embedded in retrieved documents.

* Short-lived execution details.

# 12. Conversation-turn state and LangGraph

LangGraph can maintain the active turn context while coordinating the underlying workflow.

```
Turn State
    ↓
LangGraph State
    ├── Current message
    ├── Intent
    ├── Domain
    ├── Workflow ID
    ├── Task references
    ├── Tool results
    ├── Current node
    ├── Pending approval
    └── Response status
```

Example:

Python

Run

```
turn_state = {
    "turn_id": "TURN-002",
    "session_id": "S-1001",
    "correlation_id": "CORR-7890",
    "user_message": "Why is shipment SHIP123 delayed?",
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "workflow_id": "WF-1001",
    "task_ids": ["WT-1001", "WT-1002"],
    "intermediate_result_refs": [
        "result-shipment-001"
    ],
    "response_status": "generating",
    "next_node": "validate_response"
}
```

### Separation

```
Conversation-turn state
    → What happened in this interaction?

LangGraph
    → What should happen next?

Task state
    → What objective is being executed?

Run state
    → What happened during this attempt?
```

# 13. Conversation-turn state and asynchronous execution

A turn may not complete immediately.

```
User asks question
       ↓
Turn created
       ↓
Workflow submitted
       ↓
Response:
"Your request is being processed."
       ↓
Worker completes later
       ↓
Turn updated
       ↓
Final response delivered
```

Possible turn states:

```
received
   ↓
processing
   ↓
waiting_for_task
   ↓
waiting_for_approval
   ↓
generating_response
   ↓
completed
```

The turn should preserve:

* Original user request.

* Correlation ID.

* Workflow and task references.

* Current response status.

* Pending reason.

* Final result reference.

This allows the system to resume the correct conversational context when asynchronous execution completes.

# 14. Conversation-turn state and security

Turn state may contain the most sensitive combination of data because it joins:

```
User identity
    +
Conversation content
    +
Enterprise evidence
    +
Tool outputs
    +
Agent decisions
    +
Final response
```

Required controls:

* Authenticate the user.

* Validate tenant and session ownership.

* Apply conversation-level access controls.

* Restrict turn visibility to authorized users and agents.

* Classify messages and results.

* Redact sensitive data from logs.

* Protect attachments and tool outputs.

* Avoid storing secrets in messages.

* Preserve provenance for retrieved evidence.

* Apply retention and deletion policies.

* Audit access to sensitive turns.

### Critical rule

> Conversation history is not automatically authorized context.

A previous message may contain information that is no longer relevant, no longer valid, or not appropriate for a particular Worker.

# 15. Example complete turn document

JSON

```
{
  "id": "TURN-002",
  "documentType": "conversationTurn",

  "tenantId": "tenant-a",

  "identity": {
    "turnId": "TURN-002",
    "sessionId": "S-1001",
    "conversationId": "CONV-1001",
    "parentTurnId": "TURN-001",
    "correlationId": "CORR-7890",
    "workflowId": "WF-1001"
  },

  "userMessage": {
    "messageId": "MSG-2001",
    "role": "user",
    "content": "Why is shipment SHIP123 delayed?",
    "timestamp": "2026-09-06T15:00:00Z"
  },

  "context": {
    "activeTopic": "shipment investigation",
    "relevantPreviousTurns": [
      "TURN-001"
    ],
    "businessObject": {
      "type": "shipment",
      "id": "SHIP123"
    }
  },

  "interpretation": {
    "intent": "root_cause_analysis",
    "domain": "logistics",
    "queryType": "analytical"
  },

  "decisions": [
    {
      "decisionId": "DEC-001",
      "agentId": "coordinator",
      "type": "delegation",
      "decision": "shipping-delegator"
    }
  ],

  "executionReferences": {
    "taskIds": [
      "WT-1001",
      "WT-1002"
    ],
    "runIds": [
      "RUN-001",
      "RUN-002"
    ]
  },

  "toolInteractions": [
    {
      "toolCallId": "TOOL-001",
      "toolName": "get_tracking_events",
      "status": "completed",
      "outputReference": "output-001"
    }
  ],

  "intermediateResults": [
    {
      "step": "delay_analysis",
      "reference": "result-analysis-001"
    }
  ],

  "response": {
    "status": "completed",
    "messageId": "MSG-2002",
    "content": "The shipment is delayed because of a carrier capacity constraint.",
    "resultReference": "result-TURN-002"
  },

  "metadata": {
    "createdAt": "2026-09-06T15:00:00Z",
    "completedAt": "2026-09-06T15:03:00Z",
    "promptId": "shipment-delay-analysis",
    "promptVersion": "2.2.0",
    "modelVersion": "approved-model-v4"
  }
}
```

# 16. Cosmos DB representation

For distributed CWD services, Cosmos DB can store the durable turn snapshot.

```
Cosmos DB
│
├── sessions
│     └── Session metadata and references
│
├── conversations
│     └── Conversation metadata
│
├── conversation-turns
│     └── Individual turn documents
│
├── workflows
│     └── Workflow state
│
├── tasks
│     └── Task state
│
├── runs
│     └── Run-level state
│
└── execution-events
      └── Detailed chronological events
```

A turn document should usually contain:

* Identity and correlation fields.

* Original user message.

* Selected context references.

* Interpretation.

* Workflow/task/run references.

* Tool interaction summaries.

* Intermediate result references.

* Final response.

* Status and timestamps.

* Retention/classification metadata.

Large message bodies, attachments, or tool outputs may be stored separately and referenced from the turn.

# 17. Conversation turn versus execution history

These are related but different.

### Turn state

JSON

```
{
  "turnId": "TURN-002",
  "status": "completed",
  "responseReference": "result-TURN-002"
}
```

### Execution history

```
TURN_CREATED
INTENT_CLASSIFIED
DELEGATOR_SELECTED
TASK_CREATED
WORKER_ASSIGNED
TOOL_INVOKED
TOOL_COMPLETED
RESULT_VALIDATED
RESPONSE_GENERATED
TURN_COMPLETED
```

The distinction is:

```
Conversation-turn state
    = Snapshot of the conversational interaction

Execution history
    = Timeline of events that occurred during the interaction
```

# 18. Common anti-patterns

### 1. Treating a turn as the entire session

A session contains multiple turns. Each turn needs its own identity.

### 2. Storing only the final response

This loses the original request, decisions, tool references, and execution trace.

### 3. Passing the entire conversation to every Worker

This increases cost, latency, and data exposure.

### 4. Treating conversation history as authoritative enterprise knowledge

Historical messages may be outdated or incorrect. Current governed enterprise evidence should be retrieved when required.

### 5. Storing raw tool outputs without controls

Tool outputs may contain sensitive or excessive data.

### 6. Losing workflow and task references

Without references, the system cannot explain which execution produced the response.

### 7. Creating a new correlation ID at every hop

This breaks end-to-end tracing.

### 8. Treating a partial response as final

The turn must explicitly indicate whether execution is complete, waiting, or partial.

### 9. Automatically converting every turn into persistent memory

Only validated, useful, authorized information should be retained.

### 10. Mixing current-turn state with long-term memory

This creates stale context and uncontrolled retention.

# 19. Architect-level state hierarchy

```
SESSION
│
├── Identity
├── Session metadata
├── Conversation references
│
└── CONVERSATION
    │
    ├── TURN-001
    │     ├── User message
    │     ├── Context
    │     ├── Decisions
    │     ├── Tool interactions
    │     └── Agent response
    │
    └── TURN-002
          ├── User message
          ├── Context
          ├── Decisions
          ├── Workflow references
          ├── Task/run references
          ├── Intermediate results
          └── Agent response
```

### Relationship to execution

```
Turn
  └── Workflow
        └── Task
              └── Run
                    └── Tool calls
```

This is the core relationship:

> One conversation turn may initiate one workflow, multiple tasks, and multiple execution runs.

# 20. Final formula

Conversation-Turn State=Turn Identity+User Message+Selected Context+Intent and Domain+Agent Decisions+Workflow/Task References+Tool Interactions+Intermediate Results+Agent Response+Status+Timestamps+Correlation\boxed{ \text{Conversation-Turn State} = \text{Turn Identity} + \text{User Message} + \text{Selected Context} + \text{Intent and Domain} + \text{Agent Decisions} + \text{Workflow/Task References} + \text{Tool Interactions} + \text{Intermediate Results} + \text{Agent Response} + \text{Status} + \text{Timestamps} + \text{Correlation} }Conversation-Turn State=Turn Identity+User Message+Selected Context+Intent and Domain+Agent Decisions+Workflow/Task References+Tool Interactions+Intermediate Results+Agent Response+Status+Timestamps+Correlation

## Interview-ready answer

> In CWD, conversation-turn state represents one user request and the corresponding agent response within a conversation. It includes the original user message, selected session and conversational context, interpreted intent and domain, agent decisions, workflow/task/run references, tool interactions, intermediate results, response status, and final response. The Gateway establishes identity and correlation, the Coordinator manages turn-level orchestration, Delegators and Workers execute the associated tasks, LangGraph manages workflow transitions, and Cosmos DB can persist the durable turn snapshot. Tool outputs and large artifacts are stored through controlled references, while execution history provides the detailed event timeline. A turn may remain open while tasks are running or approval is pending. Once completed, selected information may be proposed for persistent memory, but conversation-turn state itself is not automatically long-term memory or authoritative enterprise knowledge.

## Final definition

Conversation-turn state in CWD is the durable, correlated representation of one conversational interaction, containing the user’s request, relevant context, interpreted intent, agent decisions, workflow and task references, tool interactions, intermediate results, and generated response. It connects the conversational layer with distributed execution, allowing CWD to preserve continuity, trace the actions that produced a response, support asynchronous processing and recovery, and maintain a governed record of each user request without exposing the entire session to every agent.

### Final mental model

Session = overall interaction → Turn = one request and response → Workflow = process started by the turn → Task = objective → Run = execution attempt → Tools = actions → Response = result returned to the user.
