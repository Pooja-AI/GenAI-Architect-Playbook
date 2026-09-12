# Azure AI Foundry — Technical Workflow

```text
1. Azure Setup
      ↓
2. Create AI Foundry Project
      ↓
3. Select Foundation Model
      ↓
4. Deploy Model
      ↓
5. Develop Prompt / Agent
      ↓
6. Connect Data / RAG
      ↓
7. Connect Tools / APIs / MCP
      ↓
8. Test Application
      ↓
9. Evaluate
      ↓
10. Trace & Debug
      ↓
11. CI/CD
      ↓
12. Production Deployment
      ↓
13. Monitor
      ↓
14. Continuous Evaluation & Improvement
```

---

# 1. Set up Azure Resources

First, I create the required Azure environment.

Typical components:

```text
Azure Subscription
      ↓
Resource Group
      ↓
Azure AI Foundry
      ├── AI Project
      ├── Model deployments
      ├── Connections
      └── AI application
```

Depending on the solution, I may also provision:

* Azure AI Search
* Azure Storage
* Azure OpenAI/model endpoint
* Azure Key Vault
* Azure Container Apps / AKS
* API Management
* Application Insights
* Log Analytics
* Microsoft Entra ID

### Interview explanation

> "I start by establishing the Azure resource and security foundation, then create the Foundry project and connect the required AI and enterprise services."

---

# 2. Create Azure AI Foundry Project

Create a project for the application.

For example:

```text
Project: CWD-Enterprise-Assistant
```

The project becomes the logical boundary for the AI application and its associated assets.

```text
CWD Project
 ├── Models
 ├── Agents
 ├── Prompts
 ├── Connections
 ├── Evaluations
 └── Traces
```

### Interview

> "I create a dedicated Foundry project to organize the models, agents, prompts, connections, evaluations, and observability assets for the application."

---

# 3. Select Foundation Model

Now select the appropriate model.

For example:

```text
Model Catalog
      ↓
 ┌──────────────┐
 │ GPT          │
 │ Phi          │
 │ Llama        │
 │ Mistral      │
 │ Other models │
 └──────────────┘
```

I evaluate:

* Reasoning capability
* Context window
* Multimodal support
* Tool calling
* Latency
* Cost
* Availability
* Enterprise requirements

### Important

Don't simply say:

> "I select GPT because it is powerful."

Instead:

> "I select the model based on the application's quality, reasoning, latency, cost, context, multimodal, and tool-calling requirements."

---

# 4. Deploy the Model

The selected model needs an inference deployment.

```text
Selected Model
      ↓
Model Deployment
      ↓
Inference Endpoint
```

The application can then send requests to the deployed model.

Conceptually:

```text
Application
     ↓
Model Endpoint
     ↓
Foundation Model
     ↓
Response
```

---

# 5. Develop the Prompt

Now create the instructions for the AI application.

Example:

```text
System Prompt:

You are an enterprise support assistant.
Use authorized enterprise data.
Do not expose confidential information.
Use tools when required.
Provide concise and grounded answers.
```

Then test different prompt versions.

```text
Prompt v1
   ↓
Test
   ↓
Prompt v2
   ↓
Evaluate
```

### Professional answer

> "I treat prompts as versioned application artifacts and validate prompt changes against a representative evaluation dataset."

---

# 6. Build the AI Agent

If the application requires autonomous task execution, create an agent.

An agent typically has:

```text
Agent
 ├── Instructions
 ├── Model
 ├── Tools
 ├── Knowledge
 ├── State/Memory
 └── Execution logic
```

Example:

```text
User
 ↓
CWD Coordinator Agent
 ↓
Understand intent
 ↓
Select Delegator
 ↓
Execute task
```

For your CWD architecture:

```text
Coordinator
      ↓
Delegator
      ↓
Worker
      ↓
Tool/API
```

You can use Foundry capabilities for the AI layer while using your orchestration framework, such as **LangGraph**, for complex hierarchical workflows.

---

# 7. Connect Enterprise Data — RAG

Now connect the agent to enterprise knowledge.

Example:

```text
Documents
     ↓
Azure Blob Storage
     ↓
Document processing
     ↓
Chunking
     ↓
Embeddings
     ↓
Azure AI Search
```

At runtime:

```text
User Question
      ↓
Agent
      ↓
Query Generation
      ↓
Azure AI Search
      ↓
Relevant Documents
      ↓
Context
      ↓
LLM
      ↓
Grounded Answer
```

### Enterprise requirement

