Markdown

````
# How User Intent Is Identified, Classified, and Mapped to the Correct Business Domain or Agent

## 1. Overview

In CWD, the Coordinator converts a natural-language user request into a structured business intent and then maps that intent to the appropriate execution path.

The process is:

> **User Request → Intent Identification → Intent Classification → Entity Extraction → Action Identification → Domain Mapping → Workflow Selection → Agent Discovery → Execution**

The LLM helps interpret the request, while the Coordinator applies deterministic validation, authorization, registry lookup, and routing controls.

---

## 2. Example User Request

> "Prepare a customer briefing for customer ABC using the latest sales information, open opportunities, and recent customer interactions."

The Coordinator must determine:

- What does the user want?
- Which business domain owns the request?
- What business capabilities are required?
- Which workflow should be executed?
- Which Delegator and Workers are needed?
- What enterprise data may be accessed?
- Is the user authorized?
- Can the request execute sequentially, in parallel, or across multiple domains?

The request is therefore transformed into a structured representation.

```json
{
  "intent": "create_customer_briefing",
  "domain": "sales",
  "entities": {
    "customer": "ABC"
  },
  "actions": [
    "retrieve_customer_profile",
    "retrieve_sales_information",
    "retrieve_open_opportunities",
    "retrieve_recent_interactions",
    "generate_customer_briefing"
  ],
  "workflow": "customer_briefing_workflow",
  "required_capability": "customer_briefing",
  "execution_mode": "parallel_then_aggregate"
}
````

## 3. Intent Identification

### 3.1 What is intent?

Intent is the business objective behind the user's words.

For example:

|
User request

|

Identified intent

|
| --- | --- |
|

"Show me customer ABC's current status"

|

`retrieve_customer_status`

|
|

"Prepare a customer briefing"

|

`create_customer_briefing`

|
|

"Analyze why revenue declined"

|

`analyze_revenue_decline`

|
|

"Schedule a meeting with the customer"

|

`schedule_customer_meeting`

|
|

"Summarize the latest quality issue"

|

`summarize_quality_issue`

|
|

"Send the approved customer email"

|

`send_customer_communication`

|

The Coordinator does not route based only on keywords such as customer, revenue, or meeting. It identifies the actual business objective.

### 3.2 LLM-based intent interpretation

The Coordinator sends the normalized request to the LLM with a controlled prompt.

```
System:
You are the CWD intent classification component.

Identify:
1. Business intent
2. Business domain
3. Entities
4. Required actions
5. Expected output
6. Whether clarification is required

Return only the approved structured schema.

User:
Prepare a customer briefing for customer ABC.
```

The LLM returns a structured interpretation.

JSON

```
{
  "intent": "create_customer_briefing",
  "domain": "sales",
  "confidence": 0.96,
  "requires_clarification": false,
  "entities": {
    "customer": "ABC"
  }
}
```

The Coordinator validates this output before using it for routing.

## 4. Intent Identification Is More Than Classification

The Coordinator identifies several dimensions of the request.

### 4.1 Business objective

What outcome does the user want?

```
Create a customer briefing
```

### 4.2 Request type

Is the user asking to:

* Retrieve information?

* Analyze information?

* Generate a document?

* Perform an action?

* Update a system?

* Search enterprise knowledge?

* Execute a multi-step workflow?

### 4.3 Entities

Which business objects are involved?

Examples:

* Customer

* Supplier

* Employee

* Product

* Opportunity

* Invoice

* Shipment

* Quality issue

* Meeting

* Document

### 4.4 Constraints

Examples:

* Latest information

* Specific customer

* Specific date range

* Internal-only information

* Particular output format

* Required approval

* Restricted business domain

### 4.5 Expected output

Examples:

* Short answer

* Detailed analysis

* Business document

* Recommendation

* Email draft

* Executed transaction

* Status report

## 5. Entity Extraction

Entities provide the context required to select the correct workflow.

### Example

> "Show the open opportunities for customer ABC in the current quarter."

JSON

```
{
  "intent": "retrieve_open_opportunities",
  "domain": "sales",
  "entities": {
    "customer": "ABC",
    "opportunity_status": "open",
    "period": "current_quarter"
  },
  "output_type": "structured_data"
}
```

The Coordinator may need to resolve:

* Customer name to a customer ID

* Product name to a product ID

* Employee name to an employee record

* Date phrase to an actual date range

* Business unit to an organizational identifier

Entity resolution may use approved enterprise services rather than relying only on the LLM.

## 6. Action Identification

After identifying the intent, the Coordinator determines the actions required to fulfill it.

### Example

```
Intent:
    create_customer_briefing

