### How do you track model versions?

Use a **Model Registry + immutable versioning + deployment metadata**.

1. **Register every model version**

   * Model name
   * Version
   * Provider
   * Model configuration
   * Owner
   * Approval status

2. **Track deployment**

   * Which agent uses it
   * Environment: dev/staging/prod
   * Deployment date
   * Traffic percentage

3. **Track configuration**

   * Temperature
   * Max tokens
   * System prompt version
   * Tool configuration
   * RAG configuration

4. **Track evaluation results**

   * Accuracy
   * Groundedness
   * Hallucination
   * Latency
   * Cost

5. **Use controlled rollout**

   ```text
   Model v1
      ↓
   Model v2 → Evaluation → Canary → Production
                           ↓
                        Rollback
   ```

6. **Maintain audit history**

   * Who approved it
   * When it was deployed
   * What changed
   * Previous production version

### Interview answer

> **"I track model versions in a centralized Model Registry. For each version, I record the provider, configuration, prompt version, agent dependencies, evaluation results, approval status, and deployment environment. I use controlled canary releases and maintain the previous approved version for rollback. This gives us complete traceability of which model version produced a particular response."**