Apply **authorization before returning data**.

For example:

```text
User
 ↓
Entra ID
 ↓
User identity
 ↓
ACL / Entitlement filtering
 ↓
Azure AI Search
 ↓
Authorized documents only
```

This is a strong Solution Architect point.

---

# 8. Connect Tools / APIs / MCP

Agents become useful when they can **take actions**.

For example:

```text
Agent
 ├── Search tool
 ├── ServiceNow API
 ├── Salesforce API
 ├── Database
 ├── MCP server
 └── Internal REST API
```

Example:

```text
User:
"Create a ServiceNow ticket."

       ↓

Agent
       ↓
Select create-ticket tool
       ↓
MCP/API
       ↓
ServiceNow
       ↓
Ticket created
       ↓
Agent response
```

### Interview explanation

> "I expose enterprise capabilities as governed tools rather than allowing the LLM direct access to backend systems."

---

# 9. Test the Application

Now perform functional testing.

Test:

### Normal request

```text
"What is the status of ticket 123?"
```

### Complex request

```text
"Analyze this failure and create a ticket."
```

### Security request

```text
"Show me another employee's confidential information."
```

### Failure scenarios

```text
Tool unavailable
Search unavailable
Model timeout
Invalid input
```

You should test both **happy paths and failure paths**.

---

# 10. Evaluate the AI Application

This is different from simply testing.

Testing asks:

> **Does it work?**

Evaluation asks:

> **How well does it work?**

Example:

```text
Golden Dataset
      ↓
AI Application
      ↓
Evaluation
 ├── Relevance
 ├── Groundedness
 ├── Accuracy
 ├── Safety
 ├── Tool usage
 └── Task success
```

For RAG:

```text
Question
 ↓
Retrieved Documents
 ↓
Generated Answer
 ↓
Evaluate
 ├── Retrieval quality
 ├── Groundedness
 └── Answer relevance
```

---

# 11. Trace the Application

Now inspect what happened internally.

Example:

```text
Trace ID: ABC123

User Request
     ↓
Coordinator
     ↓
LLM Call
     ↓
Delegator Selection
     ↓
Worker
     ↓
Azure AI Search
     ↓
Tool Call
     ↓
LLM
     ↓
Final Response
```

You can investigate:

* Latency
* Model calls
* Tool calls
* Retrieval
* Errors
* Token consumption
* Agent execution

### Interview answer

> "Tracing gives me end-to-end visibility into the execution path, which is particularly important for multi-agent applications where one request can generate multiple model, retrieval, and tool calls."

---

# 12. CI/CD Pipeline

Once the application passes evaluation, automate deployment.

```text
Developer
    ↓
Git Repository
    ↓
CI Pipeline
    ↓
Build
    ↓
Unit Tests
    ↓
AI Evaluation
    ↓
Security Checks
    ↓
Approval
    ↓
CD Pipeline
    ↓
Deployment
```

A particularly good enterprise practice is:

```text
Code Change
     ↓
Evaluation
     ↓
Quality Gate
     ↓
Deploy
```

For example:

> If groundedness drops below the defined threshold, don't promote the new version.

---

# 13. Production Deployment

The production architecture could look like:

```text
                  User
                   ↓
            Front Door / CDN
                   ↓
             API Management
                   ↓
          AI Application/API
                   ↓
        ┌──────────┴──────────┐
        ↓                     ↓
    AI Foundry              RAG
    Model/Agent          Azure AI Search
        ↓                     ↓
        └──────────┬──────────┘
                   ↓
             Enterprise APIs
```

Infrastructure could use:

* Container Apps
* AKS
* Functions
* App Service
* API Management

depending on the workload.

---

# 14. Production Monitoring

After deployment, continuously monitor.

```text
Production
    ↓
Monitoring
 ┌─────────────────────┐
 │ Application health  │
 │ LLM latency         │
 │ Token usage         │
 │ Cost                │
 │ Errors              │
 │ Tool failures       │
 │ RAG quality         │
 │ Agent behavior      │
 └─────────────────────┘
```

For example:

```text
Average latency → 4 sec
Token usage → 2,000/request
Tool success → 98%
Groundedness → 94%
Error rate → 1%
```

---

# 15. Continuous Improvement

This is the final part of the lifecycle.

Production data tells you what needs improvement.

```text
Production
     ↓
Monitor
     ↓
Identify Problem
     ↓
Change Prompt / Model / RAG / Tool
     ↓
Evaluate
     ↓
Approve
     ↓
Deploy
     ↓
Monitor
```

