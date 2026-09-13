# Enterprise APIs as Agent Tools

In an enterprise Agentic AI platform like your **CWD**, enterprise systems such as **Salesforce, ServiceNow, SAP, SQL, Microsoft 365, and internal APIs** should not be exposed directly to the LLM.

Instead, agents access them through **governed tools and API layers**.

### Mental model

> **Agent decides what information/action it needs → governed tool validates it → Azure API layer secures and controls access → enterprise API executes → structured result returns to the agent.**

---

# 1. Where Enterprise APIs fit in CWD

Your architecture:

```text
User
 ↓
Coordinator
 ↓
Delegator
 ↓
Specialized Worker
 ↓
MCP Tool / Application Tool
 ↓
Azure API Management
 ↓
Enterprise API
 ↓
Salesforce / ServiceNow / SAP / SQL / M365
```

For example:

```text
Quality Worker
      ↓
MCP Client
      ↓
Quality MCP Server
      ↓
APIM
      ↓
Internal Quality API
      ↓
Enterprise Database
```

The **LLM never receives unrestricted credentials or unrestricted database/API access.**

---

# 2. Why not let the LLM call APIs directly?

Bad architecture:

```text
LLM
 ↓
Salesforce
 ↓
SQL
 ↓
ServiceNow
```

Problems:

* Excessive permissions
* Credential exposure
* Uncontrolled API calls
* Prompt injection risk
* No centralized throttling
* Difficult auditing
* Difficult authorization
* Potential destructive actions
* Difficult API version management

Better:

```text
LLM
 ↓
Worker
 ↓
Governed Tool
 ↓
APIM
 ↓
Enterprise API
 ↓
Backend
```

---

# 3. The six enterprise systems

For interviews, understand what type of interaction each system represents.

| System        | Typical Agent Tool                        |
| ------------- | ----------------------------------------- |
| Salesforce    | Customer/account/opportunity data         |
| ServiceNow    | Incident/problem/change/ticket operations |
| SAP           | ERP, procurement, inventory, finance      |
| SQL           | Structured operational/business data      |
| Microsoft 365 | SharePoint, Outlook, Teams, OneDrive      |
| Internal APIs | Proprietary enterprise capabilities       |

---

# 4. Salesforce as an Agent Tool

Example user request:

> "Show me the current status of customer ABC's open opportunities."

CWD:

```text
User
 ↓
Coordinator
 ↓
Sales Delegator
 ↓
Salesforce Worker
 ↓
Salesforce MCP/API Tool
 ↓
APIM
 ↓
Salesforce API
```

The Worker might invoke:

```text
get_customer()
get_opportunities()
get_account_history()
```

The API returns structured data:

```json id="w5f2e6"
{
  "customer": "ABC",
  "openOpportunities": 4,
  "totalPipeline": 1250000,
  "currency": "USD"
}
```

The LLM then reasons over that result.

### Important principle

The LLM doesn't need to know Salesforce's entire internal API structure.

It gets a **controlled business capability**.

---

# 5. ServiceNow as an Agent Tool

This is especially relevant to your CWD interview.

Suppose the user says:

> "Create a ticket for confirmed equipment failure EQ-102."

Architecture:

```text
User
 ↓
Coordinator
 ↓
IT / Service Management Delegator
 ↓
ServiceNow Worker
 ↓
MCP Tool
 ↓
APIM
 ↓
ServiceNow API
```

Possible tools:

```text
get_incident()
search_incidents()
create_incident()
update_incident()
```

The Worker generates a structured request:

```json id="y2mt1p"
{
  "equipmentId": "EQ-102",
  "priority": "High",
  "description": "Equipment failure confirmed",
  "rootCause": "Bearing degradation"
}
```

Before the write operation:

```text
Authentication
      ↓
Authorization
      ↓
Policy check
      ↓
Input validation
      ↓
ServiceNow API
```

For high-impact operations, you can add human approval.

```text
Agent
 ↓
Policy
 ↓
Human Approval
 ↓
ServiceNow
```

---

# 6. SAP as an Agent Tool

SAP is typically used for:

* Procurement
* Inventory
* Material availability
* Purchase orders
* Suppliers
* Finance
* Manufacturing
* ERP processes

Example:

> "Do we have enough raw material for next week's production?"

