# Microsoft Teams Integration with CWD

Microsoft Teams can act as the **conversational front end** for CWD, allowing employees to interact with the Coordinator using natural language instead of opening a separate application.

### Mental model

> **Teams = conversational UI → CWD Coordinator = intelligence/orchestration → Delegators = domain routing → Workers = execution → Enterprise systems = business data/actions**

---

## 1. Where Teams fits in CWD

```text
Employee
   ↓
Microsoft Teams
   ↓
Teams Bot / Teams App
   ↓
Azure Bot / API Layer
   ↓
Azure API Management
   ↓
CWD Coordinator
   ↓
Delegator
   ↓
Specialized Workers
   ↓
MCP / APIs / RAG / Enterprise Systems
   ↓
Result
   ↓
Teams
```

For example:

> **User:** "Why did equipment EQ-102 fail?"

Teams sends the message to CWD.

```text
Teams
  ↓
Coordinator
  ↓
Equipment & Maintenance Delegator
  ↓
 ┌─────────────────────────┐
 │ Alarm Worker             │
 │ Equipment Health Worker  │
 │ Maintenance Worker       │
 │ Historical RAG Worker    │
 └─────────────────────────┘
  ↓
RCA
  ↓
Coordinator
  ↓
Teams response
```

---

# 2. Microsoft Teams App

You can package CWD as a **Teams application**.

The Teams app can provide:

* Conversational interface
* Bot
* Tabs
* Adaptive Cards
* Notifications
* Authentication
* Links to CWD web UI
* Approvals/actions

A user could simply open:

```text
Teams
 └── CWD Enterprise Assistant
```

and start chatting.

---

# 3. Teams Bot

The bot is the conversational entry point.

Example:

```text
User
 ↓
Teams
 ↓
CWD Bot
 ↓
Coordinator
```

The bot receives:

```json
{
  "user": "employee123",
  "message": "Why is lot L1234 on hold?"
}
```

The bot forwards the request to the CWD Coordinator.

The Coordinator then performs the actual AI orchestration.

### Important architecture principle

The Teams bot should **not become the Coordinator**.

Instead:

```text
Teams Bot
   ↓
CWD Coordinator
```

The bot handles conversational interaction, while the Coordinator handles agent orchestration.

---

# 4. Authentication

For an enterprise Teams application, users are normally authenticated using **Microsoft Entra ID**.

Conceptually:

```text
Employee
   ↓
Microsoft Teams
   ↓
Entra ID
   ↓
User Identity / Token
   ↓
CWD
```

The identity can be used to determine:

* Who is the user?
* Which department do they belong to?
* Which applications can they access?
* Which data can they retrieve?
* Which actions can they perform?

For example:

```text
User: Pooja
Department: Quality
Groups:
  QUALITY_ENGINEERING
  FAILURE_ANALYSIS
```

The CWD system can use these entitlements when retrieving enterprise information.

---

# 5. Authentication vs Authorization

This is very important in interviews.

### Authentication

> **Who are you?**

Entra ID verifies the user's identity.

### Authorization

> **What are you allowed to access or do?**

CWD checks:

```text
User Identity
      ↓
Groups / Roles
      ↓
Entitlements
      ↓
Policy
      ↓
Data / Tool Access
```

For example:

```text
Quality Engineer
       ↓
Allowed:
  Failure Analysis
  Quality Reports
  Manufacturing Data

Not Allowed:
  HR Data
  Salary Information
```

### Critical principle

> **Never rely on the LLM to enforce authorization.**

Authorization should be enforced by the application, API, data layer and enterprise systems.

---

# 6. Passing User Identity Through CWD

A strong enterprise design propagates identity/context.

```text
Teams
 ↓
User Identity
 ↓
CWD Gateway
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Enterprise API
```

The execution context can contain:

```json
{
  "userId": "user123",
  "sessionId": "S1001",
  "taskId": "T2001",
  "runId": "R3001",
  "correlationId": "C4001"
}
```

This allows CWD to answer:

> Who requested this action?

> Which agent performed it?

> Which Worker called the tool?

> Which enterprise API was accessed?

---

# 7. Conversational Workflow

Suppose the user asks in Teams:

> "Analyze the failure of EQ-102 and create a ServiceNow ticket if the failure is confirmed."

### Step 1 — Teams

User sends the message.

```text
Teams
 ↓
CWD Bot
```

### Step 2 — Authentication

Entra ID identifies the user.

```text
Teams → Entra ID → Identity
```

### Step 3 — Gateway

Request reaches the CWD API layer.

```text
Teams
 ↓
Bot/API
 ↓
APIM
```

APIM can enforce:

* Authentication
* Authorization
* Rate limits
* Request validation
* Logging
* Correlation ID

### Step 4 — Coordinator

Coordinator understands:

```text
Intent:
  Equipment Failure Analysis

Requested actions:
  1. Analyze failure
  2. Confirm failure
  3. Create ServiceNow ticket if confirmed
```

### Step 5 — Delegator

```text
Coordinator
 ↓
Equipment & Maintenance Delegator
```

### Step 6 — Workers

