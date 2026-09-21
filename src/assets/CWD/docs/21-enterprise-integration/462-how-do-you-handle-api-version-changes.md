## How do you handle API version changes?

In CWD, I treat an enterprise API as a **contract**. I don't let a Salesforce, ServiceNow, Oracle, SharePoint, or Snowflake API change directly break my Workers.

The key principle is:

> **Decouple Workers from vendor-specific API versions through the MCP integration layer.**

### Architecture

```text id="m3p4xq"
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Integration Adapter
  ├── Salesforce API v1
  └── Salesforce API v2
```

The Worker continues calling the same business tool:

```python id="j8j4ph"
await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

The MCP Server/adapter handles the underlying API version.

---

## 1. Don't expose vendor API versions to Workers

For example, suppose Salesforce changes:

```text
Salesforce API v1
        ↓
Salesforce API v2
```

I don't want the Worker to change from:

```python id="k8n8cx"
call_salesforce_v1(...)
```

to:

```python id="91kprw"
call_salesforce_v2(...)
```

Instead:

```text id="nj8qgm"
Customer Worker
      ↓
get_customer()
      ↓
Salesforce MCP Server
      ↓
Adapter
      ↓
Salesforce API v2
```

This gives us a stable **business-level contract**.

---

## 2. Version the MCP/tool contract when necessary

Suppose the API change also changes the tool response.

Old:

```json id="5kl6yr"
{
  "customer_id": "C12345",
  "name": "ABC Corp"
}
```

New:

```json id="1p8xke"
{
  "customer": {
    "id": "C12345",
    "name": "ABC Corp"
  }
}
```

If the change is breaking, I can expose:

```text id="ebj8cm"
get_customer:v1
get_customer:v2
```

or maintain a stable MCP response contract and transform the vendor response inside the MCP adapter.

---

## 3. Prefer backward-compatible changes

If the new API adds an optional field:

```json id="48k6x1"
{
  "customer_id": "C12345",
  "name": "ABC Corp",
  "region": "US"
}
```

I can generally maintain compatibility.

But if Salesforce changes:

```text
customer_id
      ↓
customerId
```

and existing consumers depend on the old schema, I treat that as a potentially **breaking contract change**.

Then I introduce a new version or compatibility layer.

---

## 4. Support old and new versions during migration

For a major API change:

```text id="zq8gpi"
                MCP Server
                    │
          ┌─────────┴─────────┐
          ↓                   ↓
   Adapter API v1       Adapter API v2
          │                   │
          ↓                   ↓
    Vendor API v1        Vendor API v2
```

Then migrate gradually:

```text
v1 → Test v2 → Shadow/Canary → Gradual migration → v2
```

I don't switch every Worker at once.

---

## 5. Contract testing

Before moving to the new API version, I run contract tests.

For example:

```text id="5h9e7d"
Request
customer_id = C12345
       ↓
API v2
       ↓
Expected response schema
       ↓
Validation
```

I verify:

* Request schema
* Response schema
* Required fields
* Data types
* Error codes
* Authentication behavior
* Pagination
* Rate-limit behavior
* Timeout behavior
* Business semantics

I also test the MCP tool contract because the Worker depends on that contract, not directly on the vendor API.

---

## 6. Schema validation

At the MCP boundary, I validate responses using something like **Pydantic/JSON Schema**.

Example:

```python id="7x0kzh"
class CustomerResponse(BaseModel):
    customer_id: str
    name: str
    status: str
```

Then:

```python id="j90qkq"
response = CustomerResponse.model_validate(
    api_response
)
```

If the new API unexpectedly returns an incompatible structure:

```text id="k6pr3e"
API response
     ↓
Schema validation
     X
Invalid
     ↓
Structured integration error
     ↓
Worker / Coordinator
```

The LLM should not try to "guess" what the changed fields mean.

---

## 7. Canary deployment

For a production API migration:

```text id="v6xv7u"
Current API v1
      ↓
New Adapter v2
      ↓
Small percentage of traffic
      ↓
Monitor
      ↓
Increase gradually
```

Monitor:

* Error rate
* Latency
* 4xx/5xx
* 429
* Schema failures
* Tool success rate
* Business-result correctness

If v2 has problems:

```text
v2 → rollback → v1
```

---

## 8. Keep Workers stable

This is one of the biggest benefits of your CWD architecture.

For example:

```text id="g5v8xy"
Customer Worker
Opportunity Worker
Account Worker
       │
       ▼
Salesforce MCP
       │
       ▼
Integration Adapter
       │
       ├── API v1
       └── API v2
```

The Workers continue using:

```text
get_customer
get_opportunities
get_account
```

instead of knowing about Salesforce API versions.

The same pattern applies to:

```text
ServiceNow
SharePoint
Oracle
Snowflake
```

---

## 9. Version configuration and telemetry

I record the actual API/integration version used.

For example:

```json id="w5o5xm"
{
  "workflow_id": "WF-1001",
  "worker_id": "customer_worker",
  "mcp_server": "salesforce-mcp",
  "mcp_version": "v3",
  "api_version": "Salesforce-v2",
  "tool": "get_customer",
  "status": "SUCCESS"
}
```

This is extremely useful when debugging:

> "Why did customer retrieval start failing yesterday?"

You can determine whether the failure correlates with an API-version deployment.

---

## 10. Deprecation strategy

When the vendor announces that v1 will be retired:

```text id="9j4z4x"
Vendor announces v1 deprecation
          ↓
Build v2 adapter
          ↓
Contract tests
          ↓
Golden/evaluation tests
          ↓
Canary
          ↓
Migrate Workers
          ↓
Monitor
          ↓
Stop v1 traffic
          ↓
Remove v1 adapter
```

I don't remove v1 immediately because **long-running CWD workflows may still depend on the old contract**.

---

# Example: ServiceNow API change

Suppose ServiceNow changes an incident API.

### Before

```text id="2b7mrv"
Incident Worker
    ↓
MCP
    ↓
ServiceNow API v1
```

### After

```text id="g7c0v6"
Incident Worker
    ↓
MCP
    ↓
ServiceNow Adapter
    ↓
ServiceNow API v2
```

Worker code remains:

```python id="p3l2kk"
await mcp_client.call_tool(
    "get_open_incidents",
    {"customer_id": "C12345"}
)
```

The adapter converts the v2 response into the stable response expected by the Worker.

---

# Interview-ready answer

> **“In CWD, I treat enterprise APIs as versioned contracts and isolate vendor-specific API versions behind the MCP integration layer. Workers call stable business-level tools such as `get_customer` or `get_open_incidents`; they don't know whether Salesforce or ServiceNow is using API v1 or v2. When a vendor introduces a breaking API change, I create a new adapter or versioned MCP contract, validate request and response schemas, run contract and regression tests, and deploy the new version using a canary or gradual rollout. During migration I can support both versions and route traffic based on configuration. I monitor API errors, latency, throttling, schema failures, and business-result correctness, and I keep the previous version available for rollback. I also record the MCP, API, Worker, Agent, and prompt versions in telemetry so production behavior remains traceable and reproducible.”**

### Easy memory

**Detect → Isolate → Version → Validate → Test → Canary → Monitor → Rollback → Deprecate**

### Strong interview line

> **“I don't let vendor API versions leak into my Agent logic. The MCP integration layer absorbs API-version changes and exposes a stable business contract to my Workers.”**