CWD:

```text
User
 ↓
Coordinator
 ↓
Supply Chain Delegator
 ↓
Inventory Worker
 ↓
SAP Tool
 ↓
APIM
 ↓
SAP API
```

The Worker might call:

```text
get_inventory()
get_material_availability()
get_purchase_orders()
get_supplier_status()
```

Then the agent can reason:

```text
Current Inventory
       +
Open Purchase Orders
       +
Production Demand
       ↓
Material Availability Analysis
```

The agent isn't directly manipulating SAP tables.

---

# 7. SQL as an Agent Tool

SQL is different because it is a **database**, not an API product.

You should expose controlled operations.

Bad:

```text
LLM
 ↓
Generate arbitrary SQL
 ↓
Production Database
```

Better:

```text
Agent
 ↓
SQL Tool
 ↓
Validated Query / Stored Procedure
 ↓
Authorization
 ↓
Azure SQL
```

Example tools:

```text
get_equipment_status()
get_lot_yield()
get_inventory()
get_production_history()
```

For example:

```sql
SELECT AVG(yield)
FROM production_lot
WHERE fab = @fab
AND production_date >= @start_date;
```

Use:

* parameterized queries
* stored procedures where appropriate
* read-only roles where possible
* row-level security where appropriate
* least privilege

---

# 8. Microsoft 365 as Agent Tools

Microsoft 365 can expose enterprise information from:

* SharePoint
* OneDrive
* Teams
* Outlook
* Microsoft Graph

Example:

> "Find the latest failure-analysis document for EQ-102."

Architecture:

```text
User
 ↓
Coordinator
 ↓
Quality Delegator
 ↓
Knowledge Worker
 ↓
M365/Search Tool
 ↓
APIM / Microsoft Graph
 ↓
SharePoint
```

The agent might retrieve:

```text
Document
Title
Author
Modified Date
Content
Access metadata
```

Then the RAG pipeline can use the authorized document.

---

# 9. Internal APIs

Large enterprises usually have hundreds or thousands of internal APIs.

Examples:

```text
/equipment/status
/manufacturing/lots
/quality/failures
/yield/trends
/inventory
/product/specifications
```

CWD can turn these into governed agent capabilities.

Example:

```text
Equipment Worker
       ↓
get_equipment_status()
       ↓
Internal API
       ↓
Equipment Management System
```

This is preferable to putting backend-specific integration logic inside every Worker.

---

# 10. The governed API layer

This is the key architecture:

```text
                 CWD
                  │
              Worker
                  │
            Governed Tool
                  │
                  ▼
             Azure APIM
                  │
       ┌──────────┼──────────┐
       ▼          ▼          ▼
 Salesforce    ServiceNow   SAP
       │          │          │
       └──────────┼──────────┘
                  │
             Enterprise
              Systems
```

APIM becomes the **central control point**.

---

# 11. What APIM does

For every API request:

```text
Worker
 ↓
APIM
```

APIM can enforce:

### Authentication

> Who is calling?

### Authorization

> Is this caller allowed?

### Rate limiting

> How many calls are allowed?

### Quotas

> How much traffic is allowed over a period?

### Request validation

> Is the request valid?

### Routing

> Which backend should receive it?

### Transformation

> Does the request/response need adaptation?

### Versioning

> Which API version should be used?

### Monitoring

> What happened?

---

# 12. Identity propagation

This is an important enterprise concept.

Suppose:

```text
Pooja
 ↓
CWD
 ↓
Quality Worker
 ↓
APIM
 ↓
Quality API
```

You don't want the backend to simply see:

```text
"CWD service account"
```

when the business requirement is to enforce user-level access.

Depending on the architecture, you can propagate user identity/claims or use a service identity plus explicit authorization context.

Conceptually:

```text
User Identity
     ↓
Entra ID
     ↓
Token / Claims
     ↓
CWD
     ↓
APIM
     ↓
Backend Authorization
```

This supports **identity-aware authorization**.

---

# 13. Authentication vs authorization

Remember this distinction.

### Authentication

```text
Who are you?
```

Example:

```text
Worker → Entra ID → Token
```

### Authorization

```text
What are you allowed to do?
```

Example:

```text
Quality Worker
   ↓
Can:
   GET failure reports

Cannot:
   DELETE production records
```

