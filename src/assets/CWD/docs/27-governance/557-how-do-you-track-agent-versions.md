### How do you track agent versions?

Use an **Agent Registry + Git/version control + deployment metadata**.

1. **Create immutable versions**

   * `Sales Delegator v1.0`
   * `v1.1` when capabilities or workflow logic changes.

2. **Track agent metadata**

   * Agent version
   * Owner
   * Purpose/capabilities
   * Model version
   * Prompt version
   * Allowed MCP tools
   * Dependencies

3. **Track code/configuration**

   * Store agent code and configuration in **Git**.
   * Tag each production release with a commit/release ID.

4. **Track evaluation**

   * Tool-selection accuracy
   * Task success rate
   * Safety
   * Latency
   * Cost

5. **Track deployment**

   ```text
   Agent v1.0
       ↓
   Test → Staging → Canary → Production
   ```

   Record which version is running in each environment.

6. **Rollback**

   * If the new version causes problems, deploy the previous approved version.

### Interview answer

> **"I track agent versions through an Agent Registry and Git. Each agent version is linked to its code version, prompt version, model version, allowed tools, configuration, evaluation results, and deployment environment. Production releases are tagged and deployed through controlled environments, with the previous approved version maintained for rollback."**