Required actions:
    1. Identify customer
    2. Retrieve customer profile
    3. Retrieve sales information
    4. Retrieve opportunities
    5. Retrieve recent interactions
    6. Generate briefing
    7. Validate final response
```

The Coordinator distinguishes between:

### Business action

```
Retrieve open opportunities
```

### Technical execution

```
Call an approved Salesforce adapter
```

The Coordinator identifies the business action. The Delegator and Worker determine the technical implementation.

## 7. Intent Classification

Intent classification assigns the request to an approved intent category.

### Example intent taxonomy

```
Sales
├── retrieve_customer_status
├── create_customer_briefing
├── analyze_opportunities
└── generate_sales_summary

Finance
├── retrieve_revenue
├── analyze_financial_variance
└── generate_finance_report

Supply Chain
├── retrieve_shipment_status
├── analyze_supplier_performance
└── investigate_delivery_delay

HR
├── retrieve_employee_policy
├── summarize_hr_document
└── initiate_hr_request

Calendar
├── find_available_time
├── schedule_meeting
└── cancel_meeting

Quality
├── retrieve_quality_issue
├── analyze_defect_trend
└── generate_quality_summary
```

The taxonomy should be maintained as a governed platform capability rather than allowing every agent to define incompatible intent names.

## 8. Classification Uses Multiple Signals

The Coordinator can combine several signals when identifying the intent.

|
Signal

|

Example

|
| --- | --- |
|

User message

|

"Prepare a customer briefing"

|
|

Conversation history

|

Previous request identified customer ABC

|
|

Extracted entities

|

Customer, opportunity, quarter

|
|

User role

|

Sales user

|
|

Requested output

|

Business document

|
|

Available capabilities

|

Customer briefing workflow

|
|

Domain metadata

|

Sales-related customer data

|
|

Registry capabilities

|

Sales Delegator supports briefing

|
|

Policy requirements

|

Internal sales-data access

|

The user message is the primary input, but context and platform metadata improve routing accuracy.

## 9. Conversation Context

The Coordinator uses session and task context when the current request depends on earlier messages.

### Example conversation

User:

> "Show me customer ABC's open opportunities."

User:

> "Now prepare a briefing for the same customer."

The second request contains an implicit reference:

```
"the same customer" → customer ABC
```

The Coordinator resolves this from the approved session context.

JSON

```
{
  "current_intent": "create_customer_briefing",
  "resolved_entities": {
    "customer": "ABC"
  },
  "source_context": "previous_turn"
}
```

The Coordinator must not use unrelated or unauthorized conversation history as business context.

## 10. Confidence and Ambiguity Handling

The Coordinator evaluates whether the identified intent is sufficiently clear.

### Example of high confidence

> "Retrieve open opportunities for customer ABC."

```
Intent: retrieve_open_opportunities
Domain: Sales
Confidence: High
Action: Continue
```

### Example of ambiguous intent

> "Tell me about ABC."

Possible meanings:

* Customer profile

* Sales opportunities

* Recent interactions

* Financial information

* Customer briefing

The Coordinator should not guess.

```
Intent confidence: Low
        ↓
Ask clarification
        ↓
"What would you like to know about customer ABC?"
```

### Example of conflicting signals

> "Prepare a customer briefing and schedule a meeting with the customer."

This request contains two business objectives:

```
1. Create customer briefing
2. Schedule customer meeting
```

The Coordinator may create a multi-step workflow:

```
Retrieve customer information
        ↓
Generate briefing
        ↓
Prepare meeting details
        ↓
Request approval if required
        ↓
