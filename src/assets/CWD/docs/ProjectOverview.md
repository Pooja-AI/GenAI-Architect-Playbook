I would also make one important architectural distinction: **PSG, AMG, and ISG are onsemi's official operating/reportable segments, but they should not automatically be your CWD Delegators.** They describe business/product organization; the agent hierarchy is better organized around operational capabilities such as Manufacturing, Equipment, Quality/Failure Analysis, Yield, Supply Chain, and Engineering. onsemi currently reports PSG, AMG and ISG, with products including SiC/power devices, analog/mixed-signal products, and intelligent sensing technologies.

Below is the **updated version** I recommend using.

---

# Project Overview — CWD Platform for onsemi

## 1. Business Overview

CWD — **Coordinator, Delegator, and Worker** — is an enterprise AI orchestration platform designed to help onsemi business, manufacturing, engineering, quality, supply-chain, and IT users interact with enterprise information and business systems through a single intelligent interface.

onsemi develops intelligent power and sensing technologies across automotive, industrial, and AI data-center markets. Its portfolio includes power devices, SiC technologies, power management, sensors, signal conditioning, motor control, connectivity, and other semiconductor technologies. ([onsemi][2])

The semiconductor business requires users to work across multiple areas such as:

* Manufacturing operations
* Equipment and maintenance
* Process engineering
* Yield analysis
* Quality and reliability
* Failure analysis
* Product and test engineering
* Supply chain and inventory
* Customer and technical support
* Product information and engineering knowledge
* IT and Service Management

A single business question can therefore require information from **multiple systems, databases, documents, APIs, analytics platforms, and specialized AI capabilities**.

### Business problem

For example, an engineer may ask:

> **"Why did the yield of Lot L1234 decrease, what caused the defect, have we seen this issue before, and should we create a ServiceNow incident?"**

Answering this manually may require:

1. Checking manufacturing/lot information.
2. Looking at process history.
3. Reviewing equipment data.
4. Searching quality reports.
5. Analyzing defect images.
6. Searching historical failure-analysis reports.
7. Comparing similar incidents.
8. Determining the probable root cause.
9. Checking business authorization.
10. Creating a ServiceNow ticket.

CWD automates and coordinates this workflow.

---

# 2. Business Objective

The primary objective of CWD is to create a **common enterprise AI execution platform for onsemi**.

The platform is designed to:

* Reduce manufacturing and engineering analysis cycle time.
* Reduce repetitive manual investigation.
* Improve engineer and employee productivity.
* Accelerate root-cause analysis.
* Improve quality and reliability investigations.
* Improve yield-analysis workflows.
* Provide faster access to enterprise knowledge.
* Reuse AI capabilities across multiple business domains.
* Integrate enterprise systems through governed tools.
* Maintain authorization and data-entitlement controls.
* Provide complete execution traceability.
* Standardize AI-agent development and deployment.
* Support scalable production AI applications.

---

# 3. Business Input → CWD → Business Outcome

This is the **most important part for your interview**.

```text
Business User
     │
     │ Business Request
     ▼
Coordinator
     │
     │ Identify intent + business domain
     ▼
Domain Delegator
     │
     │ Decompose into domain tasks
     ▼
Specialized Workers
     │
     │ Execute tasks
     ▼
Enterprise Systems / RAG / APIs / MCP
     │
     ▼
Validated Results
     │
     ▼
Coordinator
     │
     ▼
Business Outcome
```

### Example

**Business Input:**

> "Analyze the defect in Lot L1234 and determine the probable root cause."

### Coordinator

Determines:

```text
Intent = Failure Analysis
Business Domain = Quality
Required capabilities =
    - Defect Analysis
    - Historical Search
    - Process Analysis
    - RCA
```

### Coordinator delegates to:

**Quality & Failure Analysis Delegator**

### Delegator assigns:

```text
Defect Analysis Worker
Historical RAG Worker
Process Analysis Worker
RCA Worker
```

### Workers execute:

```text
Defect Worker
   → Analyze defect image

Historical RAG Worker
   → Search previous failure-analysis reports

Process Worker
   → Analyze process parameters

RCA Worker
   → Correlate evidence and determine probable root cause
```

