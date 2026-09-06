Markdown

````
# How the Coordinator Interprets User Requests and Determines the Execution Path

## 1. Overview

The Coordinator is the **enterprise-level decision and orchestration component** of CWD.

Its responsibility is to convert an incoming user request into a governed execution plan and then route that plan to the appropriate Delegator, Worker, tools, or enterprise systems.

The Coordinator does not simply forward the user's message to an LLM. It performs a controlled sequence of activities:

> **Understand → Classify → Identify actions → Validate → Authorize → Plan → Discover → Route → Coordinate → Aggregate → Respond**

The LLM provides reasoning and interpretation, while the Coordinator controls execution, security, state, and routing.

---

## 2. Incoming User Request

A request may arrive through:

- Microsoft Teams
- Microsoft 365
- React-based application
- Enterprise chat interface
- API integration

### Example request

> "Prepare a customer briefing for customer ABC using the latest sales information, open opportunities, and recent customer interactions."

The request is not a single database query. It may require:

1. Identifying the customer.
2. Retrieving sales information.
3. Retrieving open opportunities.
4. Retrieving recent customer interactions.
5. Combining the results.
6. Generating a customer briefing.
7. Applying data-access and response-governance rules.

The Coordinator must determine that this is a **multi-step business workflow**.

---

## 3. Step 1: Receive and Normalize the Request

The Gateway first receives the request and passes a normalized request to the Coordinator.

### Example normalized request

```json
{
  "user_id": "user-123",
  "session_id": "session-456",
  "message_id": "message-789",
  "channel": "teams",
  "message": "Prepare a customer briefing for customer ABC",
  "tenant_id": "onsemi",
  "roles": ["sales-user"],
  "correlation_id": "corr-001"
}
````

The Coordinator creates or propagates execution identifiers such as:

```
session_id
task_id
run_id
turn_id
step_id
correlation_id
```

These identifiers allow the platform to trace the request from the user interface through every agent, tool, and enterprise system.

## 4. Step 2: Understand the User's Intent

The Coordinator uses an LLM to interpret the meaning of the request.

The LLM analyzes:

* What the user wants

* The business objective

* Important entities

* Required information

* Expected output

* Whether the request requires action or only information

* Whether multiple capabilities are involved

* Whether clarification is required

### Example interpretation

User request:

> "Prepare a customer briefing for customer ABC."

Interpreted intent:

JSON

```
{
  "intent": "create_customer_briefing",
  "domain": "sales",
  "entity": {
    "type": "customer",
    "value": "ABC"
  },
  "output_type": "business_document",
  "requires_multiple_actions": true,
  "requires_enterprise_data": true
}
```

The LLM interprets the request, but the Coordinator remains responsible for deciding whether the interpretation is valid and what happens next.

## 5. Step 3: Identify the Required Actions

After understanding the intent, the Coordinator determines the actions needed to fulfill the request.

For example:

```
Create customer briefing
        │
        ├── Identify customer
        ├── Retrieve sales information
        ├── Retrieve open opportunities
        ├── Retrieve customer interactions
        ├── Consolidate results
        ├── Generate briefing
        └── Return governed response
```

The Coordinator converts the user's natural-language request into a structured task plan.

### Example action plan

JSON

```
{
  "intent": "create_customer_briefing",
  "actions": [
    {
      "action": "retrieve_customer_profile",
      "source": "customer_system"
    },
    {
      "action": "retrieve_sales_opportunities",
      "source": "sales_system"
    },
    {
      "action": "retrieve_recent_interactions",
      "source": "customer_interaction_system"
    },
    {
      "action": "generate_customer_briefing",
      "source": "briefing_worker"
    }
  ]
}
```

The actions are logical business actions, not necessarily direct API calls. The appropriate Delegator and Workers determine how those actions are executed.

## 6. Step 4: Determine Whether Clarification Is Required

The Coordinator checks whether the request contains enough information to proceed.

### Example

> "Prepare a customer briefing."

The Coordinator may need to ask:

* Which customer?

* What time period should be covered?

* What type of briefing is required?

* Is the briefing intended for an internal or external audience?

### Clarification decision

```
Is the request sufficiently complete?
        │
        ├── No → Ask a clarification question
        │
        └── Yes → Continue execution
