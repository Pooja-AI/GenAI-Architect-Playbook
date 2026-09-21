## How do you manage environment-specific configuration?

In CWD, I **separate configuration from application code** and maintain different configuration values for **DEV, QA, STAGING, and PROD**.

I never hardcode environment-specific values such as endpoints, model deployments, database connections, or secrets inside the Agent/Worker code.

### CWD configuration flow

```text id="7m4r2p"
Application Code
       ↓
Environment Configuration
       ↓
DEV / QA / STAGING / PROD
       ↓
Secrets → Key Vault
```

### 1. Separate configuration from code

For example, the Worker code stays the same:

```python id="m8x3q1"
class AppConfig(BaseSettings):
    environment: str
    azure_openai_endpoint: str
    model_deployment: str
    mcp_salesforce_url: str
    mcp_servicenow_url: str
    workflow_timeout: int
```

The values change by environment.

```text id="q4v7n2"
DEV
├── Model = dev-model
├── MCP = dev-mcp
└── DB = dev-db

QA
├── Model = qa-model
├── MCP = qa-mcp
└── DB = qa-db

PROD
├── Model = prod-approved-model
├── MCP = prod-mcp
└── DB = prod-db
```

The application code doesn't change.

---

## 2. Separate normal configuration from secrets

This is important.

### Normal configuration

Examples:

```text id="z6p2k8"
Environment name
API URLs
Model deployment name
Timeouts
Retry limits
Feature flags
Log level
Worker concurrency
```

These can come from environment configuration or a centralized configuration service.

### Secrets

Examples:

```text id="x8m3q5"
API keys
OAuth secrets
Certificates
Database credentials
Encryption keys
```

I store these in **Azure Key Vault**, not Git or environment files committed to the repository.

---

## 3. Use Managed Identity

In Azure:

```text id="h4k9s2"
CWD Service
    ↓
Managed Identity
    ↓
Azure Key Vault
    ↓
Secret / Certificate
```

The Worker doesn't contain:

```python
# ❌ Don't do this
SALESFORCE_PASSWORD = "secret123"
```

Instead, the workload identity retrieves the required secret from Key Vault.

---

## 4. Environment-specific model configuration

This is particularly important for GenAI.

For example:

```text id="v7n2c4"
DEV
 → cheaper/test model

STAGING
 → production-like approved model

PROD
 → approved production model
```

I also version:

```text id="c9x4m7"
Agent version
Prompt version
Model version
MCP version
RAG index version
```

So I know exactly which configuration produced a response.

---

## 5. Environment-specific MCP endpoints

For example:

```text id="b5q8n3"
DEV
Worker → dev Salesforce MCP

QA
Worker → QA Salesforce MCP

PROD
Worker → production Salesforce MCP
```

The Worker code remains:

```python id="s3j7k2"
result = await mcp_client.call_tool(
    "get_customer",
    {"customer_id": customer_id}
)
```

Only the MCP endpoint/configuration changes.

---

## 6. Environment-specific databases/state

For example:

```text id="w8p2r6"
DEV       → CWD-Dev Cosmos DB
QA        → CWD-QA Cosmos DB
STAGING   → CWD-Staging Cosmos DB
PROD      → CWD-Prod Cosmos DB
```

I avoid accidentally allowing a development deployment to connect to production data.

---

## 7. Use configuration validation

At application startup, I validate required configuration.

For example:

```python id="n4k6p9"
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment: str
    model_deployment: str
    mcp_endpoint: str
    workflow_timeout: int
```

If required configuration is missing:

```text id="q7x3m1"
Application startup
       ↓
Configuration validation
       ↓
Missing required value
       ↓
FAIL FAST
```

This is better than discovering the problem after receiving production traffic.

---

## 8. Prevent configuration drift

I manage configuration through:

```text id="a2m7v5"
Git / IaC
   ↓
CI/CD
   ↓
Environment-specific configuration
   ↓
Deployment
```

For example, infrastructure can be managed with Terraform/Bicep, while application configuration is injected during deployment.

I also audit configuration changes.

---

## 9. Feature flags

For risky Agent features, I use feature flags rather than changing code repeatedly.

For example:

```text id="u8k3w6"
enable_new_routing = false
enable_semantic_cache = true
enable_model_v2 = false
```

Then I can enable a feature for staging or a small canary population before full production rollout.

---

## 10. Never put secrets into prompts or Agent state

This is particularly important for CWD.

I never put:

```text
API keys
access tokens
passwords
client secrets
```

into:

```text
Prompt
A2A message
MCP parameters
LangGraph state
Redis
Logs
```

The Agent receives the minimum trusted context it needs.

---

## Interview-ready answer

> **“I manage environment-specific configuration separately from application code. The same CWD code is deployed across DEV, QA, staging and production, while environment-specific values such as API endpoints, model deployments, MCP endpoints, timeouts and feature flags are injected through deployment configuration. Secrets such as API credentials and certificates are stored in Azure Key Vault and accessed using Managed Identity. I validate configuration at startup, manage infrastructure and configuration through CI/CD and IaC, and prevent environment drift through controlled deployments. I also version the Agent, prompt, model, MCP and RAG configuration so every workflow is reproducible.”**

### Easy memory

**Code same → Config changes → Secrets in Key Vault → Inject → Validate → Audit**

### Strong interview line

> **“I build once and configure per environment; I don't maintain separate application codebases for DEV, QA and PROD.”**