### Expected Business Outcome

```text
Lot: L1234

Defect:
Metal contamination

Probable Root Cause:
Chamber contamination

Confidence:
92%

Supporting Evidence:
- Defect image
- Process history
- Historical FA reports
- Similar previous incidents

Recommended Action:
Inspect and clean chamber

Business Action:
Create ServiceNow incident
```

This is the core value proposition:

> **The user provides a business problem. The Coordinator decides where it should go, the Delegator decomposes the problem, and specialized Workers execute the individual tasks.**

---

# 4. CWD Functional Architecture

```text
                    Business User
                         │
                         ▼
              ┌────────────────────┐
              │    CWD Interface   │
              │ Teams / React / API│
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │    Coordinator     │
              │                    │
              │ Intent             │
              │ Planning           │
              │ Routing            │
              │ Orchestration      │
              │ Aggregation        │
              └─────────┬──────────┘
                        │
          ┌─────────────┼──────────────┐
          ▼             ▼              ▼
   Manufacturing    Quality/FA     Supply Chain
     Delegator       Delegator       Delegator
          │             │              │
       Workers       Workers         Workers
          │             │              │
          └─────────────┼──────────────┘
                        ▼
             Enterprise Capabilities
                        │
       ┌────────────────┼─────────────────┐
       ▼                ▼                 ▼
      RAG              APIs              MCP
       │                │                 │
       ▼                ▼                 ▼
 Azure AI Search   Enterprise Apps   Business Tools
```

---

# 5. Coordinator

The **Coordinator** is the central orchestration and control layer.

Its responsibility is to understand the **business request**, determine what needs to happen, and coordinate the appropriate domain capabilities.

### Coordinator responsibilities

* Understand user intent.
* Identify business domain.
* Classify the request.
* Determine required capabilities.
* Create execution plan.
* Select Delegator(s).
* Coordinate multiple Delegators.
* Maintain execution state.
* Decide sequential vs parallel execution.
* Handle retries and failures.
* Aggregate worker results.
* Validate final response.
* Apply governance policies.
* Return the business result.

### Example

User:

> "Check why the yield dropped for Product X and determine whether the issue is related to equipment."

Coordinator identifies:

```text
Primary Domain:
Yield / Manufacturing

Secondary Domain:
Equipment

Required Delegators:
1. Yield & Manufacturing Analytics
2. Equipment & Maintenance
```

It can then execute both branches in parallel.

---

# 6. Domain Delegators

For an onsemi-oriented CWD implementation, I recommend organizing Delegators around **business processes and operational capabilities**, rather than simply using PSG/AMG/ISG.

### Recommended Delegators

| Delegator                           | Business Responsibility                           |
| ----------------------------------- | ------------------------------------------------- |
| **Manufacturing Operations**        | Production, lot, fab and manufacturing workflows  |
| **Equipment & Maintenance**         | Equipment health, alarms, maintenance             |
| **Quality & Failure Analysis**      | Defects, reliability, RCA, quality investigations |
| **Process Engineering**             | Process parameters, excursions and optimization   |
| **Yield & Manufacturing Analytics** | Yield, trends, defect Pareto, analytics           |
| **Supply Chain**                    | Inventory, material, demand, suppliers            |
| **Product & Design Engineering**    | Product specifications, engineering knowledge     |
| **IT / Service Management**         | Incidents, changes, ServiceNow and IT workflows   |

These are **reference CWD domain boundaries**, not claims about confidential internal onsemi organizational structure.

---

# 7. Specialized Workers

Each Delegator contains specialized Workers.

## Manufacturing Delegator

```text
Manufacturing Delegator
        │
        ├── Lot Status Worker
        ├── Production Worker
        ├── Wafer Process Worker
        ├── Process Excursion Worker
        ├── Manufacturing Data Worker
        └── Production Report Worker
```

### Example

**Input:**

> "Why is Lot L1234 on hold?"

Workers:

* Lot Status Worker → retrieves hold status.
* Process History Worker → retrieves process history.
* Process Excursion Worker → identifies deviation.

