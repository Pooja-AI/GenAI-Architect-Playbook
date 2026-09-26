### Scenario 13: Worker 1 and Worker 2 succeed, Worker 3 fails

I would handle this using **partial-failure handling**.

1. **Identify Worker 3 failure**

   * Check logs, error, timeout, or downstream API failure.

2. **Retry**

   * Retry Worker 3 with **exponential backoff + jitter** if the failure is transient.

3. **Don't rerun successful Workers**

   * Keep Worker 1 and Worker 2 results.
   * Retry only Worker 3 using the `task_id/run_id`.

4. **Check mandatory vs optional**

   * If Worker 3 is **optional**, continue with partial results.
   * If Worker 3 is **mandatory**, mark the overall task as incomplete and retry/escalate.

5. **Use DLQ**

   * After retry limit is exceeded, send the failed task to a **Dead-Letter Queue** for investigation/replay.

### Interview answer

> **"I would use partial-failure handling. I would preserve Worker 1 and Worker 2 results and retry only Worker 3 with exponential backoff and jitter. If Worker 3 is optional, the Delegator can continue with partial results and clearly indicate the missing information. If it's mandatory, I would mark the task incomplete and use DLQ or human intervention after retry limits are exhausted."**
