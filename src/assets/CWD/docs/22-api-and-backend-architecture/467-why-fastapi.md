## Why FastAPI in CWD?

In CWD, I use **FastAPI as the API entry point** between the user/client applications and the Coordinator.

```text
User / Application
       ↓
   API Gateway / APIM
       ↓
     FastAPI
       ↓
  Authentication
       ↓
   Coordinator
       ↓
   Delegators
       ↓
    Workers
       ↓
      MCP
       ↓
Enterprise Systems
```

### Why FastAPI?

**1. Lightweight and high-performance**

FastAPI is well suited for AI workloads because it supports asynchronous APIs.

```python
@app.post("/customer-briefing")
async def customer_briefing(request: CustomerBriefingRequest):
    result = await coordinator.run(request)
    return result
```

This is useful because CWD may make multiple I/O calls to:

* Azure OpenAI
* Salesforce
* ServiceNow
* Snowflake
* SharePoint
* MCP servers

---

**2. Async support**

CWD has parallel Worker execution.

For example:

```text
Customer Briefing
       ↓
 ┌──────────────┬──────────────┐
 ↓              ↓              ↓
Customer     Incident       Sales
Worker       Worker         Worker
 ↓              ↓              ↓
Salesforce   ServiceNow    Snowflake
```

FastAPI's async model works well with this I/O-heavy architecture.

---

**3. Strong request/response validation**

I use **Pydantic** with FastAPI.

```python
class CustomerBriefingRequest(BaseModel):
    customer_id: str
    include_incidents: bool = True
    include_sales: bool = True
```

If the request is invalid:

```json
{
  "customer_id": ""
}
```

FastAPI/Pydantic can reject it before it reaches the Coordinator.

---

**4. Authentication and security integration**

FastAPI sits behind **Azure API Management** and integrates with Microsoft Entra ID.

```text
Client
  ↓
APIM
  ↓
Entra ID validation
  ↓
FastAPI
  ↓
Coordinator
```

I don't put authentication logic inside the LLM.

FastAPI/APIM validates the identity, and the trusted identity/context is passed into the workflow.

---

**5. Good fit for LangGraph**

The FastAPI endpoint can invoke the CWD LangGraph workflow:

```python
@app.post("/customer-briefing")
async def customer_briefing(request: CustomerBriefingRequest):

    state = {
        "customer_id": request.customer_id,
        "intent": "customer_briefing"
    }

    result = await coordinator_graph.ainvoke(state)

    return result
```

So FastAPI is the **API layer**, while LangGraph is the **workflow/orchestration layer**.

---

### What FastAPI does vs LangGraph

This distinction is important in an interview:

| Component       | Responsibility                           |
| --------------- | ---------------------------------------- |
| **FastAPI**     | Exposes HTTP APIs                        |
| **APIM**        | API gateway, throttling, policies        |
| **Entra ID**    | Authentication/identity                  |
| **LangGraph**   | Stateful workflow orchestration          |
| **Coordinator** | Intent, planning, Delegator coordination |
| **Delegator**   | Domain-level Worker orchestration        |
| **Worker**      | Specific business capability             |
| **MCP**         | Enterprise tool integration              |

### Why not put everything in FastAPI?

I don't use FastAPI to implement the entire agent workflow.

For example, I wouldn't put:

```text
FastAPI
 ├── Salesforce logic
 ├── ServiceNow logic
 ├── Worker routing
 ├── retries
 ├── workflow state
 └── LLM orchestration
```

inside one API.

Instead:

```text
FastAPI
   ↓
Coordinator
   ↓
LangGraph
   ↓
Delegators
   ↓
Workers
   ↓
MCP
```

This keeps the architecture modular and maintainable.

### Interview-ready answer

> **“I used FastAPI as the API entry layer for CWD because it is lightweight, asynchronous, and integrates well with Pydantic for request validation and with our Azure security stack. It exposes endpoints behind APIM, validates the request and identity context, and invokes the LangGraph-based Coordinator workflow. FastAPI handles the API layer; LangGraph handles stateful orchestration, while Delegators, Workers, and MCP handle their respective responsibilities.”**

### Easy memory

**FastAPI = API entry point**
**LangGraph = workflow engine**
**Coordinator = orchestrator**
**Delegator = domain router**
**Worker = capability executor**
**MCP = enterprise integration**

**Strong interview line:**

> **“FastAPI is the front door of CWD, not the workflow engine.”**