**Outcome:**

> Lot L1234 is on hold because of a process excursion at a specific manufacturing step.

---

# 8. Equipment & Maintenance Delegator

```text
Equipment Delegator
        │
        ├── Equipment Health Worker
        ├── Alarm Analysis Worker
        ├── Predictive Maintenance Worker
        ├── Maintenance History Worker
        ├── Spare Parts Worker
        └── ServiceNow Worker
```

### Business Input

> "Why did equipment EQ-102 stop?"

### Workers

```text
Alarm Worker
     ↓
Telemetry Worker
     ↓
Maintenance History Worker
     ↓
RCA Worker
```

### Outcome

> Equipment failure is correlated with a recurring temperature alarm. Previous maintenance records show similar failures. Recommended maintenance action is generated.

---

# 9. Quality & Failure Analysis Delegator

This is one of the most important CWD domains for a semiconductor environment.

```text
Quality / FA Delegator
        │
        ├── Defect Detection Worker
        ├── Image Analysis Worker
        ├── Failure Analysis Worker
        ├── RCA Worker
        ├── Reliability Worker
        ├── Historical RAG Worker
        └── CAPA / Quality Worker
```

onsemi publicly emphasizes quality and reliability, including failure analysis, reliability data, product-change information and multiple quality certifications. ([onsemi][3])

### Business Input

> "Analyze this defect and determine whether we've seen this failure before."

### Workers execute

```text
Image Analysis
       ↓
Defect Classification
       ↓
Historical RAG
       ↓
Process Correlation
       ↓
RCA
```

### Outcome

```text
Defect Classification
+
Historical Similar Cases
+
Probable Root Cause
+
Confidence
+
Recommended Action
```

---

# 10. Yield & Manufacturing Analytics Delegator

```text
Yield Delegator
      │
      ├── Wafer Yield Worker
      ├── Lot Yield Worker
      ├── Yield Loss Worker
      ├── Defect Pareto Worker
      ├── Trend Analysis Worker
      └── Manufacturing Analytics Worker
```

### Business Input

> "Why did yield decrease by 8% this week?"

### Workers execute

* Calculate yield trend.
* Identify largest contributors.
* Analyze defect Pareto.
* Compare historical baseline.
* Correlate with process/equipment changes.

### Outcome

> "Yield decreased primarily because defect D45 increased at process step X. The highest impact is associated with equipment group Y."

---

# 11. Process Engineering Delegator

```text
Process Engineering
        │
        ├── Process Parameter Worker
        ├── Process Excursion Worker
        ├── SPC Worker
        ├── Process Correlation Worker
        ├── Historical Process Worker
        └── Engineering Knowledge Worker
```

### Business Input

> "What process change could have caused the defect increase?"

### Outcome

```text
Process Change
      ↓
Parameter Comparison
      ↓
Historical Comparison
      ↓
Correlation Analysis
      ↓
Potential Cause
      ↓
Recommended Engineering Investigation
```

---

# 12. Supply Chain Delegator

```text
Supply Chain Delegator
        │
        ├── Inventory Worker
        ├── Material Availability Worker
        ├── Demand Forecast Worker
        ├── Capacity Worker
        ├── Supplier Worker
        └── Purchase Order Worker
```

### Business Input

> "Do we have enough material to support next week's production?"

### Outcome

> Inventory is sufficient for X days; projected shortage begins on Wednesday; affected materials and recommended procurement action are identified.

---

# 13. Product & Engineering Delegator

onsemi has a broad semiconductor product portfolio including power devices, sensors, power management, motor control, interfaces, timing/logic/memory and other technologies. ([onsemi][4])

```text
Product Engineering
        │
        ├── Product Specification Worker
        ├── Datasheet Worker
        ├── Product Lifecycle Worker
        ├── Design Knowledge Worker
        ├── Application Engineering Worker
        └── Technical Documentation Worker
```

### Business Input

> "Give me the operating specifications and reliability information for Product X."

### Outcome

> Structured product information with authorized source documents, specifications, reliability information and references.

---

# 14. IT / Service Management Delegator

