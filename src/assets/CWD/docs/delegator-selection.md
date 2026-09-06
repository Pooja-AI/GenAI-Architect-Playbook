# How the Coordinator Determines When to Invoke a Delegator

## 1. Overview

In the CWD architecture, the **Coordinator is responsible for deciding whether an incoming user request requires downstream agent execution** and, if execution is required, **which Delegator should handle the business-domain work**.

The Coordinator does not automatically invoke a Delegator for every request.

Instead, it evaluates the request through a controlled decision process:

```text
User Request
     |
     v
Understand Intent
     |
     v
Identify Required Action
     |
     v
Does the request require downstream execution?
     |
   +---+---+
   |       |
  No      Yes
   |       |
   v       v
Respond   Identify Business Domain
Directly       |
               v
        Discover Delegator
               |
               v
        Validate Capability
               |
               v
        Authorize Execution
               |
               v
        Create Execution Plan
               |
               v
        Invoke Delegator via A2A
```

The key architectural principle is:

> **The LLM determines what the user is asking for; the Coordinator determines whether execution is required and controls the allowed execution path.**

---

# 2. When Does the Coordinator Invoke a Delegator?

The Coordinator first determines the **nature of the request**.

A request generally falls into one of four categories.

| Request Type                     | Example                                                    | Delegator Required? |
| -------------------------------- | ---------------------------------------------------------- | ------------------: |
| Simple conversation              | "Hello"                                                    |                  No |
| Knowledge/response only          | "What is CWD?"                                             |          Usually No |
| Enterprise information retrieval | "Show me the latest customer revenue"                      |                 Yes |
| Business workflow/action         | "Create a customer briefing from Salesforce and Snowflake" |                 Yes |

The important distinction is:

```text
Question that can be answered from conversation
                |
                v
          No Delegator

Business request requiring
enterprise data / tools / workflow
                |
                v
           Delegator
```

---

# 3. The Coordinator Evaluates the User Intent

The first step is to understand the user's actual business intent.

For example:

```text
User:
"Prepare a customer briefing for ABC Corporation."
```

The Coordinator does not simply classify this as:

```text
customer briefing
```

It interprets the request into structured information:

```json
{
  "intent": "create_customer_briefing",
  "domain": "sales",
  "entities": {
    "customer": "ABC Corporation"
  },
  "request_type": "business_workflow",
  "requires_enterprise_data": true,
  "requires_agent_execution": true,
  "expected_output": "customer briefing document"
}
```

This structured interpretation becomes the input to the routing decision.

---

# 4. Determine Whether Execution Is Required

The Coordinator evaluates several signals.

## 4.1 Does the request require enterprise data?

For example:

```text
"Get the latest revenue for customer ABC."
```

The answer may require:

```text
Salesforce
Snowflake
Oracle
Customer data
```

Therefore:

```text
Enterprise Data Required
        |
        v
Delegator likely required
```

---

## 4.2 Does the request require a tool or API?

Example:

```text
"Create a Salesforce opportunity for this customer."
```

The Coordinator identifies:

```text
Action = Create Opportunity
System = Salesforce
```

This cannot be completed through conversation alone.

Therefore the Coordinator routes the request downstream.

---

## 4.3 Does the request require multiple steps?

Example:

```text
"Prepare a customer briefing using sales data,
recent interactions, open opportunities and
recent customer activity."
```

The Coordinator recognizes multiple activities:

```text
1. Retrieve customer profile
2. Retrieve opportunities
3. Retrieve recent interactions
4. Retrieve customer activity
5. Generate briefing
```

This is a workflow rather than a simple response.

Therefore:

```text
Coordinator
      |
      v
Sales Delegator
      |
      +--> Worker: Customer Profile
      |
      +--> Worker: Opportunities
      |
      +--> Worker: Interactions
      |
      +--> Worker: Activity
      |
      +--> Worker: Briefing Generation
```

---

# 5. Determine the Business Domain

Once the Coordinator determines that downstream execution is required, it identifies the appropriate **business domain**.

For example:

```text
"Create a customer briefing"
              |
              v
          Sales Domain
```

Another request:

```text
"Analyze supplier delivery performance"
              |
              v
      Supply Chain Domain
```

Another:

```text
"Summarize employee policy information"
              |
              v
           HR Domain
```

The Coordinator therefore establishes:

```text
User Intent
     |
     v
Business Domain
```

---

# 6. How the Appropriate Delegator Is Selected