So the lifecycle becomes:

```text
              ┌──────────────────┐
              │                  ↓
Build → Evaluate → Deploy → Monitor
  ↑                           │
  └────── Improve ←───────────┘
```

---

# 🔥 Complete Technical Workflow — Interview Version

If the interviewer asks:

**"Walk me through how you would build an enterprise AI application using Azure AI Foundry."**

Say:

> **"First, I establish the Azure resource and security foundation and create an AI Foundry project. I then select an appropriate foundation model based on quality, reasoning, latency, cost, context, and enterprise requirements and deploy it for inference.**
>
> **Next, I develop and version the prompts and build the agent or orchestration workflow. For enterprise knowledge, I integrate Azure AI Search using a RAG architecture, including entitlement-aware retrieval. For actions, I integrate governed tools through APIs, functions, or MCP.**
>
> **I then test the application using functional and failure scenarios and evaluate it against a golden dataset for metrics such as relevance, groundedness, safety, and task success. I use tracing to understand model calls, retrieval, tool execution, latency, and failures.**
>
> **Once the application meets the quality gates, I integrate it into CI/CD and deploy it to the production infrastructure. Finally, I monitor application health, LLM latency, token consumption, cost, tool success, retrieval quality, and agent behavior. Production insights feed back into evaluation and continuous improvement."**

### 🧠 Remember this flow:

**Setup → Project → Model → Deploy → Prompt → Agent → RAG → Tools → Test → Evaluate → Trace → CI/CD → Deploy → Monitor → Improve**

That is the **technical workflow you should be able to draw on a whiteboard in an Azure AI Foundry Solution Architect interview.**

**********************
**Coordinator → multiple Delegators → multiple Workers**

You also use **LangGraph for orchestration**, **MCP for tool integration**, **A2A for agent-to-agent communication**, and **Azure AI Search for enterprise RAG**.

Let me explain **Azure AI Foundry technical workflow using your CWD project**, because this is much easier to explain in your interview.

---

# CWD + Azure AI Foundry — End-to-End Technical Workflow

## 1. User accesses CWD

The user opens the CWD enterprise assistant.

```text
User
  ↓
CWD Web UI
  ↓
API Gateway / APIM
  ↓
CWD Backend
```

Your frontend could be hosted using Azure Static Web Apps/Storage, with Front Door/CDN depending on the architecture.

The request reaches the backend through **API Management**.

---

# 2. Authentication and Authorization

Before processing the request:

```text
User
 ↓
Microsoft Entra ID
 ↓
Authentication
 ↓
User identity / claims
 ↓
Authorization
 ↓
CWD
```

The system determines:

* Who is the user?
* What role do they have?
* Which applications/data can they access?
* Which tools can they invoke?

This is important for your enterprise architecture because **RAG and tools must respect user entitlements**.

### Interview explanation

> "Before the agent accesses enterprise data or tools, I establish the user's identity and authorization context using Entra ID and propagate that context through the workflow."

---

# 3. Request reaches CWD Coordinator

Suppose the user asks:

> **"Analyze this failure and create a ServiceNow ticket."**

The request goes to the **Coordinator**.

```text
User Request
     ↓
Coordinator
```

The Coordinator performs:

* Intent classification
* Request understanding
* Planning
* Routing
* Delegator selection

For example:

```text
Intent:
Failure Analysis + Ticket Creation
```

---

# 4. Coordinator selects Delegator

This is where your architecture is different from a simple agent architecture.

```text
                 Coordinator
                      │
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   Sales          Failure       HR
   Delegator      Analysis      Delegator
                  Delegator
```

The Coordinator doesn't directly manage every worker.

It chooses the appropriate **Delegator**.

For the example:

```text
Coordinator
      ↓
IFA / Failure Analysis Delegator
```

---

# 5. Delegator decomposes the task

The Delegator understands the domain-specific task and decides which Workers are required.

Example:

```text
Failure Analysis Delegator
           │
     ┌─────┼──────────┐
     ↓     ↓          ↓
  RAG     Image     Ticket
 Worker   Worker    Worker
```

The Delegator might create:

```text
Task 1 → Retrieve historical failure information
Task 2 → Analyze failure image
Task 3 → Determine root cause
Task 4 → Create ServiceNow ticket
```

---

# 6. LangGraph orchestrates the workflow

Your CWD uses **LangGraph** to represent the workflow as a state graph.

Conceptually:

```text
START
  ↓
Intent Classification
  ↓
Coordinator
  ↓
Delegator Selection
  ↓
Task Decomposition
  ↓
Worker Selection
  ↓
Worker Execution
  ↓
Result Validation
  ↓
Aggregation
  ↓
Final Response
```

LangGraph manages things such as:

* State
* Nodes
* Edges
* Conditional routing
* Checkpoints
* Retries
* Error handling
* Workflow control

### Interview answer

> "In CWD, I use LangGraph because the workflow is stateful and requires explicit orchestration, conditional routing, retries, and checkpointing. This gives me more control than allowing an LLM to freely decide the entire execution path."

---

# 7. Worker needs enterprise knowledge → RAG

Suppose the worker needs historical failure information.

```text
Failure Analysis Worker
          ↓
      RAG Worker
          ↓
   Azure AI Search
          ↓
Enterprise Documents
```

The retrieval flow:

```text
User/Task
   ↓
Query
   ↓
Embedding / Search
   ↓
Azure AI Search
   ↓
ACL Filtering
   ↓
Relevant Documents
   ↓
Context
   ↓
Foundation Model
```

The model generates a grounded analysis from the retrieved information.

---

# 8. Worker needs an external action → MCP

Suppose the system needs to create a ServiceNow ticket.

The Worker doesn't directly get unrestricted access to ServiceNow.

Instead:

```text
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
ServiceNow Tool
  ↓
ServiceNow API
```

For example:

```text
create_ticket(
   title,
   description,
   priority,
   category
)
```

The MCP layer provides a standardized way to expose tools to agents.

### Interview explanation

> "I use MCP to standardize access to enterprise tools. The agent selects a governed tool, MCP handles the tool interaction, and the underlying service remains protected behind its API and authorization controls."

---

# 9. A2A handles agent-to-agent communication

In your CWD architecture, **A2A** can be used when separate agents need to communicate.

```text
Coordinator Agent
       ↓
      A2A
       ↓
Delegator Agent
       ↓
      A2A
       ↓
Worker Agent
```

This is different from MCP.

### MCP

**Agent → Tool**

```text
Agent → MCP → ServiceNow
```

### A2A

**Agent → Agent**

```text
Coordinator → A2A → Delegator
```

### Strong interview line

> **"I use MCP for agent-to-tool interaction and A2A for agent-to-agent collaboration. In CWD, this allows me to separate orchestration responsibilities from enterprise tool execution."**

---

# 10. Azure AI Foundry provides the AI platform layer

Now bring Foundry into your CWD architecture.

```text
                 CWD
                  │
            Orchestration
                  │
              LangGraph
                  │
       ┌──────────┴──────────┐
       │                     │
    Agents                Workers
       │                     │
       └──────────┬──────────┘
                  ↓
          Azure AI Foundry
       ┌──────────┼──────────┐
       ↓          ↓          ↓
    Models      Agents    Evaluation
       │                     │
       ↓                     ↓
  Foundation              Quality
    Models                Testing
```

Foundry becomes the platform around the GenAI lifecycle.

---

# 11. Model selection

For example, your Worker may need multimodal reasoning.

You evaluate candidate models based on:

```text
Quality
Latency
Cost
Context
Multimodal capability
Tool calling
Enterprise requirements
```

Then select the appropriate foundation model.

The important interview point:

> "I don't hard-code one model for every worker. I select models based on the workload."

For example:

```text
Complex reasoning
      ↓
Higher capability model

Simple classification
      ↓
Smaller / lower-cost model

Image analysis
      ↓
Vision-capable model
```

---

# 12. Evaluate the CWD application

Before production, create a golden dataset.

```text
Golden Test Dataset
        ↓
CWD Application
        ↓
Coordinator
        ↓
Delegator
        ↓
Workers
        ↓
Final Response
        ↓
Evaluation
```

Measure:

* Answer relevance
* Groundedness
* Task success
* Tool-call success
* Safety
* Hallucination
* Retrieval quality
* Latency
* Cost

For your CWD, **task success** is especially important.

For example:

> User asks to analyze failure and create ticket.

Success isn't just:

> "Good answer."

It is:

```text
Correct intent
     +
Correct Delegator
     +
Correct Worker
     +
Correct retrieval
     +
Correct tool call
     +
Correct ticket creation
```

---

# 13. Trace the entire CWD execution

This is where tracing becomes very valuable.

Example:

```text
Trace ID: CWD-123

User Request
     ↓
Coordinator
     ↓
LLM Call
     ↓
Delegator Selection
     ↓
Worker Selection
     ↓
Azure AI Search
     ↓
MCP Tool Call
     ↓
ServiceNow
     ↓
Result
     ↓
Coordinator Aggregation
     ↓
Final Response
```

