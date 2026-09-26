### How do you implement tool approval?

Use a **Tool Registry + security review + testing + approval gate**.

1. **Register the tool**

   * Tool name/version
   * Owner
   * Purpose
   * Input/output schema
   * Required permissions
   * Risk level

2. **Security review**

   * What data can it access?
   * Is it read-only or does it modify/delete data?
   * Authentication and authorization
   * Sensitive-data exposure risk

3. **Test the tool**

   * Input validation
   * Error handling
   * Timeout/retry behavior
   * Security and authorization tests

4. **Define allowed agents/workers**

   * Example:

   ```text
   Salesforce Worker
        ↓
   Salesforce MCP tools
   ```

   * Don't allow every Worker to access every tool.

5. **Approval gate**

   * Authorized security/application owner approves the tool for production.

6. **Controlled deployment + monitoring**

   * Deploy through dev → test → staging → production.
   * Audit every tool invocation.
   * Re-approve significant tool/schema/permission changes.

### Interview answer

> **"I implement tool approval through a centralized Tool Registry and security approval workflow. Each tool is registered with its owner, schema, permissions, and risk level. We test authentication, authorization, input validation, and failure handling, then define which agents or workers are allowed to use it. An authorized owner approves the tool before production, and every invocation is audited."**