The Coordinator should **not hard-code Delegator selection**.

Instead, the production architecture uses the **Agent Registry** as the source of available agent capabilities.

Conceptually:

```text
                    Agent Registry
                         |
       +-----------------+------------------+
       |                 |                  |
       v                 v                  v
 Sales Delegator   Finance Delegator   HR Delegator
       |                 |                  |
   capabilities      capabilities      capabilities
   domain            domain            domain
   endpoint          endpoint          endpoint
   status             status            status
```

The Coordinator queries the registry using the identified business intent/domain/capability.

For example:

```text
Intent:
create_customer_briefing

Domain:
Sales

Required capability:
customer_briefing
```

The registry may return:

```json
{
  "agent_id": "sales-delegator",
  "domain": "sales",
  "capabilities": [
    "customer_briefing",
    "opportunity_analysis",
    "customer_activity"
  ],
  "endpoint": "...",
  "status": "healthy"
}
```

The Coordinator then selects this Delegator.

---

# 7. Delegator Selection Is Capability-Based

The important point is that the Coordinator should not think:

```python
if domain == "sales":
    delegator = "sales_delegator"
```

That approach creates tight coupling.

Instead:

```text
Intent
  |
  v
Required Capability
  |
  v
Agent Registry
  |
  v
Find agents supporting capability
  |
  v
Validate agent
  |
  v
Select Delegator
```

This allows the platform to evolve.

For example:

```text
Today:

Sales Request
      |
      v
Sales Delegator
```

Later:

```text
Sales Request
      |
      v
Agent Registry
      |
      +--> Sales Delegator A
      |
      +--> Sales Delegator B
      |
      +--> Specialized Customer Intelligence Agent
```

The Coordinator can dynamically discover the appropriate execution capability.

---

# 8. What Criteria Does the Coordinator Use?

Delegator selection can consider multiple attributes.

### 8.1 Domain

```text
Sales
Finance
HR
Supply Chain
Commercial Services
Customer Experience
```

### 8.2 Capability

Example:

```text
customer_briefing
opportunity_analysis
financial_analysis
supplier_analysis
```

### 8.3 Agent Status

The Coordinator should not route work to an unhealthy or unavailable agent.

```text
Agent Registry
     |
     +--> healthy
     +--> unhealthy
     +--> unavailable
```

### 8.4 Authorization

The user must be authorized to perform the requested operation.

```text
User
 |
 v
Coordinator
 |
 v
Authorization / Policy
 |
 +---- Not Allowed ---> Stop
 |
 v
Allowed
 |
 v
Delegator
```

### 8.5 Capability Match

The Delegator must actually support the requested capability.

### 8.6 Execution Constraints

The Coordinator may also consider:

```text
Priority
Task type
Execution mode
Required data
Required tools
Timeout
Business policy
```

---

# 9. Authorization Happens Before Delegator Execution

One of the most important CWD principles is:

> **The Coordinator must not invoke downstream business execution simply because the LLM decided that a Delegator exists.**

The execution path should include authorization.

```text
User Request
     |
     v
Intent Identification
     |
     v
Domain Identification
     |
     v
Authorization
     |
     +---- Denied
     |      |
     |      v
     |    Stop
     |
     v
Capability Discovery
     |
     v
Delegator Selection
     |
     v
A2A Invocation
```

This prevents the LLM from becoming an authorization mechanism.

---

# 10. Coordinator vs LLM in Delegator Selection

This distinction is critical.

### LLM

The LLM helps determine:

```text
"What is the user asking for?"
"What business domain does it relate to?"
"What capabilities appear necessary?"
"What workflow may be appropriate?"
```

### Coordinator

The Coordinator determines:

```text
"Is this execution allowed?"
"Which registered agent supports the capability?"
"Is that agent available?"
"How should the request be routed?"
"How should execution be tracked?"
```

Therefore:

```text
LLM
 |
 | understands / recommends
 v
Coordinator
 |
 | validates / authorizes / selects
 v
Agent Registry
 |
 | discovers
 v
Delegator
```

The LLM does **not** directly call a Delegator.

---

# 11. How the Coordinator Determines the Execution Path

After selecting a Delegator, the Coordinator determines how the task should be executed.

For example:

### Simple workflow

```text
Coordinator
     |
     v
Sales Delegator
     |
     v
Worker
```

### Sequential workflow

```text
Coordinator
     |
     v
Sales Delegator
     |
     v
Worker A
     |
     v
Worker B
     |
     v
Worker C
```

