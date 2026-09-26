### Scenario 18: LLM provider becomes unavailable

This is a **resilience + fallback** scenario.

1. **Detect failure**

   * Monitor timeout, 5xx, connection failures, and provider health.
   * Use **circuit breaker** to stop repeatedly calling the unavailable provider.

2. **Use model/provider fallback**

   * Route requests to a secondary model/provider if available.
   * Example: **Azure OpenAI → another approved model/deployment**.

3. **Retry carefully**

   * For transient errors, use **exponential backoff + jitter**.
   * Don't retry indefinitely.

4. **Degrade gracefully**

   * For requests that don't require an LLM, continue using deterministic logic/cached results.
   * For requests that require the unavailable model, return a controlled message rather than producing unreliable output.

5. **Preserve request state**

   * Store `task_id/run_id` and workflow state so the request can resume after recovery.

6. **Monitor and alert**

   * Track provider availability, fallback rate, latency, error rate, and cost.

### Interview answer

> **"I would detect the provider failure through health and error monitoring, then open a circuit breaker to prevent repeated failures. For approved workloads, I would route to a fallback model or provider. I would use controlled retries for transient failures, preserve the workflow state, and gracefully degrade when no fallback is available. I would also monitor fallback usage and alert the operations team."**
