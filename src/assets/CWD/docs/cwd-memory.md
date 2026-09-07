# CWD Memory and State Management

## Core Principle

In CWD, memory, session context, and execution state are different concepts. They must be managed separately because they have different lifecycles, security requirements, retention policies, and responsibilities.

> Execution state tells CWD where a workflow is. Session context tells it what is happening in the current conversation. Conversational memory tells it what has been discussed. Persistent memory tells it what should be retained across sessions. Context propagation tells each agent what information it is allowed and required to receive.

The central architecture is:

```
                         ┌──────────────────────┐
                         │        USER          │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │       GATEWAY        │
                         │ Identity + Session   │
                         │ Correlation Context  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │     COORDINATOR      │
                         │ Enterprise Workflow  │
                         │ Intent + Plan        │
                         └──────────┬───────────┘
                                    │
                             A2A Context
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │      DELEGATOR       │
                         │ Domain Task State    │
                         │ Domain Context       │
                         └──────────┬───────────┘
                                    │
                              Task Context
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   SPECIALIZED WORKER │
                         │ Execution + Tools    │
                         └──────────┬───────────┘
                                    │
                   ┌────────────────┼────────────────┐
                   ▼                ▼                ▼
             Session Store     State Store       Memory Store
                   │                │                │
                   └────────────────┼────────────────┘
                                    ▼
                         ┌──────────────────────┐
                         │ Context Construction │
                         │ Authorized + Relevant│
                         └──────────┬───────────┘
                                    ▼
                                  LLM
```

## 1. The Six Concepts Must Be Separated

|
Concept

|

Meaning

|

Typical Lifetime

|

Example

|
| --- | --- | --- | --- |
|

Conversational memory

|

Relevant facts from previous dialogue

|

Current conversation or selected longer period

|

“The user prefers a concise explanation.”

|
|

Persistent memory

|

Information intentionally retained across sessions

|

Days, months, or longer

|

Approved user preference or reusable business context

|
|

Execution state

|

Current position and data of a running workflow

|

One workflow execution

|

Current node, completed steps, retry count

|
|

Session context

|

Information associated with the active interaction

|

Current session

|

User identity, conversation ID, active topic

|
|

Task state

|

Status and data of a particular delegated task

|

One task and its descendants

|

Worker task completed, pending, failed, or awaiting approval

|
|

Context propagation

|

Controlled transfer of relevant information between components

|

Across execution boundaries

|

Correlation ID, user scope, task input, approved context

|

These concepts may use the same infrastructure, but they should not be treated as the same data structure.

# 2. Memory Versus State

A useful distinction is:

```
Memory:
"What should the system remember?"

State:
"What is happening right now?"
```

For example:

```
Memory:
"The user works with manufacturing procedures."

Execution State:
"The current workflow is waiting for the Safety Worker."

Task State:
"The procedure-retrieval task is completed."

Session Context:
"The current conversation is about Equipment-X."

Context Propagation:
"Send the plant and equipment scope to the selected Worker."
```

Memory is generally reusable. State is usually tied to a specific execution.

# 3. Conversational Memory

Conversational memory contains relevant information from the interaction history.

Example:

```
User:
"Explain the manufacturing RAG architecture."

User:
"Now explain the security part."

User:
"Use the same Equipment-X example."
```

The system should understand that “the security part” refers to the previous topic.

Conversational memory may include:

```
Recent messages
Previous questions
Assistant responses
Active topic
Resolved references
User corrections
Conversation summary
Relevant entities
```

However, the entire conversation should not automatically be inserted into every prompt.

A better approach is:

```
Conversation History
       │
       ▼
Relevance Selection
       │
       ▼
Summarization
       │
       ▼
Authorized Context
       │
       ▼
LLM
```

# 4. Persistent Memory

Persistent memory stores information that should remain available after the current session ends.

Examples include:

```
Approved user preferences
Long-term project context
Reusable business terminology
Previously confirmed configuration
Explicitly saved facts
Long-running case information
```

Persistent memory should not mean “store everything forever.”

A governed memory record may contain:

JSON

