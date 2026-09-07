# Short-Term Memory in CWD

## Core Principle

Short-term memory is the working memory of the current conversation and active workflow. It keeps the information an agent needs to continue a task without repeatedly asking the user, re-executing completed steps, or losing context between Coordinator, Delegator, and Worker executions.

It is not the same as long-term persistent memory and it is not a substitute for durable workflow state.

> Short-term memory maintains continuity; execution state maintains control; persistent memory maintains intentionally retained knowledge.

## 1. What Short-Term Memory Contains

Short-term memory may include:

|
Information

|

Example

|
| --- | --- |
|

Recent messages

|

User asks a follow-up question about the previous answer

|
|

Active topic

|

Equipment-X inspection

|
|

Current user request

|

“Compare the two procedures”

|
|

Intermediate results

|

Yield analysis completed

|
|

Tool outputs

|

Azure AI Search returned five chunks

|
|

Agent decisions

|

Coordinator selected Manufacturing Delegator

|
|

Current entities

|

Plant-A, Equipment-X, Procedure-5001

|
|

Task constraints

|

Use the latest approved version

|
|

Pending questions

|

Need confirmation of the equipment ID

|
|

Temporary calculations

|

Candidate ranking or intermediate analysis

|
|

Relevant retrieved context

|

Authorized procedure excerpts

|
|

Conversation summary

|

Condensed history of the current discussion

|

The system should not retain every intermediate value indefinitely. It should retain what is needed for the current execution.

## 2. Short-Term Memory Versus Other State

```
Short-Term Memory
    │
    ├── Recent conversation
    ├── Active topic
    ├── Temporary working context
    └── Intermediate results

Execution State
    │
    ├── Current workflow node
    ├── Completed tasks
    ├── Pending tasks
    ├── Retry count
    └── Checkpoint information

Persistent Memory
    │
    ├── Saved preferences
    ├── Long-term facts
    └── Retained business context
```

For example:

```
Short-term memory:
"The user is currently investigating Equipment-X."

Execution state:
"The workflow is waiting for the Procedure Worker."

Persistent memory:
"The user prefers detailed technical explanations."
```

The same infrastructure may store these items, but their meaning, retention, and access policies differ.

## 3. Why CWD Needs Short-Term Memory

Without short-term memory, every agent would behave as though it had just received the task.

```
User: "Explain the procedure."

Coordinator:
"What procedure?"

User: "The one we discussed."

Coordinator:
"What did we discuss?"
```

With short-term memory:

```
User: "Explain the procedure."
       ↓
Conversation Memory
       ↓
Active topic = Equipment-X inspection
       ↓
User: "Compare it with the safety procedure."
       ↓
System resolves "it" using current context
```

Short-term memory supports:

* Conversational continuity

* Follow-up questions

* Multi-step reasoning

* Tool-result reuse

* Agent coordination

* Temporary task context

* Avoiding repeated work

* Resuming an active interaction

## 4. Short-Term Memory Across the CWD Lifecycle

```
User Request
    │
    ▼
Gateway
    │
    │ Creates session/correlation context
    ▼
Coordinator
    │
    │ Reads recent conversation + active context
    ▼
Delegator
    │
    │ Receives task-specific working context
    ▼
Worker
    │
    │ Adds tool outputs and intermediate results
    ▼
Memory / State Update
    │
    ▼
Context Builder
    │
    ▼
LLM
    │
    ▼
Response
    │
    ▼
Updated Short-Term Memory
```

The memory evolves throughout the workflow.

# 5. Gateway: Establishing the Initial Context

The Gateway typically establishes the interaction envelope.

JSON

```
{
  "session_id": "SESSION-2001",
  "conversation_id": "CONV-5001",
  "correlation_id": "CORR-7890",
  "user_id": "user-123",
  "message": "What is the latest inspection procedure?"
}
```

The Gateway should not store the entire enterprise memory itself. It passes the request and trusted identity context to the Coordinator.

# 6. Coordinator: Managing Conversation-Level Working Context

The Coordinator uses short-term memory to understand the current conversation.

It may maintain:

JSON

```
{
  "active_topic": "equipment_inspection",
  "current_intent": "procedure_lookup",
  "current_domain": "manufacturing",
  "active_entities": {
    "plant": "Plant-A",
    "equipment_id": "Equipment-X"
  },
  "recent_decisions": [
    "Use the latest approved procedure."
  ],
  "pending_questions": [],
  "active_workflow_id": "WF-1001"
}
```

The Coordinator uses this context to decide:

* Is this a new request or a continuation?

