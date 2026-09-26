### How do you govern tools?

I would use **Tool Registry + allowlisting + authorization + validation + audit**.

1. **Tool Registry**

   * Maintain approved MCP tools with name, owner, purpose, version, and schema.

2. **Tool Allowlist**

   * Each Worker gets access only to the tools it needs.
   * Example: Salesforce Worker → Salesforce tools only.

3. **Authentication & Authorization**

   * Validate user/agent permissions before tool execution.
   * Use Entra ID, RBAC, Managed Identity, etc.

4. **Input validation**

   * Validate tool parameters using **JSON Schema/Pydantic**.
   * Prevent malformed or dangerous requests.

5. **Approval for sensitive actions**

   * Read operations can be automated.
   * High-risk operations like delete/update may require **human approval**.

6. **Monitoring & Audit**

   * Log:
     `User → Agent → Worker → Tool → Parameters → Result`
   * Monitor failures, latency, and unusual tool usage.

7. **Version & lifecycle management**

   * Version tools and schemas.
   * Test changes before production and deprecate old versions safely.

### Interview answer

> **"I govern tools through a centralized Tool Registry, allowlists, authorization, input-schema validation, and audit logging. Each Worker gets only the tools required for its role. Sensitive operations require additional authorization or human approval. Every tool call is traced and audited, and tool versions are tested and controlled before production."**