```
{
  "memory_id": "MEM-1001",
  "subject": "user-123",
  "type": "preference",
  "key": "response_style",
  "value": "detailed_architect_level",
  "source": "explicit_user_request",
  "classification": "internal",
  "consent": true,
  "created_at": "2026-09-06T20:00:00Z",
  "expires_at": null,
  "status": "active"
}
```

Persistent memory should include:

* Ownership

* Purpose

* Classification

* Retention period

* Access scope

* Source

* Confidence

* Consent or authorization where required

* Update and deletion history

# 5. Execution State

Execution state represents the current workflow instance.

For example:

```
Workflow ID: WF-1001

Current Node:
retrieve_procedure

Completed:
intent_analysis
authorization
worker_selection

Pending:
context_building
response_validation

Retry Count:
1

Status:
running
```

A LangGraph-style state object might look like:

Python

Run

```
state = {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",
    "session_id": "SESSION-2001",
    "user_id": "user-123",
    "intent": "procedure_lookup",
    "domain": "manufacturing",
    "current_node": "retrieve_procedure",
    "completed_nodes": [
        "intent_analysis",
        "authorization",
        "worker_selection"
    ],
    "pending_tasks": ["TASK-1001"],
    "task_results": {},
    "retrieved_chunk_ids": [],
    "prompt_id": "procedure-answer",
    "prompt_version": "3.1.0",
    "retry_count": 1,
    "status": "running"
}
```

Execution state allows CWD to resume after:

* Worker failure

* Runtime restart

* Network interruption

* Human approval

* Long-running asynchronous work

* Temporary service outage

# 6. Session Context

Session context represents the active interaction environment.

It may include:

```
session_id
conversation_id
user identity
tenant
environment
active topic
current task
current business object
language
interaction preferences
correlation_id
```

Example:

JSON

```
{
  "session_id": "SESSION-2001",
  "conversation_id": "CONV-5001",
  "user_id": "user-123",
  "tenant_id": "tenant-a",
  "environment": "production",
  "active_topic": "equipment inspection",
  "active_entity": {
    "equipment_id": "Equipment-X",
    "plant": "Plant-A"
  }
}
```

Session context is usually shorter-lived than persistent memory.

For example:

```
Session Context:
"Currently discussing Equipment-X."

Persistent Memory:
"User prefers detailed architecture explanations."
```

# 7. Task State

Task state tracks an individual task assigned to an agent or Worker.

Example:

JSON

```
{
  "task_id": "TASK-1001",
  "parent_task_id": "TASK-9001",
  "correlation_id": "CORR-7890",
  "source_agent": "manufacturing-delegator",
  "target_agent": "procedure-worker",
  "status": "completed",
  "attempt": 1,
  "input": {
    "equipment_id": "Equipment-X",
    "plant": "Plant-A"
  },
  "result": {
    "procedure_id": "PROC-5001",
    "version": "4.2"
  },
  "error": null
}
```

Typical task states:

```
submitted
accepted
working
waiting_for_input
waiting_for_approval
retrying
completed
failed
cancelled
timeout
```

Task state is narrower than workflow state.

```
Workflow State
   ├── Task A State
   ├── Task B State
   └── Task C State
```

# 8. Context Propagation

Context propagation means transferring the right information across CWD boundaries.

It does not mean passing the entire conversation, memory store, or execution state to every agent.

The correct principle is:

> Propagate the minimum authorized context required for the receiving component to perform its responsibility.

For example:

```
Coordinator
    │
    │ Sends:
    │ intent
    │ domain
    │ task objective
    │ user scope
    │ correlation ID
    ▼
Delegator
    │
    │ Sends:
    │ domain task
    │ business object
    │ constraints
    │ authorized context
    ▼
Worker
```

# 9. Context Propagation Across CWD

## 9.1 Gateway → Coordinator

The Gateway propagates:

```
user identity
tenant
session ID
conversation ID
correlation ID
request
security claims
request metadata
```

Example:

JSON

