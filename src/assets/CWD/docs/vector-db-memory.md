# Vector Databases for Semantic Memory in CWD

A vector database can provide semantic memory by storing embeddings of selected conversations, project context, decisions, and historical information, then retrieving the memories that are conceptually related to a new request.

The key principle is:

> Semantic memory retrieves by meaning, while metadata and policy determine whether the memory is relevant, valid, and permitted to use.

For example, a user may previously discuss “shipment delays caused by carrier capacity constraints.” Later, they ask, “Why are deliveries being held up?” A semantic-memory search can identify the earlier discussion even though the wording is different.

## 1. Why Semantic Memory Is Needed

Traditional key-value memory retrieves exact keys:

```
memory:user123:preferred_language
```

That works well when the system knows the exact key. However, an agent may not know which historical memory contains the answer.

A vector database supports searches such as:

```
New request:
"Continue the discussion about delivery delays."

Possible stored memories:
- "Carrier capacity caused shipment delays."
- "The logistics team approved rerouting for delayed shipments."
- "The user is working on CWD RAG architecture."
```

The system retrieves memories based on semantic similarity rather than exact wording.

### Traditional lookup versus semantic lookup

|
Lookup type

|

Example

|

Best use

|
| --- | --- | --- |
|

Exact key lookup

|

`preferred_language`

|

Known preferences and identifiers

|
|

Metadata filtering

|

`project_id = CWD`

|

Scope and governance

|
|

Semantic vector search

|

“Continue our discussion about shipment delays”

|

Conceptually related history

|
|

Hybrid retrieval

|

Semantic similarity + exact filters

|

Enterprise-grade memory retrieval

|

## 2. What Is Stored in a Vector Database?

A vector database stores an embedding together with the information needed to interpret, filter, secure, and trace that embedding.

```
Memory Text
    ↓
Embedding Model
    ↓
Numerical Vector
    ↓
Vector Database
    ├── Vector
    ├── Memory text or summary
    ├── Memory ID
    ├── Metadata
    ├── Access scope
    ├── Source reference
    └── Version / timestamps
```

Example record:

JSON

```
{
  "memory_id": "MEM-2001",
  "memory_type": "historical_summary",
  "text": "The user is designing CWD and uses LangGraph for workflow state and routing.",
  "embedding": [0.021, -0.184, 0.447, 0.092],
  "subject_id": "USER-123",
  "project_id": "CWD",
  "domain": "agentic_ai",
  "classification": "internal",
  "source": "conversation_summary",
  "confidence": 0.95,
  "status": "active",
  "created_at": "2026-09-06T15:00:00Z"
}
```

The vector shown above is illustrative. Real embeddings generally contain many more dimensions, depending on the selected embedding model.

### Important design rule

Do not store only the vector:

```
[0.021, -0.184, 0.447, ...]
```

The system also needs:

* Original or summarized memory text

* Memory identity

* Scope and ownership

* Classification

* Provenance

* Validity and expiration

* Access-control metadata

* Version information

Otherwise, the agent may retrieve a mathematically similar vector without knowing what it represents or whether it can use it.

## 3. Semantic Memory Architecture

```
                    ┌──────────────────────┐
                    │   User Conversation  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Memory Extraction    │
                    │ + Validation         │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Classification       │
                    │ + Authorization      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Embedding Model      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Vector Database      │
                    │ Vector + Metadata    │
                    └──────────┬───────────┘
                               │
                 Future Request│
                               ▼
                    ┌──────────────────────┐
                    │ Query Embedding      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Semantic Retrieval   │
                    │ + Metadata Filters   │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Policy Validation    │
                    │ + Context Selection  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Coordinator / Agent  │
                    └──────────────────────┘
```

The architecture has two separate flows:

1. Memory ingestion: decide what should be remembered and index it.

2. Memory retrieval: identify which stored memories are relevant to the current task.

## 4. Memory Ingestion Flow

### Step 1: Capture candidate information

Candidate memories may come from:

* Explicit user preferences

* Conversation summaries

* Approved project context

* Validated decisions

* Completed task outcomes

* Human-approved agent observations

* References to external artifacts

The system should not automatically convert every message into a permanent memory.

### Step 2: Extract and summarize

