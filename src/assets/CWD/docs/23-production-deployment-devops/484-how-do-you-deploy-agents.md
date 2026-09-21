## How do you deploy agents?

In CWD, I treat each **Coordinator, Delegator, and Worker as a versioned deployable Agent service**. I don't deploy an Agent as just a prompt; I deploy its **code + workflow + prompt + model configuration + tool permissions + dependencies** together.

### CWD Agent deployment flow

```text
Developer
   ↓
Git Repository
   ↓
Unit + Integration Tests
   ↓
Agent / LLM Evaluation
   ↓
Security + Container Scan
   ↓
Docker Image
   ↓
Azure Container Registry
   ↓
Deploy to DEV
   ↓
QA / Staging
   ↓
Canary / Blue-Green
   ↓
Production
   ↓
Monitor + Rollback
```

### 1. Package the Agent

For example, my **Customer Worker** contains:

```text
customer-worker/
├── agent.py
├── workflow.py
├── tools.py
├── prompts/
├── models.py
├── config.py
└── tests/
```

The Agent includes:

* Agent logic
* LangGraph workflow
* Prompt reference/version
* Model configuration
* MCP tool configuration
* Guardrails
* Input/output schemas
* Retry/timeout policies

---

### 2. Version the Agent

I maintain an immutable Agent version.

For example:

```text
Customer Worker
   ├── v1.0
   ├── v1.1
   └── v2.0
```

And I record its dependencies:

```json id="1zxy0s"
{
  "agent_id": "customer_worker",
  "agent_version": "2.0",
  "prompt_version": "3.1",
  "model": "production-model",
  "mcp_version": "1.4"
}
```

This gives me reproducibility.

---

### 3. Run Agent-specific evaluation

This is especially important for Agentic AI.

For example, before deploying a new Customer Worker:

```text
Golden Dataset
      ↓
Agent v1
      ↓
Agent v2
      ↓
Compare
```

I evaluate:

```text
Routing accuracy
Tool selection
Tool-call parameters
Task completion
Groundedness
Hallucination
Safety
Latency
Token usage
Cost
```

If the new Agent fails the required evaluation gates, I don't promote it.

---

### 4. Build a Docker image

```bash id="z3lqci"
docker build -t customer-worker:2.0 .
```

Then scan the image and push it to **Azure Container Registry**.

```text
Agent Code
   ↓
Docker
   ↓
Security Scan
   ↓
ACR
```

---

### 5. Deploy the Agent

The container can run on **AKS or Azure Container Apps**, depending on the workload.

For example:

```text id="x8nd0d"
AKS
 ├── Coordinator
 ├── Sales Delegator
 ├── IT Delegator
 ├── Customer Worker
 ├── Opportunity Worker
 └── Incident Worker
```

I can scale Workers independently.

If Customer Briefing traffic increases, I don't necessarily scale every component equally.

---

### 6. Agent registration

I maintain an **Agent Registry** containing information such as:

```text id="j09y8m"
Agent ID
Agent version
Domain
Capabilities
Supported intents
Allowed MCP tools
Prompt version
Model
Endpoint
Security scopes
Resource limits
Status
```

For example:

```text id="a0lq2u"
customer_worker
    Capability: Customer information
    Tools:
      ├── get_customer
      └── get_customer_contacts
    Prompt: customer_briefing_v3.1
    Version: 2.0
```

The Coordinator can use this information to determine which Delegator/Worker capability is available.

---

### 7. Secure the Agent

I don't give every Agent access to every enterprise tool.

For example:

```text id="8h3u0v"
Customer Worker
   ├── get_customer       ✓
   ├── get_contacts       ✓
   ├── get_incidents      ✗
   └── delete_customer    ✗
```

The MCP layer independently enforces authorization.

Secrets are accessed through **Managed Identity + Key Vault**, not stored in the Agent container.

---

### 8. Production rollout

I use controlled deployment:

```text id="r4j2s1"
Agent v2
   ↓
Canary
   ↓
Monitor
   ↓
Healthy?
  /   \
No     Yes
↓       ↓
Rollback  Gradual rollout
```

For Agentic AI, "container is healthy" isn't enough.

I also monitor Agent behavior:

```text
Task completion
Tool success
Groundedness
Hallucination
Latency
Token usage
Cost
Error rate
```

---

### 9. Long-running workflows

This is an important CWD point.

Suppose:

```text
Workflow WF-1001
Agent version = 2.0
```

is already running.

I don't want a new deployment to unexpectedly change its behavior to Agent v3.0 halfway through.

So I persist:

```json id="k9p9rd"
{
  "workflow_id": "WF-1001",
  "agent_version": "2.0",
  "prompt_version": "3.1",
  "status": "RUNNING"
}
```

The workflow can therefore continue with its pinned version or follow an explicitly defined migration policy.

---

## Agent deployment vs Prompt deployment

This distinction is useful in interviews:

| Prompt deployment   | Agent deployment             |
| ------------------- | ---------------------------- |
| Prompt version      | Code/workflow version        |
| Prompt template     | LangGraph workflow           |
| Model configuration | Prompt + model               |
| Evaluation          | Evaluation                   |
| Rollback            | Rollback                     |
| Usually lightweight | Container/service deployment |

An Agent may reference a prompt rather than containing the prompt directly.

---

## Interview-ready answer

> **“For CWD, I deploy Agents as versioned containerized services. An Agent version includes the implementation, LangGraph workflow, prompt version, model configuration, MCP tool permissions, schemas and guardrails. The CI/CD pipeline runs unit and integration tests, security scans, and Agent-specific golden-dataset evaluations covering routing, tool selection, task completion, groundedness, hallucination, latency, tokens and cost. I then build and scan the Docker image, push it to Azure Container Registry, and deploy it to AKS or Azure Container Apps. In production I use canary or blue-green deployment and monitor both infrastructure health and Agent behavior. I also persist the Agent and prompt versions with the workflow state so long-running workflows remain reproducible and can be safely resumed or rolled back.”**

### Easy memory

**Agent = Code + Workflow + Prompt + Model + Tools + Guardrails**

**Deploy = Test → Evaluate → Containerize → Registry → Deploy → Monitor → Rollback**

### Strong interview line

> **“I don't consider an Agent deployed just because its container is running; I need versioned behavior, governed tools, evaluation gates, observability, and rollback.”**
