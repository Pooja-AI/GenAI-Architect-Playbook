# Azure SQL Database

For your **CWD Agentic AI architecture**, Azure SQL Database is the **structured relational data layer**.

> **Azure SQL stores and queries structured enterprise data using SQL, transactions, relationships, constraints, and controlled access.**

For your CWD architecture:

* **Azure SQL → structured transactional/business data**
* **Cosmos DB → agent/application state**
* **Redis → fast temporary memory/cache**
* **Azure AI Search → enterprise knowledge retrieval**
* **Blob Storage → files/documents**

---

# 1. Where Azure SQL fits in CWD

```text
                    CWD
                     ↓
                Coordinator
                     ↓
                 Delegator
                     ↓
                  Worker
                     ↓
              SQL Agent Tool
                     ↓
             Azure SQL Database
                     ↓
        Structured Enterprise Data
```

The **Worker/Agent should not directly generate arbitrary SQL and access everything**.

Instead:

```text
Agent
  ↓
Governed Tool
  ↓
Validated SQL / Stored Procedure
  ↓
Authorization
  ↓
Azure SQL
  ↓
Structured Result
```

This is much safer for enterprise systems.

---

# 2. What kind of data belongs in Azure SQL?

Typical structured data:

* customers
* products
* orders
* inventory
* suppliers
* equipment
* production records
* transactions
* financial records
* employee/business records
* operational measurements
* reference/master data

For an onsemi-like CWD environment:

```text id="sql1"
Equipment
Equipment_ID
Equipment_Type
Fab
Status
Installation_Date
```

Another table:

```text id="sql2"
Equipment_Maintenance
Maintenance_ID
Equipment_ID
Maintenance_Date
Maintenance_Type
Technician
Status
```

Another:

```text id="sql3"
Production_Lot
Lot_ID
Product_ID
Fab
Process_Step
Yield
Status
```

These are highly structured relational datasets.

---

# 3. Why SQL instead of RAG?

Suppose the user asks:

> **"What was the yield for Lot L12345?"**

This is a structured data question.

You don't necessarily need RAG.

```text id="sql4"
User
 ↓
Coordinator
 ↓
Manufacturing Delegator
 ↓
Yield Worker
 ↓
SQL Tool
 ↓
Azure SQL
 ↓
Yield = 92.4%
```

The answer should come from the authoritative transactional/operational data.

---

# 4. SQL vs RAG

This is extremely important for your interviews.

### Question 1

> "What was the yield for Lot L12345?"

Use:

```text id="sql5"
Azure SQL
```

### Question 2

> "What does the manufacturing SOP say about low-yield investigation?"

Use:

```text id="sql6"
Azure AI Search
```

### Question 3

> "Why did Lot L12345 have low yield?"

Potentially use **both**:

```text id="sql7"
SQL
 ↓
Actual yield/process data

+
Azure AI Search
 ↓
SOPs / historical RCA / engineering reports

+
LLM
 ↓
Reasoning
```

This is where Agentic RAG becomes powerful.

---

# 5. Agentic SQL Workflow

The agent can determine:

> "This question requires structured database information."

```text id="sql8"
User Question
      ↓
Coordinator
      ↓
Manufacturing Delegator
      ↓
Data / SQL Worker
      ↓
Query Planning
      ↓
Governed SQL Tool
      ↓
Azure SQL
      ↓
Structured Result
      ↓
LLM
      ↓
Business Answer
```

---

# 6. Example: Natural Language → SQL

User:

> "Show the average yield for Fab-X for the last 7 days."

The agent understands:

```text id="sql9"
Metric = Yield
Location = Fab-X
Time = Last 7 days
Aggregation = Average
```

It could produce a controlled query such as:

```sql
SELECT AVG(yield)
FROM production_lot
WHERE fab = @fab
  AND production_date >= @start_date;
```

The application should preferably use **parameterized queries** rather than concatenating user input.

---

# 7. Don't Give the LLM Unlimited SQL Access

Bad architecture:

```text id="sql10"
User
 ↓
LLM
 ↓
"Generate any SQL you want"
 ↓
Production Database
```

This creates significant risks.

The model could potentially generate:

```sql
DELETE FROM production_lot;
```

or query data the user shouldn't see.

---

# 8. Governed SQL Tool

Better:

```text id="sql11"
User
 ↓
Agent
 ↓
SQL Tool
 ↓
Validate Request
 ↓
Authorization
 ↓
Parameterized Query / Stored Procedure
 ↓
Azure SQL
 ↓
Structured Result
```

The tool can expose limited capabilities:

```text id="sql12"
get_equipment_status()
get_lot_yield()
get_inventory()
get_production_history()
get_supplier_status()
```

Instead of giving the agent unrestricted database access.

---

# 9. Azure SQL + MCP

This fits directly into your CWD architecture.