```

This prevents the platform from executing an incorrect or ambiguous workflow.

## 7. Step 5: Validate the Request

Before execution, the Coordinator validates the request against platform rules.

Validation may include:

* Required fields

* Supported request type

* Valid customer or business entity

* Input format

* Request size

* Allowed channel

* Duplicate or repeated request detection

* Prompt-injection and unsafe-input checks

* Whether the requested operation is supported

### Example

```
Request: Create customer briefing
Customer: ABC
Required information: Present
Supported workflow: Yes
Input validation: Passed
```

If validation fails, the Coordinator returns a controlled error or requests additional information.

## 8. Step 6: Enforce Authorization and Governance

The Coordinator must determine whether the user is allowed to perform the requested operation and access the required data.

Authorization is checked before enterprise data is retrieved.

### Example

```
User request
    │
    ▼
Identify required data
    │
    ▼
Check user entitlement
    │
    ├── Not authorized → Deny or restrict request
    │
    └── Authorized → Continue
```

The Coordinator may evaluate:

* User identity

* Entra ID roles and groups

* Domain permissions

* Data classification

* Customer or account restrictions

* Required Snowflake roles

* Delegator and Worker permissions

* Tool-level access policies

* Output restrictions

### Important principle

> The LLM must never decide independently that a user is authorized to access enterprise data.

The Coordinator and governed policy services enforce authorization. The LLM can help interpret the request, but it cannot bypass security controls.

## 9. Step 7: Classify the Request and Identify the Business Domain

The Coordinator determines which business domain owns the request.

### Example classification

|
Request

|

Domain

|

Likely Delegator

|
| --- | --- | --- |
|

Create customer briefing

|

Sales

|

Sales Delegator

|
|

Analyze quarterly revenue

|

Finance / Business Analysis

|

Finance or Business Analyst Delegator

|
|

Schedule a customer meeting

|

Calendar

|

Calendar Delegator

|
|

Summarize supplier performance

|

Supply Chain

|

Supply Chain Delegator

|
|

Retrieve employee policy information

|

HR

|

HR Delegator

|
|

Investigate product quality issue

|

Quality

|

Quality Delegator

|

### Example

JSON

```
{
  "intent": "create_customer_briefing",
  "domain": "sales",
  "delegator_capability": "customer_briefing",
  "confidence": 0.96
}
```

The Coordinator does not need to hard-code every Delegator. It can use the Agent Registry to discover agents based on capabilities, policies, health, and availability.

## 10. Step 8: Discover the Appropriate Delegator

The Coordinator queries the Agent Registry to identify the appropriate domain agent.

### Example registry lookup

```
Required capability:
    customer_briefing

Domain:
    sales

Required operation:
    retrieve_and_generate

Security requirements:
    internal_sales_data
```

### Registry response

JSON

```
{
  "agent_id": "sales-delegator",
  "agent_type": "delegator",
  "domain": "sales",
  "capabilities": [
    "customer_briefing",
    "opportunity_analysis",
    "customer_summary"
  ],
  "endpoint": "https://sales-delegator.internal",
  "status": "healthy"
}
```

The Coordinator evaluates:

* Agent capability

* Agent health

* Supported operations

* Security requirements

* Version

* Endpoint

* Availability

* Domain ownership

The registry enables dynamic discovery instead of requiring the Coordinator to contain every business-specific routing rule.

## 11. Step 9: Select the Execution Pattern

The Coordinator determines how the request should be executed.

### Common execution patterns

#### A. Direct Delegator execution

Used when one domain agent can complete the request.

```
User
  ↓
Coordinator
  ↓
Sales Delegator
  ↓
Worker
  ↓
Enterprise System
```

#### B. Sequential execution

Used when one action depends on the result of another.

```
Retrieve customer
      ↓
