## Biggest cost driver in CWD

The **biggest cost driver is usually LLM/Bedrock usage**, especially **input and output token consumption**.

```text
User Request
     ↓
Coordinator
     ↓
Delegator
     ↓
Worker
     ↓
LLM / Bedrock  ← 💰 Major cost
     ↓
Response
```

### Why?

Cost increases when:

* Too many LLM calls per request
* Large prompts/context
* Large RAG results sent to the model
* Long conversation history
* Using expensive models for simple tasks
* Repeated/redundant queries

### How I reduce it

1. **Model routing** → small model for simple tasks, large model for complex tasks.
2. **Semantic/exact caching** → avoid repeated LLM calls.
3. **Reduce context** → retrieve only relevant chunks.
4. **Summarize conversation history**.
5. **Reduce unnecessary agent calls**.
6. **Set token/output limits**.
7. **Track tokens by Worker/workflow** using observability.

### Interview answer

> “The biggest variable cost driver in CWD is typically LLM usage, particularly input and output tokens. I control it through model routing, semantic caching, context reduction, token limits, and eliminating unnecessary LLM calls. I also track token consumption and cost per workflow and worker so we can identify expensive paths.”

**Memory:**
**LLM calls → Tokens → Context → Model → Cost**
