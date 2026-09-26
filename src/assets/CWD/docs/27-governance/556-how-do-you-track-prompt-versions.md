### How do you track prompt versions?

Use a **Prompt Registry + version control + deployment metadata**.

1. **Create immutable versions**

   * `CustomerBriefingPrompt v1.0`
   * `v1.1` for changes
   * Never overwrite the production version.

2. **Track metadata**

   * Prompt version
   * Owner
   * Agent
   * Model version
   * Created/modified date
   * Change description

3. **Track evaluation results**

   * Accuracy
   * Groundedness
   * Hallucination
   * Token usage
   * Latency

4. **Track deployment**

   * Dev → Test → Staging → Production
   * Record which prompt version is currently active.

5. **Use approval**

   * New prompt version must pass evaluation and approval before production.

6. **Enable rollback**

   * If `v1.2` causes regression, switch back to `v1.1`.

### Interview answer

> **"I track prompts in a centralized Prompt Registry with immutable versions. Each version is linked to its agent, model version, owner, evaluation results, and deployment environment. Changes go through testing and approval before production, and we maintain the previous version so we can quickly roll back if the new prompt causes a regression."**