Schedule meeting
```

## 11. Mapping Intent to a Business Domain

Once the intent is identified, the Coordinator maps it to the business domain that owns the capability.

### Example mapping

```
Intent: create_customer_briefing
        ↓
Domain: Sales
        ↓
Capability: customer_briefing
        ↓
Delegator: Sales Delegator
```

### Domain mapping table

|
Intent

|

Business domain

|

Delegator

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

Analyze revenue variance

|

Finance

|

Finance Delegator

|
|

Investigate shipment delay

|

Supply Chain

|

Supply Chain Delegator

|
|

Retrieve employee policy

|

HR

|

HR Delegator

|
|

Schedule meeting

|

Calendar

|

Calendar Delegator

|
|

Analyze product defect

|

Quality

|

Quality Delegator

|
|

Analyze customer experience

|

Customer Experience

|

Customer Experience Delegator

|
|

Generate enterprise business analysis

|

Business Analysis

|

Business Analyst Delegator

|

The domain is selected based on the business capability required, not simply the data source.

For example, a customer briefing may use Salesforce, Snowflake, and SharePoint, but the owning domain is still Sales.

## 12. Agent Registry-Based Mapping

The Coordinator should use the Agent Registry to discover the appropriate Delegator.

### Example registry capability

JSON

```
{
  "agent_id": "sales-delegator",
  "agent_type": "delegator",
  "domain": "sales",
  "capabilities": [
    "create_customer_briefing",
    "retrieve_customer_status",
    "analyze_opportunities"
  ],
  "supported_workflows": [
    "customer_briefing_workflow"
  ],
  "status": "healthy"
}
```

The Coordinator searches for an agent that supports the identified capability.

```
Required capability:
    create_customer_briefing

        ↓

Agent Registry

        ↓

Sales Delegator
```

The registry can also provide:

* Endpoint

* Version

* Health status

* Supported operations

* Security metadata

* Input and output schema

* Ownership information

* Availability

* Deployment environment

## 13. Mapping Intent to a Workflow

An intent identifies what the user wants.

A workflow identifies how the request should be fulfilled.

### Example

```
Intent:
    create_customer_briefing

Workflow:
    customer_briefing_workflow
```

The workflow may contain:

```
1. Resolve customer
2. Retrieve customer profile
3. Retrieve opportunities
4. Retrieve recent interactions
5. Consolidate information
6. Generate briefing
7. Validate and return result
```

### Intent-to-workflow mapping

JSON

```
{
  "intent": "create_customer_briefing",
  "workflow": {
    "workflow_id": "customer_briefing_workflow",
    "execution_mode": "parallel_then_aggregate",
    "required_capabilities": [
      "customer_profile",
      "opportunity_analysis",
      "customer_interactions",
      "briefing_generation"
    ]
  }
}
```

The workflow definition may be maintained by the domain team or registered as a reusable platform capability.

## 14. Mapping Workflow to Downstream Agents

After selecting the workflow, the Coordinator determines which downstream agent should receive the task.

### Example

```
Intent
  ↓
Business Domain
  ↓
Workflow
  ↓
Required Capability
  ↓
Agent Registry
  ↓
Delegator
  ↓
Workers
```

For the customer briefing example:

```
create_customer_briefing
        ↓
Sales domain
        ↓
customer_briefing_workflow
        ↓
Sales Delegator
        ↓