Instead of embedding an entire conversation, create a concise memory unit.

```
Raw conversation:
20 messages about CWD architecture

Extracted memory:
"LangGraph manages workflow state and conditional routing in CWD;
A2A handles agent communication; MCP handles tool integration."
```

### Step 3: Validate

Check:

* Is the information factual or speculative?

* Is it relevant beyond the current turn?

* Is it duplicated?

* Is it already stored?

* Is the source trustworthy?

* Does it conflict with existing memory?

### Step 4: Classify and authorize

Determine:

* Memory owner

* Subject or project scope

* Data classification

* Allowed agents

* Retention period

* Whether user or business approval is required

### Step 5: Generate embedding

```
Memory Text
    ↓
Embedding Model
    ↓
Vector Representation
```

### Step 6: Store vector and metadata

The vector database stores the embedding alongside the memory record and its metadata.

### Step 7: Index and monitor

Track:

* Memory ID

* Embedding model version

* Index version

* Ingestion status

* Source reference

* Creation time

* Update time

* Deletion or expiration status

## 5. Query-Time Semantic Retrieval

When a new request arrives, the agent follows this process:

```
New User Request
       ↓
Understand Intent and Scope
       ↓
Create Query Embedding
       ↓
Search Vector Database
       ↓
Apply Metadata Filters
       ↓
Apply Authorization / Entitlement Checks
       ↓
Rank Candidate Memories
       ↓
Remove Duplicates and Stale Records
       ↓
Select Relevant Memories
       ↓
Construct Bounded Context
       ↓
Execute Agent Workflow
```

### Example

Stored memories:

```
M1: "The user is building a CWD architecture."
M2: "The user prefers detailed technical explanations."
M3: "The user previously discussed shipment delay analysis."
M4: "The user prefers Python examples."
```

New request:

```
"Explain how to continue our architecture work with code."
```

Possible retrieval:

```
M1 → High semantic relevance
M2 → High semantic relevance
M4 → Medium semantic relevance
M3 → Low relevance
```

The agent should use M1, M2, and possibly M4, but not inject M3 merely because it belongs to the same user.

## 6. How Vector Similarity Works

An embedding model converts text into a vector:

f(text)=vf(\text{text}) = \mathbf{v}f(text)=v

For a stored memory:

m=f(memory)\mathbf{m} = f(\text{memory})m=f(memory)

For a new query:

q=f(query)\mathbf{q} = f(\text{query})q=f(query)

The vector database compares the query vector with stored memory vectors.

### Cosine similarity

A common similarity measure is:

CosineSimilarity(q,m)=q⋅m∥q∥∥m∥\text{CosineSimilarity}(\mathbf{q},\mathbf{m}) = \frac{\mathbf{q}\cdot\mathbf{m}} {\|\mathbf{q}\|\|\mathbf{m}\|}CosineSimilarity(q,m)=∥q∥∥m∥q⋅m

A higher similarity generally indicates that the two texts are closer in the embedding space.

### Important limitation

Vector similarity measures semantic closeness, not truth, authority, authorization, or freshness.

A stale or incorrect memory can still be highly similar to a new query. Therefore:

```
Semantic Similarity ≠ Truth
Semantic Similarity ≠ Authorization
Semantic Similarity ≠ Current Validity
```

## 7. Metadata Filtering Is Essential

Semantic similarity alone is insufficient for enterprise memory.

A query may need to retrieve memories only when:

* They belong to the current user

* They belong to the current tenant

* They relate to the current project

* They belong to the correct domain

* They are active and not expired

* Their classification is permitted

* The requesting agent has access

Example filter:

JSON

```
{
  "subject_id": "USER-123",
  "project_id": "CWD",
  "memory_type": "approved_decision",
  "status": "active",
  "classification": {
    "$in": ["public", "internal"]
  }
}
```

Conceptually:

Usable Memories=Similar Memories∩Authorized Scope∩Valid Records∩Current Task Context\text{Usable Memories} = \text{Similar Memories} \cap \text{Authorized Scope} \cap \text{Valid Records} \cap \text{Current Task Context}Usable Memories=Similar Memories∩Authorized Scope∩Valid Records∩Current Task Context

### Security principle

> Use metadata and policy to define the eligible memory set before semantic ranking or context construction.

