# MCP Integration on Azure

**MCP (Model Context Protocol)** provides a standardized way for AI agents to discover and invoke **tools, resources, and prompts** exposed by external systems.

For your CWD architecture, MCP is the **tool integration layer** between your Workers/Agents and enterprise capabilities.

### Mental model

> **MCP = standardized interface that lets an AI Worker securely use enterprise tools and data without embedding every integration directly into the agent.**

---

# 1. Where MCP fits in CWD

Your hierarchy remains:

```text
User
  ↓
Coordinator
  ↓
Delegator
  ↓
Worker / Agent
  ↓
MCP Client
  ↓
MCP Server
  ↓
Enterprise Tool / Data
```

For example:

```text
Quality Worker
      ↓
   MCP Client
      ↓
Quality MCP Server
      ↓
 ┌────┼─────────────┐
 ↓    ↓             ↓
SQL  AI Search   Failure API
```

The important distinction:

* **Coordinator** → decides the overall route
* **Delegator** → decomposes the domain task
* **Worker** → performs the specialized task
* **MCP** → standardized interface to tools/data
* **MCP Server** → exposes controlled enterprise capabilities

---

# 2. Why MCP?

Without MCP, every Worker might implement custom integrations:

```text
Worker
 ├── Custom SQL code
 ├── Custom ServiceNow code
 ├── Custom Salesforce code
 ├── Custom SharePoint code
 └── Custom API code
```

This becomes difficult to maintain.

With MCP:

```text
Worker
   ↓
MCP Client
   ↓
MCP Servers
 ├── SQL MCP
 ├── ServiceNow MCP
 ├── Salesforce MCP
 ├── SharePoint MCP
 └── Equipment MCP
```

The Worker interacts with tools using a standardized protocol.

---

# 3. MCP Client vs MCP Server

This is one of the most important interview concepts.

### MCP Client

The **client is inside the AI application/agent runtime** and connects to an MCP server.

```text
CWD Worker
    ↓
MCP Client
```

### MCP Server

The server exposes capabilities.

```text
MCP Server
 ├── Tools
 ├── Resources
 └── Prompts
```

So:

> **Client consumes capabilities; Server exposes capabilities.**

---

# 4. What can an MCP Server expose?

MCP commonly organizes capabilities into:

### Tools

Actions the agent can invoke.

Examples:

```text
get_equipment_status()
get_equipment_history()
get_lot_yield()
search_failure_reports()
create_service_ticket()
```

### Resources

Data/context that can be retrieved.

Examples:

```text
equipment://EQ-102/history
failure-report://FA-2026-104
```

### Prompts

Reusable prompt templates/workflows where appropriate.

For example:

```text
failure_analysis_prompt
equipment_diagnosis_prompt
```

For your interviews, remember:

> **Tools = actions**
> **Resources = data/context**
> **Prompts = reusable interaction templates**

---

# 5. Azure MCP architecture

A production CWD architecture could look like:

```text
                         Azure
────────────────────────────────────────────

User
 ↓
Front Door / WAF
 ↓
APIM
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
 ┌──────────────┬───────────────┬──────────────┐
 ↓              ↓               ↓
Azure SQL   Azure AI Search   Enterprise API
```

MCP Servers can be hosted using Azure services such as:

* Azure Container Apps
* AKS
* Azure Functions for suitable lightweight tool implementations

For larger enterprise MCP platforms, **Container Apps or AKS** are common choices because MCP servers can run as containerized services.

---

# 6. Example: Equipment MCP Server

Suppose you create:

```text
equipment-mcp-server
```

It exposes:

```text
Tools
 ├── get_equipment_status
 ├── get_equipment_history
 ├── get_equipment_alarms
 └── get_maintenance_history
```

Architecture:

```text
Equipment Worker
       ↓
MCP Client
       ↓
Equipment MCP Server
       ↓
 ┌─────┼────────────┐
 ↓     ↓            ↓
SQL   API       Maintenance DB
```

