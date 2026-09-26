### Scenario 15: User requests another employee's confidential data

This is primarily an **authorization + data protection** problem.

1. **Authenticate the user**

   * Validate Microsoft Entra ID identity/token.

2. **Check authorization before retrieval**

   * Verify user's **role, group, and data entitlement**.
   * Don't rely on the LLM to decide access.

3. **Apply entitlement/ACL filtering**

   * Filter confidential documents/data **before** they reach the LLM.
   * Example: Azure AI Search ACL/metadata filters.

4. **Enforce Worker/tool authorization**

   * Worker and MCP tools should also verify permissions.
   * Defense in depth—don't assume the Coordinator's check is sufficient.

5. **Block the request**

   * If the user isn't authorized, return a safe denial.
   * **Do not retrieve the data first and then ask the LLM to hide it.**

6. **Audit**

   * Log the denied request, user identity, resource attempted, and decision using App Insights/Log Analytics or your audit system.

### Interview answer

> **"I would enforce authorization before any data retrieval. Entra ID authenticates the user, then RBAC/ABAC and data ACLs determine whether the user is entitled to that employee's data. Unauthorized data is filtered before it reaches the LLM, and MCP tools enforce authorization again. I would deny the request and audit the event rather than allowing the LLM to decide whether confidential data should be disclosed."**
