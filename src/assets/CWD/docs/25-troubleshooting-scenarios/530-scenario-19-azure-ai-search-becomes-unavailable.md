### Scenario 19: Azure AI Search becomes unavailable

This is a **RAG dependency failure**.

1. **Detect failure**

   * Monitor Search API errors, timeouts, and latency using **Application Insights/Azure Monitor**.

2. **Retry carefully**

   * Use exponential backoff + jitter for transient failures.
   * Don't retry indefinitely.

3. **Use circuit breaker**

   * Temporarily stop sending requests if Search remains unavailable.

4. **Use fallback**

   * If available, route to a **secondary search/index** or another approved retrieval system.
   * Use cached results for safe/read-only scenarios.

5. **Fail safely**

   * If reliable retrieval isn't available, **don't ask the LLM to answer from unsupported knowledge**.
   * Return a controlled response such as "Knowledge retrieval is temporarily unavailable."

6. **Preserve workflow state**

   * Keep the `task_id/run_id` so the request can be resumed after Search recovers.

### Interview answer

> **"I would detect the Search outage through monitoring, apply retry with exponential backoff and a circuit breaker, and use a secondary index or cached results if available. If reliable retrieval isn't available, I would fail safely rather than allow the LLM to hallucinate an answer. I would preserve the workflow state so the request can resume once Azure AI Search recovers."**