---

# 14. Tool-level authorization

You should also govern the tools themselves.

Example:

```text
Tool Registry
│
├── get_equipment_status
│    └── READ
│
├── get_failure_report
│    └── READ
│
├── create_service_ticket
│    └── WRITE
│
└── delete_record
     └── DESTRUCTIVE
```

Then:

```text
Worker
 ↓
Tool Registry
 ↓
Is Worker allowed to use this tool?
 ↓
Yes
 ↓
APIM
 ↓
Enterprise API
```

---

# 15. Read vs Write tools

This is a very important Agentic AI security pattern.

### Read

```text
get_equipment_status()
search_documents()
get_inventory()
```

Lower risk.

### Write

```text
create_service_ticket()
update_purchase_order()
update_customer()
```

Higher risk.

### Destructive

```text
delete_record()
shutdown_equipment()
cancel_order()
```

Very high risk.

Therefore, don't treat every API as an equivalent "tool."

Use **risk-based tool governance**.

---

# 16. Human-in-the-loop

For sensitive actions:

```text
Agent
 ↓
Tool
 ↓
Policy
 ↓
Human Approval
 ↓
APIM
 ↓
Enterprise API
```

Example:

> "Cancel this purchase order."

Instead of:

```text
LLM → SAP → DELETE
```

use:

```text
LLM
 ↓
SAP Tool
 ↓
Policy
 ↓
Approval
 ↓
APIM
 ↓
SAP
```

The LLM can recommend the action, but deterministic policy controls whether it can happen.

---

# 17. MCP + Enterprise APIs

This is the pattern you should associate with your CWD.

```text
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
APIM
 ↓
Enterprise API
```

Example:

```text
ServiceNow Worker
       ↓
ServiceNow MCP Server
       ↓
APIM
       ↓
ServiceNow REST API
```

MCP provides the standardized **agent/tool interface**.

APIM provides **API governance**.

---

# 18. Why both MCP and APIM?

This is a common interview question.

### MCP

Answers:

> **How does an AI application interact with a tool?**

### APIM

Answers:

> **How do we secure, govern and manage the API?**

Therefore:

```text
AI interaction
     ↓
    MCP
     ↓
API governance
     ↓
   APIM
     ↓
Enterprise API
```

### One-line answer

> **MCP is the agent-to-tool interface; APIM is the enterprise API governance layer.**

---

# 19. Enterprise API + RAG

Not every question should use RAG.

For example:

> "What is EQ-102's current status?"

Use live API/SQL:

```text
Worker
 ↓
Equipment API
 ↓
Current status
```

For:

> "What does the equipment maintenance SOP say?"

Use RAG:

```text
Worker
 ↓
Azure AI Search
 ↓
Relevant documents
```

For:

> "Why did EQ-102 fail?"

You may need **both**:

```text
                  Worker
                 /      \
                /        \
           Live API     RAG
              ↓           ↓
        Current Data   Historical Docs
                \       /
                 \     /
                  LLM
                   ↓
              RCA Analysis
```

This is a strong enterprise Agentic RAG pattern.

---

# 20. Example: Your CWD failure-analysis workflow

User:

> **"Analyze EQ-102 failure and create a ticket if confirmed."**

### Step 1

```text
User
 ↓
Coordinator
```

Intent:

```text
Failure Analysis + Conditional Action
```

### Step 2

```text
Coordinator
 ↓
Quality / Failure Analysis Delegator
```

### Step 3

Delegator selects:

```text
Image Analysis Worker
Equipment Worker
Historical RAG Worker
RCA Worker
ServiceNow Worker
```

### Step 4 — Live data

```text
Equipment Worker
 ↓
MCP
 ↓
APIM
 ↓
Equipment API
```

Gets:

```text
status
alarms
temperature
maintenance
```

### Step 5 — Historical knowledge

```text
RAG Worker
 ↓
Azure AI Search
 ↓
Historical failure reports
```

### Step 6 — RCA

```text
RCA Worker
 ↓
Combine:
live data
+
historical evidence
+
image analysis
```

Result:

```text
Failure confirmed
Probable RCA = bearing degradation
Confidence = 92%
```

### Step 7 — Conditional action

```text
ServiceNow Worker
 ↓
MCP
 ↓
Policy
 ↓
APIM
 ↓
ServiceNow API
```