```text
IT Delegator
      │
      ├── Incident Worker
      ├── Problem Worker
      ├── Change Worker
      ├── ServiceNow Worker
      ├── Knowledge Worker
      └── Application Support Worker
```

### Business Input

> "Create an incident for the confirmed equipment failure."

### Workers

```text
Equipment Worker
      ↓
RCA Worker
      ↓
Incident Worker
      ↓
ServiceNow Worker
      ↓
Ticket Created
```

### Outcome

A controlled ServiceNow incident containing:

* Equipment ID
* Failure description
* RCA
* Evidence
* Severity
* Recommended action
* Relevant correlation IDs

---

# 15. Enterprise Data and AI Layer

CWD connects specialized Workers to authorized enterprise capabilities.

```text
                    Workers
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
        RAG           APIs         MCP
          │            │            │
          ▼            ▼            ▼
   Azure AI Search  Enterprise   Business
                   Systems       Tools
```

Potential enterprise sources include:

* Snowflake
* Salesforce
* Oracle
* SharePoint / Microsoft 365
* Microsoft Graph
* Manufacturing databases
* Quality systems
* Equipment data
* Supply-chain systems
* ServiceNow
* Enterprise APIs

The LLM should **not directly connect to these systems**.

Instead:

```text
Worker
   ↓
Authorized Tool / MCP / API
   ↓
Enterprise System
   ↓
Validated Result
   ↓
Worker
```

---

# 16. RAG for onsemi

CWD can use **Azure AI Search** as the enterprise knowledge retrieval layer.

Potential knowledge sources include:

* Product documentation
* Datasheets
* Engineering documentation
* Manufacturing procedures
* Equipment manuals
* Quality procedures
* Failure-analysis reports
* Reliability documentation
* Process documentation
* Troubleshooting guides
* Historical RCA reports
* Customer-quality documentation

### Example

```text
User Question
      ↓
Coordinator
      ↓
Quality Delegator
      ↓
RCA Worker
      ↓
Azure AI Search
      ↓
Authorized Historical Documents
      ↓
LLM Analysis
      ↓
Evidence-backed RCA
```

The retrieval layer should apply **authorization/ACL filtering before information is provided to the model**.

---

# 17. Multimodal Failure Analysis

This is a particularly strong example for your interview because your CWD background includes multimodal AI.

### Input

```text
Defect Image
+
Lot ID
+
Process Information
```

### Workflow

```text
Coordinator
      ↓
Quality / Failure Analysis Delegator
      ↓
Image Analysis Worker
      ↓
Historical RAG Worker
      ↓
Process Analysis Worker
      ↓
RCA Worker
      ↓
ServiceNow Worker
```

### Expected outcome

```text
Defect:
Metal contamination

Probable Cause:
Process/chamber contamination

Confidence:
92%

Historical Similar Cases:
7

Recommended Action:
Inspect chamber

Business Action:
Create incident / investigation
```

---

# 18. Memory and Execution Context

CWD maintains structured execution context:

```text
Session
   │
   └── Task
         │
         └── Run
               │
               └── Turn
                     │
                     └── Step
                           ├── LLM Call
                           ├── RAG Call
                           └── Tool Call
```

This allows CWD to answer questions such as:

* Which user initiated the request?
* Which Delegator handled it?
* Which Worker executed the task?
* Which documents were retrieved?
* Which tools were called?
* Which model was used?
* How long did each step take?
* What failed?
* What was retried?
* What business action was performed?

---

# 19. Security and Governance

For an onsemi enterprise environment, security is **not optional**.

The core principle is:

> **The LLM reasons about the task; governed tools execute the task.**

### Security flow

```text
User
 ↓
Entra ID Authentication
 ↓
Authorization
 ↓
Business Entitlement Check
 ↓
Coordinator
 ↓
Delegator
 ↓
Worker
 ↓
Tool / MCP / API Authorization
 ↓
Enterprise Data
 ↓
Output Validation
 ↓
PII / Sensitive Data Controls
 ↓
Business Response
```

### Key controls