You can identify:

* Which model was called
* How long each step took
* Which tool was called
* Search latency
* Token usage
* Failed workers
* Retry behavior
* Overall request latency

---

# 14. Production deployment

Your CWD application can be deployed using Azure infrastructure such as:

```text
Frontend
   ↓
Front Door
   ↓
API Management
   ↓
Container Apps / AKS
   ↓
CWD Services
   ↓
Azure AI / Models
```

Supporting services:

```text
Azure AI Search
Azure Storage
Redis
Key Vault
Entra ID
Service Bus
Azure Monitor
Application Insights
Log Analytics
```

---

# 15. Production monitoring

Once CWD is live:

```text
                CWD Production
                      ↓
                Observability
                      ↓
       ┌──────────────┼──────────────┐
       ↓              ↓              ↓
   Application       AI          Agent/RAG
   Monitoring     Monitoring     Monitoring
       │              │              │
    Errors          Tokens        Tool calls
    Latency         Cost          Retrieval
    Throughput      Model         Agent steps
```

You can establish alerts for:

```text
High latency
Model failures
Tool failures
RAG degradation
High token usage
Agent loops
Increased error rate
```

---

# 16. Continuous improvement

Finally:

```text
Production
    ↓
Monitoring
    ↓
Trace failures
    ↓
Identify issue
    ↓
Change Model / Prompt / RAG / Agent
    ↓
Evaluate
    ↓
Quality Gate
    ↓
Deploy
    ↓
Production
```

This creates your **LLMOps lifecycle**.

---

# ⭐ Your Complete CWD + Foundry Architecture

This is the diagram I recommend you remember for interviews:

```text
                         USER
                           │
                           ▼
                    CWD Web Application
                           │
                           ▼
                    API Management
                           │
                           ▼
                    Entra ID / Auth
                           │
                           ▼
                    CWD COORDINATOR
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
          Delegator    Delegator    Delegator
              │            │
         ┌────┼────┐       │
         ▼    ▼    ▼       ▼
      Worker Worker Worker Worker
         │     │     │
         │     │     └──────────────┐
         │     │                    │
         ▼     ▼                    ▼
       RAG    MCP                  APIs
         │     │                    │
         ▼     ▼                    ▼
   Azure AI   MCP Servers      Enterprise Systems
     Search                       │
         │                    ServiceNow
         │                    Salesforce
         │                    Oracle
         │
         ▼
                 AZURE AI FOUNDRY
              ┌──────┼──────┐
              │      │      │
            Models Agents Evaluation
              │      │      │
              └──────┼──────┘
                     │
              Tracing / Monitoring
                     │
              Azure Monitor / App Insights
```

## ⭐ How YOU should explain it in an interview

> **"In my CWD enterprise multi-agent assistant, the user request first passes through API Management and Entra ID for secure access. The request is then handled by a Coordinator implemented using a stateful LangGraph workflow. The Coordinator understands the intent and routes the request to the appropriate domain Delegator. The Delegator decomposes the task and selects the required Workers.**
>
> **Workers can access enterprise knowledge through Azure AI Search using an entitlement-aware RAG architecture, or perform actions through governed MCP tools and enterprise APIs. A2A can be used for agent-to-agent communication between the Coordinator, Delegators, and Workers.**
>
> **Azure AI Foundry provides the GenAI platform layer where I manage foundation models, agent capabilities, evaluations, tracing, and the AI application lifecycle. I evaluate the complete CWD workflow using golden datasets and metrics such as groundedness, relevance, task success, tool-call accuracy, latency, and cost.**
>
> **After passing evaluation and quality gates, the application is deployed through our Azure infrastructure and monitored using tracing, Application Insights, Azure Monitor, and Log Analytics. Production telemetry is then fed back into the evaluation and improvement cycle."**

### 🧠 The simplest way to remember your architecture

**CWD = Orchestration**

> **Coordinator → Delegator → Worker**

**LangGraph = Workflow control**

> **State → Nodes → Edges → Routing → Checkpoints**

**MCP = Tool integration**

> **Agent → Tool**

**A2A = Agent communication**

> **Agent → Agent**

**Azure AI Search = Enterprise RAG**

> **Agent → Search → Authorized Data**

**Azure AI Foundry = AI lifecycle**

> **Model → Agent → Evaluate → Trace → Deploy → Monitor**
