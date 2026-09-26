### Why synchronous execution?

Use **synchronous execution** when the next step needs the current result immediately or the user expects an immediate response.

* Simple, short-running operations.
* Sequential dependencies between tasks.
* Immediate validation or decision-making.
* User-facing requests where latency is acceptable.

**Example in CWD:**

```text
Coordinator
    ↓
Delegator
    ↓
Worker → Salesforce
    ↓
Result
    ↓
Delegator continues
```

If the Delegator needs the Salesforce result before deciding what to do next, synchronous execution makes sense.

**Interview answer:**

> “We use synchronous execution when the next step depends immediately on the previous result or when the operation is short-running. For example, if a Delegator needs a Salesforce result before selecting the next Worker, we execute that call synchronously. For independent or long-running tasks, we use asynchronous execution.”
