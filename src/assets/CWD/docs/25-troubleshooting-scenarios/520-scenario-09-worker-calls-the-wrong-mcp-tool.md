### Scenario 9: Worker calls the wrong MCP tool

I would troubleshoot the **tool-selection and MCP layer**:

1. **Check Worker task**

   * Did the Worker understand the required operation correctly?

2. **Check MCP tool definitions**

   * Are tool names, descriptions, parameters, and schemas accurate?
   * Example: `get_customer` vs `create_customer`.

3. **Check tool-selection logic**

   * Is the LLM choosing the tool?
   * Are there clear rules restricting which tools the Worker can call?

4. **Validate parameters**

   * Use **Pydantic/JSON Schema** to validate tool arguments before execution.

5. **Use allowlisting**

   * Worker should only have access to the MCP tools required for its role.

6. **Audit and trace**

   * Log: `Worker → selected tool → arguments → result`.
   * Use **Langfuse/App Insights** to identify incorrect tool selection.

### Interview answer

> **"I would verify the Worker task and then inspect the MCP tool definitions and selection logic. I would use strict schemas for tool arguments, role-based tool allowlists so a Worker can only access authorized tools, and validate the tool call before execution. I would also trace and audit every tool selection to identify and prevent incorrect calls."**