* Microsoft Entra ID
* RBAC
* Managed Identity
* Key Vault
* Private endpoints
* Private networking
* Data classification
* DLP
* Input validation
* Output validation
* Prompt-injection protection
* Tool authorization
* Audit logging
* Least-privilege access

---

# 20. Agent Communication

CWD can use different communication patterns depending on the requirement.

### Synchronous

```text
Coordinator
    ↓
Delegator
    ↓
Worker
```

Use when the user is waiting for the result.

### Asynchronous

```text
Coordinator
      ↓
Azure Service Bus
      ↓
Delegator
      ↓
Workers
```

Use for long-running or asynchronous business processes.

### Agent-to-Agent

```text
Coordinator
      ↓ A2A
Delegator
      ↓ A2A
Worker Agent
```

A2A can be used when independent agents need standardized agent-to-agent interaction.

### Tool integration

```text
Worker
   ↓
MCP
   ↓
Enterprise Tool
```

The key distinction:

> **A2A = Agent-to-Agent communication.**
> **MCP = Agent-to-Tool communication.**

---

# 21. Production Azure Architecture

```text
┌─────────────────────────────────────────────────────┐
│                  Business Users                     │
│       Teams | React UI | Microsoft 365 | API        │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│              Azure Front Door / WAF                 │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                Azure API Management                 │
│ Authentication | Rate Limit | Routing | Security   │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│                  CWD Platform                       │
│                                                     │
│                 Coordinator                        │
│                     │                               │
│       ┌─────────────┼─────────────┐                 │
│       ▼             ▼             ▼                 │
│ Manufacturing   Quality/FA    Supply Chain          │
│ Delegator       Delegator     Delegator             │
│       │             │             │                 │
│    Workers       Workers       Workers              │
└───────┬─────────────┬─────────────┬─────────────────┘
        │             │             │
        ▼             ▼             ▼
┌─────────────────────────────────────────────────────┐
│              AI / Knowledge Layer                   │
│ Azure OpenAI | Azure AI Foundry | Azure AI Search  │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│           Enterprise Integration Layer              │
│ MCP | APIs | Service Bus | A2A | Kafka              │
└─────────────────────────┬───────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│             onsemi Enterprise Systems               │
│ Manufacturing | Quality | Equipment | Supply Chain │
│ Engineering | ServiceNow | Data Platforms           │
└─────────────────────────────────────────────────────┘

        ┌───────────────────────────────────────┐
        │ Security & Governance                 │
        │ Entra ID | RBAC | Managed Identity   │
        │ Key Vault | DLP | Private Networking │
        └───────────────────────────────────────┘

        ┌───────────────────────────────────────┐
        │ Observability & Evaluation            │
        │ App Insights | Log Analytics | MLflow│
        │ Tracing | Evaluation | SIEM          │
        └───────────────────────────────────────┘
```

---

# 22. Production Deployment

CWD services can be deployed using:

| Azure Service                   | CWD Responsibility                          |
| ------------------------------- | ------------------------------------------- |
| **Azure Front Door**            | Global entry point / edge                   |
| **WAF**                         | Web security                                |
| **API Management**              | API gateway, throttling, policies           |
| **Entra ID**                    | Identity and authorization                  |
| **Azure AI Foundry**            | AI application/agent lifecycle capabilities |
| **Azure OpenAI**                | Foundation-model inference                  |
| **Azure AI Search**             | Enterprise RAG                              |
| **AKS / Container Apps**        | Coordinator, Delegators and Workers         |
| **Azure Service Bus**           | Reliable asynchronous messaging             |
| **Azure Functions**             | Event-driven/lightweight processing         |
| **Redis**                       | Cache and short-term working state          |
| **Cosmos DB**                   | Persistent application/execution state      |
| **Key Vault**                   | Secrets/certificates                        |
| **Application Insights**        | Application telemetry                       |
| **Log Analytics**               | Centralized logs                            |
| **MLflow**                      | Model/agent evaluation and lifecycle        |
| **Azure DevOps/GitHub Actions** | CI/CD                                       |

---

# 23. End-to-End Production Example

### Business request

> **"Analyze why Lot L1234 has a yield issue and determine whether an equipment problem caused it. If confirmed, create a ServiceNow ticket."**

