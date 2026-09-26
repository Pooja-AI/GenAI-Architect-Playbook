### Scenario 16: Prompt injection inside a retrieved document

This is an **indirect prompt injection** problem.

1. **Treat retrieved content as untrusted**

   * Documents are **data, not instructions**.
   * Never allow document text to override system/developer instructions.

2. **Separate instructions from context**

   * Clearly mark retrieved content as untrusted context.
   * Example: `<retrieved_context>...</retrieved_context>`.

3. **Detect suspicious content**

   * Look for instructions such as *"ignore previous instructions"* or requests to reveal secrets/call tools.

4. **Restrict tool access**

   * The LLM should not automatically execute tools based on instructions found in documents.
   * Use **tool allowlists and authorization checks**.

5. **Validate before sensitive actions**

   * Require deterministic policy checks and, for high-risk actions, **human approval**.

6. **Log and monitor**

   * Record the document, detection result, attempted tool call, and security decision.

### Interview answer

> **"I treat every retrieved document as untrusted data. I separate retrieved content from system instructions, apply prompt-injection detection, and never allow document instructions to authorize tool calls or override policies. MCP tools still perform independent authorization checks, and sensitive actions can require human approval. I also log injection attempts for monitoring and investigation."**