```text id="sql13"
Agent
 ↓
MCP Client
 ↓
MCP Server
 ↓
SQL Tool
 ↓
Azure SQL
 ↓
Result
```

For example:

```text id="sql14"
Yield Worker
     ↓
MCP Client
     ↓
Manufacturing MCP Server
     ↓
get_lot_yield()
     ↓
Azure SQL
```

MCP standardizes how the agent discovers and invokes the tool.

The SQL database remains the underlying data store.

---

# 10. Azure SQL + Azure Functions

A lightweight SQL tool can be implemented using Azure Functions.

```text id="sql15"
Agent
 ↓
MCP / Tool
 ↓
Azure Function
 ↓
Azure SQL
 ↓
Result
```

Example:

```text id="sql16"
get_equipment_status(EQ-102)
```

Function:

```text id="sql17"
Validate equipment ID
        ↓
Check authorization
        ↓
Execute parameterized SQL
        ↓
Return JSON
```

This is a good pattern for small, focused operations.

---

# 11. Azure SQL + Container Apps / AKS

For more complex data services:

```text id="sql18"
Agent Worker
    ↓
Container App / AKS Service
    ↓
Data Access Layer
    ↓
Azure SQL
```

The service can provide:

* connection pooling
* validation
* business rules
* transactions
* retry handling
* caching
* auditing

---

# 12. Transactions

One major advantage of relational databases is **transactional consistency**.

Suppose a Worker needs to:

```text id="sql19"
Create production record
+
Update inventory
+
Update transaction status
```

You may need these operations to succeed together.

Conceptually:

```text id="sql20"
BEGIN TRANSACTION

Create Record
Update Inventory
Update Status

COMMIT
```

If something fails:

```text id="sql21"
ROLLBACK
```

This is important for transactional business operations.

---

# 13. Read vs Write Operations

Agentic applications should distinguish carefully between:

### Read

```text id="sql22"
get_inventory()
get_equipment_status()
get_lot_yield()
```

Usually lower risk.

### Write

```text id="sql23"
update_inventory()
create_record()
update_status()
```

Higher risk.

### Destructive

```text id="sql24"
DELETE
DROP
TRUNCATE
```

These should be heavily restricted or completely unavailable to an autonomous agent.

---

# 14. Human Approval for High-Risk Actions

For sensitive writes:

```text id="sql25"
Agent
 ↓
Determine Action
 ↓
Policy Check
 ↓
Human Approval
 ↓
SQL Tool
 ↓
Azure SQL
```

Example:

> "Update production status to HOLD."

The agent shouldn't necessarily make that decision autonomously.

You can require:

```text id="sql26"
Agent recommendation
       ↓
Approval
       ↓
Authorized SQL operation
```

This is especially important for operational or financial workflows.

---

# 15. Security

A strong enterprise architecture:

```text id="sql27"
User
 ↓
Entra ID
 ↓
CWD Authorization
 ↓
Delegator / Worker
 ↓
Managed Identity
 ↓
Azure SQL
```

Use:

* Microsoft Entra authentication
* Managed Identity
* Azure RBAC where applicable
* database roles/permissions
* least privilege
* private endpoints
* network isolation
* encryption
* auditing
* monitoring
* parameterized queries
* row-level security where appropriate

---

# 16. Row-Level Security

Suppose the SQL database contains:

```text id="sql28"
Fab-X data
Fab-Y data
Fab-Z data
```

A user may only be authorized for Fab-X.

The application/database security layer can enforce:

```text id="sql29"
User
 ↓
Identity
 ↓
Authorization
 ↓
Row-Level Security
 ↓
Only authorized rows
```

This is much safer than asking the LLM:

> "Please don't show Fab-Y data."

Again:

> **The LLM should not be the security boundary.**

---

# 17. SQL + Agentic RAG

This is a very important enterprise pattern.

Question:

> **"Why did Fab-X yield decrease last week?"**

The agent might need both structured and unstructured data.

```text id="sql30"
                    User
                     ↓
                Coordinator
                     ↓
             Manufacturing Agent
                     ↓
          ┌──────────┴──────────┐
          ↓                     ↓
      Azure SQL            AI Search
          ↓                     ↓
  Yield / Production       RCA / SOPs /
      Metrics              Engineering Docs
          └──────────┬──────────┘
                     ↓
                  LLM
                     ↓
              Grounded Analysis
```

SQL provides **facts and metrics**.

AI Search provides **context and knowledge**.

The LLM correlates them.

---

# 18. Example

SQL returns:

```text id="sql31"
Fab-X yield:

Monday     96%
Tuesday    95%
Wednesday  91%
Thursday   89%
Friday     88%
```

Azure AI Search retrieves:

```text id="sql32"
Historical RCA:
Temperature excursion during Process Step X
```

The agent can reason:

```text id="sql33"
Yield ↓
   +
Process Step X issue
   +
Equipment thermal excursion
   ↓
Probable contributing factor
```