The Worker doesn't need to know how each backend is implemented.

---

# 7. Step-by-step technical workflow

Let's use your CWD equipment failure scenario.

User asks:

> **"Why did equipment EQ-102 fail?"**

### Step 1 — User request

```text
User
 ↓
"What caused EQ-102 failure?"
```

### Step 2 — Coordinator

```text
Coordinator
 ↓
Intent = Equipment Failure Analysis
Domain = Equipment / Quality
```

### Step 3 — Delegator

```text
Equipment Delegator
 ↓
Tasks:
1. Get equipment status
2. Get alarms
3. Get maintenance history
4. Find similar failures
```

### Step 4 — Worker

```text
Equipment Health Worker
```

The Worker needs enterprise information.

### Step 5 — MCP Client

```text
Worker
 ↓
MCP Client
```

The client connects to the appropriate MCP server.

### Step 6 — Tool discovery

The MCP client can discover available tools/capabilities from the server.

For example:

```text
Equipment MCP Server

Tools:
- get_equipment_status
- get_equipment_alarms
- get_equipment_history
- get_maintenance_history
```

### Step 7 — Tool invocation

Worker invokes:

```text
get_equipment_alarms(
    equipmentId="EQ-102"
)
```

### Step 8 — MCP Server

```text
MCP Server
 ↓
Validate request
 ↓
Authorize
 ↓
Call enterprise backend
```

For example:

```text
MCP Server
 ↓
Azure SQL
```

### Step 9 — Structured result

MCP server returns structured data:

```json
{
  "equipmentId": "EQ-102",
  "status": "DOWN",
  "errorCode": "E1042",
  "temperature": 92.4,
  "lastMaintenance": "2026-08-28"
}
```

### Step 10 — Worker reasons

The Worker combines:

```text
Equipment telemetry
+
Alarm history
+
Maintenance history
+
Historical failure reports
```

Then produces an RCA.

---

# 8. MCP + Azure SQL

A common enterprise pattern:

```text
Worker
 ↓
MCP Client
 ↓
SQL MCP Server
 ↓
Governed SQL Tool
 ↓
Azure SQL
```

Example tool:

```text
get_equipment_status(equipmentId)
```

The MCP server might internally execute a parameterized query.

```sql
SELECT status
FROM Equipment
WHERE equipment_id = @equipmentId;
```

The LLM should **not** receive unrestricted database credentials.

Instead:

```text
Agent
 ↓
MCP Tool
 ↓
Validated operation
 ↓
Authorization
 ↓
Azure SQL
```

This is much safer.

---

# 9. MCP + Azure AI Search

For Agentic RAG:

```text
Worker
 ↓
MCP Client
 ↓
RAG MCP Server
 ↓
Azure AI Search
```

Tools could be:

```text
search_failure_reports()
search_equipment_history()
search_quality_documents()
```

Example:

```text
search_failure_reports(
    equipmentType="SiC",
    fab="Fab-X",
    defectType="crack"
)
```

The MCP server performs:

```text
Query
 ↓
ACL filter
 ↓
Hybrid search
 ↓
Semantic ranking
 ↓
Top-K results
```

Then returns the evidence to the Worker.

---

# 10. MCP + ServiceNow

This is a very good CWD interview example.

Create:

```text
ServiceNow MCP Server
```

Expose:

```text
get_incident()
search_incidents()
create_incident()
update_incident()
```

Architecture:

```text
IT Worker
   ↓
MCP Client
   ↓
ServiceNow MCP Server
   ↓
APIM
   ↓
ServiceNow API
```

Notice that **MCP and APIM are not competitors**.

They operate at different layers.

> **MCP standardizes agent-to-tool interaction. APIM governs API access.**

---

# 11. MCP + APIM

A mature enterprise pattern:

```text
CWD Worker
    ↓
MCP Client
    ↓
MCP Server
    ↓
APIM
    ↓
Enterprise API
```

APIM can enforce:

