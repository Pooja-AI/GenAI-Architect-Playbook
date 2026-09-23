For an interview, I would answer this as **service → purpose → why we chose it**, rather than just listing Azure services.

### Interview answer

> **"For CWD, we used Azure services across six main areas: API and security, AI and orchestration, enterprise search, data and state, integration, and observability."**

| Azure service                  | What we used it for       | Why we used it                                                              |
| ------------------------------ | ------------------------- | --------------------------------------------------------------------------- |
| **Azure API Management**       | API gateway               | Centralized authentication, throttling, policies, routing, and API security |
| **Microsoft Entra ID**         | Identity & authentication | Enterprise SSO, OAuth/JWT, RBAC and user identity                           |
| **Azure OpenAI**               | LLM capabilities          | Intent understanding, reasoning, summarization, structured generation       |
| **Azure AI Foundry**           | AI/agent platform         | Model, prompt, evaluation and AI application lifecycle management           |
| **Azure AI Search**            | RAG                       | Hybrid vector + keyword search, semantic ranking, metadata/ACL filtering    |
| **Azure Container Apps / AKS** | Application runtime       | Run FastAPI, Coordinator, Delegators and Workers with independent scaling   |
| **Azure Cosmos DB**            | Durable state             | Persist workflow, agent and execution state                                 |
| **Azure Cache for Redis**      | Fast state/cache          | Low-latency session state, caching and temporary workflow data              |
| **Azure Service Bus**          | Async processing          | Decoupling, retries, queues, DLQ and reliable worker execution              |
| **Azure Key Vault**            | Secrets                   | Secure API keys, credentials, certificates and secrets                      |
| **Azure Monitor**              | Platform monitoring       | Infrastructure health, metrics and alerts                                   |
| **Application Insights**       | Application tracing       | End-to-end request/agent tracing and dependency monitoring                  |
| **Log Analytics**              | Centralized logs          | Query and correlate application/platform logs                               |
| **Azure Container Registry**   | Container images          | Store and version Docker images for deployment                              |
| **Azure DevOps**               | CI/CD                     | Build, test, security scanning, evaluation and deployment pipelines         |
| **Azure VNet / Private Link**  | Network security          | Private connectivity and isolation for enterprise services                  |

### How they fit together

```text
                         USER
                           │
                           ▼
                Azure API Management
                           │
                           ▼
                  Microsoft Entra ID
                           │
                           ▼
                        FastAPI
                           │
                           ▼
                     Coordinator
                       LangGraph
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Sales Delegator            IT Delegator
              │                         │
         Workers                    Workers
              │                         │
              └────────────┬────────────┘
                           │
                     A2A / MCP
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
      Salesforce       ServiceNow       SharePoint
                                             │
                                             ▼
                                     Azure AI Search
                                             │
                                             ▼
                                      Azure OpenAI
```

Supporting the whole platform:

```text
      Cosmos DB ─────── Durable state
      Redis ─────────── Cache / fast state
      Service Bus ───── Async / retry / DLQ
      Key Vault ─────── Secrets
      ACR ───────────── Container images
      AKS/Container Apps ─ Runtime
      Azure Monitor ─── Monitoring
      App Insights ──── Tracing
      Log Analytics ─── Logs
      Azure DevOps ──── CI/CD
```

### The important "why" points

**Why Azure OpenAI?**

> "We needed an enterprise-managed LLM service with Azure integration, security controls, networking, monitoring and the ability to select appropriate models for different workloads."

**Why Azure AI Search?**

> "Because CWD needed enterprise RAG. We needed hybrid retrieval, semantic ranking and, importantly, authorization-aware filtering so users only retrieve information they're entitled to see."

**Why Entra ID?**

> "Because identity and authorization are fundamental in an enterprise agent platform. We don't allow the LLM to determine access; identity and authorization are enforced through enterprise security controls."

**Why Service Bus?**

> "Not every agent operation needs to be synchronous. Service Bus allows us to decouple long-running or retryable work and gives us retry and dead-letter capabilities."

**Why Cosmos DB + Redis?**

> "Cosmos DB gives us durable application and workflow state, while Redis provides low-latency temporary state and caching."

**Why Key Vault?**

> "We never want credentials or API secrets embedded in application code or containers. Applications use managed identity to access secrets securely."

**Why Application Insights + Azure Monitor?**

> "Traditional infrastructure monitoring isn't enough for an agentic system. We need to trace a request across Coordinator, Delegator, Worker, MCP calls and enterprise APIs, while also measuring latency, failures and dependencies."

### One strong closing statement

> **"The key point is that I didn't select Azure services individually. I designed the platform around enterprise requirements: secure identity with Entra ID, governed AI with Azure OpenAI and AI Foundry, RAG with Azure AI Search, reliable state with Cosmos DB and Redis, asynchronous execution with Service Bus, secure secrets with Key Vault, scalable compute with AKS or Container Apps, and end-to-end observability with Azure Monitor and Application Insights."**

That last statement is particularly useful in an **AI Architect interview**, because it shows you understand **why each service exists in the architecture**, rather than simply memorizing Azure service names.