* What does “it” or “that procedure” refer to?

* Which domain is involved?

* Is an existing workflow still active?

* Does the task require new retrieval or can an earlier result be reused?

# 7. Delegator: Receiving Domain-Specific Working Context

The Delegator should receive only the context relevant to its domain.

```
Coordinator Context
    │
    ▼
Domain Context Projection
    │
    ▼
Manufacturing Delegator
```

Example:

JSON

```
{
  "task_id": "DT-5001",
  "correlation_id": "CORR-7890",
  "domain": "manufacturing",
  "intent": "procedure_lookup",
  "business_context": {
    "plant": "Plant-A",
    "equipment_id": "Equipment-X"
  },
  "relevant_history": [
    "Previous retrieval found an older procedure."
  ],
  "constraints": {
    "current_approved_version": true
  }
}
```

The Delegator does not need the entire conversation if the task is already well-defined.

# 8. Worker: Maintaining Task-Local Working Memory

A specialized Worker may maintain temporary information such as:

```
Current query
Retrieved chunks
Tool outputs
Intermediate calculations
Validation results
Selected procedure
Pending tool call
Retry reason
```

Example:

Python

Run

```
worker_memory = {
    "task_id": "WT-1001",
    "query": "latest approved inspection procedure",
    "retrieved_chunks": [
        "CHUNK-101",
        "CHUNK-102"
    ],
    "tool_outputs": {
        "search_knowledge": {
            "result_count": 5
        }
    },
    "decision": {
        "selected_document": "PROC-5001",
        "version": "4.2"
    },
    "validation": {
        "grounding_sufficient": True
    }
}
```

This is useful while the Worker is executing. It should not automatically become permanent memory.

# 9. Intermediate Results

Intermediate results are temporary outputs produced during execution.

Example:

```
Query Understanding
       ↓
Intent = procedure_lookup
       ↓
Search
       ↓
5 candidate chunks
       ↓
ACL filtering
       ↓
3 authorized chunks
       ↓
Ranking
       ↓
1 best procedure
```

Short-term memory preserves these results so the Worker does not need to repeat every operation.

For example:

JSON

```
{
  "retrieval_status": "completed",
  "authorized_chunk_ids": [
    "CHUNK-101",
    "CHUNK-102",
    "CHUNK-103"
  ],
  "selected_document": "PROC-5001",
  "selected_version": "4.2"
}
```

# 10. Tool Outputs in Short-Term Memory

Tool outputs may come from:

```
Azure AI Search
MCP servers
Enterprise APIs
Databases
Calculators
Document parsers
Business services
```

Example:

JSON

```
{
  "tool_name": "get_equipment_status",
  "task_id": "WT-1002",
  "output": {
    "equipment_id": "Equipment-X",
    "status": "operational",
    "last_updated": "2026-09-06T20:10:00Z"
  }
}
```

The Worker may use this output in a later step:

```
Equipment Status
       +
Retrieved Procedure
       ↓
Context Builder
       ↓
LLM
```

Tool outputs should be:

* Validated

* Bounded

* Associated with task identity

* Classified

* Protected according to data sensitivity

* Removed or expired when no longer needed

# 11. Agent Decisions as Working Memory

Agents make decisions during execution.

Examples:

```
Coordinator:
"Use Manufacturing Delegator."

Delegator:
"Run Procedure Worker and Safety Worker in parallel."

Worker:
"Use hybrid retrieval."

Worker:
"Select the current approved procedure."

Coordinator:
"Request human approval before rerouting."
```

These decisions should be recorded in a structured form.

JSON

```
{
  "decision_id": "DEC-1001",
  "agent_id": "procedure-worker",
  "task_id": "WT-1001",
  "decision_type": "retrieval_strategy",
  "decision": "hybrid_search",
  "reason": "Query contains both equipment identifier and semantic procedure request.",
  "timestamp": "2026-09-06T20:15:00Z"
}
```

A decision record is useful for:

* Continuing the workflow

* Explaining why a route was selected

* Debugging

* Evaluating agent behavior

* Auditing important decisions

For high-risk decisions, the system should preserve more detail and require appropriate approval.

# 12. Short-Term Memory and LangGraph

LangGraph-style workflows commonly maintain a state object containing the current working context.

Conceptually:

Python

Run

```
state = {
    "session_id": "SESSION-2001",
    "conversation_id": "CONV-5001",
    "correlation_id": "CORR-7890",
    "workflow_id": "WF-1001",
    "messages": [],
    "active_topic": "equipment_inspection",
    "intent": "procedure_lookup",
    "domain": "manufacturing",
    "task_context": {
        "plant": "Plant-A",
        "equipment_id": "Equipment-X"
    },
    "intermediate_results": {},
    "tool_outputs": {},
    "agent_decisions": [],
    "retrieved_context": [],
    "current_node": "context_building",
    "status": "running"
}
```

