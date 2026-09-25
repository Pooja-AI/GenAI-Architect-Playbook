## How would you reduce Bedrock costs?

I would focus on **reducing unnecessary tokens and unnecessary LLM calls**.

```text
User Request
     ↓
Cache / Rules
     ↓
Task Classifier
   ↙       ↘
Simple    Complex
   ↓         ↓
Small      Large
Model      Model
   ↓         ↓
     Response
```

### Practical techniques

1. **Model routing** → small/cheaper model for simple tasks.
2. **Semantic caching** → reuse answers for similar questions.
3. **Reduce prompt size** → send only required context.
4. **Reduce RAG top-K** → don't send unnecessary documents to Bedrock.
5. **Summarize conversation history** → avoid sending full history.
6. **Set max output tokens** → prevent unnecessarily long responses.
7. **Remove redundant LLM calls** → use rules/code for deterministic tasks.
8. **Track token usage** → identify expensive Workers/workflows.

### Interview answer

> “I reduce Bedrock cost mainly by reducing LLM calls and token consumption. I use model routing, semantic caching, smaller RAG context, conversation summarization, output-token limits, and deterministic logic where possible. I also monitor token usage and cost per workflow and Worker to identify optimization opportunities.”

**Memory:**
**Fewer Calls → Smaller Context → Smaller Model → Fewer Tokens → Lower Cost**
