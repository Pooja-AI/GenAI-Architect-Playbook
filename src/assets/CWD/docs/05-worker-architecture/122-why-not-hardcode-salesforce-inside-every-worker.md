## Why don't you hardcode Salesforce inside every Worker?

Because it would create **tight coupling** between the Worker and Salesforce.

Instead, we keep the Worker focused on its **business capability** and put the Salesforce integration behind **MCP**.

### Hardcoded approach ❌

```text
CustomerProfileWorker
      ↓
Salesforce SDK/API
      ↓
Salesforce
```

If Salesforce changes, many Workers may need code changes.

### CWD approach ✅

```text
CustomerProfileWorker
      ↓
MCP Tool: get_customer_profile
      ↓
Salesforce MCP Server
      ↓
Salesforce
```

Now the Worker only knows:

> **“I need customer profile data.”**

It doesn't need to know the Salesforce API implementation.

### Main benefits

1. **Loose coupling** — Worker is not tied directly to Salesforce.
2. **Reusability** — multiple Workers can use the same MCP tools.
3. **Maintainability** — Salesforce API changes are isolated in the MCP integration layer.
4. **Security** — authentication, secrets, and access controls can be centralized.
5. **Testability** — Worker can be tested using a mocked MCP tool.
6. **System flexibility** — the underlying data source can potentially change without redesigning the Worker.

### CWD example

```text
CustomerProfileWorker ──┐
ContractWorker ──────────┼──→ MCP → Salesforce
SalesHistoryWorker ──────┘
```

Each Worker focuses on its own capability, while the **MCP layer handles Salesforce integration**.

**Interview-ready:**

> “We don't hardcode Salesforce inside every Worker because that tightly couples business capabilities to a specific enterprise system. In CWD, Workers call approved MCP tools, and the MCP Server handles Salesforce integration. This gives us loose coupling, reuse, centralized security, and easier maintenance.”

**One-line memory:**
**Worker owns the capability; MCP owns the Salesforce integration.**
