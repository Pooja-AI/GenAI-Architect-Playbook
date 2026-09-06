# CWD Architecture Layers

## 1. Architecture Layer Model

The CWD architecture is organized into the following logical layers:

```text
┌──────────────────────────────────────────────────────────────┐
│  Layer 1 — Experience Layer                                 │
│  Teams • Web UI • Microsoft 365                             │
├──────────────────────────────────────────────────────────────┤
│  Layer 2 — API & Integration Layer                          │
│  API Gateway • WebSocket • Enterprise Integrations          │
├──────────────────────────────────────────────────────────────┤
│  Layer 3 — Orchestration Layer                              │
│  Coordinator • Delegators • Workflow Management             │
├──────────────────────────────────────────────────────────────┤
│  Layer 4 — Agent Execution Layer                            │
│  Workers • A2A • MCP • Tools • Agent Workflows              │
├──────────────────────────────────────────────────────────────┤
│  Layer 5 — Knowledge & Data Layer                            │
│  RAG • Azure AI Search • Enterprise Data Sources            │
├──────────────────────────────────────────────────────────────┤
│  Layer 6 — Platform Services Layer                          │
│  Agent Registry • Prompt Registry • Memory • Messaging       │
├──────────────────────────────────────────────────────────────┤
│  Layer 7 — Enterprise Systems Layer                         │
│  Salesforce • Snowflake • Oracle • SharePoint • M365        │
└──────────────────────────────────────────────────────────────┘

      Security • Governance • Observability
             ↓ Cross-Cutting Across All Layers
```

---

## 2. Layer 1 — Experience Layer

### Purpose

Provides the interface through which business users interact with CWD.

### Components

* Microsoft Teams
* Web applications
* Microsoft 365 experiences

### Responsibility

The Experience Layer captures the user's **business objective** and presents the final business outcome.

```text
Business User
     │
     ▼
Teams / Web / M365
     │
     ▼
Business Request
```

### Example

> "Prepare a customer briefing for tomorrow's meeting."

The user does not need to know which agent or enterprise system will execute the request.

---

## 3. Layer 2 — API & Integration Layer

### Purpose

Provides the controlled communication boundary between the user experience and the CWD platform.

### Components

* API Gateway
* WebSocket communication
* Authentication
* Request validation
* Integration interfaces
* Session and correlation handling

### Responsibility

```text
Experience
    │
    ▼
API / Gateway
    │
    ├── Authenticate
    ├── Validate
    ├── Establish Context
    └── Route Request
    │
    ▼
CWD
```

This layer prevents direct access from the user interface to internal agents and enterprise systems.

---

## 4. Layer 3 — Orchestration Layer

### This is the Core CWD Layer

The orchestration layer implements the **Coordinator–Delegator model**.

```text
                  Coordinator
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Sales          Finance        HR
    Delegator       Delegator    Delegator
          │            │            │
          ▼            ▼            ▼
       Workers      Workers      Workers
```

### Coordinator

Responsible for the overall business request.

* Intent understanding
* Planning
* Routing
* Agent selection
* Workflow coordination
* Result aggregation
* Retry and recovery
* Overall execution context

### Delegator

Responsible for domain-level execution.

* Domain understanding
* Task decomposition
* Worker selection
* Domain policy enforcement
* Domain workflow coordination

### Architectural Principle

> **The Coordinator manages the enterprise objective; the Delegator manages the domain objective.**

This separation allows the platform to scale across business domains without creating a single monolithic agent.

---

## 5. Layer 4 — Agent Execution Layer

### Purpose

Performs the actual business tasks defined by the orchestration layer.

### Components

* Workers
* A2A communication
* MCP
* Tool calling
* APIs
* Business workflows
* Validation
* Retry / recovery
* Human escalation

```text
Delegator
    │
    ▼
Worker
    │
    ├── A2A
    ├── MCP
    ├── Tools
    ├── APIs
    └── Workflows
    │
    ▼
Enterprise Capability
```

### Worker Responsibility

Workers perform specialized operations such as:

* Retrieve customer information
* Query business data
* Perform calculations
* Analyze information
* Generate business artifacts
* Execute approved business operations