```text
Equipment Worker
     ↓
Equipment API

Alarm Worker
     ↓
Alarm API

Historical RAG Worker
     ↓
Azure AI Search

RCA Worker
     ↓
Analyze evidence

ServiceNow Worker
     ↓
ServiceNow API
```

### Step 7 — Policy

Before creating the ticket:

```text
ServiceNow Worker
       ↓
Authorization / Policy
       ↓
Is user allowed to create ticket?
       ↓
Yes
       ↓
Create ticket
```

### Step 8 — Teams response

The result is returned to Teams.

```text
CWD
 ↓
Teams Bot
 ↓
User
```

Example:

> **Equipment EQ-102 Failure Analysis**
>
> Probable cause: cooling-system anomaly
> Confidence: 91%
> Similar historical incidents: 3
> Recommended action: inspect cooling subsystem
> ServiceNow ticket: INC0012345

---

# 8. Adaptive Cards

This is one of the most important Teams integration concepts.

Instead of returning only text, CWD can return **Adaptive Cards**.

For example:

```text
┌─────────────────────────────────────┐
│ Equipment Failure Analysis           │
│                                     │
│ Equipment: EQ-102                   │
│ Failure: Cooling anomaly            │
│ Confidence: 91%                     │
│                                     │
│ [View Analysis] [Create Ticket]     │
└─────────────────────────────────────┘
```

Adaptive Cards provide structured UI inside Teams.

They can contain:

* Text
* Tables
* Facts
* Images
* Buttons
* Inputs
* Links
* Actions

---

# 9. Adaptive Card + Human Approval

This is particularly useful for **high-risk agent actions**.

Example:

```text
CWD
 ↓
RCA Worker
 ↓
ServiceNow Worker
 ↓
Policy
 ↓
Human Approval Required
 ↓
Teams Adaptive Card
```

Teams displays:

```text
┌──────────────────────────────────────┐
│ ServiceNow Ticket Request            │
│                                      │
│ Equipment: EQ-102                    │
│ Severity: High                       │
│ Root Cause: Cooling failure          │
│                                      │
│ [Approve]       [Reject]             │
└──────────────────────────────────────┘
```

User clicks **Approve**.

```text
Teams
 ↓
Approval
 ↓
CWD
 ↓
ServiceNow Worker
 ↓
ServiceNow
```

This creates a strong **human-in-the-loop** architecture.

---

# 10. Why Adaptive Cards are useful for Agentic AI

Agents should not blindly perform high-impact actions.

For example:

### Low risk

```text
Search equipment status
       ↓
Automatically execute
```

### Medium risk

```text
Generate report
       ↓
Automatically execute
```

### High risk

```text
Create/change business record
       ↓
Policy check
       ↓
Human approval
       ↓
Execute
```

Teams Adaptive Cards provide a convenient approval interface.

---

# 11. Teams + CWD Notifications

CWD can also proactively notify users.

Example:

```text
Equipment Failure Detected
        ↓
Event Grid
        ↓
CWD Workflow
        ↓
RCA
        ↓
Teams Notification
```

Teams message:

> ⚠️ **Equipment EQ-102 failure detected**
>
> Preliminary analysis indicates a cooling-system anomaly.
>
> **Affected production lots:** 4
> **Risk:** High
> **Recommended action:** Maintenance inspection

The user can click:

```text
[View Analysis]
[View Similar Cases]
[Create Ticket]
```

---

# 12. Teams + Agentic RAG

Teams can also be the interface for enterprise RAG.

User:

> "Show me previous failures similar to this defect."

Flow:

```text
Teams
 ↓
CWD Coordinator
 ↓
Quality Delegator
 ↓
RAG Worker
 ↓
Azure AI Search
 ↓
Hybrid Search
 ↓
ACL Filtering
 ↓
Semantic Ranking
 ↓
Historical Failure Reports
 ↓
LLM
 ↓
Teams
```

The response can contain citations:

```text
Similar failures:

1. FA-2026-104
   Root Cause: Process contamination

2. FA-2026-087
   Root Cause: Equipment temperature excursion

3. FA-2025-221
   Root Cause: Material variation
```

---

# 13. Teams + Multimodal AI

Teams can also be useful for image-based CWD workflows.

For example, a quality engineer sends a defect image.

```text
Teams
 ↓
CWD
 ↓
Quality/FA Delegator
 ↓
Image Analysis Worker
 ↓
Vision Model
 ↓
Historical RAG
 ↓
RCA Worker
 ↓
Teams
```

Result:

```text
Defect Classification:
  Surface contamination

Confidence:
  94%

Similar historical cases:
  5

Probable cause:
  Process contamination

Recommended action:
  Inspect process step X
```

---

# 14. Teams + MCP

Teams itself doesn't replace MCP.

The architecture remains:

```text
Teams
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Enterprise Tool
```

For example:

```text
Teams
 ↓
Equipment Worker
 ↓
Equipment MCP Server
 ↓
get_equipment_status()
 ↓
Equipment API
```

So:

> **Teams = user interface**

> **CWD = orchestration**

> **MCP = agent-to-tool interface**

---

# 15. Teams + ServiceNow

A very strong enterprise example:

```text
Teams
 ↓
CWD Coordinator
 ↓
IT Delegator
 ↓
ServiceNow Worker
 ↓
ServiceNow MCP Server
 ↓
APIM
 ↓
ServiceNow API
```

For a write operation:

```text
ServiceNow Worker
 ↓
Policy Check
 ↓
Human Approval
 ↓
Teams Adaptive Card
 ↓
Approve
 ↓
ServiceNow API
```

This combines:

**Teams + CWD + MCP + APIM + ServiceNow + Human-in-the-loop**

which is a very strong Solution Architect interview scenario.

---

# 16. Teams + Azure Services

A possible Azure architecture:

```text
                  Microsoft Teams
                         │
                         ▼
                  Teams Application
                         │
                         ▼
                  Entra ID
                         │
                         ▼
              Azure Bot / API Layer
                         │
                         ▼
                Azure API Management
                         │
                         ▼
                  CWD Coordinator
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
        Delegator A            Delegator B
              │                     │
         Specialized            Specialized
          Workers                Workers
              │                     │
       ┌──────┼──────┐       ┌──────┼──────┐
       ▼      ▼      ▼       ▼      ▼      ▼
      MCP    RAG    APIs    MCP    RAG    APIs
       │      │      │       │      │      │
       ▼      ▼      ▼       ▼      ▼      ▼
 Enterprise Systems / Azure AI Services
```

Supporting services can include:

* Entra ID — identity
* API Management — API governance
* Azure OpenAI / Foundry — models and AI capabilities
* Azure AI Search — RAG
* Azure Service Bus — asynchronous processing
* Azure Functions — focused tools
* Container Apps / AKS — agent services
* Key Vault — secrets
* Application Insights — telemetry
* Logic Apps — enterprise workflows

---

# 17. Teams Conversation State

For multi-turn conversations, CWD should maintain state.

Example:

### Turn 1

> "Why did EQ-102 fail?"

### Turn 2

> "Show me similar incidents."

### Turn 3

> "Create a ticket for this one."

CWD needs to understand that **"this one"** refers to EQ-102's current failure.

Use:

```text
Session
 └── Task
      └── Run
           └── Turn
                └── Step
```

Store appropriate conversation/task state in a persistent state store such as Redis/Cosmos DB, while avoiding unnecessary sensitive data retention.

---

# 18. Error Handling

Suppose ServiceNow is temporarily unavailable.

Don't let the Teams conversation simply fail.

```text
Teams
 ↓
CWD
 ↓
ServiceNow Worker
 ↓
ServiceNow API
 ↓
503
 ↓
Retry with backoff
 ↓
Still failing
 ↓
Service Bus / DLQ
 ↓
Teams notification
```

Teams can show:

> ServiceNow is temporarily unavailable. The request has been queued and will be retried.

---

# 19. Security Architecture

For an enterprise Teams + CWD solution:

```text
Teams
 ↓
Entra ID
 ↓
APIM
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
MCP
 ↓
APIM / Enterprise API
 ↓
Enterprise System
```

Security controls:

* Entra ID authentication
* OAuth/JWT
* RBAC
* Managed Identity
* Least privilege
* ACL filtering
* API authorization
* DLP
* Input validation
* Prompt-injection defenses
* Tool allowlists
* Human approval for high-risk actions
* Audit logs
* Correlation IDs
* Private networking
* Key Vault

---

# 20. Strong Interview Answer

> **"In my CWD architecture, I would use Microsoft Teams as the conversational interface for enterprise users. The Teams application or bot authenticates users through Microsoft Entra ID and forwards the request through the API gateway to the CWD Coordinator. The Coordinator understands the intent and routes the request to the appropriate domain Delegator, which decomposes the task and invokes specialized Workers. Workers can use MCP tools, Azure AI Search for RAG, or governed enterprise APIs through API Management.**
>
> **For enterprise actions such as creating a ServiceNow ticket, I would apply policy and authorization checks and, for higher-risk operations, use a Teams Adaptive Card to obtain human approval before execution. I would maintain session and task context so multi-turn conversations work naturally, and propagate correlation IDs throughout the workflow for end-to-end tracing. For asynchronous or long-running operations, I would use Service Bus and send progress or completion notifications back to Teams. This gives users a familiar conversational experience while keeping orchestration, security, authorization and enterprise-system execution within the governed CWD platform."**

## Final mental model

```text
Teams
  = Conversational UI

Entra ID
  = User Identity

APIM
  = API Security & Governance

Coordinator
  = Overall Orchestration

Delegator
  = Domain Task Decomposition

Worker
  = Task Execution

MCP
  = Agent → Tool

AI Search
  = Enterprise Knowledge Retrieval

Service Bus
  = Reliable Async Processing

Adaptive Card
  = Structured UI / Human Approval

Enterprise APIs
  = Actual Business Operations
```

**One-line interview answer:**

> **“Microsoft Teams provides the conversational front end, while CWD remains the governed agent orchestration layer behind it, using Entra ID for identity, APIM for API governance, Adaptive Cards for human-in-the-loop actions, MCP for tool integration, and Service Bus for reliable asynchronous workflows.”**
