## How do you handle API versioning in CWD?

In CWD, I use **explicit API versioning**, mainly through the URL, so I can introduce breaking changes without immediately breaking existing clients.

```text
/api/v1/customer-briefing
/api/v2/customer-briefing
```

### 1. Version the public API

For example:

```python
@app.post("/api/v1/customer-briefing")
async def customer_briefing_v1(request: CustomerBriefingRequestV1):
    return await coordinator.run(request)
```

If the request/response contract changes significantly:

```python
@app.post("/api/v2/customer-briefing")
async def customer_briefing_v2(request: CustomerBriefingRequestV2):
    return await coordinator.run(request)
```

So existing clients can continue using **v1** while new clients migrate to **v2**.

---

### 2. Don't expose backend API versions to the Worker

This is especially important in CWD.

Suppose Salesforce changes:

```text
Salesforce API v1 → Salesforce API v2
```

I don't want:

```text
Customer Worker
     ↓
Salesforce v2
```

Instead:

```text
Customer Worker
     ↓
MCP Tool: get_customer
     ↓
Salesforce MCP Adapter
     ↓
Salesforce API v1 / v2
```

The Worker sees a **stable business contract**.

```python
await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

The MCP integration layer absorbs the vendor API change.

---

### 3. Version request/response schemas

I use explicit schemas:

```python
class CustomerBriefingRequestV1(BaseModel):
    customer_id: str
    request: str
```

Later:

```python
class CustomerBriefingRequestV2(BaseModel):
    customer_id: str
    request: str
    capabilities: list[str]
```

This allows me to evolve the contract safely.

---

### 4. Prefer backward-compatible changes

If I only need to add an optional field:

```json
{
  "customer_id": "C12345",
  "request": "Customer briefing",
  "include_sales": true
}
```

I may keep the same API version if the change is backward compatible.

I create a new version when there is a **breaking contract change**, such as:

* removing a required field
* changing field meaning
* changing data types
* changing response structure
* changing authentication requirements
* changing behavior in a way that breaks existing clients

---

### 5. Version internal Agent/MCP contracts too

CWD has multiple contracts:

```text
API contract
   ↓
Coordinator contract
   ↓
A2A task contract
   ↓
Worker contract
   ↓
MCP tool contract
   ↓
Enterprise API
```

For example, an MCP tool may evolve from:

```text
get_customer_v1
```

to:

```text
get_customer_v2
```

or maintain a versioned schema while keeping the business capability stable.

---

### 6. Test before migration

Before moving v1 → v2, I perform:

```text
Contract tests
Integration tests
Regression tests
Security tests
Performance tests
LLM/evaluation tests
```

For CWD, I would specifically verify:

```text
Coordinator routing
Delegator selection
Worker execution
MCP calls
Response normalization
Error handling
Authorization
Observability
```

---

### 7. Gradual migration and rollback

I don't immediately remove v1.

```text
v1 → existing clients
v2 → new clients
       ↓
   Canary testing
       ↓
   Gradual migration
       ↓
   Monitor
       ↓
   Deprecate v1
```

During migration I monitor:

* 4xx/5xx errors
* latency
* validation failures
* MCP failures
* workflow completion
* business correctness
* security violations

If v2 has an unexpected issue, I can roll clients back to v1.

---

### 8. Long-running workflows need version awareness

This is a good **senior-level point**.

Suppose a CWD workflow starts with:

```text
Agent version = 3.1
Schema version = v1
MCP contract = v2
```

and takes several minutes to complete.

I persist those versions with the workflow:

```json
{
  "workflow_id": "WF-1001",
  "agent_version": "3.1",
  "schema_version": "v1",
  "mcp_version": "v2"
}
```

That prevents a workflow from unexpectedly switching contracts halfway through execution.

---

## Interview-ready answer

> **“In CWD, I use explicit API versioning, typically `/api/v1` and `/api/v2`, so breaking changes don't immediately affect existing clients. I version the request and response contracts and prefer backward-compatible additive changes whenever possible. Internally, I also version A2A, MCP, and Agent contracts where required. Vendor API changes such as Salesforce v1 to v2 are isolated inside the MCP adapter, so our Workers continue using a stable business-level tool contract. For migration, I use contract testing, canary rollout, monitoring, deprecation, and rollback. Long-running workflows also persist the relevant Agent and schema versions so they remain reproducible.”**

### Easy memory

**Version → Contract → Backward compatibility → Test → Canary → Migrate → Deprecate**

**Strong interview line:**

> **“I version contracts, not business logic; vendor-specific API versions are absorbed behind the MCP integration boundary.”**