LangGraph can use this state to determine:

```
What has already happened?
What should happen next?
Which results are available?
Which tasks are pending?
Should the workflow retry?
Should it wait for approval?
```

However:

> LangGraph state is execution state with working context; it is not automatically a persistent memory system.

# 13. Short-Term Memory and RAG

RAG results can become part of short-term working memory.

```
User Query
    │
    ▼
RAG Retrieval
    │
    ▼
Authorized Chunks
    │
    ▼
Short-Term Working Context
    │
    ▼
LLM
```

Example:

JSON

```
{
  "retrieved_context": [
    {
      "document_id": "DOC-5001",
      "chunk_id": "CHUNK-101",
      "section": "Inspection Steps",
      "version": "4.2",
      "text": "..."
    }
  ]
}
```

This context is useful for the current answer, but it should not automatically be stored as permanent memory.

The system should retain references and provenance rather than unnecessarily duplicating large document content.

# 14. Short-Term Memory and Prompt Construction

The Context Builder selects relevant working memory.

```
Current User Request
       +
Recent Messages
       +
Relevant Intermediate Results
       +
Validated Tool Outputs
       +
Agent Decisions
       +
Authorized RAG Evidence
       +
Governed Prompt
       ↓
      LLM
```

A conceptual prompt context might be:

JSON

```
{
  "current_request": "Compare the inspection and safety procedures.",
  "conversation_summary": "The user is investigating Equipment-X at Plant-A.",
  "active_task": {
    "domain": "manufacturing",
    "equipment_id": "Equipment-X"
  },
  "previous_results": [
    "Inspection procedure version 4.2 was found."
  ],
  "tool_outputs": [],
  "retrieved_evidence": [
    "Authorized inspection procedure chunks",
    "Authorized safety procedure chunks"
  ]
}
```

Only relevant and authorized content should be included.

# 15. Context Window Management

Short-term memory can grow too large.

A controlled strategy is:

```
Raw Messages
     │
     ▼
Relevance Filtering
     │
     ▼
Summarization
     │
     ▼
Decision Extraction
     │
     ▼
Result Compression
     │
     ▼
Bounded Working Context
```

For example:

```
Raw history:
50 messages

Retained context:
- Current objective
- Important decisions
- Active entities
- Pending tasks
- Relevant previous results
- Source references
```

This reduces:

* Token usage

* Latency

* Cost

* Context confusion

* Prompt injection exposure

* Irrelevant information

# 16. Short-Term Memory and Context Propagation

The context passed between agents should be a projection of the current working memory.

```
Coordinator Short-Term Memory
       │
       ▼
Coordinator Context Projection
       │
       ▼
Delegator Short-Term Memory
       │
       ▼
Delegator Context Projection
       │
       ▼
Worker Short-Term Memory
```

Example:

JSON

```
{
  "correlation_id": "CORR-7890",
  "workflow_id": "WF-1001",
  "task_id": "WT-1001",
  "intent": "procedure_lookup",
  "domain": "manufacturing",
  "business_context": {
    "plant": "Plant-A",
    "equipment_id": "Equipment-X"
  },
  "required_context": {
    "previous_procedure_version": "3.0",
    "required_current_version": true
  }
}
```

The Worker does not need unrelated messages, unrelated domains, or the Coordinator's complete internal reasoning.

# 17. Short-Term Memory in Parallel Execution

Suppose the Delegator starts three Workers:

```
                 Delegator
                /    |     \
               ▼     ▼      ▼
          Quality  Equipment Procedure
           Worker   Worker    Worker
```

Each Worker has local short-term memory:

```
Quality Worker:
quality measurements

Equipment Worker:
equipment status

Procedure Worker:
retrieved procedure chunks
```

The Delegator maintains an aggregate working context:

JSON

```
{
  "task_id": "DT-5001",
  "worker_results": {
    "quality-worker": {
      "status": "completed"
    },
    "equipment-worker": {
      "status": "completed"
    },
    "procedure-worker": {
      "status": "completed"
    }
  },
  "aggregation_status": "ready"
}
```

This prevents one Worker from seeing unnecessary data from another Worker.

# 18. Short-Term Memory During Retries

A retry should preserve useful context.

```
Original Attempt
    │
    ├── Query
    ├── Selected strategy
    ├── Tool failure
    └── Retry reason
         │
         ▼
Retry Attempt
```