```
{
  "correlation_id": "CORR-7890",
  "session_id": "SESSION-2001",
  "conversation_id": "CONV-5001",
  "user": {
    "id": "user-123",
    "tenant": "tenant-a",
    "roles": ["engineering"]
  },
  "request": {
    "text": "What is the latest inspection procedure?"
  }
}
```

The Gateway should not blindly trust user-supplied authorization claims.

## 9.2 Coordinator → Delegator

The Coordinator sends enterprise-level task context.

JSON

```
{
  "task_id": "DT-5001",
  "parent_task_id": "WF-1001",
  "correlation_id": "CORR-7890",
  "session_id": "SESSION-2001",
  "source_agent": "coordinator",
  "target_agent": "manufacturing-delegator",
  "intent": "procedure_lookup",
  "domain": "manufacturing",
  "objective": "Find the latest approved inspection procedure.",
  "business_context": {
    "plant": "Plant-A",
    "equipment_id": "Equipment-X"
  },
  "constraints": {
    "status": "approved",
    "current_version_only": true
  },
  "security_context": {
    "user_id": "user-123",
    "tenant_id": "tenant-a",
    "scope_reference": "SECURITY-CONTEXT-1"
  }
}
```

The Coordinator should not send unnecessary conversation history or unrelated memory.

## 9.3 Delegator → Worker

The Delegator converts the domain objective into an executable task.

JSON

```
{
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "source_agent": "manufacturing-delegator",
  "target_agent": "procedure-worker",
  "capability": "enterprise_knowledge_retrieval",
  "action": "retrieve_procedure",
  "input": {
    "equipment_id": "Equipment-X",
    "plant": "Plant-A",
    "query": "latest approved inspection procedure"
  },
  "context": {
    "intent": "procedure_lookup",
    "domain": "manufacturing",
    "document_type": "procedure",
    "required_status": "approved"
  },
  "security_context": {
    "user_id": "user-123",
    "tenant_id": "tenant-a",
    "entitlement_reference": "ENT-9001"
  }
}
```

The Worker receives only the context necessary for its task.

## 9.4 Worker → Enterprise Systems

The Worker propagates identity and task context to tools or MCP servers.

```
Worker
  │
  ▼
MCP Client
  │
  ▼
MCP Server
  │
  ▼
Enterprise Search / API
```

Context may include:

```
user identity
agent identity
task identity
correlation ID
tenant
business scope
authorization context
request purpose
```

The Worker must not assume that the LLM's request is sufficient authorization.

# 10. Memory and State Storage Architecture

A production CWD platform may use separate logical stores.

```
                    ┌─────────────────────────┐
                    │       CWD Runtime       │
                    └────────────┬────────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             ▼                   ▼                   ▼
    ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
    │ Session Store  │  │ State Store    │  │ Memory Store   │
    │                │  │                │  │                │
    │ Active context │  │ Workflow state │  │ Long-term facts│
    │ Conversation   │  │ Task state     │  │ Preferences     │
    └────────────────┘  └────────────────┘  └────────────────┘
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 ▼
                    ┌─────────────────────────┐
                    │ Policy + Access Control │
                    └─────────────────────────┘
```

Possible technologies:

|
Need

|

Possible Store

|
| --- | --- |
|

Session cache

|

Redis

|
|

Conversation history

|

Document database or relational store

|
|

LangGraph checkpoints

|

Durable state store

|
|

Persistent semantic memory

|

Vector-capable database

|
|

Structured memory

|

PostgreSQL, Cosmos DB, or document store

|
|

Large artifacts

|

Object storage

|
|

Audit events

|

Immutable or controlled audit store

|
|

Runtime telemetry

|

Azure Monitor, Application Insights, or OpenTelemetry backend

|

The technology is less important than the separation of data ownership and lifecycle.

# 11. Memory Types in More Detail

## 11.1 Short-Term Conversational Memory

Used for immediate dialogue continuity.

```
"Explain hybrid retrieval."

"Now compare it with keyword search."
```

The second request depends on the first.

Short-term memory should be:

* Relevant

* Bounded

* Summarized when large

* Protected by session authorization

* Removed or expired according to policy

## 11.2 Episodic Memory

Episodic memory records events from previous interactions or executions.

