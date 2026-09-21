## How do you deploy CWD?

For CWD, I deploy it as **containerized microservices** with separate deployment units for the API, Coordinator/Delegators/Workers, and MCP services.

### CWD deployment architecture

```text
                    Client
                      ↓
              Azure Front Door
                      ↓
               Azure API Management
                      ↓
             FastAPI / API Service
                      ↓
             Coordinator Service
                      ↓ A2A
               Delegator Services
                      ↓
                 Worker Services
                      ↓ MCP
                MCP Services
             ↙       ↓        ↘
        Salesforce ServiceNow Snowflake
                      ↓
              Enterprise Systems
```

### 1. Containerize the application

I package the FastAPI/CWD services into Docker containers.

For example:

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

I would typically have separate images/deployments for:

```text
cwd-api
coordinator
sales-delegator
it-delegator
customer-worker
incident-worker
mcp-salesforce
mcp-servicenow
```

Depending on the implementation, some lightweight components can also be deployed together rather than as separate services.

---

### 2. Push images to a container registry

I build and scan the Docker images and push them to **Azure Container Registry (ACR)**.

```text
Developer
   ↓
Git
   ↓
CI Pipeline
   ↓
Build Docker Image
   ↓
Security Scan
   ↓
Azure Container Registry
```

---

### 3. Deploy to Azure

For CWD, I can deploy containerized services using **Azure Container Apps** or **AKS**.

For example:

```text
                    Azure
                      |
          ┌───────────┴───────────┐
          ↓                       ↓
   Container Apps                AKS
          ↓                       ↓
 FastAPI / Workers       Agent/MCP workloads
```

For a production platform with more complex orchestration, scaling, networking, and workload isolation, **AKS** is a strong fit.

---

### 4. CI/CD pipeline

My deployment pipeline would look like:

```text
Code Commit
    ↓
Build
    ↓
Unit Tests
    ↓
Integration Tests
    ↓
Security / Dependency Scan
    ↓
Docker Build
    ↓
Push to ACR
    ↓
Deploy Dev
    ↓
Automated Tests
    ↓
Deploy QA
    ↓
LLM / RAG / Agent Evaluation
    ↓
Approval
    ↓
Production
```

For GenAI, I would add **LLM evaluation** before production promotion rather than relying only on traditional unit tests.

---

### 5. Configuration and secrets

I don't put secrets inside Docker images or source code.

```text
CWD Container
     ↓
Managed Identity
     ↓
Azure Key Vault
     ↓
Secrets / certificates
```

Configuration such as:

```text
MODEL_NAME
SEARCH_ENDPOINT
MCP_ENDPOINT
ENVIRONMENT
```

can be injected through environment/configuration management, while sensitive credentials remain in Key Vault.

---

### 6. Networking

For production, I use private networking where appropriate:

```text
Internet
   ↓
Front Door
   ↓
APIM
   ↓
Private CWD Services
   ↓
Private MCP / Enterprise Services
```

I restrict inbound and outbound access and use appropriate network security controls.

---

### 7. Scaling

I scale components independently.

For example:

```text
FastAPI             → horizontal replicas
Coordinator         → horizontal replicas
Sales Workers       → capability-based scaling
Incident Workers    → capability-based scaling
MCP Services        → downstream-aware scaling
```

For sudden traffic:

```text
APIM
 ↓
Rate limiting
 ↓
Queue / Service Bus
 ↓
Workers
 ↓
Enterprise APIs
```

This prevents a traffic spike from overwhelming Salesforce, ServiceNow, or the LLM.

---

### 8. Long-running workflows

For long-running workflows, I don't depend on the API container staying alive.

```text
POST /customer-briefing
        ↓
FastAPI
        ↓
202 Accepted
+ workflow_id
        ↓
Azure Service Bus
        ↓
Coordinator
        ↓
LangGraph
        ↓
Checkpoint → Cosmos DB
```

If a container crashes, another instance can load the checkpoint and resume the workflow.

---

### 9. Deployment strategies

For production releases, I prefer **blue/green or canary deployment** depending on the service.

For GenAI, I also compare:

```text
Old Agent Version
        vs
New Agent Version
```

using the same evaluation dataset.

I monitor:

* Task completion
* Tool-call success
* Hallucination/grounding
* Latency
* Token usage
* Cost
* Error rate
* RAG relevance

before fully moving traffic to the new version.

---

### 10. Observability after deployment

After deployment, I use:

```text
OpenTelemetry
      ↓
Application Insights / Log Analytics
      ↓
Langfuse
```

I propagate:

```text
request_id
workflow_id
task_id
run_id
trace_id
```

across:

```text
Coordinator
 → Delegator
 → Worker
 → MCP
 → Enterprise API
```

So if an incident occurs, I can identify **where and why** the workflow failed.

---

## Interview-ready answer

> **“I deploy CWD as containerized services. I package the FastAPI API, Coordinator, Delegators, Workers, and MCP services as Docker images and push them to Azure Container Registry. Production workloads can run on AKS or Azure Container Apps depending on the required orchestration and scale. My CI/CD pipeline performs unit, integration, security, and GenAI evaluation tests before promotion across environments. I use Managed Identity and Key Vault for secrets, private networking for enterprise connectivity, and independent autoscaling for different Worker and MCP workloads. For long-running workflows, I use Service Bus and durable LangGraph checkpoints in Cosmos DB, so a failed container doesn't lose workflow state. Finally, I use OpenTelemetry, Application Insights, Log Analytics, and Langfuse for end-to-end observability.”**

### Easy memory

**CWD deployment =**

**Code → Test → Docker → ACR → AKS/Container Apps → Secure → Scale → Observe**

### Strong interview line

> **“I deploy CWD as independently scalable, containerized services with CI/CD, secure identity, durable workflow state, and end-to-end observability—not as one monolithic Agent application.”**