Retrieve opportunities
      ↓
Generate briefing
```

#### C. Parallel execution

Used when multiple actions can run independently.

```
                 ┌── Retrieve sales data ──────┐
Coordinator ─────┼── Retrieve opportunities ───┼── Aggregate
                 └── Retrieve interactions ────┘
```

#### D. Multi-domain execution

Used when the request requires multiple Delegators.

```
Coordinator
    │
    ├── Sales Delegator
    ├── Finance Delegator
    └── Customer Experience Delegator
            │
            ▼
       Consolidated result
```

#### E. Human-in-the-loop execution

Used when the operation requires approval or confirmation.

```
Coordinator
    ↓
Prepare proposed action
    ↓
Request user approval
    ↓
Execute approved action
```

## 12. Step 10: Create the Execution Plan

The Coordinator creates a structured plan containing:

* Selected Delegator

* Required actions

* Execution order

* Parallelization opportunities

* Required context

* Required tools

* Authorization requirements

* Timeout and retry policy

* Expected output

* Correlation identifiers

### Example execution plan

JSON

```
{
  "task_id": "task-001",
  "intent": "create_customer_briefing",
  "delegator": "sales-delegator",
  "execution_mode": "parallel_then_aggregate",
  "steps": [
    {
      "step_id": "step-001",
      "action": "retrieve_customer_profile",
      "worker": "customer-profile-worker"
    },
    {
      "step_id": "step-002",
      "action": "retrieve_sales_opportunities",
      "worker": "opportunity-worker"
    },
    {
      "step_id": "step-003",
      "action": "retrieve_recent_interactions",
      "worker": "interaction-worker"
    },
    {
      "step_id": "step-004",
      "action": "generate_customer_briefing",
      "worker": "briefing-generation-worker",
      "depends_on": [
        "step-001",
        "step-002",
        "step-003"
      ]
    }
  ]
}
```

The Coordinator determines the high-level plan. The Delegator manages the domain-specific execution details.

## 13. Step 11: Route the Task Through A2A

Once the execution plan is ready, the Coordinator sends the task to the selected Delegator through the A2A boundary.

### Example A2A request

JSON

```
{
  "message_id": "msg-001",
  "task_id": "task-001",
  "source_agent": "cwd-coordinator",
  "target_agent": "sales-delegator",
  "task_type": "create_customer_briefing",
  "intent": "create_customer_briefing",
  "context": {
    "session_id": "session-456",
    "run_id": "run-001",
    "turn_id": "turn-001",
    "correlation_id": "corr-001"
  },
  "payload": {
    "customer": "ABC",
    "requested_output": "customer briefing"
  }
}
```

The A2A Gateway or A2A client is responsible for controlled agent-to-agent communication.

It can enforce:

* Agent identity

* Authentication

* Authorization

* Message validation

* Correlation propagation

* Idempotency

* Retry and timeout handling

* Task status tracking

* Error handling

### Important distinction

```
Coordinator
    └── Uses A2A to communicate with Delegators

Delegator
    └── Uses MCP/tools/APIs to access enterprise systems
```

A2A is for agent-to-agent communication. MCP and governed tools are used for agent-to-system execution.

## 14. Step 12: Delegator Determines Detailed Worker Execution

The Delegator receives the task and performs domain-specific decomposition.

For the customer briefing example:

```
Sales Delegator
    │
    ├── Customer Profile Worker
    ├── Opportunity Worker
    ├── Interaction Worker
    └── Briefing Generation Worker
```

The Delegator decides:

* Which Workers are required

* Which Workers can execute in parallel

* Which Worker depends on another result

* Which domain policies apply

* Which data sources are permitted

* How domain results should be combined

The Coordinator does not need to know every internal Worker implementation.

## 15. Step 13: Workers Execute the Required Actions

Workers perform the actual business operations.

A Worker may:

* Call a governed MCP tool

* Invoke an enterprise API

* Query an approved data adapter

* Retrieve documents through Azure AI Search

* Perform calculations

* Generate an artifact

* Validate or transform results

### Example

```
Opportunity Worker
    ↓