The exact order may vary by database and implementation, but unauthorized records must never reach the LLM.

## 8. Types of Semantic Memory

### A. Conversational semantic memory

Stores summaries of previous discussions.

```
"The user previously explored CWD's Coordinator–Delegator–Worker model."
```

Useful for:

* Continuing topics

* Resolving references

* Avoiding repeated explanations

* Maintaining conversation continuity

### B. Project semantic memory

Stores project-specific context.

```
"The CWD project uses Azure AI Search for enterprise retrieval."
```

Useful for:

* Long-running projects

* Architecture decisions

* Technical constraints

* Project terminology

### C. Decision memory

Stores validated decisions and rationale.

```
"Use Service Bus for durable asynchronous agent task delivery."
```

Useful for:

* Preventing repeated design debates

* Maintaining architectural consistency

* Explaining why a decision was made

### D. Task-history memory

Stores summaries of completed tasks.

```
"Previous shipment analysis identified carrier capacity as the probable delay cause."
```

Useful for:

* Follow-up investigations

* Case continuity

* Repeated operational workflows

### E. Preference memory

Stores semantic descriptions of user preferences.

```
"The user prefers detailed, architect-level explanations with code."
```

Useful for:

* Response personalization

* Formatting

* Preferred technologies

* Communication style

### F. Entity and relationship memory

Stores relationships among important entities.

```
"CWD uses LangGraph for orchestration and MCP for enterprise tool integration."
```

Useful for:

* Multi-step reasoning

* Project dependency understanding

* Entity resolution

* Cross-conversation context

## 9. Vector Database Options

Several technologies can support semantic memory.

|
Technology

|

Typical role

|
| --- | --- |
|

PostgreSQL with pgvector

|

Relational data plus vector search

|
|

Azure AI Search

|

Enterprise search, metadata filtering, vector and hybrid retrieval

|
|

Qdrant

|

Dedicated vector database with filtering

|
|

Weaviate

|

Vector database with metadata and hybrid capabilities

|
|

Pinecone

|

Managed vector search

|
|

ChromaDB

|

Lightweight development and application vector storage

|
|

FAISS

|

Local vector similarity indexing, not a complete database by itself

|

### Selection principle

Choose based on:

* Scale

* Filtering requirements

* Multi-tenancy

* Durability

* Availability

* Operational model

* Hybrid search needs

* Integration with existing enterprise systems

* Security and compliance requirements

For CWD, a common pattern is:

```
Redis
   → Fast session and cache layer

PostgreSQL / Cosmos DB
   → Durable structured memory

Vector-capable index
   → Semantic memory retrieval

Azure AI Search
   → Enterprise knowledge retrieval
```

A single platform may support several of these roles, but the responsibilities should remain conceptually separate.

## 10. Vector Memory and Redis

Redis and a vector database can complement each other.

```
New Request
     ↓
Redis
     ├── Recent session context
     ├── Cached semantic-memory results
     └── Active workflow state
     ↓
Vector Database
     ├── Historical memory search
     ├── Project memory search
     └── Semantic similarity retrieval
```

### Example

1. Check Redis for recently retrieved memories.

2. If the cache misses, query the vector database.

3. Apply authorization and metadata filters.

4. Store the approved result in Redis with a short TTL.

5. Use the result in the current workflow.

   Redis = Fast access to recent working context
   Vector Database = Semantic search over stored memory
   Durable Store = Authoritative persistent memory

## 11. Vector Memory and RAG

Semantic memory and RAG use similar retrieval technology but retrieve different kinds of information.

|
Semantic memory

|

Enterprise RAG

|
| --- | --- |
|

Previous conversations and approved continuity

|

Enterprise documents and current knowledge

|
|

User/project-scoped

|

Enterprise-source-scoped

|
|

Often summarizes interaction history

|

Preserves source content and provenance

|
|

Helps maintain continuity

|

Grounds answers in authoritative evidence

|
|

May contain preferences and decisions

|

Contains policies, procedures, manuals, and records

|

### Combined context

```
Current Request
      +
Relevant Persistent Memory
      +
Current Session Context
      +
Authorized RAG Evidence
      +
Current Task State
      +
Governed Prompt
      ↓
LLM Context
```

A memory may tell the agent:

```
"The user is working on the CWD architecture."
```

RAG may provide:

```
"The approved architecture document specifies the retrieval workflow."
```

The memory provides continuity; RAG provides evidence.

## 12. Vector Memory and LangGraph

LangGraph manages the current workflow, while semantic memory provides relevant historical context.

```
LangGraph State
   ├── workflow_id
   ├── current_node
   ├── task_state
   ├── retry_count
   └── memory_references
            │
            ▼
      Memory Retrieval
            │
            ▼
      Vector Database
            │
            ▼
      Relevant Memories
            │
            ▼
      Updated Workflow Context
```

A graph might contain these nodes:

```
START
  ↓
Load Session
  ↓
Retrieve Semantic Memory
  ↓
Validate Memory Scope
  ↓
Merge Relevant Context
  ↓
Plan Task
  ↓
Execute Delegator / Worker
  ↓
Validate Result
  ↓
Propose Memory Update
  ↓
END
```

### Important distinction

LangGraph state answers:

> “What is the current workflow doing?”

Semantic memory answers:

> “What relevant information from previous interactions may help?”

The graph should store memory references or selected summaries rather than copying the entire vector database into workflow state.

## 13. Memory Update and Deletion

Semantic memory must support lifecycle management.

### Update flow

```
New Information
      ↓
Create Memory Proposal
      ↓
Validate and Compare
      ↓
Check Existing Memories
      ↓
Approve or Reject
      ↓
Create New Version
      ↓
Supersede Previous Version
      ↓
Re-embed if Text Changed
      ↓
Update Vector Index
```

If the memory text changes materially, its embedding should generally be regenerated.

### Delete flow

```
Delete Request
      ↓
Identify Memory Record
      ↓
Apply Authorization
      ↓
Mark Deleted / Remove from Index
      ↓
Invalidate Cache
      ↓
Audit Deletion
```

Deletion should cover:

* Durable memory record

* Vector index entry

* Redis cache

* Derived summaries where applicable

* Search indexes

* Backup and retention processes according to policy

## 14. Versioning and Embedding Model Changes

Embedding models can change the vector representation of the same text.

Therefore, store:

JSON

```
{
  "memory_id": "MEM-2001",
  "embedding_model": "embedding-model-v2",
  "embedding_dimensions": 1536,
  "embedding_index_version": "memory-index-2026-09",
  "content_version": 3
}
```

### Why this matters

* Different embedding models may produce incompatible vector spaces.

* A model migration may require re-embedding existing memories.

* Search quality may change after migration.

* Reproducibility requires knowing which model created the vector.

* Old and new indexes may need separate deployment or migration strategies.

### Safe migration pattern

```
Existing Memory Records
       ↓
Generate New Embeddings
       ↓
Build New Vector Index
       ↓
Evaluate Retrieval Quality
       ↓
Switch Read Traffic
       ↓
Retain / Retire Old Index
```

## 15. Example Semantic Memory Retrieval Code

The following example uses a simplified in-memory implementation to demonstrate the retrieval logic. In production, the vector search would be delegated to a real vector database.

Python

Run

```
from dataclasses import dataclass
from typing import Any


@dataclass
class Memory:
    memory_id: str
    text: str
    embedding: list[float]
    subject_id: str
    project_id: str
    memory_type: str
    classification: str
    status: str = "active"


def cosine_similarity(
    query_vector: list[float],
    memory_vector: list[float],
) -> float:
    dot_product = sum(
        q * m
        for q, m in zip(query_vector, memory_vector)
    )

    query_norm = sum(q * q for q in query_vector) ** 0.5
    memory_norm = sum(m * m for m in memory_vector) ** 0.5

    if query_norm == 0 or memory_norm == 0:
        return 0.0

    return dot_product / (query_norm * memory_norm)


def retrieve_semantic_memory(
    query_vector: list[float],
    memories: list[Memory],
    subject_id: str,
    project_id: str,
    top_k: int = 5,
) -> list[dict[str, Any]]:

    candidates = []

    for memory in memories:
        # Scope filtering happens before the memory is used.
        if memory.subject_id != subject_id:
            continue

        if memory.project_id != project_id:
            continue

        if memory.status != "active":
            continue

        if memory.classification not in {"public", "internal"}:
            continue

        score = cosine_similarity(
            query_vector,
            memory.embedding,
        )

        candidates.append({
            "memory": memory,
            "score": score,
        })

    candidates.sort(
        key=lambda item: item["score"],
        reverse=True,
    )

    return candidates[:top_k]
```