Example:

```
Workflow WF-1001 completed.
The user approved rerouting.
The procedure retrieval task found version 4.2.
```

It can support:

* Resuming a case

* Reviewing previous decisions

* Understanding prior workflow outcomes

* Avoiding repeated work

Episodic memory should not be confused with audit logs. Audit logs are governance records; episodic memory is reusable operational context.

## 11.3 Semantic Memory

Semantic memory stores reusable facts or knowledge.

Examples:

```
Equipment-X belongs to Plant-A.
Procedure PROC-5001 is associated with Equipment-X.
The manufacturing domain uses a specific terminology.
```

Semantic memory may be represented as:

* Structured records

* Knowledge graph relationships

* Vector embeddings

* Document references

It must retain source and confidence information.

## 11.4 Working Memory

Working memory is the information currently needed by an agent.

Example:

```
Current query
Relevant retrieved chunks
Current task constraints
Previous Worker results
Current tool output
```

Working memory is usually part of execution state or a task-local context object.

# 12. Context Assembly for the LLM

The LLM should receive a controlled context, not the entire memory database.

A conceptual context builder is:

```
User Request
      │
      ▼
Session Context
      │
      ▼
Relevant Conversation Memory
      │
      ▼
Approved Persistent Memory
      │
      ▼
Current Workflow State
      │
      ▼
Task Context
      │
      ▼
Authorized RAG Evidence
      │
      ▼
Governed Prompt
      │
      ▼
LLM
```

A useful conceptual formula is:

```
LLM Context
=
Current Request
+
Relevant Session Context
+
Authorized Conversation Memory
+
Approved Persistent Memory
+
Current Task State
+
Authorized Retrieved Evidence
+
Governed Instructions
```

This formula is conceptual. The actual context must be bounded by token budget, data classification, relevance, and policy.

# 13. Memory Selection Is a Retrieval Problem

The system should not include every memory item.

A memory selection process may consider:

```
Relevance
Recency
Importance
Confidence
Source
User scope
Task scope
Data classification
Expiration
Current intent
```

For example:

Python

Run

```
def select_memory(query, memories, context):
    eligible = [
        memory
        for memory in memories
        if memory.status == "active"
        and memory.subject == context.user_id
        and policy.allows_memory_access(
            user=context.user_id,
            memory=memory
        )
    ]

    relevant = [
        memory
        for memory in eligible
        if is_relevant(memory, query, context)
    ]

    ranked = rank_memory(
        query=query,
        memories=relevant,
        recency=True,
        importance=True,
        confidence=True
    )

    return fit_to_token_budget(ranked, context.token_budget)
```

The memory retrieval process should respect the same security principles as RAG retrieval.

# 14. Memory Security

Memory can contain sensitive information even when it is not a document.

Sensitive data may appear in:

```
Conversation history
Session context
Workflow state
Task inputs
Task results
Checkpoints
Persistent memory
Embeddings
Prompt variables
Logs
Traces
```

Therefore, CWD should apply:

```
Authentication
Authorization
Tenant isolation
Data classification
Encryption
Retention
Redaction
Access logging
Deletion controls
```

Important rule:

> The fact that information was previously available to an agent does not mean it is automatically authorized for every future task or every other agent.

# 15. Context Propagation Does Not Mean Full State Sharing

A common anti-pattern is:

```
Coordinator
   │
   ▼
Send entire conversation + entire memory + entire workflow state
   │
   ▼
Every Worker
```

This creates:

* Excessive token usage

* Data leakage risk

* Confused responsibilities

* Larger attack surface

* Difficult debugging

* Unclear ownership

* Poor prompt quality

The better pattern is:

```
Coordinator
   │
   ▼
Minimal Authorized Task Context
   │
   ▼
Delegator
   │
   ▼
Minimal Authorized Worker Context
   │
   ▼
Worker
```

# 16. State Ownership Across CWD

Each layer should own the state appropriate to its responsibility.

|
Component

|

State or Context Owned

|
| --- | --- |
|

Gateway

|

Request, session reference, identity, correlation

|
|