Ticket created.

### Step 8 — Audit

Track:

```text
sessionId
taskId
runId
workerId
toolId
API
correlationId
timestamp
status
latency
```

Now the entire AI decision and enterprise action is traceable.

---

# 21. Production architecture

```text
                         USER
                           │
                           ▼
                  Front Door + WAF
                           │
                           ▼
                          APIM
                           │
                           ▼
                      Coordinator
                           │
                     Delegators
                           │
                        Workers
                           │
                    MCP / Tools
                           │
                           ▼
                    Azure APIM
                           │
       ┌───────────────────┼───────────────────┐
       ▼                   ▼                   ▼
   Salesforce          ServiceNow             SAP
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                    Enterprise APIs
```

And for data:

```text
Workers
   │
   ├── Azure SQL
   ├── Azure AI Search
   ├── Cosmos DB
   ├── ADLS
   └── Blob Storage
```

Security:

```text
Entra ID
   ↓
Managed Identity
   ↓
RBAC / ACL / API Policies
   ↓
APIM
   ↓
Enterprise System
```

---

# 22. Failure handling

Suppose Salesforce returns:

```text
429 Too Many Requests
```

Your architecture should not simply let the agent repeatedly call it.

```text
Worker
 ↓
APIM
 ↓
Salesforce
 ↓
429
 ↓
Controlled retry/backoff
```

For persistent failures:

```text
Retry
 ↓
Failure
 ↓
Circuit breaker / error handling
 ↓
Agent receives structured failure
```

For long-running workflows:

```text
APIM
 ↓
Service Bus
 ↓
Worker
```

---

# 23. Auditing

For every enterprise action, you should be able to answer:

> Who initiated it?

> Which agent performed it?

> Which Worker called it?

> Which tool was invoked?

> Which API was called?

> What was the result?

Example:

```text
User
  = Pooja

Task
  = T2001

Agent
  = EquipmentWorker

Tool
  = create_service_ticket

API
  = ServiceNow

Correlation ID
  = C5001

Result
  = INC0012345
```

This is essential for enterprise AI governance.

---

# 24. Strong Solution Architect design principle

A very strong statement for interviews:

> **"I treat enterprise systems as governed capabilities, not as unrestricted tools for the LLM."**

Then explain:

```text
LLM
 ↓
Worker
 ↓
Governed Tool
 ↓
Identity
 ↓
Authorization
 ↓
APIM
 ↓
Enterprise API
 ↓
Enterprise System
```

This demonstrates that you understand **Agentic AI + enterprise architecture + security**, rather than only knowing how to make an API call.

---

# 25. Strong interview answer

> **"In my CWD architecture, I would expose enterprise systems such as Salesforce, ServiceNow, SAP, SQL, Microsoft 365 and internal APIs as governed capabilities rather than allowing agents to access them directly. A specialized Worker would invoke an approved tool, typically through an MCP client and MCP server, and the MCP server would call the required enterprise API through Azure API Management. APIM would provide centralized authentication, authorization, throttling, request validation, routing, versioning and telemetry. For data access, I would use least-privilege identities and expose specific business operations instead of unrestricted database access or arbitrary SQL. Read operations can generally be automated more broadly, while write or destructive operations require stronger policy controls and, where appropriate, human approval. I would also propagate user identity, task IDs and correlation IDs for end-to-end auditing. This gives CWD a secure abstraction layer where agents can use enterprise capabilities while the underlying systems remain protected and governed."**

---

## Final architecture to memorize

```text
             USER
               ↓
          Coordinator
               ↓
           Delegator
               ↓
            Worker
               ↓
        MCP Client / Tool
               ↓
          MCP Server
               ↓
             APIM
               ↓
     Authentication + Authorization
     Validation + Throttling + Audit
               ↓
      ┌────────┼─────────┐
      ↓        ↓         ↓
 Salesforce ServiceNow  SAP
      ↓        ↓         ↓
   Enterprise APIs / Systems
```

### The 4-layer mental model

> **Agent = reasoning**
> **Worker = business task execution**
> **MCP = standardized tool interface**
> **APIM = security and API governance**
> **Enterprise API = actual business capability**

That separation is the key concept to remember for a **Senior/Principal Solution Architect** interview.