### Production retrieval should additionally include

* Trusted identity and entitlement resolution

* Metadata filters

* Vector database ANN search

* Hybrid keyword/vector retrieval

* Reranking

* Duplicate removal

* Confidence and freshness checks

* Memory conflict resolution

* Token budgeting

* Audit logging

* Cache invalidation

* Tenant isolation

## 16. Memory Context Construction

Retrieved memories should not be inserted into the prompt without processing.

Python

Run

```
def build_memory_context(
    retrieved_memories: list[dict[str, Any]],
    max_items: int = 5,
) -> list[dict[str, Any]]:

    context = []

    for item in retrieved_memories[:max_items]:
        memory = item["memory"]

        context.append({
            "memory_id": memory.memory_id,
            "text": memory.text,
            "similarity": round(item["score"], 4),
            "source": "persistent_memory",
            "classification": memory.classification,
        })

    return context
```

The final LLM context should clearly distinguish memory from authoritative evidence:

```
[Persistent Memory]
This is historical context and may require validation.

[Enterprise Evidence]
This is retrieved from an authorized authoritative source.

[Current Task]
This is the current request and execution context.
```

This separation helps prevent the model from treating old memories as current business facts.

## 17. Governance Controls

Semantic memory requires the same governance principles as other enterprise data.

### Access control

* Restrict by user, tenant, project, domain, and agent.

* Enforce both user and workload identity.

* Apply role and attribute-based policies.

* Do not rely on vector similarity for authorization.

### Data quality

* Store only validated information.

* Track confidence and provenance.

* Mark inferred information as provisional.

* Detect contradictions.

* Prefer current authoritative sources for business facts.

### Privacy and retention

* Minimize stored content.

* Avoid unnecessary sensitive information.

* Apply classification and retention rules.

* Support user review and deletion.

* Expire temporary or obsolete memories.

* Protect embeddings and metadata as sensitive data where appropriate.

### Prompt-injection defense

Retrieved memories are data, not instructions.

A malicious or incorrect memory should not be able to:

* Authorize a tool call

* Override system instructions

* Grant access to restricted information

* Change security policy

* Cause an external action without independent validation

### Auditability

Record:

* Memory creation

* Source and provenance

* Retrieval event

* Requesting agent

* User and tenant scope

* Policy decision

* Update or deletion

* Embedding model version

* Index version

## 18. Common Anti-Patterns

### 1. Embedding every conversation message

Problem: Creates noisy, redundant, and expensive memory.

Better: Extract meaningful summaries or approved memory units.

### 2. Using vector similarity as authorization

Problem: Similarity does not indicate permission.

Better: Apply identity, scope, ACL, and policy filters.

### 3. Storing only vectors

Problem: The agent cannot interpret, trace, or govern the result.

Better: Store text, metadata, provenance, and lifecycle information.

### 4. Treating old memory as current truth

Problem: Business rules and project details can become stale.

Better: Validate against current authoritative sources.

### 5. Sending all retrieved memories to the LLM

Problem: Causes context noise, token cost, and irrelevant responses.

Better: Rank, deduplicate, filter, and select a bounded context.

### 6. Mixing embedding models without version control

Problem: Search quality becomes inconsistent.

Better: Track model and index versions and re-embed during migration.

### 7. Sharing user memory across tenants

Problem: Creates a serious data-isolation failure.

Better: Enforce tenant and subject scope at every retrieval path.

### 8. Allowing agents to overwrite memory freely

Problem: Incorrect observations become permanent facts.

Better: Use proposals, validation, approval, and versioning.

### 9. Using semantic memory instead of RAG

Problem: Historical memory may not be the authoritative source for current enterprise information.

Better: Use semantic memory for continuity and RAG for current governed evidence.

## 19. Evaluation Metrics

### Retrieval quality

* Recall@K

* Precision@K

* Mean Reciprocal Rank

* NDCG

* Semantic relevance

* Metadata-filter correctness