Coordinator

|

Enterprise workflow state, global objective, overall status

|
|

Delegator

|

Domain plan, domain task state, Worker results

|
|

Worker

|

Local execution state, tool results, validation state

|
|

LangGraph

|

Node transitions, checkpoints, workflow continuation

|
|

Session store

|

Active conversation/session context

|
|

Memory store

|

Approved persistent memories

|
|

Agent Registry

|

Agent metadata and operational routing state

|
|

Prompt Registry

|

Prompt versions and lifecycle metadata

|
|

Policy/IAM

|

Authorization and entitlement decisions

|
|

RAG layer

|

Retrieved evidence and provenance

|
|

Audit system

|

Governance and security events

|

This prevents one component from becoming the owner of every kind of information.

# 17. State Propagation Through a Parallel Workflow

Suppose the Coordinator creates three tasks:

```
                    Coordinator
                         │
              ┌──────────┼──────────┐
              ▼          ▼          ▼
         Task A       Task B      Task C
         Quality      Equipment   Procedure
              │          │          │
              ▼          ▼          ▼
           Worker      Worker      Worker
```

Each task receives:

```
correlation_id
workflow_id
task_id
parent_task_id
user scope
domain context
task-specific input
```

But each Worker maintains its own local execution state.

The Delegator later aggregates:

```
Task A Result
+
Task B Result
+
Task C Result
```

The Coordinator retains the enterprise-level workflow state.

# 18. State Propagation Through Retries

When a Worker fails, the retry should preserve identity and lineage.

```
Original Task:
WT-1001

Retry:
WT-1001
Attempt: 2
Correlation ID: CORR-7890
Parent Task: DT-5001
```

The system should not create an unrelated execution identity for every retry.

However, the attempt number should change:

JSON

```
{
  "task_id": "WT-1001",
  "attempt": 2,
  "correlation_id": "CORR-7890",
  "parent_task_id": "DT-5001",
  "status": "retrying",
  "retry_reason": "transient_search_timeout"
}
```

This enables accurate tracing and idempotency.

# 19. State Propagation Through Human Approval

For high-risk operations:

```
Worker
  │
  ▼
Approval Required
  │
  ▼
Checkpoint State
  │
  ▼
Human Decision
  │
  ▼
Resume Workflow
```

The checkpoint should preserve:

```
workflow_id
task_id
correlation_id
current_node
pending action
approval request
authorized user scope
relevant context reference
expiration
```

The system should not reconstruct the workflow from conversation text alone.

# 20. State Propagation Through Asynchronous Messaging

With Azure Service Bus:

```
Coordinator
    │
    ▼
Service Bus
    │
    ▼
Delegator
    │
    ▼
Worker
```

The message should carry execution references:

JSON

```
{
  "message_id": "MSG-5001",
  "message_type": "task.requested",
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "parent_task_id": "DT-5001",
  "source_agent": "manufacturing-delegator",
  "target_agent": "procedure-worker",
  "payload": {
    "equipment_id": "Equipment-X"
  }
}
```

The durable message carries the task request. The durable workflow state remains in the state store.

```
Service Bus
→ Message delivery

LangGraph / State Store
→ Workflow continuation
```

# 21. Memory and RAG Work Together

RAG retrieves enterprise knowledge. Memory retrieves prior interaction or reusable context.

They should not be merged blindly.

```
Current Query
   │
   ├───────────────┐
   ▼               ▼
Memory Retrieval  RAG Retrieval
   │               │
   │               ├── Enterprise documents
   │               ├── Policies
   │               └── Procedures
   │
   ├── Previous conversation
   ├── Approved preferences
   └── Relevant prior decisions
   │               │
   └───────┬───────┘
           ▼
     Context Builder
           │
           ▼
           LLM
```

Example:

```
Memory:
"The user is investigating Equipment-X."

RAG:
"The approved inspection procedure is version 4.2."

LLM:
"Combines the current investigation context with the approved procedure."
```

# 22. Memory and RAG Have Different Trust Models

|
Aspect

|

Memory

|

RAG

|
| --- | --- | --- |
|