MCP / governed tool
    ↓
Salesforce or approved sales data adapter
    ↓
Opportunity results
```

The Worker uses its own least-privilege identity and is not allowed to access systems outside its approved permissions.

### Separation of responsibilities

|
Component

|

Responsibility

|
| --- | --- |
|

Coordinator

|

Enterprise intent, planning, routing, coordination

|
|

Delegator

|

Domain decomposition and Worker management

|
|

Worker

|

Specific task execution

|
|

LLM

|

Reasoning and interpretation

|
|

MCP/tool

|

Controlled system interaction

|
|

Enterprise system

|

Source of business data or action

|

## 16. Step 14: Use RAG and Memory When Required

The Coordinator determines whether the request requires:

* Enterprise knowledge retrieval

* Historical conversation context

* Previous task state

* User preferences

* Domain-specific documents

* Business policies

### Example

For a customer briefing, the system may retrieve:

* Customer-related documents

* Sales notes

* Account information

* Approved customer history

* Relevant business policies

The retrieval process must apply:

* User authorization

* Data classification

* ACL filtering

* Intent-based filtering

* Metadata filtering

* Redaction rules

The Coordinator may pass the retrieval requirements to the Delegator, while the Worker performs the actual governed retrieval.

## 17. Step 15: Track Execution State

The Coordinator maintains the execution state throughout the workflow.

### State hierarchy

```
Session
   ↓
Task
   ↓
Run
   ↓
Turn
   ↓
Step
   ↓
LLM / Tool execution
```

The state may include:

JSON

```
{
  "task_id": "task-001",
  "run_id": "run-001",
  "status": "running",
  "current_step": "retrieve_sales_opportunities",
  "completed_steps": [
    "retrieve_customer_profile"
  ],
  "pending_steps": [
    "retrieve_recent_interactions"
  ],
  "errors": [],
  "correlation_id": "corr-001"
}
```

State management supports:

* Long-running workflows

* Retry and recovery

* Task status tracking

* Context propagation

* Partial results

* Failure diagnosis

* Conversation continuity

## 18. Step 16: Handle Errors and Recovery

The Coordinator monitors the execution path and determines what to do when a step fails.

### Example

```
Opportunity Worker fails
        │
        ▼
Coordinator receives failure
        │
        ├── Retry the task
        ├── Route to an alternative capability
        ├── Continue with partial results
        ├── Request user clarification
        └── Stop and return a controlled error
```

The decision depends on:

* Error type

* Retry policy

* Task criticality

* Whether the failed step is mandatory

* Availability of alternative agents

* Data completeness

* Business impact

### Example response

> "The customer profile and recent interactions were retrieved, but the opportunity system is temporarily unavailable. The briefing can be generated with partial information or retried."

The Coordinator should not silently hide failures or present incomplete results as complete.

## 19. Step 17: Aggregate and Validate Results

After the Delegator completes its work, the Coordinator receives the result through A2A.

### Example result

JSON

```
{
  "task_id": "task-001",
  "status": "completed",
  "result": {
    "customer_profile": {},
    "opportunities": [],
    "recent_interactions": [],
    "briefing": "..."
  },
  "completed_steps": [
    "retrieve_customer_profile",
    "retrieve_sales_opportunities",
    "retrieve_recent_interactions",
    "generate_customer_briefing"
  ]
}
```

The Coordinator validates:

* Whether the task completed successfully

* Whether mandatory steps were completed

* Whether the result matches the requested output

* Whether errors or partial results exist

* Whether the response contains restricted information

* Whether additional synthesis is required

## 20. Step 18: Generate the Final Response

The Coordinator may use an LLM to synthesize the final result into a user-friendly response.

For example:

```
Raw Worker Results
        ↓
Delegator Aggregation
        ↓
Coordinator Validation
        ↓
LLM Response Synthesis
        ↓
Response Governance
        ↓
