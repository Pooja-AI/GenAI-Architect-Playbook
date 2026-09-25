## How would you use smaller Bedrock models?

Main idea: **don't use an expensive model for a simple task.**

```text
Request
   ↓
Task Classifier
   ↓
 ┌──────────────┬───────────────┐
Simple         Complex
 ↓               ↓
Small model    Large model
 ↓               ↓
Fast/Cheap     Better reasoning
```

### In CWD

Use smaller models for:

* Intent classification
* Entity extraction
* Simple summarization
* Query rewriting
* Routing decisions
* Simple structured responses

Use larger models for:

* Complex reasoning
* Multi-step planning
* Difficult customer briefings
* Complex synthesis across multiple sources

### Interview answer

> “I use model routing in CWD. A lightweight classifier first determines the task complexity. Simple tasks such as intent classification and extraction go to smaller, lower-cost Bedrock models, while complex reasoning and synthesis go to larger models. This reduces both token cost and latency without sacrificing quality where it matters.”

**Memory:**
**Classify → Simple = Small Model → Complex = Large Model**