Customer Profile Worker
Opportunity Worker
Interaction Worker
Briefing Generation Worker
```

The Coordinator generally routes to the Delegator rather than directly managing every Worker.

## 15. Why the Coordinator Does Not Directly Select Every Worker

The Coordinator operates at the enterprise level.

It knows:

* The user's intent

* The business domain

* The required capability

* The high-level workflow

* The execution constraints

The Delegator knows:

* Domain-specific task decomposition

* Available Workers

* Domain-specific policies

* Worker dependencies

* Domain-level fallback options

### Responsibility separation

|
Component

|

Main responsibility

|
| --- | --- |
|

Coordinator

|

Enterprise intent and high-level routing

|
|

Delegator

|

Domain workflow and Worker selection

|
|

Worker

|

Specific business task execution

|
|

Agent Registry

|

Capability and agent discovery

|
|

LLM

|

Interpretation and reasoning

|
|

A2A

|

Agent-to-agent communication

|

This separation prevents the Coordinator from becoming a monolithic business-logic component.

## 16. Multi-Domain Intent Mapping

Some requests require more than one business domain.

### Example

> "Analyze the revenue impact of delayed customer shipments."

The Coordinator may identify:

JSON

```
{
  "intent": "analyze_revenue_impact_of_delays",
  "domains": [
    "supply_chain",
    "finance",
    "sales"
  ],
  "required_capabilities": [
    "shipment_delay_analysis",
    "revenue_analysis",
    "customer_impact_analysis"
  ]
}
```

### Execution path

```
Coordinator
    │
    ├── Supply Chain Delegator
    ├── Finance Delegator
    └── Sales Delegator
            │
            ▼
      Result aggregation
            │
            ▼
      Business analysis response
```

The Coordinator identifies the cross-domain objective and coordinates the separate domain agents.

## 17. Workflow Selection Rules

The Coordinator may use a combination of:

1. Intent classification

2. Capability matching

3. Agent Registry metadata

4. Policy requirements

5. User authorization

6. Workflow dependencies

7. Execution mode

8. Agent health and availability

9. Required output type

10. Human-approval requirements

### Example decision

```
Intent:
    create_customer_briefing

Domain:
    Sales

Required capability:
    customer_briefing

User authorization:
    Approved

Agent availability:
    Sales Delegator healthy

Workflow:
    customer_briefing_workflow

Execution mode:
    Parallel retrieval followed by aggregation

Route:
    Coordinator → A2A → Sales Delegator
```

## 18. Example: Complete Intent-to-Agent Mapping

### User request

> "Prepare a customer briefing for customer ABC using the latest sales information and recent interactions."

### Step 1: Identify intent

```
create_customer_briefing
```

### Step 2: Extract entities

```
customer = ABC
time_scope = latest
```

### Step 3: Classify domain

```
Sales
```

### Step 4: Identify actions

```
Retrieve customer profile
Retrieve sales information
Retrieve opportunities
Retrieve recent interactions
Generate briefing
```

### Step 5: Identify required capability

```
customer_briefing
```

### Step 6: Discover agent

```
Sales Delegator
```

### Step 7: Select workflow

```
customer_briefing_workflow
```

### Step 8: Select execution pattern

```
Parallel retrieval → Aggregation → Briefing generation
```

### Step 9: Route through A2A

```
Coordinator → A2A Gateway → Sales Delegator
```

### Step 10: Delegator selects Workers

```
Sales Delegator
    ├── Customer Profile Worker
    ├── Opportunity Worker
    ├── Interaction Worker
    └── Briefing Generation Worker
```

## 19. Conceptual Coordinator Logic

Python

Run

```
def interpret_and_route(request):
    # 1. Understand the user's request
    interpretation = llm.interpret(request.message)

    # 2. Validate the structured interpretation
    validate_intent_schema(interpretation)

    # 3. Resolve entities and conversation references
    entities = resolve_entities(
        interpretation.entities,
        request.session_id
    )

    # 4. Check whether clarification is required
    if interpretation.requires_clarification:
        return ask_for_clarification(interpretation)

    # 5. Enforce authorization
    authorize(
        user=request.user_id,
        intent=interpretation.intent,
        entities=entities
    )

    # 6. Identify the required business capability
    capability = capability_catalog.resolve(
        intent=interpretation.intent,
        domain=interpretation.domain
    )

    # 7. Discover an approved Delegator
    delegator = agent_registry.discover(
        domain=interpretation.domain,
        capability=capability
    )

    # 8. Select the appropriate workflow
    workflow = workflow_registry.resolve(
        intent=interpretation.intent,
        capability=capability
    )

    # 9. Build the execution plan
    plan = create_execution_plan(
        intent=interpretation.intent,
        entities=entities,
        workflow=workflow,
        delegator=delegator
    )

    # 10. Route the task through A2A
    return a2a_client.submit_task(
        target_agent=delegator.agent_id,
        plan=plan
    )
