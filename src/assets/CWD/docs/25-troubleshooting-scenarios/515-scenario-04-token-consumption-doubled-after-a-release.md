### Scenario 4: Token consumption doubled after a release

I would compare the **new release vs previous version**:

1. **Prompt size**

   * Did the system prompt become larger?
   * Are we sending unnecessary context?

2. **Conversation history**

   * Are we sending the entire chat history instead of only relevant history?

3. **RAG context**

   * Did retrieved documents increase from, say, 5 → 15?
   * Are chunks too large?

4. **Number of LLM calls**

   * Did one request start making multiple LLM calls?
   * Are calls happening unnecessarily in loops?

5. **Model routing**

   * Did traffic move from a smaller model to a larger model?

6. **Check metrics**

   * Compare **input tokens, output tokens, tokens/request, and LLM calls/request** before and after release using Langfuse/Application Insights.

### Interview answer

> **"I would compare token metrics before and after the release and identify whether the increase comes from prompt size, RAG context, conversation history, output tokens, or an increase in LLM calls. Then I would reduce unnecessary context, optimize chunking, limit history, and verify model routing. I would also add token-per-request monitoring so future releases can detect this regression automatically."**