The Worker is the **execution unit** of the CWD architecture.

---

## 6. Layer 5 — Knowledge & Data Layer

### Purpose

Provides agents with governed access to enterprise knowledge and information.

This layer has two major paths.

### Knowledge / RAG

```text
Enterprise Knowledge
        │
        ▼
   Ingestion
        │
        ▼
Metadata / Classification
        │
        ▼
Azure AI Search
        │
        ▼
Scoped Retrieval
        │
        ▼
Agent Context
```

### Enterprise Data

```text
Worker
  │
  ▼
Governed Tool / API
  │
  ├── Salesforce
  ├── Snowflake
  ├── Oracle
  ├── SharePoint
  └── Microsoft 365
```

### Key Principle

Agents should not receive unrestricted access to enterprise information.

Access is performed through governed retrieval, tools, APIs, and connectors.

---

## 7. Layer 6 — Platform Services Layer

### Purpose

Provides reusable services shared by all agents and business domains.

```text
┌────────────────────────────────────────────────────┐
│              CWD PLATFORM SERVICES                │
│                                                    │
│ Agent Registry       → Agent discovery             │
│ Prompt Registry      → Prompt lifecycle            │
│ Memory               → Context / state              │
│ Messaging            → Async communication         │
│ Configuration        → Runtime configuration       │
│ Evaluation           → Agent quality               │
└────────────────────────────────────────────────────┘
```

### Agent Registry

Maintains agent capability and runtime metadata.

```text
Agent Registry
     │
     ├── Sales Agent
     ├── Finance Agent
     ├── HR Agent
     └── Knowledge Agent
```

### Prompt Registry

Provides centralized prompt management:

* Versioning
* Approval
* Ownership
* Lifecycle management
* Auditability

### Memory

Supports conversational and workflow state using services such as:

* Redis
* Cosmos DB
* Vector storage where appropriate

### Messaging

Supports distributed and asynchronous agent execution using messaging infrastructure such as:

* Azure Service Bus
* Kafka

---

## 8. Layer 7 — Enterprise Systems Layer

### Purpose

Contains the systems of record and enterprise business capabilities that CWD agents interact with.

```text
                    CWD
                     │
              Governed Access
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
    Salesforce    Snowflake     Oracle
        │            │            │
        └────────────┼────────────┘
                     │
             SharePoint / M365
```

These systems remain the **systems of record**.

CWD does not replace them.

Instead, CWD provides an intelligent orchestration layer over the existing enterprise ecosystem.

---

## 9. Cross-Cutting Layer — Security & Governance

Security and governance are not isolated to one layer.

They operate across the entire architecture.

```text
┌──────────────────────────────────────────────────────────────┐
│              SECURITY & GOVERNANCE                            │
│                                                              │
│ Entra ID • RBAC • Managed Identity • Entitlements            │
│ Key Vault • DLP • Redaction • Validation • Audit             │
│ Private Networking • Data Governance                          │
└──────────────────────────────────────────────────────────────┘
          ↓              ↓              ↓
     Experience    Orchestration    Enterprise Data
```

### Key principle

> **Security follows the request through the complete agent execution path.**

Authorization must be validated before protected enterprise data is accessed.

---

## 10. Cross-Cutting Layer — Observability

Observability also spans all architecture layers.

```text
User Request
     │
     ▼
Gateway
     │
     ▼
Coordinator
     │
     ▼
Delegator
     │
     ▼
Worker
     │
     ▼
Tool
     │
     ▼
Enterprise System
```

CWD maintains execution context using:

```text
Session ID
    ↓
Task ID
    ↓
Run ID
    ↓
Turn ID
    ↓
Step ID
```

Observability can use:

* MLflow
* Application Insights
* Log Analytics
* SIEM integration

Key operational metrics include:

* Latency
* Error rate
* Agent success rate
* Tool success rate
* Token consumption
* Cost
* Retry rate
* Workflow completion
* Retrieval performance

---

## 11. Complete Layered Architecture

