### Scenario 14: User submits the same request twice

This is an **idempotency + duplicate detection** problem.

1. **Generate an idempotency key**

   * Example: `user_id + normalized_request + time_window`
   * Better: client-generated `idempotency_key` for each submission.

2. **Check existing request**

   * Coordinator checks Redis/Cosmos DB before starting a new workflow.
   * If the request is already **running**, return the existing `task_id`.

3. **If already completed**

   * Return the previously stored result instead of executing again.

4. **Protect side-effect operations**

   * For actions like creating a Salesforce ticket, use an idempotency key so the operation isn't performed twice.

5. **Avoid relying only on exact text**

   * Normalize the request or use semantic similarity when appropriate.
   * Example:
     *"Give customer 123 details"* and *"Show me information for customer 123"* may represent the same intent.

### Interview answer

> **"I would use idempotency to prevent duplicate execution. The Coordinator checks an idempotency key or normalized request against Redis or Cosmos DB. If the same task is already running, I return the existing task ID; if it is completed, I return the stored result. For side-effect operations, I also enforce idempotency at the Worker or downstream API level."**