Example:

JSON

```
{
  "task_id": "WT-1001",
  "attempt": 2,
  "correlation_id": "CORR-7890",
  "previous_attempt": {
    "retrieval_mode": "vector",
    "error": "insufficient_relevance"
  },
  "new_strategy": {
    "retrieval_mode": "hybrid",
    "query_rewrite": true
  }
}
```

The system should preserve relevant results but avoid blindly reusing invalid or stale tool outputs.

# 19. Short-Term Memory During Human Approval

When approval is required, the current working context may include:

```
Pending action
Reason for approval
Relevant evidence
Risk classification
Current task
Authorized approver
Approval status
```

Example:

JSON

```
{
  "task_id": "WT-2001",
  "status": "waiting_for_approval",
  "pending_action": "submit_reroute_request",
  "reason": "Shipment rerouting changes the approved logistics plan.",
  "evidence_references": [
    "SHIP-123",
    "POLICY-456"
  ],
  "approval_required": true
}
```

The actual workflow checkpoint must be durable if the approval may outlast the current process.

# 20. Short-Term Memory and Asynchronous Execution

Short-term memory should be associated with durable identifiers:

```
session_id
conversation_id
workflow_id
task_id
correlation_id
```

For long-running tasks:

```
Submit Task
    ↓
Store Working Context
    ↓
Acknowledge
    ↓
Execute Asynchronously
    ↓
Update Intermediate Results
    ↓
Complete Task
    ↓
Resume Workflow
```

A message broker delivers task messages, while the state store preserves the working context needed to continue.

# 21. Short-Term Memory Storage Pattern

A practical architecture is:

```
                    CWD Runtime
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
    Session Context  Workflow     Task Working
       Store          State          Memory
           │            │            │
           └────────────┼────────────┘
                        ▼
                 Context Builder
                        │
                        ▼
                       LLM
```

Possible implementations include:

|
Requirement

|

Possible Technology

|
| --- | --- |
|

Fast session context

|

Redis

|
|

Conversation messages

|

PostgreSQL, Cosmos DB, or document store

|
|

Workflow checkpoints

|

Durable LangGraph-compatible state store

|
|

Task-local results

|

State store or task database

|
|

Large temporary artifacts

|

Object storage

|
|

Semantic memory retrieval

|

Vector-capable memory store

|

The exact technology depends on scale, durability, latency, and governance requirements.

# 22. Short-Term Memory Retention

Short-term memory should have a bounded lifecycle.

```
Create
  ↓
Use
  ↓
Update
  ↓
Summarize
  ↓
Expire / Delete
```

Examples:

```
Recent messages:
Retained during the active conversation

Tool output:
Retained while needed by the current task

Temporary search results:
Retained until the workflow completes or expires

Intermediate calculation:
Retained until downstream steps finish
```

Retention should depend on:

* Session timeout

* Workflow completion

* Task completion

* Data classification

* Legal or compliance requirements

* Storage cost

* Relevance

* Explicit deletion requests

# 23. Short-Term Memory Security

Short-term memory can contain sensitive information.

Security controls include:

```
Identity validation
Tenant isolation
Access control
Data classification
Encryption
Redaction
Retention limits
Audit logging
Secure deletion
```

Important rule:

> Short-term does not mean non-sensitive.

A temporary tool output may contain confidential data and must be protected even if it is deleted after the workflow.

# 24. Short-Term Memory Versus Persistent Memory

|
Feature

|

Short-Term Memory

|

Persistent Memory

|
| --- | --- | --- |
|

Purpose

|

Current continuity

|

Long-term reuse

|
|

Lifetime

|

Current session/workflow

|

Across sessions

|
|

Content

|

Recent messages, temporary results

|

Intentionally retained facts

|
|

Storage

|

Session/state store

|

Governed memory store

|
|

Retrieval

|

Current task relevance

|

Cross-session relevance

|
|

Retention

|

Bounded and temporary

|

Explicit lifecycle

|
|

Example

|

Current search results

|

Saved user preference

|
|

Main risk

|

Context overflow and temporary data exposure

|

Stale or unauthorized retained information

|

# 25. Short-Term Memory Versus Execution State

|
Feature

|

Short-Term Memory

|

Execution State

|
| --- | --- | --- |
|

Main question

|

What information is relevant now?

|

What should the workflow do next?

|
|

Content

|

Messages, results, decisions, context

|

Nodes, transitions, statuses, retries

|
|

Primary consumer

|

LLM and agents

|

Workflow engine

|
|