* authentication
* authorization
* throttling
* request validation
* routing
* API versioning
* telemetry

MCP provides:

* tool discovery
* standardized tool invocation
* structured tool inputs/outputs
* resource access

So:

```text
MCP = AI tool interface
APIM = API governance
```

---

# 12. MCP + Managed Identity

For Azure-hosted MCP servers:

```text
MCP Server
      ↓
Managed Identity
      ↓
Microsoft Entra ID
      ↓
Azure RBAC
      ↓
Azure Resource
```

For example:

```text
Quality MCP Server
      ↓
Managed Identity
      ↓
Azure AI Search
```

The MCP server doesn't need a hard-coded Azure password/secret.

---

# 13. MCP + Key Vault

If an external enterprise system requires a secret:

```text
MCP Server
    ↓
Managed Identity
    ↓
Key Vault
    ↓
Secret
    ↓
Enterprise API
```

Don't put credentials in:

* MCP source code
* Docker image
* prompts
* agent memory
* configuration files committed to Git

---

# 14. MCP security architecture

This is especially important because MCP exposes **actions**.

A production pattern:

```text
User
 ↓
Entra ID
 ↓
CWD
 ↓
Worker
 ↓
MCP Client
 ↓
MCP Server
 ↓
Identity + Authorization
 ↓
Tool
 ↓
Enterprise System
```

Security checks should include:

### Authentication

Who is calling?

### Authorization

Is this Worker/user allowed to invoke this tool?

### Input validation

Is the request valid?

### Least privilege

Does the MCP server have only the permissions it needs?

### Audit

Who invoked which tool?

---

# 15. Never trust the LLM for authorization

Suppose the LLM decides:

> "The user probably has permission to delete this record."

That is not acceptable.

Instead:

```text
LLM
 ↓
Request tool
 ↓
MCP Server
 ↓
Authorization Policy
 ↓
Allowed?
 ├── Yes → Execute
 └── No  → Reject
```

For high-impact operations:

```text
Delete
Update production data
Create financial transaction
Create critical incident
```

you may require:

```text
Agent
 ↓
MCP Tool
 ↓
Policy
 ↓
Human Approval
 ↓
Execute
```

---

# 16. Read tools vs write tools

Not all tools have the same risk.

### Read

```text
get_equipment_status()
search_failure_reports()
get_inventory()
```

Generally lower risk.

### Write

```text
create_service_ticket()
update_equipment()
change_configuration()
```

Higher risk.

### Destructive

```text
delete_record()
shutdown_equipment()
```

Very high risk.

Therefore, tool governance should classify tools by risk.

```text
Tool Registry
 ├── READ
 ├── WRITE
 └── DESTRUCTIVE
```

This is a strong enterprise Agentic AI design principle.

---

# 17. MCP tool registry

In CWD, you can maintain metadata for tools:

```json
{
  "toolName": "get_equipment_status",
  "domain": "equipment",
  "riskLevel": "READ",
  "description": "Returns current equipment status",
  "allowedAgents": [
    "equipment-worker",
    "maintenance-worker"
  ],
  "authentication": "managed-identity",
  "version": "v1"
}
```

This allows the platform to govern which Worker can use which capability.

---

# 18. MCP + CWD Agent Registry

Your architecture can have:

```text
Agent Registry
     │
     ├── Coordinator
     ├── Delegators
     └── Workers

MCP Tool Registry
     │
     ├── Equipment Tools
     ├── Quality Tools
     ├── ServiceNow Tools
     ├── Search Tools
     └── Data Tools
```

Worker capabilities can map to MCP tools.

Example:

```text
Equipment Worker
      ↓
MCP Tools
 ├── get_equipment_status
 ├── get_alarm_history
 └── get_maintenance_history
```

---

# 19. MCP server hosting on Azure

### Option 1 — Azure Container Apps

Good when MCP servers are:

* containerized
* independently deployable
* relatively lightweight
* scalable
* don't require full Kubernetes control

