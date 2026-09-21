## Why not Flask?

I could use Flask, but for CWD I chose **FastAPI because the architecture is heavily I/O-bound and asynchronous**, with multiple LLM, MCP, and enterprise-system calls.

### FastAPI vs Flask in CWD

| Area                   | FastAPI                   | Flask                               |
| ---------------------- | ------------------------- | ----------------------------------- |
| Async / `asyncio`      | Native                    | Possible, but less central          |
| Request validation     | Pydantic built in         | Usually add libraries               |
| Type hints             | First-class               | Supported, but not framework-driven |
| API documentation      | Automatic OpenAPI/Swagger | Usually additional setup            |
| I/O-heavy AI workflows | Very suitable             | Can work                            |
| Lightweight            | Yes                       | Yes                                 |
| Existing ecosystem     | Strong                    | Very mature                         |

### Why this matters in CWD

A Customer Briefing may trigger several independent calls:

```text
Coordinator
    ↓
Sales Delegator
    ├── Customer Worker → Salesforce
    └── Opportunity Worker → Salesforce

IT Delegator
    └── Incident Worker → ServiceNow

Analytics Delegator
    └── Sales Worker → Snowflake
```

These are primarily **I/O operations**, so async execution is useful:

```python
customer, opportunities, incidents = await asyncio.gather(
    customer_worker.run(),
    opportunity_worker.run(),
    incident_worker.run()
)
```

FastAPI fits naturally with this async architecture.

### Another important reason: validation

With FastAPI:

```python
class CustomerBriefingRequest(BaseModel):
    customer_id: str
    include_incidents: bool = True

@app.post("/customer-briefing")
async def briefing(request: CustomerBriefingRequest):
    return await coordinator.run(request)
```

FastAPI automatically validates the incoming request using Pydantic.

This is useful because CWD has strongly structured inputs such as:

```text
customer_id
tenant_id
intent
requested_capabilities
user_context
```

### But don't say Flask is incapable

This is important in an interview.

Don't say:

> ❌ "Flask cannot handle async."

A better answer is:

> **"Flask can absolutely support production APIs and asynchronous patterns, but FastAPI provided a cleaner fit for our async, strongly typed, API-heavy Agentic AI architecture."**

### Interview-ready answer

> **“We could have used Flask, but FastAPI was a better fit for CWD because our architecture is I/O-heavy and involves concurrent calls to LLMs, MCP servers, and enterprise systems. FastAPI gives us native async support, Pydantic-based request and response validation, type hints, and automatic OpenAPI documentation. Flask is also capable, so this wasn't a limitation of Flask; it was primarily an architectural fit decision.”**

### Easy memory

**Flask = capable API framework**
**FastAPI = better fit for our async + typed AI API architecture**

**Strong interview line:**

> **“I wouldn't position Flask as wrong; I chose FastAPI because it aligned better with the asynchronous and strongly typed nature of our CWD workload.”**
