### Scenario 11: Worker succeeds but Delegator doesn't receive the result

I would investigate the **Worker → Delegator communication path**:

1. **Check Worker response**

   * Did Worker actually return the result successfully?
   * Check status and payload.

2. **Check communication layer**

   * Is the result sent through **A2A / API / Service Bus** correctly?
   * Any network or connection failure?

3. **Check correlation ID**

   * Verify the response has the correct `task_id` / `run_id` / `correlation_id`.

4. **Check message delivery**

   * Was the message queued?
   * Was it consumed?
   * Check **retry and DLQ**.

5. **Check schema**

   * Did Delegator expect a different response format?
   * Validate using **Pydantic/JSON Schema**.

6. **Check timeout**

   * Worker completed, but Delegator may have timed out waiting.

### Interview answer

> **"I would trace the complete Worker-to-Delegator path using the correlation ID. I would verify the Worker response, A2A or messaging delivery, task ID, queue status, schema validation, and timeout. If Service Bus is involved, I would check retries and the DLQ. This helps identify whether the problem is communication, message delivery, schema mismatch, or timeout."**