The answer can cite both:

* structured SQL result
* historical engineering document

---

# 19. SQL for Analytics

Azure SQL can also support operational analytics.

Examples:

```text id="sql34"
Average yield
Failure frequency
Equipment downtime
Inventory levels
Production volume
Defect rates
```

A Worker can execute controlled analytical queries.

For heavier analytics workloads, you might use dedicated analytical platforms such as:

* Azure Data Lake Storage
* Azure Databricks
* Microsoft Fabric
* Synapse

depending on the enterprise architecture.

Don't force Azure SQL to become a massive analytical warehouse if another platform is better suited.

---

# 20. Azure SQL + Redis

These can work together.

```text id="sql35"
Agent
 ↓
Redis
 ↓
Cache Hit?
 ├── Yes → Return
 │
 └── No
      ↓
   Azure SQL
      ↓
   Result
      ↓
    Redis
```

Example:

> "What is the current status of EQ-102?"

If the data can safely be cached for a short period:

```text id="sql36"
Redis
EQ-102 → RUNNING
```

But for critical real-time decisions, query the authoritative source instead of blindly trusting a stale cache.

---

# 21. Azure SQL + Cosmos DB

Don't confuse their roles.

### Azure SQL

Relational business data:

```text id="sql37"
Equipment
Products
Orders
Inventory
Transactions
```

### Cosmos DB

Agent/application state:

```text id="sql38"
Session
Task
Run
Agent metadata
Workflow state
```

Combined:

```text id="sql39"
                 CWD
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
   Azure SQL           Cosmos DB
        ↓                   ↓
Business Data         Agent State
```

---

# 22. Complete CWD Example

User:

> **"Why did EQ-102 fail and what was the impact on production?"**

### Step 1 — Coordinator

Identifies:

```text id="sql40"
Intent = Equipment Failure Analysis
```

### Step 2 — Delegator

Selects:

```text id="sql41"
Equipment Worker
+
Production Analytics Worker
+
Historical RAG Worker
```

### Step 3 — SQL Worker

Queries:

```text id="sql42"
Azure SQL
 ↓
Equipment status
 ↓
Production records
 ↓
Downtime
 ↓
Affected lots
```

### Step 4 — RAG Worker

Queries:

```text id="sql43"
Azure AI Search
 ↓
Historical failure reports
 ↓
Maintenance reports
 ↓
RCA documents
```

### Step 5 — Correlation

Agent combines:

```text id="sql44"
Equipment Failure
       +
Production Impact
       +
Historical Evidence
       ↓
Root Cause Analysis
```

### Step 6 — Final Answer

Example:

> EQ-102 experienced a thermal-related failure during Process Step X. The failure resulted in 4.5 hours of downtime and affected 12 production lots. Historical failure reports show a similar thermal excursion pattern.

The answer is based on **structured data + enterprise knowledge**.

---

# 23. Production Architecture

```text id="sql45"
                         User
                           ↓
                     Front Door/WAF
                           ↓
                         APIM
                           ↓
                      Coordinator
                           ↓
                       Delegator
                           ↓
                   Specialized Worker
                           ↓
                  ┌────────┴─────────┐
                  ↓                  ↓
             SQL Tool            RAG Tool
                  ↓                  ↓
            Azure SQL          Azure AI Search
                  ↓                  ↓
             Structured        Unstructured
                Data             Knowledge
                  └────────┬─────────┘
                           ↓
                          LLM
                           ↓
                    Grounded Answer
```

---

# 24. Strong Solution Architect Interview Answer

> **"In my CWD architecture, I would use Azure SQL Database for structured enterprise data such as equipment, production, inventory, transactional and operational records. I would expose that data to agents through governed tools rather than allowing the LLM unrestricted database access. A Worker could invoke a parameterized query or stored procedure through an MCP or application tool, with identity, authorization and input validation enforced before accessing SQL. For transactional updates, I would use SQL transactions and stronger controls for write operations, potentially requiring human approval for high-impact actions. For enterprise questions that require both structured facts and unstructured knowledge, I would combine Azure SQL with Azure AI Search—for example, retrieving actual yield and equipment metrics from SQL while retrieving historical RCA reports from Search. The LLM would then correlate those sources and generate a grounded response."**

---

# Final mental model

```text id="sql46"
Azure SQL
     ↓
"Structured business facts"

Azure AI Search
     ↓
"Enterprise knowledge"

Cosmos DB
     ↓
"Agent/application state"

Redis
     ↓
"Fast temporary context"

Blob Storage
     ↓
"Original files"
```

### One sentence to remember

> **Azure SQL is the governed structured-data layer for CWD agents—Workers use controlled SQL tools to retrieve or update transactional enterprise data, while Agentic RAG can combine those structured facts with Azure AI Search knowledge to produce grounded business insights.**