```text
                         BUSINESS USERS
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│ L1  EXPERIENCE                                                │
│      Teams • Web • Microsoft 365                             │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ L2  API & INTEGRATION                                         │
│      Gateway • Authentication • WebSocket • Routing          │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ L3  ORCHESTRATION                                             │
│      Coordinator                                               │
│           │                                                    │
│      Delegators                                                │
└──────────────────────────────┬───────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────┐
│ L4  AGENT EXECUTION                                           │
│      Workers • A2A • MCP • Tools • APIs • Workflows           │
└──────────────────────────────┬───────────────────────────────┘
                               │
                     ┌─────────┴─────────┐
                     ▼                   ▼
┌────────────────────────────┐ ┌────────────────────────────────┐
│ L5  KNOWLEDGE & DATA       │ │ L7  ENTERPRISE SYSTEMS         │
│                            │ │                                │
│ RAG                        │ │ Salesforce                     │
│ Azure AI Search            │ │ Snowflake                      │
│ Enterprise Knowledge      │ │ Oracle                         │
│                            │ │ SharePoint / M365              │
└────────────────────────────┘ └────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ L6  PLATFORM SERVICES                                         │
│      Agent Registry • Prompt Registry • Memory               │
│      Messaging • Configuration • Evaluation                  │
└──────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────┐
│ CROSS-CUTTING                                                  │
│                                                              │
│ Security • Governance • Observability • Audit • Compliance   │
└──────────────────────────────────────────────────────────────┘
```

## 12. Layer Responsibility Summary

| Layer | Primary Responsibility | Key Components |
| --- | --- | --- |
| L1 Experience | User interaction | Teams, Web, M365 |
| L2 API & Integration | Secure entry and connectivity | Gateway, APIs, WebSocket |
| L3 Orchestration | Coordinate business objectives | Coordinator, Delegators |
| L4 Agent Execution | Execute specialized tasks | Workers, A2A, MCP, Tools |
| L5 Knowledge & Data | Provide governed knowledge | RAG, Azure AI Search |
| L6 Platform Services | Shared agent capabilities | Registry, Prompt, Memory, Messaging |
| L7 Enterprise Systems | Systems of record | Salesforce, Snowflake, Oracle, M365 |
| Cross-Cutting | Protect and operate platform | Security, Governance, Observability |

## 13. Architectural Flow

The architecture can ultimately be understood as:

```text
BUSINESS OBJECTIVE
       │
       ▼
   EXPERIENCE
       │
       ▼
     GATEWAY
       │
       ▼
  COORDINATOR
       │
       ▼
   DELEGATOR
       │
       ▼
     WORKER
       │
       ├──────────► RAG / KNOWLEDGE
       │
       ├──────────► TOOLS / APIs
       │
       └──────────► ENTERPRISE SYSTEMS
                       │
                       ▼
                BUSINESS OUTCOME
```

With **Security, Governance, Observability, Memory, Messaging, Agent Registry, and Prompt Registry** operating across the complete lifecycle.

## Architect's View

The most important architectural separation is:

> **Experience handles interaction, Gateway handles access, Coordinator handles enterprise orchestration, Delegator handles domain orchestration, Worker handles execution, Data/Knowledge provides information, and Enterprise Systems provide the underlying business capabilities.**

This layered architecture allows CWD to remain **modular, reusable, secure, observable, and scalable as the number of agents and business domains grows**.




# Where Does the LLM Fit in CWD Architecture?

## 1. LLM Position in the Architecture

The LLM is an **intelligence component used by the Coordinator, Delegators, and Workers**.

It is not itself the orchestration platform.

```text
                         BUSINESS USER
                              │
                              ▼
                    ┌──────────────────┐
                    │ EXPERIENCE LAYER │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ API / GATEWAY    │
                    └────────┬─────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 CWD ORCHESTRATION LAYER                    │
│                                                             │
│                      COORDINATOR                            │
│                          │                                  │
│                     ┌────┴────┐                             │
│                     │   LLM   │                             │
│                     └────┬────┘                             │
│                          │                                  │
│              Planning • Reasoning • Routing                │
│                          │                                  │
│             ┌────────────┼────────────┐                     │
│             ▼            ▼            ▼                     │
│        Delegator     Delegator    Delegator                 │
│            │            │            │                       │
│           LLM          LLM          LLM                     │
│            │            │            │                       │
└────────────┼────────────┼────────────┼──────────────────────┘
             │            │            │
             ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────┐
│                  AGENT EXECUTION LAYER                      │
│                                                             │
│        Worker          Worker          Worker                │
│          │               │               │                  │
│         LLM             LLM             LLM                  │
│          │               │               │                  │
│    Reason / Decide   Reason / Decide   Reason / Decide      │
│          │               │               │                  │
│          ▼               ▼               ▼                  │
│       Tools / APIs / MCP / A2A / Workflows                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
                    Enterprise Systems
```