```

This is conceptual logic. In CWD, the responsibilities are implemented through the Coordinator workflow, LLM service, policy service, Agent Registry, workflow planning, A2A, state management, and observability components.

## 20. How LangGraph Supports This Process

LangGraph provides the workflow control structure for the Coordinator.

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

### Node responsibilities

|
LangGraph node

|

Intent-routing responsibility

|
| --- | --- |
|

`validate_request`

|

Validate incoming request

|
|

`classify_request`

|

Identify intent, domain, entities, and actions

|
|

`authorize_request`

|

Check access and policy requirements

|
|

`discover_delegator`

|

Find an agent with the required capability

|
|

`create_plan`

|

Select workflow and execution pattern

|
|

`submit_a2a_task`

|

Route task to the Delegator

|
|

`aggregate_result`

|

Combine and validate downstream results

|
|

`save_state`

|

Persist execution state and traceability

|

LangGraph controls the sequence and state transitions. The LLM performs interpretation inside the relevant nodes.

## 21. What Happens When No Suitable Agent Exists?

The Coordinator should not route to an arbitrary agent.

Possible outcomes include:

```
No matching capability
        │
        ├── Ask user to clarify
        ├── Return unsupported-request response
        ├── Route to a general business-analysis capability
        ├── Escalate to human support
        └── Record the missing capability for platform improvement
```

Example:

> "I can identify the request, but no approved agent currently supports this operation."

This is preferable to sending the request to an agent that does not have the required capability or authorization.

## 22. Observability of Intent Routing

The Coordinator should record the intent-routing decision for every request.

### Example trace

JSON

```
{
  "correlation_id": "corr-001",
  "intent": "create_customer_briefing",
  "domain": "sales",
  "confidence": 0.96,
  "workflow": "customer_briefing_workflow",
  "selected_delegator": "sales-delegator",
  "execution_mode": "parallel_then_aggregate",
  "routing_reason": "Matched required customer_briefing capability",
  "status": "routed"
}
```

This supports:

* Routing accuracy analysis

* Failed classification diagnosis

* Agent utilization analysis

* Workflow performance monitoring

* Auditability

* Evaluation and improvement

* Detection of unsupported requests

## 23. Important Design Principles

### 1. Intent is not the same as a keyword

The Coordinator identifies the business objective, not just matching words.

### 2. LLM interpretation must be structured

The LLM should return a validated schema rather than uncontrolled free text.

### 3. Authorization happens before execution

Intent classification must not grant access to data or tools.

### 4. Capability determines routing

The Coordinator should select an agent based on the required capability and approved registry metadata.

### 5. Domain ownership is separate from data location

A workflow may use multiple enterprise systems while still belonging to one business domain.

### 6. The Coordinator routes to Delegators

Delegators manage domain-specific Worker selection and execution.

### 7. Ambiguity must be handled explicitly

Low-confidence or incomplete requests should trigger clarification rather than guessing.

### 8. Every routing decision must be traceable

Intent, domain, workflow, agent, and execution identifiers should be recorded.

## 24. Final Architecture View

```
User Request
      │
      ▼
Coordinator
      │
      ├── LLM intent interpretation
      ├── Entity extraction
      ├── Action identification
      ├── Intent classification
      ├── Clarification detection
      ├── Request validation
      ├── Authorization
      │
      ▼
Capability Mapping
      │
      ▼
Business Domain Mapping
      │
      ▼
Workflow Selection
      │
      ▼
Agent Registry Discovery
      │
      ▼
Delegator Selection
      │
      ▼
A2A Routing
      │
      ▼
Delegator
      │
      ▼
Workers
      │
      ▼
Enterprise Systems / RAG / Tools
```

## Final Definition

> The Coordinator identifies user intent by interpreting the request, extracting entities and required actions, classifying the business objective, mapping it to an approved domain capability and workflow, and discovering the appropriate Delegator through the Agent Registry. It then routes the task through A2A while enforcing authorization, execution policies, state management, and traceability.

```
Intent
    → Domain
    → Capability
    → Workflow
    → Delegator
    → Workers
    → Enterprise Execution
```