```text
MCP Server Container
        ↓
Azure Container Apps
```

### Option 2 — AKS

Useful for:

* many MCP servers
* complex enterprise platform
* workload isolation
* custom networking
* advanced scaling
* GPU/specialized workloads

```text
AKS
 ├── Equipment MCP
 ├── Quality MCP
 ├── ServiceNow MCP
 ├── Search MCP
 └── Engineering MCP
```

### Option 3 — Azure Functions

Useful when the underlying tool is a small, focused serverless operation and the MCP implementation supports the required interaction pattern.

---

# 20. MCP synchronous vs asynchronous

MCP tool calls can be suitable for immediate operations.

Example:

```text
get_equipment_status()
        ↓
      result
```

For long-running operations, don't force the agent to hold an HTTP request open indefinitely.

Instead:

```text
Worker
 ↓
MCP Tool
 ↓
Service Bus
 ↓
Async Worker
 ↓
Result Store
```

Then CWD can track:

```text
taskId
runId
status
result
```

This is especially useful for:

* large failure analysis
* document processing
* batch analytics
* report generation
* long-running ML jobs

---

# 21. MCP + Event Grid

MCP is normally **agent/tool interaction**.

Event Grid is **event notification/routing**.

Example:

```text
New defect image
       ↓
Blob Storage
       ↓
Event Grid
       ↓
CWD workflow
       ↓
Quality Worker
       ↓
MCP
       ↓
Image/Analysis Tool
```

So:

> Event Grid tells CWD **something happened**.
> MCP lets the Worker **use a tool to do something**.

---

# 22. MCP + Service Bus

Another important distinction:

```text
MCP
 ↓
Tool invocation
```

versus:

```text
Service Bus
 ↓
Reliable asynchronous message delivery
```

Combined:

```text
Worker
 ↓
MCP
 ↓
Tool
 ↓
Service Bus
 ↓
Long-running processing
```

---

# 23. MCP observability

Every tool call should be traceable.

For example:

```text
session_id = S1001
task_id = T2001
run_id = R3001
worker_id = equipment-worker
mcp_server = equipment-mcp
tool = get_equipment_alarms
correlation_id = C5001
```

Then your trace becomes:

```text
User
 ↓
Coordinator
 ↓
Equipment Delegator
 ↓
Equipment Worker
 ↓
MCP Client
 ↓
Equipment MCP Server
 ↓
get_equipment_alarms
 ↓
Azure SQL
```

You should capture:

* tool invocation count
* tool success/failure
* latency
* timeout
* errors
* authorization failures
* input/output metadata
* correlation IDs
* agent/task/run IDs

Avoid logging sensitive payloads unnecessarily.

---

# 24. MCP vs REST

Interview question:

### REST

```text
Application → REST API → Backend
```

REST is a general API architecture/interface.

### MCP

```text
Agent → MCP Client → MCP Server → Tool
```

MCP is specifically designed to standardize how AI applications interact with tools/context.

### Simple interview answer

> **"REST exposes APIs to applications, while MCP provides a standardized tool and context interface designed for AI applications. In CWD, I can use MCP for agent-to-tool interaction while the MCP server internally calls REST APIs, SQL, Azure AI Search or other enterprise systems."**

---

# 25. MCP vs A2A

This is one you should absolutely know.

### MCP

**Agent → Tool**

```text
Worker
 ↓
MCP
 ↓
Tool
```

### A2A

**Agent → Agent**

```text
Coordinator
 ↓
A2A
 ↓
Delegator
```

So:

> **MCP = Agent-to-Tool**
> **A2A = Agent-to-Agent**

Your CWD can use both:

```text
Coordinator
    ↓
   A2A
    ↓
Delegator
    ↓
   A2A
    ↓
Worker
    ↓
   MCP
    ↓
Enterprise Tool
```

---

# 26. Complete CWD MCP workflow

Let's combine everything.

User asks:

> **"Analyze EQ-102 failure and create a ServiceNow ticket if the failure is confirmed."**

### 1. User

```text
User
 ↓
CWD
```

### 2. Coordinator

```text
Coordinator
 ↓
Intent classification
 ↓
Equipment failure analysis
```

### 3. Delegator

```text
Equipment / Quality Delegator
 ↓
Decompose:
- telemetry
- alarms
- maintenance
- historical RCA
```

### 4. Worker

```text
Equipment Analysis Worker
```

### 5. MCP

```text
Worker
 ↓
MCP Client
```

### 6. Tool discovery

```text
MCP Server
 ↓
Available tools
 ├── get_equipment_status
 ├── get_alarm_history
 ├── get_maintenance_history
 └── search_failure_reports
```

### 7. Execute tools

```text
Worker
 ↓
MCP
 ├── SQL
 ├── AI Search
 └── Equipment API
```

### 8. Analyze

Worker determines:

```text
Failure confirmed
Root cause = probable bearing degradation
Confidence = 92%
```

### 9. Write operation

Worker requests:

```text
create_service_ticket()
```

### 10. Security

```text
MCP Server
 ↓
Authorization
 ↓
Policy
 ↓
APIM
 ↓
ServiceNow
```

### 11. Result

```text
ServiceNow Ticket = INC0012345
```

### 12. Final response

```text
Coordinator
 ↓
"EQ-102 failure confirmed.
Probable root cause: bearing degradation.
ServiceNow ticket INC0012345 created."
```

---

# 27. Production Azure architecture

For your CWD, I would visualize MCP like this:

```text
                         USERS
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
                    ┌──────┴──────┐
                    ▼             ▼
               Delegator       Delegator
                    │
                  Worker
                    │
               MCP Client
                    │
          ┌─────────┼───────────┐
          ▼         ▼           ▼
      MCP Server MCP Server MCP Server
       Quality    Equipment  ServiceNow
          │         │           │
          ▼         ▼           ▼
     AI Search    SQL/API    APIM/API
          │         │           │
          └─────────┼───────────┘
                    ▼
             Enterprise Systems
```

Security:

```text
Entra ID
   ↓
Managed Identity
   ↓
RBAC / ACL / Policies
   ↓
MCP Server
```

Observability:

```text
MCP
 ↓
App Insights
 ↓
Azure Monitor
 ↓
Log Analytics
 ↓
Agent Evaluation
```

---

# 28. Strong interview answer

> **"In my CWD architecture, I would use MCP as the standardized agent-to-tool integration layer. Each specialized Worker acts as an MCP client and can discover and invoke approved capabilities exposed by domain-specific MCP servers. For example, an Equipment Worker could use an Equipment MCP Server to retrieve equipment status, alarms and maintenance history, while a Quality Worker could use a RAG MCP Server to search Azure AI Search. The MCP servers would be hosted on Azure Container Apps or AKS depending on scale and operational requirements, and would access backend systems through controlled interfaces such as Azure SQL, enterprise APIs or APIM. I would secure the MCP servers using Entra ID, Managed Identity, RBAC, least-privilege permissions and private networking, and apply stronger controls for write or destructive tools, including policy checks and potentially human approval. I would also propagate correlation IDs, task IDs and tool IDs into Application Insights and Azure Monitor for end-to-end tracing. MCP handles standardized agent-to-tool interaction; APIM handles API governance, while Service Bus can provide reliable asynchronous processing for long-running operations."**

---

# 29. The 5 things to remember for interviews

```text
1. MCP = Agent → Tool
2. MCP Client = Worker/Agent consuming tools
3. MCP Server = exposes tools/resources/prompts
4. APIM = secures/governs API traffic
5. Service Bus = reliable async messaging
```

### Final mental model

> **CWD Coordinator decides the workflow → Delegator decides the domain tasks → Worker performs the task → MCP gives the Worker standardized access to enterprise tools/data → APIM governs API access → Azure services and enterprise systems execute the operation.**
