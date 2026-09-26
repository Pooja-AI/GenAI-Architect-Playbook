### Scenario 20: Evaluation score drops after model upgrade

This is a **model regression** problem.

1. **Compare old vs new model**

   * Run the same production/evaluation dataset against both models.
   * Compare **groundedness, correctness, relevance, hallucination rate**.

2. **Check which metric dropped**

   * Don't look only at the overall score.
   * Identify whether retrieval, generation, safety, or formatting quality changed.

3. **Check prompts**

   * New model may interpret the existing system prompt differently.
   * Verify tool-calling and structured-output behavior.

4. **Check RAG behavior**

   * Confirm retrieval quality didn't change.
   * Compare retrieved documents between versions.

5. **Check model configuration**

   * Temperature, max tokens, model parameters, and routing.

6. **Rollback / canary**

   * If regression is significant, route traffic back to the previous model.
   * Use **canary deployment** for future upgrades.

### Interview answer

> **"I would first compare the old and new models on the same evaluation dataset and identify exactly which metrics regressed. Then I would check prompt compatibility, RAG retrieval, tool calling, output format, and model parameters. If the regression affects production quality, I would roll back or reduce traffic to the new model, investigate the root cause, and reintroduce it through a canary deployment only after evaluation passes."**