Lifetime

|

Session/task context

|

Workflow execution

|
|

Example

|

Retrieved procedure text

|

Current node = `validate_output`

|
|

Recovery role

|

Supplies working information

|

Controls resume and recovery

|

In practice, a LangGraph state object may contain both, but the conceptual distinction should remain clear.

# 26. Common Anti-Patterns

### 1. Sending the entire conversation to every Worker

This increases cost, latency, and data exposure.

### 2. Treating short-term memory as permanent memory

Temporary tool outputs should not automatically become long-term facts.

### 3. Storing all intermediate results forever

Retain only what is needed for continuation, audit, or approved reuse.

### 4. Losing memory during asynchronous execution

Persist working context using workflow and task identifiers.

### 5. Trusting memory without validation

Memory may be stale, incorrect, or out of scope.

### 6. Allowing memory to grant authorization

Memory provides context; Policy/IAM determines access.

### 7. Putting unrestricted tool outputs directly into prompts

Validate, classify, filter, and bound tool outputs before context construction.

### 8. Confusing a conversation summary with a complete checkpoint

A summary may omit retry counts, pending tasks, approval status, or execution lineage.

# 27. End-to-End Example

User asks:

> “Continue the Equipment-X investigation and compare the inspection procedure with the safety procedure.”

### Gateway

Establishes:

```
session_id
conversation_id
correlation_id
user identity
```

### Coordinator

Reads short-term memory:

```
Active topic = Equipment-X investigation
Plant = Plant-A
Previous procedure = version 4.2
```

### Delegator

Creates two tasks:

```
Task A → Retrieve inspection procedure
Task B → Retrieve safety procedure
```

### Workers

Each Worker maintains task-local memory:

```
Inspection Worker:
inspection chunks + metadata

Safety Worker:
safety chunks + metadata
```

### Context Builder

Combines:

```
Current request
Relevant conversation summary
Task context
Authorized inspection evidence
Authorized safety evidence
```

### LLM

Generates the comparison.

### Validation

Checks grounding and provenance.

### Result

The Delegator aggregates the result, and the Coordinator updates the active conversation context:

```
Last completed action:
Compared inspection and safety procedures.

Active topic:
Equipment-X investigation.

Relevant references:
PROC-5001
SAFETY-7001
```

# 28. Architect-Level Formula

```
Short-Term Memory
=
Recent Messages
+
Active Session Context
+
Intermediate Results
+
Tool Outputs
+
Agent Decisions
+
Temporary Task Context
+
Relevant Retrieved Evidence
+
Pending Execution Information
```

A more controlled version is:

```
Usable Short-Term Context
=
Relevant Information
∩
Authorized Information
∩
Current Task Scope
∩
Valid Information
∩
Token Budget
```

# Interview-Ready Answer

> “In CWD, short-term memory is the working context used to maintain continuity throughout the current conversation and active workflow. It includes recent messages, active entities, intermediate results, tool outputs, agent decisions, pending tasks, and relevant retrieved evidence. The Gateway establishes the session and correlation context, the Coordinator maintains enterprise-level conversational context, the Delegator creates domain-specific context, and each Worker maintains task-local working memory. LangGraph can carry this information in its execution state while managing transitions, retries, checkpoints, and resume. Before invoking the LLM, the Context Builder selects only relevant, authorized, validated, and bounded information. Short-term memory is different from persistent memory because it is temporary and task-oriented, and it is different from execution state because execution state controls workflow progression. The key design principle is to propagate context selectively rather than sharing the entire conversation or memory store with every agent.”

# Final Definition

Short-term memory in CWD is the temporary, task-scoped working context that preserves the information required to maintain the current conversation and continue active execution across the Gateway, Coordinator, Delegator, and Worker agents. It includes recent messages, active entities, intermediate results, tool outputs, agent decisions, pending tasks, and relevant retrieved evidence. This information is selectively stored, retrieved, summarized, validated, and propagated according to task scope, authorization, classification, and token limits. LangGraph may carry short-term working context within execution state, while durable checkpoints preserve the information required for recovery.

> Short-term memory answers “What information do we need right now?” while execution state answers “What should happen next?”


### Compact Mental Model

```
Recent Messages
      +
Intermediate Results
      +
Tool Outputs
      +
Agent Decisions
      +
Active Task Context
      +
Relevant RAG Evidence
      ↓
Short-Term Working Memory
      ↓
Context Selection
      ↓
LLM / Next Agent
```

Short-term memory is temporary working context—not a permanent knowledge base, not an authorization mechanism, and not a replacement for durable workflow state.
