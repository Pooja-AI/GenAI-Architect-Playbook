### How do you determine whether an agent actually completed the task?

Don't rely only on the **LLM's final response**. Use **objective completion criteria**.

* **Define success criteria** before execution.
* **Validate required outputs** against a schema.
* **Verify tool execution** — did the MCP call actually succeed?
* **Check downstream state** — was the record actually created/updated?
* **Validate business rules** — does the result satisfy the requirement?
* **Use deterministic checks** where possible.
* **Mark task status**: `SUCCESS`, `PARTIAL`, `FAILED`, or `NEEDS_HUMAN`.
* **Record evidence** in the execution trace.

```text
Agent says "Completed"
        ↓
Tool Result
        ↓
Schema Validation
        ↓
Business Validation
        ↓
Downstream Verification
        ↓
SUCCESS / PARTIAL / FAILED
```

**Interview answer:**

> “I don't consider an agent's statement that it completed a task as proof of completion. We define objective success criteria and verify the tool response, output schema, business rules, and downstream state where possible. Only after these checks pass do we mark the task as successful. Otherwise, we mark it partial, failed, or escalate it for human review.”