### Parallel workflow

```text
                 +--> Worker A
                 |
Coordinator --> Delegator --> Worker B
                 |
                 +--> Worker C
```

### Parallel + aggregation

```text
                 +--> Salesforce Worker
                 |
Coordinator --> Sales Delegator
                 |
                 +--> Snowflake Worker
                 |
                 +--> SharePoint Worker
                         |
                         v
                    Aggregation
                         |
                         v
                    Final Result
```

The Coordinator determines the **high-level execution strategy**, while the Delegator manages domain-specific decomposition and worker execution.

---

# 12. Coordinator-to-Delegator Invocation Through A2A

Once the Coordinator has selected the Delegator, it does not directly invoke a Worker.

The production boundary is:

```text
Coordinator
      |
      v
A2A
      |
      v
Delegator
      |
      v
Workers
```

The Coordinator creates an A2A task containing information such as:

```json
{
  "task_id": "task-123",
  "run_id": "run-456",
  "correlation_id": "corr-789",
  "source_agent": "cwd-coordinator",
  "target_agent": "sales-delegator",
  "intent": "create_customer_briefing",
  "domain": "sales",
  "context": {
    "customer": "ABC Corporation"
  }
}
```

The A2A layer then handles communication with the target Delegator.

---

# 13. Complete Decision Flow

The overall decision process is:

```text
                    User Request
                         |
                         v
                +------------------+
                | Coordinator      |
                | receives request |
                +--------+---------+
                         |
                         v
                 Understand Intent
                         |
                         v
                 Identify Actions
                         |
                         v
              Is execution required?
                    /          \
                  No            Yes
                  |              |
                  v              v
             Generate      Identify Domain
              Response            |
                                   v
                           Identify Capability
                                   |
                                   v
                            Authorization
                              /       \
                           Denied     Allowed
                             |           |
                             v           v
                           Stop    Query Agent Registry
                                         |
                                         v
                                Find Matching Delegator
                                         |
                                         v
                                  Validate Availability
                                         |
                                         v
                                  Create Plan
                                         |
                                         v
                                  Create A2A Task
                                         |
                                         v
                              Invoke Delegator
                                         |
                                         v
                                  Delegator
                                         |
                                         v
                                     Workers
                                         |
                                         v
                                  Result
                                         |
                                         v
                                  Coordinator
                                         |
                                         v
                                Aggregate / Validate
                                         |
                                         v
                                  Final Response
```

---

# 14. Example: Customer Briefing Request

Consider:

```text
"Create a briefing for customer ABC using
their current opportunities, revenue and recent
interactions."
```

### Step 1 — Intent

```text
Intent = create_customer_briefing
```

### Step 2 — Domain

```text
Domain = Sales
```

### Step 3 — Required capabilities

```text
customer_profile
opportunity_analysis
revenue_analysis
customer_interactions
briefing_generation
```

### Step 4 — Execution requirement

```text
Enterprise data required = Yes
Multiple operations = Yes
Business workflow = Yes

Therefore:
Delegator required = Yes
```

### Step 5 — Authorization

```text
User
  |
  v
Policy / Entitlement Check
  |
  v
Allowed
```

### Step 6 — Agent Registry

```text
Search:

domain = sales
capability = customer_briefing
```

Result:

```text
sales-delegator
```

### Step 7 — Execution Plan

```text
retrieve_customer_profile
        |
retrieve_opportunities
        |
retrieve_revenue
        |
retrieve_interactions
        |
        +---------+
                  |
                  v
        generate_customer_briefing
```

### Step 8 — A2A

```text
Coordinator
     |
     | A2A Task
     v
Sales Delegator
```

### Step 9 — Delegator Execution

```text
Sales Delegator
      |
      +--> Customer Worker
      |
      +--> Opportunity Worker
      |
      +--> Revenue Worker
      |
      +--> Interaction Worker
      |
      +--> Briefing Worker
```

### Step 10 — Result

```text
Workers
   |
   v
Sales Delegator
   |
   v
Coordinator
   |
   v
Final Customer Briefing
```

---

# 15. What Happens If No Delegator Is Found?

The Coordinator should not blindly execute the request.

Example:

```text
Intent:
specialized_supply_chain_forecast

Agent Registry:
No matching capability
```

The Coordinator should return a controlled outcome:

```text
No supported execution capability was found.
```

It should not:

```text
LLM -> arbitrary API
```

or:

```text
LLM -> unknown agent
```