User
```

The final response may include:

* Customer summary

* Key opportunities

* Recent interactions

* Important risks

* Recommended next steps

* Generated briefing document

The LLM should generate the response from the approved execution results and context, not invent missing business information.

## 21. Step 19: Apply Final Response Governance

Before returning the response, the Coordinator or response-governance layer checks:

* Data classification

* Sensitive information

* DLP rules

* Output redaction

* User entitlement

* Approved response format

* Whether restricted data can be shown in the current channel

### Example

```
Generated response
        ↓
DLP / response policy check
        │
        ├── Passed → Return to user
        │
        └── Restricted → Redact, restrict, or deny
```

This ensures that authorization is enforced not only during retrieval, but also before information is returned to the user.

## 22. Complete Execution Flow

```
User Request
    │
    ▼
Teams / M365 / React UI
    │
    ▼
API / Integration Gateway
    │
    ├── Authentication
    ├── Request validation
    ├── Session and correlation IDs
    └── Initial authorization
    │
    ▼
Coordinator
    │
    ├── Understand intent
    ├── Identify entities
    ├── Identify required actions
    ├── Check clarification requirements
    ├── Validate request
    ├── Enforce authorization
    ├── Classify business domain
    ├── Discover Delegator
    ├── Create execution plan
    └── Select execution pattern
    │
    ▼
A2A Gateway
    │
    ▼
Domain Delegator
    │
    ├── Decompose domain task
    ├── Select Workers
    ├── Apply domain policies
    └── Coordinate Worker execution
    │
    ▼
Workers
    │
    ├── MCP / governed tools
    ├── RAG / Azure AI Search
    ├── Enterprise APIs
    ├── Business data adapters
    └── Calculations / artifact generation
    │
    ▼
Enterprise Systems
    │
    ├── Salesforce
    ├── Snowflake
    ├── Oracle
    ├── SharePoint / M365
    └── Other approved systems
    │
    ▼
Worker Results
    │
    ▼
Delegator Aggregation
    │
    ▼
A2A Response
    │
    ▼
Coordinator
    │
    ├── Validate results
    ├── Handle errors or partial results
    ├── Aggregate multi-agent results
    ├── Generate final response
    ├── Apply response governance
    └── Persist execution state
    │
    ▼
API / Integration Gateway
    │
    ▼
User Response
```

## 23. How the Coordinator Chooses the Execution Path

The Coordinator does not use only one routing rule. It evaluates several factors.

|
Decision factor

|

Example

|
| --- | --- |
|

User intent

|

Create a customer briefing

|
|

Business domain

|

Sales

|
|

Required capabilities

|

Customer profile, opportunities, interactions

|
|

User authorization

|

Sales data access

|
|

Data requirements

|

Salesforce, Snowflake, SharePoint

|
|

Task dependencies

|

Briefing depends on retrieved information

|
|

Execution mode

|

Parallel retrieval followed by aggregation

|
|

Agent availability

|

Selected Delegator is healthy

|
|

Task criticality

|

Whether all steps are mandatory

|
|

Output type

|

Summary, document, recommendation, or action

|
|

Approval requirement

|

Whether human confirmation is required

|
|

Error policy

|

Retry, partial response, or failure

|

### Simplified decision logic

Python

Run

```
def determine_execution_path(request):
    intent = interpret_intent(request)

    if intent.requires_clarification:
        return "ask_user_for_clarification"

    validate_request(request)

    authorize_request(request, intent)

    delegator = discover_delegator(
        domain=intent.domain,
        capability=intent.required_capability
    )

    plan = create_execution_plan(
        intent=intent,
        delegator=delegator
    )

    if plan.requires_human_approval:
        return "human_approval"

    if plan.can_execute_in_parallel:
        return "parallel_execution"

    if plan.has_dependencies:
        return "sequential_execution"

    return "direct_delegator_execution"