### Step 1 — User

Request enters through React/Teams.

### Step 2 — APIM

* Authenticate request.
* Validate request.
* Generate correlation ID.
* Apply API policies.

### Step 3 — Coordinator

Understands:

```text
Intent:
Yield investigation

Required domains:
Yield + Equipment

Required actions:
Analyze yield
Analyze equipment
Correlate findings
Potentially create incident
```

### Step 4 — Coordinator delegates

```text
Yield Delegator
+
Equipment Delegator
```

### Step 5 — Yield Delegator

```text
Yield Worker
Defect Pareto Worker
Process Correlation Worker
```

### Step 6 — Equipment Delegator

```text
Equipment Health Worker
Alarm Analysis Worker
Maintenance History Worker
```

### Step 7 — Workers retrieve data

```text
Manufacturing Data
Equipment Data
Historical RCA
Quality Documents
```

### Step 8 — RCA

Workers identify:

```text
Yield Loss
      ↓
Defect D45
      ↓
Equipment EQ-102
      ↓
Recurring Temperature Alarm
      ↓
Probable Equipment-related Cause
```

### Step 9 — ServiceNow

Because the user has authorization:

```text
ServiceNow Worker
       ↓
MCP/API
       ↓
Create Incident
```

### Step 10 — Coordinator

Aggregates all results.

### Final business response

```text
Lot: L1234

Yield Impact:
-8%

Primary Defect:
D45

Probable Cause:
EQ-102 temperature instability

Evidence:
- Equipment alarm history
- Yield trend
- Historical incidents
- Process correlation

Confidence:
High

Recommended Action:
Inspect EQ-102 temperature-control subsystem.

ServiceNow:
Incident INC-XXXXX created.

Execution:
Completed successfully.
```

---

# 24. Architectural Value for onsemi

### 1. Manufacturing Productivity

Reduce the time engineers spend manually searching multiple systems.

### 2. Faster Failure Analysis

Combine images, process data, historical reports and engineering knowledge.

### 3. Improved Yield Investigation

Automatically correlate yield, defects, process and equipment information.

### 4. Quality and Reliability

Provide evidence-backed investigations and standardized RCA workflows. Quality and reliability are explicitly important areas for onsemi. ([onsemi][3])

### 5. Supply-Chain Visibility

Combine inventory, demand, capacity and supplier information.

### 6. Reusable AI Platform

New business capabilities can reuse the same:

```text
Security
+
Coordinator
+
Delegator Framework
+
Worker Framework
+
RAG
+
MCP
+
Observability
+
Evaluation
+
Deployment
```

### 7. Enterprise Governance

Every agent, tool call, retrieval operation and business action can be governed and traced.

---

# 25. Final Project Summary

> **CWD is a governed multi-agent enterprise AI orchestration platform designed around onsemi's manufacturing, engineering, quality, supply-chain and enterprise operations.**

The architecture uses a **Coordinator → Domain Delegator → Specialized Worker** model.

The **Coordinator understands the business request and determines which domains are required.**

The **Delegator decomposes the business problem into domain-specific tasks and selects specialized Workers.**

The **Workers execute those tasks using governed RAG, MCP tools, APIs, databases and enterprise systems.**

The results are then aggregated by the Coordinator into an **evidence-backed, actionable business outcome**.

The platform uses Azure services such as **Azure AI Foundry, Azure OpenAI, Azure AI Search, API Management, Entra ID, Service Bus, AKS/Container Apps, Key Vault, Application Insights and Log Analytics** to provide a production-ready foundation.

The strategic goal is:

> **Build CWD as a common AI execution platform for onsemi, where manufacturing, quality, failure analysis, equipment, engineering, supply chain and IT teams can build specialized AI capabilities on a shared, secure, observable and scalable architecture.**

**One important interview point:** don't say *“PSG = one Delegator, AMG = another Delegator, ISG = another Delegator.”* Those are onsemi's reportable operating segments. Instead say: **“I use operational/business capabilities as CWD Delegator boundaries, while PSG/AMG/ISG and product/end-market information can be used as business context, metadata and routing attributes.”** 