---

## 2. LLM Inside the Coordinator

The Coordinator can use an LLM for **enterprise-level reasoning**.

Its role is to understand:

> "What is the user trying to accomplish?"

The LLM can support:

* Intent understanding
* Request classification
* Planning
* Task decomposition
* Capability selection
* Routing decisions
* Result interpretation
* Response synthesis

Example:

```text
User:
"Prepare a customer briefing for tomorrow."

             ↓

        Coordinator
             │
             ▼
           LLM
             │
             ├── Understand intent
             ├── Identify customer
             ├── Determine required capabilities
             └── Create execution plan
             │
             ▼
       Sales Delegator
```

The Coordinator LLM is therefore focused on **global orchestration**.

---

## 3. LLM Inside the Delegator

A Delegator may use an LLM for **domain-level reasoning**.

For example:

```text
              Sales Delegator
                     │
                     ▼
                    LLM
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
   Customer Data   Opportunity   Interaction
      Worker         Worker        Worker
```

The Sales Delegator LLM understands the sales-domain requirement and determines which Workers are required.

Its responsibility is:

> **"How should this business-domain problem be executed?"**

---

## 4. LLM Inside the Worker

Workers may also use an LLM, depending on the capability being implemented.

The Worker LLM is focused on **task-level reasoning**.

```text
Worker
  │
  ▼
 LLM
  │
  ├── Understand task
  ├── Determine required tool
  ├── Build tool input
  ├── Interpret tool result
  ├── Validate result
  └── Generate structured output
  │
  ▼
Tool / API / RAG
```

For example, a Customer Briefing Worker may use an LLM to analyze retrieved customer information and generate the briefing.

---

## 5. LLM + Tools

One of the most important CWD concepts is:

> **The LLM reasons; the tools execute.**

```text
                 LLM
                  │
          "I need customer data"
                  │
                  ▼
             Tool Selection
                  │
                  ▼
             CRM Tool
                  │
                  ▼
             Salesforce
                  │
                  ▼
             Tool Result
                  │
                  ▼
                 LLM
                  │
             Analyze Result
```

The LLM should not directly connect to Salesforce, Snowflake, Oracle, etc.

Instead:

```text
LLM
 │
 ▼
Governed Tool / API
 │
 ▼
Enterprise System
```

This is important for security, authorization, auditability, and predictable enterprise execution.

---

## 6. LLM + RAG

The LLM also works with the Knowledge/RAG layer.

```text
                  User Request
                       │
                       ▼
                      LLM
                       │
                 Need knowledge
                       │
                       ▼
                 Retrieval Layer
                       │
                       ▼
                Azure AI Search
                       │
                       ▼
                Relevant Context
                       │
                       ▼
                      LLM
                       │
                       ▼
                  Final Response
```

The LLM is responsible for **reasoning over the retrieved context**.

Azure AI Search is responsible for **retrieval**.

This separation is architecturally important.

---

## 7. LLM + Memory

LLMs are stateless by themselves.

CWD therefore uses memory/state services to provide relevant context.

```text
Conversation / Workflow
          │
          ▼
       Memory
          │
          ▼
      Relevant Context
          │
          ▼
         LLM
          │
          ▼
    Agent Decision
```

For example:

```text
Session
   │
   ▼
Task Context
   │
   ▼
Previous Results
   │
   ▼
LLM
```

Memory is therefore a **supporting platform capability**, while the LLM is the reasoning engine.

---

## 8. LLM + Prompt Registry

The prompt used by an agent should be managed independently from the LLM.

```text
             Prompt Registry
                    │
             Approved Prompt
                    │
                    ▼
              Agent / Worker
                    │
                    ▼
                   LLM
                    │
                    ▼
                 Result
```