This preserves governance and prevents uncontrolled execution.

---

# 16. What If Multiple Delegators Match?

The registry may return multiple candidates.

For example:

```text
Capability:
customer_analysis

Candidates:

Sales Delegator A
Sales Delegator B
Customer Intelligence Agent
```

The Coordinator can apply selection rules such as:

```text
1. Capability match
2. Domain match
3. Authorization
4. Agent health
5. Availability
6. Execution policy
7. Priority
8. Routing policy
```

Then select the appropriate agent.

Conceptually:

```python
candidates = registry.find(
    domain="sales",
    capability="customer_analysis"
)

authorized = policy.filter(candidates)

healthy = health.filter(authorized)

delegator = routing.select(healthy)
```

The exact production implementation can vary, but the architectural responsibility remains with the Coordinator/platform routing layer.

---

# 17. How LangGraph Fits Into This

LangGraph controls the **workflow state transitions** inside the Coordinator.

Conceptually:

```text
validate_request
       |
       v
classify_request
       |
       v
authorize_request
       |
       v
discover_delegator
       |
       v
create_plan
       |
       v
submit_a2a_task
       |
       v
aggregate_result
       |
       v
save_state
```

So:

```text
LangGraph
   |
   | controls state/workflow transitions
   v
Coordinator
   |
   | decides business execution path
   v
A2A
   |
   v
Delegator
```

LangGraph does not replace the Agent Registry or A2A.

---

# 18. Coordinator and Delegator Responsibility Boundary

This separation is important for CWD.

| Responsibility                          | Coordinator |                       Delegator |
| --------------------------------------- | ----------: | ------------------------------: |
| Understand user intent                  |         Yes |                              No |
| Enterprise-level routing                |         Yes |                              No |
| Determine whether execution is required |         Yes |                              No |
| Select business domain                  |         Yes |                 Domain-specific |
| Discover Delegator                      |         Yes |                              No |
| Enterprise authorization                |         Yes |                   Domain policy |
| Create high-level execution plan        |         Yes |                              No |
| A2A invocation                          |         Yes | Yes, when calling another agent |
| Domain task decomposition               |          No |                             Yes |
| Select Workers                          |          No |                             Yes |
| Execute business tools                  |          No |                 Through Workers |
| Aggregate domain results                |          No |                             Yes |
| Final response orchestration            |         Yes |                              No |

The boundary can be summarized as:

```text
Coordinator
= "Which business capability should handle this request?"

Delegator
= "How should my domain handle this business task?"
```

---

# 19. Production-Level Control Model

The complete CWD control model is therefore:

```text
                 USER
                  |
                  v
             COORDINATOR
                  |
       +----------+----------+
       |          |          |
       v          v          v
    Intent     Policy     Context
       |          |          |
       +----------+----------+
                  |
                  v
          Execution Required?
                  |
                  v
          Capability Discovery
                  |
                  v
           AGENT REGISTRY
                  |
                  v
         DELEGATOR SELECTION
                  |
                  v
               A2A
                  |
                  v
             DELEGATOR
                  |
                  v
              WORKERS
                  |
                  v
        MCP / Tools / APIs
                  |
                  v
        Enterprise Systems
```

Observability, security, correlation IDs, state management and governance operate across this entire flow.

---

# 20. Key Architectural Principle

The most important distinction is:

```text
LLM
  |
  | understands intent
  v
Coordinator
  |
  | determines execution requirement
  | validates authorization
  | identifies capability
  | discovers appropriate agent
  | creates execution plan
  | controls workflow
  v
A2A
  |
  v
Delegator
  |
  | decomposes domain task
  v
Workers
  |
  v
Enterprise Systems
```

Therefore:

> **The Coordinator invokes a Delegator when the user's intent requires a governed downstream business capability, enterprise data, tool execution, or multi-step workflow. The appropriate Delegator is selected by matching the required business domain and capability against the registered agent metadata, followed by authorization, availability and routing-policy checks. The selected Delegator is then invoked through the A2A boundary and takes responsibility for domain-level task decomposition and Worker execution.**

## One-Line Definition

```text
Coordinator = Decide WHEN to execute + Decide WHERE to execute + Control HOW execution proceeds
```

And specifically for Delegators:

```text
User Intent
    ↓
Execution Required?
    ↓
Business Domain
    ↓
Required Capability
    ↓
Authorization
    ↓
Agent Registry
    ↓
Delegator Selection
    ↓
A2A Invocation
    ↓
Delegator Execution
```
