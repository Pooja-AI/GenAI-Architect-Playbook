## How do you deploy MCP servers?

In CWD, I deploy **MCP servers as independent, containerized services**. Each MCP server provides controlled access to a specific enterprise system or group of tools.

For example:

```text id="y7j0x8"
Customer Worker
      ↓
   MCP Client
      ↓
Salesforce MCP Server
      ↓
Salesforce API
```

and:

```text id="s0i4x8"
Incident Worker
      ↓
   MCP Client
      ↓
ServiceNow MCP Server
      ↓
ServiceNow API
```

### 1. MCP server contains the integration logic

For example:

```text id="7m2qf6"
salesforce-mcp/
├── server.py
├── tools/
│   ├── customer.py
│   └── opportunity.py
├── schemas/
├── auth/
├── adapters/
└── tests/
```

The MCP server exposes controlled tools such as:

```text id="v1p6t8"
get_customer()
get_customer_contacts()
get_opportunities()
```

The Worker doesn't contain Salesforce SDK/API integration logic.

---

### 2. Define strict tool schemas

For example:

```python id="9b8w0c"
class CustomerRequest(BaseModel):
    customer_id: str = Field(min_length=1)

@mcp.tool()
async def get_customer(request: CustomerRequest):
    ...
```

This gives me deterministic input validation before calling Salesforce.

---

### 3. Authenticate the MCP server

The MCP server runs with its own **workload identity**.

For Azure-hosted CWD:

```text id="0i8w2y"
MCP Server
    ↓
Managed Identity
    ↓
Key Vault / Enterprise Identity
    ↓
Salesforce / ServiceNow
```

Credentials aren't stored in the Docker image or Worker code.

---

### 4. Authorization happens inside MCP

This is a critical security boundary.

For example:

```text id="7j6r1d"
Incident Worker
       ↓
MCP Server
       ↓
Is this Worker allowed
to call get_open_incidents?
       ↓
      YES
       ↓
Is user authorized for C12345?
       ↓
      YES
       ↓
ServiceNow
```

The LLM doesn't get to decide whether the tool is authorized.

---

### 5. Containerize the MCP server

I package it as a Docker image:

```dockerfile id="z9j9w4"
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "server.py"]
```

Then:

```text id="f4n2lh"
MCP Code
   ↓
Docker Build
   ↓
Security Scan
   ↓
Azure Container Registry
```

---

### 6. Deploy to AKS / Container Apps

The MCP server can then run as a scalable service:

```text id="k5m7m4"
                    AKS
                     |
       ┌─────────────┼─────────────┐
       ↓             ↓             ↓
Salesforce MCP  ServiceNow MCP  SharePoint MCP
       ↓             ↓             ↓
 Salesforce      ServiceNow     Microsoft Graph
```

I can scale each MCP server independently based on its workload.

---

### 7. Network security

For enterprise integrations, I use controls such as:

```text id="h5n7b8"
Private networking
TLS
Firewall rules
Outbound allowlists
Network segmentation
```

The MCP server should only be able to reach the enterprise endpoints it actually needs.

---

### 8. Resilience

MCP servers also need production resilience.

For example:

```text id="9u4r7v"
Worker
  ↓
MCP Server
  ↓
Salesforce
  ↓
Timeout / 503
  ↓
Retry + exponential backoff
  ↓
Circuit breaker
  ↓
Structured error
```

For example:

```json id="5q9j4m"
{
  "status": "DEPENDENCY_UNAVAILABLE",
  "dependency": "Salesforce",
  "operation": "get_customer",
  "retryable": true
}
```

I don't return fabricated data to the Worker.

---

### 9. CI/CD for MCP servers

MCP servers follow their own deployment pipeline:

```text id="v7w3c1"
Code
 ↓
Unit Tests
 ↓
Tool Schema Tests
 ↓
Integration Tests
 ↓
Security Scan
 ↓
Docker Build
 ↓
Container Scan
 ↓
ACR
 ↓
DEV
 ↓
QA
 ↓
Production
```

I specifically test:

* Tool input/output schemas
* Authentication
* Authorization
* Enterprise API integration
* Timeouts
* Retries
* Rate limits
* Error mapping
* Idempotency for writes
* Audit logging

---

### 10. Version MCP contracts

I version the MCP server and tool contracts.

For example:

```text id="1b1xw4"
Salesforce MCP
    v1.0
    v1.1
    v2.0
```

The Worker calls a stable business tool:

```python id="e6h9qy"
await mcp_client.call_tool(
    "get_customer",
    {"customer_id": "C12345"}
)
```

The MCP adapter handles Salesforce API versions behind the boundary.

---

### 11. Observability

I trace:

```text id="w4r7x1"
Workflow
  ↓
Worker
  ↓
MCP Client
  ↓
MCP Server
  ↓
Tool
  ↓
Salesforce / ServiceNow
```

I capture:

```text
request_id
workflow_id
task_id
worker_id
mcp_server
mcp_version
tool_name
latency
status
error
```

I don't log credentials, access tokens, or unnecessary sensitive payloads.

---

## Interview-ready answer

> **“I deploy MCP servers as independently scalable, containerized services. Each MCP server exposes a controlled set of business tools for an enterprise system such as Salesforce or ServiceNow. The server validates tool inputs, authenticates to the enterprise system using managed or workload identity, enforces authorization, handles retries, timeouts, rate limits and error mapping, and audits every tool invocation. I package the MCP server into Docker, scan the image, push it to Azure Container Registry, and deploy it to AKS or Azure Container Apps through CI/CD. I version the MCP tool contracts so Worker logic isn't tightly coupled to vendor API versions. Finally, I use distributed tracing and metrics to monitor MCP latency, failures, throttling and tool success.”**

### Easy memory

**MCP deployment =**

**Tool → Validate → Secure → Containerize → Registry → Deploy → Scale → Observe**

### Strong interview line

> **“The Worker owns the business capability; the MCP server owns the secure integration with the enterprise system.”**