* Authorization-filter correctness

### Memory quality

* Memory usefulness

* Duplicate rate

* Conflict rate

* Stale-memory rate

* User correction rate

* False-memory rate

* Memory acceptance rate

### System quality

* Retrieval latency

* Embedding latency

* Indexing latency

* Token contribution

* Cache hit rate

* Storage cost

* Unauthorized retrieval attempts

* Deletion compliance

### End-to-end quality

* Task continuation success

* Reduction in repeated questions

* Answer relevance

* Groundedness

* User satisfaction

* Incorrect personalization rate

## 20. End-to-End CWD Example

### Scenario

A user asks:

> “Continue our previous discussion about the CWD retrieval architecture.”

```
1. Gateway authenticates the user.
       ↓
2. Coordinator creates correlation_id and workflow_id.
       ↓
3. Coordinator identifies the intent:
   continue_previous_project
       ↓
4. Memory Service creates a query representation.
       ↓
5. Vector database retrieves semantically similar memories.
       ↓
6. Metadata filters restrict results to the correct user/project.
       ↓
7. Policy checks authorization and classification.
       ↓
8. Memory results are ranked and deduplicated.
       ↓
9. Coordinator merges selected memories with current session context.
       ↓
10. Delegator receives a scoped CWD context projection.
       ↓
11. RAG Worker retrieves current authoritative architecture evidence.
       ↓
12. Worker validates memory against current evidence.
       ↓
13. LangGraph coordinates the workflow.
       ↓
14. Coordinator generates the response.
       ↓
15. New approved decisions may be proposed as future memories.
```

### Result

The agent can continue the discussion naturally without assuming that historical memory is automatically authoritative.

## 21. Core Architectural Formula

Semantic Memory=Memory Extraction+Embedding+Vector Storage+Metadata+Semantic Retrieval+Authorization+Validation+Context Selection+Lifecycle Governance\boxed{ Semantic\ Memory = Memory\ Extraction + Embedding + Vector\ Storage + Metadata + Semantic\ Retrieval + Authorization + Validation + Context\ Selection + Lifecycle\ Governance }Semantic Memory=Memory Extraction+Embedding+Vector Storage+Metadata+Semantic Retrieval+Authorization+Validation+Context Selection+Lifecycle Governance

For safe retrieval:

Usable Semantic Memory=Semantically Relevant∩Authorized∩Valid∩Current Enough∩Task Relevant\boxed{ Usable\ Semantic\ Memory = Semantically\ Relevant \cap Authorized \cap Valid \cap Current\ Enough \cap Task\ Relevant }Usable Semantic Memory=Semantically Relevant∩Authorized∩Valid∩Current Enough∩Task Relevant

## Interview-Ready Answer

> In CWD, vector databases support semantic memory by storing embeddings of selected conversation summaries, project context, approved decisions, and historical information along with metadata such as user, tenant, project, classification, provenance, confidence, and expiration. When a new request arrives, the system embeds the query and performs semantic similarity search to retrieve memories that are conceptually related, even when the wording differs. Metadata filters and IAM policies then restrict the results to the correct user, project, tenant, and security scope. The Coordinator uses the selected memories as bounded context, while LangGraph manages the current workflow state. Redis can cache frequently used memory results, and durable storage remains the authoritative source for persistent memory. Vector similarity improves recall, but it does not establish truth or authorization, so validation, freshness checks, governance, and auditability remain essential.

## Final Definition

A vector database provides semantic memory in CWD by storing embeddings of selected conversations, project context, historical interactions, and approved decisions together with metadata, provenance, and access controls, then retrieving semantically similar memories for future agent requests. The retrieved memories are filtered, validated, ranked, deduplicated, and assembled into bounded context so that agents can maintain continuity without treating historical similarity as authorization or authoritative truth.

### Mental model

```
Memory Text
    ↓
Embedding Model
    ↓
Vector Database
    ↓
Semantic Search
    ↓
Metadata + Authorization
    ↓
Relevant Memory
    ↓
Context Assembly
    ↓
Coordinator / Delegator / Worker
```

> Vector memory answers: “What previous information is conceptually related to the current request?” Policy answers: “May this memory be used?” RAG answers: “What current authoritative enterprise evidence supports the answer?”