This allows CWD to control:

* Prompt version
* Prompt ownership
* Prompt approval
* Prompt lifecycle
* Model selection
* Agent behavior

---

## 9. Model Layer

From an architecture perspective, it is useful to distinguish the **LLM runtime/model layer** from the agents.

```text
                    Agent
                      │
                Prompt + Context
                      │
                      ▼
                Model Gateway
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        GPT          Claude      Gemini
          │           │           │
          └───────────┼───────────┘
                      │
                      ▼
                 LLM Response
```

The exact model can be selected according to:

* Business use case
* Reasoning requirement
* Latency
* Cost
* Context window
* Security requirements
* Quality
* Availability

This gives CWD **model flexibility** rather than hard-coding the entire platform to one LLM.

---

## 10. Updated CWD Architecture Layers

Therefore, I would refine the previous layer model to explicitly show the LLM as part of the AI execution architecture:

```text
┌──────────────────────────────────────────────────────────────┐
│ L1  EXPERIENCE                                               │
│     Teams • Web • Microsoft 365                             │
├──────────────────────────────────────────────────────────────┤
│ L2  API & INTEGRATION                                        │
│     Gateway • Authentication • WebSocket                    │
├──────────────────────────────────────────────────────────────┤
│ L3  ORCHESTRATION                                            │
│     Coordinator                                               │
│        │                                                      │
│        └── LLM → Intent • Planning • Routing                 │
│                                                               │
│     Delegators                                                │
│        │                                                      │
│        └── LLM → Domain Reasoning • Task Decomposition       │
├──────────────────────────────────────────────────────────────┤
│ L4  AGENT EXECUTION                                          │
│     Workers                                                   │
│        │                                                      │
│        └── LLM → Task Reasoning • Tool Selection              │
│                                                               │
│     A2A • MCP • Tools • APIs • Workflows                     │
├──────────────────────────────────────────────────────────────┤
│ L5  KNOWLEDGE & DATA                                         │
│     RAG • Azure AI Search • Enterprise Knowledge             │
├──────────────────────────────────────────────────────────────┤
│ L6  PLATFORM SERVICES                                        │
│     Agent Registry • Prompt Registry • Memory • Messaging    │
├──────────────────────────────────────────────────────────────┤
│ L7  ENTERPRISE SYSTEMS                                       │
│     Salesforce • Snowflake • Oracle • SharePoint • M365      │
└──────────────────────────────────────────────────────────────┘

      Security • Governance • Observability
                 ↓
        Across All Layers
```

## 11. The Key Architectural Relationship

The cleanest way to explain CWD is:

```text
                  ┌────────────────┐
                  │      LLM       │
                  │  Intelligence  │
                  └───────┬────────┘
                          │
                 Reason / Plan / Decide
                          │
                          ▼
                  ┌────────────────┐
                  │     AGENT      │
                  │  Role & Logic  │
                  └───────┬────────┘
                          │
                 Execute / Delegate
                          │
                          ▼
                  ┌────────────────┐
                  │     TOOL       │
                  │   Capability   │
                  └───────┬────────┘
                          │
                          ▼
                  Enterprise System
```

So:

**LLM = Intelligence**

**Agent = Business capability + reasoning logic**

**Coordinator = Enterprise orchestration**

**Delegator = Domain orchestration**

**Worker = Task execution**

**Tool/API = Controlled enterprise action**

**Enterprise System = Source of truth**

---

## 12. Architect's Recommendation

For the CWD architecture diagram, I would **not create "LLM" as an independent layer alongside Coordinator, Delegator, and Worker**.

Instead, show the LLM **inside the agent components**:

```text
                 CWD ORCHESTRATION
                        │
              ┌─────────┴─────────┐
              │                   │
        Coordinator           Delegator
           + LLM                + LLM
                                  │
                                  ▼
                              Worker
                              + LLM
                                  │
                                  ▼
                         Tools / RAG / APIs
                                  │
                                  ▼
                       Enterprise Systems
```

This makes the architecture much more accurate because **CWD is the orchestration platform, while LLMs are the intelligence engines used by the agents operating within that platform**.