Main purpose

|

Continuity and reusable context

|

Enterprise knowledge grounding

|
|

Source

|

Prior interaction or saved facts

|

Governed enterprise sources

|
|

Main risk

|

Stale or incorrect remembered facts

|

Unauthorized or outdated documents

|
|

Validation

|

Relevance, confidence, source, expiration

|

Relevance, ACL, freshness, provenance

|
|

Typical retrieval

|

Session/memory search

|

Keyword/vector/hybrid search

|
|

Governance

|

Retention, consent, ownership

|

Source governance, ACL, classification

|
|

Output use

|

Contextual personalization or continuity

|

Evidence for grounded reasoning

|

A remembered statement should not automatically override an authoritative current enterprise document.

# 23. Memory Conflict Resolution

Suppose memory says:

```
"Procedure version 3.0 is the current procedure."
```

But RAG retrieves:

```
"Procedure version 4.2 is approved and effective."
```

The system should prefer the authoritative, current, governed source.

A conceptual precedence order is:

```
Current authorized enterprise source
        >
Approved task-specific result
        >
Recent validated workflow state
        >
Persistent memory
        >
Unverified conversation claim
```

The exact precedence depends on the business domain, but the principle is:

> Memory supports continuity; authoritative enterprise sources establish current business truth.

# 24. Context Propagation and Security Boundaries

Each boundary should validate incoming context.

```
Gateway → Coordinator
       Validate identity

Coordinator → Delegator
       Validate task authorization

Delegator → Worker
       Validate task scope

Worker → MCP / Enterprise System
       Validate tool and resource permissions

Worker → LLM
       Validate context classification and allowed data
```

A receiving agent should not trust:

```
Caller-supplied role
Caller-supplied ACL
Unverified memory
Unvalidated task input
LLM-generated authorization
```

# 25. Practical Context Envelope

A reusable context envelope can contain:

JSON

```
{
  "identity": {
    "user_id": "user-123",
    "tenant_id": "tenant-a",
    "agent_id": "procedure-worker"
  },
  "execution": {
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",
    "task_id": "WT-1001",
    "parent_task_id": "DT-5001",
    "attempt": 1
  },
  "session": {
    "session_id": "SESSION-2001",
    "conversation_id": "CONV-5001"
  },
  "business_context": {
    "domain": "manufacturing",
    "plant": "Plant-A",
    "equipment_id": "Equipment-X"
  },
  "task": {
    "intent": "procedure_lookup",
    "objective": "Find the latest approved procedure"
  },
  "security": {
    "classification": "internal",
    "entitlement_reference": "ENT-9001"
  },
  "references": {
    "memory_ids": ["MEM-1001"],
    "retrieved_chunk_ids": ["CHUNK-1", "CHUNK-2"]
  }
}
```

This is a reference-based context envelope. Sensitive or large content should be fetched through authorized services rather than copied into every message.

# 26. Reference-Based Versus Inline Context

## Inline context

JSON

```
{
  "task": "Analyze shipment delay",
  "tracking_events": [
    {"status": "delayed"}
  ]
}
```

Useful for small, task-specific data.

## Reference-based context

JSON

```
{
  "task": "Analyze shipment delay",
  "tracking_data_reference": "CTX-5001",
  "authorization_reference": "AUTH-9001"
}
```

Useful for:

* Large documents

* Sensitive data

* Shared context

* Reusable artifacts

* Long-running workflows

* Cross-agent communication

The receiving component must validate authorization before resolving the reference.

# 27. Context Compaction

Long-running workflows can accumulate excessive state.

A compaction strategy may:

```
Raw Messages
     │
     ▼
Summarize
     │
     ▼
Extract Decisions
     │
     ▼
Extract Open Tasks
     │
     ▼
Retain Important References
     │
     ▼
Bounded Context
```

A compact conversation summary might contain:

JSON

```
{
  "summary": "The user is investigating a yield drop on Equipment-X at Plant-A.",
  "decisions": [
    "Use the current approved manufacturing procedure."
  ],
  "open_questions": [
    "Confirm whether the quality report is available."
  ],
  "references": [
    "DOC-5001",
    "TASK-1001"
  ]
}
```

