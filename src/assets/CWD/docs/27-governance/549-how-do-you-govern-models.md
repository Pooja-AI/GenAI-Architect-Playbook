### How do you govern models?

I would use **Model Registry + approval + evaluation + access control + monitoring**.

1. **Model Registry**

   * Maintain approved models, versions, owners, capabilities, and use cases.
   * Example: GPT-4o for complex reasoning, smaller model for simple tasks.

2. **Model approval**

   * Only approved models can be used in production.
   * Define which agents can use which models.

3. **Evaluation**

   * Before deployment, evaluate **accuracy, groundedness, hallucination, safety, latency, and cost**.

4. **Access control**

   * Control who/which agent can invoke each model.
   * Apply quotas and rate limits.

5. **Version management**

   * Track model version and configuration.
   * Test upgrades before production.

6. **Production monitoring**

   * Monitor quality, latency, token usage, errors, and cost.
   * Detect model regression.

7. **Rollback**

   * If a new model causes quality or reliability problems, route traffic back to the previously approved model.

### Interview answer

> **"I govern models through a Model Registry, approved model policies, access control, evaluation gates, version management, and production monitoring. Before a model reaches production, I evaluate quality, safety, latency, and cost. I use controlled rollout such as canary deployment, monitor the model in production, and maintain rollback to an approved version if regression occurs."**
