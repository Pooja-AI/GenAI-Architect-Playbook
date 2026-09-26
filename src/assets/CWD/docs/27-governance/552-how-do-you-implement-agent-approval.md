### How do you implement agent approval?

Use an **Agent Registry + evaluation gate + security approval**.

1. **Register the agent**

   * Agent name/version
   * Owner
   * Purpose/capabilities
   * Allowed tools
   * Allowed model
   * Required permissions

2. **Evaluate**

   * Task accuracy
   * Tool-selection accuracy
   * Safety/guardrails
   * Reliability
   * Latency and cost

3. **Security review**

   * Identity and RBAC
   * Data access
   * MCP tool permissions
   * Prompt-injection protection

4. **Approval gate**

   * Only an authorized reviewer can approve the agent for production.

5. **Controlled deployment**

   ```text
   Develop
      ↓
   Test / Evaluation
      ↓
   Security Review
      ↓
   Approval
      ↓
   Staging
      ↓
   Canary
      ↓
   Production
   ```

6. **Continuous monitoring**

   * Monitor agent behavior, tool calls, failures, latency, cost, and policy violations.
   * Re-approval may be required for significant changes.

### Interview answer

> **"I implement agent approval through an Agent Registry and a formal evaluation and security gate. Each agent has an owner, defined capabilities, approved tools, model, and permissions. We evaluate its accuracy, safety, tool usage, reliability, latency, and cost before an authorized reviewer approves it for production. Any significant change goes through the approval process again."**