```

This is a conceptual representation. In the production CWD implementation, these responsibilities are distributed across Coordinator services, LangGraph workflow nodes, Agent Registry, policy services, A2A, and execution components.

## 24. Role of the LLM in Request Interpretation

The LLM is used for reasoning tasks such as:

* Intent classification

* Entity extraction

* Action identification

* Plan generation

* Ambiguity detection

* Result interpretation

* Final response synthesis

However, the LLM does not independently control the enterprise execution environment.

### Correct responsibility boundary

```
LLM
    ├── Understands the request
    ├── Suggests intent
    ├── Suggests actions
    └── Suggests a plan
            │
            ▼
Coordinator
    ├── Validates the interpretation
    ├── Applies authorization
    ├── Checks policies
    ├── Selects approved agents
    ├── Controls execution
    ├── Tracks state
    └── Enforces recovery and governance
```

### Key principle

> The LLM recommends what should happen; the Coordinator controls what is allowed to happen.

## 25. Example: Different Requests, Different Execution Paths

### Request A: Simple information request

> "What is the current status of customer ABC?"

```
User
  ↓
Coordinator
  ↓
Sales Delegator
  ↓
Customer Profile Worker
  ↓
Approved enterprise data source
  ↓
Response
```

### Request B: Multi-step briefing

> "Prepare a customer briefing with sales, opportunities, and interactions."

```
Coordinator
  ↓
Sales Delegator
  ↓
Parallel Workers
  ├── Customer Profile Worker
  ├── Opportunity Worker
  └── Interaction Worker
  ↓
Briefing Generation Worker
  ↓
Coordinator
  ↓
Final response
```

### Request C: Cross-domain analysis

> "Analyze the revenue impact of delayed customer shipments."

```
Coordinator
    │
    ├── Sales Delegator
    ├── Supply Chain Delegator
    └── Finance Delegator
            │
            ▼
      Result aggregation
            │
            ▼
      Business analysis response
```

### Request D: Action requiring approval

> "Send a customer communication based on the briefing."

```
Coordinator
    ↓
Sales / Communication Delegator
    ↓
Prepare draft
    ↓
Human approval
    ↓
Communication Worker
    ↓
Approved email or message tool
```

## 26. How This Is Implemented in CWD

The Coordinator's interpretation and routing responsibilities are represented through the orchestration workflow:

```
validate_request
      ↓
classify_request
      ↓
authorize_request
      ↓
discover_delegator
      ↓
create_plan
      ↓
submit_a2a_task
      ↓
aggregate_result
      ↓
save_state
```

### Component mapping

|
Responsibility

|

CWD component

|
| --- | --- |
|

Request understanding

|

Coordinator + LLM

|
|

Intent classification

|

Coordinator classification service

|
|

Action identification

|

Coordinator planning service

|
|

Authorization

|

Gateway, policy service, Coordinator

|
|

Domain routing

|

Coordinator + Agent Registry

|
|

Detailed task decomposition

|

Delegator

|
|

Agent-to-agent communication

|

A2A Gateway / A2A client

|
|

Tool execution

|

Workers + MCP / governed tools

|
|

Knowledge retrieval

|

Azure AI Search / RAG

|
|

State management

|

Redis, Cosmos DB, execution state

|
|

Workflow control

|

LangGraph

|
|

Error recovery

|

Coordinator and Delegator execution policies

|
|

Final synthesis

|

Coordinator + LLM

|
|

Observability

|

MLflow3, App Insights, Log Analytics

|

## 27. Final Architect Perspective

The Coordinator acts as the intelligent control plane of CWD.

It interprets the user's business intent, identifies the required actions, determines which capabilities are needed, validates authorization, selects the appropriate execution pattern, and routes the work to the correct Delegator through A2A.

The Delegator then manages domain-specific execution, while Workers perform the actual business operations through governed tools and enterprise integrations.

### Final definition

> The Coordinator converts an unstructured user request into a secure, traceable, and executable enterprise workflow by combining LLM-based intent understanding with deterministic routing, authorization, planning, state management, and execution control.

```
Coordinator =
    Understand
  + Identify Actions
  + Validate
  + Authorize
  + Classify
  + Plan
  + Discover
  + Route
  + Coordinate
  + Recover
  + Aggregate
  + Govern
  + Observe
```