The system should retain important identifiers and provenance rather than only an untraceable natural-language summary.

# 28. Memory Lifecycle

Persistent memory should have a lifecycle:

```
Capture
  ↓
Validate
  ↓
Classify
  ↓
Authorize
  ↓
Store
  ↓
Retrieve
  ↓
Use
  ↓
Update
  ↓
Expire / Delete
```

Memory creation should be controlled.

For example:

```
User explicitly says:
"Remember that I prefer detailed explanations."
```

This is different from automatically storing every statement in a conversation.

# 29. Memory Governance

Enterprise memory governance should address:

|
Control

|

Purpose

|
| --- | --- |
|

Ownership

|

Who owns the memory?

|
|

Classification

|

What sensitivity level applies?

|
|

Retention

|

How long should it exist?

|
|

Consent

|

Was retention permitted where required?

|
|

Access scope

|

Who can retrieve it?

|
|

Provenance

|

Where did it originate?

|
|

Confidence

|

How reliable is it?

|
|

Expiration

|

When should it be revalidated?

|
|

Correction

|

How can it be updated?

|
|

Deletion

|

How can it be removed?

|
|

Audit

|

Who accessed or changed it?

|

# 30. Common Anti-Patterns

### Anti-pattern 1: Treating conversation history as workflow state

Conversation text cannot reliably represent:

* Current node

* Completed tasks

* Retry count

* Approval status

* Idempotency

* Pending messages

Use durable execution state.

### Anti-pattern 2: Sending all memory to every Worker

This creates unnecessary data exposure and poor context quality.

Use task-scoped, authorized context.

### Anti-pattern 3: Treating persistent memory as authoritative enterprise truth

Persistent memory may be stale or incorrect.

Use governed RAG or live enterprise systems for current business facts.

### Anti-pattern 4: Storing secrets in memory

Never store:

* Access tokens

* Passwords

* API keys

* Private credentials

* Unnecessary sensitive claims

Use secure secret-management services.

### Anti-pattern 5: Losing context during asynchronous execution

Every message and task must preserve:

```
correlation_id
workflow_id
task_id
parent_task_id
```

### Anti-pattern 6: Creating a new correlation ID at every hop

This breaks end-to-end tracing.

### Anti-pattern 7: Sharing raw checkpoints across trust boundaries

A checkpoint may contain sensitive data and internal execution details.

Expose only an authorized task result or context projection.

### Anti-pattern 8: Letting memory override policy

Memory can provide context, but it cannot grant authorization.

# 31. End-to-End Example

User asks:

> “Continue the Equipment-X investigation and tell me which approved procedure applies.”

### Step 1 — Gateway

Creates or resumes:

```
session_id = SESSION-2001
correlation_id = CORR-7890
```

### Step 2 — Coordinator

Loads relevant session context:

```
Active topic:
Equipment-X investigation
```

It also loads the current workflow state if a previous workflow exists.

### Step 3 — Memory Retrieval

The system retrieves:

```
Previous investigation context
Previously confirmed equipment
Relevant user
```


### Compact Mental Model

```
Session Context
    = What is happening in this interaction?

Conversational Memory
    = What was discussed recently?

Persistent Memory
    = What information was intentionally retained?

Execution State
    = Where is the workflow and what happens next?

Task State
    = What is the status of this delegated task?

Context Propagation
    = What authorized information must cross to the next agent?
```

And the end-to-end lifecycle is:

```
Gateway
  → establishes identity, session, and correlation
Coordinator
  → owns enterprise workflow state
Delegator
  → owns domain task state
Worker
  → owns specialized execution state
Memory Services
  → provide relevant retained context
RAG / Tools
  → provide current authorized evidence
Context Builder
  → filters and assembles the LLM context
LLM
  → reasons over the supplied context
Validation
  → checks grounding, policy, and output
Result
  → propagates back with the same execution lineage
```

The most important rule is:

> Never propagate all memory and state by default. Propagate only the minimum authorized, relevant, and task-specific context required by the receiving component.
